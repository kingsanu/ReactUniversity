"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Loader2, FileText, X } from 'lucide-react';

// PDF Error Boundary Component
class PDFErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PDF Error:', error, errorInfo);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <X size={24} className="text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">PDF Preview Error</h3>
            <p className="text-xs text-gray-600 mb-3">
              There was an issue rendering the PDF preview. Your data is safe.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface LivePreviewPDFProps {
  className?: string;
}

export function LivePreviewPDF({ className = "" }: LivePreviewPDFProps = {}) {
  const { resumeBuilder } = useGlobalStore();
  const { data } = resumeBuilder;
  
  // Debounce the resume data to prevent excessive re-renders
  const debouncedData = useDebounce(data, 300); // 300ms delay
  const { personalInfo, experience, education, skills } = debouncedData;
  
  // Track if data is currently being debounced
  const isDataChanging = JSON.stringify(data) !== JSON.stringify(debouncedData);
  
  const [pdfComponents, setPdfComponents] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lazy load PDF components on mount
  useEffect(() => {
    if (!pdfComponents && isClient) {
      setLoadingPDF(true);
      setPdfError(null);
      
      import('@react-pdf/renderer').then((reactPdf) => {
        setPdfComponents({
          PDFViewer: reactPdf.PDFViewer,
          Document: reactPdf.Document,
          Page: reactPdf.Page,
          Text: reactPdf.Text,
          View: reactPdf.View,
          StyleSheet: reactPdf.StyleSheet
        });
        setLoadingPDF(false);
      }).catch((error) => {
        console.error('Failed to load PDF components:', error);
        setPdfError('Failed to load PDF components. Please try again.');
        setLoadingPDF(false);
      });
    }
  }, [pdfComponents, isClient]);

  // Create PDF document matching the selected template
  const renderPDFTemplate = useMemo(() => {
    if (!pdfComponents) return null;

    try {
      const { Document, Page, Text, View, StyleSheet } = pdfComponents;

      // Get template-specific styles with diverse layouts (A4 paper size)
      const getTemplateStyles = (template: string) => {
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

        // Create diverse template layouts matching the preview
        switch (template) {
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

      const styles = StyleSheet.create(getTemplateStyles(data.template || 'modern'));


      // Create template-specific layouts
      if (data.template === 'creative') {
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
                    {skills.map((skill, index) => (
                      <Text key={skill.id || `skill-${index}`} style={styles.text}>
                        • {skill.name || ''}
                      </Text>
                    ))}
                  </View>
                )}

                {education.length > 0 && (
                  <View>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {education.map((edu, index) => (
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

                {experience.length > 0 && (
                  <View>
                    <Text style={styles.sectionTitleMain}>Professional Experience</Text>
                    {experience.map((exp, index) => (
                      <View key={index} style={{ marginBottom: 8 }}>
                        <View style={styles.experienceHeader}>
                          <Text style={styles.jobTitleMain}>{exp.jobTitle}</Text>
                          <Text style={styles.companyMain}>
                            {exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </Text>
                        </View>
                        {exp.description.map((desc, descIndex) => (
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
              {(data.template === 'tech' || data.template === 'executive') && personalInfo.linkedin && (
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
            {experience.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {experience.map((exp, index) => (
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
                    {exp.description.map((desc, descIndex) => (
                      <Text key={descIndex} style={styles.bulletPoint}>• {desc}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu, index) => (
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
                {data.template === 'tech' ? (
                  <View style={styles.skillsGrid}>
                    {skills.map((skill, index) => (
                      <View key={skill.id || `skill-${index}`} style={styles.skillTag}>
                        <Text style={{ fontSize: 10, color: '#065f46' }}>{skill.name || ''}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {skills.map((skill, index) => (
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
    } catch (error) {
      console.error('Error rendering PDF template:', error);
      return null;
    }
  }, [pdfComponents, personalInfo, experience, education, skills, data.template]);

  if (!isClient) {
    return null;
  }

  return (
    <div className={cn("h-[calc(100vh-12rem)] flex flex-col bg-gray-50", className)}>
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText size={18} className="text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">Live Preview</h3>
            {isDataChanging && (
              <div className="flex items-center space-x-1 text-xs text-blue-600">
                <Loader2 size={12} className="animate-spin" />
                <span>Updating...</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Template: {data.template || 'Modern'}
          </div>
        </div>
      </div>

      {/* PDF Viewer Container */}
      <div className="flex-1 bg-gray-50 min-h-0">
        {loadingPDF ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading PDF preview...</p>
            </div>
          </div>
        ) : pdfError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <X size={24} className="text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Preview Error</h3>
              <p className="text-xs text-gray-600 mb-3">{pdfError}</p>
              <button
                onClick={() => {
                  setPdfError(null);
                  setPdfComponents(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : pdfComponents && renderPDFTemplate ? (
          <PDFErrorBoundary>
            <div className="w-full h-full">
              <pdfComponents.PDFViewer
                key={`pdf-${skills.length}-${experience.length}-${education.length}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#f9fafb'
                }}
                showToolbar={false}
              >
                {renderPDFTemplate}
              </pdfComponents.PDFViewer>
            </div>
          </PDFErrorBoundary>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">PDF preview will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
