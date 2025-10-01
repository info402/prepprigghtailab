import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AIModel = "chatgpt" | "gemini" | "claude" | "huggingface";

const Index = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("💡 AI responses will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const modelConfig = {
    chatgpt: {
      label: "🤖 ChatGPT",
      gradient: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/40",
    },
    gemini: {
      label: "🌐 Gemini",
      gradient: "from-green-500 to-lime-400",
      shadow: "shadow-green-500/40",
    },
    claude: {
      label: "🧠 Claude",
      gradient: "from-pink-500 to-red-400",
      shadow: "shadow-pink-500/40",
    },
    huggingface: {
      label: "📚 HuggingFace",
      gradient: "from-yellow-400 to-orange-500",
      shadow: "shadow-yellow-500/40",
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

    setIsLoading(true);
    setResponse("⏳ Thinking...");

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message, model },
      });

      if (error) throw error;

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
    <div className="min-h-screen bg-gradient-bg flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-pulse">
          🚀 Preppright AI Lab
        </h1>
        <p className="text-lg text-gray-300 mt-3">
          Explore the future of learning with{" "}
          <span className="font-bold">ChatGPT</span>,{" "}
          <span className="font-bold">Gemini</span>,{" "}
          <span className="font-bold">Claude</span> &{" "}
          <span className="font-bold">HuggingFace</span> – all in one place!
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card/70 backdrop-blur-md border border-primary/30 rounded-2xl shadow-2xl p-6 w-full max-w-3xl">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question here..."
          className="min-h-28 p-4 rounded-xl bg-black/50 border-muted text-foreground focus:ring-2 focus:ring-primary resize-none"
          disabled={isLoading}
        />

        {/* AI Model Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {(Object.keys(modelConfig) as AIModel[]).map((model) => (
            <Button
              key={model}
              onClick={() => askAI(model)}
              disabled={isLoading}
              className={`px-5 py-3 rounded-xl font-semibold bg-gradient-to-r ${modelConfig[model].gradient} shadow-lg ${modelConfig[model].shadow} hover:scale-105 transition-transform duration-200`}
            >
              {modelConfig[model].label}
            </Button>
          ))}
        </div>

        {/* Response Box */}
        <div className="mt-6 p-6 rounded-xl bg-black/60 border border-muted shadow-inner text-lg text-foreground min-h-[100px] whitespace-pre-wrap">
          {response}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-sm text-muted-foreground">
        Built with ❤️ by{" "}
        <span className="text-primary font-semibold">Preppright</span> | The
        Future of Learning
      </div>
    </div>
  );
};

export default Index;
