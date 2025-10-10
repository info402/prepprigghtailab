import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, Zap, Rocket, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import preppLogo from "@/assets/preppright-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Sparkles },
    { name: "AI Lab", path: "/", icon: Brain },
    { name: "Features", path: "/features", icon: Zap },
    { name: "Get Started", path: "/", icon: Rocket },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src={preppLogo} 
                alt="Preppright Logo" 
                className="h-10 w-auto transition-transform group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Preppright
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`relative group ${
                      isActive(item.path)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive(item.path) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                    )}
                  </Button>
                </Link>
              );
            })}
            <Button 
              onClick={() => navigate("/auth")}
              className="ml-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/40"
            >
              Join Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-primary/20 bg-black/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <Button 
              onClick={() => navigate("/auth")}
              className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/40"
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
