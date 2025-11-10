import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { 
  Award, Calendar, Download, Settings, QrCode, FileSpreadsheet,
  Presentation, FolderOpen, CheckCircle2, ExternalLink, Zap,
  Copy, Play, Link as LinkIcon
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("my-certificates");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isTriggering, setIsTriggering] = useState(false);
  const [testCertData, setTestCertData] = useState({
    name: "John Doe",
    email: "john@example.com",
    course: "Advanced Web Development",
    certificateLink: "https://drive.google.com/file/d/example"
  });

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

  const handleTriggerAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsTriggering(true);

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          name: testCertData.name,
          email: testCertData.email,
          course: testCertData.course,
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });

      toast({
        title: "Request Sent",
        description: "The certificate generation request was sent. Check your Google Drive for the generated certificate.",
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger the automation. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsTriggering(false);
    }
  };

  const generateQRCode = (url: string) => {
    return `https://quickchart.io/qr?text=${encodeURIComponent(url)}&size=200`;
  };

  const copyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    toast({
      title: "Copied!",
      description: "Formula copied to clipboard",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Certificates
            </h1>
            <p className="text-muted-foreground">
              Manage certificates and automate generation with Google Workspace
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my-certificates">My Certificates</TabsTrigger>
            <TabsTrigger value="automation">Automation Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="my-certificates" className="space-y-6 mt-6">
            <div className="flex justify-end">
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
          </TabsContent>

          <TabsContent value="automation" className="space-y-6 mt-6">
            {/* Hero Card */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-4 mb-4">
                    <FileSpreadsheet className="h-10 w-10 text-green-500" />
                    <Presentation className="h-10 w-10 text-orange-500" />
                    <QrCode className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Free Certificate Automation System</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Automate certificate generation using Google Sheets, Google Slides, and Autocrat add-on.
                    Generate personalized certificates with unique QR codes - 100% free!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Setup Guide */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Complete Setup Guide
                </CardTitle>
                <CardDescription>Follow these steps to automate certificate generation</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full pr-4">
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          1
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-green-500" />
                            Create Google Sheet
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Create a new Google Sheet with the following columns:
                          </p>
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg font-mono text-xs">
                            <div className="grid grid-cols-5 gap-2">
                              <Badge variant="outline">Name</Badge>
                              <Badge variant="outline">Email</Badge>
                              <Badge variant="outline">Course Name</Badge>
                              <Badge variant="outline">Certificate Link</Badge>
                              <Badge variant="outline">QR Code</Badge>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-3"
                            onClick={() => window.open('https://sheets.google.com', '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Google Sheets
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Step 2 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          2
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Presentation className="h-5 w-5 text-orange-500" />
                            Create Certificate Template
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Create a Google Slides template with merge tags:
                          </p>
                          <div className="mt-3 space-y-2">
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm font-medium">Merge Tags to use:</p>
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                <code className="text-xs bg-background px-2 py-1 rounded">{"<<Name>>"}</code>
                                <code className="text-xs bg-background px-2 py-1 rounded">{"<<Email>>"}</code>
                                <code className="text-xs bg-background px-2 py-1 rounded">{"<<Course>>"}</code>
                                <code className="text-xs bg-background px-2 py-1 rounded">{"<<QR>>"}</code>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-3"
                            onClick={() => window.open('https://slides.google.com', '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Google Slides
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Step 3 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          3
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Install Autocrat Add-on
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Install the Autocrat add-on from Google Workspace Marketplace
                          </p>
                          <ol className="mt-3 space-y-2 text-sm list-decimal list-inside text-muted-foreground">
                            <li>Open your Google Sheet</li>
                            <li>Click Extensions → Add-ons → Get add-ons</li>
                            <li>Search for "Autocrat"</li>
                            <li>Install and authorize the add-on</li>
                          </ol>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-3"
                            onClick={() => window.open('https://workspace.google.com/marketplace/app/autocrat/539341275670', '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Install Autocrat
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Step 4 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          4
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Configure Autocrat Merge
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Set up the merge configuration:
                          </p>
                          <ol className="mt-3 space-y-2 text-sm list-decimal list-inside text-muted-foreground">
                            <li>Click Extensions → Autocrat → Launch</li>
                            <li>Create a new job</li>
                            <li>Select your Slides certificate template</li>
                            <li>Map fields: Name → {"<<Name>>"}, Course → {"<<Course>>"}</li>
                            <li>Set output folder: "Verified Certificates"</li>
                            <li>Enable "Save PDF" option</li>
                            <li>Choose "Certificate Link" column for file URLs</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Step 5 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          5
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            Add QR Code Formula
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            In the "QR Code" column (assuming Certificate Link is in column E), add:
                          </p>
                          <div className="mt-3 p-3 bg-black/80 rounded-lg">
                            <code className="text-xs text-green-500 font-mono">
                              =IMAGE("https://quickchart.io/qr?text=" & ENCODEURL(E2))
                            </code>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="mt-2 text-green-500 hover:text-green-400"
                              onClick={() => copyFormula('=IMAGE("https://quickchart.io/qr?text=" & ENCODEURL(E2))')}
                            >
                              <Copy className="h-3 w-3 mr-2" />
                              Copy Formula
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Adjust E2 to match your Certificate Link column location
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Step 6 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          6
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Run Merge
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Execute the certificate generation:
                          </p>
                          <ol className="mt-3 space-y-2 text-sm list-decimal list-inside text-muted-foreground">
                            <li>Add student data to your Google Sheet</li>
                            <li>Click Extensions → Autocrat → Run</li>
                            <li>Select your configured job</li>
                            <li>Certificates will be generated in Google Drive</li>
                            <li>QR codes will appear automatically in the sheet</li>
                          </ol>
                          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-green-500">Result</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Each student gets a personalized certificate with a unique QR code 
                                  that links to their verified PDF in Google Drive!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Test QR Code Generation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Test QR Code
                  </CardTitle>
                  <CardDescription>Preview QR code for certificate link</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cert-link">Certificate Link</Label>
                    <Input
                      id="cert-link"
                      placeholder="https://drive.google.com/file/d/..."
                      value={testCertData.certificateLink}
                      onChange={(e) => setTestCertData({ ...testCertData, certificateLink: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-center p-6 bg-white rounded-lg">
                    <img 
                      src={generateQRCode(testCertData.certificateLink)} 
                      alt="QR Code Preview"
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Scan this QR code to open the certificate link
                  </p>
                </CardContent>
              </Card>

              {/* Zapier Integration */}
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Zapier Automation (Optional)
                  </CardTitle>
                  <CardDescription>Trigger certificate generation via webhook</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTriggerAutomation} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook">Zapier Webhook URL</Label>
                      <Input
                        id="webhook"
                        type="url"
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Create a Zap with a webhook trigger to automate certificate generation
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Test Data</Label>
                      <Input
                        placeholder="Student Name"
                        value={testCertData.name}
                        onChange={(e) => setTestCertData({ ...testCertData, name: e.target.value })}
                      />
                      <Input
                        placeholder="Email"
                        value={testCertData.email}
                        onChange={(e) => setTestCertData({ ...testCertData, email: e.target.value })}
                      />
                      <Input
                        placeholder="Course Name"
                        value={testCertData.course}
                        onChange={(e) => setTestCertData({ ...testCertData, course: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isTriggering}>
                      {isTriggering ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Trigger Certificate Generation
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Card */}
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">100% Free</h3>
                      <p className="text-sm text-muted-foreground">No subscription costs - uses free Google services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Automated</h3>
                      <p className="text-sm text-muted-foreground">Generate hundreds of certificates in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Verified</h3>
                      <p className="text-sm text-muted-foreground">QR codes link to verified PDFs in Google Drive</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Certificates;
