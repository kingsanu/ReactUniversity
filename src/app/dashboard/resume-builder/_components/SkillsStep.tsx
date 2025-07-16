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
  Zap,
  Lightbulb,
  Target,
  Users,
  Code,
  Globe,
  Sparkles,
} from "lucide-react";

interface SkillForm {
  name: string;
  category: "technical" | "soft" | "language";
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

const initialSkillForm: SkillForm = {
  name: "",
  category: "technical",
  level: "intermediate",
};

const skillCategories = [
  { value: "technical", label: "Technical Skills" },
  { value: "soft", label: "Soft Skills" },
  { value: "language", label: "Languages" },
];

const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export function SkillsStep() {
  const { resumeBuilder, addSkill, removeSkill } = useGlobalStore();
  const { skills, userProfile } = resumeBuilder.data;

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<SkillForm>(initialSkillForm);

  const handleInputChange = (field: keyof SkillForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.name.trim()) {
      addSkill(formData);
      setFormData(initialSkillForm);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialSkillForm);
    setIsAdding(false);
  };

  // Profile-aware skills guidance
  const getSkillsGuidance = () => {
    if (!userProfile) return null;

    const guidance = {
      title: "",
      description: "",
      tips: [] as string[],
      suggestedSkills: {
        technical: [] as string[],
        soft: [] as string[],
        language: [] as string[],
      },
      priorityCategories: [] as string[],
    };

    // Industry-specific skill suggestions
    const industrySkills: Record<
      string,
      { technical: string[]; soft: string[]; language: string[] }
    > = {
      Technology: {
        technical: [
          "JavaScript",
          "Python",
          "React",
          "Node.js",
          "SQL",
          "Git",
          "AWS",
          "Docker",
        ],
        soft: [
          "Problem Solving",
          "Analytical Thinking",
          "Team Collaboration",
          "Agile Methodology",
        ],
        language: ["English"],
      },
      Finance: {
        technical: [
          "Excel",
          "Financial Modeling",
          "Bloomberg Terminal",
          "SQL",
          "Python",
          "Tableau",
        ],
        soft: [
          "Analytical Skills",
          "Attention to Detail",
          "Risk Management",
          "Client Relations",
        ],
        language: ["English", "Mandarin"],
      },
      Marketing: {
        technical: [
          "Google Analytics",
          "SEO",
          "Social Media Marketing",
          "Adobe Creative Suite",
          "HubSpot",
        ],
        soft: [
          "Creative Thinking",
          "Communication",
          "Brand Strategy",
          "Content Creation",
        ],
        language: ["English", "Spanish"],
      },
      Design: {
        technical: [
          "Adobe Creative Suite",
          "Figma",
          "Sketch",
          "Prototyping",
          "UI/UX Design",
          "HTML/CSS",
        ],
        soft: [
          "Creative Problem Solving",
          "Visual Communication",
          "User Empathy",
          "Collaboration",
        ],
        language: ["English"],
      },
      Healthcare: {
        technical: [
          "Electronic Health Records",
          "Medical Terminology",
          "HIPAA Compliance",
          "Clinical Research",
        ],
        soft: [
          "Patient Care",
          "Empathy",
          "Attention to Detail",
          "Communication",
        ],
        language: ["English", "Spanish"],
      },
    };

    const userIndustrySkills = industrySkills[userProfile.industry] || {
      technical: ["Microsoft Office", "Project Management", "Data Analysis"],
      soft: [
        "Communication",
        "Leadership",
        "Problem Solving",
        "Time Management",
      ],
      language: ["English"],
    };

    guidance.suggestedSkills = userIndustrySkills;

    switch (userProfile.careerLevel) {
      case "entry-level":
        guidance.title = "Skills - Your Competitive Edge";
        guidance.description =
          "Highlight both technical and soft skills to show your potential";
        guidance.priorityCategories = ["technical", "soft"];
        guidance.tips = [
          "Include skills from coursework, projects, and internships",
          "Be honest about your skill levels - 'Intermediate' is perfectly fine",
          "Focus on skills relevant to your target role",
          "Include both hard and soft skills to show well-roundedness",
        ];
        break;

      case "mid-career":
        guidance.title = "Skills - Professional Expertise";
        guidance.description =
          "Showcase your developed expertise and leadership capabilities";
        guidance.priorityCategories = ["technical", "soft"];
        guidance.tips = [
          "Emphasize advanced technical skills and certifications",
          "Include leadership and management skills",
          "Show progression from basic to advanced levels",
          "Highlight skills that differentiate you from peers",
        ];
        break;

      case "senior":
        guidance.title = "Skills - Strategic Leadership";
        guidance.description =
          "Focus on high-level technical expertise and leadership skills";
        guidance.priorityCategories = ["soft", "technical"];
        guidance.tips = [
          "Lead with strategic and leadership skills",
          "Include advanced technical certifications",
          "Show expertise in industry-specific tools",
          "Highlight skills in team management and mentoring",
        ];
        break;

      case "executive":
        guidance.title = "Skills - Executive Competencies";
        guidance.description =
          "Emphasize strategic thinking and organizational leadership";
        guidance.priorityCategories = ["soft", "technical"];
        guidance.tips = [
          "Focus on strategic and visionary leadership skills",
          "Include board-level and stakeholder management",
          "Highlight transformation and change management",
          "Keep technical skills relevant but concise",
        ];
        break;
    }

    return guidance;
  };

  const guidance = getSkillsGuidance();

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: "bg-gray-200 text-gray-700",
      intermediate: "bg-blue-200 text-blue-700",
      advanced: "bg-green-200 text-green-700",
      expert: "bg-purple-200 text-purple-700",
    };
    return colors[level as keyof typeof colors] || colors.intermediate;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile-aware header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          {guidance?.title || "Skills"}
        </h2>
        <p className="text-sm text-gray-600">
          {guidance?.description ||
            "Add your technical skills, soft skills, and languages. Be specific and honest about your skill levels."}
        </p>
        {userProfile && (
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {userProfile.careerLevel.replace("-", " ")} •{" "}
              {userProfile.industry}
            </Badge>
            {guidance?.priorityCategories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category === "technical" ? (
                  <Code className="h-3 w-3 mr-1" />
                ) : category === "soft" ? (
                  <Users className="h-3 w-3 mr-1" />
                ) : (
                  <Globe className="h-3 w-3 mr-1" />
                )}
                {category}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Profile-aware guidance card */}
      {guidance && (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-indigo-800">
              <Lightbulb className="h-4 w-4 mr-2" />
              Skills Tips for {userProfile?.careerLevel.replace("-", " ")}{" "}
              Professionals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-indigo-700 space-y-1">
              {guidance.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-1 h-1 bg-indigo-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Industry-specific skill suggestions */}
      {guidance && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-emerald-800">
              <Target className="h-4 w-4 mr-2" />
              Popular Skills in {userProfile?.industry}
            </CardTitle>
            <CardDescription className="text-emerald-700">
              Consider adding these skills relevant to your industry:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(guidance.suggestedSkills).map(
                ([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-xs font-medium text-emerald-800 mb-2 flex items-center">
                      {category === "technical" ? (
                        <Code className="h-3 w-3 mr-1" />
                      ) : category === "soft" ? (
                        <Users className="h-3 w-3 mr-1" />
                      ) : (
                        <Globe className="h-3 w-3 mr-1" />
                      )}
                      {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {skills.slice(0, 6).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs text-emerald-700 border-emerald-300"
                        >
                          <Sparkles className="h-2 w-2 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Skills by Category */}
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="space-y-3">
          <h3 className="font-medium text-gray-900 capitalize">
            {skillCategories.find((cat) => cat.value === category)?.label ||
              category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 border"
              >
                <span className="text-sm font-medium text-gray-900">
                  {skill.name}
                </span>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full capitalize",
                    getLevelColor(skill.level)
                  )}
                >
                  {skill.level}
                </span>
                <button
                  onClick={() => {
                    // Add a small delay to prevent rapid state changes that might cause PDF rendering issues
                    setTimeout(() => removeSkill(skill.id), 10);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add Skill Form */}
      {isAdding ? (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">Add New Skill</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name *</Label>
              <Input
                id="skillName"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="JavaScript, Leadership, Spanish..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {skillCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Skill Level</Label>
              <select
                id="level"
                value={formData.level}
                onChange={(e) => handleInputChange("level", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSubmit}>Add Skill</Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          + Add Skill
        </Button>
      )}
    </motion.div>
  );
}
