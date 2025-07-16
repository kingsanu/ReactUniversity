"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { motion } from 'motion/react';
import { Loader2, FileText, X } from 'lucide-react';
import { TemplateRenderer } from './templates/TemplateRenderer';

// PDF Error Boundary Component for LivePreview
class LivePreviewErrorBoundary extends React.Component<
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
    console.error('LivePreview PDF Error:', error, errorInfo);
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
            <h3 className="text-sm font-medium text-gray-900 mb-2">Preview Error</h3>
            <p className="text-xs text-gray-600 mb-3">
              There was an issue with the live preview.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Retry
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

export function LivePreview() {
  const { resumeBuilder } = useGlobalStore();
  const { data } = resumeBuilder;

  // Debounce the resume data to prevent excessive re-renders
  const debouncedData = useDebounce(data, 500); // Increased to 500ms delay for better performance
  const { template } = debouncedData;

  // Track if data is currently being debounced using a more efficient comparison
  const isDataChanging = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(debouncedData);
  }, [data, debouncedData]);

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
      console.error('Error rendering LivePreview PDF template:', error);
      return null;
    }
  }, [pdfComponents, debouncedData, template]); // Dependencies for memoization

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full min-h-[600px]"
    >
      {/* Error Message */}
      {pdfError && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Error</h3>
            <p className="text-gray-600 mb-4">{pdfError}</p>
            <button
              onClick={() => {
                setPdfError(null);
                setLoadingPDF(false);
                setPdfComponents(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loadingPDF || !isClient) && !pdfError && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading PDF preview...</p>
          </div>
        </div>
      )}

      {/* Data Changing Indicator */}
      {isDataChanging && pdfComponents && !pdfError && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <Loader2 size={16} className="animate-spin" />
            <span>Updating...</span>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      {pdfComponents && renderPDFTemplate && !pdfError && (
        <div className="w-full h-full min-h-[600px]">
          <LivePreviewErrorBoundary>
            <div className="w-full h-full">
              <pdfComponents.PDFViewer
                key={`live-pdf-${JSON.stringify(debouncedData).length}`}
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none',
                  borderRadius: '8px'
                }}
                showToolbar={false}
              >
                {renderPDFTemplate}
              </pdfComponents.PDFViewer>
            </div>
          </LivePreviewErrorBoundary>
        </div>
      )}

      {/* Fallback when no PDF components */}
      {!pdfComponents && !loadingPDF && !pdfError && isClient && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">PDF preview not available</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
