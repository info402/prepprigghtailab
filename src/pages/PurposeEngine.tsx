import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Target, Sparkles, ChevronRight, Brain, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PurposeEngine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interests: "",
    careerGoals: "",
    learningStyle: "",
    skillLevel: "",
    passions: "",
    challenges: ""
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your purpose profile.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Save to database
      const { error } = await supabase
        .from('purpose_profiles')
        .upsert({
          user_id: user.id,
          interests: formData.interests,
          career_goals: formData.careerGoals,
          learning_style: formData.learningStyle,
          skill_level: formData.skillLevel,
          passions: formData.passions,
          challenges: formData.challenges,
        });

      if (error) throw error;

      toast({
        title: "Purpose Profile Created! 🎯",
        description: "Your personalized learning journey is ready.",
      });

      navigate("/dashboard/lifeos");
    } catch (error) {
      console.error("Error saving purpose profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout
      title="Purpose Engine"
      description="Discover your 'why' - Let's map your interests, purpose & curiosity"
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Interests & Passions */}
        {step === 1 && (
          <Card className="p-8 glass-card border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">What Excites You?</h2>
                <p className="text-muted-foreground">Tell us about your interests and passions</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="interests" className="text-base font-semibold mb-2 block">
                  What topics interest you the most? 🌟
                </Label>
                <Textarea
                  id="interests"
                  placeholder="e.g., AI, Web Development, Data Science, Design, Marketing..."
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div>
                <Label htmlFor="passions" className="text-base font-semibold mb-2 block">
                  What problems do you want to solve? 🎯
                </Label>
                <Textarea
                  id="passions"
                  placeholder="e.g., Climate change, Education accessibility, Healthcare innovation..."
                  value={formData.passions}
                  onChange={(e) => setFormData({ ...formData, passions: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <Button 
              onClick={handleNext}
              className="w-full mt-8 bg-gradient-primary hover:opacity-90 shadow-glow"
              disabled={!formData.interests || !formData.passions}
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        )}

        {/* Step 2: Goals & Learning Style */}
        {step === 2 && (
          <Card className="p-8 glass-card border-secondary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-secondary/20">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Learning Journey</h2>
                <p className="text-muted-foreground">How do you want to grow?</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="careerGoals" className="text-base font-semibold mb-2 block">
                  What are your career goals? 🚀
                </Label>
                <Textarea
                  id="careerGoals"
                  placeholder="e.g., Become a Full Stack Developer, Start my own startup, Work at a top tech company..."
                  value={formData.careerGoals}
                  onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  How do you learn best? 🧠
                </Label>
                <RadioGroup
                  value={formData.learningStyle}
                  onValueChange={(value) => setFormData({ ...formData, learningStyle: value })}
                >
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="visual" id="visual" />
                    <Label htmlFor="visual" className="cursor-pointer flex-1 font-normal">
                      Visual (Videos, Diagrams, Infographics)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="hands-on" id="hands-on" />
                    <Label htmlFor="hands-on" className="cursor-pointer flex-1 font-normal">
                      Hands-on (Projects, Experiments, Practice)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="reading" id="reading" />
                    <Label htmlFor="reading" className="cursor-pointer flex-1 font-normal">
                      Reading (Books, Articles, Documentation)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="social" id="social" />
                    <Label htmlFor="social" className="cursor-pointer flex-1 font-normal">
                      Social (Discussions, Mentorship, Collaboration)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button 
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow"
                disabled={!formData.careerGoals || !formData.learningStyle}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Current Level & Challenges */}
        {step === 3 && (
          <Card className="p-8 glass-card border-accent/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-accent/20">
                <Brain className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Where Are You Now?</h2>
                <p className="text-muted-foreground">Let's understand your starting point</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  What's your current skill level? 📊
                </Label>
                <RadioGroup
                  value={formData.skillLevel}
                  onValueChange={(value) => setFormData({ ...formData, skillLevel: value })}
                >
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="cursor-pointer flex-1 font-normal">
                      Beginner - Just starting my journey
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="cursor-pointer flex-1 font-normal">
                      Intermediate - Have some experience
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="cursor-pointer flex-1 font-normal">
                      Advanced - Looking to master skills
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="expert" id="expert" />
                    <Label htmlFor="expert" className="cursor-pointer flex-1 font-normal">
                      Expert - Want to teach & lead
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="challenges" className="text-base font-semibold mb-2 block">
                  What challenges are you facing? 🤔
                </Label>
                <Textarea
                  id="challenges"
                  placeholder="e.g., Time management, Lack of guidance, Don't know where to start..."
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button 
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow"
                disabled={!formData.skillLevel || !formData.challenges}
              >
                Complete Setup
                <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PurposeEngine;
