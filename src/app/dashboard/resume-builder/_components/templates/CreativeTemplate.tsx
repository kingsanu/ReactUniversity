"use client";
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for better typography
Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2' },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2', fontWeight: 'bold' },
  ],
});

// Creative template styles - vibrant and artistic
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Poppins',
    fontSize: 10,
    lineHeight: 1.4,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 180,
    backgroundColor: '#8b5cf6',
    padding: 20,
  },
  mainContent: {
    marginLeft: 180,
    padding: 30,
    paddingLeft: 40,
  },
  sidebarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  sidebarTitle: {
    fontSize: 12,
    color: '#e9d5ff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sidebarText: {
    fontSize: 9,
    color: '#e9d5ff',
    lineHeight: 1.3,
    marginBottom: 4,
  },
  sidebarSkill: {
    fontSize: 9,
    color: '#ffffff',
    backgroundColor: '#7c3aed',
    padding: '3 6',
    borderRadius: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  mainSection: {
    marginBottom: 25,
  },
  mainSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#8b5cf6',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
  },
  experienceItem: {
    marginBottom: 20,
    position: 'relative',
    paddingLeft: 20,
  },
  experienceMarker: {
    position: 'absolute',
    left: 0,
    top: 5,
    width: 8,
    height: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  company: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobDetails: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 3,
  },
  educationItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    borderLeftStyle: 'solid',
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  institution: {
    fontSize: 11,
    color: '#8b5cf6',
    marginBottom: 2,
  },
  graduationDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  summaryBox: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderStyle: 'solid',
    marginBottom: 25,
  },
  summaryText: {
    fontSize: 11,
    color: 'black',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  decorativeElement: {
    width: 30,
    height: 3,
    backgroundColor: '#8b5cf6',
    marginBottom: 10,
    borderRadius: 2,
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

interface CreativeTemplatePDFProps {
  data: ResumeData;
}

export function CreativeTemplatePDF({ data }: CreativeTemplatePDFProps) {
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
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{data.personalInfo.fullName}</Text>
          <Text style={styles.sidebarTitle}>Creative Professional</Text>

          {/* Contact Info */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>
            <Text style={styles.sidebarText}>{data.personalInfo.email}</Text>
            <Text style={styles.sidebarText}>{data.personalInfo.phone}</Text>
            <Text style={styles.sidebarText}>{data.personalInfo.location}</Text>
            {data.personalInfo.linkedin && (
              <Text style={styles.sidebarText}>{data.personalInfo.linkedin}</Text>
            )}
            {data.personalInfo.website && (
              <Text style={styles.sidebarText}>{data.personalInfo.website}</Text>
            )}
          </View>

          {/* Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Skills</Text>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <View key={category}>
                  {skills.map((skill) => (
                    <Text key={skill.id} style={styles.sidebarSkill}>
                      {skill.name}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Education</Text>
              {data.education.map((edu) => (
                <View key={edu.id}>
                  <Text style={styles.sidebarText}>{edu.degree}</Text>
                  <Text style={styles.sidebarText}>{edu.institution}</Text>
                  <Text style={styles.sidebarText}>{edu.graduationDate}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
          {data.personalInfo.summary && (
            <View style={styles.summaryBox}>
              <View style={styles.decorativeElement} />
              <Text style={styles.summaryText}>kmkm{data.personalInfo.summary}</Text>
            </View>
          )}

          {/* Professional Experience */}
          {data.experience.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Experience</Text>
              {data.experience.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceMarker} />
                  <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.jobDetails}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate} • {exp.location}
                  </Text>
                  {exp.description.map((desc, index) => (
                    <Text key={index} style={styles.description}>
                      ✦ {desc}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

// Preview component for the template selector
export function CreativeTemplatePreview({ data }: CreativeTemplatePDFProps) {
  return (
    <div className="w-full h-full bg-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 bg-purple-600 text-white p-4">
        <h1 className="text-lg font-bold text-center mb-2">{data.personalInfo.fullName}</h1>
        <p className="text-purple-200 text-center text-sm font-bold mb-4">Creative Professional</p>
        
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2">Contact</h2>
          <p className="text-purple-200 text-xs mb-1">{data.personalInfo.email}</p>
          <p className="text-purple-200 text-xs mb-1">{data.personalInfo.phone}</p>
          <p className="text-purple-200 text-xs">{data.personalInfo.location}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2">Skills</h2>
          <div className="space-y-1">
            {data.skills.slice(0, 6).map((skill) => (
              <div key={skill.id} className="bg-purple-700 text-white text-xs px-2 py-1 rounded text-center">
                {skill.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2">Education</h2>
          {data.education.slice(0, 1).map((edu) => (
            <div key={edu.id}>
              <p className="text-purple-200 text-xs">{edu.degree}</p>
              <p className="text-purple-200 text-xs">{edu.institution}</p>
              <p className="text-purple-200 text-xs">{edu.graduationDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-3 mb-4">
            <div className="w-6 h-1 bg-purple-600 rounded mb-2"></div>
            <p className="text-gray-700 text-xs leading-relaxed">{data.personalInfo.summary.substring(0, 200)}...</p>
          </div>
        )}

        {/* Experience */}
        <div>
          <h2 className="text-lg font-bold text-purple-600 mb-3 border-b-2 border-purple-600 pb-1">Experience</h2>
          {data.experience.slice(0, 2).map((exp) => (
            <div key={exp.id} className="mb-4 relative pl-4">
              <div className="absolute left-0 top-1 w-2 h-2 bg-purple-600 rounded-full"></div>
              <h3 className="font-bold text-gray-900 text-sm">{exp.jobTitle}</h3>
              <p className="text-purple-600 text-sm font-bold">{exp.company}</p>
              <p className="text-gray-500 text-xs italic mb-2">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate} • {exp.location}
              </p>
              <div className="text-xs text-gray-700">
                {exp.description.slice(0, 2).map((desc, index) => (
                  <p key={index} className="mb-1">✦ {desc.substring(0, 80)}...</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
