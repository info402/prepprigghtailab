import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Lightbulb,
  Rocket,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

const CareerTransformation = () => {
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateRoadmap = async () => {
    if (!background.trim()) {
      toast({
        title: "Background Required",
        description: "Please provide your background information",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-career-roadmap", {
        body: { background },
      });

      if (error) throw error;

      setRoadmap(data.roadmap);
      toast({
        title: "Roadmap Generated",
        description: "Your personalized career roadmap is ready!",
      });
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to generate career roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const transformationSteps = [
    {
      icon: Target,
      title: "Define Your Goals",
      description: "Set clear, achievable career objectives",
      color: "text-blue-500",
    },
    {
      icon: BookOpen,
      title: "Skill Development",
      description: "Learn the skills needed for your dream role",
      color: "text-green-500",
    },
    {
      icon: Rocket,
      title: "Build Projects",
      description: "Create portfolio projects to showcase your abilities",
      color: "text-purple-500",
    },
    {
      icon: Award,
      title: "Get Certified",
      description: "Earn industry-recognized certifications",
      color: "text-orange-500",
    },
  ];

  const skillCategories = [
    { name: "Technical Skills", progress: 65 },
    { name: "Soft Skills", progress: 80 },
    { name: "Domain Knowledge", progress: 50 },
    { name: "Leadership", progress: 45 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 p-8 border border-primary/30">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Career Transformation
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Transform your career with personalized guidance, skill development roadmaps, and
              expert mentorship. Your journey to success starts here.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roadmap" className="gap-2">
              <Target className="h-4 w-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Skills Assessment
            </TabsTrigger>
            <TabsTrigger value="journey" className="gap-2">
              <Rocket className="h-4 w-4" />
              Your Journey
            </TabsTrigger>
          </TabsList>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            <Card className="border-primary/30 bg-card/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Generate Your Personalized Roadmap
                </CardTitle>
                <CardDescription>
                  Share your background, goals, and current situation to receive a tailored career
                  transformation plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Tell us about yourself... (e.g., I'm a computer science student interested in web development, currently learning React and want to become a full-stack developer within 2 years)"
                  className="min-h-[150px] resize-none"
                />
                <Button
                  onClick={handleGenerateRoadmap}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating Your Roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Career Roadmap
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {roadmap && (
              <Card className="border-primary/30 bg-card/95 backdrop-blur-md animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Your Personalized Career Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {roadmap}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Skills Assessment Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {skillCategories.map((skill) => (
                <Card key={skill.name} className="border-primary/30 bg-card/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <CardDescription>Current proficiency level</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Progress value={skill.progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary">{skill.progress}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary/30 bg-card/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Recommended Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    System Design
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Cloud Computing
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Leadership Skills
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Communication
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Domain Expertise
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Journey Tab */}
          <TabsContent value="journey" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {transformationSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card
                    key={index}
                    className="border-primary/30 bg-card/95 backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader>
                      <Icon className={`h-8 w-8 ${step.color} mb-2`} />
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            <Card className="border-primary/30 bg-card/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Take the next step in your career transformation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate("/dashboard/challenges")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Practice Coding Challenges
                </Button>
                <Button
                  onClick={() => navigate("/dashboard/interview")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Take Mock Interview
                </Button>
                <Button
                  onClick={() => navigate("/dashboard/projects")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Build Real Projects
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CareerTransformation;
