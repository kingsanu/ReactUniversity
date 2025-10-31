/**
 * GenerateButton Component
 * 
 * Reusable button component for triggering AI content generation.
 * Handles loading states, error feedback, and modal triggering.
 */

'use client';

import { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentGenerationModal } from './ContentGenerationModal';

export interface GenerateButtonProps {
  field: 'summary' | 'objective' | 'bullets' | 'project' | 'skill';
  context: Record<string, any>;
  onGenerate: (content: string | string[]) => void;
  onClose?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'outlined';
}

export function GenerateButton({
  field,
  context,
  onGenerate,
  onClose,
  isLoading = false,
  disabled = false,
  className = '',
  showLabel = false,
  size = 'sm',
  variant = 'icon',
}: GenerateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variantClasses = {
    icon: 'p-1 hover:bg-accent rounded transition-colors',
    button: 'flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20',
    outlined: 'flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-primary text-primary hover:bg-primary/5',
  };

  const fieldLabels: Record<string, string> = {
    summary: 'Professional Summary',
    objective: 'Career Objective',
    bullets: 'Job Bullets',
    project: 'Project Description',
    skill: 'Skill Description',
  };

  const fieldTooltips: Record<string, string> = {
    summary: 'Generate professional summary using AI',
    objective: 'Generate career objective using AI',
    bullets: 'Generate achievement-focused bullet points using AI',
    project: 'Generate project description using AI',
    skill: 'Generate skill description using AI',
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
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        title={fieldTooltips[field]}
        aria-label={`${fieldTooltips[field]} (${fieldLabels[field]})`}
      >
        {isLoading ? (
          <>
            <Loader className={cn(sizeClasses[size], 'animate-spin')} />
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
