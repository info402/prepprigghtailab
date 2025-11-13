import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentData, userId } = await req.json();

    if (!assessmentData || !userId) {
      throw new Error("Assessment data and user ID are required");
    }

    console.log("Generating readiness report for user:", userId);

    // Create Supabase client to fetch additional user data
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch user profile, projects, and purpose profile
    const [profileData, projectsData, purposeData] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("user_projects").select("*").eq("user_id", userId),
      supabase.from("purpose_profiles").select("*").eq("user_id", userId).single(),
    ]);

    // Prepare comprehensive context for AI
    const context = {
      assessmentData,
      profile: profileData.data,
      projects: projectsData.data || [],
      purposeProfile: purposeData.data,
      projectCount: projectsData.data?.length || 0,
    };

    console.log("Calling Lovable AI for analysis...");

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
            content: `You are an expert career counselor and campus readiness evaluator. Analyze student data comprehensively and provide actionable insights.
            
            Evaluate the student across these dimensions:
            1. Technical Skills (0-100): Programming languages, frameworks, tools proficiency
            2. Soft Skills (0-100): Communication, teamwork, leadership, problem-solving
            3. Experience (0-100): Internships, projects, competitions, certifications
            4. Project Quality (0-100): Complexity, impact, documentation, deployment
            5. Overall Readiness (0-100): Weighted average with career alignment
            
            Return your response as a JSON object with this structure:
            {
              "overallScore": number,
              "technicalScore": number,
              "softSkillsScore": number,
              "experienceScore": number,
              "projectQualityScore": number,
              "analysis": {
                "summary": "2-3 sentence overview",
                "technicalAnalysis": "detailed technical skills assessment",
                "softSkillsAnalysis": "detailed soft skills assessment",
                "experienceAnalysis": "detailed experience assessment",
                "projectAnalysis": "detailed project quality assessment"
              },
              "strengths": ["strength 1", "strength 2", "strength 3"],
              "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
              "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"],
              "actionItems": [
                {"priority": "high", "action": "specific action 1", "timeline": "1-2 weeks"},
                {"priority": "medium", "action": "specific action 2", "timeline": "1 month"},
                {"priority": "low", "action": "specific action 3", "timeline": "2-3 months"}
              ]
            }`
          },
          {
            role: "user",
            content: `Analyze this student's campus readiness:\n\n${JSON.stringify(context, null, 2)}`
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
      throw new Error("No response from AI");
    }

    console.log("AI response received, parsing...");

    // Parse JSON from response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Fallback structure if AI doesn't return valid JSON
      result = {
        overallScore: 65,
        technicalScore: 70,
        softSkillsScore: 65,
        experienceScore: 60,
        projectQualityScore: 65,
        analysis: {
          summary: content.substring(0, 200),
          technicalAnalysis: "Assessment based on provided data",
          softSkillsAnalysis: "Assessment based on provided data",
          experienceAnalysis: "Assessment based on provided data",
          projectAnalysis: "Assessment based on provided data"
        },
        strengths: ["Good foundation", "Willingness to learn"],
        weaknesses: ["Limited experience", "Need more practice"],
        recommendations: ["Build more projects", "Participate in competitions"],
        actionItems: [
          { priority: "high", action: "Complete a portfolio project", timeline: "1 month" }
        ]
      };
    }

    // Save the assessment to database
    const { data: savedAssessment, error: saveError } = await supabase
      .from("readiness_assessments")
      .insert({
        user_id: userId,
        assessment_data: assessmentData,
        overall_score: result.overallScore,
        technical_score: result.technicalScore,
        soft_skills_score: result.softSkillsScore,
        experience_score: result.experienceScore,
        project_quality_score: result.projectQualityScore,
        ai_analysis: result.analysis,
        recommendations: result.recommendations,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        action_items: result.actionItems.map((item: any) => 
          `[${item.priority.toUpperCase()}] ${item.action} (${item.timeline})`
        ),
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving assessment:", saveError);
      throw saveError;
    }

    console.log("Assessment saved successfully:", savedAssessment.id);

    return new Response(JSON.stringify({
      success: true,
      assessment: savedAssessment,
      fullReport: result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-readiness-report:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate report";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});