"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, User, FileText, X, MoreHorizontal, ArrowUpRight, Star, Users, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AvailabilityStep } from "@/components/onboarding/AvailabilityStep";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Calendar as CalendarComponent } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import {
  Button as AriaButton,
  DatePicker,
  Dialog as AriaDialog,
  Group,
  Label as AriaLabel,
  Popover as AriaPopover,
  type DateValue
} from "react-aria-components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { motion } from "motion/react";

// Default Availability Data (for initialization)
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
  const { user } = useGlobalStore();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState<DateValue | null>(null);
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any>(INITIAL_AVAILABILITY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { getCoachSessions, getAvailability } = await import("@/services/coachService");
        
        const [sessionsData, availabilityData] = await Promise.all([
          getCoachSessions("all"),
          getAvailability()
        ]);

        console.log("📦 Raw API response - sessions:", sessionsData);
        console.log("📦 Raw API response - availability:", availabilityData);

        // Handle different response structures
        // The API might return { data: { data: [...] } } or { data: [...] } or just [...]
        const rawSessions = Array.isArray((sessionsData as any)?.data?.data)
          ? (sessionsData as any).data.data
          : Array.isArray((sessionsData as any)?.data) 
            ? (sessionsData as any).data 
            : Array.isArray(sessionsData) 
              ? sessionsData 
              : [];

        // Map sessions to include formatted date and time
        const sessions = rawSessions.map((session: any) => {
          const startTime = session.startTime || session.slot?.start;
          const endTime = session.endTime || session.slot?.end;
          
          let date = "TBD";
          let time = "TBD";
          let duration = "30 min"; // Default

          if (startTime) {
            try {
              const startDate = new Date(startTime);
              date = format(startDate, "EEE, MMM d, yyyy");
              time = format(startDate, "h:mm a");
              
              if (endTime) {
                const endDate = new Date(endTime);
                const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
                duration = `${Math.round(diff)} min`;
                time = `${time} - ${format(endDate, "h:mm a")}`;
              }
            } catch (e) {
              console.error("Error parsing date:", e);
            }
          }

          return {
            ...session,
            date,
            time,
            duration
          };
        });

        // Filter sessions
        const upcoming = sessions.filter((s: any) => s.status === 'confirmed' || s.status === 'rescheduled');
        const past = sessions.filter((s: any) => s.status === 'completed' || s.status === 'cancelled');

        setUpcomingSessions(upcoming);
        setPastSessions(past);
        setAvailability((availabilityData as any)?.data || availabilityData || INITIAL_AVAILABILITY);
        
        console.log("✅ Coach dashboard data loaded from API:", { upcoming, past, availability: availabilityData });
      } catch (error: any) {
        console.error("❌ Failed to fetch coach dashboard data:", error);
        setError(error.message || "Failed to load dashboard data");
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
      if (!rescheduleDate) return;
      
      // Convert DateValue to string (YYYY-MM-DD)
      const dateStr = rescheduleDate.toString();
      const start = `${dateStr}T${rescheduleTime}:00Z`; 
      const end = `${dateStr}T${rescheduleTime}:30Z`; // Mock 30 min duration

      await rescheduleSession(selectedSession.id, { start, end });
      
      // Optimistic Update
      const updatedSessions = upcomingSessions.map(session => {
        if (session.id === selectedSession.id) {
          const startDate = new Date(start);
          const endDate = new Date(end);
          return {
            ...session,
            startTime: start,
            endTime: end,
            date: format(startDate, "EEE, MMM d, yyyy"),
            time: `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`,
            status: 'rescheduled'
          };
        }
        return session;
      });
      
      setUpcomingSessions(updatedSessions);

      toast.success("Session rescheduled successfully");
      setIsRescheduleOpen(false);
      setSelectedSession(null);
      setRescheduleDate(null);
      setRescheduleTime("");
    } catch (error) {
      toast.error("Failed to reschedule session");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25"></div>
              <Avatar className="h-20 w-20 border-4 border-white shadow-xl relative">
                <AvatarImage src={`/api/users/${user.id}/avatar`} />
                <AvatarFallback className="bg-black text-white text-2xl">
                  {user.name?.charAt(0).toUpperCase() || 'C'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-1">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user.name || 'Coach'}</span>
              </h1>
              <p className="text-gray-500 font-medium text-lg">Here's what's happening today</p>
            </div>
          </div>
          
          <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-900 h-12 px-8 rounded-full shadow-lg shadow-black/10 transition-all hover:shadow-xl hover:-translate-y-0.5 text-base font-medium">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-xl relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Users className="h-32 w-32 text-blue-600" />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-blue-600 shadow-inner">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Sessions</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-gray-900">{upcomingSessions.length + pastSessions.length}</h3>
                  <span className="text-sm text-gray-500 font-medium">sessions</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-xl relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Calendar className="h-32 w-32 text-purple-600" />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-purple-600 shadow-inner">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Upcoming</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-gray-900">{upcomingSessions.length}</h3>
                  <span className="text-sm text-gray-500 font-medium">
                    {upcomingSessions.length > 0 ? `Next: ${upcomingSessions[0]?.date}` : 'No upcoming sessions'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-xl relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Star className="h-32 w-32 text-yellow-500" />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl text-yellow-600 shadow-inner">
                    <Star className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completed</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-gray-900">{pastSessions.length}</h3>
                  <span className="text-sm text-gray-500 font-medium">sessions</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sessions Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8">
          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Sessions</h2>
              <TabsList className="bg-gray-100/50 p-1.5 rounded-2xl">
                <TabsTrigger value="upcoming" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black transition-all">Upcoming</TabsTrigger>
                <TabsTrigger value="past" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black transition-all">Past</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="space-y-4 mt-0">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session, index) => (
                  <motion.div 
                    key={session.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all bg-white"
                  >
                    <div className="flex items-center gap-5 flex-1 w-full">
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                          <AvatarImage src={session.studentImage} />
                          <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold text-lg">
                            {session.studentName?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-4 border-white"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl mb-1">{session.studentName}</h3>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 rounded-lg">
                            {session.topic}
                          </Badge>
                          <span className="text-xs text-gray-300">|</span>
                          <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col lg:flex-row gap-6 text-sm text-gray-500 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                      <div className="flex items-center gap-2.5 bg-gray-50/80 px-4 py-2 rounded-xl">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-700">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5 bg-gray-50/80 px-4 py-2 rounded-xl">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-700">{session.duration || session.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pt-2 md:pt-0">
                      <Button 
                        variant="outline" 
                        className="flex-1 md:flex-none border-gray-200 hover:bg-gray-50 hover:text-gray-900 h-11 px-5 rounded-xl font-medium"
                        onClick={() => handleRescheduleClick(session)}
                      >
                        Reschedule
                      </Button>
                      <Button className="flex-1 md:flex-none bg-black text-white hover:bg-gray-900 shadow-lg shadow-black/10 h-11 px-6 rounded-xl font-medium transition-all hover:scale-105" asChild>
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-2" /> Join Call
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                    <Calendar className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">You don't have any scheduled sessions yet. Share your profile to get booked!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-0">
              {pastSessions.length > 0 ? (
                pastSessions.map((session, index) => (
                  <motion.div 
                    key={session.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-5 flex-1 w-full">
                      <Avatar className="h-16 w-16 border-2 border-white grayscale opacity-75">
                        <AvatarImage src={session.studentImage} />
                        <AvatarFallback>{session.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-gray-700 text-xl mb-1">{session.studentName}</h3>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-medium text-gray-500 border-gray-200 px-3 py-1 rounded-lg">
                            {session.topic}
                          </Badge>
                          <span className="text-xs text-gray-300">|</span>
                          <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full text-xs">
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col lg:flex-row gap-6 text-sm text-gray-500 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{session.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pt-2 md:pt-0">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 h-10 px-4 rounded-xl">
                        <FileText className="h-4 w-4 mr-2" /> View Notes
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                    <Clock className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No past sessions</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">You haven't completed any sessions yet.</p>
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
                  <DatePicker 
                    className="group flex flex-col gap-2" 
                    value={rescheduleDate} 
                    onChange={setRescheduleDate}
                    minValue={today(getLocalTimeZone())}
                  >
                    <AriaLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">New Date</AriaLabel>
                    <div className="flex">
                      <Group className="w-full">
                        <DateInput className="pe-9" />
                      </Group>
                      <AriaButton className="-ms-9 -me-px z-10 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50">
                        <CalendarIcon size={16} />
                      </AriaButton>
                    </div>
                    <AriaPopover
                      className="data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border bg-background text-popover-foreground shadow-lg outline-hidden data-entering:animate-in data-exiting:animate-out"
                      offset={4}
                    >
                      <AriaDialog className="max-h-[inherit] overflow-auto p-2 outline-none">
                        <CalendarComponent />
                      </AriaDialog>
                    </AriaPopover>
                  </DatePicker>
                </div>
                <div className="space-y-2">
                  <Label>New Time</Label>
                  <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 17 }).map((_, i) => {
                        const hour = 9 + Math.floor(i / 2);
                        const minute = i % 2 === 0 ? "00" : "30";
                        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                        return (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
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
