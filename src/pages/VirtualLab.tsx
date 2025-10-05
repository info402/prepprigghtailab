import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Building2, Briefcase, Palette, Sparkles, Zap } from "lucide-react";

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
}

const VirtualLab = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "hi">("en");

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
      features: ["AI Projects", "Coding Challenges", "Live Code Review", "AR Debugging"]
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
      features: ["3D Simulations", "VR Assembly", "Robot Control", "Design Analysis"]
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
      features: ["VR Walkthrough", "3D Modeling", "Blueprint Review", "Material Selection"]
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
      features: ["Market Analysis", "Financial Models", "Pitch Simulations", "Strategy Games"]
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
      features: ["3D Design", "UI/UX Projects", "Brand Identity", "AR Prototypes"]
    }
  ];

  return (
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
                  <CardDescription className="text-base">
                    {language === "en" ? dept.description : dept.descriptionHindi}
                  </CardDescription>
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

        {/* AR/VR Experience Card */}
        <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {language === "en" ? "Full AR/VR Experience" : "पूर्ण AR/VR अनुभव"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Immerse yourself in virtual classrooms with Meta Quest support"
                    : "Meta Quest support के साथ virtual classrooms में खुद को डुबो दें"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-primary to-secondary">
                {language === "en" ? "Launch AR Mode" : "AR मोड लॉन्च करें"}
              </Button>
              <Button variant="outline" className="flex-1 border-primary/50">
                {language === "en" ? "VR Headset Setup" : "VR हेडसेट सेटअप"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VirtualLab;
