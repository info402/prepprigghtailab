import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Award, Calendar, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Certificate {
  id: string;
  certificate_name: string;
  issued_date: string;
  verification_code: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateSampleCertificate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const sampleCert = {
      user_id: user.id,
      certificate_name: "DSA Internship Certificate",
      issued_date: new Date().toISOString().split('T')[0],
      verification_code: `PREP${Math.floor(10000 + Math.random() * 90000)}`,
      certificate_data: {
        department: "Data Structures & Algorithms",
        duration: "May 15, 2025 - July 01, 2025",
        issuer: "Preppright Edtech Pvt. Ltd."
      }
    };

    const { error } = await supabase
      .from("certificates")
      .insert([sampleCert]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to generate certificate",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Certificate generated successfully!",
      });
      // Refresh certificates
      fetchCertificates();
    }
  };

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

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Certificates
            </h1>
            <p className="text-muted-foreground">
              Your verified achievements and credentials
            </p>
          </div>
          <Button onClick={generateSampleCertificate} className="bg-primary">
            <Award className="h-4 w-4 mr-2" />
            Generate Sample Certificate
          </Button>
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
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Issued: {new Date(cert.issued_date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Verification: {cert.verification_code}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open('/certificate-template.jpg', '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
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
