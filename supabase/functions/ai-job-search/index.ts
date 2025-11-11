import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI Job Search query:', query);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch all active jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (jobsError) throw jobsError;

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ 
          results: [],
          explanation: "No jobs available at the moment. Please check back later!"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing ${jobs.length} jobs with AI...`);

    // Create a summarized job list for the AI
    const jobSummaries = jobs.map((job, index) => ({
      index,
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      description: job.description.substring(0, 200), // First 200 chars
      salary_range: job.salary_range
    }));

    // Call Lovable AI to analyze and match jobs
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert career advisor helping students find the perfect job opportunities. 
            
Your task: Analyze the user's query and match them with the most relevant jobs from the provided list.

Instructions:
1. Understand the user's intent (skills, interests, location preferences, job type, etc.)
2. Score each job based on relevance (0-100)
3. Return the top 10 most relevant jobs with scores
4. Provide a brief, friendly explanation of why these jobs match

Be enthusiastic and encouraging! Students are looking for their first opportunities.`
          },
          {
            role: 'user',
            content: `User Query: "${query}"

Available Jobs:
${JSON.stringify(jobSummaries, null, 2)}

Return your response using the suggest_matches tool.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'suggest_matches',
              description: 'Return the best matching jobs with relevance scores and explanation',
              parameters: {
                type: 'object',
                properties: {
                  matches: {
                    type: 'array',
                    description: 'Top 10 most relevant jobs',
                    items: {
                      type: 'object',
                      properties: {
                        job_id: { type: 'string', description: 'Job ID' },
                        relevance_score: { 
                          type: 'number', 
                          description: 'Relevance score 0-100',
                          minimum: 0,
                          maximum: 100
                        },
                        match_reason: { 
                          type: 'string', 
                          description: 'Brief reason why this job matches (max 100 chars)' 
                        }
                      },
                      required: ['job_id', 'relevance_score', 'match_reason'],
                      additionalProperties: false
                    }
                  },
                  explanation: {
                    type: 'string',
                    description: 'Friendly 2-3 sentence explanation of the search results'
                  }
                },
                required: ['matches', 'explanation'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'suggest_matches' } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('AI analysis failed');
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No AI response received');
    }

    const result = JSON.parse(toolCall.function.arguments);
    console.log('AI Analysis complete:', result);

    // Map the matched job IDs back to full job objects
    const matchedJobs = result.matches
      .map((match: any) => {
        const job = jobs.find(j => j.id === match.job_id);
        if (!job) return null;
        return {
          ...job,
          relevance_score: match.relevance_score,
          match_reason: match.match_reason
        };
      })
      .filter((job: any) => job !== null)
      .sort((a: any, b: any) => b.relevance_score - a.relevance_score)
      .slice(0, 10); // Top 10

    return new Response(
      JSON.stringify({
        results: matchedJobs,
        explanation: result.explanation,
        query: query,
        total_analyzed: jobs.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-job-search:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'AI job search failed. Please try a simpler query.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
