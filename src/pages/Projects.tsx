import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FolderGit2, Github, ExternalLink, Plus, Wrench, BookOpen, Sparkles } from "lucide-react";
import { ProjectFilters } from "@/components/ProjectFilters";
import { AIMentorDialog } from "@/components/AIMentorDialog";
import { AdminProjectDialog } from "@/components/AdminProjectDialog";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  user_id: string | null;
  is_featured?: boolean;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([]);
  const [tools, setTools] = useState<Array<{ name: string; description: string; documentation_url: string }>>([]);

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    
    // Fetch categories
    supabase.from("project_categories").select("*").then(({ data }) => {
      if (data) setCategories(data);
    });
    
    // Fetch tools
    supabase.from("project_tools").select("*").limit(6).then(({ data }) => {
      if (data) setTools(data);
    });
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.tech_stack?.some(tech => tech.toLowerCase().includes(search.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Lab Projects Library
              </h1>
              <p className="text-muted-foreground">
                110+ Real-world projects to learn and build your portfolio
              </p>
            </div>
            <div className="flex gap-2">
              <AIMentorDialog />
              <AdminProjectDialog onProjectAdded={fetchProjects} />
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-primary" />
                  Project Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{projects.length}+</p>
                <p className="text-sm text-muted-foreground">Industry-ready projects across all domains</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/30 bg-gradient-to-br from-accent/10 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-accent" />
                  Dev Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">{tools.length}+</p>
                <p className="text-sm text-muted-foreground">Professional tools and frameworks</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/30 bg-gradient-to-br from-secondary/20 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Assistance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">AI mentor to guide your learning</p>
              </CardContent>
            </Card>
          </div>

          {/* Tools Section */}
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Development Tools & Resources
              </CardTitle>
              <CardDescription>
                Access industry-standard tools to build your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.documentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors text-center"
                  >
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold text-sm">{tool.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <ProjectFilters
            search={search}
            onSearchChange={setSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <FolderGit2 className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <FolderGit2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No projects found. Try different filters!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
              <Card key={project.id} className="border-primary/30 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                    {project.is_featured && (
                      <Badge className="bg-gradient-to-r from-primary to-accent">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button size="sm" asChild className="flex-1">
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
