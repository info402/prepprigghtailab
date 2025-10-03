import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  total_points: number;
  challenges_solved: number;
  rank: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Get all successful submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from("challenge_submissions")
        .select("user_id, challenge_id, challenge:coding_challenges(points)")
        .eq("status", "passed");

      if (submissionsError) throw submissionsError;

      // Get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (profilesError) throw profilesError;

      // Calculate stats per user
      const userStats = new Map<string, { points: number; solved: Set<string> }>();

      submissions?.forEach((sub: any) => {
        if (!userStats.has(sub.user_id)) {
          userStats.set(sub.user_id, { points: 0, solved: new Set() });
        }
        const stats = userStats.get(sub.user_id)!;
        
        if (!stats.solved.has(sub.challenge_id)) {
          stats.solved.add(sub.challenge_id);
          stats.points += sub.challenge?.points || 0;
        }
      });

      // Create leaderboard entries
      const entries: LeaderboardEntry[] = Array.from(userStats.entries())
        .map(([userId, stats]) => {
          const profile = profiles?.find((p) => p.id === userId);
          return {
            user_id: userId,
            full_name: profile?.full_name || "Anonymous",
            total_points: stats.points,
            challenges_solved: stats.solved.size,
            rank: 0,
          };
        })
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboard(entries);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Global Leaderboard</h1>
            <p className="text-muted-foreground mt-2">
              Top performers across all challenges
            </p>
          </div>
          <Award className="h-8 w-8 text-primary" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Coders</CardTitle>
            <CardDescription>
              Rankings based on total points from solved challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No entries yet. Be the first to solve challenges!
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Solved</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((entry) => (
                    <TableRow key={entry.user_id}>
                      <TableCell className="font-medium">
                        {getRankIcon(entry.rank)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {entry.full_name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{entry.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {entry.challenges_solved} challenges
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {entry.total_points} pts
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
