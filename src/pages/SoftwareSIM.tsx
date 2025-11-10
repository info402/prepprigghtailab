import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Server, Database, Globe, Boxes, Network,
  GitBranch, Lock, Zap, MessageSquare, Share2, Layers,
  Code, FileJson, Download, Plus, Trash2, Settings,
  Play, Box, Cloud, Shield, Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArchitectureComponent {
  id: string;
  type: "microservice" | "database" | "api-gateway" | "load-balancer" | "cache" | "queue" | "frontend";
  x: number;
  y: number;
  label: string;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  type: "http" | "grpc" | "event" | "database";
}

interface APIEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
}

const SoftwareSIM = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [components, setComponents] = useState<ArchitectureComponent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([
    {
      id: "1",
      method: "GET",
      path: "/api/users",
      description: "Get all users",
      responseBody: '{\n  "users": [\n    {\n      "id": "1",\n      "name": "John Doe"\n    }\n  ]\n}'
    }
  ]);

  const [newEndpoint, setNewEndpoint] = useState<Partial<APIEndpoint>>({
    method: "GET",
    path: "",
    description: ""
  });

  const componentLibrary = [
    { type: "microservice", icon: Server, label: "Microservice", color: "#3b82f6" },
    { type: "database", icon: Database, label: "Database", color: "#10b981" },
    { type: "api-gateway", icon: Globe, label: "API Gateway", color: "#f59e0b" },
    { type: "load-balancer", icon: Share2, label: "Load Balancer", color: "#8b5cf6" },
    { type: "cache", icon: Zap, label: "Cache", color: "#ef4444" },
    { type: "queue", icon: MessageSquare, label: "Message Queue", color: "#ec4899" },
    { type: "frontend", icon: Box, label: "Frontend", color: "#14b8a6" },
  ];

  const patterns = [
    {
      id: "microservices",
      name: "Microservices Architecture",
      description: "Distributed system with independent services",
      icon: Boxes,
      components: ["API Gateway", "Auth Service", "User Service", "Order Service", "Database"]
    },
    {
      id: "event-driven",
      name: "Event-Driven Architecture",
      description: "Services communicate via events and message queues",
      icon: GitBranch,
      components: ["Event Bus", "Producers", "Consumers", "Event Store"]
    },
    {
      id: "layered",
      name: "Layered Architecture",
      description: "Traditional three-tier architecture pattern",
      icon: Layers,
      components: ["Presentation Layer", "Business Layer", "Data Layer"]
    },
    {
      id: "cqrs",
      name: "CQRS Pattern",
      description: "Separate read and write operations",
      icon: GitBranch,
      components: ["Command Service", "Query Service", "Event Store", "Read DB", "Write DB"]
    },
    {
      id: "serverless",
      name: "Serverless Architecture",
      description: "Function-as-a-Service based architecture",
      icon: Cloud,
      components: ["API Gateway", "Lambda Functions", "DynamoDB", "S3"]
    },
    {
      id: "service-mesh",
      name: "Service Mesh",
      description: "Infrastructure layer for service-to-service communication",
      icon: Network,
      components: ["Sidecar Proxies", "Control Plane", "Data Plane", "Services"]
    }
  ];

  const dbModels = [
    {
      name: "users",
      fields: [
        { name: "id", type: "UUID", primary: true },
        { name: "email", type: "VARCHAR(255)", unique: true },
        { name: "name", type: "VARCHAR(100)" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "orders",
      fields: [
        { name: "id", type: "UUID", primary: true },
        { name: "user_id", type: "UUID", foreign: "users.id" },
        { name: "total", type: "DECIMAL(10,2)" },
        { name: "status", type: "VARCHAR(50)" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    }
  ];

  useEffect(() => {
    drawArchitecture();
  }, [components, connections, selectedComponent]);

  const drawArchitecture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw connections
    connections.forEach(conn => {
      const fromComp = components.find(c => c.id === conn.from);
      const toComp = components.find(c => c.id === conn.to);
      if (fromComp && toComp) {
        ctx.strokeStyle = 
          conn.type === "http" ? "#3b82f6" :
          conn.type === "grpc" ? "#8b5cf6" :
          conn.type === "event" ? "#f59e0b" : "#10b981";
        ctx.lineWidth = 2;
        ctx.setLineDash(conn.type === "event" ? [5, 5] : []);
        
        ctx.beginPath();
        ctx.moveTo(fromComp.x, fromComp.y);
        ctx.lineTo(toComp.x, toComp.y);
        ctx.stroke();
        
        // Draw arrow
        const angle = Math.atan2(toComp.y - fromComp.y, toComp.x - fromComp.x);
        const arrowSize = 10;
        ctx.beginPath();
        ctx.moveTo(toComp.x, toComp.y);
        ctx.lineTo(
          toComp.x - arrowSize * Math.cos(angle - Math.PI / 6),
          toComp.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toComp.x, toComp.y);
        ctx.lineTo(
          toComp.x - arrowSize * Math.cos(angle + Math.PI / 6),
          toComp.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Draw components
    components.forEach(comp => {
      const isSelected = comp.id === selectedComponent;
      
      ctx.fillStyle = comp.color;
      ctx.strokeStyle = isSelected ? "#ffffff" : comp.color;
      ctx.lineWidth = isSelected ? 3 : 1;

      // Draw component box
      const width = 120;
      const height = 80;
      ctx.fillRect(comp.x - width/2, comp.y - height/2, width, height);
      ctx.strokeRect(comp.x - width/2, comp.y - height/2, width, height);

      // Draw label
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(comp.label, comp.x, comp.y - 10);
      ctx.font = "10px monospace";
      ctx.fillText(comp.type.toUpperCase(), comp.x, comp.y + 10);
    });
  };

  const handleAddComponent = (type: string) => {
    const color = componentLibrary.find(c => c.type === type)?.color || "#3b82f6";
    const newComponent: ArchitectureComponent = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      x: Math.random() * 600 + 150,
      y: Math.random() * 400 + 100,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${components.filter(c => c.type === type).length + 1}`,
      color
    };
    setComponents([...components, newComponent]);
    toast({
      title: "Component Added",
      description: `${type} added to architecture`,
    });
  };

  const handleLoadPattern = (patternId: string) => {
    const newComponents: ArchitectureComponent[] = [];
    const newConnections: Connection[] = [];

    if (patternId === "microservices") {
      const gateway: ArchitectureComponent = {
        id: "gateway-1",
        type: "api-gateway",
        x: 400,
        y: 100,
        label: "API Gateway",
        color: "#f59e0b"
      };
      
      const services = [
        { id: "auth-1", type: "microservice" as const, x: 250, y: 250, label: "Auth Service", color: "#3b82f6" },
        { id: "user-1", type: "microservice" as const, x: 400, y: 250, label: "User Service", color: "#3b82f6" },
        { id: "order-1", type: "microservice" as const, x: 550, y: 250, label: "Order Service", color: "#3b82f6" },
      ];

      const db: ArchitectureComponent = {
        id: "db-1",
        type: "database",
        x: 400,
        y: 400,
        label: "PostgreSQL",
        color: "#10b981"
      };

      newComponents.push(gateway, ...services, db);
      
      services.forEach(service => {
        newConnections.push({ from: gateway.id, to: service.id, type: "http" });
        newConnections.push({ from: service.id, to: db.id, type: "database" });
      });
    } else if (patternId === "event-driven") {
      const eventBus: ArchitectureComponent = {
        id: "bus-1",
        type: "queue",
        x: 400,
        y: 250,
        label: "Event Bus",
        color: "#ec4899"
      };

      const producer: ArchitectureComponent = {
        id: "producer-1",
        type: "microservice",
        x: 200,
        y: 250,
        label: "Producer",
        color: "#3b82f6"
      };

      const consumers = [
        { id: "consumer-1", type: "microservice" as const, x: 550, y: 150, label: "Consumer 1", color: "#3b82f6" },
        { id: "consumer-2", type: "microservice" as const, x: 550, y: 350, label: "Consumer 2", color: "#3b82f6" },
      ];

      newComponents.push(eventBus, producer, ...consumers);
      newConnections.push({ from: producer.id, to: eventBus.id, type: "event" });
      consumers.forEach(consumer => {
        newConnections.push({ from: eventBus.id, to: consumer.id, type: "event" });
      });
    }

    setComponents(newComponents);
    setConnections(newConnections);
    
    toast({
      title: "Pattern Loaded",
      description: `${patterns.find(p => p.id === patternId)?.name} architecture loaded`,
    });
  };

  const handleAddEndpoint = () => {
    if (!newEndpoint.path || !newEndpoint.method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const endpoint: APIEndpoint = {
      id: Date.now().toString(),
      method: newEndpoint.method!,
      path: newEndpoint.path!,
      description: newEndpoint.description || "",
      requestBody: newEndpoint.requestBody,
      responseBody: newEndpoint.responseBody
    };

    setApiEndpoints([...apiEndpoints, endpoint]);
    setNewEndpoint({ method: "GET", path: "", description: "" });
    
    toast({
      title: "Endpoint Added",
      description: `${endpoint.method} ${endpoint.path}`,
    });
  };

  const exportArchitecture = () => {
    const data = {
      components,
      connections,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "architecture.json";
    a.click();
    
    toast({
      title: "Exported",
      description: "Architecture exported successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/livelab")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                SoftwareSIM Lab 🏗️
              </h1>
              <p className="text-muted-foreground">
                Software architecture and system design simulation environment
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportArchitecture}>
            <Download className="h-4 w-4 mr-2" />
            Export Architecture
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architect">Architect</TabsTrigger>
            <TabsTrigger value="api">API Design</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Welcome Section */}
            <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/10">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Server className="h-16 w-16 text-orange-500 mx-auto" />
                  <h2 className="text-3xl font-bold">Welcome to SoftwareSIM</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Design and simulate software architectures, create API specifications, model databases,
                    and learn system design patterns in an interactive environment.
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button size="lg" onClick={() => setActiveTab("architect")}>
                      <Boxes className="h-5 w-5 mr-2" />
                      Start Building
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setActiveTab("api")}>
                      Design API
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-orange-500/30">
                <CardHeader>
                  <Boxes className="h-8 w-8 mb-2 text-orange-500" />
                  <CardTitle className="text-lg">Microservices</CardTitle>
                  <CardDescription>Design distributed service architectures</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-red-500/30">
                <CardHeader>
                  <FileJson className="h-8 w-8 mb-2 text-red-500" />
                  <CardTitle className="text-lg">API Design</CardTitle>
                  <CardDescription>Create RESTful API specifications</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-orange-500/30">
                <CardHeader>
                  <Database className="h-8 w-8 mb-2 text-orange-500" />
                  <CardTitle className="text-lg">Database Modeling</CardTitle>
                  <CardDescription>Design database schemas and relationships</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-red-500/30">
                <CardHeader>
                  <Network className="h-8 w-8 mb-2 text-red-500" />
                  <CardTitle className="text-lg">System Patterns</CardTitle>
                  <CardDescription>Apply proven architecture patterns</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Patterns Library */}
            <Card className="border-orange-500/30">
              <CardHeader>
                <CardTitle>Architecture Patterns</CardTitle>
                <CardDescription>Load pre-built architecture patterns to learn from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patterns.map((pattern) => {
                    const Icon = pattern.icon;
                    return (
                      <Card key={pattern.id} className="border-orange-500/20">
                        <CardHeader>
                          <Icon className="h-8 w-8 mb-2 text-orange-500" />
                          <CardTitle className="text-sm">{pattern.name}</CardTitle>
                          <CardDescription className="text-xs">{pattern.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {pattern.components.slice(0, 3).map((comp, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setActiveTab("architect");
                                handleLoadPattern(pattern.id);
                              }}
                            >
                              Load Pattern
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architect" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Architecture Canvas */}
              <Card className="lg:col-span-3 border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Architecture Builder</CardTitle>
                      <CardDescription>Drag components to design your system</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setComponents([])}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={canvasRef}
                    width={900}
                    height={600}
                    className="w-full border border-orange-500/30 rounded-lg bg-black/20 cursor-crosshair"
                    onClick={(e) => {
                      const rect = canvasRef.current?.getBoundingClientRect();
                      if (!rect) return;
                      
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      
                      const clickedComponent = components.find(comp => {
                        const dx = x - comp.x;
                        const dy = y - comp.y;
                        return Math.abs(dx) < 60 && Math.abs(dy) < 40;
                      });
                      
                      setSelectedComponent(clickedComponent?.id || null);
                    }}
                  />
                  {selectedComponent && (
                    <div className="mt-4 p-4 bg-card rounded-lg border border-orange-500/30">
                      <p className="text-sm font-medium">
                        Selected: {components.find(c => c.id === selectedComponent)?.label}
                      </p>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="mt-2"
                        onClick={() => {
                          setComponents(components.filter(c => c.id !== selectedComponent));
                          setConnections(connections.filter(c => 
                            c.from !== selectedComponent && c.to !== selectedComponent
                          ));
                          setSelectedComponent(null);
                        }}
                      >
                        Delete Component
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Component Library */}
              <Card className="border-orange-500/30">
                <CardHeader>
                  <CardTitle>Components</CardTitle>
                  <CardDescription>Add to architecture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {componentLibrary.map((comp) => {
                    const Icon = comp.icon;
                    return (
                      <Button
                        key={comp.type}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleAddComponent(comp.type)}
                      >
                        <Icon className="h-4 w-4 mr-2" style={{ color: comp.color }} />
                        {comp.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Endpoints List */}
              <Card className="border-orange-500/30">
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>Define your RESTful API</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] w-full">
                    <div className="space-y-3">
                      {apiEndpoints.map((endpoint) => (
                        <Card key={endpoint.id} className="border-orange-500/20">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <Badge variant={
                                endpoint.method === "GET" ? "secondary" :
                                endpoint.method === "POST" ? "default" :
                                endpoint.method === "DELETE" ? "destructive" : "outline"
                              }>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm">{endpoint.path}</code>
                            </div>
                            <CardDescription>{endpoint.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Add New Endpoint */}
              <Card className="border-orange-500/30">
                <CardHeader>
                  <CardTitle>Add New Endpoint</CardTitle>
                  <CardDescription>Define a new API endpoint</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>HTTP Method</Label>
                    <div className="flex gap-2">
                      {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                        <Button
                          key={method}
                          size="sm"
                          variant={newEndpoint.method === method ? "default" : "outline"}
                          onClick={() => setNewEndpoint({ ...newEndpoint, method: method as any })}
                        >
                          {method}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="path">Path</Label>
                    <Input
                      id="path"
                      placeholder="/api/resource"
                      value={newEndpoint.path || ""}
                      onChange={(e) => setNewEndpoint({ ...newEndpoint, path: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="What does this endpoint do?"
                      value={newEndpoint.description || ""}
                      onChange={(e) => setNewEndpoint({ ...newEndpoint, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="request">Request Body (JSON)</Label>
                    <Textarea
                      id="request"
                      placeholder='{\n  "key": "value"\n}'
                      className="font-mono text-xs"
                      value={newEndpoint.requestBody || ""}
                      onChange={(e) => setNewEndpoint({ ...newEndpoint, requestBody: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response">Response Body (JSON)</Label>
                    <Textarea
                      id="response"
                      placeholder='{\n  "key": "value"\n}'
                      className="font-mono text-xs"
                      value={newEndpoint.responseBody || ""}
                      onChange={(e) => setNewEndpoint({ ...newEndpoint, responseBody: e.target.value })}
                    />
                  </div>

                  <Button className="w-full" onClick={handleAddEndpoint}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Endpoint
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-6 mt-6">
            <Card className="border-orange-500/30">
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>Design your database structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dbModels.map((model) => (
                    <Card key={model.name} className="border-orange-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Database className="h-5 w-5 text-orange-500" />
                          {model.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {model.fields.map((field) => (
                            <div key={field.name} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-medium">{field.name}</code>
                                {field.primary && <Badge variant="default" className="text-xs">PK</Badge>}
                                {field.unique && <Badge variant="secondary" className="text-xs">UNIQUE</Badge>}
                                {field.foreign && <Badge variant="outline" className="text-xs">FK</Badge>}
                              </div>
                              <code className="text-xs text-muted-foreground">{field.type}</code>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-full mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Table
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SoftwareSIM;
