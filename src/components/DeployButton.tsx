import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Rocket, ExternalLink } from "lucide-react";

interface DeployButtonProps {
  projectId: string;
  githubUrl?: string;
  projectName: string;
}

export const DeployButton = ({ projectId, githubUrl, projectName }: DeployButtonProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  const handleDeploy = async (platform: "netlify" | "vercel" | "render") => {
    if (!githubUrl) {
      toast({
        title: "GitHub repository required",
        description: "Please add your GitHub repository URL first",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);

    try {
      // Extract repo from GitHub URL
      const repoMatch = githubUrl.match(/github\.com\/(.+?)\/(.+?)(?:\.git)?$/);
      if (!repoMatch) {
        throw new Error("Invalid GitHub URL");
      }

      const [, owner, repo] = repoMatch;
      const cleanRepo = repo.replace(/\.git$/, "");

      let deployUrl = "";

      switch (platform) {
        case "netlify":
          // Netlify deploy button URL
          deployUrl = `https://app.netlify.com/start/deploy?repository=https://github.com/${owner}/${cleanRepo}`;
          break;
        case "vercel":
          // Vercel deploy button URL
          deployUrl = `https://vercel.com/new/clone?repository-url=https://github.com/${owner}/${cleanRepo}`;
          break;
        case "render":
          // Render deploy URL
          deployUrl = `https://render.com/deploy?repo=https://github.com/${owner}/${cleanRepo}`;
          break;
      }

      // Update project with deployment info
      const { error } = await supabase
        .from("user_projects")
        .update({
          deployment_platform: platform,
          status: "deployed",
          last_deployed_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) throw error;

      // Open deployment URL in new tab
      window.open(deployUrl, "_blank");

      toast({
        title: `Deploying to ${platform.charAt(0).toUpperCase() + platform.slice(1)}! 🚀`,
        description: "Follow the steps in the new tab to complete deployment",
      });
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          size="sm" 
          disabled={isDeploying || !githubUrl}
          className="gap-2"
        >
          <Rocket className="h-4 w-4" />
          {isDeploying ? "Deploying..." : "Deploy"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleDeploy("netlify")} className="cursor-pointer">
          <ExternalLink className="h-4 w-4 mr-2" />
          Deploy to Netlify
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDeploy("vercel")} className="cursor-pointer">
          <ExternalLink className="h-4 w-4 mr-2" />
          Deploy to Vercel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDeploy("render")} className="cursor-pointer">
          <ExternalLink className="h-4 w-4 mr-2" />
          Deploy to Render
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
