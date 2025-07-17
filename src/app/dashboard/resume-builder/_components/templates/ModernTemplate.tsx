import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Define styles for the Modern template
const modernStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 10,
  },
  contactItem: {
    marginRight: 15,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.4,
    color: '#374151',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  company: {
    fontSize: 11,
    color: '#3b82f6',
    marginBottom: 3,
  },
  dateLocation: {
    fontSize: 10,
    color: '#6b7280',
  },
  description: {
    fontSize: 10,
    lineHeight: 1.3,
    color: '#374151',
    marginTop: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    backgroundColor: '#f3f4f6',
    padding: '4 8',
    marginRight: 8,
    marginBottom: 5,
    borderRadius: 3,
    fontSize: 9,
    color: '#374151',
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

interface ModernTemplatePDFProps {
  data: ResumeData;
}

export const ModernTemplatePDF: React.FC<ModernTemplatePDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={modernStyles.page}>
      {/* Header */}
      <View style={modernStyles.header}>
        <Text style={modernStyles.name}>{data.personalInfo.fullName}</Text>
        <View style={modernStyles.contactInfo}>
          <Text style={modernStyles.contactItem}>{data.personalInfo.email}</Text>
          <Text style={modernStyles.contactItem}>{data.personalInfo.phone}</Text>
          <Text style={modernStyles.contactItem}>{data.personalInfo.location}</Text>
        </View>
        {data.personalInfo.linkedin && (
          <Text style={[modernStyles.contactItem, { fontSize: 9 }]}>
            LinkedIn: {data.personalInfo.linkedin}
          </Text>
        )}
        {data.personalInfo.summary && (
          <Text style={modernStyles.summary}>{data.personalInfo.summary}</Text>
        )}
      </View>

      {/* Experience */}
      {data.experience.length > 0 && (
        <View style={modernStyles.section}>
          <Text style={modernStyles.sectionTitle}>EXPERIENCE</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={modernStyles.experienceItem}>
              <View style={modernStyles.jobHeader}>
                <View>
                  <Text style={modernStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={modernStyles.company}>{exp.company}</Text>
                </View>
                <View>
                  <Text style={modernStyles.dateLocation}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                  <Text style={modernStyles.dateLocation}>{exp.location}</Text>
                </View>
              </View>
              {exp.description.map((desc, index) => (
                <Text key={index} style={modernStyles.description}>
                  • {desc}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <View style={modernStyles.section}>
          <Text style={modernStyles.sectionTitle}>EDUCATION</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={modernStyles.experienceItem}>
              <View style={modernStyles.jobHeader}>
                <View>
                  <Text style={modernStyles.jobTitle}>{edu.degree}</Text>
                  <Text style={modernStyles.company}>{edu.institution}</Text>
                </View>
                <View>
                  <Text style={modernStyles.dateLocation}>{edu.graduationDate}</Text>
                  <Text style={modernStyles.dateLocation}>{edu.location}</Text>
                </View>
              </View>
              {edu.gpa && (
                <Text style={modernStyles.description}>GPA: {edu.gpa}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <View style={modernStyles.section}>
          <Text style={modernStyles.sectionTitle}>SKILLS</Text>
          <View style={modernStyles.skillsContainer}>
            {data.skills.map((skill) => (
              <Text key={skill.id} style={modernStyles.skillItem}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
);

// Preview component for the template selector
export function ModernTemplatePreview({ data }: ModernTemplatePDFProps) {
  return (
    <div className="w-full h-full bg-white p-6 text-xs overflow-hidden">
      {/* Header */}
      <div className="border-b-2 border-blue-500 pb-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{data.personalInfo.fullName}</h1>
        <div className="flex justify-between text-gray-600 text-xs">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
        </div>
        {data.personalInfo.summary && (
          <p className="text-gray-700 text-xs mt-2 leading-relaxed">{data.personalInfo.summary.substring(0, 150)}...</p>
        )}
      </div>

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">EXPERIENCE</h2>
          {data.experience.slice(0, 2).map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-800 text-xs">{exp.jobTitle}</h3>
                  <p className="text-blue-600 text-xs font-medium">{exp.company}</p>
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
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">EDUCATION</h2>
            {data.education.slice(0, 1).map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold text-gray-800 text-xs">{edu.degree}</h3>
                <p className="text-gray-600 text-xs">{edu.institution}</p>
                <p className="text-gray-500 text-xs">{edu.graduationDate}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">SKILLS</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.slice(0, 6).map((skill) => (
                <span key={skill.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
