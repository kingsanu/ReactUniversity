"use client";

import { useState } from "react";
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
import { Search, MoreHorizontal, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data based on COACHES_API_SPEC.md
const MOCK_COACHES = [
  {
    id: "coach_123",
    fullName: "John Coach",
    email: "john.coach@example.com",
    status: "active",
    joinedAt: "2023-01-15T10:00:00Z",
    specialization: "Career Development",
    activeStudents: 12,
  },
  {
    id: "coach_124",
    fullName: "Jane Mentor",
    email: "jane.mentor@example.com",
    status: "pending",
    joinedAt: "2023-11-20T14:30:00Z",
    specialization: "Technical Interview",
    activeStudents: 0,
  },
  {
    id: "coach_125",
    fullName: "Robert Smith",
    email: "robert.smith@example.com",
    status: "active",
    joinedAt: "2023-03-10T09:15:00Z",
    specialization: "Leadership",
    activeStudents: 5,
  },
  {
    id: "coach_126",
    fullName: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    status: "inactive",
    joinedAt: "2022-12-01T11:00:00Z",
    specialization: "Resume Building",
    activeStudents: 0,
  },
  {
    id: "coach_127",
    fullName: "Michael Brown",
    email: "michael.brown@example.com",
    status: "active",
    joinedAt: "2023-05-22T16:45:00Z",
    specialization: "Negotiation",
    activeStudents: 8,
  },
];

export function CoachesTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoaches = MOCK_COACHES.filter(
    (coach) =>
      coach.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
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
              {filteredCoaches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No coaches found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoaches.map((coach) => (
                  <TableRow key={coach.id}>
                    <TableCell className="font-medium">{coach.fullName}</TableCell>
                    <TableCell>{coach.email}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(coach.status)} variant="secondary">
                        {coach.status.charAt(0).toUpperCase() + coach.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{coach.specialization}</TableCell>
                    <TableCell>{coach.activeStudents}</TableCell>
                    <TableCell>
                      {new Date(coach.joinedAt).toLocaleDateString()}
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
                            onClick={() => navigator.clipboard.writeText(coach.email)}
                          >
                            Copy Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Coach</DropdownMenuItem>
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
