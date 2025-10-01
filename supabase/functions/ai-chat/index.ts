import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, model } = await req.json();
    console.log(`Received request for ${model} with message:`, message);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let aiModel: string;
    let systemPrompt: string;

    // Map user-facing model names to actual API models
    switch (model) {
      case "chatgpt":
        aiModel = "openai/gpt-5-mini";
        systemPrompt = "You are ChatGPT, a helpful AI assistant created by OpenAI. Provide clear, accurate, and friendly responses.";
        break;
      case "gemini":
        aiModel = "google/gemini-2.5-flash";
        systemPrompt = "You are Gemini, Google's advanced AI assistant. Provide insightful and comprehensive responses.";
        break;
      case "claude":
        aiModel = "google/gemini-2.5-flash"; // Fallback to Gemini for now
        systemPrompt = "You are Claude, an AI assistant created by Anthropic. Provide thoughtful, nuanced, and helpful responses.";
        break;
      case "huggingface":
        aiModel = "google/gemini-2.5-flash"; // Fallback to Gemini for now
        systemPrompt = "You are a HuggingFace AI model. Provide technical and accurate responses about machine learning and AI.";
        break;
      default:
        aiModel = "google/gemini-2.5-flash";
        systemPrompt = "You are a helpful AI assistant.";
    }

    console.log(`Using AI model: ${aiModel}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please try again in a moment." 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Payment required. Please add credits to continue using AI features." 
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response generated";

    console.log("AI response received successfully");

    return new Response(
      JSON.stringify({ reply }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
