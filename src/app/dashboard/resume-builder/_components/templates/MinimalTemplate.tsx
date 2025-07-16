import React from 'react';

interface TemplateProps {
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: any[];
  pdfComponents: any;
}

export function MinimalTemplate({ personalInfo, experience, education, skills, pdfComponents }: TemplateProps) {
  const { Document, Page, Text, View, StyleSheet } = pdfComponents;

  // Define styles for the Minimal template
  const minimalStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: '0.75in',
      fontSize: 11,
      fontFamily: 'Helvetica',
      lineHeight: 1.2,
    },
    header: {
      marginBottom: 20,
      paddingBottom: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 6,
      color: '#000000',
    },
    contact: {
      fontSize: 11,
      color: '#666666',
      marginBottom: 2,
      lineHeight: 1.1,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    text: {
      fontSize: 11,
      lineHeight: 1.3,
      marginBottom: 4,
      color: '#000000',
    },
    bulletPoint: {
      fontSize: 11,
      marginBottom: 3,
      marginLeft: 12,
      color: '#000000',
      lineHeight: 1.3,
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
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
    },
    skill: {
      fontSize: 11,
      color: '#000000',
      marginRight: 16,
      marginBottom: 3,
    },
    educationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
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
      <Page size="A4" style={minimalStyles.page}>
        {/* Header */}
        <View style={minimalStyles.header}>
          <Text style={minimalStyles.name}>
            {personalInfo.fullName || 'Your Name'}
          </Text>
          <Text style={minimalStyles.contact}>
            {personalInfo.email && `${personalInfo.email}`}
            {personalInfo.phone && ` • ${personalInfo.phone}`}
            {personalInfo.location && ` • ${personalInfo.location}`}
          </Text>
          {personalInfo.linkedin && (
            <Text style={minimalStyles.contact}>{personalInfo.linkedin}</Text>
          )}
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View>
            <Text style={minimalStyles.sectionTitle}>Summary</Text>
            <Text style={minimalStyles.text}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View>
            <Text style={minimalStyles.sectionTitle}>Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <View style={minimalStyles.experienceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={minimalStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={minimalStyles.company}>{exp.company}</Text>
                  </View>
                  <View>
                    <Text style={minimalStyles.date}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                    <Text style={minimalStyles.location}>{exp.location}</Text>
                  </View>
                </View>
                {exp.description && exp.description.map((desc: string, descIndex: number) => (
                  <Text key={descIndex} style={minimalStyles.bulletPoint}>
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
            <Text style={minimalStyles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={minimalStyles.educationHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={minimalStyles.degree}>{edu.degree}</Text>
                    <Text style={minimalStyles.institution}>{edu.institution}</Text>
                  </View>
                  <View>
                    <Text style={minimalStyles.date}>{edu.graduationDate}</Text>
                    <Text style={minimalStyles.location}>{edu.location}</Text>
                  </View>
                </View>
                {edu.gpa && (
                  <Text style={minimalStyles.text}>GPA: {edu.gpa}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View>
            <Text style={minimalStyles.sectionTitle}>Skills</Text>
            <View style={minimalStyles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={skill.id || `skill-${index}`} style={minimalStyles.skill}>
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
