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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coach } from "@/types/coach";
import { toast } from "sonner";

export function CoachesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contractFilter, setContractFilter] = useState("all");
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoading(true);
      try {
        const { getAllCoachesAdmin } = await import("@/services/coachService");
        const response = await getAllCoachesAdmin({ page: 1, limit: 100, search: searchTerm });
        
        const anyResponse = response as any;

        if (Array.isArray(anyResponse)) {
            setCoaches(anyResponse);
        } else if (anyResponse?.data && Array.isArray(anyResponse.data)) {
            setCoaches(anyResponse.data);
        } else if (anyResponse?.data?.data && Array.isArray(anyResponse.data.data)) {
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
      case "invited":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getContractStatus = (contractEnd?: string) => {
    if (!contractEnd) return null;
    
    const endDate = new Date(contractEnd);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return { label: "Expired", color: "bg-red-100 text-red-800 hover:bg-red-100", days: daysRemaining };
    } else if (daysRemaining < 7) {
      return { label: `${daysRemaining}d left`, color: "bg-red-100 text-red-800 hover:bg-red-100", days: daysRemaining };
    } else if (daysRemaining < 30) {
      return { label: `${daysRemaining}d left`, color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", days: daysRemaining };
    } else {
      return { label: `${daysRemaining}d left`, color: "bg-green-100 text-green-800 hover:bg-green-100", days: daysRemaining };
    }
  };

  const filteredCoaches = coaches.filter((coach) => {
    if (contractFilter === "all") return true;
    
    const status = getContractStatus(coach.contractEnd);
    if (contractFilter === "active" && status && status.days >= 30) return true;
    if (contractFilter === "expiring" && status && status.days >= 0 && status.days < 30) return true;
    if (contractFilter === "expired" && status && status.days < 0) return true;
    
    return false;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>All Coaches</CardTitle>
          <div className="flex items-center gap-3">
            <Select value={contractFilter} onValueChange={setContractFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by contract" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contracts</SelectItem>
                <SelectItem value="active">Active (30+ days)</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Contract Start</TableHead>
                <TableHead>Contract End</TableHead>
                <TableHead>Contract Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCoaches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No coaches found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoaches.map((coach) => {
                  const contractStatus = getContractStatus(coach.contractEnd);
                  return (
                    <TableRow key={coach.id}>
                      <TableCell className="font-medium">{coach.name || coach.fullName}</TableCell>
                      <TableCell>{coach.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(coach.status)} variant="secondary">
                          {(coach.status || "Unknown").charAt(0).toUpperCase() + (coach.status || "unknown").slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{coach.specialization || "N/A"}</TableCell>
                      <TableCell>
                        {coach.contractStart ? new Date(coach.contractStart).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        {coach.contractEnd ? new Date(coach.contractEnd).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        {contractStatus ? (
                          <Badge className={contractStatus.color} variant="secondary">
                            {contractStatus.label}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">No contract</span>
                        )}
                      </TableCell>
                      <TableCell>{coach.activeStudents || 0}</TableCell>
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
                                    await inviteCoach({ email: coach.email });
                                    toast.success(`Invitation resent to ${coach.email}`);
                                  } catch (error) {
                                    toast.error("Failed to resend invitation");
                                  }
                                }}
                              >
                                <Mail className="mr-2 h-4 w-4" />
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
