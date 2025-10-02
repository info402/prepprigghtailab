import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, ExternalLink, MapPin } from "lucide-react";

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
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Jobs & Internships
          </h1>
          <p className="text-muted-foreground">
            Find your next opportunity
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No jobs available yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="border-primary/30 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <CardDescription className="text-lg font-semibold">
                        {job.company}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge>{job.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{job.description}</p>
                  {job.salary_range && (
                    <p className="font-semibold">💰 {job.salary_range}</p>
                  )}
                  <Button asChild className="w-full">
                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
