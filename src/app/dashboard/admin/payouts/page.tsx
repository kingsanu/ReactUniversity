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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, DollarSign, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock Data for Pending Payouts
const MOCK_PAYOUTS = [
  {
    id: "PAY-5001",
    coachId: "C-101",
    coachName: "Dr. Emily Smith",
    amount: 1450.00,
    periodStart: "2024-03-01",
    periodEnd: "2024-03-15",
    status: "pending",
  },
  {
    id: "PAY-5002",
    coachId: "C-102",
    coachName: "Michael Johnson",
    amount: 850.50,
    periodStart: "2024-03-01",
    periodEnd: "2024-03-15",
    status: "pending",
  },
  {
    id: "PAY-5003",
    coachId: "C-105",
    coachName: "Sarah Connor",
    amount: 2100.00,
    periodStart: "2024-02-01",
    periodEnd: "2024-02-29",
    status: "pending",
  },
];

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState(MOCK_PAYOUTS);
  const [searchTerm, setSearchTerm] = useState("");

  const handleApprove = (id: string) => {
    // In real app, call API to approve
    setPayouts(payouts.filter(p => p.id !== id));
    console.log(`Approved payout ${id}`);
  };

  const handleReject = (id: string) => {
    // In real app, open modal for reason
    setPayouts(payouts.filter(p => p.id !== id));
    console.log(`Rejected payout ${id}`);
  };

  const totalPending = payouts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payout Management</h1>
        <p className="text-gray-500 font-medium mt-1">
          Review and approve coach payouts for the current cycle.
        </p>
      </div>

       {/* Stats Section */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 text-white border-0">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 uppercase">Total Pending</CardTitle>
             </CardHeader>
             <CardContent>
                <span className="text-4xl font-bold">${totalPending.toLocaleString()}</span>
                <p className="text-gray-400 text-sm mt-1">{payouts.length} requests awaiting action</p>
             </CardContent>
          </Card>
           <Card>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">Processed (This Month)</CardTitle>
             </CardHeader>
             <CardContent>
                <span className="text-4xl font-bold text-gray-900">$12,450</span>
                <p className="text-green-600 text-sm mt-1 font-medium">All settlements cleared</p>
             </CardContent>
          </Card>
       </div>

       {/* Main Content */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-4">
           <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                      placeholder="Search coach or payout ID..." 
                      className="pl-9 bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter Status
              </Button>
           </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payout ID</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.filter(p => !searchTerm || p.coachName.toLowerCase().includes(searchTerm.toLowerCase())).map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="font-medium">{payout.id}</TableCell>
                <TableCell>
                    <div>
                        <p className="font-medium text-gray-900">{payout.coachName}</p>
                        <p className="text-xs text-gray-500">{payout.coachId}</p>
                    </div>
                </TableCell>
                <TableCell className="text-gray-500">
                    {payout.periodStart} - {payout.periodEnd}
                </TableCell>
                <TableCell className="text-right font-bold text-gray-900">
                  ${payout.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {payout.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(payout.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(payout.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {payouts.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                        No pending payouts found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
