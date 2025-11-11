import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, ExternalLink, MapPin, RefreshCw, Search, Filter, Plus, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostJobDialog } from "@/components/PostJobDialog";
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
  relevance_score?: number;
  match_reason?: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const { toast } = useToast();

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

  const handleFetchJobs = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-jobs', {
        body: { 
          query: "software developer intern India",
          location: "India",
          numPages: 2
        }
      });

      if (error) throw error;

      toast({
        title: "Jobs Fetched Successfully! 🎉",
        description: `Added ${data.jobs?.length || 0} new opportunities`,
      });

      // Refresh the jobs list
      const { data: updatedJobs } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (updatedJobs) setJobs(updatedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error Fetching Jobs",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleJobPosted = async () => {
    const { data: updatedJobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (updatedJobs) setJobs(updatedJobs);
  };

  const handleAiSearch = async () => {
    if (!aiSearchQuery.trim()) {
      toast({
        title: "Enter a search query",
        description: "Describe what kind of job you're looking for",
        variant: "destructive"
      });
      return;
    }

    setIsAiSearching(true);
    setAiSearchActive(false);

    try {
      const { data, error } = await supabase.functions.invoke('ai-job-search', {
        body: { query: aiSearchQuery }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.results && data.results.length > 0) {
        setJobs(data.results);
        setAiExplanation(data.explanation || "");
        setAiSearchActive(true);
        
        toast({
          title: "AI Search Complete! ✨",
          description: `Found ${data.results.length} relevant opportunities`,
        });
      } else {
        toast({
          title: "No matches found",
          description: data.explanation || "Try a different search query",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('AI search error:', error);
      toast({
        title: "AI Search Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleClearAiSearch = async () => {
    setAiSearchActive(false);
    setAiSearchQuery("");
    setAiExplanation("");
    
    // Reload all jobs
    const { data: updatedJobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (updatedJobs) setJobs(updatedJobs);
  };

  const filteredJobs = aiSearchActive 
    ? jobs // When AI search is active, show AI results without additional filtering
    : jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              job.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || job.type === filterType;
        const matchesCategory = filterCategory === "all" || job.category === filterCategory;
        return matchesSearch && matchesType && matchesCategory;
      });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Jobs & Internships 💼
            </h1>
            <p className="text-muted-foreground">
              {aiSearchActive 
                ? `🤖 AI-powered results for: "${aiSearchQuery}"` 
                : "🔥 Fresh paid opportunities from last 24h • Consulting & Analytics focus"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsPostDialogOpen(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
            <Button 
              onClick={handleFetchJobs} 
              disabled={isFetching}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Fetching Jobs...' : 'Fetch Latest Jobs'}
            </Button>
          </div>
        </div>

        {/* AI Search Bar - BETA */}
        <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h3 className="font-semibold text-lg">AI-Powered Job Search</h3>
                <Badge variant="secondary" className="text-xs">BETA</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Describe your ideal role in natural language. AI will understand your preferences and match you with the best opportunities!
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder='Try: "remote software internship with good pay" or "consulting role in Bangalore"'
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  className="flex-1"
                  disabled={isAiSearching}
                />
                {aiSearchActive ? (
                  <Button 
                    onClick={handleClearAiSearch}
                    variant="outline"
                  >
                    Clear AI Search
                  </Button>
                ) : (
                  <Button 
                    onClick={handleAiSearch}
                    disabled={isAiSearching || !aiSearchQuery.trim()}
                    className="bg-gradient-to-r from-primary to-accent min-w-[140px]"
                  >
                    {isAiSearching ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Search
                      </>
                    )}
                  </Button>
                )}
              </div>
              {aiExplanation && aiSearchActive && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm">
                    <Sparkles className="h-4 w-4 inline mr-1 text-primary" />
                    <span className="font-semibold">AI Insight:</span> {aiExplanation}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px]">
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
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Consulting">🎯 Consulting</SelectItem>
              <SelectItem value="Data Analytics">📊 Data Analytics</SelectItem>
              <SelectItem value="Business Intelligence">💡 Business Intelligence</SelectItem>
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
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {jobs.length === 0 
                  ? "No jobs available yet. Click 'Fetch Latest Jobs' to get started!" 
                  : "No jobs match your filters. Try different criteria."}
              </p>
              {jobs.length === 0 && (
                <Button onClick={handleFetchJobs} disabled={isFetching}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                  Fetch Jobs Now
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {jobs.length} opportunities
            </p>
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="border-primary/30 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-lg">
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
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-2xl">{job.title}</CardTitle>
                              {aiSearchActive && 'relevance_score' in job && (
                                <Badge variant="secondary" className="bg-primary/20 text-primary">
                                  {job.relevance_score}% Match
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-lg font-semibold flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              {job.company}
                            </CardDescription>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            {aiSearchActive && 'match_reason' in job && (
                              <p className="text-sm text-primary/80 italic">
                                ✨ {job.match_reason}
                              </p>
                            )}
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
                      onClick={async () => {
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session) {
                          toast({
                            title: "Login Required",
                            description: "Please sign in to apply for jobs",
                            variant: "destructive"
                          });
                          return;
                        }
                        window.open(job.apply_url, '_blank');
                      }}
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
      
      <PostJobDialog 
        open={isPostDialogOpen}
        onOpenChange={setIsPostDialogOpen}
        onJobPosted={handleJobPosted}
      />
    </DashboardLayout>
  );
};

export default Jobs;
