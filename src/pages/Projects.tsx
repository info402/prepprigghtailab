import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { FolderGit2, Github, ExternalLink, Search, Sparkles, BookOpen, Wrench, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AIMentorDialog } from "@/components/AIMentorDialog";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  user_id: string;
  is_featured: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  tool_type: string;
  documentation_url: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAIMentor, setShowAIMentor] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [projectsRes, categoriesRes, toolsRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("project_categories").select("*"),
      supabase.from("project_tools").select("*")
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (toolsRes.data) setTools(toolsRes.data);
    setIsLoading(false);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredProjects = filteredProjects.filter(p => p.is_featured);
  const regularProjects = filteredProjects.filter(p => !p.is_featured);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Project Lab 🚀
              </h1>
              <p className="text-muted-foreground">
                110+ Real-World Projects - Build on Preppright's 4D AI Lab
              </p>
            </div>
            <Dialog open={showAIMentor} onOpenChange={setShowAIMentor}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Mentor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">🤖 AI Project Mentor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2">Get Started with AI Guidance</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose any project and get instant AI mentor support:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                          <span>Step-by-step implementation guide</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                          <span>Code debugging and optimization tips</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                          <span>Architecture recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                          <span>Real-time doubt resolution</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex-col items-start">
                      <BookOpen className="h-5 w-5 mb-2" />
                      <span className="font-semibold">Learning Path</span>
                      <span className="text-xs text-muted-foreground">Get personalized roadmap</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col items-start">
                      <Wrench className="h-5 w-5 mb-2" />
                      <span className="font-semibold">Debug Help</span>
                      <span className="text-xs text-muted-foreground">Fix errors with AI</span>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search 110+ projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Projects
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All ({filteredProjects.length})</TabsTrigger>
            <TabsTrigger value="featured">Featured ({featuredProjects.length})</TabsTrigger>
            <TabsTrigger value="tools">Dev Tools ({tools.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <FolderGit2 className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <FolderGit2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No projects found</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {featuredProjects.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">⭐ Featured Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredProjects.map((project) => (
                        <Card key={project.id} className="border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm hover:border-primary transition-all hover:shadow-lg">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-xl">{project.title}</CardTitle>
                              <Badge variant="default" className="ml-2">Featured</Badge>
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
                            <AIMentorDialog />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">🎯 All Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularProjects.map((project) => (
                      <Card key={project.id} className="border-primary/30 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-all">
                        <CardHeader>
                          <CardTitle className="text-xl">{project.title}</CardTitle>
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
                          <AIMentorDialog />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.map((tech) => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
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
                    <AIMentorDialog />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <Card key={tool.id} className="border-primary/30 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <Badge variant="outline" className="w-fit">{tool.tool_type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={tool.documentation_url} target="_blank" rel="noopener noreferrer">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Documentation
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Projects;