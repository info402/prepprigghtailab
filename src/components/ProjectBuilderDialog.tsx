import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Rocket, Github, Clock, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface ProjectBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate?: Template | null;
  onProjectCreated?: () => void;
}

export const ProjectBuilderDialog = ({ 
  open, 
  onOpenChange, 
  selectedTemplate,
  onProjectCreated 
}: ProjectBuilderDialogProps) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedTemplate && open) {
      setProjectName(selectedTemplate.name);
      setDescription(selectedTemplate.description);
    }
  }, [selectedTemplate, open]);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a project",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("user_projects").insert({
        user_id: user.id,
        template_id: selectedTemplate?.id || null,
        project_name: projectName,
        description: description || null,
        tech_stack: selectedTemplate?.tech_stack || [],
        github_repo_url: githubRepo || null,
        status: "in_progress",
        completion_percentage: 0,
      });

      if (error) throw error;

      toast({
        title: "Project created! 🎉",
        description: "Your project has been initialized. Start building!",
      });

      onOpenChange(false);
      setProjectName("");
      setDescription("");
      setGithubRepo("");
      onProjectCreated?.();
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Failed to create project",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!selectedTemplate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <span>{selectedTemplate.icon}</span>
            Start Building: {selectedTemplate.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup Project</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Difficulty</h4>
                  <Badge variant={
                    selectedTemplate.difficulty === "beginner" ? "default" :
                    selectedTemplate.difficulty === "intermediate" ? "secondary" : "destructive"
                  }>
                    {selectedTemplate.difficulty}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Estimated Time
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.estimated_time}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tech_stack.map((tech) => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Key Features</h4>
                <ul className="space-y-2">
                  {selectedTemplate.features.map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What makes your project unique?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="github">GitHub Repository (Optional)</Label>
                <div className="flex gap-2">
                  <Github className="h-4 w-4 mt-3 text-muted-foreground" />
                  <Input
                    id="github"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Link your GitHub repo to automatically update your portfolio
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  What happens next?
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Your project will be added to your dashboard</li>
                  <li>• Get AI mentor support for implementation</li>
                  <li>• Deploy to Netlify/Vercel with one click</li>
                  <li>• Showcase on your Preppright portfolio</li>
                </ul>
              </div>

              <Button 
                onClick={handleCreateProject} 
                disabled={isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating ? "Creating..." : "Start Building 🚀"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
