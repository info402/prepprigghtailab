import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Cpu, Building2, Briefcase, Palette, Sparkles, Video, Code, Trophy, Target, Play, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DepartmentLab = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const departmentData: any = {
    "ai-it": {
      name: "AI & IT Lab",
      nameHindi: "AI और IT लैब",
      icon: Brain,
      color: "hsl(200 100% 60%)",
      mentorName: "CodeGenius",
      mentorAvatar: "https://api.readyplayer.me/v1/avatars/placeholder-ai.png",
      description: "Master cutting-edge AI, Machine Learning, and Software Development",
      descriptionHindi: "अत्याधुनिक AI, Machine Learning और Software Development में महारत हासिल करें"
    },
    "mechanical": {
      name: "Mechanical Lab",
      nameHindi: "मैकेनिकल लैब",
      icon: Cpu,
      color: "hsl(25 95% 60%)",
      mentorName: "RoboMentor",
      mentorAvatar: "https://api.readyplayer.me/v1/avatars/placeholder-mech.png",
      description: "Learn CAD, Robotics, and Manufacturing Engineering",
      descriptionHindi: "CAD, Robotics और Manufacturing Engineering सीखें"
    },
    "architecture": {
      name: "Architecture Lab",
      nameHindi: "आर्किटेक्चर लैब",
      icon: Building2,
      color: "hsl(150 80% 55%)",
      mentorName: "Arti3D",
      mentorAvatar: "https://api.readyplayer.me/v1/avatars/placeholder-arch.png",
      description: "Design and visualize architectural masterpieces",
      descriptionHindi: "स्थापत्य कृतियों को डिज़ाइन और visualize करें"
    },
    "business": {
      name: "Business Lab",
      nameHindi: "बिजनेस लैब",
      icon: Briefcase,
      color: "hsl(45 100% 60%)",
      mentorName: "VisionCoach",
      mentorAvatar: "https://api.readyplayer.me/v1/avatars/placeholder-biz.png",
      description: "Master Business Strategy, Analytics, and Leadership",
      descriptionHindi: "Business Strategy, Analytics और Leadership में महारत हासिल करें"
    },
    "design": {
      name: "Design Lab",
      nameHindi: "डिज़ाइन लैब",
      icon: Palette,
      color: "hsl(330 85% 60%)",
      mentorName: "CreateBot",
      mentorAvatar: "https://api.readyplayer.me/v1/avatars/placeholder-design.png",
      description: "Create stunning visual designs and user experiences",
      descriptionHindi: "शानदार visual designs और user experiences बनाएं"
    }
  };

  const dept = departmentData[departmentId || "ai-it"];
  const Icon = dept.icon;

  const projects = [
    {
      id: "1",
      title: language === "en" ? "AI Chatbot Builder" : "AI चैटबॉट बिल्डर",
      difficulty: "Medium",
      points: 500,
      company: "Google",
      duration: "2 weeks"
    },
    {
      id: "2",
      title: language === "en" ? "Data Analysis Dashboard" : "डेटा एनालिसिस डैशबोर्ड",
      difficulty: "Hard",
      points: 800,
      company: "Microsoft",
      duration: "3 weeks"
    },
    {
      id: "3",
      title: language === "en" ? "ML Model Deployment" : "ML मॉडल डिप्लॉयमेंट",
      difficulty: "Hard",
      points: 1000,
      company: "Amazon",
      duration: "4 weeks"
    }
  ];

  const launchARMentor = () => {
    toast({
      title: language === "en" ? "🚀 Launching AR Experience" : "🚀 AR अनुभव शुरू हो रहा है",
      description: language === "en" 
        ? `${dept.mentorName} will appear in your space. Please allow camera access.`
        : `${dept.mentorName} आपकी जगह में दिखाई देंगे। कृपया कैमरा एक्सेस की अनुमति दें।`,
    });
    // AR/VR integration logic will go here
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/lab")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "en" ? "Back to Labs" : "लैब्स पर वापस जाएं"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="border-primary/50"
          >
            {language === "en" ? "हिंदी" : "English"}
          </Button>
        </div>

        {/* Mentor Card */}
        <Card className="border-2 border-primary/50 bg-gradient-to-br from-card via-card to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4" style={{ borderColor: dept.color }}>
                    <AvatarImage src={dept.mentorAvatar} />
                    <AvatarFallback className="text-2xl font-bold">
                      {dept.mentorName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-green-500 rounded-full border-4 border-card animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8" style={{ color: dept.color }} />
                    <CardTitle className="text-3xl">
                      {language === "en" ? dept.name : dept.nameHindi}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    {language === "en" ? dept.description : dept.descriptionHindi}
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/20">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {dept.mentorName}
                    </Badge>
                    <Badge variant="outline" className="border-green-500/50 text-green-500">
                      {language === "en" ? "● Online" : "● ऑनलाइन"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button 
                size="lg"
                onClick={launchARMentor}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Play className="h-5 w-5" />
                {language === "en" ? "Launch AR Mentor" : "AR मेंटर लॉन्च करें"}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="projects">
              <Target className="h-4 w-4 mr-2" />
              {language === "en" ? "Projects" : "प्रोजेक्ट्स"}
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Code className="h-4 w-4 mr-2" />
              {language === "en" ? "Challenges" : "चैलेंज"}
            </TabsTrigger>
            <TabsTrigger value="competitions">
              <Trophy className="h-4 w-4 mr-2" />
              {language === "en" ? "Competitions" : "प्रतियोगिताएं"}
            </TabsTrigger>
            <TabsTrigger value="vr">
              <Video className="h-4 w-4 mr-2" />
              {language === "en" ? "VR Class" : "VR क्लास"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="hover:border-primary/50 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" style={{ borderColor: dept.color, color: dept.color }}>
                        {project.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        {project.points}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>
                      {project.company} • {project.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      {language === "en" ? "Start Project" : "प्रोजेक्ट शुरू करें"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Coding Challenges" : "कोडिंग चैलेंज"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Practice with Unstop & HackerRank style problems"
                    : "Unstop और HackerRank स्टाइल की समस्याओं के साथ अभ्यास करें"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/dashboard/challenges")}>
                  {language === "en" ? "View All Challenges" : "सभी चैलेंज देखें"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitions">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Live Competitions" : "लाइव प्रतियोगिताएं"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Compete with students nationwide"
                    : "देशभर के छात्रों के साथ प्रतिस्पर्धा करें"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/dashboard/competitions")}>
                  {language === "en" ? "View Competitions" : "प्रतियोगिताएं देखें"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vr">
            <Card className="border-2 border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-primary" />
                  {language === "en" ? "Virtual Reality Classroom" : "वर्चुअल रियलिटी क्लासरूम"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Experience immersive learning with VR headsets"
                    : "VR headsets के साथ immersive learning का अनुभव करें"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Video className="h-16 w-16 mx-auto text-primary" />
                    <p className="text-lg font-semibold">
                      {language === "en" ? "VR Classroom Preview" : "VR क्लासरूम पूर्वावलोकन"}
                    </p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary" size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  {language === "en" ? "Enter VR Classroom" : "VR क्लासरूम में प्रवेश करें"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentLab;
