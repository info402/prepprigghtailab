import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Loader2,
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Download,
  Share2,
} from "lucide-react";

interface Assessment {
  id: string;
  overall_score: number;
  technical_score: number;
  soft_skills_score: number;
  experience_score: number;
  project_quality_score: number;
  ai_analysis: {
    summary: string;
    technicalAnalysis: string;
    softSkillsAnalysis: string;
    experienceAnalysis: string;
    projectAnalysis: string;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  action_items: string[];
  created_at: string;
}

export default function ReadinessReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your report",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("readiness_assessments")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      // Type assertion with proper handling
      const assessmentData = data as unknown as Assessment;
      setAssessment(assessmentData);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      toast({
        title: "Error",
        description: "Failed to load assessment report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Assessment Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The assessment report you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Campus Readiness Report</h1>
              <p className="text-muted-foreground">
                Generated on {new Date(assessment.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">
              <span className={getScoreColor(assessment.overall_score)}>
                {assessment.overall_score}
              </span>
              <span className="text-3xl text-muted-foreground">/100</span>
            </div>
            <div className="text-xl font-semibold mb-2">
              {getScoreLabel(assessment.overall_score)}
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {assessment.ai_analysis.summary}
            </p>
          </div>
        </Card>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Technical Skills</span>
                  <span className={`font-bold ${getScoreColor(assessment.technical_score)}`}>
                    {assessment.technical_score}/100
                  </span>
                </div>
                <Progress value={assessment.technical_score} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Soft Skills</span>
                  <span className={`font-bold ${getScoreColor(assessment.soft_skills_score)}`}>
                    {assessment.soft_skills_score}/100
                  </span>
                </div>
                <Progress value={assessment.soft_skills_score} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Experience</span>
                  <span className={`font-bold ${getScoreColor(assessment.experience_score)}`}>
                    {assessment.experience_score}/100
                  </span>
                </div>
                <Progress value={assessment.experience_score} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Project Quality</span>
                  <span className={`font-bold ${getScoreColor(assessment.project_quality_score)}`}>
                    {assessment.project_quality_score}/100
                  </span>
                </div>
                <Progress value={assessment.project_quality_score} className="h-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {assessment.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Detailed Analysis</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Technical Skills</h4>
              <p className="text-muted-foreground">{assessment.ai_analysis.technicalAnalysis}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">Soft Skills</h4>
              <p className="text-muted-foreground">{assessment.ai_analysis.softSkillsAnalysis}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">Experience</h4>
              <p className="text-muted-foreground">{assessment.ai_analysis.experienceAnalysis}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">Project Quality</h4>
              <p className="text-muted-foreground">{assessment.ai_analysis.projectAnalysis}</p>
            </div>
          </div>
        </Card>

        {/* Areas for Improvement */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {assessment.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Personalized Recommendations
          </h3>
          <div className="space-y-3">
            {assessment.recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Items */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Action Plan</h3>
          <div className="space-y-3">
            {assessment.action_items.map((item, index) => {
              const priority = item.match(/\[(.*?)\]/)?.[1] || "MEDIUM";
              const priorityColor = 
                priority === "HIGH" ? "destructive" :
                priority === "MEDIUM" ? "default" : "secondary";
              
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Badge variant={priorityColor as any}>{priority}</Badge>
                  <p className="flex-1">{item.replace(/\[.*?\]\s*/, "")}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* CTA */}
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => navigate("/readiness-assessment")} variant="outline">
            Take New Assessment
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}