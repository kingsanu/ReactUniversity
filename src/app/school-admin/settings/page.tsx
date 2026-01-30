"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings,
  User,
  Lock,
  School,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useSchoolSettings } from "@/hooks/useSchoolAdmin";
import { updateAdminProfile, changePassword } from "@/services/schoolAdminService";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { data: settings, isLoading, refetch } = useSchoolSettings();

  // Profile form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name && !phone) {
      toast.error(t("schoolAdmin.settings.profile.fillRequired", "Please fill in at least one field"));
      return;
    }
    setProfileLoading(true);
    try {
      await updateAdminProfile({ name: name || undefined, phone: phone || undefined });
      toast.success(t("schoolAdmin.settings.profile.success", "Profile updated successfully"));
      refetch();
    } catch (error) {
      toast.error(t("schoolAdmin.settings.profile.error", "Failed to update profile"));
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error(t("schoolAdmin.settings.password.fillRequired", "Please fill in all password fields"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("schoolAdmin.settings.password.mismatch", "New passwords do not match"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t("schoolAdmin.settings.password.minLength", "Password must be at least 8 characters"));
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success(t("schoolAdmin.settings.password.success", "Password changed successfully"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(t("schoolAdmin.settings.password.error", "Failed to change password"));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {t("schoolAdmin.settings.title", "Settings")}
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            {t("schoolAdmin.settings.subtitle", "Manage your account and school settings.")}
          </p>
        </motion.div>

        {/* School Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-teal-600" />
                {t("schoolAdmin.settings.schoolInfo.title", "School Information")}
              </CardTitle>
              <CardDescription>{t("schoolAdmin.settings.schoolInfo.subtitle", "Your school details and contract information")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                </div>
              ) : settings ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-500">{t("schoolAdmin.settings.schoolInfo.name", "School Name")}</Label>
                      <p className="text-lg font-medium text-gray-900">{settings.school.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">{t("schoolAdmin.settings.schoolInfo.adminEmail", "Admin Email")}</Label>
                      <p className="text-lg font-medium text-gray-900">{settings.admin.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                        <Users className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t("schoolAdmin.settings.schoolInfo.maxStudents", "Student Capacity")}</p>
                        <p className="font-medium text-gray-900">
                          {settings.school.currentStudents} / {settings.school.maxStudents}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t("schoolAdmin.settings.schoolInfo.contractPeriod", "Contract Period")}</p>
                        <p className="font-medium text-gray-900">
                          {settings.school.contractStart} - {settings.school.contractEnd}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">{t("schoolAdmin.settings.schoolInfo.loadError", "Unable to load school info")}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                {t("schoolAdmin.settings.profile.title", "Profile Settings")}
              </CardTitle>
              <CardDescription>{t("schoolAdmin.settings.profile.subtitle", "Update your profile information")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("schoolAdmin.settings.profile.name", "Name")}</Label>
                  <Input
                    id="name"
                    placeholder={settings?.admin.name || t("schoolAdmin.settings.profile.namePlaceholder", "Your name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("schoolAdmin.settings.profile.phone", "Phone")}</Label>
                  <Input
                    id="phone"
                    placeholder={t("schoolAdmin.settings.profile.phonePlaceholder", "+1 234 567 8900")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={profileLoading}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                {profileLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("schoolAdmin.settings.profile.updating", "Saving...")}
                  </>
                ) : (
                  t("schoolAdmin.settings.profile.update", "Update Profile")
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-teal-600" />
                {t("schoolAdmin.settings.password.title", "Change Password")}
              </CardTitle>
              <CardDescription>{t("schoolAdmin.settings.password.subtitle", "Keep your account secure by using a strong password")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t("schoolAdmin.settings.password.current", "Current Password")}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder={t("schoolAdmin.settings.password.currentPlaceholder", "Enter current password")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("schoolAdmin.settings.password.new", "New Password")}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder={t("schoolAdmin.settings.password.newPlaceholder", "Enter new password")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("schoolAdmin.settings.password.confirm", "Confirm New Password")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("schoolAdmin.settings.password.confirmPlaceholder", "Confirm new password")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                variant="outline"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("schoolAdmin.settings.password.changing", "Changing...")}
                  </>
                ) : (
                  t("schoolAdmin.settings.password.change", "Change Password")
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
