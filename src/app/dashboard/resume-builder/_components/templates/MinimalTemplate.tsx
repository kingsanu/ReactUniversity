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

// Minimal template styles - clean and simple
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  contactItem: {
    fontSize: 10,
    color: '#6b7280',
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: 20,
  },
  summary: {
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  summaryText: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  experienceItem: {
    marginBottom: 20,
    textAlign: 'center',
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  company: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  jobDetails: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 8,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.4,
    marginBottom: 3,
    textAlign: 'left',
  },
  educationItem: {
    marginBottom: 15,
    textAlign: 'center',
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  institution: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  graduationDate: {
    fontSize: 10,
    color: '#9ca3af',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  skillItem: {
    fontSize: 10,
    color: '#4b5563',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderRadius: 15,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 40,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  centerDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
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

interface MinimalTemplatePDFProps {
  data: ResumeData;
}

export function MinimalTemplatePDF({ data }: MinimalTemplatePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={styles.contactItem}>•</Text>
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>•</Text>
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
            {data.personalInfo.linkedin && (
              <>
                <Text style={styles.contactItem}>•</Text>
                <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>
              </>
            )}
          </View>
          <View style={styles.divider} />
        </View>

        {/* Summary */}
        {data.personalInfo.summary && (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Professional Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.jobDetails}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate} • {exp.location}
                </Text>
                <View style={styles.descriptionContainer}>
                  {exp.description.map((desc, index) => (
                    <Text key={index} style={styles.description}>
                      • {desc}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.twoColumnLayout}>
          {/* Left Column - Education */}
          <View style={styles.leftColumn}>
            {data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.institution}>{edu.institution}</Text>
                    <Text style={styles.graduationDate}>
                      {edu.graduationDate}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.centerDivider} />

          {/* Right Column - Skills */}
          <View style={styles.rightColumn}>
            {data.skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {data.skills.map((skill) => (
                    <Text key={skill.id} style={styles.skillItem}>
                      {skill.name}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

// Preview component for the template selector
export function MinimalTemplatePreview({ data }: MinimalTemplatePDFProps) {
  return (
    <div className="w-full h-full bg-white p-8 text-xs overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.personalInfo.fullName}</h1>
        <div className="flex justify-center items-center gap-3 text-gray-600 text-xs mb-3">
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.location}</span>
        </div>
        <div className="w-12 h-px bg-gray-300 mx-auto mb-4"></div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="text-center mb-6 px-8">
          <p className="text-gray-600 text-xs leading-relaxed italic">
            {data.personalInfo.summary.substring(0, 150)}...
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 text-center mb-4 uppercase tracking-widest">Experience</h2>
          {data.experience.slice(0, 2).map((exp) => (
            <div key={exp.id} className="mb-4 text-center">
              <h3 className="font-bold text-gray-900 text-xs mb-1">{exp.jobTitle}</h3>
              <p className="text-gray-600 text-xs mb-1">{exp.company}</p>
              <p className="text-gray-400 text-xs mb-2">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate} • {exp.location}
              </p>
              <div className="px-4 text-left">
                {exp.description.slice(0, 2).map((desc, index) => (
                  <p key={index} className="text-xs text-gray-600 mb-1">• {desc.substring(0, 60)}...</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 text-center mb-3 uppercase tracking-widest">Education</h2>
          {data.education.slice(0, 1).map((edu) => (
            <div key={edu.id} className="text-center">
              <h3 className="font-bold text-gray-900 text-xs mb-1">{edu.degree}</h3>
              <p className="text-gray-600 text-xs mb-1">{edu.institution}</p>
              <p className="text-gray-400 text-xs">{edu.graduationDate}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 text-center mb-3 uppercase tracking-widest">Skills</h2>
          <div className="flex flex-wrap justify-center gap-1">
            {data.skills.slice(0, 8).map((skill) => (
              <span key={skill.id} className="text-xs text-gray-600 border border-gray-300 px-2 py-1 rounded-full">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
