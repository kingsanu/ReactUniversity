"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Video,
  MoreVertical,
  Search,
  Filter,
  User,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const { user } = useGlobalStore();
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("upcoming");

  // State for Notes Dialog
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { getCoachSessions } = await import("@/services/coachService");

        // Fetch all sessions
        const sessionsData = await getCoachSessions("all");

        // Robust data extraction
        const rawSessions = Array.isArray((sessionsData as any)?.data?.data)
          ? (sessionsData as any).data.data
          : Array.isArray((sessionsData as any)?.data)
          ? (sessionsData as any).data
          : Array.isArray(sessionsData)
          ? sessionsData
          : [];

        const formattedSessions = rawSessions
          .map((session: any) => {
            // Safety check for session object
            if (!session) return null;

            const startTime = session.startTime || session.slot?.start;
            const endTime = session.endTime || session.slot?.end;

            let date = "TBD";
            let time = "TBD";
            let duration = "30 min";

            if (startTime) {
              try {
                const startDate = new Date(startTime);
                // Check for invalid date
                if (!isNaN(startDate.getTime())) {
                  date = format(startDate, "EEE, MMM d, yyyy");
                  time = format(startDate, "h:mm a");

                  if (endTime) {
                    const endDate = new Date(endTime);
                    if (!isNaN(endDate.getTime())) {
                      const diff =
                        (endDate.getTime() - startDate.getTime()) / (1000 * 60);
                      duration = `${Math.round(diff)} min`;
                      time = `${time} - ${format(endDate, "h:mm a")}`;
                    }
                  }
                }
              } catch (e) {
                console.error("Error parsing date:", e);
              }
            }

            return {
              ...session,
              date,
              time,
              duration,
              studentName: session.studentName || session.userName || "Student",
              studentAvatar: session.studentAvatar || session.userAvatar,
              studentId: session.studentId || session.userId, // Ensure we have student ID
              topic: session.topic || "General Coaching",
              status: session.status || "upcoming",
              notes: session.notes || "No notes available for this session.",
            };
          })
          .filter(Boolean); // Remove nulls

        setSessions(formattedSessions);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        toast.error("Failed to load sessions");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  // Filter logic
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topic?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "all") {
      // also apply statusFilter if provided
      if (statusFilter) return session.status === statusFilter;
      return true;
    }
    if (activeTab === "upcoming")
      return session.status === "confirmed" || session.status === "rescheduled";
    if (activeTab === "past") return session.status === "completed";
    if (activeTab === "cancelled") return session.status === "cancelled";

    return true;
  });

  // Sorting
  const sortedSessions = filteredSessions.slice().sort((a, b) => {
    if (sortBy === "newest")
      return (
        (new Date(b.startTime || b.slot?.start || 0).getTime() || 0) -
        (new Date(a.startTime || a.slot?.start || 0).getTime() || 0)
      );
    if (sortBy === "oldest")
      return (
        (new Date(a.startTime || a.slot?.start || 0).getTime() || 0) -
        (new Date(b.startTime || b.slot?.start || 0).getTime() || 0)
      );
    // default upcoming: put confirmed/rescheduled first then by date
    const aPriority =
      a.status === "confirmed" || a.status === "rescheduled" ? 0 : 1;
    const bPriority =
      b.status === "confirmed" || b.status === "rescheduled" ? 0 : 1;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return (
      (new Date(a.startTime || a.slot?.start || 0).getTime() || 0) -
      (new Date(b.startTime || b.slot?.start || 0).getTime() || 0)
    );
  });

  const groupedSessions: Record<string, any[]> = sortedSessions.reduce(
    (acc, s) => {
      const key = s?.date || "TBD";
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {} as Record<string, any[]>
  );

  const counts = {
    all: sessions.length,
    upcoming: sessions.filter(
      (s) => s.status === "confirmed" || s.status === "rescheduled"
    ).length,
    past: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "rescheduled":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewNotes = (session: any) => {
    setSelectedSession(session);
    setIsNotesOpen(true);
  };

  const handleViewProfile = (studentId: string) => {
    if (studentId) {
      router.push(`/dashboard/people/${studentId}`);
    } else {
      toast.error("Student profile not found");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">
            Manage your coaching sessions and history
          </p>
        </div>
        <Button className="bg-black text-white hover:bg-gray-800">
          <Calendar className="mr-2 h-4 w-4" />
          Sync Calendar
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent>
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent>
            <div className="text-sm text-muted-foreground">Upcoming</div>
            <div className="text-2xl font-bold">
              {
                sessions.filter(
                  (s) => s.status === "confirmed" || s.status === "rescheduled"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent>
            <div className="text-sm text-muted-foreground">Past</div>
            <div className="text-2xl font-bold">
              {sessions.filter((s) => s.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent>
            <div className="text-sm text-muted-foreground">Cancelled</div>
            <div className="text-2xl font-bold">
              {sessions.filter((s) => s.status === "cancelled").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">
              All Sessions{" "}
              <span className="text-sm text-muted-foreground ml-2">
                ({counts.all})
              </span>
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming{" "}
              <span className="text-sm text-muted-foreground ml-2">
                ({counts.upcoming})
              </span>
            </TabsTrigger>
            <TabsTrigger value="past">
              Past{" "}
              <span className="text-sm text-muted-foreground ml-2">
                ({counts.past})
              </span>
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled{" "}
              <span className="text-sm text-muted-foreground ml-2">
                ({counts.cancelled})
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 items-center">
          <Select
            value={statusFilter ?? "all"}
            onValueChange={(v) => setStatusFilter(v === "all" ? null : v)}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="confirmed">Upcoming</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search student or topic..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading sessions...</p>
          </div>
        )}
        {!isLoading && sortedSessions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No sessions found
            </h3>
            <p className="text-gray-500 mt-1">
              {searchQuery
                ? "Try adjusting your search terms"
                : "You don't have any sessions in this category"}
            </p>
          </div>
        )}
        {!isLoading && sortedSessions.length > 0 && (
          <>
            {Object.entries(groupedSessions).map(
              ([dateKey, daySessions]: [string, any[]]) => {
                return (
                  <div key={dateKey} className="space-y-2">
                    <div className="text-sm text-muted-foreground font-medium">
                      {dateKey}
                    </div>
                    {daySessions.map((session: any) => (
                      <Card
                        key={session.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            {/* Left: Student & Topic */}
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={session.studentAvatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                  {session.studentName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className="cursor-pointer"
                                onClick={() =>
                                  handleViewProfile(session.studentId)
                                }
                                role="button"
                                aria-label="View student profile"
                              >
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg text-gray-900">
                                    {session.topic}
                                  </h3>
                                  <Badge className="text-xs bg-muted/50 text-gray-700">
                                    {session.topic}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 mt-1">
                                  <User className="h-3.5 w-3.5" />
                                  <span className="inline-flex items-center gap-2 text-sm">
                                    <span
                                      className={`h-2 w-2 rounded-full ${
                                        session.status === "cancelled"
                                          ? "bg-red-500"
                                          : session.status === "completed"
                                          ? "bg-green-500"
                                          : "bg-blue-500"
                                      }`}
                                    />
                                    {session.studentName}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Middle: Time & Status */}
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">
                                  {session.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                  {session.time} ({session.duration})
                                </span>
                              </div>
                              <div className="mt-1">
                                {getStatusBadge(session.status)}
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-3 md:self-center">
                              {(session.status === "confirmed" ||
                                session.status === "rescheduled") && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                  <Video className="mr-2 h-4 w-4" />
                                  Join Call
                                </Button>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleViewNotes(session)}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Notes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleViewProfile(session.studentId)
                                    }
                                  >
                                    <User className="mr-2 h-4 w-4" />
                                    Student Profile
                                  </DropdownMenuItem>
                                  {session.status === "confirmed" && (
                                    <>
                                      <DropdownMenuItem className="text-orange-600">
                                        Reschedule
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => {
                                          setSelectedSession(session);
                                          setIsConfirmCancelOpen(true);
                                        }}
                                      >
                                        Cancel Session
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              {/* Quick actions shown on hover */}
                              {session.status === "confirmed" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedSession(session)}
                                  title="Reschedule"
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                              )}
                              {session.amount && (
                                <div className="ml-2 text-sm font-medium text-gray-900">
                                  {typeof session.amount === "number"
                                    ? `$${session.amount}`
                                    : session.amount}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
              }
            )}
          </>
        )}
      </div>

      {/* Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Notes</DialogTitle>
            <DialogDescription>
              Notes for session with {selectedSession?.studentName} on{" "}
              {selectedSession?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 min-h-[100px] whitespace-pre-wrap">
              {selectedSession?.notes || "No notes available."}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsNotesOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isConfirmCancelOpen} onOpenChange={setIsConfirmCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this session with{" "}
              {selectedSession?.studentName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsConfirmCancelOpen(false)}
            >
              No, keep session
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                // Placeholder cancel flow
                toast.success("Session cancelled");
                setIsConfirmCancelOpen(false);
              }}
            >
              Yes, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
