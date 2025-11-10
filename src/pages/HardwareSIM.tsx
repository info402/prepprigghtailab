import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, Cpu, Play, StopCircle, Zap, Thermometer,
  Gauge, Lightbulb, Wifi, Bluetooth, Radio, Activity,
  CircuitBoard, Code, Monitor, Download, Upload, Settings,
  Plus, Minus, RotateCw, Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "@/components/CodeEditor";

interface Component {
  id: string;
  type: "led" | "resistor" | "sensor" | "button" | "arduino";
  x: number;
  y: number;
  label: string;
  status?: "on" | "off";
  value?: number;
}

interface Connection {
  from: string;
  to: string;
}

const HardwareSIM = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRunning, setIsRunning] = useState(false);
  const [components, setComponents] = useState<Component[]>([
    { id: "arduino-1", type: "arduino", x: 400, y: 250, label: "Arduino Uno" }
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [serialOutput, setSerialOutput] = useState<string[]>([
    "Arduino Simulator v1.0",
    "Ready to upload code...",
    "---"
  ]);
  const [selectedProtocol, setSelectedProtocol] = useState<"wifi" | "bluetooth" | "mqtt" | "http">("wifi");

  const [arduinoCode, setArduinoCode] = useState(`void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT); // Built-in LED
  Serial.println("Arduino Started!");
}

void loop() {
  digitalWrite(13, HIGH);   // Turn LED on
  delay(1000);              // Wait 1 second
  digitalWrite(13, LOW);    // Turn LED off
  delay(1000);              // Wait 1 second
  Serial.println("Blink!");
}`);

  const componentLibrary = [
    { type: "led", icon: Lightbulb, label: "LED", color: "text-yellow-500" },
    { type: "resistor", icon: Minus, label: "Resistor", color: "text-orange-500" },
    { type: "sensor", icon: Activity, label: "Temperature Sensor", color: "text-blue-500" },
    { type: "button", icon: CircuitBoard, label: "Push Button", color: "text-green-500" },
  ];

  const projects = [
    {
      id: "blink",
      title: "LED Blink",
      description: "Basic Arduino sketch to blink an LED",
      difficulty: "Beginner",
      components: ["Arduino", "LED", "Resistor"]
    },
    {
      id: "temp",
      title: "Temperature Monitor",
      description: "Read temperature sensor and display values",
      difficulty: "Intermediate",
      components: ["Arduino", "DHT11 Sensor", "LCD Display"]
    },
    {
      id: "iot",
      title: "IoT Weather Station",
      description: "Send sensor data to cloud via WiFi",
      difficulty: "Advanced",
      components: ["ESP32", "DHT22", "WiFi Module"]
    },
    {
      id: "servo",
      title: "Servo Motor Control",
      description: "Control servo motor with potentiometer",
      difficulty: "Intermediate",
      components: ["Arduino", "Servo Motor", "Potentiometer"]
    }
  ];

  const iotProtocols = [
    {
      id: "wifi",
      name: "WiFi (802.11)",
      icon: Wifi,
      description: "Wireless local area network connectivity",
      code: `#include <WiFi.h>

const char* ssid = "YourSSID";
const char* password = "YourPassword";

void setup() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
  Serial.println("Connected!");
}`
    },
    {
      id: "bluetooth",
      name: "Bluetooth LE",
      icon: Bluetooth,
      description: "Low energy wireless communication",
      code: `#include <BLEDevice.h>

void setup() {
  BLEDevice::init("ESP32-BLE");
  Serial.println("Bluetooth initialized");
}`
    },
    {
      id: "mqtt",
      name: "MQTT Protocol",
      icon: Radio,
      description: "Lightweight messaging for IoT",
      code: `#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  client.setServer("mqtt.example.com", 1883);
  client.connect("ESP32Client");
}`
    },
    {
      id: "http",
      name: "HTTP/REST",
      icon: Activity,
      description: "Web-based API communication",
      code: `#include <HTTPClient.h>

void sendData() {
  HTTPClient http;
  http.begin("http://api.example.com/data");
  int httpCode = http.POST("sensor_data");
}`
    }
  ];

  const sensors = [
    { name: "DHT11", type: "Temperature & Humidity", value: "25°C, 60%", icon: Thermometer },
    { name: "HC-SR04", type: "Ultrasonic Distance", value: "15 cm", icon: Activity },
    { name: "LDR", type: "Light Sensor", value: "450 lux", icon: Lightbulb },
    { name: "MPU6050", type: "Gyroscope & Accelerometer", value: "0°, 0°, 0°", icon: Gauge },
  ];

  useEffect(() => {
    drawCircuit();
  }, [components, connections]);

  const drawCircuit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw connections
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    connections.forEach(conn => {
      const fromComp = components.find(c => c.id === conn.from);
      const toComp = components.find(c => c.id === conn.to);
      if (fromComp && toComp) {
        ctx.beginPath();
        ctx.moveTo(fromComp.x, fromComp.y);
        ctx.lineTo(toComp.x, toComp.y);
        ctx.stroke();
      }
    });

    // Draw components
    components.forEach(comp => {
      ctx.fillStyle = comp.type === "arduino" ? "#16a34a" : 
                      comp.type === "led" ? "#eab308" :
                      comp.type === "sensor" ? "#3b82f6" : "#6b7280";
      
      if (comp.type === "arduino") {
        ctx.fillRect(comp.x - 40, comp.y - 30, 80, 60);
      } else if (comp.type === "led") {
        ctx.beginPath();
        ctx.arc(comp.x, comp.y, 15, 0, Math.PI * 2);
        ctx.fill();
        if (comp.status === "on") {
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 5;
          ctx.stroke();
        }
      } else {
        ctx.fillRect(comp.x - 20, comp.y - 15, 40, 30);
      }

      // Draw label
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(comp.label, comp.x, comp.y + 40);
    });
  };

  const handleAddComponent = (type: string) => {
    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      label: type.toUpperCase(),
      status: "off"
    };
    setComponents([...components, newComponent]);
    toast({
      title: "Component Added",
      description: `${type.toUpperCase()} added to circuit`,
    });
  };

  const handleRunSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setSerialOutput(prev => [...prev, "Uploading code to Arduino...", "Upload complete!", "Running simulation..."]);
      
      // Simulate LED blinking
      let count = 0;
      const interval = setInterval(() => {
        setComponents(prev => prev.map(comp => 
          comp.type === "led" 
            ? { ...comp, status: comp.status === "on" ? "off" : "on" }
            : comp
        ));
        setSerialOutput(prev => [...prev, `Blink! (${++count})`]);
        
        if (count >= 5) {
          clearInterval(interval);
        }
      }, 1000);

      toast({
        title: "Simulation Started",
        description: "Your Arduino code is now running",
      });
    } else {
      setSerialOutput(prev => [...prev, "Simulation stopped."]);
      toast({
        title: "Simulation Stopped",
        description: "Arduino simulation paused",
      });
    }
  };

  const handleClearCircuit = () => {
    setComponents([{ id: "arduino-1", type: "arduino", x: 400, y: 250, label: "Arduino Uno" }]);
    setConnections([]);
    toast({
      title: "Circuit Cleared",
      description: "All components removed",
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
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                HardwareSIM Lab 🔧
              </h1>
              <p className="text-muted-foreground">
                Virtual hardware simulation for embedded systems and IoT development
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="simulator">Simulator</TabsTrigger>
            <TabsTrigger value="iot">IoT Protocols</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Welcome Section */}
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Cpu className="h-16 w-16 text-purple-500 mx-auto" />
                  <h2 className="text-3xl font-bold">Welcome to HardwareSIM</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Learn embedded systems, Arduino programming, and IoT development in a virtual environment.
                    Design circuits, write code, and simulate real hardware behavior.
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button size="lg" onClick={() => setActiveTab("simulator")}>
                      <CircuitBoard className="h-5 w-5 mr-2" />
                      Open Simulator
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setActiveTab("projects")}>
                      View Example Projects
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-purple-500/30">
                <CardHeader>
                  <CircuitBoard className="h-8 w-8 mb-2 text-purple-500" />
                  <CardTitle className="text-lg">Circuit Design</CardTitle>
                  <CardDescription>Visual circuit builder with drag-and-drop</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-pink-500/30">
                <CardHeader>
                  <Code className="h-8 w-8 mb-2 text-pink-500" />
                  <CardTitle className="text-lg">Arduino IDE</CardTitle>
                  <CardDescription>Write and upload Arduino sketches</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-500/30">
                <CardHeader>
                  <Wifi className="h-8 w-8 mb-2 text-purple-500" />
                  <CardTitle className="text-lg">IoT Protocols</CardTitle>
                  <CardDescription>WiFi, Bluetooth, MQTT support</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-pink-500/30">
                <CardHeader>
                  <Activity className="h-8 w-8 mb-2 text-pink-500" />
                  <CardTitle className="text-lg">Real Sensors</CardTitle>
                  <CardDescription>Simulate temperature, motion, light sensors</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Sensors Grid */}
            <Card className="border-purple-500/30">
              <CardHeader>
                <CardTitle>Available Sensors</CardTitle>
                <CardDescription>Simulate real-world sensor data in your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sensors.map((sensor) => {
                    const Icon = sensor.icon;
                    return (
                      <Card key={sensor.name} className="border-purple-500/20">
                        <CardHeader>
                          <Icon className="h-6 w-6 mb-2 text-purple-500" />
                          <CardTitle className="text-sm">{sensor.name}</CardTitle>
                          <CardDescription className="text-xs">{sensor.type}</CardDescription>
                          <Badge variant="secondary" className="mt-2 w-fit">{sensor.value}</Badge>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Circuit Canvas */}
              <Card className="lg:col-span-2 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Circuit Designer</CardTitle>
                      <CardDescription>Drag components to build your circuit</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={handleRunSimulation}
                        variant={isRunning ? "destructive" : "default"}
                      >
                        {isRunning ? (
                          <>
                            <StopCircle className="h-4 w-4 mr-2" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Run
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleClearCircuit}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="w-full border border-purple-500/30 rounded-lg bg-black/20"
                  />
                </CardContent>
              </Card>

              {/* Component Library */}
              <Card className="border-purple-500/30">
                <CardHeader>
                  <CardTitle>Components</CardTitle>
                  <CardDescription>Add to your circuit</CardDescription>
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
                        <Icon className={`h-4 w-4 mr-2 ${comp.color}`} />
                        {comp.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Code Editor & Serial Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Arduino Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <CodeEditor
                      value={arduinoCode}
                      onChange={setArduinoCode}
                      language="cpp"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-black/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-500">
                    <Monitor className="h-5 w-5" />
                    Serial Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border border-green-500/30 bg-black p-4">
                    <div className="font-mono text-sm text-green-500 space-y-1">
                      {serialOutput.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="iot" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {iotProtocols.map((protocol) => {
                const Icon = protocol.icon;
                const isSelected = selectedProtocol === protocol.id;
                return (
                  <Card 
                    key={protocol.id} 
                    className={`border-purple-500/30 cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-purple-500" : ""
                    }`}
                    onClick={() => setSelectedProtocol(protocol.id as any)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-10 w-10 text-purple-500" />
                        <div>
                          <CardTitle>{protocol.name}</CardTitle>
                          <CardDescription>{protocol.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/50 rounded-lg p-4">
                        <pre className="text-xs text-green-500 font-mono overflow-x-auto">
                          {protocol.code}
                        </pre>
                      </div>
                      <Button className="w-full mt-4">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Protocol
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle>{project.title}</CardTitle>
                      <Badge variant={
                        project.difficulty === "Beginner" ? "secondary" :
                        project.difficulty === "Intermediate" ? "default" : "destructive"
                      }>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Required Components:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.components.map((comp, idx) => (
                          <Badge key={idx} variant="outline">{comp}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">
                      <CircuitBoard className="h-4 w-4 mr-2" />
                      Load Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HardwareSIM;
