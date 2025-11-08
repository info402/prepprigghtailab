import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Briefcase, Building2, DollarSign, Users, Target } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  category: string;
  salary_range: string;
  created_at: string;
}

const JobAnalytics = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  // Analyze jobs data
  const categoryDistribution = jobs.reduce((acc: any, job) => {
    acc[job.category] = (acc[job.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const jobTypeDistribution = jobs.reduce((acc: any, job) => {
    acc[job.type] = (acc[job.type] || 0) + 1;
    return acc;
  }, {});

  const jobTypeData = Object.entries(jobTypeDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const topCompanies = Object.entries(
    jobs.reduce((acc: any, job) => {
      acc[job.company] = (acc[job.company] || 0) + 1;
      return acc;
    }, {})
  )
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  // Salary range analysis
  const salaryRanges = jobs.reduce((acc: any, job) => {
    if (job.salary_range && job.salary_range !== 'Not specified') {
      const range = job.salary_range.includes('lpa') || job.salary_range.includes('LPA') 
        ? job.salary_range 
        : 'Other';
      acc[range] = (acc[range] || 0) + 1;
    } else {
      acc['Not specified'] = (acc['Not specified'] || 0) + 1;
    }
    return acc;
  }, {});

  const salaryData = Object.entries(salaryRanges)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 8);

  // Trend analysis (jobs posted over last 30 days)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const trendData = jobs
    .filter(job => new Date(job.created_at) >= last30Days)
    .reduce((acc: any, job) => {
      const date = new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const trendChartData = Object.entries(trendData)
    .map(([date, count]) => ({ date, count }))
    .slice(-14); // Last 14 days

  // Extract common skills/keywords
  const allText = jobs.map(job => `${job.title} ${job.description}`).join(' ').toLowerCase();
  const skillKeywords = [
    'python', 'java', 'javascript', 'react', 'node', 'sql', 'aws', 'excel',
    'data analysis', 'consulting', 'analytics', 'communication', 'powerbi',
    'tableau', 'leadership', 'teamwork', 'agile', 'problem solving'
  ];

  const skillsCount = skillKeywords
    .map(skill => ({
      skill,
      count: (allText.match(new RegExp(skill, 'gi')) || []).length
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  const paidJobs = jobs.filter(job => 
    job.salary_range && job.salary_range !== 'Not specified'
  ).length;

  const consultingJobs = jobs.filter(job => 
    job.category === 'Consulting' || job.category === 'Data Analytics' || job.category === 'Business Intelligence'
  ).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Job Market Analytics 📊
          </h1>
          <p className="text-muted-foreground">
            Real-time insights from {jobs.length} active opportunities
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Total Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{jobs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active opportunities</p>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Paid Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{paidJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((paidJobs / jobs.length) * 100).toFixed(1)}% with salary info
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                Target Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{consultingJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">Consulting & Analytics</p>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {new Set(jobs.map(j => j.company)).size}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Unique employers</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Posting Trend */}
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Posting Trend (Last 14 Days)
              </CardTitle>
              <CardDescription>Daily job postings activity</CardDescription>
            </CardHeader>
            <CardContent>
              {trendChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No trend data available</p>
              )}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Jobs by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Companies */}
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Top Hiring Companies
              </CardTitle>
              <CardDescription>Most active employers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCompanies} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Type Distribution */}
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Job Type Distribution</CardTitle>
              <CardDescription>Full-time, internships, contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {jobTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Salary & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salary Ranges */}
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Salary Range Distribution
              </CardTitle>
              <CardDescription>Compensation analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Skills */}
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Most In-Demand Skills
              </CardTitle>
              <CardDescription>Top skills mentioned in job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skillsCount.map((item, index) => (
                  <div key={item.skill} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">{item.skill}</span>
                        <span className="text-sm text-muted-foreground">{item.count} mentions</span>
                      </div>
                      <div className="w-full bg-secondary/30 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                          style={{ width: `${(item.count / skillsCount[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobAnalytics;
