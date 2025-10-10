import { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  starterCode?: string;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", prism: "javascript" },
  { value: "python", label: "Python", prism: "python" },
  { value: "java", label: "Java", prism: "java" },
  { value: "cpp", label: "C++", prism: "cpp" },
  { value: "c", label: "C", prism: "c" },
];

export const CodeEditor = ({
  value,
  onChange,
  language = "javascript",
  onLanguageChange,
  starterCode = "",
}: CodeEditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  const currentLang = LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];

  const highlight = (code: string) => {
    return Prism.highlight(code, Prism.languages[currentLang.prism], currentLang.prism);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const handleReset = () => {
    onChange(starterCode);
    toast({
      title: "Reset",
      description: "Code reset to starter template",
    });
  };

  return (
    <Card
      className={`${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      } overflow-hidden`}
    >
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Language:</span>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative">
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={highlight}
          padding={16}
          style={{
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: 14,
            backgroundColor: "hsl(var(--background))",
            minHeight: isFullscreen ? "calc(100vh - 120px)" : "400px",
            maxHeight: isFullscreen ? "calc(100vh - 120px)" : "600px",
            overflow: "auto",
          }}
          textareaClassName="focus:outline-none"
          className="editor-wrapper"
        />
      </div>
    </Card>
  );
};
