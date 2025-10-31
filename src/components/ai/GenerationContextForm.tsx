/**
 * GenerationContextForm Component
 *
 * Form for collecting context and parameters for AI content generation.
 * Adapts fields based on the type of content being generated.
 */

"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GenerationContextFormProps {
  field: "summary" | "objective" | "bullets" | "project" | "skill";
  context: Record<string, any>;
  onContextChange: (context: Record<string, any>) => void;
}

export function GenerationContextForm({
  field,
  context,
  onContextChange,
}: GenerationContextFormProps) {
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const formFields: Record<
    string,
    Array<{
      name: string;
      label: string;
      type: string;
      required?: boolean;
      placeholder?: string;
      tooltip?: string;
    }>
  > = {
    summary: [
      {
        name: "current_role",
        label: "Current Role",
        type: "text",
        placeholder: "e.g., Senior Software Engineer",
        tooltip: "Your current job title or primary role",
      },
      {
        name: "key_skills",
        label: "Key Skills",
        type: "text",
        placeholder: "e.g., React, Node.js, TypeScript, AWS",
        tooltip: "Comma-separated list of your main skills",
      },
      {
        name: "years_experience",
        label: "Years of Experience",
        type: "number",
        placeholder: "e.g., 8",
        tooltip: "Total years in your field",
      },
      {
        name: "achievements",
        label: "Key Achievements (Optional)",
        type: "textarea",
        placeholder:
          "e.g., Led team of 5 engineers, increased performance by 40%",
        tooltip: "Major accomplishments or projects you're proud of",
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        tooltip: "Choose how formal or casual the summary should be",
      },
    ],
    objective: [
      {
        name: "target_role",
        label: "Target Role",
        type: "text",
        required: true,
        placeholder: "e.g., Product Manager",
        tooltip: "The position you're applying for",
      },
      {
        name: "industry",
        label: "Industry",
        type: "text",
        placeholder: "e.g., FinTech, SaaS, Healthcare",
        tooltip: "Industry or sector for the target role",
      },
      {
        name: "key_strengths",
        label: "Key Strengths",
        type: "textarea",
        required: true,
        placeholder: "e.g., Strategic thinking, team leadership, data analysis",
        tooltip: "Your main strengths for this role",
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        tooltip: "Professional, Enthusiastic, or Confident",
      },
    ],
    bullets: [
      {
        name: "job_title",
        label: "Job Title",
        type: "text",
        required: true,
        placeholder: "e.g., Backend Developer",
        tooltip: "Your role/title at this position",
      },
      {
        name: "responsibilities",
        label: "Main Responsibilities",
        type: "textarea",
        required: true,
        placeholder:
          "What did you do? e.g., Developed REST APIs, managed database migrations",
        tooltip: "Key tasks and responsibilities in this role",
      },
      {
        name: "metrics",
        label: "Metrics/Results (Optional)",
        type: "textarea",
        placeholder: "e.g., 40% performance improvement, 99.9% uptime",
        tooltip: "Quantifiable results from your work",
      },
      {
        name: "technologies",
        label: "Technologies Used",
        type: "text",
        placeholder: "e.g., React, Python, PostgreSQL, Docker",
        tooltip: "Tools and technologies you used",
      },
    ],
    project: [
      {
        name: "project_name",
        label: "Project Name",
        type: "text",
        required: true,
        placeholder: "e.g., E-commerce Platform",
        tooltip: "Name of the project",
      },
      {
        name: "project_description",
        label: "Project Description",
        type: "textarea",
        required: true,
        placeholder: "Brief overview of what the project does",
        tooltip: "What was the project about?",
      },
      {
        name: "your_role",
        label: "Your Role",
        type: "text",
        placeholder: "e.g., Lead Developer, Frontend Engineer",
        tooltip: "What was your role in the project?",
      },
      {
        name: "impact",
        label: "Impact/Results (Optional)",
        type: "textarea",
        placeholder: "e.g., Used by 10,000+ users, 50% faster than competitors",
        tooltip: "Results or impact of the project",
      },
    ],
    skill: [
      {
        name: "skill_name",
        label: "Skill Name",
        type: "text",
        required: true,
        placeholder: "e.g., React, Project Management, Data Analysis",
        tooltip: "The skill you want to describe",
      },
      {
        name: "proficiency_level",
        label: "Proficiency Level",
        type: "select",
        tooltip: "Your level of expertise in this skill",
      },
      {
        name: "experience_examples",
        label: "Experience Examples",
        type: "textarea",
        placeholder: "e.g., Built 5+ production apps, managed 50+ projects",
        tooltip: "Examples of how you've used this skill",
      },
    ],
  };

  const toneOptions = [
    "Professional",
    "Enthusiastic",
    "Confident",
    "Analytical",
    "Creative",
  ];
  const proficiencyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const fields = formFields[field] || [];

  const handleFieldChange = (fieldName: string, value: any) => {
    onContextChange({
      ...context,
      [fieldName]: value,
    });
  };

  const renderField = (field: any) => {
    const value = context[field.name] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        );

      case "select":
        const options =
          field.name === "tone"
            ? toneOptions
            : field.name === "proficiency_level"
            ? proficiencyOptions
            : [];

        return (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
            >
              <option value="">Select an option</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-900">
          <strong>💡 Tip:</strong> The more details you provide, the better the
          generated content will be.
        </p>
      </div>

      {fields.map((fieldConfig) => (
        <div key={fieldConfig.name} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label
              htmlFor={fieldConfig.name}
              className="text-sm font-medium text-foreground"
            >
              {fieldConfig.label}
              {fieldConfig.required && (
                <span className="text-destructive">*</span>
              )}
            </label>
            {fieldConfig.tooltip && (
              <button
                type="button"
                onClick={() =>
                  setExpandedTip(
                    expandedTip === fieldConfig.name ? null : fieldConfig.name
                  )
                }
                className="p-0.5 hover:bg-accent rounded transition-colors"
                title={fieldConfig.tooltip}
              >
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {expandedTip === fieldConfig.name && (
            <div className="px-2 py-1 text-xs text-muted-foreground bg-muted rounded">
              {fieldConfig.tooltip}
            </div>
          )}

          {renderField(fieldConfig)}
        </div>
      ))}

      <div className="flex items-start gap-2 p-3 bg-muted/30 border border-border rounded-lg">
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Your information is used only to generate content and is not stored.
          The generated content will be optimized for ATS systems.
        </p>
      </div>
    </div>
  );
}
