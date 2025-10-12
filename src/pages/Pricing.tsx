import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upgrade your plan",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Open Razorpay payment link
      window.open('https://rzp.io/rzp/ZoxjQol', '_blank');
      
      toast({
        title: "Complete Payment",
        description: "After payment, click 'Activate Premium' button below to get your 1000 tokens",
      });

      setIsLoading(false);
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to open payment page. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleActivatePremium = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('activate-premium');

      if (error) throw error;

      toast({
        title: "Premium Activated!",
        description: "You now have 1000 tokens. Enjoy unlimited access!",
      });

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error: any) {
      console.error('Activation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to activate premium. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground">
            Unlock the full potential of AI-powered learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
          {/* Free Plan */}
          <Card className="border-2 border-primary/30 bg-white relative">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Free Plan</CardTitle>
              </div>
              <CardDescription className="text-base">
                Get started with AI tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold mb-1">100</div>
                <p className="text-muted-foreground">Free tokens to start</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">AI Resume Builder</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Mock Interview Practice</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">AI Chat Playground</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Career Roadmap Generator</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Basic Project Labs</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Unlimited Plan */}
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white">
              Most Popular
            </Badge>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
              </div>
              <CardDescription className="text-base">
                Access all features with 1000 tokens/month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">₹299</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Billed monthly</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm font-medium">Everything in Free +</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">1000 AI tokens</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Priority AI responses</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Advanced analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Unlimited projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Exclusive competitions</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Premium certificates</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent text-white"
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Pay Now (₹299)"}
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleActivatePremium}
                disabled={isLoading}
              >
                {isLoading ? "Activating..." : "Activate Premium (After Payment)"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                After payment, click "Activate Premium" to get 1000 tokens
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>Need help choosing? Contact our support team for assistance.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;