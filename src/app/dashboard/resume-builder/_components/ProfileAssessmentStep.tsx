"use client";

import { useState, useEffect } from "react";
import { useGlobalStore, UserProfile } from "@/store/useGlobalStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Building, Target, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const careerLevels = [
  {
    value: "entry-level" as const,
    label: "Entry Level",
    description: "0-2 years of experience",
    icon: User,
    yearsOfExperience: 1,
    hasWorkExperience: false,
  },
  {
    value: "mid-career" as const,
    label: "Mid Career",
    description: "3-7 years of experience",
    icon: Briefcase,
    yearsOfExperience: 5,
    hasWorkExperience: true,
  },
  {
    value: "senior" as const,
    label: "Senior",
    description: "8-15 years of experience",
    icon: Building,
    yearsOfExperience: 10,
    hasWorkExperience: true,
  },
  {
    value: "executive" as const,
    label: "Executive",
    description: "15+ years of experience",
    icon: Target,
    yearsOfExperience: 15,
    hasWorkExperience: true,
  },
];

const employmentStatuses = [
  {
    value: "student" as const,
    label: "Student",
    description: "Currently studying",
  },
  {
    value: "employed" as const,
    label: "Employed",
    description: "Currently working",
  },
  {
    value: "unemployed" as const,
    label: "Unemployed",
    description: "Seeking employment",
  },
  {
    value: "career-change" as const,
    label: "Career Change",
    description: "Transitioning careers",
  },
];

const commonIndustries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Sales",
  "Consulting",
  "Legal",
  "Government",
  "Non-profit",
  "Manufacturing",
  "Retail",
  "Media",
  "Design",
  "Arts",
  "Research",
  "Startups",
  "Real Estate",
  "Transportation",
  "Other",
];

export function ProfileAssessmentStep() {
  const { resumeBuilder, setUserProfile } = useGlobalStore();
  const { userProfile } = resumeBuilder;

  const [formData, setFormData] = useState<Partial<UserProfile>>(
    userProfile || {
      careerLevel: undefined,
      employmentStatus: undefined,
      industry: "",
      targetRole: "",
      yearsOfExperience: 0,
      hasWorkExperience: false,
      profileScore: 0,
    }
  );

  const handleCareerLevelChange = (value: UserProfile["careerLevel"]) => {
    const careerLevelData = careerLevels.find((level) => level.value === value);
    if (!careerLevelData) return;

    const updatedData = {
      ...formData,
      careerLevel: value,
      yearsOfExperience: careerLevelData.yearsOfExperience,
      hasWorkExperience: careerLevelData.hasWorkExperience,
    };

    setFormData(updatedData);
    updateProfileInStore(updatedData);
  };

  const handleEmploymentStatusChange = (
    value: UserProfile["employmentStatus"]
  ) => {
    const updatedData = { ...formData, employmentStatus: value };
    setFormData(updatedData);
    updateProfileInStore(updatedData);
  };

  const handleIndustryChange = (value: string) => {
    const updatedData = { ...formData, industry: value };
    setFormData(updatedData);
    updateProfileInStore(updatedData);
  };

  const handleTargetRoleChange = (value: string) => {
    const updatedData = { ...formData, targetRole: value };
    setFormData(updatedData);
    updateProfileInStore(updatedData);
  };

  const updateProfileInStore = (data: Partial<UserProfile>) => {
    // Only save to store if we have the required fields
    if (data.careerLevel && data.employmentStatus && data.industry) {
      const completeProfile: UserProfile = {
        careerLevel: data.careerLevel,
        employmentStatus: data.employmentStatus,
        industry: data.industry,
        targetRole: data.targetRole || "",
        yearsOfExperience: data.yearsOfExperience || 0,
        hasWorkExperience: data.hasWorkExperience || false,
        profileScore: calculateProfileScore(data as UserProfile),
      };
      setUserProfile(completeProfile);
    }
  };

  const calculateProfileScore = (profile: UserProfile): number => {
    let score = 0;

    // Base score for completing all fields
    score += 40;

    // Bonus for work experience
    if (profile.hasWorkExperience) {
      score += 20;
    }

    // Bonus for target role specificity
    if (profile.targetRole?.trim()) {
      score += 15;
    }

    // Bonus for industry specificity
    if (profile.industry && profile.industry !== "Other") {
      score += 15;
    }

    // Bonus for career progression alignment
    if (
      (profile.careerLevel === "entry-level" &&
        profile.yearsOfExperience <= 2) ||
      (profile.careerLevel === "mid-career" &&
        profile.yearsOfExperience >= 3 &&
        profile.yearsOfExperience <= 7) ||
      (profile.careerLevel === "senior" &&
        profile.yearsOfExperience >= 8 &&
        profile.yearsOfExperience <= 15) ||
      (profile.careerLevel === "executive" && profile.yearsOfExperience >= 15)
    ) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  const getCompletionPercentage = (): number => {
    const requiredFields = ["careerLevel", "employmentStatus", "industry"];
    const completedFields = requiredFields.filter(
      (field) => formData[field as keyof UserProfile]
    ).length;

    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const isFormComplete = getCompletionPercentage() === 100;

  return (
    <div className="max-h-screen overflow-hidden">
      {/* Compact Header */}
      <div className="text-center mb-8 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 rounded-2xl -z-10"></div>

        <div className="relative py-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300 rounded-full px-6 py-2 shadow-sm mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-blue-800">Profile Assessment</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Tell us about yourself
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us understand your background to recommend the perfect resume template
          </p>

          {/* Compact Progress Bar */}
          <div className="mt-4 flex items-center justify-center space-x-3">
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
              {getCompletionPercentage()}%
            </span>
          </div>
        </div>
      </div>

      {/* Compact Form Layout */}
      <div className="max-h-[60vh] overflow-y-auto space-y-6 px-1">
        {/* Career Level Selection - Compact */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <h3 id="career-level-heading" className="text-lg font-semibold text-gray-900">Career Level</h3>
          </div>
          <RadioGroup
            value={formData.careerLevel || ""}
            onValueChange={handleCareerLevelChange}
            className="grid grid-cols-2 gap-3"
            aria-labelledby="career-level-heading"
          >
            {careerLevels.map((level) => {
              const Icon = level.icon;
              return (
                <Label
                  key={level.value}
                  htmlFor={level.value}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md min-h-[44px]",
                    formData.careerLevel === level.value
                      ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <RadioGroupItem value={level.value} id={level.value} className="sr-only" />
                  <Icon className={cn(
                    "h-5 w-5",
                    formData.careerLevel === level.value ? "text-blue-600" : "text-gray-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium text-sm",
                      formData.careerLevel === level.value ? "text-blue-900" : "text-gray-900"
                    )}>
                      {level.label}
                    </div>
                    <div className={cn(
                      "text-xs leading-tight",
                      formData.careerLevel === level.value ? "text-blue-700" : "text-gray-500"
                    )}>
                      {level.description}
                    </div>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        {/* Employment Status - Compact */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <User className="h-5 w-5 text-green-600" />
            <h3 id="employment-status-heading" className="text-lg font-semibold text-gray-900">Employment Status</h3>
          </div>
          <RadioGroup
            value={formData.employmentStatus || ""}
            onValueChange={handleEmploymentStatusChange}
            className="grid grid-cols-2 gap-3"
            aria-labelledby="employment-status-heading"
          >
            {employmentStatuses.map((status) => (
              <Label
                key={status.value}
                htmlFor={status.value}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md min-h-[44px]",
                  formData.employmentStatus === status.value
                    ? "border-green-500 bg-green-50 shadow-md ring-1 ring-green-200"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <RadioGroupItem value={status.value} id={status.value} className="sr-only" />
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium text-sm",
                    formData.employmentStatus === status.value ? "text-green-900" : "text-gray-900"
                  )}>
                    {status.label}
                  </div>
                  <div className={cn(
                    "text-xs leading-tight",
                    formData.employmentStatus === status.value ? "text-green-700" : "text-gray-500"
                  )}>
                    {status.description}
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Industry Selection - Compact */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <Building className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Industry</h3>
          </div>
          <Select
            value={formData.industry || ""}
            onValueChange={handleIndustryChange}
          >
            <SelectTrigger className="h-12 text-base border-2 hover:border-purple-300 focus:border-purple-500 focus:ring-purple-200">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {commonIndustries.map((industry) => (
                <SelectItem key={industry} value={industry} className="text-base py-3">
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Role - Compact */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Target Role</h3>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <Input
            value={formData.targetRole || ""}
            onChange={(e) => handleTargetRoleChange(e.target.value)}
            placeholder="e.g., Senior Software Engineer, Marketing Manager"
            className="h-12 text-base border-2 hover:border-orange-300 focus:border-orange-500 focus:ring-orange-200"
          />
        </div>
      </div>

      {/* Completion Status - Compact */}
      {isFormComplete && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium text-sm">
              Profile Complete! Ready for template selection.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
