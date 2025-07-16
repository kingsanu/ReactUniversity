"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Download, Eye, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TemplateRenderer } from './templates/TemplateRenderer';

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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Preview Error</h3>
            <p className="text-gray-600 mb-4">
              There was an issue rendering the PDF preview. Your data is safe.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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

export function ResumePreview() {
  const { resumeBuilder } = useGlobalStore();
  const { data } = resumeBuilder;

  // Debounce the resume data to prevent excessive re-renders
  const debouncedData = useDebounce(data, 500); // Increased to 500ms delay for better performance
  const { personalInfo, template } = debouncedData;
  
  const [pdfComponents, setPdfComponents] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  // Create PDF document using the selected template - memoized to prevent unnecessary re-renders
  const renderPDFTemplate = useMemo(() => {
    if (!pdfComponents) return null;

    try {
      return (
        <TemplateRenderer
          template={template}
          data={debouncedData}
          pdfComponents={pdfComponents}
        />
      );
    } catch (error) {
      console.error('Error rendering ResumePreview PDF template:', error);
      return null;
    }
  }, [pdfComponents, debouncedData, template]); // Dependencies for memoization

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
      {/* Preview Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Eye size={20} />
        <span>Preview Resume</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && typeof window !== 'undefined' && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Eye size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Resume Preview</h2>
                    <p className="text-sm text-gray-600">Review your resume before downloading</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex h-[calc(90vh-120px)]">
                {/* PDF Viewer Container */}
                <div className="flex-1 bg-gray-50">
                  {pdfComponents && renderPDFTemplate ? (
                    <PDFErrorBoundary>
                      <div className="w-full h-full">
                        <pdfComponents.PDFViewer
                          key={`pdf-${JSON.stringify(debouncedData).length}`}
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
                      </div>
                    </PDFErrorBoundary>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading PDF viewer...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}
