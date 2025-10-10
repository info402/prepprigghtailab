import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AIMentorDialog = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: `As a project mentor, help with this question: ${question}`,
          model: 'google/gemini-2.5-flash'
        }
      });

      if (error) throw error;
      
      setResponse(data.reply || "I'm here to help you build amazing projects!");
    } catch (error) {
      console.error('AI Mentor error:', error);
      toast({
        title: "Could not connect to AI Mentor",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Bot className="h-4 w-4" />
          AI Mentor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Project Mentor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Ask me anything about projects, technologies, or how to build your ideas!
            </p>
            <Textarea
              placeholder="e.g., How do I start building an AI chatbot? What tech stack should I use?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <Button onClick={handleAsk} disabled={isLoading} className="w-full gap-2">
            <Send className="h-4 w-4" />
            {isLoading ? "Thinking..." : "Ask AI Mentor"}
          </Button>
          {response && (
            <div className="mt-4 p-4 bg-secondary/20 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                AI Mentor Says:
              </h4>
              <p className="text-sm whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};