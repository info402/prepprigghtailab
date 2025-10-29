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
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!RAPIDAPI_KEY) {
      console.error('RAPIDAPI_KEY not configured');
      throw new Error('RAPIDAPI_KEY not configured');
    }

    console.log('Starting job fetch process...');

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Reduced queries with delays to avoid rate limiting
    const searchQueries = [
      { query: "software developer fresher india", location: "India" },
      { query: "full stack internship paid 2024", location: "India" },
      { query: "data analyst fresher 0-1 year", location: "India" },
    ];

    let allJobsToInsert: any[] = [];

    // Fetch jobs with delays between requests
    for (let i = 0; i < searchQueries.length; i++) {
      const searchQuery = searchQueries[i];
      
      try {
        console.log(`[${i+1}/${searchQueries.length}] Fetching: "${searchQuery.query}"`);

        const response = await fetch(
          `https://linkedin-data-api.p.rapidapi.com/search-jobs?keywords=${encodeURIComponent(searchQuery.query)}&location=${encodeURIComponent(searchQuery.location)}&datePosted=pastWeek&sort=mostRelevant`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': RAPIDAPI_KEY,
              'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
            }
          }
        );

        if (!response.ok) {
          console.error(`API Error (${response.status}): ${response.statusText}`);
          // Add delay before next request even on error
          if (i < searchQueries.length - 1) {
            console.log('Waiting 3 seconds before next request...');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
          continue;
        }

        const data = await response.json();
        
        if (!data.success || !data.data) {
          console.log(`No jobs returned for: "${searchQuery.query}"`);
          if (i < searchQueries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
          continue;
        }
        
        console.log(`✓ Found ${data.data?.length || 0} jobs`);

        // Transform and filter jobs
        const jobsFromQuery = data.data
          ?.filter((job: any) => {
            const title = (job.title || '').toLowerCase();
            const description = (job.description || '').toLowerCase();
            const combined = title + ' ' + description;
            
            // Filter for fresher/internship opportunities
            return (
              combined.includes('fresher') || 
              combined.includes('intern') || 
              combined.includes('trainee') ||
              combined.includes('entry level') ||
              combined.includes('graduate') ||
              combined.includes('0-1 year') ||
              combined.includes('0-2 year') ||
              combined.includes('no experience')
            );
          })
          .map((job: any) => ({
            title: job.title || 'Untitled Position',
            company: job.company?.name || 'Company',
            description: job.description?.substring(0, 500) || 'No description available',
            location: job.location || searchQuery.location,
            type: determineJobType(job.title || '', job.description || ''),
            category: determineCategory(job.title || ''),
            salary_range: extractSalary(job.description || ''),
            apply_url: job.url || '#',
            is_active: true
          })) || [];

        console.log(`✓ Filtered to ${jobsFromQuery.length} fresher-suitable jobs`);
        allJobsToInsert = [...allJobsToInsert, ...jobsFromQuery];

        // Wait 3 seconds between API calls to avoid rate limiting
        if (i < searchQueries.length - 1) {
          console.log('Waiting 3 seconds before next request...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }

      } catch (error) {
        console.error(`Error processing query "${searchQuery.query}":`, error);
        // Add delay before continuing
        if (i < searchQueries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        continue;
      }
    }

    console.log(`\n📊 Total jobs collected: ${allJobsToInsert.length}`);

    // Insert jobs into database
    if (allJobsToInsert.length > 0) {
      const { data: insertedJobs, error: insertError } = await supabase
        .from('jobs')
        .upsert(allJobsToInsert, { 
          onConflict: 'title,company',
          ignoreDuplicates: true 
        })
        .select();

      if (insertError) {
        console.error('Database insertion error:', insertError);
        throw insertError;
      }

      console.log(`✓ Successfully inserted ${insertedJobs?.length || 0} unique jobs`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Fetched and saved ${allJobsToInsert.length} fresher-focused jobs`,
        jobs: allJobsToInsert 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fatal error in fetch-jobs:', error);
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

function determineJobType(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('intern')) {
    return 'Intern';
  } else if (text.includes('part-time') || text.includes('part time')) {
    return 'Part-time';
  } else if (text.includes('contract') || text.includes('freelance')) {
    return 'Contract';
  } else {
    return 'Full-time';
  }
}

function extractSalary(description: string): string {
  const salaryPatterns = [
    /(\d+)\s*-\s*(\d+)\s*(lpa|lakh|lakhs)/i,
    /(\d+)\s*(lpa|lakh|lakhs)/i,
    /₹\s*(\d+(?:,\d+)*)\s*-\s*₹\s*(\d+(?:,\d+)*)/,
    /stipend.*?₹\s*(\d+(?:,\d+)*)/i,
  ];

  for (const pattern of salaryPatterns) {
    const match = description.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return 'Not specified';
}
