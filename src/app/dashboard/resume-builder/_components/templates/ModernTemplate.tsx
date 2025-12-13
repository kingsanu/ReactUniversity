import React from 'react';

interface TemplateProps {
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: any[];
  pdfComponents: any;
}

export function ModernTemplate({ personalInfo, experience, education, skills, pdfComponents }: TemplateProps) {
  const { Document, Page, Text, View, StyleSheet } = pdfComponents;

  // Define styles for the Modern template
  const modernStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: '0.75in',
      fontSize: 11,
      fontFamily: 'Helvetica',
      lineHeight: 1.1,
    },
    header: {
      textAlign: 'center',
      marginBottom: 12,
      paddingBottom: 6,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#000000',
      textTransform: 'uppercase',
    },
    contact: {
      fontSize: 11,
      color: '#000000',
      marginBottom: 2,
      lineHeight: 1.1,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 6,
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottom: '1pt solid #3b82f6',
      paddingBottom: 3,
    },
    text: {
      fontSize: 11,
      lineHeight: 1.2,
      marginBottom: 4,
      color: '#000000',
    },
    bulletPoint: {
      fontSize: 11,
      marginBottom: 2,
      marginLeft: 16,
      color: '#000000',
      lineHeight: 1.2,
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
      alignItems: 'flex-start',
    },
    jobTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 1,
    },
    company: {
      fontSize: 11,
      color: '#000000',
      marginBottom: 1,
    },
    date: {
      fontSize: 11,
      color: '#000000',
      textAlign: 'right',
      fontWeight: 'normal',
    },
    location: {
      fontSize: 11,
      color: '#000000',
      textAlign: 'right',
      marginTop: 1,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    skill: {
      fontSize: 11,
      color: '#000000',
      marginRight: 14,
      marginBottom: 2,
    },
    educationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
      alignItems: 'flex-start',
    },
    degree: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 1,
    },
    institution: {
      fontSize: 11,
      color: '#000000',
    },
  });

  return (
    <Document>
      <Page size="A4" style={modernStyles.page}>
        {/* Header */}
        <View style={modernStyles.header}>
          <Text style={modernStyles.name}>
            {personalInfo.fullName || 'Your Name'}
          </Text>
          <Text style={modernStyles.contact}>
            {personalInfo.phone && `${personalInfo.phone} | `}
            {personalInfo.email && `${personalInfo.email} | `}
            {personalInfo.location && personalInfo.location}
          </Text>
          {personalInfo.linkedin && (
            <Text style={modernStyles.contact}>{personalInfo.linkedin}</Text>
          )}
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View>
            <Text style={modernStyles.sectionTitle}>Summary</Text>
            <Text style={modernStyles.text}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View>
            <Text style={modernStyles.sectionTitle}>Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={modernStyles.experienceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={modernStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={modernStyles.company}>{exp.company}</Text>
                  </View>
                  <View>
                    <Text style={modernStyles.date}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                    <Text style={modernStyles.location}>{exp.location}</Text>
                  </View>
                </View>
                {exp.description && exp.description.map((desc, descIndex) => (
                  <Text key={descIndex} style={modernStyles.bulletPoint}>
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View>
            <Text style={modernStyles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 6 }}>
                <View style={modernStyles.educationHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={modernStyles.degree}>{edu.degree}</Text>
                    <Text style={modernStyles.institution}>{edu.institution}</Text>
                  </View>
                  <View>
                    <Text style={modernStyles.date}>{edu.graduationDate}</Text>
                    <Text style={modernStyles.location}>{edu.location}</Text>
                  </View>
                </View>
                {edu.gpa && (
                  <Text style={modernStyles.text}>GPA: {edu.gpa}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View>
            <Text style={modernStyles.sectionTitle}>Skills</Text>
            <View style={modernStyles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={skill.id || `skill-${index}`} style={modernStyles.skill}>
                  {skill.name || ''}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
