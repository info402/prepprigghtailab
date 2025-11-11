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

    console.log('Starting job fetch for startup & unicorn internships...');

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Targeted queries for paid internships in startups, unicorns, consulting & analytics
    const searchQueries = [
      // Startup & Unicorn focused
      { query: "startup internship paid india", location: "India" },
      { query: "unicorn company internship india", location: "India" },
      { query: "product intern startup india paid", location: "India" },
      { query: "growth intern startup india stipend", location: "India" },
      { query: "early stage startup internship paid", location: "India" },
      
      // Consulting & Analytics
      { query: "paid internship consulting india", location: "India" },
      { query: "data analytics paid intern fresher", location: "India" },
      { query: "business analyst paid internship", location: "India" },
      { query: "management consulting intern paid", location: "India" },
      
      // Tech & Business roles in startups
      { query: "software intern startup india paid", location: "India" },
      { query: "business development intern startup", location: "India" },
      { query: "marketing intern startup paid india", location: "India" },
      { query: "operations intern unicorn company", location: "India" },
    ];

    let allJobsToInsert: any[] = [];

    // Fetch jobs with delays between requests
    for (let i = 0; i < searchQueries.length; i++) {
      const searchQuery = searchQueries[i];
      
      try {
        console.log(`[${i+1}/${searchQueries.length}] Fetching: "${searchQuery.query}"`);

        const response = await fetch(
          `https://linkedin-data-api.p.rapidapi.com/search-jobs?keywords=${encodeURIComponent(searchQuery.query)}&location=${encodeURIComponent(searchQuery.location)}&datePosted=past24Hours&sort=mostRelevant`,
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
            const company = (job.company?.name || '').toLowerCase();
            const combined = title + ' ' + description + ' ' + company;
            
            // MUST include "paid" keyword (high priority)
            const isPaid = combined.includes('paid') || 
                          combined.includes('stipend') ||
                          combined.includes('salary') ||
                          combined.includes('compensation') ||
                          combined.includes('₹') ||
                          combined.includes('lpa');
            
            // Filter for fresher/internship opportunities
            const isFresherLevel = (
              combined.includes('fresher') || 
              combined.includes('intern') || 
              combined.includes('trainee') ||
              combined.includes('entry level') ||
              combined.includes('graduate') ||
              combined.includes('0-1 year') ||
              combined.includes('0-2 year') ||
              combined.includes('no experience')
            );
            
            // Bonus: startup/unicorn companies (higher priority)
            const isStartupUnicorn = (
              combined.includes('startup') ||
              combined.includes('unicorn') ||
              combined.includes('early stage') ||
              combined.includes('series') ||
              combined.includes('funded') ||
              // Common Indian unicorns
              company.includes('flipkart') ||
              company.includes('swiggy') ||
              company.includes('zomato') ||
              company.includes('cred') ||
              company.includes('phonepe') ||
              company.includes('paytm') ||
              company.includes('ola') ||
              company.includes('byju') ||
              company.includes('dream11') ||
              company.includes('razorpay') ||
              company.includes('zerodha')
            );
            
            // Bonus: consulting/analytics focused (higher priority)
            const isTargetNiche = (
              combined.includes('consulting') ||
              combined.includes('analyst') ||
              combined.includes('analytics') ||
              combined.includes('insights') ||
              combined.includes('client facing') ||
              combined.includes('business intelligence') ||
              combined.includes('data') ||
              combined.includes('strategy') ||
              combined.includes('product') ||
              combined.includes('growth') ||
              combined.includes('operations') ||
              combined.includes('business development')
            );
            
            return isPaid && isFresherLevel;
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

        console.log(`✓ Filtered to ${jobsFromQuery.length} startup/internship opportunities`);
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
        message: `Fetched and saved ${allJobsToInsert.length} startup & unicorn internships (within 24h)`,
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
  
  // Priority categories for startups, unicorns, consulting & analytics
  if (lowercaseTitle.includes('product') && (lowercaseTitle.includes('manager') || lowercaseTitle.includes('intern'))) {
    return 'Product Management';
  } else if (lowercaseTitle.includes('growth') || lowercaseTitle.includes('acquisition')) {
    return 'Growth & Marketing';
  } else if (lowercaseTitle.includes('consulting') || lowercaseTitle.includes('consultant')) {
    return 'Consulting';
  } else if (lowercaseTitle.includes('data') || lowercaseTitle.includes('analytics') || lowercaseTitle.includes('analyst')) {
    return 'Data Analytics';
  } else if (lowercaseTitle.includes('business intelligence') || lowercaseTitle.includes('insights')) {
    return 'Business Intelligence';
  } else if (lowercaseTitle.includes('business development') || lowercaseTitle.includes('sales')) {
    return 'Business Development';
  } else if (lowercaseTitle.includes('operations') || lowercaseTitle.includes('ops')) {
    return 'Operations';
  } else if (lowercaseTitle.includes('software') || lowercaseTitle.includes('developer') || lowercaseTitle.includes('engineer')) {
    return 'Software Development';
  } else if (lowercaseTitle.includes('design') || lowercaseTitle.includes('ui') || lowercaseTitle.includes('ux')) {
    return 'Design';
  } else if (lowercaseTitle.includes('marketing') || lowercaseTitle.includes('content')) {
    return 'Marketing';
  } else if (lowercaseTitle.includes('strategy')) {
    return 'Strategy';
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
