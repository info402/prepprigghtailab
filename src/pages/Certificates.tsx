import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Award, Calendar } from "lucide-react";

interface Certificate {
  id: string;
  certificate_name: string;
  issued_date: string;
  verification_code: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_date", { ascending: false });

      if (!error && data) {
        setCertificates(data);
      }
      setIsLoading(false);
    };

    fetchCertificates();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Certificates
          </h1>
          <p className="text-muted-foreground">
            Your verified achievements and credentials
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Award className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No certificates yet. Complete courses to earn them!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="border-primary/30 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Award className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{cert.certificate_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Issued: {new Date(cert.issued_date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Verification: {cert.verification_code}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Certificates;
