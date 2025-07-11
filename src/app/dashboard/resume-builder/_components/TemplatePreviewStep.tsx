"use client";
import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, User, Briefcase, GraduationCap, Zap } from 'lucide-react';
import { validateAllSteps, getOverallProgress } from './validation';
import { Button } from '@/components/ui/button';
import * as resumeService from '@/services/resumeService';
import { useState } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';

export function TemplatePreviewStep() {
  const { resumeBuilder } = useGlobalStore();
  const { data } = resumeBuilder;

  // Get validation status for all steps
  const validation = validateAllSteps(data);
  const overallProgress = getOverallProgress(validation);

  // Use validation system for completion status
  const sectionStatus = {
    personalInfo: {
      isComplete: validation[1].isValid,
      count: data.personalInfo.fullName ? 1 : 0
    },
    experience: {
      isComplete: validation[2].isValid,
      count: data.experience.length
    },
    education: {
      isComplete: validation[3].isValid,
      count: data.education.length
    },
    skills: {
      isComplete: validation[4].isValid,
      count: data.skills.length
    }
  };

  const totalSections = Object.values(sectionStatus).length;
  const completedSections = Object.values(sectionStatus).filter(section => section.isComplete).length;
  const completionPercentage = overallProgress;

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        personal: {
          fullName: data.personalInfo.fullName,
          email: data.personalInfo.email,
          phone: data.personalInfo.phone,
          location: data.personalInfo.location,
          linkedIn: data.personalInfo.linkedin || '',
          website: data.personalInfo.website || ''
        },
        summary: data.personalInfo.summary,
        skills: { skills: data.skills.reduce((acc, s) => {
          acc[s.category] = [...(acc[s.category]||[]), s.name];
          return acc;
        }, {} as Record<string, string[]>) },
        experience: data.experience.map(e => ({
          company: e.company,
          location: e.location,
          title: e.jobTitle,
          startDate: e.startDate,
          endDate: e.endDate,
          descriptions: e.description
        })),
        education: data.education.map(ed => ({
          degree: ed.degree,
          institution: ed.institution,
          location: ed.location,
          startDate: '',
          endDate: ed.graduationDate
        }))
      };
      await resumeService.createResume(payload);
      setIsSaved(true);
    } catch (err) {
      console.error('Error saving resume', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review Your Resume</h2>
        <p className="text-sm text-gray-600">
          Review all sections of your resume and make sure everything looks perfect before downloading.
        </p>
      </div>

      {/* Completion Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Resume Completion</h3>
          <span className="text-sm font-medium text-indigo-600">{Math.round(completionPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-600">
          {completedSections} of {totalSections} sections completed
        </p>
      </div>

      {/* Section Details */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Section Details</h3>
        
        {/* Personal Information */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900">Personal Information</h4>
              <p className="text-sm text-gray-600">
                {data.personalInfo.fullName || 'No name provided'}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {sectionStatus.personalInfo.isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900">Work Experience</h4>
              <p className="text-sm text-gray-600">
                {sectionStatus.experience.count} position{sectionStatus.experience.count !== 1 ? 's' : ''} added
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {sectionStatus.experience.isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>

        {/* Education */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900">Education</h4>
              <p className="text-sm text-gray-600">
                {sectionStatus.education.count} education entr{sectionStatus.education.count !== 1 ? 'ies' : 'y'} added
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {sectionStatus.education.isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900">Skills</h4>
              <p className="text-sm text-gray-600">
                {sectionStatus.skills.count} skill{sectionStatus.skills.count !== 1 ? 's' : ''} added
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {sectionStatus.skills.isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>

      </div>

      {/* Completion Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-green-900">Resume Review Complete!</h4>
            <p className="text-sm text-green-700 mt-1">
              Your resume is {Math.round(completionPercentage)}% complete. You can continue editing any section using the navigation above.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={isSaving || isSaved}>
          {isSaved ? 'Saved' : isSaving ? 'Saving...' : 'Save Resume'}
        </Button>
      </div>
    </motion.div>
  );
}
