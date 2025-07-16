"use client";
import { useState } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import {
  GraduationCap,
  Award,
  BookOpen,
  Lightbulb,
  Star,
  Trophy,
} from "lucide-react";

interface EducationForm {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

const initialEducationForm: EducationForm = {
  degree: "",
  institution: "",
  location: "",
  graduationDate: "",
  gpa: "",
};

export function EducationStep() {
  const { resumeBuilder, addEducation, updateEducation, removeEducation } =
    useGlobalStore();
  const { education, userProfile } = resumeBuilder.data;

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EducationForm>(initialEducationForm);

  const handleInputChange = (field: keyof EducationForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (editingId) {
      updateEducation(editingId, formData);
      setEditingId(null);
    } else {
      addEducation(formData);
    }
    setFormData(initialEducationForm);
    setIsAdding(false);
  };

  const handleEdit = (edu: any) => {
    setFormData(edu);
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setFormData(initialEducationForm);
    setEditingId(null);
    setIsAdding(false);
  };

  // Profile-aware guidance for education
  const getEducationGuidance = () => {
    if (!userProfile) return null;

    const guidance = {
      title: "",
      description: "",
      tips: [] as string[],
      showGPA: false,
      gpaThreshold: 0,
      additionalSections: [] as string[],
      placeholders: {
        degree: "",
        institution: "",
      },
    };

    switch (userProfile.careerLevel) {
      case "entry-level":
        guidance.title = "Education - Your Foundation";
        guidance.description =
          "Education is crucial for entry-level positions. Highlight your academic achievements.";
        guidance.showGPA = true;
        guidance.gpaThreshold = 3.5;
        guidance.tips = [
          "Include your GPA if it's 3.5 or higher",
          "Add relevant coursework, projects, or honors",
          "Mention academic achievements and scholarships",
          "Include study abroad or exchange programs",
        ];
        guidance.additionalSections = [
          "Relevant Coursework",
          "Academic Projects",
          "Honors & Awards",
          "Study Abroad Programs",
        ];
        guidance.placeholders = {
          degree: "e.g., Bachelor of Science in Computer Science",
          institution: "e.g., University of California, Berkeley",
        };
        break;

      case "mid-career":
        guidance.title = "Education - Professional Foundation";
        guidance.description =
          "Focus on degrees relevant to your career progression.";
        guidance.showGPA = false;
        guidance.tips = [
          "List degrees in reverse chronological order",
          "Include professional certifications",
          "Mention continuing education or training",
          "GPA is optional unless exceptional (3.8+)",
        ];
        guidance.additionalSections = [
          "Professional Certifications",
          "Continuing Education",
          "Professional Development",
        ];
        guidance.placeholders = {
          degree:
            "e.g., Master of Business Administration, Bachelor of Engineering",
          institution: "e.g., Stanford Graduate School of Business",
        };
        break;

      case "senior":
        guidance.title = "Education - Leadership Credentials";
        guidance.description =
          "Emphasize advanced degrees and executive education.";
        guidance.showGPA = false;
        guidance.tips = [
          "Highlight advanced degrees (MBA, MS, PhD)",
          "Include executive education programs",
          "Mention board certifications or licenses",
          "Focus on prestigious institutions if applicable",
        ];
        guidance.additionalSections = [
          "Executive Education",
          "Board Certifications",
          "Professional Licenses",
        ];
        guidance.placeholders = {
          degree:
            "e.g., Master of Business Administration, Ph.D. in Engineering",
          institution: "e.g., Harvard Business School, MIT",
        };
        break;

      case "executive":
        guidance.title = "Education - Executive Credentials";
        guidance.description =
          "Showcase advanced degrees and executive programs from top institutions.";
        guidance.showGPA = false;
        guidance.tips = [
          "Lead with highest degree from prestigious institutions",
          "Include executive leadership programs",
          "Mention board positions or fellowships",
          "Keep it concise - focus on most relevant credentials",
        ];
        guidance.additionalSections = [
          "Executive Leadership Programs",
          "Board Positions",
          "Professional Fellowships",
        ];
        guidance.placeholders = {
          degree: "e.g., Master of Business Administration, J.D., Ph.D.",
          institution: "e.g., Wharton School, Harvard Law School",
        };
        break;
    }

    return guidance;
  };

  const guidance = getEducationGuidance();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile-aware header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          {guidance?.title || "Education"}
        </h2>
        <p className="text-sm text-gray-600">
          {guidance?.description ||
            "Add your educational background, starting with your highest degree."}
        </p>
        {userProfile && (
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {userProfile.careerLevel.replace("-", " ")}
            </Badge>
            {userProfile.careerLevel === "entry-level" ? (
              <Badge variant="secondary" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Education Focus
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                <Award className="h-3 w-3 mr-1" />
                Credentials
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Profile-aware guidance card */}
      {guidance && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-purple-800">
              <Lightbulb className="h-4 w-4 mr-2" />
              Education Tips for {userProfile?.careerLevel.replace(
                "-",
                " "
              )}{" "}
              Professionals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-purple-700 space-y-1">
              {guidance.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-1 h-1 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Additional sections suggestion */}
      {guidance?.additionalSections.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-amber-800">
              <Trophy className="h-4 w-4 mr-2" />
              Consider Adding These Sections
            </CardTitle>
            <CardDescription className="text-amber-700">
              Enhance your education section with relevant additions:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {guidance.additionalSections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs text-amber-700"
                >
                  <Star className="h-3 w-3 mr-2 text-amber-600" />
                  {section}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Education List */}
      {education.length > 0 && (
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">
                    {edu.location} • {edu.graduationDate}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(edu)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding ? (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">
            {editingId ? "Edit Education" : "Add New Education"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleInputChange("degree", e.target.value)}
                placeholder={
                  guidance?.placeholders.degree ||
                  "Bachelor of Science in Computer Science"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) =>
                  handleInputChange("institution", e.target.value)
                }
                placeholder={
                  guidance?.placeholders.institution ||
                  "University of California"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Berkeley, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationDate">Graduation Date</Label>
              <Input
                id="graduationDate"
                type="month"
                value={formData.graduationDate}
                onChange={(e) =>
                  handleInputChange("graduationDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                value={formData.gpa}
                onChange={(e) => handleInputChange("gpa", e.target.value)}
                placeholder="3.8"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSubmit}>
              {editingId ? "Update Education" : "Add Education"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          + Add Education
        </Button>
      )}
    </motion.div>
  );
}
