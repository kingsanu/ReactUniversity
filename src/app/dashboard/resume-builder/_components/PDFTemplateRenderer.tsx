import React from 'react';

// This function will be called dynamically, so we need to import React PDF components here
export function createPDFDocument(data: any) {
  // This will be populated when the function is called
  let Document: any, Page: any, Text: any, View: any, StyleSheet: any;
  
  // We need to import these dynamically since this is called from the download function
  const ReactPDF = require('@react-pdf/renderer');
  Document = ReactPDF.Document;
  Page = ReactPDF.Page;
  Text = ReactPDF.Text;
  View = ReactPDF.View;
  StyleSheet = ReactPDF.StyleSheet;

  const { personalInfo, experience, education, skills, template } = data;

  // Get template-specific styles with diverse layouts (A4 paper size)
  const getTemplateStyles = (selectedTemplate: string) => {
    const baseStyles = {
      page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: '0.75in',
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.1,
        size: 'A4', // Ensure A4 paper size (210 × 297 mm)
      },
      name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6, // Increased spacing after name
        color: '#000000',
      },
      contact: {
        fontSize: 11,
        color: '#000000',
        marginBottom: 3, // Increased spacing between contact lines
        lineHeight: 1.2, // Better line height for readability
      },
      sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 16, // Increased top margin for better section separation
        marginBottom: 8, // Increased bottom margin for better spacing
        color: '#000000',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
      skillItem: {
        fontSize: 11,
        color: '#000000',
        marginRight: 14,
        marginBottom: 2,
      },
    };

    // Create diverse template layouts matching the preview and live preview
    switch (selectedTemplate) {
      case 'modern':
        return {
          ...baseStyles,
          page: { ...baseStyles.page, flexDirection: 'column' },
          header: {
            textAlign: 'center',
            marginBottom: 14, // Reduced from 20 for better space utilization
            paddingBottom: 8, // Reduced from 10
            borderBottom: '2pt solid #2563eb',
          },
          name: { ...baseStyles.name, color: '#2563eb', textTransform: 'uppercase' },
          sectionTitle: {
            ...baseStyles.sectionTitle,
            color: '#2563eb',
            borderBottom: '2pt solid #2563eb',
            backgroundColor: '#eff6ff',
            padding: 3, // Reduced from 4
            marginTop: 10, // Reduced from 16
            marginBottom: 6, // Reduced from 8
          },
          experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 3, // Reduced from 4
            alignItems: 'flex-start',
          },
        };

      case 'creative':
        return {
          ...baseStyles,
          page: { ...baseStyles.page, flexDirection: 'row' },
          sidebar: {
            width: '35%',
            backgroundColor: '#7c3aed',
            padding: 12, // Reduced from 16
            marginRight: 12, // Reduced from 16
          },
          mainContent: {
            width: '65%',
            padding: 6, // Reduced from 8
          },
          name: {
            ...baseStyles.name,
            color: '#ffffff',
            fontSize: 16, // Reduced from 18 for better fit
            marginBottom: 6, // Reduced from 8
            lineHeight: 1.3, // Added proper line height to prevent overlap
          },
          contact: {
            ...baseStyles.contact,
            color: '#f3e8ff', // Improved contrast - lighter purple instead of #e9d5ff
            marginBottom: 3, // Reduced from 4
          },
          text: {
            ...baseStyles.text,
            color: '#f8fafc', // Better contrast for sidebar text
          },
          textMain: {
            ...baseStyles.text,
            color: '#374151', // Dark text for main content area
          },
          sectionTitle: {
            ...baseStyles.sectionTitle,
            color: '#ffffff',
            borderBottom: '2pt solid #ffffff',
            marginTop: 10, // Reduced from 16
            marginBottom: 6, // Reduced from 8
          },
          sectionTitleMain: {
            ...baseStyles.sectionTitle,
            color: '#7c3aed',
            borderLeft: '4pt solid #7c3aed',
            paddingLeft: 10, // Reduced from 12
            borderBottom: 'none',
            marginTop: 10, // Reduced from 16
            marginBottom: 6, // Reduced from 8
          },
          jobTitleMain: {
            ...baseStyles.jobTitle,
            fontSize: 13,
            color: '#1f2937', // Dark text for main content
            fontWeight: 'bold',
          },
          companyMain: {
            ...baseStyles.company,
            fontSize: 11,
            color: '#4b5563', // Dark text for main content
          },
          experienceHeader: {
            flexDirection: 'column',
            marginBottom: 3, // Reduced from 4
          },
        };

      case 'minimal':
        return {
          ...baseStyles,
          page: { ...baseStyles.page, flexDirection: 'column' },
          header: {
            textAlign: 'left',
            marginBottom: 16, // Reduced from 20
            paddingBottom: 8, // Reduced from 10
          },
          name: { ...baseStyles.name, fontSize: 18, marginBottom: 6, textTransform: 'none' },
          sectionTitle: {
            ...baseStyles.sectionTitle,
            borderBottom: 'none',
            borderLeft: '4pt solid #000000',
            backgroundColor: '#f9fafb',
            padding: 4,
            paddingLeft: 16, // Increased from 12 to prevent overlap with border
            marginTop: 12, // Reduced from 16
            marginBottom: 6, // Reduced from 8
          },
          experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 3,
            alignItems: 'flex-start',
          },
        };

      case 'executive':
        return {
          ...baseStyles,
          page: { ...baseStyles.page, flexDirection: 'column' },
          header: {
            textAlign: 'center',
            marginBottom: 16, // Further reduced from 20
            paddingBottom: 10, // Further reduced padding
            borderBottom: '4pt solid #1f2937', // Thicker border for distinction
            backgroundColor: '#f8fafc', // Subtle background
            padding: 10, // Further reduced background padding
          },
          name: {
            ...baseStyles.name,
            fontSize: 20, // Reduced from 22 to prevent overlap
            color: '#1f2937',
            textTransform: 'none',
            letterSpacing: 1.5, // Reduced letter spacing
            fontWeight: 'bold',
            marginBottom: 10, // Increased from 6 to prevent overlap with contact info
            lineHeight: 1.2, // Added proper line height
          },
          contact: {
            ...baseStyles.contact,
            fontSize: 11, // Slightly smaller
            color: '#4b5563', // Slightly muted contact info
            marginBottom: 2, // Reduced margin
            lineHeight: 1.3, // Better line height
          },
          sectionTitle: {
            ...baseStyles.sectionTitle,
            color: '#ffffff', // White text
            backgroundColor: '#1f2937', // Dark background
            fontSize: 12, // Slightly smaller
            borderBottom: 'none',
            textTransform: 'uppercase',
            letterSpacing: 1.2, // Reduced letter spacing
            padding: 3, // Further reduced padding
            marginTop: 10, // Further reduced from 12
            marginBottom: 4, // Further reduced from 6
          },
          jobTitle: {
            ...baseStyles.jobTitle,
            fontSize: 13, // Reduced from 14
            color: '#1f2937',
            fontWeight: 'bold',
          },
          company: {
            ...baseStyles.company,
            fontSize: 11, // Reduced from 12
            color: '#4b5563',
            fontStyle: 'italic', // Italicized company names
          },
          text: {
            ...baseStyles.text,
            fontSize: 11, // Reduced from 12
            lineHeight: 1.2, // Reduced line height
            color: '#374151', // Ensure proper text color for Executive template
          },
          bulletPoint: {
            ...baseStyles.bulletPoint,
            fontSize: 11, // Reduced from 12
            marginBottom: 2, // Reduced from 3
            marginLeft: 16, // Reduced indentation
          },
          experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4, // Reduced from 6
            alignItems: 'flex-start',
            borderBottom: '1pt solid #e5e7eb', // Subtle separator
            paddingBottom: 2, // Reduced from 3
          },
          date: {
            ...baseStyles.date,
            fontSize: 10, // Reduced from 11
            color: '#6b7280',
            fontWeight: 'bold',
          },
        };

      case 'tech':
        return {
          ...baseStyles,
          page: { ...baseStyles.page, flexDirection: 'column' },
          header: {
            textAlign: 'left',
            marginBottom: 20, // Increased spacing after header
            paddingBottom: 12, // Increased padding
            backgroundColor: '#f0fdf4',
            padding: 12, // Increased overall padding
          },
          name: { ...baseStyles.name, color: '#059669', fontSize: 18 },
          contact: { ...baseStyles.contact, color: '#065f46' },
          sectionTitle: {
            ...baseStyles.sectionTitle,
            color: '#ffffff',
            backgroundColor: '#059669',
            padding: 4,
            borderBottom: 'none',
          },
          experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 3,
            alignItems: 'flex-start',
            backgroundColor: '#f0fdf4',
            padding: 4,
          },
          skillsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          },
          skillTag: {
            backgroundColor: '#dcfce7',
            color: '#065f46',
            padding: 2,
            fontSize: 10,
            borderRadius: 4,
          },
        };

      default:
        return {
          ...baseStyles,
          header: {
            textAlign: 'center',
            marginBottom: 16,
            paddingBottom: 8,
          },
          sectionTitle: {
            ...baseStyles.sectionTitle,
            borderBottom: '2pt solid #000000',
          },
          experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
            alignItems: 'flex-start',
          },
        };
    }
  };

  const styles = StyleSheet.create(getTemplateStyles(template || 'modern'));


  // Create template-specific layouts
  if (template === 'creative') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
            <Text style={styles.contact}>{personalInfo.phone || '(555) 123-4567'}</Text>
            <Text style={styles.contact}>{personalInfo.email || 'email@example.com'}</Text>
            <Text style={styles.contact}>{personalInfo.location || 'City, State'}</Text>

            {skills && skills.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Skills</Text>
                {skills.map((skill: any, index: number) => (
                  <Text key={skill.id || `skill-${index}`} style={styles.text}>
                    • {skill.name || ''}
                  </Text>
                ))}
              </View>
            )}

            {education && education.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu: any, index: number) => (
                  <View key={index} style={{ marginBottom: 6 }}>
                    <Text style={{...styles.text, fontWeight: 'bold'}}>{edu.degree}</Text>
                    <Text style={styles.text}>{edu.institution}</Text>
                    <Text style={styles.text}>{edu.graduationDate}</Text>
                    {edu.gpa && <Text style={styles.text}>GPA: {edu.gpa}</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {personalInfo.summary && (
              <View>
                <Text style={styles.sectionTitleMain}>Professional Summary</Text>
                <Text style={styles.textMain}>{personalInfo.summary}</Text>
              </View>
            )}

            {experience && experience.length > 0 && (
              <View>
                <Text style={styles.sectionTitleMain}>Professional Experience</Text>
                {experience.map((exp: any, index: number) => (
                  <View key={index} style={{ marginBottom: 8 }}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.jobTitleMain}>{exp.jobTitle}</Text>
                      <Text style={styles.companyMain}>
                        {exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </Text>
                    </View>
                    {exp.description && exp.description.map((desc: string, descIndex: number) => (
                      <Text key={descIndex} style={{...styles.bulletPoint, color: '#374151'}}>• {desc}</Text>
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

  // Standard single-column layout for other templates
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          <Text style={styles.contact}>
            {personalInfo.phone && `${personalInfo.phone} | `}
            {personalInfo.email && `${personalInfo.email} | `}
            {personalInfo.location && personalInfo.location}
          </Text>
          {(template === 'tech' || template === 'executive') && personalInfo.linkedin && (
            <Text style={styles.contact}>
              {personalInfo.linkedin}
              {personalInfo.website && ` | ${personalInfo.website}`}
            </Text>
          )}
        </View>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp: any, index: number) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={styles.experienceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.company}>{exp.company} | {exp.location}</Text>
                  </View>
                  <View>
                    <Text style={styles.date}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                </View>
                {exp.description && exp.description.map((desc: string, descIndex: number) => (
                  <Text key={descIndex} style={styles.bulletPoint}>• {desc}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, index: number) => (
              <View key={index} style={{ marginBottom: 6 }}>
                <View style={styles.experienceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{edu.degree}</Text>
                    <Text style={styles.company}>{edu.institution} | {edu.location}</Text>
                  </View>
                  <View>
                    <Text style={styles.date}>{edu.graduationDate}</Text>
                  </View>
                </View>
                {edu.gpa && <Text style={styles.text}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>Core Competencies</Text>
            {template === 'tech' ? (
              <View style={styles.skillsGrid}>
                {skills.map((skill: any, index: number) => (
                  <View key={skill.id || `skill-${index}`} style={styles.skillTag}>
                    <Text style={{ fontSize: 10, color: '#065f46' }}>{skill.name || ''}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {skills.map((skill: any, index: number) => (
                  <Text key={skill.id || `skill-${index}`} style={styles.skillItem}>
                    {skill.name || ''}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}

