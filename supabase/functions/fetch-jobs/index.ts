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
    const { query = "software developer intern", location = "India" } = await req.json();
    
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    console.log(`Fetching jobs for: ${query} in ${location}`);

    // Fetch jobs from LinkedIn Data API (RapidAPI)
    const response = await fetch(
      `https://linkedin-data-api.p.rapidapi.com/search-jobs?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&datePosted=anyTime&sort=mostRelevant`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('API returned success=false:', data.message);
      throw new Error(data.message || 'Failed to fetch jobs from LinkedIn API');
    }
    
    console.log(`Fetched ${data.data?.length || 0} jobs`);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Transform and insert jobs into database
    const jobsToInsert = data.data?.map((job: any) => ({
      title: job.title || 'Untitled Position',
      company: job.company?.name || 'Company',
      description: job.description?.substring(0, 500) || 'No description available',
      location: job.location || location,
      type: job.type || 'Full-time',
      category: determineCategory(job.title || ''),
      salary_range: 'Not specified',
      apply_url: job.url || '#',
      is_active: true
    })) || [];

    if (jobsToInsert.length > 0) {
      const { data: insertedJobs, error: insertError } = await supabase
        .from('jobs')
        .upsert(jobsToInsert, { 
          onConflict: 'title,company',
          ignoreDuplicates: true 
        })
        .select();

      if (insertError) {
        console.error('Error inserting jobs:', insertError);
        throw insertError;
      }

      console.log(`Successfully inserted ${insertedJobs?.length || 0} jobs`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Fetched and saved ${jobsToInsert.length} jobs`,
        jobs: jobsToInsert 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-jobs function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function determineCategory(title: string): string {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes('software') || lowercaseTitle.includes('developer') || lowercaseTitle.includes('engineer')) {
    return 'Software Development';
  } else if (lowercaseTitle.includes('data') || lowercaseTitle.includes('analytics')) {
    return 'Data Science';
  } else if (lowercaseTitle.includes('design') || lowercaseTitle.includes('ui') || lowercaseTitle.includes('ux')) {
    return 'Design';
  } else if (lowercaseTitle.includes('marketing') || lowercaseTitle.includes('sales')) {
    return 'Marketing';
  } else if (lowercaseTitle.includes('product')) {
    return 'Product Management';
  } else {
    return 'Other';
  }
}
