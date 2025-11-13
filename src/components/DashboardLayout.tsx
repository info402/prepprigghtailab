import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Video,
  Briefcase,
  FolderGit2,
  Award,
  User as UserIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Code,
  Trophy,
  Coins,
  Crown,
  Calendar,
  Shield,
  TrendingUp,
  Zap,
  Brain,
} from "lucide-react";
import { useTokens } from "@/hooks/useTokens";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens, usedTokens, totalTokens, isPremium, isLoading: tokensLoading } = useTokens();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (!session) {
        navigate("/auth");
      } else {
        checkAdminStatus(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else if (session.user) {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (data?.role === "admin") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Brain, label: "Readiness Assessment", path: "/readiness-assessment" },
    { icon: Briefcase, label: "Jobs & Internships", path: "/dashboard/jobs" },
    { icon: TrendingUp, label: "Job Analytics", path: "/dashboard/job-analytics" },
    { icon: Zap, label: "Live Labs", path: "/dashboard/livelab" },
    { icon: Sparkles, label: "Purpose Engine", path: "/dashboard/purpose" },
    { icon: UserIcon, label: "Meta-Profile", path: "/dashboard/meta-profile" },
    { icon: Trophy, label: "Missions", path: "/dashboard/missions" },
    { icon: Video, label: "Mock Interview", path: "/dashboard/interview" },
    { icon: FolderGit2, label: "Projects", path: "/dashboard/projects" },
    { icon: Award, label: "Certificates", path: "/dashboard/certificates" },
    { icon: Code, label: "Coding Challenges", path: "/dashboard/challenges" },
    { icon: Trophy, label: "Competitions", path: "/dashboard/competitions" },
    { icon: Calendar, label: "Student Events", path: "/dashboard/student-events" },
    ...(isAdmin ? [
      { icon: Shield, label: "Manage Vouchers", path: "/dashboard/admin/vouchers" },
      { icon: Briefcase, label: "Manage Jobs", path: "/dashboard/admin/jobs" }
    ] : []),
    { icon: Crown, label: "Get Premium", path: "/dashboard/pricing" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-bg">
        <Sparkles className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-bg overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-card/95 backdrop-blur-md border-r border-primary/30 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Preppright
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-primary/30" />

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive ? "bg-primary/20 text-primary" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <Separator className="bg-primary/30" />

        <div className="p-3 space-y-2">
          <Link to="/dashboard/profile">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Link to="/dashboard/settings">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card/95 backdrop-blur-md border-b border-primary/30 flex items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {!tokensLoading && (
            <div className="flex items-center gap-2 ml-4">
              <Coins className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium flex items-center gap-2">
                {isPremium && (
                  <span className="flex items-center gap-1 text-primary">
                    <Crown className="h-4 w-4" />
                    Premium
                  </span>
                )}
                <span className="text-muted-foreground">
                  Used: <span className="text-foreground font-bold">{usedTokens}</span> / Remaining: <span className="text-primary font-bold">{tokens ?? 0}</span>
                </span>
              </span>
            </div>
          )}
          
          <div className="flex-1" />
          
          {!isPremium && !tokensLoading && (
            <Button 
              onClick={() => navigate('/dashboard/pricing')}
              size="sm"
              className="gap-2 bg-gradient-to-r from-primary to-accent"
            >
              <Crown className="h-4 w-4" />
              Get 1000 Tokens
            </Button>
          )}
          
          <div className="text-sm text-muted-foreground">
            {user?.email}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
