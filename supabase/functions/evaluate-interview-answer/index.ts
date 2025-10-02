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
    const { question, answer, role } = await req.json();

    if (!question || !answer || !role) {
      throw new Error("Question, answer, and role are required");
    }

    console.log("Evaluating interview answer for role:", role);

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
            content: `You are an expert interviewer evaluating candidates for a ${role} position. 
            Evaluate the answer and provide constructive feedback.
            Return your response in this exact JSON format:
            {
              "score": a number between 0-100,
              "feedback": "detailed feedback on the answer with strengths and areas for improvement"
            }`
          },
          {
            role: "user",
            content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nPlease evaluate this answer.`
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
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No evaluation generated");
    }

    // Try to parse JSON from the response
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // If not JSON, create a structured response
      result = {
        score: 70,
        feedback: content,
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in evaluate-interview-answer:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to evaluate answer";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
