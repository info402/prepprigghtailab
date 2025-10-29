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
      throw new Error('RAPIDAPI_KEY not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Reduced search queries to avoid rate limiting
    // Rotate through different queries on each call
    const allQueries = [
      { query: "software developer fresher", location: "India" },
      { query: "frontend developer internship", location: "India" },
      { query: "backend developer fresher", location: "India" },
      { query: "full stack developer internship paid", location: "India" },
      { query: "data analyst fresher", location: "India" },
      { query: "python developer internship", location: "India" },
      { query: "react developer fresher", location: "India" },
      { query: "java developer internship paid", location: "India" },
      { query: "web developer fresher 2024", location: "India" },
      { query: "software engineer trainee", location: "India" },
    ];

    // Select 3 random queries to avoid rate limiting
    const searchQueries = allQueries
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    let allJobsToInsert: any[] = [];

    // Fetch jobs from multiple queries
    for (const searchQuery of searchQueries) {
      try {
        console.log(`Fetching jobs for: ${searchQuery.query} in ${searchQuery.location}`);

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
          console.error(`API Error for query "${searchQuery.query}":`, response.statusText);
          continue;
        }

        const data = await response.json();
        
        if (!data.success || !data.data) {
          console.log(`No jobs found for query: ${searchQuery.query}`);
          continue;
        }
        
        console.log(`Fetched ${data.data?.length || 0} jobs for "${searchQuery.query}"`);

        // Transform jobs
        const jobsFromQuery = data.data
          ?.filter((job: any) => {
            // Filter for fresher-friendly jobs
            const title = (job.title || '').toLowerCase();
            const description = (job.description || '').toLowerCase();
            return (
              title.includes('fresher') || 
              title.includes('intern') || 
              title.includes('trainee') ||
              title.includes('entry level') ||
              title.includes('graduate') ||
              description.includes('fresher') ||
              description.includes('0-1 year') ||
              description.includes('no experience')
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

        allJobsToInsert = [...allJobsToInsert, ...jobsFromQuery];

        // Longer delay to avoid rate limiting (2 seconds between requests)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error fetching jobs for query "${searchQuery.query}":`, error);
        continue;
      }
    }

    console.log(`Total jobs collected: ${allJobsToInsert.length}`);

    if (allJobsToInsert.length > 0) {
      const { data: insertedJobs, error: insertError } = await supabase
        .from('jobs')
        .upsert(allJobsToInsert, { 
          onConflict: 'title,company',
          ignoreDuplicates: true 
        })
        .select();

      if (insertError) {
        console.error('Error inserting jobs:', insertError);
        throw insertError;
      }

      console.log(`Successfully inserted ${insertedJobs?.length || 0} unique jobs`);
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
