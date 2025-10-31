import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles for the Classic template
const classicStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 50,
    fontFamily: "Times-Roman",
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  contactInfo: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 10,
    color: "#000000",
    marginBottom: 8,
  },
  contactItem: {
    marginHorizontal: 8,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.4,
    color: "#000000",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  company: {
    fontSize: 11,
    color: "#000000",
    fontStyle: "italic",
    marginBottom: 2,
  },
  dateLocation: {
    fontSize: 10,
    color: "#000000",
    textAlign: "right",
  },
  description: {
    fontSize: 10,
    lineHeight: 1.3,
    color: "#000000",
    marginTop: 3,
    marginLeft: 10,
  },
  skillsContainer: {
    flexDirection: "column",
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
  },
  skillsList: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.2,
  },
});

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
    professionalTitle?: string;
    dateOfBirth?: string;
    nationality?: string;
    languages?: string;
    maritalStatus?: string;
    driversLicense?: string;
    militaryService?: string;
    visaStatus?: string;
    preferredPronouns?: string;
    summary: string;
    careerObjective?: string;
    [key: string]: any; // Support for custom fields
  };
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    level: string;
  }>;
  customFields?: Array<{
    id: string;
    name: string;
    value: string;
    type: string;
    enabled: boolean;
  }>;
  dynamicSections?: Array<{
    id: string;
    type: string;
    title: string;
    entries: Array<{
      id: string;
      [key: string]: any;
    }>;
  }>;
}

interface ClassicTemplatePDFProps {
  data: ResumeData;
}

export const ClassicTemplatePDF: React.FC<ClassicTemplatePDFProps> = ({
  data,
}) => {
  // Group skills by category
  const skillsByCategory = data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Document>
      <Page size="A4" style={classicStyles.page}>
        {/* Header */}
        <View style={classicStyles.header}>
          <Text style={classicStyles.name}>{data.personalInfo.fullName}</Text>
          {data.personalInfo.professionalTitle && (
            <Text
              style={[
                classicStyles.contactItem,
                { fontSize: 12, fontStyle: "italic", marginBottom: 8 },
              ]}
            >
              {data.personalInfo.professionalTitle}
            </Text>
          )}
          <View style={classicStyles.contactInfo}>
            <Text style={classicStyles.contactItem}>
              {data.personalInfo.email}
            </Text>
            <Text style={classicStyles.contactItem}>•</Text>
            <Text style={classicStyles.contactItem}>
              {data.personalInfo.phone}
            </Text>
            <Text style={classicStyles.contactItem}>•</Text>
            <Text style={classicStyles.contactItem}>
              {data.personalInfo.location}
            </Text>
          </View>

          {/* Social Links */}
          {(data.personalInfo.linkedin ||
            data.personalInfo.website ||
            data.personalInfo.github ||
            data.personalInfo.twitter ||
            data.personalInfo.portfolio) && (
            <View
              style={[
                classicStyles.contactInfo,
                { justifyContent: "center", flexWrap: "wrap" },
              ]}
            >
              {data.personalInfo.linkedin && (
                <Text style={classicStyles.contactItem}>
                  LinkedIn: {data.personalInfo.linkedin}
                </Text>
              )}
              {data.personalInfo.website && (
                <>
                  {data.personalInfo.linkedin && (
                    <Text style={classicStyles.contactItem}>•</Text>
                  )}
                  <Text style={classicStyles.contactItem}>
                    Website: {data.personalInfo.website}
                  </Text>
                </>
              )}
              {data.personalInfo.portfolio && (
                <>
                  {(data.personalInfo.linkedin ||
                    data.personalInfo.website) && (
                    <Text style={classicStyles.contactItem}>•</Text>
                  )}
                  <Text style={classicStyles.contactItem}>
                    Portfolio: {data.personalInfo.portfolio}
                  </Text>
                </>
              )}
              {data.personalInfo.github && (
                <>
                  {(data.personalInfo.linkedin ||
                    data.personalInfo.website ||
                    data.personalInfo.portfolio) && (
                    <Text style={classicStyles.contactItem}>•</Text>
                  )}
                  <Text style={classicStyles.contactItem}>
                    GitHub: {data.personalInfo.github}
                  </Text>
                </>
              )}
              {data.personalInfo.twitter && (
                <>
                  {(data.personalInfo.linkedin ||
                    data.personalInfo.website ||
                    data.personalInfo.portfolio ||
                    data.personalInfo.github) && (
                    <Text style={classicStyles.contactItem}>•</Text>
                  )}
                  <Text style={classicStyles.contactItem}>
                    Twitter: {data.personalInfo.twitter}
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Additional Personal Info */}
          {(data.personalInfo.nationality || data.personalInfo.dateOfBirth) && (
            <View
              style={[
                classicStyles.contactInfo,
                { justifyContent: "center", marginTop: 4 },
              ]}
            >
              {data.personalInfo.nationality && (
                <Text style={classicStyles.contactItem}>
                  Nationality: {data.personalInfo.nationality}
                </Text>
              )}
              {data.personalInfo.dateOfBirth && (
                <>
                  {data.personalInfo.nationality && (
                    <Text style={classicStyles.contactItem}>•</Text>
                  )}
                  <Text style={classicStyles.contactItem}>
                    DOB: {data.personalInfo.dateOfBirth}
                  </Text>
                </>
              )}
            </View>
          )}

          {data.personalInfo.summary && (
            <Text style={classicStyles.summary}>
              {data.personalInfo.summary}
            </Text>
          )}
        </View>

        {/* Career Objective */}
        {data.personalInfo.careerObjective && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Career Objective</Text>
            <Text style={classicStyles.description}>
              {data.personalInfo.careerObjective}
            </Text>
          </View>
        )}

        {/* Custom Fields */}
        {data.customFields &&
          data.customFields.filter((f) => f.enabled && f.value).length > 0 && (
            <View style={classicStyles.section}>
              {data.customFields
                .filter((f) => f.enabled && f.value)
                .map((field) => (
                  <View key={field.id} style={{ marginBottom: 8 }}>
                    <Text style={classicStyles.skillCategoryTitle}>
                      {field.name}:
                    </Text>
                    <Text style={classicStyles.description}>{field.value}</Text>
                  </View>
                ))}
            </View>
          )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>
              Professional Experience
            </Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={classicStyles.experienceItem}>
                <View style={classicStyles.jobHeader}>
                  <View>
                    <Text style={classicStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={classicStyles.company}>
                      {exp.company}, {exp.location}
                    </Text>
                  </View>
                  <View>
                    <Text style={classicStyles.dateLocation}>
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </Text>
                  </View>
                </View>
                {exp.description.map((desc, index) => (
                  <Text key={index} style={classicStyles.description}>
                    • {desc}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={classicStyles.experienceItem}>
                <View style={classicStyles.jobHeader}>
                  <View>
                    <Text style={classicStyles.jobTitle}>{edu.degree}</Text>
                    <Text style={classicStyles.company}>
                      {edu.institution}, {edu.location}
                    </Text>
                  </View>
                  <View>
                    <Text style={classicStyles.dateLocation}>
                      {edu.graduationDate}
                    </Text>
                  </View>
                </View>
                {edu.gpa && (
                  <Text style={classicStyles.description}>GPA: {edu.gpa}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>
              Skills & Competencies
            </Text>
            <View style={classicStyles.skillsContainer}>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <View key={category} style={classicStyles.skillCategory}>
                  <Text style={classicStyles.skillCategoryTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                    Skills:
                  </Text>
                  <Text style={classicStyles.skillsList}>
                    {skills.join(", ")}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Dynamic Sections */}
        {data.dynamicSections &&
          data.dynamicSections.map((section) => (
            <View key={section.id} style={classicStyles.section}>
              <Text style={classicStyles.sectionTitle}>{section.title}</Text>
              {section.entries.map((entry) => (
                <View key={entry.id} style={classicStyles.experienceItem}>
                  {/* Render based on section type */}
                  {section.type === "projects" && (
                    <>
                      <Text style={classicStyles.jobTitle}>
                        {entry.title || entry.name}
                      </Text>
                      {entry.technologies && (
                        <Text style={classicStyles.company}>
                          Technologies: {entry.technologies}
                        </Text>
                      )}
                      {entry.date && (
                        <Text style={classicStyles.dateLocation}>
                          {entry.date}
                        </Text>
                      )}
                      {entry.description && (
                        <Text style={classicStyles.description}>
                          {entry.description}
                        </Text>
                      )}
                      {entry.link && (
                        <Text style={classicStyles.description}>
                          Link: {entry.link}
                        </Text>
                      )}
                    </>
                  )}
                  {section.type === "certificates" && (
                    <>
                      <Text style={classicStyles.jobTitle}>
                        {entry.name || entry.title}
                      </Text>
                      {entry.issuer && (
                        <Text style={classicStyles.company}>
                          {entry.issuer}
                        </Text>
                      )}
                      {entry.date && (
                        <Text style={classicStyles.dateLocation}>
                          {entry.date}
                        </Text>
                      )}
                      {entry.description && (
                        <Text style={classicStyles.description}>
                          {entry.description}
                        </Text>
                      )}
                    </>
                  )}
                  {section.type === "languages" && (
                    <>
                      <Text style={classicStyles.jobTitle}>
                        {entry.language || entry.name}
                      </Text>
                      {entry.proficiency && (
                        <Text style={classicStyles.company}>
                          Proficiency: {entry.proficiency}
                        </Text>
                      )}
                    </>
                  )}
                  {/* Generic rendering for other section types */}
                  {section.type !== "projects" &&
                    section.type !== "certificates" &&
                    section.type !== "languages" && (
                      <>
                        <Text style={classicStyles.jobTitle}>
                          {entry.title || entry.name}
                        </Text>
                        {entry.subtitle && (
                          <Text style={classicStyles.company}>
                            {entry.subtitle}
                          </Text>
                        )}
                        {entry.date && (
                          <Text style={classicStyles.dateLocation}>
                            {entry.date}
                          </Text>
                        )}
                        {entry.description && (
                          <Text style={classicStyles.description}>
                            {entry.description}
                          </Text>
                        )}
                        {entry.content && (
                          <Text style={classicStyles.description}>
                            {entry.content}
                          </Text>
                        )}
                      </>
                    )}
                </View>
              ))}
            </View>
          ))}
      </Page>
    </Document>
  );
};

// Preview component for the template selector
export function ClassicTemplatePreview({ data }: ClassicTemplatePDFProps) {
  // Group skills by category
  const skillsByCategory = data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="w-full h-full bg-white p-6 text-xs overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName}
        </h1>
        {data.personalInfo.professionalTitle && (
          <p className="text-gray-600 text-sm italic mb-1">
            {data.personalInfo.professionalTitle}
          </p>
        )}
        <div className="text-gray-600 text-xs space-y-1">
          <p>
            {data.personalInfo.email} | {data.personalInfo.phone}
          </p>
          <p>{data.personalInfo.location}</p>
          {/* Social Links */}
          {(data.personalInfo.linkedin ||
            data.personalInfo.website ||
            data.personalInfo.github ||
            data.personalInfo.twitter ||
            data.personalInfo.portfolio) && (
            <p className="flex flex-wrap justify-center gap-1">
              {data.personalInfo.linkedin && (
                <span>LinkedIn: {data.personalInfo.linkedin}</span>
              )}
              {data.personalInfo.website && (
                <>
                  {data.personalInfo.linkedin && <span>•</span>}
                  <span>Website: {data.personalInfo.website}</span>
                </>
              )}
              {data.personalInfo.portfolio && (
                <>
                  {(data.personalInfo.linkedin ||
                    data.personalInfo.website) && <span>•</span>}
                  <span>Portfolio: {data.personalInfo.portfolio}</span>
                </>
              )}
              {data.personalInfo.github && (
                <>
                  {(data.personalInfo.linkedin ||
                    data.personalInfo.website ||
                    data.personalInfo.portfolio) && <span>•</span>}
                  <span>GitHub: {data.personalInfo.github}</span>
                </>
              )}
              {data.personalInfo.twitter && (
                <>
                  {(data.personalInfo.linkedin ||
                    data.personalInfo.website ||
                    data.personalInfo.portfolio ||
                    data.personalInfo.github) && <span>•</span>}
                  <span>Twitter: {data.personalInfo.twitter}</span>
                </>
              )}
            </p>
          )}
          {/* Additional Personal Info */}
          {(data.personalInfo.nationality || data.personalInfo.dateOfBirth) && (
            <p>
              {data.personalInfo.nationality && (
                <span>Nationality: {data.personalInfo.nationality}</span>
              )}
              {data.personalInfo.dateOfBirth && (
                <>
                  {data.personalInfo.nationality && <span> • </span>}
                  <span>DOB: {data.personalInfo.dateOfBirth}</span>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 text-xs leading-relaxed">
            {data.personalInfo.summary.substring(0, 200)}...
          </p>
        </div>
      )}

      {/* Career Objective */}
      {data.personalInfo.careerObjective && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            CAREER OBJECTIVE
          </h2>
          <p className="text-gray-700 text-xs leading-relaxed">
            {data.personalInfo.careerObjective.substring(0, 150)}...
          </p>
        </div>
      )}

      {/* Custom Fields */}
      {data.customFields &&
        data.customFields.filter((f) => f.enabled && f.value).length > 0 && (
          <div className="mb-4">
            {data.customFields
              .filter((f) => f.enabled && f.value)
              .slice(0, 2)
              .map((field) => (
                <div key={field.id} className="mb-2">
                  <h3 className="font-bold text-gray-900 text-xs">
                    {field.name}:
                  </h3>
                  <p className="text-gray-700 text-xs">
                    {field.value.substring(0, 100)}...
                  </p>
                </div>
              ))}
          </div>
        )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.slice(0, 2).map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-900 text-xs">
                    {exp.jobTitle}
                  </h3>
                  <p className="text-gray-700 text-xs">
                    {exp.company}, {exp.location}
                  </p>
                </div>
                <span className="text-gray-600 text-xs">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="text-xs text-gray-700">
                {exp.description.slice(0, 2).map((desc, index) => (
                  <p key={index} className="mb-1">
                    • {desc.substring(0, 80)}...
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-2">EDUCATION</h2>
            {data.education.slice(0, 1).map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold text-gray-900 text-xs">
                  {edu.degree}
                </h3>
                <p className="text-gray-700 text-xs">
                  {edu.institution}, {edu.location}
                </p>
                <p className="text-gray-600 text-xs">{edu.graduationDate}</p>
                {edu.gpa && (
                  <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-2">
              SKILLS & COMPETENCIES
            </h2>
            <div className="space-y-2">
              {Object.entries(skillsByCategory)
                .slice(0, 2)
                .map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="font-bold text-gray-900 text-xs">
                      {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                      Skills:
                    </h3>
                    <p className="text-gray-700 text-xs">
                      {skills.slice(0, 4).join(", ")}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Sections */}
      {data.dynamicSections &&
        data.dynamicSections.slice(0, 2).map((section) => (
          <div key={section.id} className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2">
              {section.title.toUpperCase()}
            </h2>
            {section.entries.slice(0, 1).map((entry) => (
              <div key={entry.id} className="mb-2">
                <h3 className="font-bold text-gray-900 text-xs">
                  {entry.title || entry.name || entry.language}
                </h3>
                {entry.subtitle && (
                  <p className="text-gray-700 text-xs">{entry.subtitle}</p>
                )}
                {entry.company && (
                  <p className="text-gray-700 text-xs">{entry.company}</p>
                )}
                {entry.issuer && (
                  <p className="text-gray-700 text-xs">{entry.issuer}</p>
                )}
                {entry.proficiency && (
                  <p className="text-gray-700 text-xs">
                    Proficiency: {entry.proficiency}
                  </p>
                )}
                {entry.description && (
                  <p className="text-gray-700 text-xs">
                    {entry.description.substring(0, 80)}...
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
