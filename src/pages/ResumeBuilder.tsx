import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Sparkles } from "lucide-react";
import { useTokens } from "@/hooks/useTokens";
import { useNavigate } from "react-router-dom";

const ResumeBuilder = () => {
  const [resumeText, setResumeText] = useState("");
  const [improvedResume, setImprovedResume] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkTokens, deductTokens } = useTokens();
  const navigate = useNavigate();

  const handleImproveResume = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Empty resume",
        description: "Please enter your resume content",
        variant: "destructive",
      });
      return;
    }

    // Check tokens before proceeding (costs 2 tokens)
    if (!checkTokens(2)) {
      setTimeout(() => navigate('/pricing'), 2000);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("improve-resume", {
        body: { resumeText },
      });

      if (error) throw error;

      // Deduct tokens after successful response
      await deductTokens(2);

      setImprovedResume(data.improvedResume);
      setAtsScore(data.atsScore);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("resumes").insert({
          user_id: user.id,
          title: "Resume " + new Date().toLocaleDateString(),
          content: resumeText,
          improved_content: data.improvedResume,
          ats_score: data.atsScore,
        });
      }

      toast({
        title: "Resume improved!",
        description: `ATS Score: ${data.atsScore}/100`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to improve resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Resume Builder
          </h1>
          <p className="text-muted-foreground">
            Create ATS-friendly resumes with AI optimization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Resume
              </CardTitle>
              <CardDescription>Paste your current resume content</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume here..."
                className="min-h-[400px] mb-4"
                disabled={isLoading}
              />
              <Button
                onClick={handleImproveResume}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Improving..." : "Improve with AI ✨"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Improved Resume
                {atsScore !== null && (
                  <span className="ml-auto text-sm font-normal bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ATS Score: {atsScore}/100
                  </span>
                )}
              </CardTitle>
              <CardDescription>Your optimized, ATS-friendly resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] p-4 rounded-lg bg-black/60 border border-muted whitespace-pre-wrap">
                {improvedResume || "Your improved resume will appear here..."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
