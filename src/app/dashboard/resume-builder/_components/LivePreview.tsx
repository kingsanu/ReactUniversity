"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Loader2, FileText } from 'lucide-react';

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

export function LivePreview() {
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

  // Create PDF document matching the reference style - memoized to prevent unnecessary re-renders
  const renderPDFTemplate = useMemo(() => {
    if (!pdfComponents) return null;
    
    const { Document, Page, Text, View, StyleSheet } = pdfComponents;
    
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: '0.75in', // ATS-friendly: 0.5-1 inch margins
        fontSize: 11,
        fontFamily: 'Helvetica', // ATS-friendly font
        lineHeight: 1.1, // Reduced from 1.15 for tighter spacing
      },
      header: {
        textAlign: 'center', // Back to center alignment for personal info
        marginBottom: 12, // Reduced from 16
        paddingBottom: 6, // Reduced from 8
      },
      name: {
        fontSize: 16, // ATS-friendly size (14-18pt)
        fontWeight: 'bold',
        marginBottom: 4, // Reduced from 6
        color: '#000000',
        textTransform: 'uppercase',
      },
      title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 6, // Reduced from 8
        color: '#000000',
      },
      contact: {
        fontSize: 11, // Consistent with body text
        color: '#000000',
        marginBottom: 2, // Reduced from 3
        lineHeight: 1.1, // Reduced from 1.2
      },
      sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 12, // Reduced from 16
        marginBottom: 6, // Reduced from 8
        color: '#000000',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        borderBottom: '1pt solid #000000',
        paddingBottom: 3, // Reduced from 4
      },
      text: {
        fontSize: 11, // Standard body text size
        lineHeight: 1.2, // Reduced from 1.3
        marginBottom: 4, // Reduced from 6
        color: '#000000',
      },
      bulletPoint: {
        fontSize: 11,
        marginBottom: 2, // Reduced from 4
        marginLeft: 16, // Standard bullet indentation
        color: '#000000',
        lineHeight: 1.2, // Reduced from 1.3
      },
      experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3, // Reduced from 4
        alignItems: 'flex-start',
      },
      jobTitle: {
        fontSize: 12, // Slightly larger for emphasis
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 1, // Reduced from 2
      },
      company: {
        fontSize: 11,
        color: '#000000',
        marginBottom: 1, // Reduced from 2
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
        gap: 8, // Reduced from 12
      },
      skill: {
        fontSize: 11,
        color: '#000000',
        marginRight: 14, // Reduced from 18
        marginBottom: 2, // Reduced from 4
      },
      educationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3, // Reduced from 4
        alignItems: 'flex-start',
      },
      degree: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 1, // Reduced from 2
      },
      institution: {
        fontSize: 11,
        color: '#000000',
      },
    });

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>
              {personalInfo.fullName || 'Your Name'}
            </Text>
            <Text style={styles.contact}>
              {personalInfo.phone && `${personalInfo.phone} | `}
              {personalInfo.email && `${personalInfo.email} | `}
              {personalInfo.location && personalInfo.location}
            </Text>
            {personalInfo.linkedin && (
              <Text style={styles.contact}>{personalInfo.linkedin}</Text>
            )}
          </View>

          {/* Summary */}
          {personalInfo.summary && (
            <View>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.text}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Experience</Text>
              {experience.map((exp, index) => (
                <View key={index} style={{ marginBottom: 8 }}>
                  <View style={styles.experienceHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                      <Text style={styles.company}>{exp.company}</Text>
                    </View>
                    <View>
                      <Text style={styles.date}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </Text>
                      <Text style={styles.location}>{exp.location}</Text>
                    </View>
                  </View>
                  {exp.description.map((desc, descIndex) => (
                    <Text key={descIndex} style={styles.bulletPoint}>
                      • {desc}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, index) => (
                <View key={index} style={{ marginBottom: 6 }}>
                  <View style={styles.educationHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.degree}>{edu.degree}</Text>
                      <Text style={styles.institution}>{edu.institution}</Text>
                    </View>
                    <View>
                      <Text style={styles.date}>{edu.graduationDate}</Text>
                      <Text style={styles.location}>{edu.location}</Text>
                    </View>
                  </View>
                  {edu.gpa && (
                    <Text style={styles.text}>GPA: {edu.gpa}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <Text key={index} style={styles.skill}>
                    {skill.name}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </Page>
      </Document>
    );
  }, [pdfComponents, personalInfo, experience, education, skills]); // Dependencies for memoization

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full"
    >
      {/* Error Message */}
      {pdfError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
          {pdfError}
        </div>
      )}

      {/* Preview Content */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white relative">
        {loadingPDF ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading preview...</p>
            </div>
          </div>
        ) : pdfComponents ? (
          <div style={{ height: '480px',position:"relative" }} className="relative">
            {/* Updating Loader Overlay */}
            {isDataChanging && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Updating preview...</p>
                </div>
              </div>
            )}
            
            <pdfComponents.PDFViewer
              style={{ width: '100%', height: '100%', border: 'none' ,position:'sticky',top:'0'}}
              showToolbar={false}
            >
              {renderPDFTemplate}
            </pdfComponents.PDFViewer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Preview unavailable</p>
              <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
