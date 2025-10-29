import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check, Calendar, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface UserVoucher {
  id: string;
  voucher_id: string;
  rank_achieved: number;
  is_used: boolean;
  claimed_at: string;
  used_at: string | null;
  vouchers: {
    code: string;
    title: string;
    description: string;
    discount_type: string;
    discount_value: string;
    company_name: string;
    expiry_date: string | null;
  };
  events: {
    title: string;
  } | null;
}

const MyVouchers = () => {
  const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_vouchers")
        .select(`
          *,
          vouchers (
            code,
            title,
            description,
            discount_type,
            discount_value,
            company_name,
            expiry_date
          ),
          events (
            title
          )
        `)
        .eq("user_id", user.id)
        .order("claimed_at", { ascending: false });

      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast({
        title: "Error",
        description: "Failed to load vouchers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code copied!",
      description: "Voucher code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleMarkAsUsed = async (voucherId: string) => {
    try {
      const { error } = await supabase
        .from("user_vouchers")
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq("id", voucherId);

      if (error) throw error;

      toast({
        title: "Marked as used",
        description: "Voucher has been marked as used",
      });

      fetchVouchers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update voucher",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Vouchers</h1>
            <p className="text-muted-foreground mt-2">
              Your earned rewards and vouchers
            </p>
          </div>
          <Gift className="h-8 w-8 text-primary" />
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-48 bg-muted"></CardHeader>
              </Card>
            ))}
          </div>
        ) : vouchers.length === 0 ? (
          <Card className="p-12 text-center">
            <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vouchers yet</h3>
            <p className="text-muted-foreground">
              Participate in events and competitions to win vouchers!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vouchers.map((userVoucher) => {
              const voucher = userVoucher.vouchers;
              const isExpired = voucher.expiry_date
                ? new Date(voucher.expiry_date) < new Date()
                : false;

              return (
                <Card
                  key={userVoucher.id}
                  className={`${
                    userVoucher.is_used || isExpired ? "opacity-60" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{voucher.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {voucher.company_name}
                        </CardDescription>
                      </div>
                      {userVoucher.is_used ? (
                        <Badge className="bg-gray-500/10 text-gray-500">Used</Badge>
                      ) : isExpired ? (
                        <Badge className="bg-red-500/10 text-red-500">Expired</Badge>
                      ) : (
                        <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {voucher.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-primary font-bold">
                        {voucher.discount_type === "percentage"
                          ? `${voucher.discount_value}% OFF`
                          : voucher.discount_type === "fixed"
                          ? `₹${voucher.discount_value} OFF`
                          : voucher.discount_value}
                      </Badge>
                    </div>

                    {userVoucher.events && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4" />
                        <span>
                          Won from: {userVoucher.events.title} (Rank #{userVoucher.rank_achieved})
                        </span>
                      </div>
                    )}

                    {voucher.expiry_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Expires: {format(new Date(voucher.expiry_date), "MMM dd, yyyy")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <code className="flex-1 font-mono text-sm font-bold">
                        {voucher.code}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyCode(voucher.code)}
                      >
                        {copiedCode === voucher.code ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {!userVoucher.is_used && !isExpired && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleMarkAsUsed(userVoucher.id)}
                      >
                        Mark as Used
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyVouchers;
