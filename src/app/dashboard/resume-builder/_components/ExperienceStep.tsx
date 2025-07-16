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
import { cn } from "@/lib/utils";
import {
  Briefcase,
  TrendingUp,
  Award,
  Lightbulb,
  Target,
  Users,
  BarChart3,
} from "lucide-react";

interface ExperienceForm {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

const initialExperienceForm: ExperienceForm = {
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: [""],
};

export function ExperienceStep() {
  const { resumeBuilder, addExperience, updateExperience, removeExperience } =
    useGlobalStore();
  const { experience, userProfile } = resumeBuilder.data;

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceForm>(
    initialExperienceForm
  );
  const [showFresherTips, setShowFresherTips] = useState(
    experience.length === 0
  );

  const handleInputChange = (
    field: keyof ExperienceForm,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData((prev) => ({ ...prev, description: newDescription }));
  };

  const addDescriptionBullet = () => {
    setFormData((prev) => ({
      ...prev,
      description: [...prev.description, ""],
    }));
  };

  const removeDescriptionBullet = (index: number) => {
    if (formData.description.length > 1) {
      const newDescription = formData.description.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, description: newDescription }));
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateExperience(editingId, formData);
      setEditingId(null);
    } else {
      addExperience(formData);
    }
    setFormData(initialExperienceForm);
    setIsAdding(false);
  };

  const handleEdit = (exp: any) => {
    setFormData(exp);
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setFormData(initialExperienceForm);
    setEditingId(null);
    setIsAdding(false);
  };

  // Profile-aware guidance
  const getExperienceGuidance = () => {
    if (!userProfile) return null;

    const guidance = {
      title: "",
      description: "",
      tips: [] as string[],
      placeholders: {
        jobTitle: "",
        company: "",
        description: "",
      },
      showAlternatives: false,
      alternatives: [] as string[],
    };

    switch (userProfile.careerLevel) {
      case "entry-level":
        guidance.title = "Building Your Experience Foundation";
        guidance.description =
          "Include any relevant experience, even if it's not traditional employment";
        guidance.showAlternatives = !userProfile.hasWorkExperience;
        guidance.alternatives = [
          "Internships (paid or unpaid)",
          "Part-time or seasonal jobs",
          "Freelance or contract work",
          "Volunteer positions",
          "Academic projects with real impact",
          "Leadership roles in organizations",
        ];
        guidance.tips = [
          "Focus on transferable skills and achievements",
          "Quantify your impact with numbers when possible",
          "Highlight any leadership or initiative-taking",
          "Include relevant coursework projects if applicable",
        ];
        guidance.placeholders = {
          jobTitle:
            "e.g., Marketing Intern, Volunteer Coordinator, Freelance Designer",
          company: "e.g., Local Startup, Community Center, Personal Client",
          description: "• Describe what you accomplished and learned...",
        };
        break;

      case "mid-career":
        guidance.title = "Showcasing Your Professional Growth";
        guidance.description =
          "Highlight your career progression and increasing responsibilities";
        guidance.tips = [
          "Show career progression and promotions",
          "Quantify achievements with specific metrics",
          "Highlight leadership and mentoring experience",
          "Focus on business impact and results",
        ];
        guidance.placeholders = {
          jobTitle: "e.g., Senior Analyst, Team Lead, Project Manager",
          company:
            "e.g., Fortune 500 Company, Growing Startup, Consulting Firm",
          description:
            "• Led team of X people to achieve Y% improvement in Z...",
        };
        break;

      case "senior":
        guidance.title = "Demonstrating Strategic Leadership";
        guidance.description =
          "Emphasize strategic contributions and organizational impact";
        guidance.tips = [
          "Focus on strategic initiatives and business outcomes",
          "Highlight team leadership and organizational changes",
          "Show cross-functional collaboration and influence",
          "Quantify large-scale impact and transformations",
        ];
        guidance.placeholders = {
          jobTitle:
            "e.g., Director of Operations, Senior Manager, Principal Consultant",
          company:
            "e.g., Enterprise Corporation, Industry Leader, Major Consultancy",
          description:
            "• Spearheaded strategic initiative resulting in $X revenue increase...",
        };
        break;

      case "executive":
        guidance.title = "Executive Leadership and Vision";
        guidance.description =
          "Showcase transformational leadership and organizational impact";
        guidance.tips = [
          "Lead with transformational business outcomes",
          "Highlight P&L responsibility and financial impact",
          "Show board-level and stakeholder management",
          "Demonstrate industry thought leadership",
        ];
        guidance.placeholders = {
          jobTitle:
            "e.g., Vice President, Chief Technology Officer, General Manager",
          company:
            "e.g., Public Corporation, Industry Giant, Global Enterprise",
          description:
            "• Transformed organization achieving $X revenue growth and Y% efficiency...",
        };
        break;
    }

    return guidance;
  };

  const guidance = getExperienceGuidance();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile-aware header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          {guidance?.title || "Work Experience"}
        </h2>
        <p className="text-sm text-gray-600">
          {guidance?.description ||
            "Add your professional experience, starting with your most recent position."}
        </p>
        {userProfile && (
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {userProfile.careerLevel.replace("-", " ")} •{" "}
              {userProfile.yearsOfExperience} years
            </Badge>
            {userProfile.hasWorkExperience ? (
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Experienced
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Entry Level
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Profile-aware guidance card */}
      {guidance && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-green-800">
              <Lightbulb className="h-4 w-4 mr-2" />
              Tips for {userProfile?.careerLevel.replace("-", " ")}{" "}
              Professionals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-green-700 space-y-1">
              {guidance.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Alternative experience options for entry-level */}
      {guidance?.showAlternatives && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-blue-800">
              <Award className="h-4 w-4 mr-2" />
              What Counts as Experience?
            </CardTitle>
            <CardDescription className="text-blue-700">
              Don't have traditional work experience? Include any of these:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {guidance.alternatives.map((alt, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs text-blue-700"
                >
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                  {alt}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fresher Tips */}
      {showFresherTips && experience.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">
                New to the workforce? No problem!
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Work experience is optional. You can include any of these
                instead:
              </p>
              <ul className="text-sm text-blue-700 space-y-1 mb-3">
                <li>
                  • <strong>Internships</strong> - Paid or unpaid work
                  experience
                </li>
                <li>
                  • <strong>Part-time jobs</strong> - Retail, food service,
                  tutoring, etc.
                </li>
                <li>
                  • <strong>Freelance work</strong> - Any project-based work
                </li>
                <li>
                  • <strong>Volunteer work</strong> - Community service or NGO
                  work
                </li>
                <li>
                  • <strong>Personal projects</strong> - Websites, apps, or
                  other creations
                </li>
                <li>
                  • <strong>Leadership roles</strong> - Club president, team
                  captain, etc.
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <p className="text-xs text-blue-600">
                  Focus on transferable skills and achievements!
                </p>
                <button
                  onClick={() => setShowFresherTips(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Got it, hide this
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Existing Experience List */}
      {experience.length > 0 && (
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {exp.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {exp.company} • {exp.location}
                  </p>
                  <p className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(exp)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeExperience(exp.id)}
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
            {editingId ? "Edit Experience" : "Add New Experience"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Position/Role *</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                placeholder={
                  guidance?.placeholders.jobTitle ||
                  "e.g., Software Intern, Sales Associate, Volunteer Coordinator"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Organization *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder={
                  guidance?.placeholders.company ||
                  "e.g., Tech Corp, Local NGO, Freelance Client"
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
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">Current Position</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) =>
                    handleInputChange("current", e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="current" className="text-sm text-gray-700">
                  I currently work here
                </label>
              </div>
            </div>

            {!formData.current && (
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Job Description & Achievements</Label>
            {formData.description.map((desc, index) => (
              <div key={index} className="flex space-x-2">
                <textarea
                  value={desc}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  placeholder={
                    guidance?.placeholders.description ||
                    "• Describe your responsibilities and achievements..."
                  }
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formData.description.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeDescriptionBullet(index)}
                    className="text-red-600"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={addDescriptionBullet}
              className="mt-2"
            >
              + Add Achievement
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSubmit}>
              {editingId ? "Update Experience" : "Add Experience"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          + Add Work Experience
        </Button>
      )}
    </motion.div>
  );
}
