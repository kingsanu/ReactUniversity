import React from 'react';
import { ResumeData } from '@/store/useGlobalStore';
import { FileText } from 'lucide-react';

// Template Components
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { MinimalTemplate } from './MinimalTemplate';

interface TemplateRendererProps {
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  data: ResumeData;
  pdfComponents: any;
}

export function TemplateRenderer({ template, data, pdfComponents }: TemplateRendererProps) {
  try {
    // Validate required data
    if (!data || !pdfComponents) {
      console.warn('Missing required data or PDF components for template rendering');
      return null;
    }

    const { personalInfo, experience, education, skills } = data;

    // Ensure minimum required data exists
    const safePersonalInfo = personalInfo || {};
    const safeExperience = experience || [];
    const safeEducation = education || [];
    const safeSkills = skills || [];

    // Render the appropriate template based on selection
    switch (template) {
    case 'modern':
      return (
        <ModernTemplate
          personalInfo={safePersonalInfo}
          experience={safeExperience}
          education={safeEducation}
          skills={safeSkills}
          pdfComponents={pdfComponents}
        />
      );
    case 'classic':
      return (
        <ClassicTemplate
          personalInfo={safePersonalInfo}
          experience={safeExperience}
          education={safeEducation}
          skills={safeSkills}
          pdfComponents={pdfComponents}
        />
      );
    case 'creative':
      return (
        <CreativeTemplate
          personalInfo={safePersonalInfo}
          experience={safeExperience}
          education={safeEducation}
          skills={safeSkills}
          pdfComponents={pdfComponents}
        />
      );
    case 'minimal':
      return (
        <MinimalTemplate
          personalInfo={safePersonalInfo}
          experience={safeExperience}
          education={safeEducation}
          skills={safeSkills}
          pdfComponents={pdfComponents}
        />
      );
    default:
      console.warn(`Unknown template: ${template}, falling back to modern`);
      return (
        <ModernTemplate
          personalInfo={safePersonalInfo}
          experience={safeExperience}
          education={safeEducation}
          skills={safeSkills}
          pdfComponents={pdfComponents}
        />
      );
    }
  } catch (error) {
    console.error('Error rendering template:', error);
    return null;
  }
}

// Template Preview Component for Template Selection
interface TemplatePreviewProps {
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  sampleData: ResumeData;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TemplatePreview({ template, sampleData, isSelected, onClick }: TemplatePreviewProps) {
  const [pdfComponents, setPdfComponents] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Load PDF components on mount
  React.useEffect(() => {
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
      setError('Failed to load preview');
      setIsLoading(false);
    });
  }, []);

  const getTemplateInfo = (templateId: string) => {
    const templates = {
      modern: {
        name: 'Modern',
        description: 'Clean, professional design with modern typography',
        color: '#3b82f6',
        features: ['ATS-Optimized', 'Color Customizable', 'Single Page']
      },
      classic: {
        name: 'Classic',
        description: 'Traditional format preferred by recruiters',
        color: '#374151',
        features: ['ATS-Optimized', 'Traditional Layout', 'Single Page']
      },
      creative: {
        name: 'Creative',
        description: 'Stand out with a unique, creative layout',
        color: '#8b5cf6',
        features: ['Creative Design', 'Color Customizable', 'Visual Appeal']
      },
      minimal: {
        name: 'Minimal',
        description: 'Simple, clean design that focuses on content',
        color: '#10b981',
        features: ['ATS-Optimized', 'Clean Layout', 'Single Page']
      }
    };
    return templates[templateId as keyof typeof templates];
  };

  const templateInfo = getTemplateInfo(template);

  // Render PDF template for preview
  const renderPDFTemplate = React.useMemo(() => {
    if (!pdfComponents || !sampleData) return null;

    try {
      return (
        <TemplateRenderer
          template={template}
          data={sampleData}
          pdfComponents={pdfComponents}
        />
      );
    } catch (error) {
      console.error('Error rendering template preview:', error);
      return null;
    }
  }, [pdfComponents, sampleData, template]);

  return (
    <div
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg'
          : 'hover:shadow-lg hover:-translate-y-1'
      }`}
      onClick={onClick}
    >
      <div className={`bg-white rounded-lg border-2 p-3 ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      }`}>
        {/* Template Preview - Enhanced */}
        <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 relative overflow-hidden shadow-inner border border-gray-200">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <div className="text-sm font-medium text-gray-600">Loading preview...</div>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg">
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
                <div className="text-sm font-medium text-gray-700">{templateInfo.name} Template</div>
                <div className="text-xs text-gray-500 mt-1">Preview unavailable</div>
              </div>
            </div>
          ) : pdfComponents && renderPDFTemplate ? (
            <div className="w-full h-full rounded-xl overflow-hidden">
              <pdfComponents.PDFViewer
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '12px'
                }}
                showToolbar={false}
              >
                {renderPDFTemplate}
              </pdfComponents.PDFViewer>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-xl shadow-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${templateInfo.color}, ${templateInfo.color}dd)`
                  }}
                >
                  <div className="text-white font-bold text-2xl">
                    {templateInfo.name[0]}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">{templateInfo.name} Template</div>
                <div className="text-xs text-gray-500 mt-1">Professional Design</div>
              </div>
            </div>
          )}

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Template Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">{templateInfo.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{templateInfo.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {templateInfo.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
