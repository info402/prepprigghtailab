import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Trophy, Gift, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  prize_details: string;
  status: string;
  host_id: string;
}

const StudentEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch all events
      const { data: allEvents, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch user's hosted events
      if (user) {
        const hosted = (allEvents || []).filter((e) => e.host_id === user.id);
        setMyEvents(hosted);

        // Fetch joined events
        const { data: participants, error: participantsError } = await supabase
          .from("event_participants")
          .select("event_id")
          .eq("user_id", user.id);

        if (!participantsError && participants) {
          setJoinedEvents(new Set(participants.map((p) => p.event_id)));
        }
      }

      setEvents(allEvents || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to join events",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("event_participants").insert({
        event_id: eventId,
        user_id: user.id,
      });

      if (error) throw error;

      setJoinedEvents((prev) => new Set([...prev, eventId]));
      toast({
        title: "Success!",
        description: "You've joined the event",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: <Badge className="bg-blue-500/10 text-blue-500">Upcoming</Badge>,
      active: <Badge className="bg-green-500/10 text-green-500">Active</Badge>,
      completed: <Badge className="bg-gray-500/10 text-gray-500">Completed</Badge>,
    };
    return badges[status as keyof typeof badges];
  };

  const renderEventCard = (event: Event) => (
    <Card 
      key={event.id} 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/dashboard/student-events/${event.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {event.description || "No description provided"}
            </CardDescription>
          </div>
          {getStatusBadge(event.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{event.event_type}</Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.start_time), "MMM dd, yyyy 'at' hh:mm a")}</span>
          </div>
          {event.max_participants && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Max {event.max_participants} participants</span>
            </div>
          )}
          {event.prize_details && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <Trophy className="h-4 w-4 mt-0.5" />
              <span className="text-primary font-semibold">{event.prize_details}</span>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleJoinEvent(event.id);
          }}
          disabled={joinedEvents.has(event.id) || event.status === "completed"}
        >
          {joinedEvents.has(event.id)
            ? "Joined"
            : event.status === "completed"
            ? "Ended"
            : "Join Event"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Events</h1>
            <p className="text-muted-foreground mt-2">
              Join quizzes, competitions, and win vouchers
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/host-event")}>
            <Plus className="h-4 w-4 mr-2" />
            Host Event
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-48 bg-muted"></CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="my-events">My Hosted Events</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map(renderEventCard)}
              </div>
              {events.length === 0 && (
                <Card className="p-12 text-center">
                  <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events available</h3>
                  <p className="text-muted-foreground">
                    Be the first to host an event!
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="my-events" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myEvents.map(renderEventCard)}
              </div>
              {myEvents.length === 0 && (
                <Card className="p-12 text-center">
                  <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hosted events yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first event and engage with students
                  </p>
                  <Button onClick={() => navigate("/dashboard/host-event")}>
                    Host an Event
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentEvents;
