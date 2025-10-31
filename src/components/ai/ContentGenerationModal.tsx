/**
 * ContentGenerationModal Component
 * 
 * Modal dialog for entering generation context and previewing results.
 * Handles the full generation workflow: input → loading → results → approval.
 */

'use client';

import { useState } from 'react';
import {
  X,
  Loader,
  Check,
  RotateCcw,
  AlertCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ATSScoreDisplay } from './ATSScoreDisplay';
import { GenerationContextForm } from './GenerationContextForm';

export type GenerationStep = 'config' | 'loading' | 'result';

export interface GenerationResult {
  id: string;
  content: string | string[];
  atsScore?: number;
  wordCount?: number;
  keywordsIncluded?: string[];
  tone?: string;
}

export interface ContentGenerationModalProps {
  isOpen: boolean;
  field: 'summary' | 'objective' | 'bullets' | 'project' | 'skill';
  context: Record<string, any>;
  onClose: () => void;
  onApply: (content: string | string[]) => void;
  onAlternatives?: () => void;
}

export function ContentGenerationModal({
  isOpen,
  field,
  context,
  onClose,
  onApply,
  onAlternatives,
}: ContentGenerationModalProps) {
  const [step, setStep] = useState<GenerationStep>('config');
  const [generatedContent, setGeneratedContent] = useState<GenerationResult | null>(null);
  const [alternatives, setAlternatives] = useState<GenerationResult[]>([]);
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationContext, setGenerationContext] = useState(context);
  const [copied, setCopied] = useState(false);

  const fieldLabels: Record<string, string> = {
    summary: 'Professional Summary',
    objective: 'Career Objective',
    bullets: 'Job Bullet Points',
    project: 'Project Description',
    skill: 'Skill Description',
  };

  const apiEndpoints: Record<string, string> = {
    summary: '/api/resume/generate/professional-summary',
    objective: '/api/resume/generate/career-objective',
    bullets: '/api/resume/generate/job-bullets',
    project: '/api/resume/generate/project-description',
    skill: '/api/resume/generate/project-description',
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setStep('loading');

    try {
      const endpoint = apiEndpoints[field];
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(generationContext),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `Generation failed (${response.status})`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Generation failed');
      }

      const content = data.data.generated_content || data.data.bulletPoints || '';

      setGeneratedContent({
        id: 'main',
        content,
        atsScore: data.data.atsScore,
        wordCount: data.data.wordCount,
        keywordsIncluded: data.data.keywordsIncluded,
        tone: data.data.tone || generationContext.tone,
      });

      if (data.data.alternatives) {
        setAlternatives(
          data.data.alternatives.map((alt: any, idx: number) => ({
            id: `alt-${idx}`,
            content: alt.content,
            atsScore: alt.atsScore,
            tone: alt.tone,
          }))
        );
      }

      setStep('result');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setStep('config');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    const contentToApply =
      alternatives.length > 0
        ? alternatives[selectedAlternativeIndex].content
        : generatedContent?.content;

    if (contentToApply) {
      onApply(contentToApply);
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent(null);
    setAlternatives([]);
    setSelectedAlternativeIndex(0);
    setStep('config');
  };

  const handleCopyToClipboard = async () => {
    const contentToCopy =
      alternatives.length > 0
        ? alternatives[selectedAlternativeIndex].content
        : generatedContent?.content;

    if (contentToCopy) {
      try {
        const textToCopy = Array.isArray(contentToCopy)
          ? contentToCopy.join('\n')
          : contentToCopy;
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-lg border border-border shadow-lg">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">✨ AI Content Generator</h2>
            <p className="text-xs text-muted-foreground">
              {fieldLabels[field]} - Optimized for ATS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Config Step */}
          {step === 'config' && (
            <div className="space-y-4">
              <GenerationContextForm
                field={field}
                context={generationContext}
                onContextChange={setGenerationContext}
              />

              {/* Error Message */}
              {error && (
                <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Generation Failed</p>
                    <p className="text-xs text-destructive/80">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-input rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Loading Step */}
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                <Loader className="w-12 h-12 text-primary animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-foreground">Generating content...</p>
                <p className="text-xs text-muted-foreground">
                  This usually takes 2-5 seconds
                </p>
              </div>
            </div>
          )}

          {/* Result Step */}
          {step === 'result' && generatedContent && (
            <div className="space-y-4">
              {/* Generated Content */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Generated Content
                </label>
                <div className="p-3 bg-muted/30 border border-border rounded-lg">
                  {Array.isArray(generatedContent.content) ? (
                    <ul className="space-y-2">
                      {generatedContent.content.map((bullet, idx) => (
                        <li key={idx} className="text-sm text-foreground flex gap-2">
                          <span className="text-muted-foreground flex-shrink-0">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {generatedContent.content}
                    </p>
                  )}
                </div>
              </div>

              {/* ATS Score */}
              {generatedContent.atsScore !== undefined && (
                <ATSScoreDisplay
                  score={generatedContent.atsScore}
                  wordCount={generatedContent.wordCount}
                  keywordsIncluded={generatedContent.keywordsIncluded}
                />
              )}

              {/* Alternatives Navigation */}
              {alternatives.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Alternatives ({selectedAlternativeIndex + 1} of {alternatives.length + 1})
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setSelectedAlternativeIndex(Math.max(0, selectedAlternativeIndex - 1))
                        }
                        disabled={selectedAlternativeIndex === 0}
                        className="p-1 hover:bg-accent rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedAlternativeIndex(
                            Math.min(alternatives.length - 1, selectedAlternativeIndex + 1)
                          )
                        }
                        disabled={selectedAlternativeIndex === alternatives.length - 1}
                        className="p-1 hover:bg-accent rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg text-sm hover:bg-accent transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg text-sm hover:bg-accent transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Regenerate
                </button>
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Use This
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
