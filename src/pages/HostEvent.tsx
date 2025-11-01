import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, Plus } from "lucide-react";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().max(2000, "Description must be less than 2000 characters").optional(),
  event_type: z.enum(["quiz", "competition", "hackathon", "workshop"]),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  max_participants: z.string().optional(),
  registration_deadline: z.string().optional(),
  prize_details: z.string().trim().max(1000, "Prize details must be less than 1000 characters").optional(),
  meeting_link: z.string().trim().url("Please enter a valid URL").optional().or(z.literal("")),
}).refine(data => {
  if (data.start_time && data.end_time) {
    return new Date(data.end_time) > new Date(data.start_time);
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["end_time"]
}).refine(data => {
  if (data.registration_deadline && data.start_time) {
    return new Date(data.registration_deadline) < new Date(data.start_time);
  }
  return true;
}, {
  message: "Registration deadline must be before start time",
  path: ["registration_deadline"]
}).refine(data => {
  if (data.max_participants) {
    const num = parseInt(data.max_participants);
    return !isNaN(num) && num > 0 && num <= 10000;
  }
  return true;
}, {
  message: "Max participants must be between 1 and 10000",
  path: ["max_participants"]
});

const HostEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "quiz",
    start_time: "",
    end_time: "",
    max_participants: "",
    registration_deadline: "",
    prize_details: "",
    meeting_link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validationResult = eventSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to host an event",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from("events").insert({
        title: validationResult.data.title,
        description: validationResult.data.description || "",
        event_type: validationResult.data.event_type,
        start_time: validationResult.data.start_time,
        end_time: validationResult.data.end_time,
        max_participants: validationResult.data.max_participants ? parseInt(validationResult.data.max_participants) : null,
        registration_deadline: validationResult.data.registration_deadline || null,
        prize_details: validationResult.data.prize_details || null,
        meeting_link: validationResult.data.meeting_link || null,
        host_id: user.id,
        status: "upcoming",
      });

      if (error) throw error;

      toast({
        title: "Event created!",
        description: "Your event has been created successfully",
      });

      navigate("/dashboard/student-events");
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Host an Event</h1>
            <p className="text-muted-foreground mt-2">
              Create quizzes, competitions, and hackathons for students
            </p>
          </div>
          <Plus className="h-8 w-8 text-primary" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Fill in the details for your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Web Development Quiz"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type *</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time *</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time *</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_deadline">Registration Deadline</Label>
                  <Input
                    id="registration_deadline"
                    type="datetime-local"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prize_details">Prize Details</Label>
                <Textarea
                  id="prize_details"
                  value={formData.prize_details}
                  onChange={(e) => setFormData({ ...formData, prize_details: e.target.value })}
                  placeholder="e.g., 1st: ₹500 voucher, 2nd: ₹300 voucher, 3rd: ₹200 voucher"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting_link">Meeting Link (Google Meet / Zoom)</Label>
                <Input
                  id="meeting_link"
                  type="url"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                  placeholder="https://meet.google.com/xxx or https://zoom.us/j/xxx"
                />
                <p className="text-xs text-muted-foreground">
                  Add Google Meet or Zoom link for virtual events
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/student-events")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HostEvent;
