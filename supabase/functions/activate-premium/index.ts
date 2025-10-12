import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Activating premium for user:', user.id);

    // Update subscription to premium
    const { error: subError } = await supabaseClient
      .from('subscriptions')
      .update({
        plan_type: 'premium',
        is_active: true,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        price: 299,
      })
      .eq('user_id', user.id);

    if (subError) {
      console.error('Subscription update error:', subError);
      throw subError;
    }

    // Update user tokens to 1000
    const { error: tokenError } = await supabaseClient
      .from('user_tokens')
      .update({
        total_tokens: 1000,
        used_tokens: 0,
        remaining_tokens: 1000,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (tokenError) {
      console.error('Token update error:', tokenError);
      throw tokenError;
    }

    console.log('Premium activated successfully for user:', user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Premium activated with 1000 tokens',
        tokens: 1000
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error activating premium:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to activate premium'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
