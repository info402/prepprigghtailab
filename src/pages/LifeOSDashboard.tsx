import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  Rocket, 
  TrendingUp, 
  Award,
  Users,
  BookOpen,
  Zap,
  CircleDot
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PurposeProfile {
  interests: string;
  career_goals: string;
  learning_style: string;
  skill_level: string;
}

const LifeOSDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<PurposeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('purpose_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, redirect to Purpose Engine
          toast({
            title: "Welcome! 👋",
            description: "Let's discover your purpose first.",
          });
          navigate("/dashboard/purpose");
          return;
        }
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="LifeOS" description="Your Personal Operating System">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading your LifeOS...</div>
        </div>
      </DashboardLayout>
    );
  }

  const purposeScore = 75; // Calculate based on profile completion
  const readinessScore = 68; // Calculate based on skills & projects

  return (
    <DashboardLayout
      title="LifeOS Dashboard"
      description="Your central hub for growth, skills, and career readiness"
    >
      <div className="space-y-6">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 glass-card border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purpose Score</p>
                  <p className="text-3xl font-bold">{purposeScore}%</p>
                </div>
              </div>
            </div>
            <Progress value={purposeScore} className="h-2" />
          </Card>

          <Card className="p-6 glass-card border-secondary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-secondary/20">
                  <Rocket className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Career Readiness</p>
                  <p className="text-3xl font-bold">{readinessScore}%</p>
                </div>
              </div>
            </div>
            <Progress value={readinessScore} className="h-2" />
          </Card>

          <Card className="p-6 glass-card border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/20">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Missions</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/dashboard/missions")}
              className="w-full mt-2 bg-gradient-primary hover:opacity-90"
            >
              View Missions
            </Button>
          </Card>
        </div>

        {/* Skill Graph */}
        <Card className="p-6 glass-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Skill Graph</h2>
                <p className="text-sm text-muted-foreground">Visual map of your learned skills</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/dashboard/meta-profile")}
              variant="outline"
            >
              View Full Profile
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Web Development", level: 65, color: "primary" },
              { name: "AI & ML", level: 45, color: "secondary" },
              { name: "Problem Solving", level: 80, color: "accent" },
              { name: "Communication", level: 70, color: "primary" },
            ].map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {skill.level}%
                  </Badge>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Active Goals & Missions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-secondary/20">
                <CircleDot className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Current Goals</h3>
                <p className="text-sm text-muted-foreground">Your active learning objectives</p>
              </div>
            </div>

            <div className="space-y-4">
              {profile && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium mb-2">Career Goal</p>
                  <p className="text-sm text-muted-foreground">{profile.career_goals}</p>
                </div>
              )}
              
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Complete 5 Coding Challenges</p>
                  <Badge>3/5</Badge>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Build Portfolio Project</p>
                  <Badge>In Progress</Badge>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-accent/20">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Mentor Connections</h3>
                <p className="text-sm text-muted-foreground">Your learning network</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div className="flex-1">
                  <p className="font-medium">AI Career Mentor</p>
                  <p className="text-xs text-muted-foreground">Available 24/7</p>
                </div>
                <Button size="sm" variant="outline">Chat</Button>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({
                  title: "Coming Soon! 🚀",
                  description: "Human mentor matching is launching next month.",
                })}
              >
                <Users className="mr-2 h-4 w-4" />
                Connect with Human Mentors
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 glass-card">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col"
              onClick={() => navigate("/dashboard/missions")}
            >
              <Rocket className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm">Start Mission</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col"
              onClick={() => navigate("/dashboard/challenges")}
            >
              <BookOpen className="h-6 w-6 mb-2 text-secondary" />
              <span className="text-sm">Learn Skills</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col"
              onClick={() => navigate("/dashboard/projects")}
            >
              <Award className="h-6 w-6 mb-2 text-accent" />
              <span className="text-sm">Build Project</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col"
              onClick={() => navigate("/dashboard/leaderboard")}
            >
              <TrendingUp className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm">Track Progress</span>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LifeOSDashboard;
