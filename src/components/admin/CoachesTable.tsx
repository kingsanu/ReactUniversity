"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Mail, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coach } from "@/types/coach";
import { toast } from "sonner";

export function CoachesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoading(true);
      try {
        const { getAllCoachesAdmin } = await import("@/services/coachService");
        // In a real app, we would pass page, limit, and search term to the API
        // For now, we fetch all and filter client-side if the API doesn't support search params yet
        // or if we want to keep it simple.
        // The service function signature is: getAllCoachesAdmin(page?: number, limit?: number, search?: string)
        const response = await getAllCoachesAdmin({ page: 1, limit: 100, search: searchTerm });
        console.log("getAllCoachesAdmin response:", response);
        
        const anyResponse = response as any;

        if (Array.isArray(anyResponse)) {
            setCoaches(anyResponse);
        } else if (anyResponse?.data && Array.isArray(anyResponse.data)) {
             // Handle case where data is directly an array
            setCoaches(anyResponse.data);
        } else if (anyResponse?.data?.data && Array.isArray(anyResponse.data.data)) {
            // Handle nested data.data structure (as reported by user)
            setCoaches(anyResponse.data.data);
        } else {
            console.error("Unexpected API response format:", response);
            setCoaches([]);
        }
      } catch (error) {
        console.error("Failed to fetch coaches:", error);
        toast.error("Failed to load coaches");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchCoaches();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Coaches</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coaches..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : coaches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No coaches found.
                  </TableCell>
                </TableRow>
              ) : (
                coaches.map((coach) => (
                  <TableRow key={coach.id}>
                    <TableCell className="font-medium">{coach.name || coach.fullName}</TableCell>
                    <TableCell>{coach.email || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(coach.status)} variant="secondary">
                        {(coach.status || "Unknown").charAt(0).toUpperCase() + (coach.status || "unknown").slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{coach.specialization || "N/A"}</TableCell>
                    <TableCell>{coach.activeStudents || 0}</TableCell>
                    <TableCell>
                      {coach.joinedAt ? new Date(coach.joinedAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                                if (coach.email) {
                                    navigator.clipboard.writeText(coach.email);
                                    toast.success("Email copied to clipboard");
                                }
                            }}
                          >
                            Copy Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Coach</DropdownMenuItem>
                          {coach.status === "invited" && (
                            <DropdownMenuItem
                              onClick={async () => {
                                if (!coach.email) return;
                                try {
                                  const { inviteCoach } = await import("@/services/coachService");
                                  await inviteCoach(coach.email);
                                  toast.success(`Invitation resent to ${coach.email}`);
                                } catch (error) {
                                  toast.error("Failed to resend invitation");
                                }
                              }}
                            >
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
