import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Cloud, Server, Database, Network, HardDrive, 
  Cpu, Globe, Lock, Terminal, Play, Trash2,
  CheckCircle2, AlertCircle, Settings, Container,
  Zap, Shield, Activity, Plus
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CloudResource {
  id: string;
  name: string;
  type: string;
  status: "running" | "stopped" | "pending";
  provider: "aws" | "azure" | "gcp";
  region: string;
  cost: string;
}

const CloudLab = () => {
  const [activeProvider, setActiveProvider] = useState<"aws" | "azure" | "gcp">("aws");
  const [resources, setResources] = useState<CloudResource[]>([
    {
      id: "1",
      name: "web-server-prod",
      type: "EC2 Instance",
      status: "running",
      provider: "aws",
      region: "us-east-1",
      cost: "$0.10/hr"
    },
    {
      id: "2",
      name: "database-primary",
      type: "RDS Database",
      status: "running",
      provider: "aws",
      region: "us-east-1",
      cost: "$0.25/hr"
    }
  ]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to CloudLAB Terminal",
    "Type 'help' for available commands",
    ""
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [scenario, setScenario] = useState<string | null>(null);
  const { toast } = useToast();

  const providers = {
    aws: { name: "Amazon Web Services", color: "text-orange-500", icon: "☁️" },
    azure: { name: "Microsoft Azure", color: "text-blue-500", icon: "🔷" },
    gcp: { name: "Google Cloud Platform", color: "text-green-500", icon: "🌐" }
  };

  const scenarios = [
    {
      id: "web-app",
      title: "Deploy Web Application",
      description: "Deploy a scalable web application with load balancing and auto-scaling",
      difficulty: "Beginner",
      duration: "30 mins",
      steps: [
        "Create EC2/VM instance",
        "Configure security groups",
        "Set up load balancer",
        "Enable auto-scaling"
      ]
    },
    {
      id: "database",
      title: "Database Setup & Migration",
      description: "Set up a managed database service and perform data migration",
      difficulty: "Intermediate",
      duration: "45 mins",
      steps: [
        "Create RDS/SQL Database",
        "Configure backup policies",
        "Set up read replicas",
        "Perform migration"
      ]
    },
    {
      id: "microservices",
      title: "Microservices Architecture",
      description: "Deploy containerized microservices using Kubernetes",
      difficulty: "Advanced",
      duration: "90 mins",
      steps: [
        "Create Kubernetes cluster",
        "Deploy container registry",
        "Configure service mesh",
        "Set up monitoring"
      ]
    },
    {
      id: "serverless",
      title: "Serverless Application",
      description: "Build a serverless application with functions and API gateway",
      difficulty: "Intermediate",
      duration: "60 mins",
      steps: [
        "Create Lambda/Function",
        "Set up API Gateway",
        "Configure triggers",
        "Add monitoring"
      ]
    }
  ];

  const handleTerminalCommand = () => {
    const cmd = terminalInput.trim().toLowerCase();
    const newOutput = [...terminalOutput, `$ ${terminalInput}`];

    if (cmd === "help") {
      newOutput.push(
        "Available commands:",
        "  list - List all resources",
        "  create <type> <name> - Create a new resource",
        "  start <resource-id> - Start a resource",
        "  stop <resource-id> - Stop a resource",
        "  delete <resource-id> - Delete a resource",
        "  status - Show account status",
        "  clear - Clear terminal",
        ""
      );
    } else if (cmd === "list") {
      newOutput.push(`Found ${resources.length} resources:`);
      resources.forEach(r => {
        newOutput.push(`  ${r.id}: ${r.name} (${r.type}) - ${r.status}`);
      });
      newOutput.push("");
    } else if (cmd.startsWith("create")) {
      const parts = cmd.split(" ");
      if (parts.length >= 3) {
        const newResource: CloudResource = {
          id: String(resources.length + 1),
          name: parts.slice(2).join("-"),
          type: parts[1].toUpperCase(),
          status: "pending",
          provider: activeProvider,
          region: "us-east-1",
          cost: "$0.05/hr"
        };
        setResources([...resources, newResource]);
        newOutput.push(`Creating ${parts[1]} instance: ${newResource.name}`);
        newOutput.push("Status: Pending...");
        setTimeout(() => {
          setResources(prev => prev.map(r => 
            r.id === newResource.id ? { ...r, status: "running" } : r
          ));
        }, 2000);
      } else {
        newOutput.push("Usage: create <type> <name>");
      }
      newOutput.push("");
    } else if (cmd === "status") {
      newOutput.push("Account Status:");
      newOutput.push(`  Provider: ${providers[activeProvider].name}`);
      newOutput.push(`  Resources: ${resources.length}`);
      newOutput.push(`  Running: ${resources.filter(r => r.status === "running").length}`);
      newOutput.push(`  Estimated Cost: $${(resources.length * 0.15).toFixed(2)}/hr`);
      newOutput.push("");
    } else if (cmd === "clear") {
      setTerminalOutput(["Terminal cleared", ""]);
      setTerminalInput("");
      return;
    } else if (cmd === "") {
      // Just add empty line
    } else {
      newOutput.push(`Command not found: ${cmd}`);
      newOutput.push("Type 'help' for available commands");
      newOutput.push("");
    }

    setTerminalOutput(newOutput);
    setTerminalInput("");
  };

  const handleResourceAction = (resourceId: string, action: "start" | "stop" | "delete") => {
    if (action === "delete") {
      setResources(resources.filter(r => r.id !== resourceId));
      toast({
        title: "Resource deleted",
        description: "The resource has been terminated",
      });
    } else {
      setResources(resources.map(r => 
        r.id === resourceId ? { ...r, status: action === "start" ? "running" : "stopped" } : r
      ));
      toast({
        title: `Resource ${action === "start" ? "started" : "stopped"}`,
        description: `The resource is now ${action === "start" ? "running" : "stopped"}`,
      });
    }
  };

  const handleStartScenario = (scenarioId: string) => {
    setScenario(scenarioId);
    toast({
      title: "Scenario started! 🚀",
      description: "Follow the steps to complete this challenge",
    });
  };

  const currentScenario = scenarios.find(s => s.id === scenario);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
                CloudLAB ☁️
              </h1>
              <p className="text-muted-foreground">
                Practice cloud infrastructure deployment across AWS, Azure, and GCP
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Activity className="h-4 w-4 mr-2" />
                {resources.filter(r => r.status === "running").length} Running
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Simulation Mode
              </Badge>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Select Cloud Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(providers) as Array<keyof typeof providers>).map((key) => (
                <Button
                  key={key}
                  variant={activeProvider === key ? "default" : "outline"}
                  className="h-20 text-lg"
                  onClick={() => setActiveProvider(key)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">{providers[key].icon}</span>
                    <span>{providers[key].name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4 mt-6">
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Cloud Resources
                  </CardTitle>
                  <Button onClick={() => {
                    const newResource: CloudResource = {
                      id: String(resources.length + 1),
                      name: `resource-${resources.length + 1}`,
                      type: "EC2 Instance",
                      status: "pending",
                      provider: activeProvider,
                      region: "us-east-1",
                      cost: "$0.08/hr"
                    };
                    setResources([...resources, newResource]);
                    setTimeout(() => {
                      setResources(prev => prev.map(r => 
                        r.id === newResource.id ? { ...r, status: "running" } : r
                      ));
                    }, 1500);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Resource
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <Card key={resource.id} className="border-primary/20">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`p-3 rounded-lg ${
                              resource.status === "running" ? "bg-green-500/10" :
                              resource.status === "stopped" ? "bg-red-500/10" : "bg-yellow-500/10"
                            }`}>
                              {resource.type.includes("Database") ? (
                                <Database className="h-6 w-6" />
                              ) : resource.type.includes("Container") ? (
                                <Container className="h-6 w-6" />
                              ) : (
                                <Server className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{resource.name}</h4>
                                <Badge variant={
                                  resource.status === "running" ? "default" :
                                  resource.status === "stopped" ? "destructive" : "secondary"
                                }>
                                  {resource.status === "running" ? (
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                  ) : resource.status === "pending" ? (
                                    <Activity className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {resource.status}
                                </Badge>
                              </div>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <span>{resource.type}</span>
                                <span>•</span>
                                <span>{resource.region}</span>
                                <span>•</span>
                                <span className="font-semibold text-foreground">{resource.cost}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {resource.status === "stopped" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResourceAction(resource.id, "start")}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {resource.status === "running" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResourceAction(resource.id, "stop")}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleResourceAction(resource.id, "delete")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {resources.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No resources created yet</p>
                      <p className="text-sm">Click "Create Resource" to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terminal Tab */}
          <TabsContent value="terminal" className="space-y-4 mt-6">
            <Card className="border-primary/30 bg-black/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Terminal className="h-5 w-5" />
                  Cloud CLI Terminal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border border-green-500/30 bg-black p-4">
                  <div className="font-mono text-sm text-green-400 space-y-1">
                    {terminalOutput.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2 mt-4">
                  <span className="text-green-400 font-mono">$</span>
                  <Input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTerminalCommand();
                    }}
                    placeholder="Type a command... (try 'help')"
                    className="font-mono bg-black border-green-500/30 text-green-400"
                  />
                  <Button 
                    onClick={handleTerminalCommand}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Run
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-4 mt-6">
            {currentScenario && (
              <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Active Scenario: {currentScenario.title}</CardTitle>
                    <Button variant="outline" onClick={() => setScenario(null)}>
                      Exit Scenario
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{currentScenario.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Steps to Complete:</h4>
                      {currentScenario.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    <Progress value={(0 / currentScenario.steps.length) * 100} />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((s) => (
                <Card key={s.id} className="border-primary/30 hover:border-primary transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{s.title}</CardTitle>
                      <Badge variant="outline">{s.difficulty}</Badge>
                    </div>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        {s.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        {s.steps.length} steps
                      </span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleStartScenario(s.id)}
                      disabled={scenario === s.id}
                    >
                      {scenario === s.id ? "In Progress" : "Start Scenario"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-4 mt-6">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Infrastructure Architecture
                </CardTitle>
                <CardDescription>
                  Visual representation of your cloud infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center gap-8 mb-8">
                      <div className="space-y-2">
                        <div className="w-24 h-24 rounded-lg bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                          <Globe className="h-12 w-12 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">Internet</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 h-1 bg-primary"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-24 h-24 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center">
                          <Shield className="h-12 w-12 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Load Balancer</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-8">
                      {resources.slice(0, 3).map((resource, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="w-20 h-20 rounded-lg bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                            <Server className="h-10 w-10 text-green-500" />
                          </div>
                          <p className="text-xs font-medium">{resource.name}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-muted-foreground mt-8">
                      Deploy resources to see your infrastructure diagram
                    </p>
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

export default CloudLab;