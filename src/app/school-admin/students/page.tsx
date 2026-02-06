"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  Eye,
  RefreshCw,
  Users,
  Clock,
  UserCheck,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useStudents, useResendStudentInvite, useRemoveStudent } from "@/hooks/useSchoolAdmin";
import { StudentInviteForm } from "@/components/school-admin/StudentInviteForm";
import { StudentStatus } from "@/types/student";

export default function StudentsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const limit = 10;

  const { data: students, isLoading, refetch } = useStudents({
    page,
    limit,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const resendInvite = useResendStudentInvite();
  const removeStudent = useRemoveStudent();

  const handleResendInvite = async (studentId: string, studentName: string) => {
    try {
      await resendInvite.mutateAsync(studentId);
      toast.success(t("schoolAdmin.students.resendSuccess", "Invitation resent successfully"));
    } catch (error) {
      toast.error(t("schoolAdmin.students.resendError", "Failed to resend invitation"));
    }
  };

  const confirmRemoveStudent = (studentId: string, studentName: string) => {
    setDeleteId(studentId);
    setDeleteName(studentName);
    setIsDeleteOpen(true);
  };

  const handleRemoveStudent = async () => {
    if (!deleteId) return;
    try {
      await removeStudent.mutateAsync(deleteId);
      toast.success(t("schoolAdmin.students.removeSuccess", "Student removed successfully"));
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(t("schoolAdmin.students.removeError", "Failed to remove student"));
    }
  };

  const handleViewDetails = (studentId: string) => {
    router.push(`/school-admin/students/${studentId}`);
  };

  const getStatusBadge = (status: StudentStatus) => {
    const styles = {
      active: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      accepted: "bg-blue-100 text-blue-700",
      inactive: "bg-gray-100 text-gray-700",
    };
    return styles[status] || styles.inactive;
  };

  const stats = [
    { label: t("schoolAdmin.stats.totalStudents", "Total"), value: students?.total || 0, icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
    { label: t("schoolAdmin.students.status.pending", "Pending"), value: students?.data?.filter(s => s.status === 'pending').length || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: t("schoolAdmin.students.status.active", "Active"), value: students?.data?.filter(s => s.status === 'active').length || 0, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {t("schoolAdmin.students.title", "Students")}
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              {t("schoolAdmin.students.subtitle", "Manage and invite students to your school.")}
            </p>
          </div>

          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 h-12 text-sm font-semibold">
                <UserPlus className="mr-2 h-4 w-4" />
                {t("schoolAdmin.students.inviteButton", "Invite Student")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl rounded-2xl p-0 overflow-hidden gap-0">
              <DialogHeader className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
                <DialogTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <UserPlus className="h-5 w-5 text-teal-600" />
                  </div>
                  {t("schoolAdmin.students.inviteTitle", "Invite Students")}
                </DialogTitle>
                <DialogDescription className="text-base pt-1">
                  {t("schoolAdmin.students.inviteDescription", "Send invitations to students to join your school.")}
                </DialogDescription>
              </DialogHeader>
              <div className="p-6">
                <StudentInviteForm onSuccess={() => {
                  setIsInviteOpen(false);
                  refetch();
                }} />
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("schoolAdmin.students.searchPlaceholder", "Search students...")}
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("schoolAdmin.students.allStatuses", "All Statuses")}</SelectItem>
              <SelectItem value="active">{t("schoolAdmin.students.status.active", "Active")}</SelectItem>
              <SelectItem value="pending">{t("schoolAdmin.students.status.pending", "Pending")}</SelectItem>
              <SelectItem value="accepted">{t("schoolAdmin.students.status.accepted", "Accepted")}</SelectItem>
              <SelectItem value="inactive">{t("schoolAdmin.students.status.inactive", "Inactive")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>{t("schoolAdmin.students.table.student", "Student")}</TableHead>
                <TableHead>{t("schoolAdmin.students.table.status", "Status")}</TableHead>
                <TableHead>{t("schoolAdmin.students.table.progress", "Progress")}</TableHead>
                <TableHead>{t("schoolAdmin.students.table.avgScore", "Avg. Score")}</TableHead>
                <TableHead>{t("schoolAdmin.students.table.lastActive", "Last Active")}</TableHead>
                <TableHead className="text-right">{t("schoolAdmin.students.table.actions", "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="animate-spin h-5 w-5 text-gray-400" />
                      <span className="text-gray-500">{t("schoolAdmin.common.loading", "Loading...")}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !students?.data || students.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">{t("schoolAdmin.students.noStudents", "No students found")}</p>
                      <p className="text-gray-400 text-sm">{t("schoolAdmin.students.noStudentsDesc", "Invite students to get started")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.data.map((student) => (
                  <TableRow key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-medium">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getStatusBadge(student.status))}>
                        {t(`schoolAdmin.students.status.${student.status}`, student.status.charAt(0).toUpperCase() + student.status.slice(1))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{student.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{student.averageScore.toFixed(1)}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : t("schoolAdmin.students.neverActive", "Never")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(student.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("schoolAdmin.students.actions.viewDetails", "View Details")}
                          </DropdownMenuItem>
                          {student.status === 'pending' && (
                            <DropdownMenuItem onClick={() => handleResendInvite(student.id, student.name)}>
                              <Mail className="mr-2 h-4 w-4" />
                              {t("schoolAdmin.students.actions.resendInvite", "Resend Invite")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600 w-full cursor-pointer"
                            onSelect={(e) => {
                              e.preventDefault();
                              confirmRemoveStudent(student.id, student.name);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("schoolAdmin.students.actions.removeStudent", "Remove Student")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {students && students.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, students.total)} of {students.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  {t("common.previous", "Previous")}
                </Button>
                <span className="text-sm text-gray-500">
                  {t("common.page", "Page")} {page} {t("common.of", "of")} {students.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= students.totalPages || isLoading}
                >
                  {t("common.next", "Next")}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("schoolAdmin.students.deleteTitle", "Delete Student")}</DialogTitle>
              <DialogDescription>
                {t("schoolAdmin.students.deleteConfirm", "Are you sure you want to delete")} <span className="font-semibold text-gray-900">{deleteName}</span>? {t("schoolAdmin.students.deleteWarning", "This action cannot be undone.")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("common.cancel", "Cancel")}</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleRemoveStudent}>
                {t("common.delete", "Delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
