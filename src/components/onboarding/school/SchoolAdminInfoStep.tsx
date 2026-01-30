"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Building2, User, Phone, Briefcase } from "lucide-react";

interface AdminInfo {
  name: string;
  phone?: string;
  position?: string;
}

interface SchoolAdminInfoStepProps {
  data: AdminInfo;
  schoolName: string;
  email: string;
  onNext: (data: AdminInfo) => void;
}

export function SchoolAdminInfoStep({
  data,
  schoolName,
  email,
  onNext,
}: SchoolAdminInfoStepProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AdminInfo>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = t("validation.required", "This field is required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* School Info (Read-only) */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <Building2 className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("onboarding.school.schoolName", "School")}</p>
            <p className="font-semibold text-gray-900">{schoolName}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {t("onboarding.school.adminEmail", "Admin Email")}: <span className="text-gray-700">{email}</span>
        </div>
      </div>

      {/* Admin Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          {t("onboarding.school.adminName", "Your Full Name")} *
        </Label>
        <Input
          id="name"
          type="text"
          placeholder={t("onboarding.school.namePlaceholder", "John Smith")}
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Position */}
      <div className="space-y-2">
        <Label htmlFor="position" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-500" />
          {t("onboarding.school.position", "Position / Title")}
        </Label>
        <Input
          id="position"
          type="text"
          placeholder={t("onboarding.school.positionPlaceholder", "Principal, Administrator, etc.")}
          value={formData.position || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          {t("onboarding.school.phone", "Phone Number")}
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder={t("onboarding.school.phonePlaceholder", "+1 (555) 123-4567")}
          value={formData.phone || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 text-white h-12 text-base font-medium"
      >
        {t("common.continue", "Continue")}
      </Button>
    </form>
  );
}
