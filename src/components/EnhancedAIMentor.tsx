import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface EnhancedAIMentorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectContext?: {
    name: string;
    description: string;
    techStack: string[];
  };
}

export const EnhancedAIMentor = ({ open, onOpenChange, projectContext }: EnhancedAIMentorProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = projectContext
        ? `You are an AI mentor helping a student build "${projectContext.name}" - ${projectContext.description}. Tech stack: ${projectContext.techStack.join(", ")}. Provide practical, step-by-step guidance.`
        : "You are an AI programming mentor. Help students learn by providing clear explanations and practical guidance.";

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            userMessage,
          ],
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I apologize, but I couldn't generate a response. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Mentor error:", error);
      toast({
        title: "Failed to get AI response",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Project Mentor
            {projectContext && (
              <span className="text-sm font-normal text-muted-foreground">
                • {projectContext.name}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Ask your AI Mentor anything!</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help with implementation, debugging, architecture, or best practices
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-w-md mx-auto text-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("How do I get started with this project?")}
                  >
                    Getting Started
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("What are the best practices for this tech stack?")}
                  >
                    Best Practices
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("Help me debug this error:")}
                  >
                    Debug Help
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("Explain the architecture of this project")}
                  >
                    Architecture
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask your AI mentor... (Press Enter to send)"
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
