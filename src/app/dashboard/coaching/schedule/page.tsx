"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, User, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CoachSessionsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const fetchSessions = async () => {
    try {
      const { getCoachSessions } = await import("@/services/coachService");
      const rawResponse: any = await getCoachSessions("all");
      const response: any = rawResponse;
      // API may return { data: [] } or an array directly
      // Handle multiple possible shapes:
      // 1) { data: { data: [...] } }
      // 2) { data: [...] }
      // 3) [...] (array)
      const sessionsData = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      // Normalize items to ensure startTime is present
      const normalized = sessionsData.map((s: any) => ({
        ...s,
        startTime: s.startTime || s.start || null,
        endTime: s.endTime || s.end || null,
      }));

      console.debug("🔍 Fetched sessions:", normalized);

      setSessions(normalized);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const now = Date.now();

  // Upcoming: status is confirmed/rescheduled AND startTime is in future
  const upcomingSessions = sessions.filter((s) => {
    const isStatus = s.status === "confirmed" || s.status === "rescheduled";
    const start = s.startTime ? new Date(s.startTime).getTime() : 0;
    return isStatus && start > now;
  });

  // Past: completed or cancelled, OR confirmed/rescheduled with startTime in past
  const pastSessions = sessions.filter((s) => {
    if (s.status === "completed" || s.status === "cancelled") return true;
    const start = s.startTime ? new Date(s.startTime).getTime() : Infinity;
    return (s.status === "confirmed" || s.status === "rescheduled") && start <= now;
  });

  const handleRescheduleClick = (session: any) => {
    setSelectedSession(session);
    setRescheduleDate("");
    setRescheduleTime("");
    setIsRescheduleOpen(true);
  };

  const handleCancelClick = (session: any) => {
    setSelectedSession(session);
    setCancelReason("");
    setIsCancelOpen(true);
  };

  const confirmReschedule = async () => {
    if (!selectedSession || !rescheduleDate || !rescheduleTime) {
      toast.error("Please select a new date and time");
      return;
    }

    try {
      const { rescheduleSession } = await import("@/services/coachService");
      // Construct ISO string or required format
      const start = new Date(`${rescheduleDate}T${rescheduleTime}`).toISOString();
      // Assuming 1 hour duration for now, or calculate based on original duration
      const end = new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString();

      await rescheduleSession(selectedSession.id, { start, end });
      
      toast.success("Session rescheduled successfully");
      setIsRescheduleOpen(false);
      fetchSessions(); // Refresh list
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error("Failed to reschedule session");
    }
  };

  const confirmCancel = async () => {
    if (!selectedSession) return;

    try {
      const { cancelSession } = await import("@/services/coachService");
      await cancelSession(selectedSession.id, cancelReason || "Cancelled by coach");
      
      toast.success("Session cancelled successfully");
      setIsCancelOpen(false);
      fetchSessions(); // Refresh list
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Failed to cancel session");
    }
  };

  const SessionCard = ({ session }: { session: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session.studentImage} />
              <AvatarFallback>
                {session.studentName?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {session.studentName || "Student"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{session.topic}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{session.date || new Date(session.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{session.time || new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                session.status === "confirmed"
                  ? "default"
                  : session.status === "completed"
                  ? "secondary"
                  : "destructive"
              }
            >
              {session.status}
            </Badge>
            {session.status === "confirmed" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRescheduleClick(session)}
                >
                  Reschedule
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelClick(session)}
                >
                  Cancel
                </Button>
              </>
            )}
            {session.meetingLink && session.status === "confirmed" && (
              <Button size="sm" asChild>
                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4 mr-2" />
                  Join
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-500 mt-1">Manage your coaching sessions</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                Loading sessions...
              </div>
            ) : upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No upcoming sessions
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Your upcoming coaching sessions will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                Loading sessions...
              </div>
            ) : pastSessions.length > 0 ? (
              pastSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No past sessions
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Your completed sessions will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Reschedule Dialog */}
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>New Date</Label>
                <Input 
                  type="date" 
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>New Time</Label>
                <Input 
                  type="time" 
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={confirmReschedule}
                  className="flex-1"
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsRescheduleOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to cancel this session? This action cannot be undone.
              </p>
              <div className="space-y-2">
                <Label>Reason (Optional)</Label>
                <Input 
                  placeholder="e.g. Unexpected conflict"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="destructive"
                  onClick={confirmCancel}
                  className="flex-1"
                >
                  Confirm Cancellation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCancelOpen(false)}
                  className="flex-1"
                >
                  Keep Session
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
