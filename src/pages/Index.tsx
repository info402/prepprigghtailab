import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Sparkles, Zap, Brain, Rocket, ExternalLink, Upload, FileText, Image as ImageIcon, File } from "lucide-react";

type AIModel = "chatgpt" | "gemini" | "claude" | "huggingface";

const Index = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("💡 AI responses will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, url: string, type: string}>>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    const uploadedFilesList: Array<{name: string, url: string, type: string}> = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${session.user.id}/${Math.random()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('user-uploads')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('user-uploads')
          .getPublicUrl(fileName);

        await supabase.from('uploaded_files').insert({
          user_id: session.user.id,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size,
        });

        uploadedFilesList.push({
          name: file.name,
          url: publicUrl,
          type: file.type,
        });
      }

      setUploadedFiles(prev => [...prev, ...uploadedFilesList]);
      toast({
        title: "Success",
        description: `${uploadedFilesList.length} file(s) uploaded successfully`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
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

    setIsLoading(true);
    setResponse("⏳ Thinking...");

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message, model, files: uploadedFiles },
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
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-40 right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Main Hero Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">India's First 4D AI Lab for Careers</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">
                  Future of Learning
                </span>
                <br />
                <span className="text-foreground">& Hiring</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Explore cutting-edge AI models including{" "}
                <span className="text-chatgpt font-bold">ChatGPT</span>,{" "}
                <span className="text-gemini font-bold">Gemini</span>,{" "}
                <span className="text-claude font-bold">Claude</span> &{" "}
                <span className="text-huggingface font-bold">HuggingFace</span>
                {" "}– all in one futuristic platform
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate("/auth")}
                >
                  Get Started Free
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate("/features")}
                >
                  Explore Features
                  <Brain className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Connect to AI Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 justify-center mb-12 max-w-5xl mx-auto">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-base px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0"
                  onClick={() => window.open("https://chatgpt.com", "_blank")}
                >
                  🤖 ChatGPT
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-base px-6 py-4 bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-white border-0"
                  onClick={() => window.open("https://gemini.google.com/app", "_blank")}
                >
                  🌐 Gemini
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-base px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0"
                  onClick={() => window.open("https://huggingface.co", "_blank")}
                >
                  📚 HuggingFace
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-base px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
                  onClick={() => window.open("https://huggingface.co/spaces", "_blank")}
                >
                  🚀 HF Spaces
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-base px-6 py-4 bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white border-0"
                  onClick={() => window.open("https://claude.ai", "_blank")}
                >
                  🧠 Claude
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { icon: Brain, text: "AI Resume Analyzer", color: "from-chatgpt to-chatgpt-glow" },
                  { icon: Zap, text: "Smart Interview Prep", color: "from-gemini to-gemini-glow" },
                  { icon: Rocket, text: "Career Roadmap", color: "from-claude to-claude-glow" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className={`px-6 py-3 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                      <span className="font-medium text-white">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Try Our AI Models
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience the power of multiple AI models in real-time
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-card/70 backdrop-blur-md border border-primary/30 rounded-2xl shadow-2xl p-6 w-full max-w-4xl mx-auto">
        
        {/* File Upload Button */}
        <div className="mb-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/40 transition-colors w-fit">
              <Upload className="h-4 w-4" />
              <span className="text-sm font-medium">Upload Files (PDF, Images, Docs)</span>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>

        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/30">
                {getFileIcon(file.type)}
                <span className="text-xs text-foreground truncate max-w-[150px]">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question here or upload files to search..."
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
        <div className="mt-16 text-center text-sm text-muted-foreground">
          Built with ❤️ by{" "}
          <span className="text-primary font-semibold">Preppright</span> | The
          Future of Learning
        </div>
      </div>
    </div>
  );
};

export default Index;
