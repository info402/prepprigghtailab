import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminProjectDialog = ({ onProjectAdded }: { onProjectAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech_stack: "",
    github_url: "",
    demo_url: "",
    is_featured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const techStackArray = formData.tech_stack
        .split(",")
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      const { error } = await supabase
        .from("projects")
        .insert({
          title: formData.title,
          description: formData.description,
          tech_stack: techStackArray,
          github_url: formData.github_url || null,
          demo_url: formData.demo_url || null,
          is_featured: formData.is_featured,
          user_id: null // System project
        });

      if (error) throw error;

      toast({
        title: "Project added successfully!",
        description: "The project is now visible to all students"
      });
      
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        tech_stack: "",
        github_url: "",
        demo_url: "",
        is_featured: false
      });
      onProjectAdded();
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Failed to add project",
        description: "Please make sure you have admin permissions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          Admin: Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., AI Chatbot with NLP"
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this project does..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
            <Input
              id="tech_stack"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              placeholder="React, Node.js, MongoDB, OpenAI"
            />
          </div>
          <div>
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <Label htmlFor="demo">Demo URL</Label>
            <Input
              id="demo"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              placeholder="https://demo.example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Feature this project
            </Label>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Adding..." : "Add Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};