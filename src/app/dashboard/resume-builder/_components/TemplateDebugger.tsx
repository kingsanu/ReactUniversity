"use client";
import React, { useState, useEffect } from 'react';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { getSampleDataForCareerField } from './careerFieldSampleData';

export function TemplateDebugger() {
  const [pdfComponents, setPdfComponents] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'creative' | 'minimal'>('modern');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load PDF components
  useEffect(() => {
    import('@react-pdf/renderer').then((reactPdf) => {
      setPdfComponents({
        PDFViewer: reactPdf.PDFViewer,
        Document: reactPdf.Document,
        Page: reactPdf.Page,
        Text: reactPdf.Text,
        View: reactPdf.View,
        StyleSheet: reactPdf.StyleSheet
      });
      setIsLoading(false);
    }).catch((error) => {
      console.error('Failed to load PDF components:', error);
      setError('Failed to load PDF components');
      setIsLoading(false);
    });
  }, []);

  const sampleData = getSampleDataForCareerField('software-engineering');

  const renderPDFTemplate = React.useMemo(() => {
    if (!pdfComponents || !sampleData) return null;
    
    try {
      return (
        <TemplateRenderer
          template={selectedTemplate}
          data={sampleData}
          pdfComponents={pdfComponents}
        />
      );
    } catch (error) {
      console.error('Error rendering template:', error);
      return null;
    }
  }, [pdfComponents, sampleData, selectedTemplate]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading PDF components...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Template Debugger</h2>
        
        {/* Template Selector */}
        <div className="flex space-x-4 mb-6">
          {(['modern', 'classic', 'creative', 'minimal'] as const).map((template) => (
            <button
              key={template}
              onClick={() => setSelectedTemplate(template)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTemplate === template
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {template.charAt(0).toUpperCase() + template.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* PDF Preview */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="font-semibold">Template Preview: {selectedTemplate}</h3>
        </div>
        
        <div style={{ height: '600px' }}>
          {pdfComponents && renderPDFTemplate ? (
            <pdfComponents.PDFViewer
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none'
              }}
              showToolbar={true}
            >
              {renderPDFTemplate}
            </pdfComponents.PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No template to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Debug Information:</h4>
        <ul className="text-sm space-y-1">
          <li>PDF Components Loaded: {pdfComponents ? '✅ Yes' : '❌ No'}</li>
          <li>Sample Data Available: {sampleData ? '✅ Yes' : '❌ No'}</li>
          <li>Template Renderer Working: {renderPDFTemplate ? '✅ Yes' : '❌ No'}</li>
          <li>Selected Template: {selectedTemplate}</li>
          <li>Sample Data Fields: {sampleData ? Object.keys(sampleData).join(', ') : 'None'}</li>
        </ul>
      </div>
    </div>
  );
}
