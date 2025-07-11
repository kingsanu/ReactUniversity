import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for the Classic template
const classicStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 50,
    fontFamily: 'Times-Roman',
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 10,
    color: '#000000',
    marginBottom: 8,
  },
  contactItem: {
    marginHorizontal: 8,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.4,
    color: '#000000',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  company: {
    fontSize: 11,
    color: '#000000',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  dateLocation: {
    fontSize: 10,
    color: '#000000',
    textAlign: 'right',
  },
  description: {
    fontSize: 10,
    lineHeight: 1.3,
    color: '#000000',
    marginTop: 3,
    marginLeft: 10,
  },
  skillsContainer: {
    flexDirection: 'column',
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  skillsList: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.2,
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

interface ClassicTemplatePDFProps {
  data: ResumeData;
}

export const ClassicTemplatePDF: React.FC<ClassicTemplatePDFProps> = ({ data }) => {
  // Group skills by category
  const skillsByCategory = data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Document>
      <Page size="A4" style={classicStyles.page}>
        {/* Header */}
        <View style={classicStyles.header}>
          <Text style={classicStyles.name}>{data.personalInfo.fullName}</Text>
          <View style={classicStyles.contactInfo}>
            <Text style={classicStyles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={classicStyles.contactItem}>•</Text>
            <Text style={classicStyles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={classicStyles.contactItem}>•</Text>
            <Text style={classicStyles.contactItem}>{data.personalInfo.location}</Text>
          </View>
          {data.personalInfo.linkedin && (
            <Text style={[classicStyles.contactInfo, { justifyContent: 'center' }]}>
              {data.personalInfo.linkedin}
            </Text>
          )}
          {data.personalInfo.summary && (
            <Text style={classicStyles.summary}>{data.personalInfo.summary}</Text>
          )}
        </View>

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={classicStyles.experienceItem}>
                <View style={classicStyles.jobHeader}>
                  <View>
                    <Text style={classicStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={classicStyles.company}>{exp.company}, {exp.location}</Text>
                  </View>
                  <View>
                    <Text style={classicStyles.dateLocation}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                </View>
                {exp.description.map((desc, index) => (
                  <Text key={index} style={classicStyles.description}>
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={classicStyles.experienceItem}>
                <View style={classicStyles.jobHeader}>
                  <View>
                    <Text style={classicStyles.jobTitle}>{edu.degree}</Text>
                    <Text style={classicStyles.company}>{edu.institution}, {edu.location}</Text>
                  </View>
                  <View>
                    <Text style={classicStyles.dateLocation}>{edu.graduationDate}</Text>
                  </View>
                </View>
                {edu.gpa && (
                  <Text style={classicStyles.description}>GPA: {edu.gpa}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Skills & Competencies</Text>
            <View style={classicStyles.skillsContainer}>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <View key={category} style={classicStyles.skillCategory}>
                  <Text style={classicStyles.skillCategoryTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} Skills:
                  </Text>
                  <Text style={classicStyles.skillsList}>
                    {skills.join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
