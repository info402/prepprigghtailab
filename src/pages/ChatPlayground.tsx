import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useTokens } from "@/hooks/useTokens";
import { useNavigate } from "react-router-dom";

type AIModel = "chatgpt" | "gemini" | "claude" | "huggingface";

const ChatPlayground = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("💡 AI responses will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkTokens, deductTokens } = useTokens();
  const navigate = useNavigate();

  const modelConfig = {
    chatgpt: {
      label: "🤖 ChatGPT",
      gradient: "from-blue-500 to-cyan-400",
    },
    gemini: {
      label: "🌐 Gemini",
      gradient: "from-green-500 to-lime-400",
    },
    claude: {
      label: "🧠 Claude",
      gradient: "from-pink-500 to-red-400",
    },
    huggingface: {
      label: "📚 HuggingFace",
      gradient: "from-yellow-400 to-orange-500",
    },
  };

  const askAI = async (model: AIModel) => {
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please type a question first",
        variant: "destructive",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use AI chat",
        variant: "destructive",
      });
      return;
    }

    // Check tokens before proceeding
    if (!checkTokens(1)) {
      setTimeout(() => navigate('/pricing'), 2000);
      return;
    }

    setIsLoading(true);
    setResponse("⏳ Thinking...");

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message, model },
      });

      if (error) throw error;

      // Deduct token after successful response
      await deductTokens(1);

      setResponse(data.reply || "No response received");
    } catch (error: any) {
      console.error("AI Error:", error);
      setResponse(`❌ Error: ${error.message || "Failed to get response"}`);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response",
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
            AI Chat Playground
          </h1>
          <p className="text-muted-foreground">
            Experience the power of multiple AI models in real-time
          </p>
        </div>

        <Card className="p-6 border-primary/30 bg-card/70 backdrop-blur-sm">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question here..."
            className="min-h-28 mb-4"
            disabled={isLoading}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {(Object.keys(modelConfig) as AIModel[]).map((model) => (
              <Button
                key={model}
                onClick={() => askAI(model)}
                disabled={isLoading}
                className={`px-5 py-3 font-semibold bg-gradient-to-r ${modelConfig[model].gradient} hover:scale-105 transition-transform`}
              >
                {modelConfig[model].label}
              </Button>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-black/60 border border-muted text-lg min-h-[150px] whitespace-pre-wrap">
            {response}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatPlayground;
