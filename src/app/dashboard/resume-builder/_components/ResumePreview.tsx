"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Download, Eye, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

export function ResumePreview() {
  const { resumeBuilder } = useGlobalStore();
  const { data } = resumeBuilder;
  
  // Debounce the resume data to prevent excessive re-renders
  const debouncedData = useDebounce(data, 300); // 300ms delay
  const { personalInfo, experience, education, skills } = debouncedData;
  
  const [pdfComponents, setPdfComponents] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lazy load PDF components when needed
  useEffect(() => {
    if (isClient && !pdfComponents) {
      setLoadingPDF(true);
      
      import('@react-pdf/renderer').then((reactPdf) => {
        setPdfComponents({
          PDFViewer: reactPdf.PDFViewer,
          PDFDownloadLink: reactPdf.PDFDownloadLink,
          Document: reactPdf.Document,
          Page: reactPdf.Page,
          Text: reactPdf.Text,
          View: reactPdf.View,
          StyleSheet: reactPdf.StyleSheet,
          pdf: reactPdf.pdf
        });
        setLoadingPDF(false);
      }).catch((error) => {
        console.error('Failed to load PDF components:', error);
        setLoadingPDF(false);
      });
    }
  }, [isClient, pdfComponents]);

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

  const handleDownload = async () => {
    if (!pdfComponents || !renderPDFTemplate) return;
    
    try {
      const { pdf } = pdfComponents;
      const blob = await pdf(renderPDFTemplate).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${personalInfo.fullName || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowPreview(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Eye size={16} />
          Preview
        </button>
        
        <button
          onClick={handleDownload}
          disabled={!pdfComponents || loadingPDF}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {loadingPDF ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {loadingPDF ? 'Loading...' : 'Download PDF'}
        </button>
      </div>

      {/* Preview Modal - Fullscreen with Portal */}
      {showPreview && isClient && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex flex-col"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full h-full bg-white flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* PDF Viewer Container */}
              <div className="flex-1 bg-gray-50">
                {pdfComponents ? (
                  <pdfComponents.PDFViewer
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      border: 'none',
                      backgroundColor: '#f9fafb'
                    }}
                    showToolbar={true}
                  >
                    {renderPDFTemplate}
                  </pdfComponents.PDFViewer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading PDF viewer...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
