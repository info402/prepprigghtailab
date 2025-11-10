import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CodeEditor } from "@/components/CodeEditor";
import { DeployButton } from "@/components/DeployButton";
import { Save, Code2, Rocket, FileCode, Eye, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

interface ProjectEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: UserProject | null;
  onProjectUpdated?: () => void;
}

const DEFAULT_CODE: Record<string, string> = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to My Project</h1>
        <p>Start building your amazing project!</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
  css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
}

h1 {
    color: #667eea;
    margin-bottom: 1rem;
}`,
  javascript: `// Your JavaScript code here
console.log('Project loaded!');

// Example function
function greet(name) {
    return \`Hello, \${name}!\`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log(greet('Developer'));
});`,
};

export const ProjectEditorDialog = ({ 
  open, 
  onOpenChange, 
  project,
  onProjectUpdated 
}: ProjectEditorDialogProps) => {
  const [activeFile, setActiveFile] = useState<"html" | "css" | "javascript">("html");
  const [code, setCode] = useState<Record<string, string>>(DEFAULT_CODE);
  const [isSaving, setIsSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      // Load saved code from localStorage or use defaults
      const savedCode = localStorage.getItem(`project-${project.id}-code`);
      if (savedCode) {
        setCode(JSON.parse(savedCode));
      } else {
        const defaultWithName = {
          ...DEFAULT_CODE,
          html: DEFAULT_CODE.html.replace('My Project', project.project_name),
        };
        setCode(defaultWithName);
      }
    }
  }, [project]);

  // Update preview in real-time
  useEffect(() => {
    updatePreview();
  }, [code]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (iframeDoc) {
      const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${code.css}</style>
        </head>
        <body>
          ${code.html}
          <script>${code.javascript}<\/script>
        </body>
        </html>
      `;
      
      iframeDoc.open();
      iframeDoc.write(fullHTML);
      iframeDoc.close();
    }
  };

  const handleRefreshPreview = () => {
    setPreviewKey(prev => prev + 1);
    updatePreview();
    toast({
      title: "Preview refreshed! 🔄",
      description: "Your changes are now visible",
    });
  };

  const handleSaveCode = () => {
    if (!project) return;
    
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem(`project-${project.id}-code`, JSON.stringify(code));
      
      toast({
        title: "Code saved! 💾",
        description: "Your changes have been saved locally",
      });

      // Update project completion
      const completion = Math.min(project.completion_percentage + 10, 100);
      supabase
        .from("user_projects")
        .update({ completion_percentage: completion })
        .eq("id", project.id)
        .then(() => {
          onProjectUpdated?.();
        });
    } catch (error) {
      console.error("Error saving code:", error);
      toast({
        title: "Failed to save",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCode = () => {
    if (!project) return;

    // Create downloadable files
    const files = [
      { name: 'index.html', content: code.html },
      { name: 'styles.css', content: code.css },
      { name: 'script.js', content: code.javascript },
    ];

    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });

    toast({
      title: "Files exported! 📦",
      description: "Check your downloads folder",
    });
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] overflow-hidden flex flex-col p-3">
        <DialogHeader className="pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              {project.project_name}
              <Badge variant="outline" className="ml-2">
                <Eye className="h-3 w-3 mr-1" />
                Live Preview
              </Badge>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={
                project.status === "deployed" ? "default" :
                project.status === "completed" ? "secondary" : "outline"
              }>
                {project.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-5 gap-3">
          {/* Code Editor Section */}
          <div className="xl:col-span-2 flex flex-col min-h-0">
            <Tabs value={activeFile} onValueChange={(v) => setActiveFile(v as any)} className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <TabsList>
                  <TabsTrigger value="html">
                    <FileCode className="h-4 w-4 mr-1" />
                    HTML
                  </TabsTrigger>
                  <TabsTrigger value="css">
                    <FileCode className="h-4 w-4 mr-1" />
                    CSS
                  </TabsTrigger>
                  <TabsTrigger value="javascript">
                    <FileCode className="h-4 w-4 mr-1" />
                    JavaScript
                  </TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleExportCode}>
                    Export Files
                  </Button>
                  <Button size="sm" onClick={handleSaveCode} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <TabsContent value="html" className="h-full m-0">
                  <CodeEditor
                    value={code.html}
                    onChange={(value) => setCode({ ...code, html: value })}
                    language="javascript"
                    starterCode={DEFAULT_CODE.html}
                  />
                </TabsContent>
                <TabsContent value="css" className="h-full m-0">
                  <CodeEditor
                    value={code.css}
                    onChange={(value) => setCode({ ...code, css: value })}
                    language="javascript"
                    starterCode={DEFAULT_CODE.css}
                  />
                </TabsContent>
                <TabsContent value="javascript" className="h-full m-0">
                  <CodeEditor
                    value={code.javascript}
                    onChange={(value) => setCode({ ...code, javascript: value })}
                    language="javascript"
                    starterCode={DEFAULT_CODE.javascript}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Live Preview Section */}
          <div className={`${isPreviewMaximized ? 'xl:col-span-4' : 'xl:col-span-2'} flex flex-col min-h-0 transition-all`}>
            <Card className="flex-1 flex flex-col min-h-0 border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Live Preview
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleRefreshPreview}
                      title="Refresh preview"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setIsPreviewMaximized(!isPreviewMaximized)}
                      title={isPreviewMaximized ? "Minimize" : "Maximize"}
                    >
                      {isPreviewMaximized ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 p-0 min-h-0">
                <iframe
                  key={previewKey}
                  ref={iframeRef}
                  title="Live Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                  style={{ 
                    background: 'white',
                    minHeight: '400px'
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Project Info & Actions */}
          <div className={`${isPreviewMaximized ? 'hidden' : 'block'} space-y-4 overflow-y-auto`}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Progress</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.completion_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{project.completion_percentage}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Deploy Your Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ready to deploy? Export your files and deploy to hosting platforms.
                </p>
                
                {project.github_repo_url ? (
                  <DeployButton
                    projectId={project.id}
                    githubUrl={project.github_repo_url}
                    projectName={project.project_name}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    💡 Add a GitHub repository URL in your project settings to enable one-click deployment
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <p className="text-xs font-semibold">Deployment Options:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Netlify (Recommended)</li>
                    <li>• Vercel</li>
                    <li>• Render</li>
                    <li>• GitHub Pages</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold mb-2">💡 Quick Tips</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Save your work regularly</li>
                  <li>• Export files before deploying</li>
                  <li>• Test in different browsers</li>
                  <li>• Use the AI Mentor for help</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};