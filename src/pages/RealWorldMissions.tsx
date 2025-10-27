import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Globe, 
  Users, 
  Zap,
  TrendingUp,
  Clock,
  Award,
  Target,
  Heart,
  Leaf,
  Lightbulb,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Mission {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xp: number;
  duration: string;
  participants: number;
  description: string;
  skills: string[];
  impact: string;
  icon: any;
}

const missions: Mission[] = [
  {
    id: "1",
    title: "Build a Climate Action Tracker",
    category: "Sustainability",
    difficulty: "Intermediate",
    xp: 750,
    duration: "2-3 weeks",
    participants: 234,
    description: "Create a web app that helps users track their carbon footprint and suggests eco-friendly alternatives.",
    skills: ["React", "Data Visualization", "API Integration"],
    impact: "Help 1000+ users reduce carbon emissions",
    icon: Leaf
  },
  {
    id: "2",
    title: "AI-Powered Mental Health Chatbot",
    category: "Healthcare",
    difficulty: "Advanced",
    xp: 1000,
    duration: "3-4 weeks",
    participants: 156,
    description: "Build an empathetic chatbot using AI to provide mental health support and resources.",
    skills: ["Python", "NLP", "OpenAI API"],
    impact: "Support mental wellness for students",
    icon: Heart
  },
  {
    id: "3",
    title: "Local Business Discovery App",
    category: "Community",
    difficulty: "Beginner",
    xp: 500,
    duration: "1-2 weeks",
    participants: 389,
    description: "Create a platform to help people discover and support local businesses in their area.",
    skills: ["React", "Maps API", "Firebase"],
    impact: "Boost local economies",
    icon: Globe
  },
  {
    id: "4",
    title: "Education Resource Platform",
    category: "Education",
    difficulty: "Intermediate",
    xp: 800,
    duration: "2-3 weeks",
    participants: 512,
    description: "Build a platform where students can share and access free educational resources.",
    skills: ["Full Stack", "Database Design", "UX Design"],
    impact: "Help 10,000+ students learn",
    icon: BookOpen
  },
  {
    id: "5",
    title: "Smart Energy Monitor",
    category: "Technology",
    difficulty: "Advanced",
    xp: 1200,
    duration: "4-5 weeks",
    participants: 98,
    description: "Develop an IoT solution to monitor and optimize home energy consumption.",
    skills: ["IoT", "Python", "Data Analytics"],
    impact: "Reduce energy waste by 30%",
    icon: Zap
  },
  {
    id: "6",
    title: "Youth Innovation Hub Website",
    category: "Community",
    difficulty: "Beginner",
    xp: 450,
    duration: "1 week",
    participants: 621,
    description: "Create a website to showcase youth-led innovation projects and connect young innovators.",
    skills: ["HTML/CSS", "JavaScript", "Responsive Design"],
    impact: "Connect 5000+ young innovators",
    icon: Lightbulb
  }
];

const RealWorldMissions = () => {
  const { toast } = useToast();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleStartMission = (mission: Mission) => {
    setSelectedMission(mission);
    toast({
      title: "Mission Accepted! 🚀",
      description: `You've started: ${mission.title}`,
    });
  };

  const MissionCard = ({ mission }: { mission: Mission }) => {
    const Icon = mission.icon;
    
    return (
      <Card className="p-6 glass-card hover:border-primary/50 transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {mission.title}
              </h3>
              <p className="text-sm text-muted-foreground">{mission.category}</p>
            </div>
          </div>
          <Badge className={
            mission.difficulty === "Beginner" ? "bg-secondary/20 text-secondary" :
            mission.difficulty === "Intermediate" ? "bg-accent/20 text-accent" :
            "bg-primary/20 text-primary"
          }>
            {mission.difficulty}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-4">{mission.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {mission.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 p-3 rounded-lg bg-muted/50 border border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Award className="h-4 w-4" />
              <span className="text-sm font-bold">{mission.xp}</span>
            </div>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-secondary mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-bold">{mission.duration}</span>
            </div>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm font-bold">{mission.participants}</span>
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Real-World Impact:</span>
          </div>
          <p className="text-sm text-muted-foreground">{mission.impact}</p>
        </div>

        <Button 
          onClick={() => handleStartMission(mission)}
          className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
        >
          Start This Mission
          <Rocket className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    );
  };

  return (
    <DashboardLayout
      title="Real-World Missions"
      description="Work on global problems, earn XP, build your career proof"
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="p-8 glass-card bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 rounded-2xl bg-primary/20 shadow-glow">
              <Globe className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Build Real Solutions for Real Problems</h2>
              <p className="text-muted-foreground">
                Choose missions aligned with UN Sustainable Development Goals, startup ideas, and societal challenges.
                Earn XP, build your portfolio, and make a difference.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-background/50 border border-border">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">2,450</p>
              <p className="text-sm text-muted-foreground">Total XP Available</p>
            </div>
          </div>
        </Card>

        {/* Missions Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All Missions</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="active">My Active</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="beginner" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.filter(m => m.difficulty === "Beginner").map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="intermediate" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.filter(m => m.difficulty === "Intermediate").map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.filter(m => m.difficulty === "Advanced").map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {selectedMission ? (
              <Card className="p-8 glass-card text-center">
                <Rocket className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Mission In Progress</h3>
                <p className="text-muted-foreground mb-4">
                  You're currently working on: <span className="font-semibold">{selectedMission.title}</span>
                </p>
                <Button variant="outline">View Mission Details</Button>
              </Card>
            ) : (
              <Card className="p-8 glass-card text-center">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Active Missions</h3>
                <p className="text-muted-foreground mb-4">
                  Start a mission to begin building real-world projects and earning XP!
                </p>
                <Button onClick={() => toast({ title: "Choose a mission from the All Missions tab" })}>
                  Browse Missions
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RealWorldMissions;
