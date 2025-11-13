import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Loader2, Brain, Target, Zap } from "lucide-react";

interface AssessmentData {
  // Step 1: Technical Skills
  programmingLanguages: string[];
  frameworks: string[];
  technicalProficiency: string;
  technicalExperience: string;
  
  // Step 2: Soft Skills
  communicationSkills: string;
  teamworkExperience: string;
  leadershipExperience: string;
  problemSolvingApproach: string;
  
  // Step 3: Experience & Projects
  internshipExperience: string;
  projectsCompleted: string;
  competitionsParticipated: string;
  certificationsEarned: string;
  
  // Step 4: Goals & Preparation
  careerGoals: string;
  learningGoals: string;
  readinessConcerns: string;
  preparationAreas: string;
}

const programmingLanguages = [
  "JavaScript/TypeScript", "Python", "Java", "C++", "C#", 
  "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"
];

const frameworks = [
  "React", "Angular", "Vue", "Node.js", "Django", "Flask",
  "Spring Boot", "Express", ".NET", "Laravel", "TensorFlow", "PyTorch"
];

export default function ReadinessAssessment() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AssessmentData>({
    programmingLanguages: [],
    frameworks: [],
    technicalProficiency: "",
    technicalExperience: "",
    communicationSkills: "",
    teamworkExperience: "",
    leadershipExperience: "",
    problemSolvingApproach: "",
    internshipExperience: "",
    projectsCompleted: "",
    competitionsParticipated: "",
    certificationsEarned: "",
    careerGoals: "",
    learningGoals: "",
    readinessConcerns: "",
    preparationAreas: "",
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      programmingLanguages: prev.programmingLanguages.includes(language)
        ? prev.programmingLanguages.filter(l => l !== language)
        : [...prev.programmingLanguages, language]
    }));
  };

  const handleFrameworkToggle = (framework: string) => {
    setFormData(prev => ({
      ...prev,
      frameworks: prev.frameworks.includes(framework)
        ? prev.frameworks.filter(f => f !== framework)
        : [...prev.frameworks, framework]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit your assessment",
          variant: "destructive",
        });
        return;
      }

      console.log("Submitting assessment for user:", user.id);

      const { data, error } = await supabase.functions.invoke('generate-readiness-report', {
        body: {
          assessmentData: formData,
          userId: user.id
        }
      });

      if (error) throw error;

      console.log("Assessment report generated:", data);

      toast({
        title: "Assessment Complete!",
        description: "Your campus readiness report has been generated.",
      });

      // Navigate to the report page
      navigate(`/readiness-report/${data.assessment.id}`);
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Campus Readiness Assessment</h1>
          <p className="text-muted-foreground">
            AI-powered evaluation of your skills, experience, and career readiness
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Assessment Form */}
        <Card className="p-6">
          {/* Step 1: Technical Skills */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Technical Skills</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-3 block">Programming Languages (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {programmingLanguages.map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang}
                          checked={formData.programmingLanguages.includes(lang)}
                          onCheckedChange={() => handleLanguageToggle(lang)}
                        />
                        <label htmlFor={lang} className="text-sm cursor-pointer">
                          {lang}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-3 block">Frameworks & Technologies (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {frameworks.map((framework) => (
                      <div key={framework} className="flex items-center space-x-2">
                        <Checkbox
                          id={framework}
                          checked={formData.frameworks.includes(framework)}
                          onCheckedChange={() => handleFrameworkToggle(framework)}
                        />
                        <label htmlFor={framework} className="text-sm cursor-pointer">
                          {framework}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-2 block">Technical Proficiency Level</Label>
                  <RadioGroup
                    value={formData.technicalProficiency}
                    onValueChange={(value) => setFormData({ ...formData, technicalProficiency: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner">Beginner - Learning fundamentals</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate - Can build projects independently</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced">Advanced - Expert with production experience</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="technical-experience">Describe your most significant technical achievement</Label>
                  <Textarea
                    id="technical-experience"
                    placeholder="E.g., Built a full-stack e-commerce app with 1000+ users..."
                    value={formData.technicalExperience}
                    onChange={(e) => setFormData({ ...formData, technicalExperience: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Soft Skills */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Soft Skills & Collaboration</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-2 block">Communication Skills</Label>
                  <RadioGroup
                    value={formData.communicationSkills}
                    onValueChange={(value) => setFormData({ ...formData, communicationSkills: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developing" id="comm-developing" />
                      <Label htmlFor="comm-developing">Developing - Working on improving</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="comm-good" />
                      <Label htmlFor="comm-good">Good - Can present ideas clearly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="comm-excellent" />
                      <Label htmlFor="comm-excellent">Excellent - Confident public speaker</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="teamwork">Teamwork Experience</Label>
                  <Textarea
                    id="teamwork"
                    placeholder="Describe your experience working in teams (hackathons, group projects, etc.)"
                    value={formData.teamworkExperience}
                    onChange={(e) => setFormData({ ...formData, teamworkExperience: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="leadership">Leadership Experience</Label>
                  <Textarea
                    id="leadership"
                    placeholder="Any leadership roles or initiatives you've taken (club president, team lead, mentoring, etc.)"
                    value={formData.leadershipExperience}
                    onChange={(e) => setFormData({ ...formData, leadershipExperience: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="problem-solving">Problem-Solving Approach</Label>
                  <Textarea
                    id="problem-solving"
                    placeholder="Describe how you approach complex problems and a specific example"
                    value={formData.problemSolvingApproach}
                    onChange={(e) => setFormData({ ...formData, problemSolvingApproach: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Experience & Projects */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Experience & Projects</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="internship">Internship Experience</Label>
                  <Textarea
                    id="internship"
                    placeholder="List any internships, duration, and key responsibilities"
                    value={formData.internshipExperience}
                    onChange={(e) => setFormData({ ...formData, internshipExperience: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="projects">Projects Completed</Label>
                  <Textarea
                    id="projects"
                    placeholder="Describe 2-3 significant projects with tech stack and impact"
                    value={formData.projectsCompleted}
                    onChange={(e) => setFormData({ ...formData, projectsCompleted: e.target.value })}
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="competitions">Competitions & Hackathons</Label>
                  <Textarea
                    id="competitions"
                    placeholder="List competitions participated in and any achievements"
                    value={formData.competitionsParticipated}
                    onChange={(e) => setFormData({ ...formData, competitionsParticipated: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications & Courses</Label>
                  <Textarea
                    id="certifications"
                    placeholder="List relevant certifications, online courses completed"
                    value={formData.certificationsEarned}
                    onChange={(e) => setFormData({ ...formData, certificationsEarned: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals & Preparation */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Career Goals & Preparation</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="career-goals">Career Goals</Label>
                  <Textarea
                    id="career-goals"
                    placeholder="What are your short-term and long-term career goals?"
                    value={formData.careerGoals}
                    onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="learning-goals">Learning Goals</Label>
                  <Textarea
                    id="learning-goals"
                    placeholder="What skills or technologies do you want to learn next?"
                    value={formData.learningGoals}
                    onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="concerns">Readiness Concerns</Label>
                  <Textarea
                    id="concerns"
                    placeholder="What areas are you most concerned about in terms of campus/career readiness?"
                    value={formData.readinessConcerns}
                    onChange={(e) => setFormData({ ...formData, readinessConcerns: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="preparation">Areas for Preparation</Label>
                  <Textarea
                    id="preparation"
                    placeholder="What specific areas do you want to focus on to improve your readiness?"
                    value={formData.preparationAreas}
                    onChange={(e) => setFormData({ ...formData, preparationAreas: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isLoading}
            >
              Back
            </Button>
            
            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}