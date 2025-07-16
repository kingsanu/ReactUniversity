"use client";

import { useEffect, useState } from "react";
import { useGlobalStore, TemplateRecommendation } from "@/store/useGlobalStore";
import { getTemplateRecommendations } from "./templateRecommendation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplatePreview } from './templates/TemplateRenderer';
import { getSampleDataForCareerField } from './careerFieldSampleData';
import {
  Star,
  CheckCircle,
  Zap,
  Crown,
  Award,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface TemplateCardProps {
  recommendation: TemplateRecommendation;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateCard({
  recommendation,
  isSelected,
  onSelect,
}: TemplateCardProps) {
  const { resumeBuilder } = useGlobalStore();

  // Use live data if available, otherwise use sample data
  const hasUserData = resumeBuilder.data.personalInfo?.fullName ||
                     resumeBuilder.data.experience?.length > 0 ||
                     resumeBuilder.data.education?.length > 0;

  const previewData = hasUserData
    ? resumeBuilder.data
    : getSampleDataForCareerField(resumeBuilder.userProfile?.industry || 'entry-level');

  const template = {
    id: recommendation.templateId,
    name:
      recommendation.templateId.charAt(0).toUpperCase() +
      recommendation.templateId.slice(1),
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-blue-700 bg-blue-50 border-blue-200";
    if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-gray-700 bg-gray-50 border-gray-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return Crown;
    if (score >= 70) return Award;
    if (score >= 50) return Target;
    return Star;
  };

  const ScoreIcon = getScoreIcon(recommendation.suitabilityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        isSelected
          ? "ring-3 ring-blue-500 ring-offset-4 shadow-2xl scale-105"
          : "hover:shadow-xl hover:-translate-y-2 hover:scale-102"
      )}
      onClick={onSelect}
    >
      {/* Recommendation Badge */}
      {recommendation.isRecommended && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
            <Crown className="h-3 w-3 mr-1" />
            RECOMMENDED
          </div>
        </div>
      )}

      <Card className={cn(
        "overflow-hidden border-2 transition-all duration-300 shadow-lg",
        isSelected
          ? "border-purple-500 bg-purple-50/30 ring-2 ring-purple-200"
          : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-xl"
      )}>
        {/* Compact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
          {/* Template Preview - Left Side (2/5) */}
          <div className="lg:col-span-2 relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
              <TemplatePreview
                template={recommendation.templateId as 'modern' | 'classic' | 'creative' | 'minimal'}
                sampleData={previewData}
                isSelected={isSelected}
                onClick={onSelect}
              />
            </div>

            {/* Selection Overlay */}
            {isSelected && (
              <div className="absolute inset-0 bg-purple-500/10 border-2 border-purple-500 rounded-xl flex items-center justify-center">
                <div className="bg-purple-500 text-white rounded-full p-2 shadow-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            )}
          </div>

          {/* Template Details - Right Side (3/5) */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-4">

            {/* Compact Header with Score */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
              <div
                className={cn(
                  "flex items-center space-x-1 px-3 py-1 rounded-full border text-sm font-bold",
                  getScoreColor(recommendation.suitabilityScore)
                )}
              >
                <ScoreIcon className="h-4 w-4" />
                <span>{recommendation.suitabilityScore}%</span>
              </div>
            </div>

            {/* Compact Key Benefits */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-gray-800 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                Why this template works for you:
              </h3>
              <ul className="space-y-2">
                {recommendation.reasoning.slice(0, 3).map((reason, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 flex items-start"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="leading-tight">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compact Template Features */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700 px-2 py-1">
                <Zap className="h-3 w-3 mr-1" />
                ATS-Friendly
              </Badge>
              <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700 px-2 py-1">
                Professional
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700 px-2 py-1">
                Single Page
              </Badge>
            </div>

            {/* Compact Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className={cn(
                "w-full py-3 px-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-md",
                isSelected
                  ? "bg-purple-500 text-white shadow-purple-200"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg"
              )}
            >
              {isSelected ? "✓ Selected" : "Choose This Template"}
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function TemplateRecommendationStep() {
  const { resumeBuilder, setRecommendedTemplates, setResumeTemplate } =
    useGlobalStore();

  const { userProfile, recommendedTemplates, data } = resumeBuilder;
  const [isLoading, setIsLoading] = useState(false);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);

  // Use the template from global state directly
  const selectedTemplateId = data.template;

  // Generate recommendations when component mounts or profile changes
  useEffect(() => {
    if (userProfile) {
      setIsLoading(true);

      // Simulate API call delay for better UX
      setTimeout(() => {
        const recommendations = getTemplateRecommendations(
          userProfile,
          data.template
        );
        setRecommendedTemplates(recommendations);
        setIsLoading(false);
      }, 800);
    }
  }, [userProfile, data.template, setRecommendedTemplates]);

  const handleTemplateSelect = (templateId: string) => {
    // Ensure templateId is one of the valid template types
    const validTemplate = templateId as
      | "modern"
      | "classic"
      | "creative"
      | "minimal";
    setResumeTemplate(validTemplate);
  };

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          Please complete your profile assessment first.
        </div>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back to Profile Assessment
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Finding perfect templates for you
          </h2>
          <p className="text-sm text-gray-600">
            Analyzing your profile to recommend the best resume templates...
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Generating recommendations...</span>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-80"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Ensure we have recommendations before rendering
  if (!recommendedTemplates || recommendedTemplates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          No template recommendations available. Please try again.
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Recommendations
        </Button>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-hidden">
      {/* Compact Header */}
      <div className="text-center mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-indigo-50/30 rounded-2xl -z-10"></div>

        <div className="relative py-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 rounded-full px-6 py-2 shadow-sm mb-3">
            <Crown className="h-5 w-5 text-purple-600" />
            <span className="text-lg font-semibold text-purple-800">Template Selection</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Your Perfect Template
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            We've analyzed your profile and selected templates that will make you stand out
          </p>

          {userProfile && (
            <div className="flex items-center justify-center space-x-3 mt-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-4 py-2">
                <span className="text-sm font-medium text-blue-800">
                  {userProfile.careerLevel.replace("-", " ")} • {userProfile.industry}
                </span>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-2">
                <span className="text-sm font-medium text-green-800">
                  {userProfile.profileScore}% Match
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compact Template Carousel */}
      <div className="max-h-[70vh] overflow-hidden">
        {/* Current Template Display - Compact */}
        <div className="relative">
          <div className="w-full max-w-5xl mx-auto">
            <TemplateCard
              recommendation={recommendedTemplates[currentTemplateIndex]}
              isSelected={selectedTemplateId === recommendedTemplates[currentTemplateIndex]?.templateId}
              onSelect={() =>
                handleTemplateSelect(recommendedTemplates[currentTemplateIndex]?.templateId)
              }
            />
          </div>

          {/* Compact Navigation */}
          {recommendedTemplates.length > 1 && (
            <div className="flex items-center justify-center mt-4 space-x-6">
              <button
                onClick={() => setCurrentTemplateIndex(Math.max(0, currentTemplateIndex - 1))}
                disabled={currentTemplateIndex === 0}
                className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm min-h-[44px] min-w-[44px]"
                aria-label="Previous template"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {/* Compact Template Indicators */}
              <div className="flex items-center space-x-2">
                {recommendedTemplates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTemplateIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      index === currentTemplateIndex
                        ? 'bg-purple-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to template ${index + 1}`}
                  >
                    <span className={`w-3 h-3 rounded-full ${
                      index === currentTemplateIndex
                        ? 'bg-purple-600'
                        : 'bg-gray-300'
                    }`} />
                  </button>
                ))}
                <span className="text-xs text-gray-500 ml-2 font-medium">
                  {currentTemplateIndex + 1} of {recommendedTemplates.length}
                </span>
              </div>

              <button
                onClick={() => setCurrentTemplateIndex(Math.min(recommendedTemplates.length - 1, currentTemplateIndex + 1))}
                disabled={currentTemplateIndex === recommendedTemplates.length - 1}
                className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm min-h-[44px] min-w-[44px]"
                aria-label="Next template"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Template Confirmation */}
      {selectedTemplateId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-green-500 text-white rounded-full p-3">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Perfect Choice!
                  </h3>
                  <p className="text-green-700 font-medium">
                    <span className="font-bold">
                      {selectedTemplateId.charAt(0).toUpperCase() +
                        selectedTemplateId.slice(1)}
                    </span>{" "}
                    template selected. You're ready to build an amazing resume!
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-600">
                    ✨ Your template is optimized for ATS systems and designed to impress recruiters
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
