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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-40 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            {/* Main Hero Content */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8 animate-fade-in">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">India's First 4D AI Lab for Careers</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-8 animate-fade-in-up">
                <span className="gradient-text">
                  Future of Learning
                </span>
                <br />
                <span className="text-foreground text-glow">& Hiring</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up font-body" style={{ animationDelay: '0.2s' }}>
                Master your career with Preppright's revolutionary 4D AI Lab - combining <span className="text-primary font-bold">Virtual Reality Labs</span>, <span className="text-accent font-bold">AR Mentorship</span>, <span className="text-secondary font-bold">AI-Powered Assessments</span>, and <span className="text-accent font-bold">Live Industry Projects</span> in one immersive platform.
              </p>
              
              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="glass-card p-8 hover-lift hover:glow-effect group">
                  <div className="bg-gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-glow group-hover:scale-110 transition-transform">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">AI-Powered Learning</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get personalized learning paths with ChatGPT, Gemini, Claude & HuggingFace integrated AI assistance
                  </p>
                </div>
                
                <div className="glass-card p-8 hover-lift hover:glow-effect group">
                  <div className="bg-gradient-secondary w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-glow group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">Live Coding Environments</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Practice in department-specific virtual labs with real-time code execution and AR mentor guidance
                  </p>
                </div>
                
                <div className="glass-card p-8 hover-lift hover:glow-effect group">
                  <div className="bg-gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-glow group-hover:scale-110 transition-transform">
                    <Rocket className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">Career Fast-Track</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI resume optimization, mock interviews, coding challenges & direct connections to top companies
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 bg-gradient-primary hover:opacity-90 shadow-glow-lg hover:shadow-glow font-semibold transition-all hover:scale-105"
                  onClick={() => navigate("/auth")}
                >
                  Get Started Free
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 glass-card hover:bg-[var(--glass-bg)]/80 font-semibold transition-all hover:scale-105"
                  onClick={() => navigate("/features")}
                >
                  Explore Features
                  <Brain className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Connect to AI Services */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 justify-center mb-16 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <Button 
                  size="lg" 
                  className="text-sm px-5 py-6 bg-chatgpt hover:opacity-90 text-white border-0 shadow-md hover:shadow-glow transition-all hover:scale-105 font-semibold"
                  onClick={() => window.open("https://chatgpt.com", "_blank")}
                >
                  🤖 ChatGPT
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
                <Button 
                  size="lg" 
                  className="text-sm px-5 py-6 bg-gemini hover:opacity-90 text-white border-0 shadow-md hover:shadow-glow transition-all hover:scale-105 font-semibold"
                  onClick={() => window.open("https://gemini.google.com/app", "_blank")}
                >
                  🌐 Gemini
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
                <Button 
                  size="lg" 
                  className="text-sm px-5 py-6 bg-huggingface hover:opacity-90 text-white border-0 shadow-md hover:shadow-glow transition-all hover:scale-105 font-semibold"
                  onClick={() => window.open("https://huggingface.co", "_blank")}
                >
                  📚 HuggingFace
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
                <Button 
                  size="lg" 
                  className="text-sm px-5 py-6 bg-accent hover:opacity-90 text-white border-0 shadow-md hover:shadow-glow transition-all hover:scale-105 font-semibold"
                  onClick={() => window.open("https://huggingface.co/spaces", "_blank")}
                >
                  🚀 HF Spaces
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
                <Button 
                  size="lg" 
                  className="text-sm px-5 py-6 bg-claude hover:opacity-90 text-white border-0 shadow-md hover:shadow-glow transition-all hover:scale-105 font-semibold col-span-2 sm:col-span-1"
                  onClick={() => window.open("https://claude.ai", "_blank")}
                >
                  🧠 Claude
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Stats Section */}
              <div className="flex flex-wrap justify-center gap-12 animate-fade-in" style={{ animationDelay: '1s' }}>
                {[
                  { value: "10,000+", label: "Students Trained", color: "text-chatgpt" },
                  { value: "500+", label: "Companies Hiring", color: "text-gemini" },
                  { value: "95%", label: "Placement Rate", color: "text-claude" },
                  { value: "4D", label: "AI Lab Experience", color: "text-huggingface" },
                ].map((stat, i) => (
                  <div key={i} className="text-center hover:scale-110 transition-transform">
                    <div className={`text-4xl md:text-5xl font-display font-extrabold ${stat.color} mb-2 text-glow`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
            Try Our AI Models
          </h2>
          <p className="text-muted-foreground text-lg font-body">
            Experience the power of multiple AI models in real-time
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-card p-8 w-full max-w-4xl mx-auto shadow-glass hover:shadow-glow-lg transition-all animate-scale-in">
        
        {/* File Upload Button */}
        <div className="mb-6">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center gap-3 px-5 py-3 glass-card hover:bg-[var(--glass-bg)]/80 rounded-xl border-primary/40 transition-all w-fit hover:scale-105">
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">Upload Files (PDF, Images, Docs)</span>
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
          <div className="mb-6 flex flex-wrap gap-2">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl border-primary/40">
                {getFileIcon(file.type)}
                <span className="text-xs text-foreground truncate max-w-[150px] font-medium">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question here or upload files to search..."
          className="min-h-32 p-5 rounded-xl bg-muted/30 border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none font-body backdrop-blur-sm"
          disabled={isLoading}
        />

        {/* AI Model Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {(Object.keys(modelConfig) as AIModel[]).map((model) => (
            <Button
              key={model}
              onClick={() => askAI(model)}
              disabled={isLoading}
              className={`px-6 py-4 rounded-xl font-bold bg-gradient-to-r ${modelConfig[model].gradient} shadow-lg ${modelConfig[model].shadow} hover:scale-105 hover:shadow-glow transition-all duration-300 text-white`}
            >
              {modelConfig[model].label}
            </Button>
          ))}
        </div>

        {/* Response Box */}
        <div className="mt-8 p-6 rounded-xl glass-card text-lg text-foreground min-h-[120px] whitespace-pre-wrap font-body leading-relaxed shadow-inner">
          {response}
        </div>
      </div>

        {/* What Makes Preppright Unique */}
        <div className="mt-32 max-w-6xl mx-auto glass-card p-12 md:p-16 shadow-glass animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-6 gradient-text">
            Why Choose Preppright's 4D AI Lab?
          </h2>
          <p className="text-center text-muted-foreground text-lg md:text-xl mb-16 font-body max-w-3xl mx-auto">
            India's most advanced career preparation platform with immersive learning technology
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "🎯 Department-Specific Virtual Labs",
                desc: "AI, Mechanical, Architecture, Business & Design labs with real industry tools and simulations"
              },
              {
                title: "🥽 AR Mentor Experience", 
                desc: "Learn from virtual industry experts through augmented reality guidance and live demonstrations"
              },
              {
                title: "💼 Live Industry Projects",
                desc: "Work on real projects from top companies, build your portfolio while learning"
              },
              {
                title: "🤖 Multi-AI Integration",
                desc: "Access ChatGPT, Gemini, Claude & HuggingFace - all in one platform for comprehensive assistance"
              },
              {
                title: "📊 Smart Assessment System",
                desc: "AI-driven coding challenges, technical interviews, and skill assessments with instant feedback"
              },
              {
                title: "🚀 Direct Job Placements",
                desc: "Connect directly with 500+ hiring partners, get interview calls based on your lab performance"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="glass-card p-8 hover-lift hover:glow-effect transition-all group"
              >
                <h3 className="text-xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-body">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-32 text-center pb-16 animate-fade-in">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent via-primary to-transparent" />
          </div>
          <p className="text-base text-muted-foreground mb-3 font-body">
            Built with ❤️ by <span className="text-primary font-bold">Preppright</span>
          </p>
          <p className="text-sm text-muted-foreground font-body">
            India's First 4D AI Lab | Transforming Careers Through Immersive Technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
