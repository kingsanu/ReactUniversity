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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Search, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useSchoolUsers,
  useInviteStaff,
  useUpdateUserRole,
} from "@/hooks/useSchoolProfileQueries";
import type { SchoolRole } from "@/types/assessmentConfig";

const roleColors: Record<SchoolRole, string> = {
  school_admin: "bg-purple-100 text-purple-700",
  counselor: "bg-teal-100 text-teal-700",
  staff: "bg-blue-100 text-blue-700",
  student: "bg-gray-100 text-gray-700",
};

export default function UsersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"counselor" | "staff">("counselor");
  const { data, isLoading } = useSchoolUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    page,
    limit: 20,
  });
  const invite = useInviteStaff();
  const updateRole = useUpdateUserRole();

  const handleInvite = () => {
    if (!inviteEmail || !inviteName) {
      toast.error(t("schoolAdmin.users.fillRequired", "Name and email are required"));
      return;
    }

    invite.mutate(
      { email: inviteEmail, name: inviteName, role: inviteRole },
      {
        onSuccess: () => {
          toast.success(t("schoolAdmin.users.invited", "Staff member invited"));
          setInviteOpen(false);
          setInviteName("");
          setInviteEmail("");
        },
        onError: () => toast.error(t("schoolAdmin.users.inviteError", "Failed to invite")),
      }
    );
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRole.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => toast.success(t("schoolAdmin.users.roleUpdated", "Role updated")),
        onError: () => toast.error(t("schoolAdmin.users.roleError", "Failed to update role")),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("schoolAdmin.users.title", "User Management")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.users.subtitle", "Manage staff, counselors, and role assignments.")}
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("schoolAdmin.users.searchPlaceholder", "Search by name or email...")}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t("schoolAdmin.users.allRoles", "All Roles")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("schoolAdmin.users.allRoles", "All Roles")}</SelectItem>
            <SelectItem value="school_admin">{t("schoolAdmin.users.roleAdmin", "Admin")}</SelectItem>
            <SelectItem value="counselor">{t("schoolAdmin.users.roleCounselor", "Counselor")}</SelectItem>
            <SelectItem value="staff">{t("schoolAdmin.users.roleStaff", "Staff")}</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />{t("schoolAdmin.users.invite", "Invite Staff")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("schoolAdmin.users.inviteTitle", "Invite Staff Member")}</DialogTitle>
              <DialogDescription>{t("schoolAdmin.users.inviteDesc", "Send an invitation email to a new staff member.")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("schoolAdmin.users.name", "Full Name")}</Label>
                <Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("schoolAdmin.users.email", "Email")}</Label>
                <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("schoolAdmin.users.role", "Role")}</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "counselor" | "staff")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="counselor">{t("schoolAdmin.users.roleCounselor", "Counselor")}</SelectItem>
                    <SelectItem value="staff">{t("schoolAdmin.users.roleStaff", "Staff")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>{t("common.cancel", "Cancel")}</Button>
              <Button onClick={handleInvite} disabled={invite.isPending} className="bg-teal-600 hover:bg-teal-700 text-white">
                {invite.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("schoolAdmin.users.sendInvite", "Send Invite")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              {t("schoolAdmin.users.listTitle", "Users")}
              {data && <Badge variant="secondary">{data.total}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("schoolAdmin.users.name", "Name")}</TableHead>
                  <TableHead>{t("schoolAdmin.users.email", "Email")}</TableHead>
                  <TableHead>{t("schoolAdmin.users.role", "Role")}</TableHead>
                  <TableHead>{t("schoolAdmin.users.status", "Status")}</TableHead>
                  <TableHead>{t("schoolAdmin.users.students", "Students")}</TableHead>
                  <TableHead>{t("schoolAdmin.users.actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-gray-500">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role] || "bg-gray-100 text-gray-700"}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.assignedStudentCount ?? "—"}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(v) => handleRoleChange(user.id, v)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="school_admin">Admin</SelectItem>
                          <SelectItem value="counselor">Counselor</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.data || data.data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                      {t("schoolAdmin.users.empty", "No users found")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            {t("common.previous", "Previous")}
          </Button>
          <span className="text-sm text-gray-500 self-center">
            {page} / {data.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
            {t("common.next", "Next")}
          </Button>
        </div>
      )}
    </div>
  );
}
