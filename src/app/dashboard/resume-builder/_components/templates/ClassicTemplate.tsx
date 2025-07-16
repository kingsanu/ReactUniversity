import React from 'react';

interface TemplateProps {
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: any[];
  pdfComponents: any;
}

export function ClassicTemplate({ personalInfo, experience, education, skills, pdfComponents }: TemplateProps) {
  const { Document, Page, Text, View, StyleSheet } = pdfComponents;

  // Define styles for the Classic template - Redesigned for better spacing and hierarchy
  const classicStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 40, // Reduced from 50 for more content space
      fontFamily: 'Times-Roman',
      fontSize: 11,
      lineHeight: 1.3, // Slightly tighter for better space utilization
    },
    header: {
      alignItems: 'center',
      marginBottom: 16, // Reduced from 25
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      paddingBottom: 12, // Reduced from 15
    },
    name: {
      fontSize: 22, // Slightly smaller for better proportion
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 6, // Reduced from 8
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    contactInfo: {
      flexDirection: 'column', // Changed to column to prevent overlapping
      alignItems: 'center',
      fontSize: 10,
      color: '#000000',
      marginBottom: 0, // Removed bottom margin
    },
    contactRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 3,
      flexWrap: 'wrap', // Allow wrapping for long content
    },
    contactItem: {
      marginHorizontal: 6, // Reduced from 8
      fontSize: 10,
    },
    summary: {
      fontSize: 11,
      lineHeight: 1.3,
      color: '#000000',
      textAlign: 'justify', // Changed from center for better readability
      marginTop: 8, // Reduced from 10
      fontStyle: 'italic',
    },
    section: {
      marginBottom: 14, // Significantly reduced from 25
      marginTop: 0, // Removed top margin
    },
    sectionTitle: {
      fontSize: 13, // Reduced from 14
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 8, // Reduced from 12
      marginTop: 12, // Reduced from 8 but moved to top for consistency
      textAlign: 'left', // Changed from center for modern look
      textTransform: 'uppercase',
      letterSpacing: 0.8, // Reduced from 1
      borderBottomWidth: 0.5,
      borderBottomColor: '#000000',
      paddingBottom: 2,
    },
    text: {
      fontSize: 11,
      lineHeight: 1.3,
      color: '#000000',
      marginBottom: 6, // Reduced from 8
    },
    experienceItem: {
      marginBottom: 10, // Reduced from 15
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4, // Reduced from 6
      alignItems: 'flex-start',
    },
    jobHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3, // Reduced from 4
      alignItems: 'baseline', // Better alignment
    },
    jobTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 1, // Reduced from 2
      flex: 1, // Allow flexible width
    },
    company: {
      fontSize: 11,
      color: '#000000',
      fontStyle: 'italic',
      marginBottom: 1, // Reduced from 2
  },
  dateLocation: {
    fontSize: 10,
    color: '#666666', // Softer color for dates
    textAlign: 'right',
    fontStyle: 'italic',
  },
  date: {
    fontSize: 10,
    color: '#666666', // Softer color for dates
    textAlign: 'right',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 11,
    lineHeight: 1.3,
    color: '#000000',
    marginTop: 2, // Reduced from 3
    marginLeft: 8, // Reduced from 10
  },
  bulletPoint: {
    fontSize: 11,
    lineHeight: 1.3,
    color: '#000000',
    marginBottom: 2, // Reduced from 3
    marginLeft: 12, // Reduced from 15
  },
  skillsContainer: {
    flexDirection: 'column',
  },
  skillCategory: {
    marginBottom: 6, // Reduced from 8
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2, // Reduced from 3
    textTransform: 'capitalize',
  },
  skillsList: {
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.2,
  },
});

  return (
    <Document>
      <Page size="A4" style={classicStyles.page}>
        {/* Header */}
        <View style={classicStyles.header}>
          <Text style={classicStyles.name}>
            {personalInfo.fullName || 'Your Name'}
          </Text>
          <View style={classicStyles.contactInfo}>
            {/* First row of contact info */}
            <View style={classicStyles.contactRow}>
              {personalInfo.email && (
                <Text style={classicStyles.contactItem}>{personalInfo.email}</Text>
              )}
              {personalInfo.email && personalInfo.phone && (
                <Text style={classicStyles.contactItem}> • </Text>
              )}
              {personalInfo.phone && (
                <Text style={classicStyles.contactItem}>{personalInfo.phone}</Text>
              )}
            </View>
            {/* Second row of contact info */}
            <View style={classicStyles.contactRow}>
              {personalInfo.location && (
                <Text style={classicStyles.contactItem}>{personalInfo.location}</Text>
              )}
              {personalInfo.location && personalInfo.linkedin && (
                <Text style={classicStyles.contactItem}> • </Text>
              )}
              {personalInfo.linkedin && (
                <Text style={classicStyles.contactItem}>{personalInfo.linkedin}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={classicStyles.text}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {experience.map((exp: any, index: number) => (
              <View key={index} style={classicStyles.experienceItem}>
                <View style={classicStyles.experienceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={classicStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={classicStyles.company}>{exp.company}, {exp.location}</Text>
                  </View>
                  <Text style={classicStyles.date}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                {exp.description && exp.description.map((desc: string, descIndex: number) => (
                  <Text key={descIndex} style={classicStyles.bulletPoint}>
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>EDUCATION</Text>
            {education.map((edu: any, index: number) => (
              <View key={index} style={classicStyles.experienceItem}>
                <View style={classicStyles.experienceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={classicStyles.jobTitle}>{edu.degree}</Text>
                    <Text style={classicStyles.company}>{edu.institution}, {edu.location}</Text>
                  </View>
                  <Text style={classicStyles.dateLocation}>{edu.graduationDate}</Text>
                </View>
                {edu.gpa && (
                  <Text style={classicStyles.text}>GPA: {edu.gpa}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>CORE COMPETENCIES</Text>
            <Text style={classicStyles.text}>
              {skills.map((skill: any) => skill.name).join(' • ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
