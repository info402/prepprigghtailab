import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Trophy, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  points: number;
  tags: string[];
}

const CodingChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("coding_challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChallenges((data || []) as Challenge[]);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChallenges = challenges.filter((challenge) =>
    filter === "all" ? true : challenge.difficulty === filter
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Coding Challenges</h1>
            <p className="text-muted-foreground mt-2">
              Practice coding problems and improve your skills
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Code className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="flex gap-2">
          {["all", "easy", "medium", "hard"].map((level) => (
            <Button
              key={level}
              variant={filter === level ? "default" : "outline"}
              onClick={() => setFilter(level)}
              className="capitalize"
            >
              {level}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-muted"></CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/challenges/${challenge.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {challenge.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(challenge.difficulty)}
                    >
                      {challenge.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span>{challenge.points} pts</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {challenge.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredChallenges.length === 0 && (
          <Card className="p-12 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new challenges.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CodingChallenges;
