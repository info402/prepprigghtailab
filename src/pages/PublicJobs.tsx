import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, ExternalLink, MapPin, Search, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { CompanyLogo } from "@/lib/companyLogos";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  category: string;
  salary_range: string;
  apply_url: string;
  logo_url?: string;
}

const PublicJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  const handleApply = async (applyUrl: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please sign in to apply for jobs",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    window.open(applyUrl, '_blank');
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || job.type === filterType;
    const matchesCategory = filterCategory === "all" || job.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Jobs & Internships 💼
              </h1>
              <p className="text-muted-foreground text-lg">
                1000+ Fresh Opportunities for Freshers & Paid Internships
              </p>
            </div>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-accent"
              size="lg"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In to Apply
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/90 backdrop-blur-sm"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/90 backdrop-blur-sm">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Intern">Internship</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-white/90 backdrop-blur-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Software Development">Software Development</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Product Management">Product Management</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
              <p className="text-muted-foreground">Loading opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card className="border-primary/30 bg-white/90 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {jobs.length === 0 
                    ? "No jobs available yet. Check back soon!" 
                    : "No jobs match your filters. Try different criteria."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {jobs.length} opportunities
              </p>
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="border-primary/30 bg-white/90 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-xl">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <CompanyLogo 
                          companyName={job.company} 
                          logoUrl={job.logo_url}
                          size="lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <CardTitle className="text-2xl">{job.title}</CardTitle>
                              <CardDescription className="text-lg font-semibold flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                {job.company}
                              </CardDescription>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge variant="secondary">{job.type}</Badge>
                              <Badge>{job.category}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground line-clamp-3">{job.description}</p>
                      {job.salary_range && job.salary_range !== 'Not specified' && (
                        <p className="font-semibold text-primary">💰 {job.salary_range}</p>
                      )}
                      <Button 
                        onClick={() => handleApply(job.apply_url)}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicJobs;
