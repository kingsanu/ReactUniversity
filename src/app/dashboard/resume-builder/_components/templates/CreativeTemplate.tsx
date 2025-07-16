import React from 'react';

interface TemplateProps {
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: any[];
  pdfComponents: any;
}

export function CreativeTemplate({ personalInfo, experience, education, skills, pdfComponents }: TemplateProps) {
  const { Document, Page, Text, View, StyleSheet } = pdfComponents;

  // Define styles for the Creative template
  const creativeStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: '0.75in',
      fontSize: 11,
      fontFamily: 'Helvetica',
      lineHeight: 1.1,
    },
    header: {
      backgroundColor: '#8b5cf6',
      color: '#ffffff',
      padding: 20,
      marginBottom: 12,
      borderRadius: 8,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#ffffff',
      textAlign: 'center',
    },
    contact: {
      fontSize: 11,
      color: '#ffffff',
      marginBottom: 2,
      lineHeight: 1.1,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 6,
      color: '#8b5cf6',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottom: '2pt solid #8b5cf6',
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
      color: '#8b5cf6',
      marginBottom: 1,
    },
    company: {
      fontSize: 11,
      color: '#000000',
      marginBottom: 1,
    },
    date: {
      fontSize: 11,
      color: '#666666',
      textAlign: 'right',
      fontWeight: 'normal',
    },
    location: {
      fontSize: 11,
      color: '#666666',
      textAlign: 'right',
      marginTop: 1,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    skill: {
      fontSize: 10,
      color: '#ffffff',
      backgroundColor: '#8b5cf6',
      padding: '4 8',
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
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
      color: '#8b5cf6',
      marginBottom: 1,
    },
    institution: {
      fontSize: 11,
      color: '#000000',
    },
  });

  return (
    <Document>
      <Page size="A4" style={creativeStyles.page}>
        {/* Header */}
        <View style={creativeStyles.header}>
          <Text style={creativeStyles.name}>
            {personalInfo.fullName || 'Your Name'}
          </Text>
          <Text style={creativeStyles.contact}>
            {personalInfo.phone && `${personalInfo.phone} | `}
            {personalInfo.email && `${personalInfo.email} | `}
            {personalInfo.location && personalInfo.location}
          </Text>
          {personalInfo.linkedin && (
            <Text style={creativeStyles.contact}>{personalInfo.linkedin}</Text>
          )}
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View>
            <Text style={creativeStyles.sectionTitle}>About Me</Text>
            <Text style={creativeStyles.text}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View>
            <Text style={creativeStyles.sectionTitle}>Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={creativeStyles.experienceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={creativeStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={creativeStyles.company}>{exp.company}</Text>
                  </View>
                  <View>
                    <Text style={creativeStyles.date}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                    <Text style={creativeStyles.location}>{exp.location}</Text>
                  </View>
                </View>
                {exp.description && exp.description.map((desc: string, descIndex: number) => (
                  <Text key={descIndex} style={creativeStyles.bulletPoint}>
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
            <Text style={creativeStyles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 6 }}>
                <View style={creativeStyles.educationHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={creativeStyles.degree}>{edu.degree}</Text>
                    <Text style={creativeStyles.institution}>{edu.institution}</Text>
                  </View>
                  <View>
                    <Text style={creativeStyles.date}>{edu.graduationDate}</Text>
                    <Text style={creativeStyles.location}>{edu.location}</Text>
                  </View>
                </View>
                {edu.gpa && (
                  <Text style={creativeStyles.text}>GPA: {edu.gpa}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View>
            <Text style={creativeStyles.sectionTitle}>Skills</Text>
            <View style={creativeStyles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={skill.id || `skill-${index}`} style={creativeStyles.skill}>
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
