import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTokens = () => {
  const [tokens, setTokens] = useState<number | null>(null);
  const [usedTokens, setUsedTokens] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const { toast } = useToast();

  const fetchTokens = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type, is_active')
        .eq('user_id', user.id)
        .single();

      if (subscription?.plan_type === 'unlimited' && subscription.is_active) {
        setIsPremium(true);
        
        // Still fetch token data for premium users to show usage
        const { data: tokenData } = await supabase
          .from('user_tokens')
          .select('total_tokens, used_tokens')
          .eq('user_id', user.id)
          .single();

        if (tokenData) {
          const remaining = tokenData.total_tokens - tokenData.used_tokens;
          setTokens(remaining);
          setUsedTokens(tokenData.used_tokens);
          setTotalTokens(tokenData.total_tokens);
        }
        
        setIsLoading(false);
        return;
      }

      // Get token count
      const { data: tokenData } = await supabase
        .from('user_tokens')
        .select('total_tokens, used_tokens')
        .eq('user_id', user.id)
        .single();

      if (tokenData) {
        const remaining = tokenData.total_tokens - tokenData.used_tokens;
        setTokens(remaining);
        setUsedTokens(tokenData.used_tokens);
        setTotalTokens(tokenData.total_tokens);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deductTokens = async (amount: number = 1): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Get current token data
      const { data: tokenData } = await supabase
        .from('user_tokens')
        .select('total_tokens, used_tokens')
        .eq('user_id', user.id)
        .single();

      if (!tokenData) return false;

      // For non-premium users, check if they have enough tokens
      if (!isPremium) {
        const remaining = tokenData.total_tokens - tokenData.used_tokens;
        if (remaining < amount) {
          toast({
            title: "Insufficient Tokens",
            description: "You've run out of tokens. Upgrade to Premium for unlimited access!",
            variant: "destructive"
          });
          return false;
        }
      }

      // Deduct tokens for all users (premium and non-premium)
      const { error } = await supabase
        .from('user_tokens')
        .update({ used_tokens: tokenData.used_tokens + amount })
        .eq('user_id', user.id);

      if (error) throw error;

      const newUsedTokens = tokenData.used_tokens + amount;
      const remaining = tokenData.total_tokens - newUsedTokens;
      
      setTokens(remaining);
      setUsedTokens(newUsedTokens);
      return true;
    } catch (error) {
      console.error('Error deducting tokens:', error);
      return false;
    }
  };

  const checkTokens = (required: number = 1): boolean => {
    if (isPremium) return true;
    if (tokens === null) return false;
    
    if (tokens < required) {
      toast({
        title: "Insufficient Tokens",
        description: "You've run out of tokens. Upgrade to Premium for unlimited access!",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return {
    tokens,
    usedTokens,
    totalTokens,
    isLoading,
    isPremium,
    deductTokens,
    checkTokens,
    refreshTokens: fetchTokens
  };
};
