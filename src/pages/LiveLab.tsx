import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cloud, Code2, Shield, Cpu, Server, Box, 
  Waypoints, Calculator, MessageSquare, Play,
  Zap, Globe, Lock, Terminal
} from "lucide-react";

const LiveLab = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const labs = [
    {
      id: "cloud",
      name: "CloudLAB",
      icon: Cloud,
      color: "text-blue-500",
      description: "Practice cloud infrastructure, deployment, and DevOps in a real cloud environment",
      features: ["AWS/Azure/GCP Simulation", "Docker & Kubernetes", "CI/CD Pipelines", "Serverless Computing"],
      difficulty: "Intermediate",
      duration: "2-4 hours",
    },
    {
      id: "cyber",
      name: "CyberRange",
      icon: Shield,
      color: "text-red-500",
      description: "Hands-on cybersecurity training with real-world attack and defense scenarios",
      features: ["Network Security", "Penetration Testing", "Incident Response", "Vulnerability Analysis"],
      difficulty: "Advanced",
      duration: "3-6 hours",
    },
    {
      id: "code",
      name: "CodeLAB",
      icon: Code2,
      color: "text-green-500",
      description: "Interactive coding environment with real-time preview and collaboration",
      features: ["Multiple Languages", "Live Preview", "Code Sharing", "AI Code Assistant"],
      difficulty: "Beginner",
      duration: "1-3 hours",
    },
    {
      id: "hardware",
      name: "HardwareSIM",
      icon: Cpu,
      color: "text-purple-500",
      description: "Virtual hardware simulation for embedded systems and IoT development",
      features: ["Arduino Simulation", "IoT Protocols", "Circuit Design", "Sensor Integration"],
      difficulty: "Intermediate",
      duration: "2-5 hours",
    },
    {
      id: "software",
      name: "SoftwareSIM",
      icon: Server,
      color: "text-orange-500",
      description: "Software architecture and system design simulation environment",
      features: ["Microservices", "API Design", "Database Modeling", "Architecture Patterns"],
      difficulty: "Advanced",
      duration: "3-8 hours",
    },
    {
      id: "scenario",
      name: "ScenarioSIM",
      icon: Waypoints,
      color: "text-indigo-500",
      description: "Real-world business and technical scenario simulations",
      features: ["Problem Solving", "Decision Making", "Crisis Management", "Team Collaboration"],
      difficulty: "Intermediate",
      duration: "2-4 hours",
    },
    {
      id: "maths",
      name: "MathsLAB",
      icon: Calculator,
      color: "text-teal-500",
      description: "Interactive mathematics learning with visualizations and problem-solving",
      features: ["Algebra & Calculus", "Statistics", "Linear Algebra", "Data Science Math"],
      difficulty: "Beginner",
      duration: "1-3 hours",
    },
    {
      id: "smartchat",
      name: "SmartChat",
      icon: MessageSquare,
      color: "text-pink-500",
      description: "AI-powered learning assistant with contextual help and guidance",
      features: ["24/7 AI Support", "Code Help", "Concept Explanation", "Learning Roadmaps"],
      difficulty: "Beginner",
      duration: "On-demand",
    },
  ];

  const comingSoonLabs = labs.slice(0, 8);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                Live Learning Labs 🚀
              </h1>
              <p className="text-muted-foreground">
                Immersive, hands-on learning environments for real-world skills
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              8 Labs Available
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="labs">All Labs</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Hero Section */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-purple-500/10 to-accent/10">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-4 mb-6">
                    <Cloud className="h-12 w-12 text-blue-500" />
                    <Shield className="h-12 w-12 text-red-500" />
                    <Code2 className="h-12 w-12 text-green-500" />
                    <Cpu className="h-12 w-12 text-purple-500" />
                  </div>
                  <h2 className="text-3xl font-bold">Learn by Doing, Not Just Reading</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our Live Labs provide hands-on, interactive learning environments where you can practice 
                    real-world skills in safe, simulated scenarios. From cloud infrastructure to cybersecurity, 
                    from coding to hardware simulation - we have got it all.
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button size="lg" onClick={() => setActiveTab("labs")}>
                      <Play className="h-5 w-5 mr-2" />
                      Explore Labs
                    </Button>
                    <Button size="lg" variant="outline">
                      <Terminal className="h-5 w-5 mr-2" />
                      Quick Start Guide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/30">
                <CardHeader>
                  <Globe className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Real-World Scenarios</CardTitle>
                  <CardDescription>
                    Practice with realistic projects and challenges you will face in your career
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-primary/30">
                <CardHeader>
                  <Zap className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Instant Feedback</CardTitle>
                  <CardDescription>
                    Get real-time feedback and guidance as you work through challenges
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-primary/30">
                <CardHeader>
                  <Lock className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Safe Environment</CardTitle>
                  <CardDescription>
                    Experiment freely without worrying about breaking anything
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="labs" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {comingSoonLabs.map((lab) => {
                const Icon = lab.icon;
                return (
                  <Card key={lab.id} className="border-primary/30 hover:border-primary transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Icon className={`h-10 w-10 ${lab.color}`} />
                        <Badge variant="outline">{lab.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{lab.name}</CardTitle>
                      <CardDescription className="line-clamp-2 min-h-[40px]">
                        {lab.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Key Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {lab.features.slice(0, 3).map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {lab.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{lab.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Duration: {lab.duration}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        variant={lab.id === "code" || lab.id === "cloud" || lab.id === "cyber" || lab.id === "hardware" ? "default" : "outline"}
                        onClick={() => {
                          if (lab.id === "code") navigate("/dashboard/projects");
                          if (lab.id === "cloud") navigate("/dashboard/cloudlab");
                          if (lab.id === "cyber") navigate("/dashboard/cyberrange");
                          if (lab.id === "hardware") navigate("/dashboard/hardwaresim");
                        }}
                      >
                        {lab.id === "code" || lab.id === "cloud" || lab.id === "cyber" || lab.id === "hardware" ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Launch Lab
                          </>
                        ) : (
                          <>Coming Soon</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[labs[2], labs[0], labs[1]].map((lab) => {
                const Icon = lab.icon;
                return (
                  <Card key={lab.id} className="border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Icon className={`h-12 w-12 ${lab.color}`} />
                        <Badge variant="default">Popular</Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{lab.name}</CardTitle>
                      <CardDescription>
                        {lab.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">What you will learn:</p>
                        <ul className="space-y-1">
                          {lab.features.map((feature, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => {
                          if (lab.id === "code") navigate("/dashboard/projects");
                          if (lab.id === "cloud") navigate("/dashboard/cloudlab");
                          if (lab.id === "cyber") navigate("/dashboard/cyberrange");
                          if (lab.id === "hardware") navigate("/dashboard/hardwaresim");
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {lab.id === "code" || lab.id === "cloud" || lab.id === "cyber" || lab.id === "hardware" ? "Start Learning" : "Coming Soon"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Start Your Learning Journey?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose any lab above and start practicing. Our AI mentor is available 24/7 to help you succeed.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" variant="default">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Talk to SmartChat AI
                </Button>
                <Button size="lg" variant="outline">
                  View Learning Paths
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LiveLab;