import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Video, Play } from "lucide-react";

const MockInterview = () => {
  const [role, setRole] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const startInterview = async () => {
    if (!role.trim()) {
      toast({
        title: "Role required",
        description: "Please enter the role you're interviewing for",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-interview-question", {
        body: { role },
      });

      if (error) throw error;

      setCurrentQuestion(data.question);
      toast({
        title: "Interview started!",
        description: "Answer the question below",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start interview",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide your answer",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-interview-answer", {
        body: { question: currentQuestion, answer, role },
      });

      if (error) throw error;

      setFeedback(data.feedback);
      setScore(data.score);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("interview_attempts").insert({
          user_id: user.id,
          role,
          questions: [currentQuestion],
          answers: [answer],
          score: data.score,
          feedback: data.feedback,
        });
      }

      toast({
        title: "Answer evaluated!",
        description: `Score: ${data.score}/100`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to evaluate answer",
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
            Mock Interview AI
          </h1>
          <p className="text-muted-foreground">
            Practice interviews with AI feedback and scoring
          </p>
        </div>

        {!currentQuestion ? (
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Start Your Interview
              </CardTitle>
              <CardDescription>Enter the role you're applying for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager"
                disabled={isLoading}
              />
              <Button onClick={startInterview} disabled={isLoading} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? "Starting..." : "Start Interview"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Interview Question</CardTitle>
                <CardDescription>Role: {role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{currentQuestion}</p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[200px]"
                  disabled={isLoading || !!feedback}
                />
                {!feedback && (
                  <Button onClick={submitAnswer} disabled={isLoading} className="w-full">
                    {isLoading ? "Evaluating..." : "Submit Answer"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {feedback && (
              <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    AI Feedback
                    {score !== null && (
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {score}/100
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{feedback}</p>
                  <Button
                    onClick={() => {
                      setCurrentQuestion("");
                      setAnswer("");
                      setFeedback("");
                      setScore(null);
                    }}
                    className="mt-4 w-full"
                  >
                    Start New Interview
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MockInterview;
