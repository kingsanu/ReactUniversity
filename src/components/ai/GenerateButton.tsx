/**
 * GenerateButton Component
 *
 * Reusable button component for triggering AI content generation.
 * Handles loading states, error feedback, and modal triggering.
 */

"use client";

import { useState } from "react";
import { Sparkles, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentGenerationModal } from "./ContentGenerationModal";

export type AIFieldType =
  | "summary"
  | "objective"
  | "bullets"
  | "project"
  | "skill"
  | "experience_description"
  | "experience_bullets"
  | "education_description"
  | "project_description"
  | "project_bullets"
  | "course_description"
  | "award_description"
  | "organization_description"
  | "publication_description"
  | "language_description"
  | "volunteer_description"
  | "reference_description"
  | "declaration_text"
  | "custom_description"
  | "custom_bullets";

export interface GenerateButtonProps {
  field: AIFieldType;
  context: Record<string, any>;
  onGenerate: (content: string | string[]) => void;
  onClose?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button" | "outlined";
}

export function GenerateButton({
  field,
  context,
  onGenerate,
  onClose,
  isLoading = false,
  disabled = false,
  className = "",
  showLabel = false,
  size = "sm",
  variant = "icon",
}: GenerateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const variantClasses = {
    icon: "p-1 hover:bg-accent rounded transition-colors",
    button:
      "flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20",
    outlined:
      "flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-primary text-primary hover:bg-primary/5",
  };

  const fieldLabels: Record<string, string> = {
    summary: "Professional Summary",
    objective: "Career Objective",
    bullets: "Job Bullets",
    project: "Project Description",
    skill: "Skill Description",
    experience_description: "Experience Description",
    experience_bullets: "Experience Bullets",
    education_description: "Education Description",
    project_description: "Project Description",
    project_bullets: "Project Bullets",
    course_description: "Course Description",
    award_description: "Award Description",
    organization_description: "Organization Description",
    publication_description: "Publication Description",
    language_description: "Language Description",
    volunteer_description: "Volunteer Description",
    reference_description: "Reference Description",
    declaration_text: "Declaration Text",
    custom_description: "Custom Section Description",
    custom_bullets: "Custom Section Bullets",
  };

  const fieldTooltips: Record<string, string> = {
    summary: "Generate professional summary using AI",
    objective: "Generate career objective using AI",
    bullets: "Generate achievement-focused bullet points using AI",
    project: "Generate project description using AI",
    skill: "Generate skill description using AI",
    experience_description: "Generate experience description using AI",
    experience_bullets: "Generate experience bullet points using AI",
    education_description: "Generate education description using AI",
    project_description: "Generate project description using AI",
    project_bullets: "Generate project bullet points using AI",
    course_description: "Generate course description using AI",
    award_description: "Generate award description using AI",
    organization_description: "Generate organization description using AI",
    publication_description: "Generate publication description using AI",
    language_description: "Generate language description using AI",
    volunteer_description: "Generate volunteer work description using AI",
    reference_description: "Generate reference description using AI",
    declaration_text: "Generate declaration text using AI",
    custom_description: "Generate custom section description using AI",
    custom_bullets: "Generate custom section bullet points using AI",
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  const handleGenerate = (content: string | string[]) => {
    onGenerate(content);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={cn(
          variantClasses[variant],
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        title={fieldTooltips[field]}
        aria-label={`${fieldTooltips[field]} (${fieldLabels[field]})`}
      >
        {isLoading ? (
          <>
            <Loader className={cn(sizeClasses[size], "animate-spin")} />
            {showLabel && <span>Generating...</span>}
          </>
        ) : (
          <>
            <Sparkles className={sizeClasses[size]} />
            {showLabel && <span>Generate</span>}
          </>
        )}
      </button>

      <ContentGenerationModal
        isOpen={isModalOpen}
        field={field}
        context={context}
        onClose={handleModalClose}
        onApply={handleGenerate}
      />
    </>
  );
}
