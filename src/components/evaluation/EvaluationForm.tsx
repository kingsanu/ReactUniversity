'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EvaluationSession, 
  EvaluationResponse, 
  CompetencyDimension, 
  RatingScale,
  EvaluatorGroup 
} from '@/services/evaluationService';
import { ValidationErrorMessage } from '@/components/ui/error-message';

interface EvaluationFormProps {
  session: EvaluationSession;
  evaluatorId: string;
  evaluatorGroup: EvaluatorGroup;
  onSubmit: (responses: EvaluationResponse[]) => Promise<void>;
  onSave?: (responses: EvaluationResponse[]) => Promise<void>;
  className?: string;
}

interface FormResponse {
  questionId: string;
  rating?: number;
  feedback?: string;
  isRequired: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
  session,
  evaluatorId,
  evaluatorGroup,
  onSubmit,
  onSave,
  className = ''
}) => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Group competencies by category
  const competencyCategories = session.competencyDimensions.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, CompetencyDimension[]>);

  const categories = Object.keys(competencyCategories);
  const currentCategory = categories[currentSection];
  const currentCompetencies = competencyCategories[currentCategory] || [];

  // Initialize responses
  useEffect(() => {
    const initialResponses: FormResponse[] = [];
    session.competencyDimensions.forEach(comp => {
      // Rating question
      initialResponses.push({
        questionId: `${comp.id}_rating`,
        isRequired: true
      });
      // Feedback question (optional)
      initialResponses.push({
        questionId: `${comp.id}_feedback`,
        isRequired: false
      });
    });
    setResponses(initialResponses);
  }, [session.competencyDimensions]);

  // Calculate progress
  useEffect(() => {
    const totalRequired = responses.filter(r => r.isRequired).length;
    const completedRequired = responses.filter(r => r.isRequired && r.rating !== undefined).length;
    setProgress(totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 0);
  }, [responses]);

  const updateResponse = (questionId: string, field: 'rating' | 'feedback', value: number | string) => {
    setResponses(prev => prev.map(r => 
      r.questionId === questionId 
        ? { ...r, [field]: value }
        : r
    ));
    // Clear validation errors when user makes changes
    setValidationErrors([]);
  };

  const validateCurrentSection = (): boolean => {
    const errors: string[] = [];
    const currentResponses = responses.filter(r => 
      currentCompetencies.some(comp => r.questionId.startsWith(comp.id))
    );

    currentResponses.forEach(response => {
      if (response.isRequired && response.rating === undefined) {
        const competency = currentCompetencies.find(c => response.questionId.startsWith(c.id));
        if (competency) {
          errors.push(`Please rate "${competency.name}"`);
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentSection < categories.length - 1) {
        setCurrentSection(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      const evaluationResponses = convertToEvaluationResponses();
      await onSave(evaluationResponses);
    } catch (error) {
      console.error('Error saving responses:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Validate all sections
    let allValid = true;
    for (let i = 0; i < categories.length; i++) {
      const sectionCompetencies = competencyCategories[categories[i]];
      const sectionResponses = responses.filter(r => 
        sectionCompetencies.some(comp => r.questionId.startsWith(comp.id))
      );
      
      const hasInvalidRequired = sectionResponses.some(r => 
        r.isRequired && r.rating === undefined
      );
      
      if (hasInvalidRequired) {
        allValid = false;
        setCurrentSection(i);
        validateCurrentSection();
        break;
      }
    }

    if (!allValid) return;

    setIsSubmitting(true);
    try {
      const evaluationResponses = convertToEvaluationResponses();
      await onSubmit(evaluationResponses);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToEvaluationResponses = (): EvaluationResponse[] => {
    const evaluationResponses: EvaluationResponse[] = [];
    
    session.competencyDimensions.forEach(comp => {
      const ratingResponse = responses.find(r => r.questionId === `${comp.id}_rating`);
      const feedbackResponse = responses.find(r => r.questionId === `${comp.id}_feedback`);
      
      if (ratingResponse?.rating !== undefined) {
        evaluationResponses.push({
          id: `${evaluatorId}_${comp.id}_${Date.now()}`,
          evaluationId: session.id,
          evaluatorId,
          questionId: `${comp.id}_rating`,
          ratingValue: ratingResponse.rating,
          textResponse: feedbackResponse?.feedback || '',
          submittedAt: new Date().toISOString()
        });
      }
    });
    
    return evaluationResponses;
  };

  const getRatingLabel = (value: number): string => {
    const scale = session.ratingScale;
    const option = scale.labels.find(opt => opt.value === value);
    return option ? option.label : value.toString();
  };

  const getResponseForQuestion = (questionId: string) => {
    return responses.find(r => r.questionId === questionId);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          360° Evaluation Assessment
        </h1>
        <p className="text-gray-600 mb-4">
          Please provide honest feedback about the person being evaluated. Your responses will help create a comprehensive assessment.
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div 
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Progress: {Math.round(progress)}% complete
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category, index) => {
          const isActive = index === currentSection;
          const isCompleted = competencyCategories[category].every(comp => {
            const response = responses.find(r => r.questionId === `${comp.id}_rating`);
            return response?.rating !== undefined;
          });
          
          return (
            <button
              key={category}
              onClick={() => setCurrentSection(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : isCompleted
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
              {isCompleted && (
                <span className="ml-2 text-green-600">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Validation Errors */}
      <AnimatePresence>
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <ValidationErrorMessage 
              message={`Please complete the following: ${validationErrors.join(', ')}`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {currentCategory}
          </h2>

          {currentCompetencies.map((competency) => {
            const ratingResponse = getResponseForQuestion(`${competency.id}_rating`);
            const feedbackResponse = getResponseForQuestion(`${competency.id}_feedback`);
            
            return (
              <div key={competency.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {competency.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {competency.description}
                  </p>
                </div>

                {/* Rating Scale */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you rate this competency? *
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {session.ratingScale.labels.map((option) => {
                      const isSelected = ratingResponse?.rating === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateResponse(`${competency.id}_rating`, 'rating', option.value)}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="font-semibold">{option.value}</div>
                          <div className="text-xs mt-1">{option.label}</div>
                        </button>
                      );
                    })}
                  </div>
                  {ratingResponse?.rating && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {getRatingLabel(ratingResponse.rating)}
                    </p>
                  )}
                </div>

                {/* Feedback Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional comments or specific examples (optional)
                  </label>
                  <textarea
                    value={feedbackResponse?.feedback || ''}
                    onChange={(e) => updateResponse(`${competency.id}_feedback`, 'feedback', e.target.value)}
                    placeholder="Share specific examples, observations, or additional context..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Navigation and Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentSection === 0}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex gap-3">
          {onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
          )}

          {currentSection < categories.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || progress < 100}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;