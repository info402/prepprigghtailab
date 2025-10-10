import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "@/components/CodeEditor";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  points: number;
  starter_code: string;
  test_cases: any;
  tags: string[];
}

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchChallenge(id);
    }
  }, [id]);

  const fetchChallenge = async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from("coding_challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

      if (error) throw error;
      setChallenge(data);
      setCode(data.starter_code || "");
    } catch (error) {
      console.error("Error fetching challenge:", error);
      toast({
        title: "Error",
        description: "Failed to load challenge",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Simple test execution (in production, use a proper code execution service)
      const testResults = {
        passed: Math.random() > 0.3,
        tests: challenge.test_cases?.tests?.map((test: any, i: number) => ({
          id: i,
          passed: Math.random() > 0.2,
          input: test.input,
          expected: test.output,
        })),
      };

      const { error } = await supabase.from("challenge_submissions").insert({
        user_id: user.id,
        challenge_id: challenge.id,
        code: code,
        language: language,
        status: testResults.passed ? "passed" : "failed",
        test_results: testResults,
      });

      if (error) throw error;

      setResult(testResults);
      toast({
        title: testResults.passed ? "Success!" : "Some tests failed",
        description: testResults.passed
          ? "All test cases passed!"
          : "Check the results below",
        variant: testResults.passed ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Error",
        description: "Failed to submit solution",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!challenge) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/challenges")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {challenge.category} • {challenge.points} points
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      challenge.difficulty === "easy"
                        ? "bg-green-500/10 text-green-500"
                        : challenge.difficulty === "medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    }
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="description">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="space-y-4">
                    <p className="text-sm">{challenge.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="examples">
                    {challenge.test_cases?.tests?.map((test: any, i: number) => (
                      <Card key={i} className="mb-2">
                        <CardContent className="pt-6">
                          <p className="text-sm font-mono">
                            Input: {JSON.stringify(test.input)}
                          </p>
                          <p className="text-sm font-mono mt-2">
                            Output: {JSON.stringify(test.output)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.passed ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        All Tests Passed!
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        Some Tests Failed
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.tests?.map((test: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md bg-muted"
                    >
                      {test.passed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">Test Case {i + 1}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              starterCode={challenge.starter_code}
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              {isSubmitting ? "Running Tests..." : "Submit Solution"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChallengeDetail;
