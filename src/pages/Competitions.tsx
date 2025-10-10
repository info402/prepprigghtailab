import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, Users, DollarSign, ExternalLink, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Competition {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  prize_pool: string;
  max_participants: number;
  status: "upcoming" | "active" | "completed";
  source_url?: string;
  isExternal?: boolean;
}

const Competitions = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [externalCompetitions, setExternalCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinedCompetitions, setJoinedCompetitions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchCompetitions();
    fetchExternalCompetitions();
    fetchUserParticipations();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      setCompetitions((data || []) as Competition[]);
    } catch (error) {
      console.error("Error fetching competitions:", error);
      toast({
        title: "Error",
        description: "Failed to load competitions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExternalCompetitions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-competitions');
      
      if (error) throw error;
      
      if (data?.competitions) {
        setExternalCompetitions(data.competitions.map((comp: any) => ({
          ...comp,
          isExternal: true
        })));
      }
    } catch (error) {
      console.error("Error fetching external competitions:", error);
    }
  };

  const fetchUserParticipations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("competition_participants")
        .select("competition_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setJoinedCompetitions(new Set(data?.map((p) => p.competition_id) || []));
    } catch (error) {
      console.error("Error fetching participations:", error);
    }
  };

  const handleJoinCompetition = async (competitionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to join competitions",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("competition_participants").insert({
        competition_id: competitionId,
        user_id: user.id,
      });

      if (error) throw error;

      setJoinedCompetitions((prev) => new Set([...prev, competitionId]));
      toast({
        title: "Success!",
        description: "You've joined the competition",
      });
    } catch (error: any) {
      console.error("Error joining competition:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to join competition",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Upcoming</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500">Active</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500">Completed</Badge>;
      default:
        return null;
    }
  };

  const renderCompetitionCard = (competition: Competition) => (
    <Card key={competition.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{competition.title}</CardTitle>
              {competition.isExternal && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {competition.description}
            </CardDescription>
          </div>
          {getStatusBadge(competition.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(competition.start_date), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{competition.max_participants} spots</span>
          </div>
          {competition.prize_pool && (
            <div className="flex items-center gap-2 col-span-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-primary">
                {competition.prize_pool}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {competition.isExternal && competition.source_url ? (
            <Button
              className="flex-1"
              onClick={() => window.open(competition.source_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Competition
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={() => handleJoinCompetition(competition.id)}
              disabled={
                joinedCompetitions.has(competition.id) ||
                competition.status === "completed"
              }
            >
              {joinedCompetitions.has(competition.id)
                ? "Joined"
                : competition.status === "completed"
                ? "Ended"
                : "Join Competition"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Competitions & Hackathons</h1>
            <p className="text-muted-foreground mt-2">
              Join competitions and compete with developers worldwide
            </p>
          </div>
          <Trophy className="h-8 w-8 text-primary" />
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-48 bg-muted"></CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="global">
                <Sparkles className="h-4 w-4 mr-1" />
                Global
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[...externalCompetitions, ...competitions].map(renderCompetitionCard)}
              </div>
              {externalCompetitions.length === 0 && competitions.length === 0 && (
                <Card className="p-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No competitions available</h3>
                  <p className="text-muted-foreground">
                    Check back later for exciting competitions and hackathons.
                  </p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="platform" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {competitions.map(renderCompetitionCard)}
              </div>
              {competitions.length === 0 && (
                <Card className="p-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No platform competitions</h3>
                  <p className="text-muted-foreground">
                    Platform competitions will appear here.
                  </p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="global" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {externalCompetitions.map(renderCompetitionCard)}
              </div>
              {externalCompetitions.length === 0 && (
                <Card className="p-12 text-center">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Loading global events...</h3>
                  <p className="text-muted-foreground">
                    Fetching competitions from Google, GitHub, Meta, and more.
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Competitions;
