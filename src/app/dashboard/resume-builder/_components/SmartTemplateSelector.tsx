"use client";
import { useState, useEffect } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { resumeTemplates, careerFields } from './resumeData';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { TemplatePreviewCard } from './TemplatePreviewCard';

interface SmartTemplateSelectorProps {
  onTemplateSelect?: (templateId: string) => void;
}

export function SmartTemplateSelector({ onTemplateSelect }: SmartTemplateSelectorProps) {
  const { resumeBuilder, setResumeTemplate } = useGlobalStore();
  const { careerField, template: selectedTemplate } = resumeBuilder.data;
  
  // Get relevant templates based on career field
  const getRelevantTemplates = () => {
    if (!careerField) return resumeTemplates;
    
    const field = careerFields.find(f => f.id === careerField);
    if (!field) return resumeTemplates;
    
    // Filter templates that are suitable for the selected career field
    const relevantTemplates = resumeTemplates.filter(template => 
      template.suitableFor.includes(careerField)
    );
    
    // If no specific templates found, return all templates
    return relevantTemplates.length > 0 ? relevantTemplates : resumeTemplates;
  };

  const relevantTemplates = getRelevantTemplates();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(selectedTemplate);

  // Update current index when selected template changes
  useEffect(() => {
    const index = relevantTemplates.findIndex(t => t.id === selectedTemplate);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [selectedTemplate, relevantTemplates]);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? relevantTemplates.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    const newTemplate = relevantTemplates[newIndex];
    if (newTemplate) {
      handleTemplateSelect(newTemplate.id);
    }
  };

  const handleNext = () => {
    const newIndex = currentIndex === relevantTemplates.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    const newTemplate = relevantTemplates[newIndex];
    if (newTemplate) {
      handleTemplateSelect(newTemplate.id);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const validTemplateId = templateId as 'modern' | 'creative' | 'minimal' | 'executive' | 'tech' | 'classic';
    setSelectedTemplateId(validTemplateId);
    setResumeTemplate(validTemplateId);
    onTemplateSelect?.(templateId);

    // Trigger a smooth background transition
    const currentTemplate = relevantTemplates.find(t => t.id === templateId);
    if (currentTemplate) {
      // Update CSS custom properties for smooth background transitions
      document.documentElement.style.setProperty('--template-primary-color', currentTemplate.color);
    }
  };

  const currentTemplate = relevantTemplates[currentIndex];
  const selectedField = careerFields.find(f => f.id === careerField);

  if (relevantTemplates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No templates available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Career Field Context */}
      {selectedField && (
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Templates for {selectedField.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Showing {relevantTemplates.length} template{relevantTemplates.length !== 1 ? 's' : ''} 
            optimized for your career field
          </p>
        </motion.div>
      )}

      {/* Full-Width Template Display */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-105"
          disabled={relevantTemplates.length <= 1}
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-105"
          disabled={relevantTemplates.length <= 1}
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        {/* Template Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTemplate.id}
            className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {/* Centered Template Preview */}
            <div className="flex justify-center p-8">
              <div className="aspect-[8.5/11] bg-gray-50 relative overflow-hidden rounded-lg h-[500px] w-[400px] shadow-lg">
                <TemplatePreviewCard
                  data={resumeBuilder.data}
                  templateId={currentTemplate.id}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Template Info */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{currentTemplate.name}</h4>
                  <p className="text-gray-600">{currentTemplate.description}</p>
                </div>
                <button
                  onClick={() => handleTemplateSelect(currentTemplate.id)}
                  className={cn(
                    "px-6 py-3 rounded-xl font-medium transition-all duration-200",
                    selectedTemplateId === currentTemplate.id
                      ? "bg-indigo-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {selectedTemplateId === currentTemplate.id ? 'Selected' : 'Select'}
                </button>
              </div>

              {/* Template Category */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Category:</span>
                <span 
                  className="px-2 py-1 text-xs rounded-full text-white font-medium"
                  style={{ backgroundColor: currentTemplate.color }}
                >
                  {currentTemplate.category}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Template Indicators */}
      {relevantTemplates.length > 1 && (
        <div className="flex justify-center space-x-2">
          {relevantTemplates.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-indigo-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}

      {/* Template Count */}
      <div className="text-center text-sm text-gray-500">
        Template {currentIndex + 1} of {relevantTemplates.length}
      </div>
    </div>
  );
}
