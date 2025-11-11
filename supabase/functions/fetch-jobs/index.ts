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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Starting job fetch from RemoteOK API (free, no API key required)...');

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch jobs from RemoteOK API
    console.log('Fetching remote jobs from RemoteOK...');
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobFetcher/1.0)',
      }
    });

    if (!response.ok) {
      throw new Error(`RemoteOK API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Skip first item (it's metadata)
    const jobs = data.slice(1);
    console.log(`✓ Fetched ${jobs.length} remote jobs from RemoteOK`);

    // Transform RemoteOK jobs to our schema
    const allJobsToInsert = jobs
      .filter((job: any) => {
        // Filter for relevant jobs
        const position = (job.position || '').toLowerCase();
        const description = (job.description || '').toLowerCase();
        const tags = (job.tags || []).join(' ').toLowerCase();
        const combined = position + ' ' + description + ' ' + tags;
        
        // Include jobs that are suitable for entry-level/freshers/interns
        // or have clear compensation mentioned
        return job.position && job.company && job.url;
      })
      .map((job: any) => {
        const salary = extractSalaryFromRemoteOK(job);
        
        return {
          title: job.position || 'Remote Position',
          company: job.company || 'Company',
          description: (job.description || 'No description available').substring(0, 500),
          location: job.location || 'Remote',
          type: determineJobTypeFromRemoteOK(job),
          category: determineCategoryFromRemoteOK(job),
          salary_range: salary,
          apply_url: job.url || job.apply_url || '#',
          logo_url: job.company_logo || null,
          is_active: true
        };
      });

    console.log(`✓ Transformed ${allJobsToInsert.length} jobs for insertion`);

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
        message: `Fetched and saved ${allJobsToInsert.length} remote jobs from RemoteOK API`,
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

function determineCategoryFromRemoteOK(job: any): string {
  const position = (job.position || '').toLowerCase();
  const tags = (job.tags || []).join(' ').toLowerCase();
  const combined = position + ' ' + tags;
  
  if (combined.includes('product') && (combined.includes('manager') || combined.includes('management'))) {
    return 'Product Management';
  } else if (combined.includes('growth') || combined.includes('acquisition')) {
    return 'Growth & Marketing';
  } else if (combined.includes('consulting') || combined.includes('consultant')) {
    return 'Consulting';
  } else if (combined.includes('data') || combined.includes('analytics') || combined.includes('analyst')) {
    return 'Data Science';
  } else if (combined.includes('business intelligence') || combined.includes('insights')) {
    return 'Business Intelligence';
  } else if (combined.includes('business development') || combined.includes('sales')) {
    return 'Business Development';
  } else if (combined.includes('operations') || combined.includes('ops')) {
    return 'Operations';
  } else if (combined.includes('software') || combined.includes('developer') || combined.includes('engineer') || combined.includes('backend') || combined.includes('frontend') || combined.includes('fullstack')) {
    return 'Software Development';
  } else if (combined.includes('design') || combined.includes('ui') || combined.includes('ux')) {
    return 'Design';
  } else if (combined.includes('marketing') || combined.includes('content')) {
    return 'Marketing';
  } else if (combined.includes('strategy')) {
    return 'Strategy';
  } else {
    return 'Other';
  }
}

function determineJobTypeFromRemoteOK(job: any): string {
  const position = (job.position || '').toLowerCase();
  const tags = (job.tags || []).join(' ').toLowerCase();
  const combined = position + ' ' + tags;
  
  if (combined.includes('intern')) {
    return 'Intern';
  } else if (combined.includes('part-time') || combined.includes('part time') || combined.includes('parttime')) {
    return 'Part-time';
  } else if (combined.includes('contract') || combined.includes('freelance') || combined.includes('contractor')) {
    return 'Contract';
  } else {
    return 'Full-time';
  }
}

function extractSalaryFromRemoteOK(job: any): string {
  // RemoteOK provides salary_min and salary_max
  if (job.salary_min && job.salary_max) {
    const min = Math.floor(job.salary_min / 1000);
    const max = Math.floor(job.salary_max / 1000);
    return `$${min}k - $${max}k`;
  } else if (job.salary_min) {
    const min = Math.floor(job.salary_min / 1000);
    return `$${min}k+`;
  }
  
  // Fallback to text extraction from description
  const description = job.description || '';
  const salaryPatterns = [
    /\$(\d+)k?\s*-\s*\$?(\d+)k/i,
    /\$(\d+),(\d+)\s*-\s*\$?(\d+),?(\d+)/,
    /(\d+)\s*-\s*(\d+)\s*(lpa|lakh|lakhs)/i,
    /₹\s*(\d+(?:,\d+)*)\s*-\s*₹\s*(\d+(?:,\d+)*)/,
  ];

  for (const pattern of salaryPatterns) {
    const match = description.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return 'Not specified';
}
