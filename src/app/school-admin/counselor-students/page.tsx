"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCheck, Search, Users, Plus, Trash2, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useSchoolUsers, useAssignStudents, useUnassignStudents, useCounselorStudents } from "@/hooks/useSchoolProfileQueries";
import { useStudents } from "@/hooks/useSchoolAdmin";
import type { SchoolUser } from "@/types/assessmentConfig";

function CounselorRow({ counselor }: { counselor: SchoolUser }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const { data: assignedStudents, isLoading: loadingAssigned } = useCounselorStudents(
    counselor.id,
    { limit: 100 }
  );
  const { data: allStudents } = useStudents({ limit: 200 });
  const assign = useAssignStudents();
  const unassign = useUnassignStudents();

  const assignedIds = new Set(assignedStudents?.data?.map((s: any) => s.id) ?? []);
  const availableStudents = (allStudents?.data ?? []).filter(
    (s) => !assignedIds.has(s.id) && s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = () => {
    if (!selected.length) return;
    assign.mutate(
      { counselorId: counselor.id, payload: { studentIds: selected } },
      {
        onSuccess: () => {
          toast.success(t("schoolAdmin.counselorStudents.assigned", `${selected.length} student(s) assigned`));
          setAssignOpen(false);
          setSelected([]);
        },
        onError: () => toast.error(t("schoolAdmin.counselorStudents.assignError", "Failed to assign students")),
      }
    );
  };

  const handleUnassign = (studentId: string) => {
    unassign.mutate(
      { counselorId: counselor.id, payload: { studentIds: [studentId] } },
      {
        onSuccess: () => toast.success(t("schoolAdmin.counselorStudents.unassigned", "Student removed")),
        onError: () => toast.error(t("schoolAdmin.counselorStudents.unassignError", "Failed to remove")),
      }
    );
  };

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded((v) => !v)}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                {counselor.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{counselor.name}</p>
              <p className="text-xs text-gray-500">{counselor.email}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="capitalize text-indigo-700 border-indigo-200 bg-indigo-50">
            {counselor.role}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">{assignedStudents?.total ?? "—"} students</Badge>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            className="border-teal-200 text-teal-700 hover:bg-teal-50"
            onClick={() => setAssignOpen(true)}
          >
            <Plus className="h-3 w-3 mr-1" /> Assign Students
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded Students */}
      {expanded && (
        <TableRow>
          <TableCell colSpan={4} className="bg-gray-50/50 p-0">
            <div className="p-4 space-y-2">
              {loadingAssigned
                ? <Skeleton className="h-8 w-full" />
                : assignedStudents?.data?.length
                  ? assignedStudents.data.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-teal-100 text-teal-700">{s.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{s.name}</span>
                        {s.gradeLevel && <Badge variant="outline" className="text-xs">Grade {s.gradeLevel}</Badge>}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50 h-7"
                        onClick={() => handleUnassign(s.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                  : <p className="text-sm text-gray-400 text-center py-4">No students assigned yet.</p>
              }
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Students to {counselor.name}</DialogTitle>
            <DialogDescription>Select students to add to this counselor&apos;s caseload</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
            <div className="max-h-64 overflow-y-auto space-y-1 border rounded-lg p-2">
              {availableStudents.length === 0
                ? <p className="text-sm text-gray-400 text-center py-6">All students are already assigned</p>
                : availableStudents.map((s) => (
                  <label key={s.id} className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <Checkbox
                      checked={selected.includes(s.id)}
                      onCheckedChange={(checked) =>
                        setSelected((prev) => checked ? [...prev, s.id] : prev.filter((id) => id !== s.id))
                      }
                    />
                    <span className="text-sm font-medium">{s.name}</span>
                    {(s as any).gradeLevel && <Badge variant="outline" className="text-xs ml-auto">Grade {(s as any).gradeLevel}</Badge>}
                  </label>
                ))
              }
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAssignOpen(false); setSelected([]); }}>Cancel</Button>
            <Button
              onClick={handleAssign}
              disabled={!selected.length || assign.isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {assign.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign {selected.length > 0 ? `(${selected.length})` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function CounselorStudentsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useSchoolUsers({ role: "counselor", limit: 50 });

  const counselors = (users?.data ?? []).filter(
    (u: SchoolUser) =>
      u.role === "counselor" &&
      (!search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("schoolAdmin.counselorStudents.title", "Counselor — Student Assignments")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.counselorStudents.subtitle", "Manage which students each counselor is responsible for.")}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{users?.total ?? 0}</p>
            <p className="text-sm text-gray-500">Total Counselors</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UserCheck className="h-5 w-5 text-teal-500" />
            </div>
            <p className="text-3xl font-bold text-teal-600">Active</p>
            <p className="text-sm text-gray-500">Caseload management</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {counselors.filter((c) => c.accessScope === "all").length}
            </p>
            <p className="text-sm text-gray-500">All-access counselors</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search counselors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 max-w-sm"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Counselors
            </CardTitle>
            <CardDescription>Click a counselor to expand their assigned student list</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {counselors.length === 0 ? (
              <div className="text-center py-16">
                <UserCheck className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">
                  {search ? "No counselors match your search." : "No counselors found. Invite counselors from Users & Roles."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="pl-6">Counselor</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {counselors.map((counselor) => (
                    <CounselorRow key={counselor.id} counselor={counselor} />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
