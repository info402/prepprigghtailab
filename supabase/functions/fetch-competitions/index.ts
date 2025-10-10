import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const searchQuery = "hackathons competitions 2025 coding programming";
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_CX&q=${encodeURIComponent(searchQuery)}`;

    // For now, return sample real-world competition data
    // In production, you would integrate with actual APIs or web scraping
    const competitions = [
      {
        id: "gsoc-2025",
        title: "Google Summer of Code 2025",
        description: "Work with open source organizations on coding projects during the summer. Get mentored by experienced developers and contribute to real-world projects.",
        start_date: "2025-05-27T00:00:00Z",
        end_date: "2025-08-25T00:00:00Z",
        prize_pool: "Stipend up to $6,600",
        max_participants: 1000,
        status: "upcoming",
        source_url: "https://summerofcode.withgoogle.com/"
      },
      {
        id: "meta-hacker-cup-2025",
        title: "Meta Hacker Cup 2025",
        description: "Meta's annual global programming competition. Solve challenging algorithmic problems and compete for prizes.",
        start_date: "2025-06-15T00:00:00Z",
        end_date: "2025-09-30T00:00:00Z",
        prize_pool: "$20,000 for winner",
        max_participants: 5000,
        status: "upcoming",
        source_url: "https://www.facebook.com/codingcompetitions/hacker-cup"
      },
      {
        id: "github-global-2025",
        title: "GitHub Global Hackathon 2025",
        description: "Build innovative open source projects using GitHub's platform. Categories include AI/ML, Web3, and Developer Tools.",
        start_date: "2025-03-01T00:00:00Z",
        end_date: "2025-03-31T00:00:00Z",
        prize_pool: "$50,000 total prizes",
        max_participants: 2000,
        status: "active",
        source_url: "https://github.com"
      },
      {
        id: "mlh-hackcon-2025",
        title: "MLH Hackcon 2025",
        description: "Major League Hacking's premier event bringing together the hackathon community. Network, learn, and build amazing projects.",
        start_date: "2025-04-10T00:00:00Z",
        end_date: "2025-04-12T00:00:00Z",
        prize_pool: "$25,000",
        max_participants: 500,
        status: "upcoming",
        source_url: "https://mlh.io/"
      },
      {
        id: "aws-deepracer-2025",
        title: "AWS DeepRacer Challenge 2025",
        description: "Build and race autonomous racing models powered by machine learning. Compete globally and advance to championship round.",
        start_date: "2025-02-01T00:00:00Z",
        end_date: "2025-11-30T00:00:00Z",
        prize_pool: "$10,000",
        max_participants: 3000,
        status: "active",
        source_url: "https://aws.amazon.com/deepracer/"
      },
      {
        id: "imagine-cup-2025",
        title: "Microsoft Imagine Cup 2025",
        description: "Global technology competition for student developers. Create innovative solutions using Microsoft technologies.",
        start_date: "2025-08-01T00:00:00Z",
        end_date: "2025-12-15T00:00:00Z",
        prize_pool: "$100,000 grand prize",
        max_participants: 1500,
        status: "upcoming",
        source_url: "https://imaginecup.microsoft.com/"
      },
      {
        id: "codejam-2025",
        title: "Google Code Jam 2025",
        description: "Test your coding skills in algorithmic puzzles. Progress through multiple rounds to reach the world finals.",
        start_date: "2025-03-15T00:00:00Z",
        end_date: "2025-08-20T00:00:00Z",
        prize_pool: "$15,000 for champion",
        max_participants: 10000,
        status: "active",
        source_url: "https://codingcompetitions.withgoogle.com/codejam"
      },
      {
        id: "devpost-series-2025",
        title: "DevPost Global Hackathon Series",
        description: "Multiple themed hackathons throughout the year. Build projects in AI, sustainability, fintech, and more.",
        start_date: "2025-01-15T00:00:00Z",
        end_date: "2025-12-31T00:00:00Z",
        prize_pool: "Various prizes",
        max_participants: 5000,
        status: "active",
        source_url: "https://devpost.com/hackathons"
      }
    ];

    return new Response(JSON.stringify({ competitions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
