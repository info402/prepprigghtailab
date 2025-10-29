import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ChatPlayground from "./pages/ChatPlayground";
import MockInterview from "./pages/MockInterview";
import Jobs from "./pages/Jobs";
import PublicJobs from "./pages/PublicJobs";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CodingChallenges from "./pages/CodingChallenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import Competitions from "./pages/Competitions";
import Leaderboard from "./pages/Leaderboard";
import VirtualLab from "./pages/VirtualLab";
import DepartmentLab from "./pages/DepartmentLab";
import PurposeEngine from "./pages/PurposeEngine";
import MetaProfile from "./pages/MetaProfile";
import RealWorldMissions from "./pages/RealWorldMissions";
import CareerTransformation from "./pages/CareerTransformation";
import HostEvent from "./pages/HostEvent";
import StudentEvents from "./pages/StudentEvents";
import MyVouchers from "./pages/MyVouchers";
import AdminVouchers from "./pages/AdminVouchers";
import EventDetail from "./pages/EventDetail";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/jobs" element={<PublicJobs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/chat" element={<ChatPlayground />} />
          <Route path="/dashboard/interview" element={<MockInterview />} />
          <Route path="/dashboard/jobs" element={<Jobs />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path="/dashboard/certificates" element={<Certificates />} />
          <Route path="/dashboard/pricing" element={<Pricing />} />
          <Route path="/dashboard/challenges" element={<CodingChallenges />} />
          <Route path="/dashboard/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/dashboard/competitions" element={<Competitions />} />
          <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard/lab" element={<VirtualLab />} />
          <Route path="/dashboard/lab/:departmentId" element={<DepartmentLab />} />
          <Route path="/dashboard/purpose" element={<PurposeEngine />} />
          <Route path="/dashboard/meta-profile" element={<MetaProfile />} />
          <Route path="/dashboard/missions" element={<RealWorldMissions />} />
          <Route path="/dashboard/career-transformation" element={<CareerTransformation />} />
          <Route path="/dashboard/host-event" element={<HostEvent />} />
          <Route path="/dashboard/student-events" element={<StudentEvents />} />
          <Route path="/dashboard/student-events/:id" element={<EventDetail />} />
          <Route path="/dashboard/my-vouchers" element={<MyVouchers />} />
          <Route path="/dashboard/admin/vouchers" element={<AdminVouchers />} />
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
