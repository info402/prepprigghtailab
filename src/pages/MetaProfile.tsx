import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Award, 
  TrendingUp, 
  Share2, 
  Download,
  Star,
  CheckCircle2,
  Code,
  Briefcase,
  GraduationCap,
  Trophy
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MetaProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUserName(user.email?.split('@')[0] || "Student");
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    toast({
      title: "Profile Link Copied! 📋",
      description: "Share your Meta-Profile with recruiters and mentors.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Resume... 📄",
      description: "Your dynamic resume is being generated.",
    });
  };

  const skillRank = 1250; // Example rank
  const readinessScore = 78;

  return (
    <DashboardLayout
      title="Meta-Profile"
      description="Your dynamic, evolving career passport"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="p-8 glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 blur-3xl rounded-full" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{userName}</h1>
                <p className="text-muted-foreground mb-3">Full Stack Developer in Training</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Trophy className="h-3 w-3 mr-1" />
                    Rank #{skillRank}
                  </Badge>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                    <Star className="h-3 w-3 mr-1" />
                    {readinessScore}% Ready
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
              <Button onClick={handleExport} className="bg-gradient-primary hover:opacity-90">
                <Download className="mr-2 h-4 w-4" />
                Export Resume
              </Button>
            </div>
          </div>

          {/* Readiness Score */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-semibold">Industry Readiness Score</span>
              </div>
              <span className="text-2xl font-bold">{readinessScore}%</span>
            </div>
            <Progress value={readinessScore} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on skills, projects, and real-world experience
            </p>
          </div>
        </Card>

        {/* Profile Sections */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="skills">
              <Code className="h-4 w-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Briefcase className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="endorsements">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Endorsements
            </TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card className="p-6 glass-card">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Technical Skills
              </h3>
              <div className="space-y-4">
                {[
                  { name: "React & TypeScript", level: 85, verified: true },
                  { name: "Node.js & Express", level: 70, verified: true },
                  { name: "Python & Data Science", level: 60, verified: false },
                  { name: "SQL & Database Design", level: 75, verified: true },
                  { name: "UI/UX Design", level: 65, verified: false },
                ].map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        {skill.verified && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <Badge variant="secondary">{skill.level}%</Badge>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-secondary" />
                Soft Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Communication",
                  "Team Leadership",
                  "Problem Solving",
                  "Time Management",
                  "Critical Thinking",
                  "Adaptability"
                ].map((skill) => (
                  <div 
                    key={skill}
                    className="p-4 rounded-lg bg-muted/50 border border-border text-center font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {[
              {
                title: "E-commerce Platform",
                description: "Built a full-stack e-commerce site with React, Node.js & PostgreSQL",
                tech: ["React", "Node.js", "PostgreSQL"],
                status: "Completed",
                xp: 500
              },
              {
                title: "AI Chatbot Integration",
                description: "Integrated OpenAI API to create a customer support chatbot",
                tech: ["Python", "OpenAI", "Flask"],
                status: "In Progress",
                xp: 350
              },
              {
                title: "Task Management App",
                description: "Real-time collaborative task manager with WebSockets",
                tech: ["React", "Socket.io", "MongoDB"],
                status: "Completed",
                xp: 400
              }
            ].map((project, index) => (
              <Card key={index} className="p-6 glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className={project.status === "Completed" ? "bg-secondary/20 text-secondary" : "bg-accent/20 text-accent"}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">Earned {project.xp} XP</span>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "First Project Complete", icon: "🎯", date: "2 weeks ago" },
                { title: "10 Challenges Solved", icon: "💪", date: "1 month ago" },
                { title: "Mentor Recognition", icon: "⭐", date: "3 weeks ago" },
                { title: "Coding Streak: 30 days", icon: "🔥", date: "Ongoing" },
              ].map((achievement, index) => (
                <Card key={index} className="p-6 glass-card">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.date}</p>
                    </div>
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Endorsements Tab */}
          <TabsContent value="endorsements" className="space-y-4">
            {[
              {
                from: "AI Mentor",
                skill: "Problem Solving",
                message: "Excellent analytical thinking and debugging skills demonstrated.",
                date: "2 days ago"
              },
              {
                from: "Project Reviewer",
                skill: "Full Stack Development",
                message: "Clean code structure and great attention to detail in the e-commerce project.",
                date: "1 week ago"
              }
            ].map((endorsement, index) => (
              <Card key={index} className="p-6 glass-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {endorsement.from.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold">{endorsement.from}</span>
                      <Badge variant="secondary">{endorsement.skill}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{endorsement.message}</p>
                    <p className="text-xs text-muted-foreground">{endorsement.date}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MetaProfile;
