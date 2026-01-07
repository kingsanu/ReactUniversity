'use client';

import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  G,
  LinearGradient,
  Stop,
  Rect,
  Circle as SvgCircle,
  Defs,
  Page,
} from '@react-pdf/renderer';

// Standard fonts
const primaryFont = 'Helvetica';
const primaryFontBold = 'Helvetica-Bold';

// Color Palette - Extended for Richer UI
export const modernColors = {
  primary: '#4f46e5', // Indigo 600
  secondary: '#0ea5e9', // Sky 500
  accent: '#a855f7', // Purple 500
  dark: '#0f172a', // Slate 900
  textPrimary: '#1e293b', // Slate 800
  textSecondary: '#64748b', // Slate 500
  highlight: '#f0fdf4', // Green 50
  warning: '#fffbeb', // Amber 50
  error: '#fef2f2', // Red 50
  success: '#16a34a', // Green 600
  gridLines: '#e2e8f0', // Slate 200
  sidebarBg: '#f8fafc', // Slate 50
  cardBg: '#ffffff',
  headerBg: '#1e1b4b', // Indigo 950
};

export const modernStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: primaryFont,
    color: modernColors.textPrimary,
    flexDirection: 'row', // Enable side-by-side layout by default
  },
  sidebar: {
     width: '28%',
     backgroundColor: modernColors.sidebarBg,
     height: '100%',
     padding: 24,
     borderRightWidth: 1,
     borderRightColor: '#e2e8f0',
  },
  mainContent: {
     flex: 1,
     padding: 32,
     paddingTop: 40,
  },
  sidebarFooter: {
     position: 'absolute',
     bottom: 24,
     left: 24,
     right: 24,
  },
  heading1: {
     fontSize: 24,
     fontFamily: primaryFontBold,
     color: modernColors.dark,
     marginBottom: 8,
     lineHeight: 1.2,
  },
  heading2: {
     fontSize: 16,
     fontFamily: primaryFontBold,
     color: modernColors.primary,
     marginBottom: 12,
     textTransform: 'uppercase',
     letterSpacing: 1,
  },
  heading3: {
     fontSize: 12,
     fontFamily: primaryFontBold,
     color: modernColors.textPrimary,
     marginBottom: 6,
  },
  paragraph: {
     fontSize: 10,
     color: modernColors.textSecondary,
     lineHeight: 1.6,
     marginBottom: 12,
     textAlign: 'justify',
  },
  card: {
     backgroundColor: 'white',
     borderRadius: 12,
     padding: 16,
     marginBottom: 16,
     borderWidth: 1,
     borderColor: '#f1f5f9', // Slate 100
     // boxShadow not fully supported in react-pdf, removed to avoid confusion
  },
  iconBox: {
     width: 32,
     height: 32,
     borderRadius: 8,
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 8,
  }
});

// --- Decorative Components ---

export const CircuitPattern = ({ opacity = 0.1 }: { opacity?: number }) => (
   <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
      {/* Abstract Circuit Lines */}
      <Path d="M0,50 L50,50 L50,100" stroke={modernColors.primary} strokeWidth="1" fill="none" opacity={opacity} />
      <Path d="M100,0 L100,150 L150,150" stroke={modernColors.secondary} strokeWidth="1" fill="none" opacity={opacity} />
      <Circle cx="50" cy="50" r="3" fill={modernColors.primary} opacity={opacity * 2} />
      <Circle cx="150" cy="150" r="3" fill={modernColors.secondary} opacity={opacity * 2} />
      {/* Grid Dots */}
      {[...Array(20)].map((_, i) => (
         <Circle key={`d-${i}`} cx={Math.random() * 500} cy={Math.random() * 800} r="1" fill="#94a3b8" opacity={opacity} />
      ))}
   </Svg>
);

export const SidebarDecoration = () => (
   <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, overflow: 'hidden' }}>
      <Svg width="100%" height="200" viewBox="0 0 200 200" preserveAspectRatio="none">
         <Defs>
            <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
               <Stop offset="0%" stopColor="#f8fafc" stopOpacity="0" />
               <Stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.5" />
            </LinearGradient>
         </Defs>
         <Rect x="0" y="0" width="200" height="200" fill="url(#grad1)" />
         <Path d="M0,200 L200,100 L200,200 Z" fill={modernColors.primary} opacity="0.05" />
      </Svg>
   </View>
);

// --- Layout Components ---

export const GenericPageLayout = ({ 
  children, 
  sidebarContent, 
  pageNum, 
  totalPages 
}: { 
  children: React.ReactNode; 
  sidebarContent: React.ReactNode; 
  pageNum: number; 
  totalPages: number; 
}) => (
  <Page size="A4" style={modernStyles.page}>
     {/* Sidebar */}
     <View style={modernStyles.sidebar}>
        <SidebarDecoration />
        <View style={{ marginBottom: 32 }}>
           {/* Logo Placeholder */}
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: modernColors.primary }} />
              <Text style={{ fontSize: 14, fontFamily: primaryFontBold, color: modernColors.dark }}>TimCare</Text>
           </View>
        </View>
        
        {sidebarContent}

        <View style={modernStyles.sidebarFooter}>
           <Text style={{ fontSize: 8, color: modernColors.textSecondary, marginBottom: 4 }}>Report ID: TC-GEN-001</Text>
           <Text style={{ fontSize: 8, color: modernColors.textSecondary }}>Page {pageNum} of {totalPages}</Text>
        </View>
     </View>

     {/* Main Content */}
     <View style={modernStyles.mainContent}>
        <CircuitPattern opacity={0.03} />
        {children}
     </View>
  </Page>
);

// --- Content Components ---

export const HolographicGauge = ({ score, label, color = modernColors.primary }: { score: number; label: string; color?: string }) => {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  
  // Calculate end point of the arc
  const angle = (score / 100) * 360;
  // Handle full circle case to avoid drawing nothing
  const endAngle = angle >= 360 ? 359.9 : angle; 
  // SVG arcs usually start from 3 o'clock (0 degrees), we want to start from 12 o'clock (-90 degrees)
  // But calculating manually:
  const startRad = - Math.PI / 2; // -90 deg
  const endRad = startRad + (endAngle * Math.PI / 180);
  
  const x1 = size / 2 + radius * Math.cos(startRad);
  const y1 = size / 2 + radius * Math.sin(startRad);
  const x2 = size / 2 + radius * Math.cos(endRad);
  const y2 = size / 2 + radius * Math.sin(endRad);
  
  const largeArcFlag = endAngle > 180 ? 1 : 0;
  
  const pathData = [
    "M", x1, y1,
    "A", radius, radius, 0, largeArcFlag, 1, x2, y2
  ].join(" ");

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Path
           d={`M ${size/2},${strokeWidth/2} A ${radius},${radius} 0 1 1 ${size/2},${size-strokeWidth/2} A ${radius},${radius} 0 1 1 ${size/2},${strokeWidth/2}`}
           stroke="#e2e8f0"
           strokeWidth={strokeWidth}
           fill="none"
        />
        {/* Progress */}
         <Path
           d={pathData}
           stroke={color}
           strokeWidth={strokeWidth}
           fill="none"
           strokeLinecap="round"
        />
      </Svg>
      {/* Text Center */}
      <View style={{ position: 'absolute', alignItems: 'center' }}>
         <Text style={{ fontSize: 28, fontFamily: primaryFontBold, color: modernColors.dark }}>{score}</Text>
         <Text style={{ fontSize: 8, color: modernColors.textSecondary, textTransform: 'uppercase' }}>{label}</Text>
      </View>
    </View>
  );
};

export const TechProgressBar = ({ label, value, color = modernColors.primary }: { label: string; value: number; color?: string }) => (
  <View style={{ marginBottom: 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{ fontSize: 10, fontFamily: primaryFontBold, color: modernColors.textPrimary }}>{label}</Text>
      <Text style={{ fontSize: 10, fontFamily: primaryFontBold, color: color }}>{value}%</Text>
    </View>
    <View style={{ height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
      <View style={{ width: `${value}%`, backgroundColor: color, height: '100%', borderRadius: 3 }} />
    </View>
  </View>
);

export const InfoCard = ({ title, value, icon, subtext }: { title: string; value: string; icon?: string; subtext?: string }) => (
   <View style={modernStyles.card}>
      <Text style={{ fontSize: 9, color: modernColors.textSecondary, marginBottom: 4 }}>{title}</Text>
      <Text style={{ fontSize: 18, fontFamily: primaryFontBold, color: modernColors.dark, marginBottom: 2 }}>{value}</Text>
      {subtext && <Text style={{ fontSize: 8, color: modernColors.success }}>{subtext}</Text>}
   </View>
);

export const ModernCoverPage = ({ title, subtitle, userName, date }: { title: string; subtitle: string; userName: string; date: string }) => (
  <View style={{ flex: 1, backgroundColor: modernColors.headerBg, padding: 0 }}>
    {/* Geometric Background */}
    <Svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
       <Defs>
          <LinearGradient id="coverGrad" x1="0" y1="0" x2="100%" y2="100%">
             <Stop offset="0%" stopColor="#1e1b4b" />
             <Stop offset="100%" stopColor="#312e81" />
          </LinearGradient>
       </Defs>
       <Rect x="0" y="0" width="100%" height="100%" fill="url(#coverGrad)" />
       <Circle cx="100%" cy="0" r="300" fill="#4338ca" opacity="0.1" />
       <Circle cx="0" cy="100%" r="200" fill="#4338ca" opacity="0.1" />
       <Path d="M0,0 L600,600" stroke="#6366f1" strokeWidth="1" opacity="0.1" />
       <Path d="M600,0 L0,600" stroke="#6366f1" strokeWidth="1" opacity="0.1" />
    </Svg>

    <View style={{ flex: 1, padding: 60, justifyContent: 'center' }}>
       <View style={{ marginBottom: 40 }}>
          <Text style={{ fontSize: 12, color: '#a5b4fc', letterSpacing: 2, marginBottom: 12 }}>TIMCARE ANALYTICS</Text>
          <Text style={{ fontSize: 48, fontFamily: primaryFontBold, color: 'white', lineHeight: 1.1 }}>{title}</Text>
          <View style={{ width: 60, height: 4, backgroundColor: modernColors.accent, marginTop: 24 }} />
       </View>

       <View style={{ marginTop: 'auto' }}>
          <Text style={{ fontSize: 14, color: '#e0e7ff', marginBottom: 8 }}>PREPARED FOR</Text>
          <Text style={{ fontSize: 24, fontFamily: primaryFontBold, color: 'white', marginBottom: 32 }}>{userName}</Text>
          
          <View style={{ flexDirection: 'row', gap: 40 }}>
             <View>
                <Text style={{ fontSize: 10, color: '#a5b4fc', marginBottom: 4 }}>DATE</Text>
                <Text style={{ fontSize: 12, color: 'white' }}>{date}</Text>
             </View>
             <View>
                <Text style={{ fontSize: 10, color: '#a5b4fc', marginBottom: 4 }}>REPORT ID</Text>
                <Text style={{ fontSize: 12, color: 'white' }}>TC-{Math.floor(Math.random()*10000)}</Text>
             </View>
          </View>
       </View>
    </View>
  </View>
);

const Circle = ({ cx, cy, r, fill, opacity }: any) => (
   <SvgCircle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />
);
