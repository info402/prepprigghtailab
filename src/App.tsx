import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ChatPlayground from "./pages/ChatPlayground";
import ResumeBuilder from "./pages/ResumeBuilder";
import MockInterview from "./pages/MockInterview";
import CareerPath from "./pages/CareerPath";
import Jobs from "./pages/Jobs";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/chat" element={<ChatPlayground />} />
          <Route path="/dashboard/resume" element={<ResumeBuilder />} />
          <Route path="/dashboard/interview" element={<MockInterview />} />
          <Route path="/dashboard/career" element={<CareerPath />} />
          <Route path="/dashboard/jobs" element={<Jobs />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path="/dashboard/certificates" element={<Certificates />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
