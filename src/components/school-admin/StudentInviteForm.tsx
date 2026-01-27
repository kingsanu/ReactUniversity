"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, UserPlus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInviteStudent, useBulkInviteStudents } from "@/hooks/useSchoolAdmin";

interface StudentInviteFormProps {
  onSuccess?: () => void;
}

export function StudentInviteForm({ onSuccess }: StudentInviteFormProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("single");

  // Single invite state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Bulk invite state
  const [bulkData, setBulkData] = useState("");

  const inviteStudent = useInviteStudent();
  const bulkInviteStudents = useBulkInviteStudents();

  const handleSingleInvite = async () => {
    if (!email || !name) {
      toast.error(t("schoolAdmin.invite.fillRequired", "Please fill in all required fields"));
      return;
    }

    try {
      await inviteStudent.mutateAsync({ email, name });
      toast.success(t("schoolAdmin.invite.success", `Invitation sent to ${name}`));
      setName("");
      setEmail("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || t("schoolAdmin.invite.error", "Failed to send invitation"));
    }
  };

  const handleBulkInvite = async () => {
    if (!bulkData.trim()) {
      toast.error(t("schoolAdmin.invite.enterBulkData", "Please enter student data"));
      return;
    }

    // Parse bulk data (format: name,email per line)
    const lines = bulkData.trim().split("\n");
    const students = lines.map((line) => {
      const parts = line.split(",").map((s) => s.trim());
      return { name: parts[0] || "", email: parts[1] || "" };
    }).filter((s) => s.name && s.email);

    if (students.length === 0) {
      toast.error(t("schoolAdmin.invite.invalidFormat", "Invalid format. Use: name,email (one per line)"));
      return;
    }

    try {
      const result = await bulkInviteStudents.mutateAsync({ students });
      toast.success(t("schoolAdmin.invite.bulkSuccess", `Successfully invited ${result.invited} students`));
      if (result.failed > 0) {
        toast.warning(`${result.failed} invitations failed`);
      }
      setBulkData("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || t("schoolAdmin.invite.bulkError", "Failed to send invitations"));
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5 text-teal-600" />
          {t("schoolAdmin.invite.title", "Invite Students")}
        </CardTitle>
        <CardDescription>
          {t("schoolAdmin.invite.description", "Send invitations to students to join your school.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Single Invite
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Bulk Invite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("common.name", "Name")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("schoolAdmin.invite.namePlaceholder", "John Doe")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("common.email", "Email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("schoolAdmin.invite.emailPlaceholder", "student@email.com")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSingleInvite}
              disabled={inviteStudent.isPending}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              {inviteStudent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.sending", "Sending...")}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("schoolAdmin.invite.sendInvite", "Send Invitation")}
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulkData">
                {t("schoolAdmin.invite.bulkLabel", "Student List")}
              </Label>
              <Textarea
                id="bulkData"
                placeholder={t("schoolAdmin.invite.bulkPlaceholder", "John Doe, john@email.com\nJane Smith, jane@email.com")}
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                {t("schoolAdmin.invite.bulkHint", "Format: name, email (one student per line)")}
              </p>
            </div>
            <Button
              onClick={handleBulkInvite}
              disabled={bulkInviteStudents.isPending}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              {bulkInviteStudents.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.sending", "Sending...")}
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  {t("schoolAdmin.invite.sendBulkInvites", "Send All Invitations")}
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
