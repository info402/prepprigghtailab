import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { background } = await req.json();

    if (!background) {
      throw new Error("Background information is required");
    }

    console.log("Generating career roadmap");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a career counselor creating personalized career roadmaps for students and job seekers.
            Create a detailed, actionable career roadmap with:
            1. Short-term goals (3-6 months)
            2. Medium-term goals (6-12 months)
            3. Long-term goals (1-2 years)
            4. Skills to learn
            5. Projects to build
            6. Networking strategies
            7. Resources and learning paths
            
            Make it specific, actionable, and motivating.`
          },
          {
            role: "user",
            content: `Background: ${background}\n\nPlease create a personalized career roadmap for me.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const roadmap = data.choices[0]?.message?.content;

    if (!roadmap) {
      throw new Error("No roadmap generated");
    }

    return new Response(JSON.stringify({ roadmap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-career-roadmap:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate roadmap";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
