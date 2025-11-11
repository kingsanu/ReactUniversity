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
import { AIFieldType } from "./GenerateButton";

export interface GenerationContextFormProps {
  field: AIFieldType;
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
    experience_description: [
      {
        name: "job_title",
        label: "Job Title",
        type: "text",
        required: true,
        placeholder: "e.g., Senior Software Engineer",
        tooltip: "Your role/title at this position",
      },
      {
        name: "company",
        label: "Company",
        type: "text",
        placeholder: "e.g., Google",
        tooltip: "Company name",
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
        name: "achievements",
        label: "Key Achievements",
        type: "textarea",
        placeholder: "e.g., 40% performance improvement, 99.9% uptime",
        tooltip: "Quantifiable results from your work",
      },
      {
        name: "technologies",
        label: "Technologies/Skills Used",
        type: "text",
        placeholder: "e.g., React, Node.js, AWS, PostgreSQL",
        tooltip: "Technologies and skills you used in this role",
      },
    ],
    experience_bullets: [
      {
        name: "job_title",
        label: "Job Title",
        type: "text",
        required: true,
        placeholder: "e.g., Backend Developer",
        tooltip: "Your role/title at this position",
      },
      {
        name: "company",
        label: "Company",
        type: "text",
        placeholder: "e.g., Microsoft",
        tooltip: "Company name",
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
        name: "achievements",
        label: "Metrics/Results",
        type: "textarea",
        placeholder: "e.g., 40% performance improvement, 99.9% uptime",
        tooltip: "Quantifiable results from your work",
      },
      {
        name: "technologies",
        label: "Technologies/Skills Used",
        type: "text",
        placeholder: "e.g., Python, Django, Docker, Kubernetes",
        tooltip: "Technologies and skills you used in this role",
      },
    ],
    education_description: [
      {
        name: "degree",
        label: "Degree",
        type: "text",
        required: true,
        placeholder: "e.g., Bachelor of Science in Computer Science",
        tooltip: "Your degree or qualification",
      },
      {
        name: "institution",
        label: "Institution",
        type: "text",
        required: true,
        placeholder: "e.g., Stanford University",
        tooltip: "Name of the educational institution",
      },
      {
        name: "field_of_study",
        label: "Field of Study",
        type: "text",
        placeholder: "e.g., Computer Science",
        tooltip: "Your major or field of study",
      },
      {
        name: "achievements",
        label: "Achievements/Honors",
        type: "textarea",
        placeholder: "e.g., Dean's List, GPA 3.8/4.0, Summa Cum Laude",
        tooltip: "Academic achievements, honors, or awards",
      },
      {
        name: "coursework",
        label: "Relevant Coursework",
        type: "textarea",
        placeholder:
          "e.g., Data Structures, Algorithms, Machine Learning, Database Systems",
        tooltip: "Relevant courses you took",
      },
    ],
    project_description: [
      {
        name: "project_name",
        label: "Project Name",
        type: "text",
        required: true,
        placeholder: "e.g., E-commerce Platform",
        tooltip: "Name of the project",
      },
      {
        name: "technologies",
        label: "Technologies Used",
        type: "text",
        required: true,
        placeholder: "e.g., React, Node.js, MongoDB, AWS",
        tooltip: "Technologies and tools used in the project",
      },
      {
        name: "role",
        label: "Your Role",
        type: "text",
        placeholder: "e.g., Full Stack Developer, Team Lead",
        tooltip: "Your role in the project",
      },
      {
        name: "description",
        label: "Project Description",
        type: "textarea",
        placeholder: "What was the project about?",
        tooltip: "Brief description of the project",
      },
      {
        name: "impact",
        label: "Impact/Results",
        type: "textarea",
        placeholder: "e.g., Increased sales by 30%, Reduced load time by 50%",
        tooltip: "Measurable impact or results",
      },
    ],
    project_bullets: [
      {
        name: "project_name",
        label: "Project Name",
        type: "text",
        required: true,
        placeholder: "e.g., Mobile Banking App",
        tooltip: "Name of the project",
      },
      {
        name: "technologies",
        label: "Technologies Used",
        type: "text",
        required: true,
        placeholder: "e.g., React Native, Firebase, Redux",
        tooltip: "Technologies and tools used in the project",
      },
      {
        name: "role",
        label: "Your Role",
        type: "text",
        placeholder: "e.g., Mobile Developer",
        tooltip: "Your role in the project",
      },
      {
        name: "description",
        label: "Project Description",
        type: "textarea",
        placeholder: "What was the project about?",
        tooltip: "Brief description of the project",
      },
      {
        name: "impact",
        label: "Impact/Results",
        type: "textarea",
        placeholder: "e.g., 10K+ downloads, 4.5 star rating",
        tooltip: "Measurable impact or results",
      },
    ],
    course_description: [
      {
        name: "course_name",
        label: "Course Name",
        type: "text",
        required: true,
        placeholder: "e.g., AWS Certified Solutions Architect",
        tooltip: "Name of the course or certification",
      },
      {
        name: "provider",
        label: "Provider/Institution",
        type: "text",
        placeholder: "e.g., Amazon Web Services, Coursera",
        tooltip: "Who provided the course or certification",
      },
      {
        name: "skills_learned",
        label: "Skills Learned",
        type: "textarea",
        placeholder: "e.g., Cloud architecture, EC2, S3, Lambda",
        tooltip: "Key skills or knowledge gained",
      },
      {
        name: "projects",
        label: "Projects/Assignments",
        type: "textarea",
        placeholder: "e.g., Built scalable web application on AWS",
        tooltip: "Notable projects or assignments completed",
      },
    ],
    award_description: [
      {
        name: "award_name",
        label: "Award Name",
        type: "text",
        required: true,
        placeholder: "e.g., Employee of the Year",
        tooltip: "Name of the award or achievement",
      },
      {
        name: "organization",
        label: "Issuing Organization",
        type: "text",
        placeholder: "e.g., TechCorp Inc.",
        tooltip: "Organization that issued the award",
      },
      {
        name: "reason",
        label: "Reason for Award",
        type: "textarea",
        placeholder: "e.g., Outstanding performance in Q4 2023",
        tooltip: "Why you received this award",
      },
      {
        name: "impact",
        label: "Impact/Significance",
        type: "textarea",
        placeholder: "e.g., Recognized among 500+ employees",
        tooltip: "The significance or impact of this award",
      },
    ],
    organization_description: [
      {
        name: "organization_name",
        label: "Organization Name",
        type: "text",
        required: true,
        placeholder: "e.g., IEEE Computer Society",
        tooltip: "Name of the organization",
      },
      {
        name: "role",
        label: "Your Role",
        type: "text",
        placeholder: "e.g., Member, Vice President",
        tooltip: "Your role in the organization",
      },
      {
        name: "activities",
        label: "Activities/Responsibilities",
        type: "textarea",
        placeholder: "e.g., Organized tech talks, mentored students",
        tooltip: "What you did in this organization",
      },
      {
        name: "achievements",
        label: "Achievements",
        type: "textarea",
        placeholder: "e.g., Increased membership by 30%",
        tooltip: "Notable achievements in this role",
      },
    ],
    publication_description: [
      {
        name: "title",
        label: "Publication Title",
        type: "text",
        required: true,
        placeholder: "e.g., Machine Learning in Healthcare",
        tooltip: "Title of the publication",
      },
      {
        name: "publisher",
        label: "Publisher/Journal",
        type: "text",
        placeholder: "e.g., IEEE Transactions, Medium",
        tooltip: "Where it was published",
      },
      {
        name: "topic",
        label: "Topic/Subject",
        type: "textarea",
        placeholder: "e.g., Application of ML algorithms in diagnosis",
        tooltip: "What the publication is about",
      },
      {
        name: "impact",
        label: "Impact/Citations",
        type: "textarea",
        placeholder: "e.g., 50+ citations, Featured in top journal",
        tooltip: "Impact or recognition of the publication",
      },
    ],
    language_description: [
      {
        name: "language",
        label: "Language",
        type: "text",
        required: true,
        placeholder: "e.g., Spanish",
        tooltip: "The language",
      },
      {
        name: "proficiency",
        label: "Proficiency Level",
        type: "text",
        placeholder: "e.g., Native, Fluent, Intermediate",
        tooltip: "Your proficiency level",
      },
      {
        name: "context",
        label: "Context/Usage",
        type: "textarea",
        placeholder: "e.g., Used in business meetings, customer support",
        tooltip: "How you use this language",
      },
    ],
    volunteer_description: [
      {
        name: "organization",
        label: "Organization",
        type: "text",
        required: true,
        placeholder: "e.g., Red Cross, Local Food Bank",
        tooltip: "Organization where you volunteered",
      },
      {
        name: "role",
        label: "Your Role",
        type: "text",
        placeholder: "e.g., Volunteer Coordinator",
        tooltip: "Your role in the volunteer work",
      },
      {
        name: "activities",
        label: "Activities",
        type: "textarea",
        required: true,
        placeholder: "e.g., Organized food drives, coordinated volunteers",
        tooltip: "What you did as a volunteer",
      },
      {
        name: "impact",
        label: "Impact",
        type: "textarea",
        placeholder: "e.g., Served 500+ families, raised $10K",
        tooltip: "The impact of your volunteer work",
      },
    ],
    reference_description: [
      {
        name: "name",
        label: "Reference Name",
        type: "text",
        required: true,
        placeholder: "e.g., John Smith",
        tooltip: "Name of the reference",
      },
      {
        name: "relationship",
        label: "Relationship",
        type: "text",
        placeholder: "e.g., Former Manager, Professor",
        tooltip: "Your relationship with this person",
      },
      {
        name: "context",
        label: "Context",
        type: "textarea",
        placeholder: "e.g., Worked together at TechCorp for 3 years",
        tooltip: "Context of your relationship",
      },
    ],
    declaration_text: [
      {
        name: "name",
        label: "Your Full Name",
        type: "text",
        required: true,
        placeholder: "e.g., John Doe",
        tooltip: "Your full legal name",
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "e.g., New York, USA",
        tooltip: "Your current location",
      },
    ],
    custom_description: [
      {
        name: "section_title",
        label: "Section Title",
        type: "text",
        required: true,
        placeholder: "e.g., Hobbies, Additional Information",
        tooltip: "Title of your custom section",
      },
      {
        name: "context",
        label: "Context/Purpose",
        type: "textarea",
        required: true,
        placeholder: "e.g., Personal interests, additional skills",
        tooltip: "What this section is about",
      },
      {
        name: "key_points",
        label: "Key Points",
        type: "textarea",
        placeholder: "e.g., Photography, hiking, open source contributions",
        tooltip: "Main points to include",
      },
    ],
    custom_bullets: [
      {
        name: "section_title",
        label: "Section Title",
        type: "text",
        required: true,
        placeholder: "e.g., Technical Skills, Certifications",
        tooltip: "Title of your custom section",
      },
      {
        name: "context",
        label: "Context/Purpose",
        type: "textarea",
        required: true,
        placeholder: "e.g., Additional technical skills not listed elsewhere",
        tooltip: "What this section is about",
      },
      {
        name: "key_points",
        label: "Key Points",
        type: "textarea",
        placeholder: "e.g., Docker, Kubernetes, CI/CD, Microservices",
        tooltip: "Main points to include as bullets",
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
