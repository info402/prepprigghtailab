import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, Zap, Rocket, Brain, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Sparkles },
    { name: "AI Lab", path: "/", icon: Brain },
    { name: "Features", path: "/features", icon: Zap },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card backdrop-blur-2xl border-b border-border shadow-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-primary shadow-glow group-hover:shadow-glow-lg group-hover:scale-110 transition-all">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold gradient-text leading-none">
                Preppright
              </span>
              <span className="text-[10px] text-muted-foreground leading-none font-body uppercase tracking-wider">
                4D AI Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`relative group font-semibold transition-all ${
                      isActive(item.path)
                        ? "text-primary bg-primary/20 glow-effect"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive(item.path) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary shadow-glow" />
                    )}
                  </Button>
                </Link>
              );
            })}
            <Button 
              onClick={() => navigate("/auth")}
              className="ml-6 bg-gradient-primary hover:opacity-90 shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all font-bold"
            >
              Join Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all hover:scale-110"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border glass-card backdrop-blur-2xl">
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-5 py-4 rounded-xl transition-all font-semibold ${
                    isActive(item.path)
                      ? "bg-primary/20 text-primary glow-effect"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Button 
              onClick={() => navigate("/auth")}
              className="w-full mt-6 bg-gradient-primary hover:opacity-90 shadow-glow font-bold py-6"
            >
              Join Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
