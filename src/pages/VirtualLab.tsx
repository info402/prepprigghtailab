import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Building2, Briefcase, Palette, Sparkles, Zap, Users, TrendingUp, Award } from "lucide-react";
import ARMentorExperience from "@/components/ARMentorExperience";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  nameHindi: string;
  icon: any;
  color: string;
  description: string;
  descriptionHindi: string;
  mentorName: string;
  features: string[];
  students: number;
  growth: string;
}

const VirtualLab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [showARDemo, setShowARDemo] = useState(false);

  const departments: Department[] = [
    {
      id: "ai-it",
      name: "AI & IT Lab",
      nameHindi: "AI और IT लैब",
      icon: Brain,
      color: "hsl(200 100% 60%)",
      description: "Master AI, ML, and Software Development with CodeGenius",
      descriptionHindi: "CodeGenius के साथ AI, ML और Software Development में महारत हासिल करें",
      mentorName: "CodeGenius",
      features: ["AI Projects", "Coding Challenges", "Live Code Review", "AR Debugging"],
      students: 15234,
      growth: "+45%"
    },
    {
      id: "mechanical",
      name: "Mechanical Lab",
      nameHindi: "मैकेनिकल लैब",
      icon: Cpu,
      color: "hsl(25 95% 60%)",
      description: "Experience 3D CAD, Robotics & Manufacturing with RoboMentor",
      descriptionHindi: "RoboMentor के साथ 3D CAD, Robotics और Manufacturing का अनुभव करें",
      mentorName: "RoboMentor",
      features: ["3D Simulations", "VR Assembly", "Robot Control", "Design Analysis"],
      students: 8945,
      growth: "+32%"
    },
    {
      id: "architecture",
      name: "Architecture Lab",
      nameHindi: "आर्किटेक्चर लैब",
      icon: Building2,
      color: "hsl(150 80% 55%)",
      description: "Design buildings in AR/VR with Arti3D",
      descriptionHindi: "Arti3D के साथ AR/VR में इमारतें डिज़ाइन करें",
      mentorName: "Arti3D",
      features: ["VR Walkthrough", "3D Modeling", "Blueprint Review", "Material Selection"],
      students: 6723,
      growth: "+28%"
    },
    {
      id: "business",
      name: "Business Lab",
      nameHindi: "बिजनेस लैब",
      icon: Briefcase,
      color: "hsl(45 100% 60%)",
      description: "Learn Business Strategy & Analytics with VisionCoach",
      descriptionHindi: "VisionCoach के साथ Business Strategy और Analytics सीखें",
      mentorName: "VisionCoach",
      features: ["Market Analysis", "Financial Models", "Pitch Simulations", "Strategy Games"],
      students: 12456,
      growth: "+52%"
    },
    {
      id: "design",
      name: "Design Lab",
      nameHindi: "डिज़ाइन लैब",
      icon: Palette,
      color: "hsl(330 85% 60%)",
      description: "Create stunning designs with CreateBot in immersive 3D",
      descriptionHindi: "CreateBot के साथ immersive 3D में शानदार डिज़ाइन बनाएं",
      mentorName: "CreateBot",
      features: ["3D Design", "UI/UX Projects", "Brand Identity", "AR Prototypes"],
      students: 10234,
      growth: "+38%"
    }
  ];

  return (
    <>
      {showARDemo && (
        <ARMentorExperience
          mentorName="AI Assistant"
          mentorColor="hsl(270 85% 55%)"
          departmentName={language === "en" ? "Virtual Lab Experience" : "वर्चुअल लैब अनुभव"}
          onClose={() => setShowARDemo(false)}
        />
      )}
      <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 border border-primary/30">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {language === "en" ? "Virtual Lab Experience" : "वर्चुअल लैब अनुभव"}
                </h1>
              </div>
              <Button
                variant="outline"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="border-primary/50 hover:bg-primary/10"
              >
                {language === "en" ? "हिंदी" : "English"}
              </Button>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {language === "en" 
                ? "Step into the future of education. Choose your department and start learning with AI-powered 3D mentors in immersive AR/VR environments."
                : "शिक्षा के भविष्य में कदम रखें। अपना विभाग चुनें और immersive AR/VR environments में AI-powered 3D mentors के साथ सीखना शुरू करें।"}
            </p>
          </div>
          <Zap className="absolute -right-10 -bottom-10 h-64 w-64 text-primary/5 rotate-12" />
        </div>

        {/* Department Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <Card
                key={dept.id}
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer bg-card/50 backdrop-blur-sm"
                onClick={() => navigate(`/dashboard/lab/${dept.id}`)}
                style={{
                  borderColor: `${dept.color}40`
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="p-3 rounded-xl transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${dept.color}20`,
                        color: dept.color
                      }}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                      {language === "en" ? "AI Mentor" : "AI मेंटर"}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2">
                    {language === "en" ? dept.name : dept.nameHindi}
                  </CardTitle>
                  <CardDescription className="text-base mb-3">
                    {language === "en" ? dept.description : dept.descriptionHindi}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{dept.students.toLocaleString()}</span>
                      <span>{language === "en" ? "students" : "छात्र"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-green-600 dark:text-green-500">{dept.growth}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-semibold" style={{ color: dept.color }}>
                        {dept.mentorName}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dept.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-primary/30">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      style={{
                        background: `linear-gradient(135deg, ${dept.color}, hsl(270 85% 55%))`
                      }}
                    >
                      {language === "en" ? "Enter Lab" : "लैब में प्रवेश करें"}
                    </Button>
                  </div>
                </CardContent>
                <div 
                  className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full opacity-20 blur-3xl transition-all group-hover:opacity-30"
                  style={{ backgroundColor: dept.color }}
                />
              </Card>
            );
          })}
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">53,000+</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Active Students" : "सक्रिय छात्र"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12,500+</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Certificates Issued" : "प्रमाणपत्र जारी"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Success Rate" : "सफलता दर"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "AI Mentors" : "AI मेंटर्स"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AR/VR Experience Card */}
        <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary animate-pulse">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {language === "en" ? "Revolutionary AR/VR Learning" : "क्रांतिकारी AR/VR सीखना"}
                </CardTitle>
                <CardDescription className="text-base">
                  {language === "en" 
                    ? "Experience the future of education with immersive virtual classrooms and AI-powered 3D mentors"
                    : "immersive virtual classrooms और AI-powered 3D mentors के साथ शिक्षा के भविष्य का अनुभव करें"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="font-semibold">{language === "en" ? "Meta Quest Ready" : "Meta Quest तैयार"}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Full VR headset support" : "पूर्ण VR हेडसेट समर्थन"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <p className="font-semibold">{language === "en" ? "Browser AR" : "ब्राउज़र AR"}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "No app installation needed" : "कोई ऐप इंस्टॉल की जरूरत नहीं"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <p className="font-semibold">{language === "en" ? "AI Powered" : "AI संचालित"}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Real-time voice guidance" : "रियल-टाइम वॉयस गाइडेंस"}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
                onClick={() => {
                  setShowARDemo(true);
                  toast({
                    title: language === "en" ? "🚀 AR Experience Launching" : "🚀 AR अनुभव शुरू हो रहा है",
                    description: language === "en" 
                      ? "Interact with the 3D AI mentor using your mouse!"
                      : "माउस का उपयोग करके 3D AI मेंटर के साथ इंटरैक्ट करें!",
                  });
                }}
              >
                <Zap className="h-5 w-5 mr-2" />
                {language === "en" ? "Launch AR Mode" : "AR मोड लॉन्च करें"}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-primary/50 text-lg py-6"
                onClick={() => {
                  toast({
                    title: language === "en" ? "📱 VR Setup" : "📱 VR सेटअप",
                    description: language === "en" 
                      ? "For full VR experience, use Meta Quest or compatible headset"
                      : "पूर्ण VR अनुभव के लिए, Meta Quest या संगत हेडसेट का उपयोग करें",
                  });
                }}
              >
                {language === "en" ? "VR Setup Guide" : "VR सेटअप गाइड"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </>
  );
};

export default VirtualLab;
