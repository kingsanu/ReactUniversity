'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
} from '@react-pdf/renderer';
import {
  modernStyles,
  modernColors,
  ModernCoverPage,
  TechProgressBar,
  HolographicGauge,
  GenericPageLayout,
  InfoCard,
} from './ModernPDFComponents';

// Refined Styles for Dense Magazine Layout
const styles = StyleSheet.create({
  // ...modernStyles is imported but we add specific text styles
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: modernColors.primary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: modernColors.gridLines,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: modernColors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 9,
    color: modernColors.textSecondary,
    lineHeight: 1.5,
    marginBottom: 8,
    textAlign: 'justify',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 8,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: modernColors.primary,
    marginTop: 4,
    marginRight: 6,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  compactCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    minWidth: '45%',
  },
});

// Import shared data interface and dummy data (re-declaring for self-containment in this step, 
// usually would import but staying safe with file-write)
export interface LIAReportData {
    user: { id: string; name: string; email: string; };
    reportDate: string;
    overallScore: { percentage: number; percentileRank: number; classification: string; };
    executiveSummary: { highlights: string[]; developmentAreas: string[]; strategicImplications: string; };
    subtests: { name: string; score: number; percentile: number; timeSpent: string; accuracy: number; interpretation: string; }[];
    cognitiveSynergy: string;
    behavioralObservations: { speedAccuracyBalance: string; attentionPattern: string; problemSolvingApproach: string; stressResponse: string; };
    workStyleAnalysis: { workPreference: string; decisionMaking: string; communicationStyle: string; leadershipPotential: string; teamDynamics: string; };
    environmentalFit: string;
    careerRecommendations: { roles: { title: string; matchScore: number; description: string; }[]; industries: string[]; skillsGap: string[]; motivators: string[]; };
    learningDevelopment: { learningStyle: string; agilityScore: number; recommendedCourses: string[]; actionPlan: { period: string; action: string; }[]; coachingRecommended: boolean; };
    summary: { keyTakeaways: string[]; successFactors: string[]; riskFactors: string[]; nextAssessmentDate: string; methodology: string; };
}

export const dummyLIAData: LIAReportData = {
    user: { id: 'USR-2026-0107', name: 'Alex Johnson', email: 'alex.johnson@example.com' },
    reportDate: new Date().toISOString(),
    overallScore: { percentage: 78.5, percentileRank: 82, classification: 'High Potential' },
    executiveSummary: {
      highlights: [
        'Exceptional processing speed (Top 15%) indicates an ability to handle high-velocity data streams and make rapid preliminary judgments.', 
        'Strong pattern recognition ideal for analytics, suggesting a natural aptitude for identifying market trends or systemic anomalies.', 
        'Robust working memory capacity allows for the simultaneous manipulation of multiple complex variables without cognitive overload.'
      ],
      developmentAreas: [
        'Spatial reasoning requires targeted practice; 3D visualization tasks may initially take longer to process.', 
        'Verbal logic consistency under pressure drops slightly, suggesting a need for structured communication frameworks during crisis moments.'
      ],
      strategicImplications: "Alex's profile suggests a candidate who is ready for high-impact individual contributor roles in data-heavy domains. While their raw cognitive throughput is elite, their influence skills and strategic communication will be the primary lever for career advancement. Organizations should position Alex in roles where 'getting the right answer' is more critical than 'selling the answer' in the short term, while providing mentorship on soft-skill influence."
    },
    subtests: [
      { name: 'Feature Detection', score: 85, percentile: 88, timeSpent: '04:32', accuracy: 90, interpretation: 'Rapid anomaly identification capabilities. Best utilized in quality assurance, fraud detection, or systems monitoring roles where vigilance is key.' },
      { name: 'Verbal Reasoning', score: 75, percentile: 72, timeSpent: '08:45', accuracy: 80, interpretation: 'Strong logical argument evaluation. Can deconstruct complex texts effectively, though may benefit from "bottom-line-up-front" training.' },
      { name: 'Working Memory', score: 82, percentile: 80, timeSpent: '06:20', accuracy: 85, interpretation: 'High information retention. Capable of mental math and holding multi-step instructions without written reference.' },
      { name: 'Numeric Speed', score: 88, percentile: 91, timeSpent: '05:15', accuracy: 92, interpretation: 'Precise quantitative processing. Demonstrates natural affinity for financial modeling and statistical analysis.' },
      { name: 'Spatial Orientation', score: 72, percentile: 68, timeSpent: '09:50', accuracy: 75, interpretation: 'Moderate 3D visualization skills. May require digital tools or physical models to visualize complex architectural or mechanical structures.' },
    ],
    cognitiveSynergy: "The combination of high 'Numeric Speed' and 'Working Memory' creates a powerful 'Real-time Analyst' profile. This synergy allows Alex to not only crunch numbers quickly but also contextually store intermediate results to form a coherent bigger picture. This is rarely seen in candidates who specialize only in one or the other.",
    behavioralObservations: {
      speedAccuracyBalance: 'Prioritizes accuracy slightly over speed, ensuring high-quality output. Very deliberate interaction style. In scenarios requiring "80/20" decisions, Alex may struggle to let go of perfectionism.',
      attentionPattern: 'Sustained focus maintained throughout 45-minute session without performance dips. This indicates high mental stamina and suitability for long, deep-work sessions (e.g., coding, auditing).',
      problemSolvingApproach: 'Methodical decomposition of complex problems rather than intuitive leaps. Alex breaks down challenges into constituent parts, solves them serially, and reconstructs the solution.',
      stressResponse: 'Maintains composure; response time increases slightly but error rate remains stable under time pressure. Likely to become quieter and more focused during crises rather than agitated.'
    },
    workStyleAnalysis: {
      workPreference: 'Thrives in structured, data-rich environments. Prefers clear objectives over ambiguity. Struggles in "blank slate" creative roles without defined constraints.',
      decisionMaking: 'Evidence-based. Likely to delay decisions to gather complete data sets. May need a "bias for action" nudge in low-stakes situations.',
      communicationStyle: 'Concise and factual. May need encouragement to share speculative ideas or brainstorm. Tends to communicate in bullet points and data tables.',
      leadershipPotential: 'Leading by example through technical competence. Potential for operational leadership. Will command respect through subject matter expertise rather than charisma.',
      teamDynamics: 'Steadying influence in chaotic teams. Provides structure and rigorous validation. Often plays the role of the "Devil\'s Advocate" to ground overly optimistic plans.'
    },
    environmentalFit: "Ideal fit for mature organizations with established processes or R&D departments. May experience friction in early-stage startups where 'chaos engineering' is the norm. Best managed by setting clear KPIs and allowing autonomy in execution.",
    careerRecommendations: {
      roles: [
        { title: 'Data Scientist', matchScore: 94, description: 'Perfect alignment with pattern recognition and numeric speed. The role rewards the exact mix of accuracy and memory Alex possesses.' },
        { title: 'Systems Analyst', matchScore: 89, description: 'Leverages systematic problem-solving approach to audit and improve complex technical workflows.' },
        { title: 'Financial Modeler', matchScore: 86, description: 'Utilizes high accuracy and working memory to construct and maintain error-free financial projections.' },
        { title: 'Quality Assurance Lead', matchScore: 83, description: 'Benefit from attention to detail and anomaly detection. A natural fit for finding the "needle in the haystack".' },
        { title: 'Logistics Coordinator', matchScore: 80, description: 'Requires rapid processing and organizational skills to manage complex, moving supply chains.' },
      ],
      industries: ['FinTech', 'Cybersecurity', 'Logistics', 'Biotech', 'Actuarial Science'],
      skillsGap: ['Strategic storytelling (translating data to vision)', 'Cross-functional negotiation', 'Abstract creative thinking without constraints'],
      motivators: ['Technical Mastery', 'Order & Stability', 'Measurable Impact', 'Clear Progression Metrics']
    },
    learningDevelopment: {
      learningStyle: 'Logical-Mathematical: Learns best through classifying, categorizing, and thinking abstractly about patterns. Prefer case studies and data sets over theoretical lectures.',
      agilityScore: 82,
      recommendedCourses: ['Advanced Predictive Modeling (Coursera)', 'Strategic Communication for Analysts (Harvard)', 'Agile Project Management (PMI)'],
      actionPlan: [
        { period: 'Month 1: Foundation', action: 'Complete "Spatial Reasoning" module to address gap. focus on mental rotation exercises. Establish baseline metrics for current role.' },
        { period: 'Month 2: Application', action: 'Lead a small data-cleanup project to apply precision skills. Present findings to a non-technical stakeholder to practice translation.' },
        { period: 'Month 3: Expansion', action: 'Mentor a junior peer to develop communication softness. Take ownership of one "ambiguous" project to stretch comfort zone.' }
      ],
      coachingRecommended: true
    },
    summary: {
      keyTakeaways: ['High analytical potential confirmed.', 'Ready for specialist individual contributor roles.', 'Leadership path requires soft-skills focus.'],
      successFactors: ['Technical precision', 'Reliability under pressure', 'Deep focus capacity'],
      riskFactors: ['Analysis paralysis', 'Resistance to rapid, ambiguous change'],
      nextAssessmentDate: 'July 2026',
      methodology: "This assessment utilizes the TIMCARE Cognitive Battery (TCB-v4), comprised of adaptive subtests normalized against a global cohort of 50,000 professionals. Reliability coefficient: 0.92. Validity coefficient: 0.88."
    }
};

// Radar Chart (Same as before but ensures correct imports)
const RadarChart = ({ data }: { data: any[] }) => {
  const size = 120;
  const center = size / 2;
  const radius = 45;
  const stats = data.map(d => d.score);
  
  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 100) * radius;
    return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
  };
  const points = stats.map((val, i) => getPoint(val, i, stats.length)).join(' ');
  const fullPoints = stats.map((_, i) => getPoint(100, i, stats.length)).join(' ');

  return (
    <Svg width={size} height={size}>
      <Path d={`M${fullPoints} Z`} stroke="#cbd5e1" strokeWidth="1" fill="#f1f5f9" />
      <Path d={`M${stats.map((_, i) => getPoint(50, i, stats.length)).join(' ')} Z`} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" fill="none" />
      <Path d={`M${points} Z`} stroke={modernColors.primary} strokeWidth="2" fill={modernColors.primary} opacity={0.2} />
      {stats.map((val, i) => {
        const [cx, cy] = getPoint(val, i, stats.length).split(',');
        return <Circle key={i} cx={cx} cy={cy} r="3" fill={modernColors.primary} />;
      })}
    </Svg>
  );
};

// Sidebar Content Component
const SidebarContent = ({ title, summary }: { title: string; summary?: string }) => (
    <View>
        <Text style={modernStyles.heading2}>{title}</Text>
        {summary && <Text style={modernStyles.paragraph}>{summary}</Text>}
        
        <View style={{ marginTop: 24, padding: 12, backgroundColor: '#e0e7ff', borderRadius: 8 }}>
           <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: modernColors.primary, marginBottom: 4 }}>QUICK INSIGHT</Text>
           <Text style={{ fontSize: 9, color: modernColors.textPrimary, fontStyle: 'italic' }}>
             "Consistency is the hallmark of professional excellence."
           </Text>
        </View>
    </View>
);

const LIAReportPDF: React.FC<{ data?: LIAReportData }> = ({ data = dummyLIAData }) => {
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document>
      {/* 1. Cover Page (Full bleed) */}
      <Page size="A4" style={{ backgroundColor: modernColors.headerBg }}>
        <ModernCoverPage
          title="Labor Intelligence Analysis"
          subtitle="TIMCARE ANALYTICS"
          userName={data.user.name}
          date={formatDate(data.reportDate)}
        />
      </Page>

      {/* 2. Executive Summary - The Magazine Layout Starts */}
      <GenericPageLayout 
        pageNum={2} 
        totalPages={8}
        sidebarContent={
            <View>
                <SidebarContent title="EXECUTIVE SUMMARY" summary="High-level overview of performance metrics and classification." />
                <View style={{ marginTop: 40, alignItems: 'center' }}>
                    <HolographicGauge score={data.overallScore.percentage} label="Overall" />
                </View>
                <View style={{ marginTop: 40 }}>
                     <Text style={styles.subHeader}>Assessment Metadata</Text>
                     <Text style={{ fontSize: 9, color: modernColors.textSecondary, marginBottom: 4 }}>• Duration: 45 mins</Text>
                     <Text style={{ fontSize: 9, color: modernColors.textSecondary, marginBottom: 4 }}>• Modules: 5/5 Completed</Text>
                     <Text style={{ fontSize: 9, color: modernColors.textSecondary, marginBottom: 4 }}>• Norm Group: Global Tech</Text>
                </View>
            </View>
        }
      >
        <Text style={modernStyles.heading1}>Performance Overview</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
             <View style={{ paddingHorizontal: 12, paddingVertical: 4, backgroundColor: modernColors.highlight, borderRadius: 12 }}>
                 <Text style={{ fontSize: 10, color: modernColors.success, fontFamily: 'Helvetica-Bold' }}>{data.overallScore.classification.toUpperCase()}</Text>
             </View>
             <View style={{ paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#f1f5f9', borderRadius: 12 }}>
                 <Text style={{ fontSize: 10, color: modernColors.textSecondary }}>Rank: Top {100 - data.overallScore.percentileRank}%</Text>
             </View>
        </View>

        <View style={styles.statGrid}>
             <InfoCard title="Percentile" value={`${data.overallScore.percentileRank}th`} subtext="Global Cohort" />
             <InfoCard title="Accuracy" value="92%" subtext="High Precision" />
             <InfoCard title="Speed" value="88/100" subtext="Fast Processing" />
        </View>

        <Text style={styles.sectionHeader}>Executive Highlights</Text>
        <View style={modernStyles.card}>
            {data.executiveSummary.highlights.map((h, i) => (
                <View key={i} style={styles.bulletItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.bodyText}>{h}</Text>
                </View>
            ))}
        </View>

        <Text style={styles.sectionHeader}>Strategic Analysis</Text>
        <Text style={styles.bodyText}>{data.executiveSummary.strategicImplications}</Text>

        <View style={{ marginTop: 16 }}>
             <Text style={styles.sectionHeader}>Growth Areas</Text>
             <View style={modernStyles.card}>
                  {data.executiveSummary.developmentAreas.map((h, i) => (
                     <View key={i} style={styles.bulletItem}>
                         <View style={{ ...styles.bulletPoint, backgroundColor: '#f59e0b' }} />
                         <Text style={styles.bodyText}>{h}</Text>
                     </View>
                 ))}
             </View>
        </View>
      </GenericPageLayout>

      {/* 3. Cognitive Profile */}
      <GenericPageLayout
         pageNum={3}
         totalPages={8}
         sidebarContent={
             <View>
                 <SidebarContent title="COGNITIVE PROFILE" summary="Detailed breakdown of 5 core cognitive dimensions." />
                 <View style={{ marginTop: 24, alignItems: 'center' }}>
                     <RadarChart data={data.subtests} />
                     <Text style={{ fontSize: 8, color: modernColors.textSecondary, marginTop: 8 }}>Profile Shape</Text>
                 </View>
             </View>
         }
      >
          <Text style={modernStyles.heading1}>Detailed Dimensions</Text>
          <Text style={styles.bodyText}>Analysis of specific cognitive sub-functions relative to the global norm.</Text>
          
          <View style={{ marginTop: 16 }}>
              {data.subtests.map((sub, i) => (
                  <View key={i} style={modernStyles.card}>
                      <TechProgressBar label={sub.name} value={sub.score} color={i % 2 === 0 ? modernColors.primary : modernColors.secondary} />
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                          <Text style={{ fontSize: 8, color: modernColors.textSecondary }}>Percentile: <Text style={{ fontFamily: 'Helvetica-Bold' }}>{sub.percentile}th</Text></Text>
                          <Text style={{ fontSize: 8, color: modernColors.textSecondary }}>Time: {sub.timeSpent}</Text>
                      </View>
                      <Text style={{ ...styles.bodyText, marginTop: 6, fontStyle: 'italic', color: '#64748b' }}>{sub.interpretation}</Text>
                  </View>
              ))}
          </View>

          <Text style={{ ...styles.sectionHeader, marginTop: 16 }}>Cognitive Synergy</Text>
          <Text style={styles.bodyText}>{data.cognitiveSynergy}</Text>
      </GenericPageLayout>

      {/* 4. Behavioral Observations */}
      <GenericPageLayout
        pageNum={4}
        totalPages={8}
        sidebarContent={<SidebarContent title="BEHAVIORAL INSIGHTS" summary="Pattern analysis of test-taking approach and stress response." />}
      >
         <Text style={modernStyles.heading1}>Behavioral Patterns</Text>
         <Text style={styles.bodyText}>Observed behaviors during the assessment provide a window into real-world work habits.</Text>
         
         <View style={{ marginTop: 16 }}>
             <View style={modernStyles.card}>
                 <Text style={styles.subHeader}>Speed vs Accuracy Trade-off</Text>
                 <Text style={styles.bodyText}>{data.behavioralObservations.speedAccuracyBalance}</Text>
             </View>
             
             <View style={modernStyles.card}>
                 <Text style={styles.subHeader}>Response to Stress & Time Pressure</Text>
                 <Text style={styles.bodyText}>{data.behavioralObservations.stressResponse}</Text>
             </View>

             <View style={modernStyles.card}>
                 <Text style={styles.subHeader}>Attention Span & Focus</Text>
                 <Text style={styles.bodyText}>{data.behavioralObservations.attentionPattern}</Text>
             </View>
             
             <View style={modernStyles.card}>
                 <Text style={styles.subHeader}>Problem Solving Methodology</Text>
                 <Text style={styles.bodyText}>{data.behavioralObservations.problemSolvingApproach}</Text>
             </View>
         </View>

         <Text style={{ ...styles.sectionHeader, marginTop: 8 }}>Workplace Implication</Text>
         <Text style={styles.bodyText}>
            These patterns suggest a candidate who will prioritize quality over quantity. They are unlikely to cut corners even when pressured, which is a significant asset in compliance or safety-critical roles, but may require management intervention during 'crunch' periods where speed is paramount.
         </Text>
      </GenericPageLayout>

      {/* 5. Work Style Analysis */}
      <GenericPageLayout
        pageNum={5}
        totalPages={8}
         sidebarContent={<SidebarContent title="WORK STYLE" summary="AI-driven prediction of professional operating model." />}
      >
          <Text style={modernStyles.heading1}>Professional DNA</Text>
          
          <View style={{ ...modernStyles.card, borderLeftWidth: 4, borderLeftColor: modernColors.primary }}>
               <Text style={styles.subHeader}>Work Environment Preference</Text>
               <Text style={styles.bodyText}>{data.workStyleAnalysis.workPreference}</Text>
          </View>

          <View style={{ ...modernStyles.card, borderLeftWidth: 4, borderLeftColor: modernColors.secondary }}>
               <Text style={styles.subHeader}>Team Dynamics & Role</Text>
               <Text style={styles.bodyText}>{data.workStyleAnalysis.teamDynamics}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
             <View style={{ ...styles.compactCard, backgroundColor: '#fff' }}>
                 <Text style={styles.subHeader}>Decision Making</Text>
                 <Text style={styles.bodyText}>{data.workStyleAnalysis.decisionMaking}</Text>
             </View>
             <View style={{ ...styles.compactCard, backgroundColor: '#fff' }}>
                 <Text style={styles.subHeader}>Communication</Text>
                 <Text style={styles.bodyText}>{data.workStyleAnalysis.communicationStyle}</Text>
             </View>
          </View>
          
          <View style={{ marginTop: 24 }}>
               <Text style={styles.sectionHeader}>Leadership Potential</Text>
               <Text style={styles.bodyText}>{data.workStyleAnalysis.leadershipPotential}</Text>
               
               <Text style={{ ...styles.sectionHeader, marginTop: 16 }}>Environmental Fit Analysis</Text>
               <Text style={styles.bodyText}>{data.environmentalFit}</Text>
          </View>
      </GenericPageLayout>

       {/* 6. Career Recommendations */}
      <GenericPageLayout
         pageNum={6}
         totalPages={8}
         sidebarContent={
            <View>
                <SidebarContent title="CAREER PATHWAYS" summary="Optimal role matches based on cognitive fit." />
                <View style={{ marginTop: 24 }}>
                     <Text style={styles.subHeader}>Target Industries</Text>
                     {data.careerRecommendations.industries.map((ind, i) => (
                         <Text key={i} style={{ fontSize: 9, color: modernColors.textSecondary, marginBottom: 4 }}>• {ind}</Text>
                     ))}
                     
                     <Text style={{ ...styles.subHeader, marginTop: 24 }}>Key Motivators</Text>
                     {data.careerRecommendations.motivators.map((mot, i) => (
                         <Text key={i} style={{ fontSize: 9, color: modernColors.textSecondary, marginBottom: 4 }}>• {mot}</Text>
                     ))}
                </View>
            </View>
         }
      >
          <Text style={modernStyles.heading1}>Career Alignment</Text>
          <Text style={styles.bodyText}>Roles where your cognitive profile provides a competitive advantage.</Text>

          <View style={{ marginTop: 16 }}>
               {data.careerRecommendations.roles.map((role, i) => (
                   <View key={i} style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center', backgroundColor: i===0 ? modernColors.highlight : 'transparent', padding: 8, borderRadius: 8 }}>
                       <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: i===0 ? modernColors.primary : '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                           <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: i===0 ? 'white' : modernColors.textSecondary }}>{role.matchScore}</Text>
                       </View>
                       <View style={{ flex: 1 }}>
                           <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: modernColors.textPrimary }}>{role.title}</Text>
                           <Text style={{ fontSize: 8, color: modernColors.textSecondary }}>{role.description}</Text>
                       </View>
                   </View>
               ))}
          </View>

          <Text style={{ ...styles.sectionHeader, marginTop: 16 }}>Skills Gap Analysis</Text>
          <Text style={{ ...styles.bodyText, marginBottom: 12 }}>To reach the next tier of seniority, the following areas require development:</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
               {data.careerRecommendations.skillsGap.map((s, i) => (
                   <View key={i} style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fee2e2', borderRadius: 4, width: '48%' }}>
                       <Text style={{ fontSize: 9, color: '#991b1b' }}>{s}</Text>
                   </View>
               ))}
          </View>
      </GenericPageLayout>

      {/* 7. Learning Plan */}
       <GenericPageLayout
         pageNum={7}
         totalPages={8}
         sidebarContent={<SidebarContent title="DEVELOPMENT" summary="Strategic roadmap for skill acquisition." />}
      >
           <Text style={modernStyles.heading1}>Learning Roadmap</Text>
           
           <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                <InfoCard title="Agility Score" value={data.learningDevelopment.agilityScore.toString()} subtext="High Adaptability" />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                     <Text style={styles.subHeader}>Preferred Style</Text>
                     <Text style={styles.bodyText}>{data.learningDevelopment.learningStyle}</Text>
                </View>
           </View>
           
           <Text style={styles.sectionHeader}>Tactical Plan (30-60-90)</Text>
           {data.learningDevelopment.actionPlan.map((plan, i) => (
               <View key={i} style={{ ...modernStyles.card, borderLeftWidth: 4, borderLeftColor: i===0?modernColors.success:i===1?modernColors.warning:modernColors.error }}>
                   <Text style={styles.subHeader}>{plan.period}</Text>
                   <Text style={styles.bodyText}>{plan.action}</Text>
               </View>
           ))}
           
           <Text style={{ ...styles.sectionHeader, marginTop: 16 }}>Recommended Resources</Text>
           {data.learningDevelopment.recommendedCourses.map((c, i) => (
               <View key={i} style={{ flexDirection: 'row', marginBottom: 6 }}>
                   <Text style={{ fontSize: 9, color: modernColors.primary, fontFamily: 'Helvetica-Bold', marginRight: 4 }}>[COURSE]</Text>
                   <Text style={styles.bodyText}>{c}</Text>
               </View>
           ))}
      </GenericPageLayout>
      
      {/* 8. Summary */}
       <GenericPageLayout
         pageNum={8}
         totalPages={8}
         sidebarContent={<SidebarContent title="CONCLUSION" summary="Final verdict and next steps." />}
      >
           <Text style={modernStyles.heading1}>Assessment Verdict</Text>
           
           <View style={{ marginTop: 20 }}>
               <Text style={styles.sectionHeader}>Key Takeaways</Text>
               {data.summary.keyTakeaways.map((t, i) => (
                   <View key={i} style={{ marginBottom: 8, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: modernColors.primary }}>
                       <Text style={styles.bodyText}>{t}</Text>
                   </View>
               ))}
           </View>
            
           <Text style={{ ...styles.sectionHeader, marginTop: 24 }}>Success & Risk Profile</Text>
           <View style={{ flexDirection: 'row', gap: 16 }}>
               <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 9, color: modernColors.success, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>SUCCESS FACTORS</Text>
                    {data.summary.successFactors.map((s, i) => (
                        <Text key={i} style={{ fontSize: 9, color: modernColors.textSecondary, marginBottom: 2 }}>• {s}</Text>
                    ))}
               </View>
               <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 9, color: modernColors.error, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>RISK FACTORS</Text>
                    {data.summary.riskFactors.map((s, i) => (
                        <Text key={i} style={{ fontSize: 9, color: modernColors.textSecondary, marginBottom: 2 }}>• {s}</Text>
                    ))}
               </View>
           </View>

           <View style={{ marginTop: 24, padding: 24, backgroundColor: modernColors.highlight, borderRadius: 12, alignItems: 'center' }}>
               <Text style={styles.subHeader}>NEXT ASSESSMENT</Text>
               <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: modernColors.success }}>{data.summary.nextAssessmentDate}</Text>
               <Text style={{ fontSize: 9, color: modernColors.textSecondary, textAlign: 'center', marginTop: 8 }}>
                  Scheduled re-evaluation to measure progress on development goals.
               </Text>
           </View>
           
           <View style={{ marginTop: 'auto', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
               <Text style={{ fontSize: 8, color: '#94a3b8', textAlign: 'justify', marginBottom: 8 }}>
                   {data.summary.methodology}
               </Text>
               <Text style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center' }}>© 2026 TimCare AI Analytics. All rights reserved.</Text>
           </View>
      </GenericPageLayout>
    </Document>
  );
};

export default LIAReportPDF;
