"use client";
import { useGlobalStore } from '@/store/useGlobalStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'motion/react';

export function PersonalInfoStep() {
  const { resumeBuilder, updatePersonalInfo } = useGlobalStore();
  const { personalInfo } = resumeBuilder.data;

  const handleInputChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-sm text-gray-600">
          Start with your basic contact information and a professional summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={personalInfo.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john.doe@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, State"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website/Portfolio</Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="www.johndoe.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary (Optional)</Label>
        <textarea
          id="summary"
          value={personalInfo.summary}
          onChange={(e) => handleInputChange('summary', e.target.value)}
          placeholder="A brief 2-3 sentence overview highlighting your key skills, education, and career goals. For freshers: mention your degree, relevant skills, and what type of role you're seeking..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Tip:</strong> Keep it concise and highlight your most relevant skills.</p>
          <p><strong>For freshers:</strong> Focus on your education, skills, projects, and career aspirations rather than work experience.</p>
        </div>
      </div>
    </motion.div>
  );
}
