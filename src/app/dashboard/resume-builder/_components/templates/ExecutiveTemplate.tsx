"use client";
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for better typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.woff2', fontWeight: 'bold' },
  ],
});

// Executive template styles - sophisticated and professional
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1f2937',
    borderBottomStyle: 'solid',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  contactItem: {
    fontSize: 10,
    color: '#4b5563',
    marginRight: 20,
  },
  summary: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderLeftWidth: 4,
    borderLeftColor: '#1f2937',
    borderLeftStyle: 'solid',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
  },
  experienceItem: {
    marginBottom: 20,
    paddingLeft: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#d1d5db',
    borderLeftStyle: 'solid',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  company: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: 'bold',
  },
  jobDetails: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
  },
  description: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 3,
  },
  educationItem: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  educationLeft: {
    flex: 2,
  },
  educationRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  institution: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 2,
  },
  graduationDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillCategory: {
    marginBottom: 15,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillItem: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4,
    paddingLeft: 10,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 30,
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
  },
});

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    level: string;
  }>;
}

interface ExecutiveTemplatePDFProps {
  data: ResumeData;
}

export function ExecutiveTemplatePDF({ data }: ExecutiveTemplatePDFProps) {
  // Group skills by category
  const skillsByCategory = data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
            {data.personalInfo.linkedin && (
              <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>
            )}
            {data.personalInfo.website && (
              <Text style={styles.contactItem}>{data.personalInfo.website}</Text>
            )}
          </View>
        </View>

        {/* Executive Summary */}
        {data.personalInfo.summary && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Executive Summary</Text>
            <Text style={styles.summaryText}>{data.personalInfo.summary}</Text>
          </View>
        )}

        <View style={styles.twoColumnLayout}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Professional Experience */}
            {data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {data.experience.map((exp) => (
                  <View key={exp.id} style={styles.experienceItem}>
                    <View style={styles.jobHeader}>
                      <View>
                        <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                        <Text style={styles.company}>{exp.company}</Text>
                      </View>
                      <Text style={styles.jobDetails}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </Text>
                    </View>
                    <Text style={styles.jobDetails}>{exp.location}</Text>
                    {exp.description.map((desc, index) => (
                      <Text key={index} style={styles.description}>
                        • {desc}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Education */}
            {data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <View style={styles.educationLeft}>
                      <Text style={styles.degree}>{edu.degree}</Text>
                      <Text style={styles.institution}>{edu.institution}</Text>
                      <Text style={styles.graduationDate}>{edu.location}</Text>
                    </View>
                    <View style={styles.educationRight}>
                      <Text style={styles.graduationDate}>{edu.graduationDate}</Text>
                      {edu.gpa && (
                        <Text style={styles.graduationDate}>GPA: {edu.gpa}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Core Competencies */}
            {Object.keys(skillsByCategory).length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Core Competencies</Text>
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <View key={category} style={styles.skillCategory}>
                    <Text style={styles.skillCategoryTitle}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    {skills.map((skill) => (
                      <Text key={skill.id} style={styles.skillItem}>
                        • {skill.name}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

// Preview component for the template selector
export function ExecutiveTemplatePreview({ data }: ExecutiveTemplatePDFProps) {
  return (
    <div className="w-full h-full bg-white p-8 text-xs overflow-hidden">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.personalInfo.fullName}</h1>
        <div className="flex justify-between text-gray-600 text-xs">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="bg-gray-50 border-l-4 border-gray-800 p-3 mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Executive Summary</h2>
          <p className="text-gray-700 text-xs leading-relaxed">{data.personalInfo.summary.substring(0, 200)}...</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Experience */}
        <div className="col-span-2">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {data.experience.slice(0, 2).map((exp) => (
            <div key={exp.id} className="mb-4 pl-3 border-l-2 border-gray-300">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-800 text-xs">{exp.jobTitle}</h3>
                  <p className="text-gray-600 text-xs font-medium">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-xs">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div className="text-xs text-gray-700">
                {exp.description.slice(0, 2).map((desc, index) => (
                  <p key={index} className="mb-1">• {desc.substring(0, 80)}...</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education & Skills */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Education
          </h2>
          {data.education.slice(0, 1).map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="font-bold text-gray-800 text-xs">{edu.degree}</h3>
              <p className="text-gray-600 text-xs">{edu.institution}</p>
              <p className="text-gray-500 text-xs">{edu.graduationDate}</p>
            </div>
          ))}

          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1 mt-6">
            Core Competencies
          </h2>
          <div className="space-y-2">
            {data.skills.slice(0, 6).map((skill) => (
              <p key={skill.id} className="text-xs text-gray-700">• {skill.name}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
