import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, Video, Briefcase, Award, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    resumes: 0,
    interviews: 0,
    projects: 0,
    certificates: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [resumes, interviews, projects, certificates] = await Promise.all([
        supabase.from("resumes").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("interview_attempts").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("projects").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("certificates").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);

      setStats({
        resumes: resumes.count || 0,
        interviews: interviews.count || 0,
        projects: projects.count || 0,
        certificates: certificates.count || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: FileText, label: "Resumes Created", value: stats.resumes, color: "text-blue-500" },
    { icon: Video, label: "Interviews Done", value: stats.interviews, color: "text-green-500" },
    { icon: Briefcase, label: "Projects", value: stats.projects, color: "text-purple-500" },
    { icon: Award, label: "Certificates", value: stats.certificates, color: "text-yellow-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Your AI Lab
          </h1>
          <p className="text-muted-foreground">
            Your personalized dashboard for career growth and AI-powered learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-primary/30 bg-card/70 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with AI-powered tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/dashboard/chat" className="block p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <h3 className="font-semibold">AI Chat Playground</h3>
                <p className="text-sm text-muted-foreground">Talk with multiple AI models</p>
              </a>
              <a href="/dashboard/resume" className="block p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <h3 className="font-semibold">Build Your Resume</h3>
                <p className="text-sm text-muted-foreground">Create ATS-friendly resumes</p>
              </a>
              <a href="/dashboard/interview" className="block p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <h3 className="font-semibold">Practice Interview</h3>
                <p className="text-sm text-muted-foreground">Get AI feedback on your answers</p>
              </a>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Your Progress
              </CardTitle>
              <CardDescription>Keep up the momentum!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Profile Completion</span>
                  <span className="text-muted-foreground">60%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Skills Assessment</span>
                  <span className="text-muted-foreground">40%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Career Roadmap</span>
                  <span className="text-muted-foreground">25%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
