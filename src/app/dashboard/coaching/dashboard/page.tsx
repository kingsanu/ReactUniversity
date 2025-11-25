"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, User, FileText, X, MoreHorizontal, ArrowUpRight, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AvailabilityStep } from "@/components/onboarding/AvailabilityStep";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Mock Data
const UPCOMING_SESSIONS = [
  {
    id: 1,
    studentName: "Alex Johnson",
    studentImage: "https://i.pravatar.cc/150?u=alex",
    topic: "Career Guidance",
    date: "Today, 2:00 PM",
    duration: "30 min",
    status: "Confirmed",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    studentName: "Emily Davis",
    studentImage: "https://i.pravatar.cc/150?u=emily",
    topic: "Resume Review",
    date: "Tomorrow, 10:00 AM",
    duration: "45 min",
    status: "Confirmed",
    meetingLink: "https://meet.google.com/xyz-uvwx-yz",
  },
];

const PAST_SESSIONS = [
  {
    id: 3,
    studentName: "Michael Brown",
    studentImage: "https://i.pravatar.cc/150?u=michael",
    topic: "Interview Prep",
    date: "Yesterday, 11:00 AM",
    duration: "60 min",
    status: "Completed",
  },
];

// Mock Availability Data
const INITIAL_AVAILABILITY = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  weeklySchedule: [
    { day: "Monday", enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    { day: "Tuesday", enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    { day: "Wednesday", enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    { day: "Thursday", enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    { day: "Friday", enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    { day: "Saturday", enabled: false, timeSlots: [] },
    { day: "Sunday", enabled: false, timeSlots: [] },
  ],
};

export default function CoachDashboardPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any>(INITIAL_AVAILABILITY);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { getCoachSessions, getAvailability } = await import("@/services/coachService");
        
        const [sessionsData, availabilityData] = await Promise.all([
          getCoachSessions("all"),
          getAvailability()
        ]);

        // Filter sessions
        const upcoming = sessionsData.data.filter((s: any) => s.status === 'confirmed' || s.status === 'rescheduled'); // Simplified logic
        const past = sessionsData.data.filter((s: any) => s.status === 'completed' || s.status === 'cancelled');

        setUpcomingSessions(upcoming);
        setPastSessions(past);
        setAvailability(availabilityData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveAvailability = async (data: any) => {
    try {
      const { updateAvailability } = await import("@/services/coachService");
      await updateAvailability(data);
      setAvailability(data);
      toast.success("Availability updated successfully");
      setIsAvailabilityOpen(false);
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const handleRescheduleClick = (session: any) => {
    setSelectedSession(session);
    setIsRescheduleOpen(true);
  };

  const confirmReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please select a date and time");
      return;
    }
    
    try {
      const { rescheduleSession } = await import("@/services/coachService");
      
      // Construct start/end time from date and time inputs
      // This is a simplification, real app needs proper datetime handling
      const start = `${rescheduleDate}T${rescheduleTime}:00Z`; 
      const end = `${rescheduleDate}T${rescheduleTime}:30Z`; // Mock 30 min duration

      await rescheduleSession(selectedSession.id, { start, end });
      
      toast.success("Session rescheduled successfully");
      setIsRescheduleOpen(false);
      setSelectedSession(null);
      setRescheduleDate("");
      setRescheduleTime("");
      
      // Refresh data
      // In real app, maybe just update local state
    } catch (error) {
      toast.error("Failed to reschedule session");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src="https://i.pravatar.cc/150?u=sarah" />
              <AvatarFallback className="bg-black text-white text-xl">S</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Sarah</h1>
              <p className="text-gray-500 font-medium">Senior Career Coach</p>
            </div>
          </div>
          
          <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800 h-11 px-6 rounded-full shadow-lg shadow-black/5 transition-all hover:shadow-xl hover:-translate-y-0.5">
                Edit Availability
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0">
              <DialogHeader className="px-6 py-4 border-b shrink-0">
                <DialogTitle>Edit Availability</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <AvailabilityStep 
                  data={INITIAL_AVAILABILITY} 
                  onNext={handleSaveAvailability} 
                  onBack={() => setIsAvailabilityOpen(false)} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="h-24 w-24 text-blue-600" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Total Sessions</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-gray-900">24</h3>
                <span className="text-sm font-medium text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +4 this week
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="h-24 w-24 text-purple-600" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Upcoming</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-gray-900">{UPCOMING_SESSIONS.length}</h3>
                <span className="text-sm text-gray-500">Next: Today, 2:00 PM</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star className="h-24 w-24 text-yellow-500" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                  <Star className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Rating</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-gray-900">4.9</h3>
                <span className="text-sm text-gray-500">Based on 12 reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-xl font-bold text-gray-900">Sessions</h2>
              <TabsList className="bg-gray-100/50 p-1 rounded-xl">
                <TabsTrigger value="upcoming" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Upcoming</TabsTrigger>
                <TabsTrigger value="past" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Past</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="space-y-4 mt-0">
              {UPCOMING_SESSIONS.length > 0 ? (
                UPCOMING_SESSIONS.map((session) => (
                  <div key={session.id} className="group flex flex-col md:flex-row items-center gap-6 p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className="relative">
                        <Avatar className="h-14 w-14 border border-gray-100">
                          <AvatarImage src={session.studentImage} />
                          <AvatarFallback>{session.studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{session.studentName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border-none">
                            {session.topic}
                          </Badge>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col lg:flex-row gap-4 md:gap-2 lg:gap-6 text-sm text-gray-500 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{session.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                      <Button 
                        variant="outline" 
                        className="flex-1 md:flex-none border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                        onClick={() => handleRescheduleClick(session)}
                      >
                        Reschedule
                      </Button>
                      <Button className="flex-1 md:flex-none bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/5" asChild>
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-2" /> Join Call
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No upcoming sessions</h3>
                  <p className="text-gray-500 mt-1 max-w-sm mx-auto">You don't have any scheduled sessions yet. Share your profile to get booked!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-0">
              {PAST_SESSIONS.length > 0 ? (
                PAST_SESSIONS.map((session) => (
                  <div key={session.id} className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-xl border border-gray-100 bg-gray-50/30 opacity-75 hover:opacity-100 transition-all">
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <Avatar className="h-14 w-14 border border-gray-100 grayscale">
                        <AvatarImage src={session.studentImage} />
                        <AvatarFallback>{session.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{session.studentName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="font-medium text-gray-500 border-gray-200">
                            {session.topic}
                          </Badge>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col lg:flex-row gap-4 md:gap-2 lg:gap-6 text-sm text-gray-500 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{session.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                        <FileText className="h-4 w-4 mr-2" /> View Notes
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No past sessions</h3>
                  <p className="text-gray-500 mt-1 max-w-sm mx-auto">You haven't completed any sessions yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Reschedule Dialog */}
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reschedule Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Avatar>
                  <AvatarImage src={selectedSession?.studentImage} />
                  <AvatarFallback>{selectedSession?.studentName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{selectedSession?.studentName}</p>
                  <p className="text-sm text-gray-500">{selectedSession?.topic}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">New Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={rescheduleDate} 
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">New Time</Label>
                  <Input 
                    id="time" 
                    type="time" 
                    value={rescheduleTime} 
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setIsRescheduleOpen(false)} className="h-11">Cancel</Button>
                <Button onClick={confirmReschedule} className="bg-black text-white hover:bg-gray-800 h-11 px-6">Confirm Reschedule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
