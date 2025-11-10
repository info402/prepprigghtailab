import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Shield, ArrowLeft, Terminal, Lock, Unlock, AlertTriangle,
  CheckCircle2, XCircle, Network, Bug, Eye, Code, Target,
  Wifi, Server, Database, Globe, Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  points: number;
  completed: boolean;
  hints: string[];
}

interface Vulnerability {
  id: string;
  name: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Fixed";
  description: string;
}

const CyberRange = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [command, setCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "CyberRange Security Lab v2.0",
    "Type 'help' for available commands",
    "---"
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "xss-1",
      title: "Cross-Site Scripting (XSS) Attack",
      difficulty: "Easy",
      category: "Web Security",
      description: "Find and exploit an XSS vulnerability in a web application",
      points: 100,
      completed: false,
      hints: ["Look for user input fields", "Try injecting <script> tags"]
    },
    {
      id: "sql-1",
      title: "SQL Injection Challenge",
      difficulty: "Medium",
      category: "Database Security",
      description: "Exploit SQL injection to extract sensitive data",
      points: 200,
      completed: false,
      hints: ["Check login forms", "Try ' OR '1'='1", "Use UNION SELECT"]
    },
    {
      id: "mitm-1",
      title: "Man-in-the-Middle Attack",
      difficulty: "Hard",
      category: "Network Security",
      description: "Intercept and analyze network traffic",
      points: 300,
      completed: false,
      hints: ["Set up ARP spoofing", "Use packet sniffing tools"]
    },
    {
      id: "priv-esc",
      title: "Privilege Escalation",
      difficulty: "Hard",
      category: "System Security",
      description: "Gain root access to a Linux system",
      points: 350,
      completed: false,
      hints: ["Check SUID binaries", "Look for kernel exploits"]
    },
    {
      id: "csrf-1",
      title: "CSRF Token Bypass",
      difficulty: "Medium",
      category: "Web Security",
      description: "Bypass CSRF protection mechanisms",
      points: 250,
      completed: false,
      hints: ["Analyze request patterns", "Check token validation"]
    },
    {
      id: "crypto-1",
      title: "Cryptographic Attack",
      difficulty: "Hard",
      category: "Cryptography",
      description: "Break weak encryption to reveal secrets",
      points: 400,
      completed: false,
      hints: ["Analyze cipher type", "Check for weak keys"]
    }
  ]);

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([
    {
      id: "vuln-1",
      name: "Unpatched Apache Server",
      severity: "High",
      status: "Open",
      description: "Apache 2.4.29 has known CVE-2021-41773 vulnerability"
    },
    {
      id: "vuln-2",
      name: "Weak SSH Configuration",
      severity: "Medium",
      status: "Open",
      description: "SSH allows password authentication with weak passwords"
    },
    {
      id: "vuln-3",
      name: "Open MongoDB Port",
      severity: "Critical",
      status: "Open",
      description: "MongoDB exposed on port 27017 without authentication"
    },
    {
      id: "vuln-4",
      name: "Outdated SSL/TLS",
      severity: "High",
      status: "Open",
      description: "Server supports deprecated TLS 1.0 protocol"
    }
  ]);

  const scenarios = [
    {
      id: "firewall",
      icon: Shield,
      title: "Firewall Configuration",
      description: "Configure firewall rules to protect the network",
      difficulty: "Medium"
    },
    {
      id: "ids",
      icon: Activity,
      title: "Intrusion Detection",
      description: "Set up IDS/IPS to detect malicious activity",
      difficulty: "Hard"
    },
    {
      id: "incident",
      icon: AlertTriangle,
      title: "Incident Response",
      description: "Handle a security breach scenario",
      difficulty: "Hard"
    },
    {
      id: "audit",
      icon: Eye,
      title: "Security Audit",
      description: "Perform comprehensive security assessment",
      difficulty: "Medium"
    }
  ];

  const handleCommand = (cmd: string) => {
    const output = [...terminalOutput];
    output.push(`> ${cmd}`);

    const parts = cmd.trim().toLowerCase().split(" ");
    const mainCmd = parts[0];

    switch (mainCmd) {
      case "help":
        output.push("Available commands:");
        output.push("  scan <target>     - Scan target for vulnerabilities");
        output.push("  exploit <id>      - Attempt to exploit vulnerability");
        output.push("  nmap <ip>         - Network mapping");
        output.push("  sqlmap <url>      - SQL injection testing");
        output.push("  metasploit        - Launch Metasploit framework");
        output.push("  wireshark         - Start packet capture");
        output.push("  status            - Show challenge status");
        output.push("  clear             - Clear terminal");
        break;

      case "scan":
        if (parts[1]) {
          output.push(`Scanning ${parts[1]}...`);
          output.push("Found 4 open ports: 22, 80, 443, 27017");
          output.push("Detected vulnerabilities: 4");
        } else {
          output.push("Usage: scan <target>");
        }
        break;

      case "exploit":
        if (parts[1]) {
          output.push(`Attempting exploit ${parts[1]}...`);
          output.push("Exploit successful! Access gained.");
          toast({
            title: "Challenge Progress",
            description: "You've made progress on a challenge!",
          });
        } else {
          output.push("Usage: exploit <vulnerability-id>");
        }
        break;

      case "nmap":
        output.push("Starting Nmap scan...");
        output.push("PORT     STATE SERVICE");
        output.push("22/tcp   open  ssh");
        output.push("80/tcp   open  http");
        output.push("443/tcp  open  https");
        break;

      case "sqlmap":
        output.push("SQL injection testing initiated...");
        output.push("Testing parameter: id");
        output.push("[CRITICAL] SQL injection vulnerability found!");
        break;

      case "metasploit":
        output.push("Metasploit Framework v6.0");
        output.push("Type 'search' to find exploits");
        break;

      case "wireshark":
        output.push("Starting packet capture...");
        output.push("Capturing on interface eth0");
        output.push("Press Ctrl+C to stop");
        break;

      case "status":
        const completed = challenges.filter(c => c.completed).length;
        output.push(`Challenges: ${completed}/${challenges.length} completed`);
        output.push(`Total Points: ${completed * 150}`);
        break;

      case "clear":
        setTerminalOutput([
          "CyberRange Security Lab v2.0",
          "Type 'help' for available commands",
          "---"
        ]);
        setCommand("");
        return;

      default:
        output.push(`Command not found: ${cmd}`);
        output.push("Type 'help' for available commands");
    }

    setTerminalOutput(output);
    setCommand("");
  };

  const handleChallengeStart = (challengeId: string) => {
    toast({
      title: "Challenge Started",
      description: "Use the terminal below to complete this challenge",
    });
  };

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.reduce((sum, c) => sum + (c.completed ? c.points : 0), 0);

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
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
                CyberRange Security Lab 🛡️
              </h1>
              <p className="text-muted-foreground">
                Hands-on cybersecurity training with real-world scenarios
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Card className="border-red-500/30">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Challenges</p>
                    <p className="text-lg font-bold">{completedChallenges}/{challenges.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-500/30">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Points</p>
                    <p className="text-lg font-bold">{totalPoints}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Scan</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Welcome Section */}
            <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-500/10">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Shield className="h-16 w-16 text-red-500 mx-auto" />
                  <h2 className="text-3xl font-bold">Welcome to CyberRange</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Practice real-world cybersecurity skills in a safe, isolated environment. 
                    Learn penetration testing, vulnerability assessment, and incident response.
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button size="lg" onClick={() => setActiveTab("challenges")}>
                      Start Challenges
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setActiveTab("vulnerabilities")}>
                      Run Vulnerability Scan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-red-500/30">
                <CardHeader>
                  <Bug className="h-8 w-8 mb-2 text-red-500" />
                  <CardTitle className="text-lg">Penetration Testing</CardTitle>
                  <CardDescription>Find and exploit vulnerabilities</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-orange-500/30">
                <CardHeader>
                  <Network className="h-8 w-8 mb-2 text-orange-500" />
                  <CardTitle className="text-lg">Network Security</CardTitle>
                  <CardDescription>Secure network infrastructure</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-red-500/30">
                <CardHeader>
                  <Eye className="h-8 w-8 mb-2 text-red-500" />
                  <CardTitle className="text-lg">Threat Detection</CardTitle>
                  <CardDescription>Identify malicious activity</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-orange-500/30">
                <CardHeader>
                  <AlertTriangle className="h-8 w-8 mb-2 text-orange-500" />
                  <CardTitle className="text-lg">Incident Response</CardTitle>
                  <CardDescription>Handle security breaches</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6 mt-6">
            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="border-red-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{challenge.title}</CardTitle>
                          <Badge variant={
                            challenge.difficulty === "Easy" ? "secondary" :
                            challenge.difficulty === "Medium" ? "default" : "destructive"
                          }>
                            {challenge.difficulty}
                          </Badge>
                          <Badge variant="outline">{challenge.category}</Badge>
                        </div>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        {challenge.completed ? (
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                          <div className="text-2xl font-bold text-primary">
                            {challenge.points}
                            <span className="text-xs text-muted-foreground block">points</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold mb-2">Hints:</p>
                        <ul className="space-y-1">
                          {challenge.hints.map((hint, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                              <Code className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        onClick={() => handleChallengeStart(challenge.id)}
                        disabled={challenge.completed}
                        className="w-full"
                      >
                        {challenge.completed ? "Completed" : "Start Challenge"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vulnerabilities" className="space-y-6 mt-6">
            <Card className="border-red-500/30">
              <CardHeader>
                <CardTitle>Vulnerability Assessment</CardTitle>
                <CardDescription>
                  Scan and identify security vulnerabilities in the target environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={() => {
                    toast({
                      title: "Scan Started",
                      description: "Scanning target environment...",
                    });
                  }}>
                    <Bug className="h-4 w-4 mr-2" />
                    Run Full Scan
                  </Button>
                  <Button variant="outline">
                    <Network className="h-4 w-4 mr-2" />
                    Port Scan
                  </Button>
                  <Button variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    Web Scan
                  </Button>
                </div>

                <div className="space-y-3">
                  {vulnerabilities.map((vuln) => (
                    <Card key={vuln.id} className={
                      vuln.severity === "Critical" ? "border-red-500/50" :
                      vuln.severity === "High" ? "border-orange-500/50" :
                      vuln.severity === "Medium" ? "border-yellow-500/50" :
                      "border-blue-500/50"
                    }>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{vuln.name}</CardTitle>
                              <Badge variant={
                                vuln.severity === "Critical" || vuln.severity === "High" 
                                  ? "destructive" : "secondary"
                              }>
                                {vuln.severity}
                              </Badge>
                              <Badge variant={vuln.status === "Open" ? "outline" : "secondary"}>
                                {vuln.status === "Open" ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                                {vuln.status}
                              </Badge>
                            </div>
                            <CardDescription>{vuln.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <Card key={scenario.id} className="border-red-500/30">
                    <CardHeader>
                      <Icon className="h-12 w-12 mb-3 text-red-500" />
                      <CardTitle>{scenario.title}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge variant="outline">{scenario.difficulty}</Badge>
                        <Button className="w-full">
                          Start Scenario
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Terminal */}
        <Card className="border-red-500/30 bg-black/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-green-500" />
              <CardTitle className="text-green-500">Security Terminal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full rounded-md border border-green-500/30 bg-black p-4">
              <div className="font-mono text-sm text-green-500 space-y-1">
                {terminalOutput.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2 mt-4">
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCommand(command);
                  }
                }}
                placeholder="Enter command..."
                className="bg-black border-green-500/30 text-green-500 font-mono"
              />
              <Button 
                onClick={() => handleCommand(command)}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-500"
              >
                Execute
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CyberRange;
