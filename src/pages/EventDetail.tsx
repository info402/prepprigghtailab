import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Trophy, Gift, Video, ArrowLeft, Crown, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
  meeting_link: string | null;
}

interface Participant {
  id: string;
  user_id: string;
  score: number;
  rank: number;
  joined_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface EventVoucher {
  rank_requirement: number;
  quantity: number;
  vouchers: {
    title: string;
    code: string;
    discount_type: string;
    discount_value: string;
    company_name: string;
  };
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [eventVouchers, setEventVouchers] = useState<EventVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      fetchParticipants();
      fetchEventVouchers();
      checkIfJoined();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", id)
        .order("rank", { ascending: true, nullsFirst: false });

      if (error) throw error;

      // Fetch profile data for each participant
      const participantsWithProfiles = await Promise.all(
        (data || []).map(async (participant) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", participant.user_id)
            .single();

          return {
            ...participant,
            profiles: profile || { full_name: "Anonymous", email: "" },
          };
        })
      );

      setParticipants(participantsWithProfiles);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const fetchEventVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from("event_vouchers")
        .select(`
          *,
          vouchers (
            title,
            code,
            discount_type,
            discount_value,
            company_name
          )
        `)
        .eq("event_id", id)
        .order("rank_requirement", { ascending: true });

      if (error) throw error;
      setEventVouchers(data || []);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const checkIfJoined = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("event_participants")
        .select("id")
        .eq("event_id", id)
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setHasJoined(true);
      }
    } catch (error) {
      console.error("Error checking participation:", error);
    }
  };

  const handleJoin = async () => {
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
        event_id: id,
        user_id: user.id,
      });

      if (error) throw error;

      setHasJoined(true);
      toast({
        title: "Success!",
        description: "You've joined the event",
      });
      fetchParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card className="animate-pulse">
          <CardHeader className="h-64 bg-muted"></CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">Event not found</h3>
          <Button onClick={() => navigate("/dashboard/student-events")}>
            Back to Events
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard/student-events")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                <CardDescription className="text-base">
                  {event.description || "No description provided"}
                </CardDescription>
              </div>
              <Badge className="capitalize">{event.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                  <p className="font-medium">
                    {format(new Date(event.start_time), "MMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">End Time</p>
                  <p className="font-medium">
                    {format(new Date(event.end_time), "MMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="font-medium">
                    {participants.length}
                    {event.max_participants && ` / ${event.max_participants}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="capitalize">{event.event_type}</Badge>
              </div>
            </div>

            {event.meeting_link && (
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                <Video className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Meeting Link</p>
                  <a
                    href={event.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {event.meeting_link}
                  </a>
                </div>
              </div>
            )}

            {!hasJoined && event.status !== "completed" && (
              <Button onClick={handleJoin} size="lg" className="w-full">
                Join Event
              </Button>
            )}
          </CardContent>
        </Card>

        {event.prize_details && eventVouchers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Prizes & Vouchers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Prize Details:</p>
                <p className="text-sm text-muted-foreground">{event.prize_details}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Available Vouchers:</h4>
                {eventVouchers.map((ev, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {ev.rank_requirement === 1 ? (
                        <Crown className="h-5 w-5 text-yellow-500" />
                      ) : ev.rank_requirement === 2 ? (
                        <Award className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Award className="h-5 w-5 text-orange-600" />
                      )}
                      <div>
                        <p className="font-medium">{ev.vouchers.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {ev.vouchers.company_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-primary font-bold">
                        {ev.vouchers.discount_type === "percentage"
                          ? `${ev.vouchers.discount_value}% OFF`
                          : ev.vouchers.discount_type === "fixed"
                          ? `₹${ev.vouchers.discount_value} OFF`
                          : ev.vouchers.discount_value}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rank #{ev.rank_requirement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Participants ({participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No participants yet. Be the first to join!
              </p>
            ) : (
              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {participant.rank && participant.rank <= 3 && (
                        <div className="flex items-center justify-center w-8 h-8">
                          {participant.rank === 1 ? (
                            <Crown className="h-6 w-6 text-yellow-500" />
                          ) : participant.rank === 2 ? (
                            <Award className="h-6 w-6 text-gray-400" />
                          ) : (
                            <Award className="h-6 w-6 text-orange-600" />
                          )}
                        </div>
                      )}
                      <Avatar>
                        <AvatarFallback>
                          {participant.profiles?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {participant.profiles?.full_name || "Anonymous"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Joined {format(new Date(participant.joined_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {participant.rank && (
                        <Badge variant="outline">Rank #{participant.rank}</Badge>
                      )}
                      {participant.score > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Score: {participant.score}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EventDetail;
