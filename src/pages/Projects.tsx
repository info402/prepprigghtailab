import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { FolderGit2, Github, ExternalLink, Search, Sparkles, Rocket, CheckCircle2, Clock, Trash2, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectBuilderDialog } from "@/components/ProjectBuilderDialog";
import { EnhancedAIMentor } from "@/components/EnhancedAIMentor";
import { DeployButton } from "@/components/DeployButton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

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

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tech_stack: string[];
  difficulty: string;
  features: string[];
  estimated_time: string;
  icon: string;
}

interface UserProject {
  id: string;
  project_name: string;
  description: string | null;
  tech_stack: string[];
  github_repo_url: string | null;
  deployed_url: string | null;
  deployment_platform: string | null;
  status: string;
  completion_percentage: number;
  created_at: string;
  template_id: string | null;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAIMentor, setShowAIMentor] = useState(false);
  const [aiMentorContext, setAiMentorContext] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [projectsRes, categoriesRes, toolsRes, templatesRes, userProjectsRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("project_categories").select("*"),
      supabase.from("project_tools").select("*"),
      supabase.from("project_templates").select("*").eq("is_active", true),
      supabase.from("user_projects").select("*").order("created_at", { ascending: false })
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (toolsRes.data) setTools(toolsRes.data);
    if (templatesRes.data) setTemplates(templatesRes.data);
    if (userProjectsRes.data) setUserProjects(userProjectsRes.data);
    setIsLoading(false);
  };

  const handleStartBuilding = (template: Template) => {
    setSelectedTemplate(template);
    setShowBuilder(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("user_projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "Your project has been removed",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleOpenAIMentor = (project: UserProject) => {
    setAiMentorContext({
      name: project.project_name,
      description: project.description || "",
      techStack: project.tech_stack,
    });
    setShowAIMentor(true);
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
                AI Project Builder Dashboard 🚀
              </h1>
              <p className="text-muted-foreground">
                Build, Deploy & Showcase - Your Complete Project Hub
              </p>
            </div>
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

        <Tabs defaultValue="my-projects" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="my-projects">My Projects ({userProjects.length})</TabsTrigger>
            <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
            <TabsTrigger value="showcase">Showcase ({filteredProjects.length})</TabsTrigger>
            <TabsTrigger value="tools">Tools ({tools.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="space-y-6">
            {userProjects.length === 0 ? (
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
                <CardContent className="py-12 text-center space-y-4">
                  <Rocket className="h-16 w-16 mx-auto text-primary animate-pulse" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Start Your First Project!</h3>
                    <p className="text-muted-foreground mb-6">
                      Choose from our curated templates and start building with AI guidance
                    </p>
                    <Button size="lg" onClick={() => {
                      const tab = document.querySelector('[value="templates"]') as HTMLElement;
                      tab?.click();
                    }}>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Browse Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project) => (
                  <Card key={project.id} className="border-primary/30 hover:border-primary transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{project.project_name}</CardTitle>
                          <Badge variant={
                            project.status === "deployed" ? "default" :
                            project.status === "completed" ? "secondary" : "outline"
                          }>
                            {project.status}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{project.completion_percentage}%</span>
                        </div>
                        <Progress value={project.completion_percentage} />
                      </div>
                      {project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tech_stack.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.tech_stack.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.tech_stack.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {project.github_repo_url && (
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <a href={project.github_repo_url} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-1" />
                              Repo
                            </a>
                          </Button>
                        )}
                        <DeployButton
                          projectId={project.id}
                          githubUrl={project.github_repo_url || undefined}
                          projectName={project.project_name}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenAIMentor(project)}
                        className="w-full"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Ask AI Mentor
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="border-primary/30 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{template.icon}</span>
                      {template.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant={
                        template.difficulty === "beginner" ? "default" :
                        template.difficulty === "intermediate" ? "secondary" : "destructive"
                      }>
                        {template.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {template.estimated_time}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {template.tech_stack.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tech_stack.length - 3}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => handleStartBuilding(template)}
                      className="w-full"
                      size="sm"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Start Building
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="showcase" className="space-y-6">
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
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

      <ProjectBuilderDialog
        open={showBuilder}
        onOpenChange={setShowBuilder}
        selectedTemplate={selectedTemplate}
        onProjectCreated={fetchData}
      />

      <EnhancedAIMentor
        open={showAIMentor}
        onOpenChange={setShowAIMentor}
        projectContext={aiMentorContext}
      />
    </DashboardLayout>
  );
};

export default Projects;