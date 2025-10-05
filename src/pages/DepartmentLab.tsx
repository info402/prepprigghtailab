import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Brain, Cpu, Building2, Briefcase, Palette, Sparkles, Video, Code, Trophy, Target, Play, ArrowLeft, Zap, Star, Users, Clock, Award, Layers, Rocket } from "lucide-react";
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

  const [userProgress, setUserProgress] = useState({
    level: 5,
    xp: 2350,
    nextLevelXp: 3000,
    completedProjects: 8,
    skillPoints: 450
  });

  const projects = [
    {
      id: "1",
      title: language === "en" ? "AI Chatbot Builder" : "AI चैटबॉट बिल्डर",
      difficulty: "Medium",
      points: 500,
      company: "Google",
      duration: "2 weeks",
      students: 1234,
      completion: 65,
      skills: ["Python", "NLP", "TensorFlow"]
    },
    {
      id: "2",
      title: language === "en" ? "Data Analysis Dashboard" : "डेटा एनालिसिस डैशबोर्ड",
      difficulty: "Hard",
      points: 800,
      company: "Microsoft",
      duration: "3 weeks",
      students: 892,
      completion: 45,
      skills: ["React", "D3.js", "SQL"]
    },
    {
      id: "3",
      title: language === "en" ? "ML Model Deployment" : "ML मॉडल डिप्लॉयमेंट",
      difficulty: "Hard",
      points: 1000,
      company: "Amazon",
      duration: "4 weeks",
      students: 567,
      completion: 32,
      skills: ["AWS", "Docker", "Python"]
    },
    {
      id: "4",
      title: language === "en" ? "Real-time Chat System" : "रियल-टाइम चैट सिस्टम",
      difficulty: "Medium",
      points: 600,
      company: "Meta",
      duration: "2 weeks",
      students: 1567,
      completion: 78,
      skills: ["WebSocket", "Node.js", "Redis"]
    },
    {
      id: "5",
      title: language === "en" ? "AR Shopping Experience" : "AR शॉपिंग अनुभव",
      difficulty: "Hard",
      points: 1200,
      company: "Flipkart",
      duration: "5 weeks",
      students: 423,
      completion: 28,
      skills: ["Three.js", "AR.js", "React"]
    },
    {
      id: "6",
      title: language === "en" ? "Blockchain Wallet" : "ब्लॉकचेन वॉलेट",
      difficulty: "Hard",
      points: 1500,
      company: "Coinbase",
      duration: "6 weeks",
      students: 289,
      completion: 15,
      skills: ["Solidity", "Web3", "React"]
    }
  ];

  const launchARMentor = async () => {
    // Auto-enable camera and media without permission dialogs
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      toast({
        title: language === "en" ? "🚀 AR Mentor Activated" : "🚀 AR मेंटर सक्रिय",
        description: language === "en" 
          ? `${dept.mentorName} is now in your space. Start learning!`
          : `${dept.mentorName} अब आपकी जगह में हैं। सीखना शुरू करें!`,
      });
      // AR/VR integration logic will go here
    } catch (error) {
      // Silently handle - no alerts
      console.log("Media access:", error);
    }
  };

  useEffect(() => {
    // Auto-enable permissions on load
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/lab")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "en" ? "Back to Labs" : "लैब्स पर वापस जाएं"}
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{userProgress.xp} XP</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-semibold">{language === "en" ? "Level" : "स्तर"} {userProgress.level}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="border-primary/50"
            >
              {language === "en" ? "हिंदी" : "English"}
            </Button>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl mb-1">
                  {language === "en" ? "Your Learning Journey" : "आपकी सीखने की यात्रा"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? `${userProgress.completedProjects} projects completed • ${userProgress.skillPoints} skill points earned`
                    : `${userProgress.completedProjects} प्रोजेक्ट पूर्ण • ${userProgress.skillPoints} कौशल अंक अर्जित`}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary px-4 py-2 text-lg">
                <Rocket className="h-4 w-4 mr-2" />
                {Math.round((userProgress.xp / userProgress.nextLevelXp) * 100)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{language === "en" ? "Progress to Level" : "स्तर तक प्रगति"} {userProgress.level + 1}</span>
                <span>{userProgress.xp} / {userProgress.nextLevelXp} XP</span>
              </div>
              <Progress value={(userProgress.xp / userProgress.nextLevelXp) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {projects.map((project) => (
                <Card key={project.id} className="group hover:border-primary/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-primary/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" style={{ borderColor: dept.color, color: dept.color }} className="font-semibold">
                        {project.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-yellow-600 dark:text-yellow-500">{project.points} XP</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{project.title}</CardTitle>
                    <CardDescription className="text-base mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4" style={{ color: dept.color }} />
                        <span className="font-semibold">{project.company}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {project.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {project.students} students
                        </div>
                      </div>
                    </CardDescription>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{language === "en" ? "Completion Rate" : "पूर्णता दर"}</span>
                        <span>{project.completion}%</span>
                      </div>
                      <Progress value={project.completion} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 group-hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${dept.color}, hsl(270 85% 55%))`
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {language === "en" ? "Start Project" : "प्रोजेक्ट शुरू करें"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Code className="h-5 w-5 text-green-500" />
                    </div>
                    <Badge variant="outline" className="border-green-500/50 text-green-500">Easy</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {language === "en" ? "Daily Coding Problems" : "दैनिक कोडिंग समस्याएं"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" ? "250+ problems • DSA focused" : "250+ समस्याएं • DSA केंद्रित"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-green-500/50" onClick={() => navigate("/dashboard/challenges")}>
                    {language === "en" ? "Start Solving" : "हल करना शुरू करें"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-yellow-500" />
                    </div>
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">Medium</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {language === "en" ? "Company-Specific Tests" : "कंपनी-विशिष्ट टेस्ट"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" ? "Real interview patterns" : "वास्तविक इंटरव्यू पैटर्न"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-yellow-500/50" onClick={() => navigate("/dashboard/challenges")}>
                    {language === "en" ? "Practice Now" : "अभी अभ्यास करें"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-red-500" />
                    </div>
                    <Badge variant="outline" className="border-red-500/50 text-red-500">Hard</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {language === "en" ? "Advanced Algorithms" : "उन्नत एल्गोरिदम"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" ? "System design & optimization" : "सिस्टम डिज़ाइन और अनुकूलन"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-red-500/50" onClick={() => navigate("/dashboard/challenges")}>
                    {language === "en" ? "Take Challenge" : "चुनौती लें"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>
                      {language === "en" ? "Live Code Editor with AI Assistant" : "AI सहायक के साथ लाइव कोड एडिटर"}
                    </CardTitle>
                    <CardDescription>
                      {language === "en" 
                        ? "Write, test, and debug code with real-time AI mentorship"
                        : "रियल-टाइम AI मेंटरशिप के साथ कोड लिखें, टेस्ट करें और डिबग करें"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="bg-gradient-to-r from-primary to-secondary" onClick={() => navigate("/dashboard/challenges")}>
                  <Play className="h-4 w-4 mr-2" />
                  {language === "en" ? "Open Code Editor" : "कोड एडिटर खोलें"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Zap className="h-3 w-3 mr-1" />
                      {language === "en" ? "LIVE NOW" : "लाइव अभी"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 dark:text-yellow-500">
                      <Trophy className="h-4 w-4" />
                      ₹50,000
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {language === "en" ? "National Coding Championship" : "राष्ट्रीय कोडिंग चैंपियनशिप"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {language === "en" 
                      ? "5000+ participants • Sponsored by TCS"
                      : "5000+ प्रतिभागी • TCS द्वारा प्रायोजित"}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span className="text-red-500 font-semibold">
                      {language === "en" ? "Ends in 2h 34m" : "2घ 34मि में समाप्त"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90">
                    <Play className="h-4 w-4 mr-2" />
                    {language === "en" ? "Join Competition" : "प्रतियोगिता में शामिल हों"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-500">
                      {language === "en" ? "Upcoming" : "आगामी"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 dark:text-yellow-500">
                      <Trophy className="h-4 w-4" />
                      ₹1,00,000
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {language === "en" ? "AI Innovation Hackathon" : "AI इनोवेशन हैकाथॉन"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {language === "en" 
                      ? "Build next-gen AI products • Google Sponsors"
                      : "अगली पीढ़ी के AI उत्पाद बनाएं • Google प्रायोजक"}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-semibold">
                      {language === "en" ? "Starts: Dec 15, 2025" : "शुरू: 15 दिसंबर, 2025"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-purple-500/50">
                    {language === "en" ? "Register Now" : "अभी पंजीकरण करें"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-green-500/50 text-green-500">
                      {language === "en" ? "Weekly" : "साप्ताहिक"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 dark:text-yellow-500">
                      <Trophy className="h-4 w-4" />
                      ₹10,000
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {language === "en" ? "Speed Coding Challenge" : "स्पीड कोडिंग चैलेंज"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {language === "en" 
                      ? "Solve 10 problems in 60 minutes"
                      : "60 मिनट में 10 समस्याओं को हल करें"}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-semibold">
                      {language === "en" ? "2,345 registered" : "2,345 पंजीकृत"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-green-500/50">
                    {language === "en" ? "View Details" : "विवरण देखें"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-orange-500/50 text-orange-500">
                      {language === "en" ? "Team Event" : "टीम इवेंट"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 dark:text-yellow-500">
                      <Trophy className="h-4 w-4" />
                      ₹2,00,000
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {language === "en" ? "Startup Building Competition" : "स्टार्टअप बिल्डिंग प्रतियोगिता"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {language === "en" 
                      ? "48-hour product development sprint"
                      : "48 घंटे का उत्पाद विकास स्प्रिंट"}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-semibold">
                      {language === "en" ? "3-5 members per team" : "प्रति टीम 3-5 सदस्य"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-orange-500/50" onClick={() => navigate("/dashboard/competitions")}>
                    {language === "en" ? "Form Team" : "टीम बनाएं"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vr" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/5">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {language === "en" ? "LIVE" : "लाइव"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {language === "en" ? "Immersive VR Classroom" : "इमर्सिव VR क्लासरूम"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {language === "en" 
                      ? "Join 3D virtual classroom with AI mentor"
                      : "AI मेंटर के साथ 3D वर्चुअल क्लासरूम में शामिल हों"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        {language === "en" ? "Students Online" : "छात्र ऑनलाइन"}
                      </span>
                      <span className="font-bold">234 live</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {language === "en" ? "AI Mentor" : "AI मेंटर"}
                      </span>
                      <span className="font-bold" style={{ color: dept.color }}>{dept.mentorName}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary" size="lg" onClick={launchARMentor}>
                    <Play className="h-5 w-5 mr-2" />
                    {language === "en" ? "Enter VR Classroom" : "VR क्लासरूम में प्रवेश करें"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-500">
                      {language === "en" ? "3D Lab" : "3D लैब"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {language === "en" ? "AR Project Workspace" : "AR प्रोजेक्ट वर्कस्पेस"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {language === "en" 
                      ? "Build and test in augmented reality"
                      : "ऑगमेंटेड रियलिटी में बनाएं और परीक्षण करें"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10" />
                    <div className="relative z-10 text-center space-y-3">
                      <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                        <Layers className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {language === "en" ? "Interactive 3D Environment" : "इंटरैक्टिव 3D वातावरण"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-purple-500/50" onClick={launchARMentor}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {language === "en" ? "Launch AR Mode" : "AR मोड लॉन्च करें"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Rocket className="h-6 w-6 text-primary" />
                  {language === "en" ? "VR Equipment & Setup" : "VR उपकरण और सेटअप"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Compatible with Meta Quest, HTC Vive, and browser-based AR"
                    : "Meta Quest, HTC Vive और ब्राउज़र-आधारित AR के साथ संगत"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                    <Video className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-semibold">Meta Quest</p>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "Supported" : "समर्थित"}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-semibold">Browser AR</p>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "No Setup" : "सेटअप नहीं"}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                    <Layers className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-semibold">Mobile AR</p>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "Phone Only" : "फोन केवल"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentLab;
