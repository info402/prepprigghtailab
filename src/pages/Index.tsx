import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Sparkles, Zap, Brain, Rocket, ExternalLink, Upload, FileText, Image as ImageIcon, File, Target, Users, Award, Briefcase } from "lucide-react";
import heroStudent from "@/assets/hero-student.jpg";
import aiLab from "@/assets/ai-lab.jpg";

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
    <div className="min-h-screen bg-[var(--gradient-hero)] animate-gradient">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        {/* Soft Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-40 right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">Strategically Crafted by Industry Experts</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight mb-6 animate-fade-in-up leading-tight">
                <span className="text-foreground">
                  Experience the future of Career Preparation with
                </span>
                <br />
                <span className="gradient-text">AI-Powered Labs @ PREPPRIGHT</span>
              </h1>
              
              <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <p className="text-muted-foreground text-base mb-4">
                  Over <span className="font-bold text-primary text-xl">10,000+</span> students placed in
                </p>
                <p className="text-foreground font-semibold text-lg">
                  Top Tech Companies & Startups Since <span className="text-primary">2024</span>
                </p>
              </div>

              <div className="bg-gradient-primary/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-primary/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-5xl font-display font-extrabold text-foreground mb-2">
                  1000+
                </div>
                <p className="text-muted-foreground">
                  Placed in India&apos;s Top Product Companies & MNCs
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button 
                  size="lg" 
                  className="text-base px-8 py-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold transition-all hover:scale-105 shadow-md"
                  onClick={() => navigate("/auth")}
                >
                  Start Learning
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-base px-8 py-6 bg-white/80 hover:bg-white border-2 border-primary/20 text-foreground rounded-xl font-semibold transition-all hover:scale-105"
                  onClick={() => navigate("/auth")}
                >
                  New User? Join Now
                  <Users className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={heroStudent} 
                  alt="Preppright Student Success" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-primary/10 backdrop-blur-sm border-y border-primary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-2xl font-display font-bold text-foreground mb-8">
            Unlock Your Potential With India&apos;s Most Advanced AI-Powered Career Platform
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">2000+hrs</div>
              <div className="text-sm text-muted-foreground font-medium">Learning Content</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">150+</div>
              <div className="text-sm text-muted-foreground font-medium">Industry Mentors</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">10K+</div>
              <div className="text-sm text-muted-foreground font-medium">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">500+</div>
              <div className="text-sm text-muted-foreground font-medium">Hiring Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-center text-2xl md:text-3xl font-display font-bold text-foreground mb-12">
          Our students work at
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {[
            { name: "Amazon", gradient: "from-orange-400 to-yellow-600" },
            { name: "Adobe", gradient: "from-red-500 to-pink-600" },
            { name: "Google", gradient: "from-blue-500 to-green-500" },
            { name: "Facebook", gradient: "from-blue-600 to-indigo-600" },
            { name: "Apple", gradient: "from-gray-700 to-gray-900" },
            { name: "TCS", gradient: "from-blue-700 to-purple-700" },
            { name: "Microsoft", gradient: "from-cyan-500 to-blue-600" },
            { name: "Flipkart", gradient: "from-yellow-500 to-orange-600" },
            { name: "Oracle", gradient: "from-red-600 to-red-700" },
            { name: "Capgemini", gradient: "from-blue-600 to-cyan-600" },
            { name: "Jio", gradient: "from-blue-500 to-blue-700" },
            { name: "+ Many More", gradient: "from-primary to-accent" },
          ].map((company, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm rounded-xl border border-primary/10 hover:shadow-lg transition-all hover:scale-105 group"
            >
              <span className={`text-lg font-bold bg-gradient-to-r ${company.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-4">Popular Learning Tracks</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Top Career Categories
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Explore our most sought-after career tracks designed to take your skills to new heights. Experience comprehensive learning curated by industry experts and unlock your full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Brain, title: "AI & Machine Learning", placements: "1200+", color: "primary" },
            { icon: Zap, title: "Full Stack Development", placements: "2500+", color: "accent" },
            { icon: Target, title: "Data Science & Analytics", placements: "1800+", color: "secondary" },
            { icon: Rocket, title: "Product Management", placements: "900+", color: "primary" },
          ].map((category, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 hover:shadow-xl transition-all hover:scale-105">
              <div className={`bg-gradient-${category.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-4">{category.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-foreground">{category.placements}</span>
                <span className="text-sm text-muted-foreground">Placements</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* AI Lab Showcase */}
      <div className="bg-white/50 backdrop-blur-sm py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={aiLab} 
                alt="Preppright AI Learning Lab" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                India&apos;s Most Advanced <span className="gradient-text">AI Learning Lab</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Step into the future with our state-of-the-art 4D AI Lab, where virtual reality meets real-world learning. Experience hands-on training with holographic displays, AR mentorship, and live coding environments designed to prepare you for tomorrow&apos;s jobs.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Virtual Reality Lab Simulations",
                  "AR-Powered Mentor Guidance",
                  "Real-time Code Collaboration",
                  "Industry-Standard Tools & Frameworks",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-primary/20 rounded-full p-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold px-8 py-6"
                onClick={() => navigate("/dashboard/lab")}
              >
                Explore Our Labs
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs & Internships Section */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-6">
              <Briefcase className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">1000+ Fresh Opportunities Weekly</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Jobs & Internships for Freshers 🚀
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Auto-curated positions from top job portals. Real opportunities for freshers & paid internships - No fake postings!
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground rounded-xl font-semibold px-8 py-6"
              onClick={() => navigate("/jobs")}
            >
              Explore Opportunities
              <Briefcase className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 text-center hover:shadow-xl transition-all">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground font-medium">Fresh Job Postings This Week</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 text-center hover:shadow-xl transition-all">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground font-medium">Paid Internship Opportunities</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 text-center hover:shadow-xl transition-all">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground font-medium">Auto-Updated from Job Portals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-white/50 backdrop-blur-sm py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Why Choose <span className="gradient-text">Preppright 4D AI Lab?</span>
            </h2>
            <p className="text-xl text-foreground font-semibold max-w-4xl mx-auto leading-relaxed">
              Leave the Technology to us, give your commitment & dedication. We will make you successful.
            </p>
          </div>

          {/* Career Transformation Courses */}
          <div className="mb-12">
            <h3 className="text-3xl font-display font-bold text-foreground text-center mb-12">
              Career Transformation Courses <span className="text-primary">(Offline & ONLINE)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Python Full Stack */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Python Full Stack with GenAI & DevOps</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Tech: Python, Django, Generative AI, Machine Learning, DB/SQL
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Duration:</span>
                    <span className="font-semibold text-foreground">400+ Hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Package Range:</span>
                    <span className="font-bold text-primary">3 - 12 LPA</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => navigate("/auth")}>
                  Explore More
                </Button>
              </div>

              {/* Java Full Stack */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Java Full Stack with GenAI & DevOps</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Tech: Java, DSA, DB/SQL, Spring Boot, Hibernate, AWS, Kubernetes, Docker
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Duration:</span>
                    <span className="font-semibold text-foreground">500+ Hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Package Range:</span>
                    <span className="font-bold text-primary">3 - 12 LPA</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => navigate("/auth")}>
                  Explore More
                </Button>
              </div>

              {/* MERN Full Stack */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">MERN Full Stack Development</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Tech: HTML, CSS, JavaScript, React.js, Node.js, MongoDB, AWS, Kubernetes, Docker
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Duration:</span>
                    <span className="font-semibold text-foreground">300+ Hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Package Range:</span>
                    <span className="font-bold text-primary">3 - 7 LPA</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => navigate("/auth")}>
                  Explore More
                </Button>
              </div>

              {/* Programming */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Programming</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Tech: Extensive programming from zero-hero with 500+ programs, LeetCode & HackerRank programs
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Duration:</span>
                    <span className="font-semibold text-foreground">80 Hours</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => navigate("/auth")}>
                  Explore More
                </Button>
              </div>

              {/* DSA */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">DSA</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Tech: Arrays, Lists, Set, Hashing, Maps & Graphs
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Duration:</span>
                    <span className="font-semibold text-foreground">30 Hours</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => navigate("/auth")}>
                  Explore More
                </Button>
              </div>

              {/* SQL/DB */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">SQL/DB</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Tech: Oracle, MongoDB
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Duration:</span>
                    <span className="font-semibold text-foreground">80 Hours</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => navigate("/auth")}>
                  Explore More
                </Button>
              </div>

              {/* API, Microservices, Git & Maven */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">API, Microservices, Git & Maven</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Master API development, microservices architecture, version control with Git, and build automation with Maven
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Duration:</span>
                    <span className="font-semibold text-foreground">25 Hours</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => navigate("/auth")}>
                  Explore More
                </Button>
              </div>

              {/* DevOps with AWS Cloud */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-rose-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">DevOps with AWS Cloud</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Tech: AWS, Kubernetes, Docker, CI-CD Pipeline with Jenkins
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Duration:</span>
                    <span className="font-semibold text-foreground">200 Hours</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => navigate("/auth")}>
                  Explore More
                </Button>
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 w-full max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-all animate-scale-in">
        
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
          className="min-h-32 p-5 rounded-xl bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none font-body"
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
        <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-primary/10 text-base text-foreground min-h-[120px] whitespace-pre-wrap font-body leading-relaxed">
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
