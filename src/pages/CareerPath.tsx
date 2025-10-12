import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Map, Target } from "lucide-react";
import { useTokens } from "@/hooks/useTokens";
import { useNavigate } from "react-router-dom";

const CareerPath = () => {
  const [background, setBackground] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkTokens, deductTokens } = useTokens();
  const navigate = useNavigate();

  const generateRoadmap = async () => {
    if (!background.trim()) {
      toast({
        title: "Background required",
        description: "Please describe your current situation",
        variant: "destructive",
      });
      return;
    }

    // Check tokens before proceeding (costs 3 tokens)
    if (!checkTokens(3)) {
      setTimeout(() => navigate('/pricing'), 2000);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-career-roadmap", {
        body: { background },
      });

      if (error) throw error;

      // Deduct tokens after successful response
      await deductTokens(3);

      setRoadmap(data.roadmap);
      toast({
        title: "Roadmap generated!",
        description: "Your personalized career path is ready",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate roadmap",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Career Path Guide
          </h1>
          <p className="text-muted-foreground">
            Get AI-powered personalized career roadmap
          </p>
        </div>

        <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tell Us About Yourself
            </CardTitle>
            <CardDescription>
              Describe your education, skills, and career goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="e.g., I'm a 2nd year CS student interested in AI and Machine Learning"
              disabled={isLoading}
            />
            <Button onClick={generateRoadmap} disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate My Roadmap 🗺️"}
            </Button>
          </CardContent>
        </Card>

        {roadmap && (
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Your Personalized Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                {roadmap}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CareerPath;
