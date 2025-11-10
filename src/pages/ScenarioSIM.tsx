import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  AlertTriangle,
  TrendingUp,
  Users,
  GitBranch,
  Target,
  Clock,
  Award,
  Play,
  RotateCcw,
  Share2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Lightbulb,
  BarChart3,
} from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  description: string;
  objectives: string[];
  skills: string[];
}

interface DecisionNode {
  id: string;
  text: string;
  options?: { label: string; next: string; impact: string }[];
  outcome?: { success: boolean; message: string; score: number };
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
}

const ScenarioSIM = () => {
  const [activeTab, setActiveTab] = useState("scenarios");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentNode, setCurrentNode] = useState<string>("start");
  const [scenarioProgress, setScenarioProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [decisions, setDecisions] = useState<string[]>([]);

  const scenarios: Scenario[] = [
    {
      id: "market-entry",
      title: "Global Market Entry Strategy",
      category: "Business Strategy",
      difficulty: "Advanced",
      duration: "45 min",
      description: "Your company is considering entering a new international market. Navigate competitive analysis, regulatory challenges, and resource allocation.",
      objectives: [
        "Assess market viability and competition",
        "Develop market entry strategy",
        "Manage budget constraints",
        "Build strategic partnerships",
      ],
      skills: ["Strategic Thinking", "Market Analysis", "Risk Management", "Negotiation"],
    },
    {
      id: "data-breach",
      title: "Cybersecurity Crisis Response",
      category: "Crisis Management",
      difficulty: "Expert",
      duration: "60 min",
      description: "A major data breach has been detected. Lead the incident response team through containment, communication, and recovery phases.",
      objectives: [
        "Contain the security breach",
        "Coordinate with legal and PR teams",
        "Communicate with stakeholders",
        "Implement recovery procedures",
      ],
      skills: ["Crisis Management", "Decision Making", "Communication", "Technical Knowledge"],
    },
    {
      id: "product-launch",
      title: "New Product Launch",
      category: "Product Management",
      difficulty: "Intermediate",
      duration: "40 min",
      description: "Lead the launch of a new product in a competitive market. Balance marketing, sales, and technical considerations.",
      objectives: [
        "Define target market and positioning",
        "Coordinate cross-functional teams",
        "Manage launch timeline and budget",
        "Monitor early performance metrics",
      ],
      skills: ["Product Management", "Marketing", "Team Leadership", "Analytics"],
    },
    {
      id: "merger-integration",
      title: "Post-Merger Integration",
      category: "Organizational Change",
      difficulty: "Advanced",
      duration: "50 min",
      description: "Two companies have merged. Navigate cultural integration, system consolidation, and organizational restructuring.",
      objectives: [
        "Align company cultures and values",
        "Integrate operational systems",
        "Retain key talent",
        "Achieve synergy targets",
      ],
      skills: ["Change Management", "Leadership", "Negotiation", "Strategic Planning"],
    },
    {
      id: "supply-chain",
      title: "Supply Chain Disruption",
      category: "Operations",
      difficulty: "Intermediate",
      duration: "35 min",
      description: "A major supplier has failed. Make critical decisions to maintain operations and customer satisfaction.",
      objectives: [
        "Find alternative suppliers quickly",
        "Manage customer expectations",
        "Minimize financial impact",
        "Build supply chain resilience",
      ],
      skills: ["Operations Management", "Problem Solving", "Vendor Management", "Planning"],
    },
    {
      id: "team-conflict",
      title: "Team Conflict Resolution",
      category: "Team Management",
      difficulty: "Beginner",
      duration: "25 min",
      description: "Address escalating conflicts within your team that are impacting productivity and morale.",
      objectives: [
        "Identify root causes of conflict",
        "Facilitate constructive dialogue",
        "Implement resolution strategies",
        "Rebuild team cohesion",
      ],
      skills: ["Conflict Resolution", "Communication", "Empathy", "Leadership"],
    },
  ];

  const decisionTree: Record<string, DecisionNode> = {
    start: {
      id: "start",
      text: "You've just discovered a competitor is launching a similar product next month. Your product is 80% complete. What's your move?",
      options: [
        { label: "Rush to launch before them", next: "rush-launch", impact: "risky" },
        { label: "Continue as planned, focus on quality", next: "quality-focus", impact: "safe" },
        { label: "Pivot to differentiate our product", next: "pivot", impact: "strategic" },
        { label: "Partner with the competitor", next: "partnership", impact: "collaborative" },
      ],
    },
    "rush-launch": {
      id: "rush-launch",
      text: "You've accelerated the timeline. The team is stressed and quality concerns are emerging. Early user feedback shows bugs.",
      options: [
        { label: "Pull the product and fix issues", next: "fix-bugs", impact: "costly" },
        { label: "Release updates quickly post-launch", next: "iterative", impact: "agile" },
        { label: "Offer free premium support to early users", next: "support-offer", impact: "customer-focused" },
      ],
    },
    "quality-focus": {
      id: "quality-focus",
      text: "Your product launches with excellent quality but the competitor has captured early market attention. Reviews are positive but adoption is slow.",
      options: [
        { label: "Aggressive marketing campaign", next: "marketing-push", impact: "expensive" },
        { label: "Target niche market first", next: "niche-focus", impact: "strategic" },
        { label: "Build strategic partnerships", next: "partnerships", impact: "collaborative" },
      ],
    },
    pivot: {
      id: "pivot",
      text: "You've identified unique features competitors lack. The pivot requires 3 more weeks and additional budget. Leadership is concerned.",
      options: [
        { label: "Present data-backed business case", next: "business-case", impact: "analytical" },
        { label: "Launch MVP and iterate", next: "mvp-approach", impact: "lean" },
        { label: "Seek additional funding", next: "funding", impact: "financial" },
      ],
    },
    partnership: {
      id: "partnership",
      text: "The competitor is interested but wants majority market share. Your team is split on the decision.",
      options: [
        { label: "Negotiate equal partnership", next: "negotiate", impact: "diplomatic" },
        { label: "Decline and compete independently", next: "compete", impact: "independent" },
        { label: "Explore acquisition possibility", next: "acquisition", impact: "bold" },
      ],
    },
    "fix-bugs": {
      id: "fix-bugs",
      text: "You've temporarily pulled the product. Media coverage is negative but users appreciate the honesty.",
      outcome: {
        success: true,
        message: "Good decision! Honesty and quality win long-term loyalty. Recovery takes time but reputation remains intact.",
        score: 75,
      },
    },
    iterative: {
      id: "iterative",
      text: "Quick updates are addressing issues but some users have churned. Tech debt is accumulating.",
      outcome: {
        success: false,
        message: "Rushed approach created technical debt. Short-term gains led to long-term challenges. Consider quality first.",
        score: 45,
      },
    },
    "support-offer": {
      id: "support-offer",
      text: "Premium support is well-received. Early adopters become advocates and provide valuable feedback.",
      outcome: {
        success: true,
        message: "Excellent! Customer-first approach builds loyalty and provides insights for improvement. Strong foundation for growth.",
        score: 90,
      },
    },
    "marketing-push": {
      id: "marketing-push",
      text: "High marketing spend is generating awareness but ROI is uncertain. Budget is stretched.",
      outcome: {
        success: false,
        message: "Aggressive spending without strong differentiation yields limited results. Better targeting would improve ROI.",
        score: 55,
      },
    },
    "niche-focus": {
      id: "niche-focus",
      text: "Targeting a specific niche creates strong word-of-mouth. Growth is steady and profitable.",
      outcome: {
        success: true,
        message: "Strategic approach! Focusing on a niche allows you to dominate and expand from a position of strength.",
        score: 85,
      },
    },
    partnerships: {
      id: "partnerships",
      text: "Strategic partners amplify your reach. Integration challenges emerge but overall trajectory is positive.",
      outcome: {
        success: true,
        message: "Collaborative strategy pays off. Partnerships provide distribution and credibility. Well executed!",
        score: 88,
      },
    },
    "business-case": {
      id: "business-case",
      text: "Leadership approves after seeing projected ROI. The pivot creates strong differentiation.",
      outcome: {
        success: true,
        message: "Data-driven decision making wins support. Unique positioning captures premium market segment. Excellent outcome!",
        score: 95,
      },
    },
    "mvp-approach": {
      id: "mvp-approach",
      text: "MVP launches with core differentiators. User feedback guides rapid iteration and improvement.",
      outcome: {
        success: true,
        message: "Lean methodology proves effective. Customer feedback drives development. Strong product-market fit achieved.",
        score: 92,
      },
    },
    funding: {
      id: "funding",
      text: "Funding secured but at unfavorable terms. Pressure to deliver quick results intensifies.",
      outcome: {
        success: false,
        message: "Desperate funding decisions dilute equity and add pressure. Better to bootstrap or validate assumptions first.",
        score: 50,
      },
    },
    negotiate: {
      id: "negotiate",
      text: "After tough negotiations, you reach a 50-50 partnership. Combined resources create market leadership.",
      outcome: {
        success: true,
        message: "Diplomatic skills lead to win-win outcome. Combined entity dominates market. Partnership thrives.",
        score: 93,
      },
    },
    compete: {
      id: "compete",
      text: "Independent path is challenging but your unique vision attracts loyal customers and investors.",
      outcome: {
        success: true,
        message: "Independence preserves vision and culture. Harder path but more rewarding. Strong brand identity established.",
        score: 87,
      },
    },
    acquisition: {
      id: "acquisition",
      text: "Acquisition discussions reveal valuation gaps. Deal falls through but you've learned valuable competitive intelligence.",
      outcome: {
        success: false,
        message: "Bold move but premature. Intel gained is valuable but opportunity cost was high. Timing matters.",
        score: 60,
      },
    },
  };

  const teamMembers: TeamMember[] = [
    { id: "1", name: "Sarah Chen", role: "Strategy Lead", status: "online" },
    { id: "2", name: "Marcus Johnson", role: "Operations Manager", status: "online" },
    { id: "3", name: "Emily Rodriguez", role: "Finance Director", status: "away" },
    { id: "4", name: "David Kim", role: "Tech Lead", status: "online" },
    { id: "5", name: "Rachel Thompson", role: "Marketing Head", status: "offline" },
  ];

  const handleDecision = (nextNode: string, impact: string) => {
    setDecisions([...decisions, `${decisionTree[currentNode].text} → ${impact}`]);
    setCurrentNode(nextNode);
    setScenarioProgress((prev) => prev + 20);
    if (impact === "strategic" || impact === "analytical") {
      setScore((prev) => prev + 15);
    } else if (impact === "risky") {
      setScore((prev) => prev + 5);
    } else {
      setScore((prev) => prev + 10);
    }
  };

  const resetScenario = () => {
    setCurrentNode("start");
    setScenarioProgress(0);
    setScore(0);
    setDecisions([]);
  };

  const currentDecisionNode = decisionTree[currentNode];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">ScenarioSIM Lab</h1>
          <p className="text-muted-foreground text-lg">
            Master real-world business challenges through interactive simulations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scenarios Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">+5% improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Collaborative learning</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Developed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Across 6 categories</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="scenarios">
              <Briefcase className="h-4 w-4 mr-2" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="simulation">
              <GitBranch className="h-4 w-4 mr-2" />
              Decision Tree
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team Collaboration
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Scenarios</CardTitle>
                <CardDescription>
                  Select a scenario to begin your simulation. Each scenario presents unique challenges and learning opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {scenarios.map((scenario) => (
                      <Card
                        key={scenario.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedScenario(scenario)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{scenario.title}</CardTitle>
                              <CardDescription>{scenario.description}</CardDescription>
                            </div>
                            <Badge variant={scenario.difficulty === "Expert" ? "destructive" : scenario.difficulty === "Advanced" ? "default" : "secondary"}>
                              {scenario.difficulty}
                            </Badge>
                          </div>
                          <div className="flex gap-2 flex-wrap mt-3">
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {scenario.duration}
                            </Badge>
                            <Badge variant="outline">{scenario.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Objectives:</h4>
                              <ul className="space-y-1">
                                {scenario.objectives.map((obj, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                    <Target className="h-3 w-3 mr-2 mt-0.5 text-primary" />
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Skills:</h4>
                              <div className="flex gap-2 flex-wrap">
                                {scenario.skills.map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button className="w-full mt-4" onClick={() => setActiveTab("simulation")}>
                              <Play className="h-4 w-4 mr-2" />
                              Start Scenario
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Decision Tree */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Interactive Decision Tree</CardTitle>
                        <CardDescription>Make strategic decisions and see the outcomes</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={resetScenario}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{scenarioProgress}%</span>
                      </div>
                      <Progress value={scenarioProgress} />
                    </div>

                    <Separator />

                    {/* Current Scenario Node */}
                    {currentDecisionNode.outcome ? (
                      <Alert className={currentDecisionNode.outcome.success ? "border-green-500" : "border-red-500"}>
                        {currentDecisionNode.outcome.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <AlertDescription className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">
                              {currentDecisionNode.outcome.success ? "Success!" : "Learning Opportunity"}
                            </h3>
                            <p>{currentDecisionNode.outcome.message}</p>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span className="font-medium">Final Score:</span>
                            <span className="text-2xl font-bold">{currentDecisionNode.outcome.score}/100</span>
                          </div>
                          <Button className="w-full" onClick={resetScenario}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Try Another Path
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-primary mt-1" />
                            <p className="text-sm leading-relaxed">{currentDecisionNode.text}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">What's your decision?</h4>
                          {currentDecisionNode.options.map((option, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              className="w-full justify-between h-auto py-4 px-4 hover:border-primary"
                              onClick={() => handleDecision(option.next, option.impact)}
                            >
                              <span className="text-left">{option.label}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {option.impact}
                                </Badge>
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Score & History */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary mb-2">{score}</div>
                      <p className="text-sm text-muted-foreground">Decision Quality Score</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Decision History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {decisions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No decisions made yet. Start making choices!
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {decisions.map((decision, idx) => (
                            <div key={idx} className="p-3 bg-muted rounded-lg text-xs">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  Step {idx + 1}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">{decision}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Team Collaboration Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Session</CardTitle>
                    <CardDescription>Collaborate with your team to solve complex business scenarios</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Users className="h-4 w-4" />
                      <AlertDescription>
                        Team mode allows multiple participants to discuss and vote on decisions. Perfect for training teams on collaborative problem-solving.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-semibold">Active Session</h4>
                          <p className="text-sm text-muted-foreground">Global Market Entry Strategy</p>
                        </div>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>

                      <Separator />

                      {/* Chat/Discussion Area */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Team Discussion
                        </h4>
                        <ScrollArea className="h-[300px] border rounded-lg p-4">
                          <div className="space-y-4">
                            <div className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>SC</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">Sarah Chen</span>
                                  <span className="text-xs text-muted-foreground">2 min ago</span>
                                </div>
                                <p className="text-sm bg-muted p-3 rounded-lg">
                                  I think we should focus on quality. Rushing might damage our reputation.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>MJ</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">Marcus Johnson</span>
                                  <span className="text-xs text-muted-foreground">1 min ago</span>
                                </div>
                                <p className="text-sm bg-muted p-3 rounded-lg">
                                  Agreed, but we need some competitive advantage. What about a pivot strategy?
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>DK</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">David Kim</span>
                                  <span className="text-xs text-muted-foreground">Just now</span>
                                </div>
                                <p className="text-sm bg-muted p-3 rounded-lg">
                                  From a tech perspective, we can add unique features in 3 weeks. Worth considering.
                                </p>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Share your thoughts..."
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          />
                          <Button size="sm">Send</Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Voting Area */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Team Vote</h4>
                        <div className="space-y-2">
                          {["Rush to launch before competitor", "Continue as planned, focus on quality", "Pivot to differentiate", "Partner with competitor"].map(
                            (option, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary cursor-pointer">
                                <span className="text-sm">{option}</span>
                                <div className="flex items-center gap-3">
                                  <Progress value={[25, 40, 30, 5][idx]} className="w-20" />
                                  <span className="text-xs text-muted-foreground w-10">{[25, 40, 30, 5][idx]}%</span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                        <Button className="w-full">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Submit Team Decision
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Members Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>5 members online</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar>
                            <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                          </div>
                          <Badge
                            variant={member.status === "online" ? "default" : member.status === "away" ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {member.status}
                          </Badge>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Invite Members
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                  <CardDescription>Your decision-making patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Strategic Thinking</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Management</span>
                        <span className="font-medium">72%</span>
                      </div>
                      <Progress value={72} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Team Collaboration</span>
                        <span className="font-medium">90%</span>
                      </div>
                      <Progress value={90} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Crisis Response</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Completions</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: "Cybersecurity Crisis", score: 88, date: "2 days ago" },
                      { title: "Product Launch", score: 92, date: "5 days ago" },
                      { title: "Supply Chain Disruption", score: 76, date: "1 week ago" },
                      { title: "Market Entry Strategy", score: 85, date: "2 weeks ago" },
                    ].map((completion, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{completion.title}</p>
                          <p className="text-xs text-muted-foreground">{completion.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{completion.score}</div>
                          <p className="text-xs text-muted-foreground">score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Based on your performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Focus Area:</strong> Consider more scenarios in Crisis Management to improve your score from 78% to 85%+
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Strength:</strong> Your team collaboration skills are excellent (90%). Consider mentoring others in this area.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Next Challenge:</strong> Try "Post-Merger Integration" - it combines your strategic thinking with collaboration skills.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ScenarioSIM;
