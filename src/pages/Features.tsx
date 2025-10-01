import { Brain, Target, MessageSquare, TrendingUp, Shield, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Resume Analyzer",
      description: "Get instant ATS score analysis and optimization suggestions for your resume",
      gradient: "from-chatgpt to-chatgpt-glow",
    },
    {
      icon: Target,
      title: "Smart Internship Simulator",
      description: "Practice real-world scenarios in a safe, AI-powered virtual environment",
      gradient: "from-gemini to-gemini-glow",
    },
    {
      icon: MessageSquare,
      title: "Virtual Job Interview",
      description: "Train with AI interviewers and receive personalized feedback",
      gradient: "from-claude to-claude-glow",
    },
    {
      icon: TrendingUp,
      title: "Career Roadmap Generator",
      description: "AI-generated personalized learning paths based on your goals",
      gradient: "from-huggingface to-huggingface-glow",
    },
    {
      icon: Shield,
      title: "Skills Assessment",
      description: "Comprehensive evaluation of your technical and soft skills",
      gradient: "from-primary to-accent",
    },
    {
      icon: Zap,
      title: "Real-time Mentoring",
      description: "Connect with AI-powered mentors for instant guidance",
      gradient: "from-secondary to-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">
                AI Lab Features
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge AI tools designed to transform your career journey from learning to landing your dream job
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-primary/30 bg-card/70 backdrop-blur-md hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <CardHeader>
                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/50 transition-all duration-300" />
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 backdrop-blur-xl border border-primary/30 rounded-3xl p-12 shadow-2xl">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Ready to Transform Your Career?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students already using Preppright AI Lab to accelerate their learning and career growth
              </p>
              <button className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/40 hover:scale-105 transition-all duration-200">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
