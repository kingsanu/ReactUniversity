import React from "react";
import { Glasses, Settings, Calculator, Puzzle, Timer } from "lucide-react";

// Mock Data for Visual Dev
const mockData = {
  candidateName: "Maria Paula Mendoza",
  date: "Septiembre 23/2025",
  executiveSummary:
    "Maria Paula shows two exceptional cognitive markers: Detection of Characteristics = 96% (Exceptional) and Spatial Orientation / Visualization = Exceptional (78%). Her PCA shows high Influence, a service orientation, a strong concern for quality, and low Dominance. In simple terms: she has a keen eye for detail, can visualize in 2D/3D with ease, and relates very well to others — making her an ideal candidate for Architecture, Industrial Design, and programs that combine design with technical precision.",
  steps: [
    {
      number: 1,
      text: "Translate LIA and PCA results into clear study recommendations.",
    },
    {
      number: 2,
      text: "Prioritize majors (Top-10) with cognitive behavioral justification.",
    },
    {
      number: 3,
      text: "Provide an exploration and decision plan (0–12 months) for a student.",
    },
    {
      number: 4,
      text: "Deliver an immediate operational plan (8 weeks) and tracking KPIs.",
    },
    {
      number: 5,
      text: "Map recommended universities and facilitate immediate application actions.",
    },
  ],
};

export default function NexaValuesPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col items-center gap-8 print:py-0 print:gap-0 print:bg-white">
      <style type="text/css" media="print">
        {`
           @page { size: A4; margin: 0mm; }
           body { margin: 0px; }
        `}
      </style>
      {/* --- PAGE 1: EXECUTIVE SUMMARY --- */}
      <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden shadow-none print:shadow-none print:w-[210mm] print:h-[297mm] print:break-after-page print:overflow-hidden sidebar-print-page">
        {/* Reference Overlay */}
        {/* <div className="absolute inset-0 z-50 hidden  opacity-50 pointer-events-none print:hidden">
          <img
            src="/image.png"
            alt="Reference Design"
            className="w-[210mm] h-[297mm]"
          />
        </div> */}
        {/* --- HEADER --- */}
        <div className="relative h-[82mm] w-full">
          <div className="absolute inset-0 w-full h-full">
            <svg
              viewBox="0 0 1000 800"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              {/* 1. Teal Bar - drawn first (background) */}
              <polygon
                points="150,270 1000,270 1000,490 250,490"
                fill="#008996"
              />

              {/* 2. Light Cyan Triangle - Reduced width wedge */}
              <polygon
                points="300,490 380,490 340,660"
                fill="rgb(120 217 234)"
              />

              {/* 3. Dark Blue Trapezoid - drawn last (foreground) to cover edges */}
              <polygon points="0,0 190,0 340,660 0,660" fill="rgb(0, 59, 89)" />
            </svg>

            {/* Date - Top Right */}
            <div className="absolute top-[12mm] right-10 z-10">
              <span className="text-sm font-bold text-slate-700 tracking-wide font-montserrat">
                September 23/2025
              </span>
            </div>

            {/* Name - Centered in Teal Bar */}
            {/* Name - Centered in Teal Bar */}
            <div className="absolute top-[22mm] h-[40%] right-0 w-[60%] flex items-center justify-start pl-4 z-10">
              <h1 className="text-white font-bold text-3xl tracking-wide whitespace-nowrap font-montserrat">
                Maria Paula Mendoza
              </h1>
            </div>
          </div>

          {/* Logo - Top Left in Dark Blue */}
          <div className="absolute top-[25mm] left-10 z-20">
            <div className="flex flex-col text-white">
              <h2 className="text-5xl font-medium tracking-tight leading-[0.85] font-montserrat">
                NEXA
              </h2>
              <h3 className="text-sm font-bold text-[#67e8f9] tracking-[0.3em] ml-0.5 mt-2 font-montserrat">
                LOGO ACA
              </h3>
            </div>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="px-10  pb-16">
          <div className="flex flex-row gap-4 ">
            {/* Left Column: Summary Box & Illustration */}
            <div className="w-[40%] flex flex-col items-center mt-[-3mm] pr-2">
              <div className="bg-[#eff6ff] rounded-[2.5rem] p-6 relative overflow-hidden shadow-sm border border-slate-100">
                <p className="text-[rgb(0,59,89)] font-bold text-[1.1rem] leading-tight mb-5 text-left font-roboto tracking-tight">
                  This report practically integrates the results of Sara
                  Decarlini’s Work Intelligence Assessment (LIA) and Personal
                  Competences Analysis (PCA) to guide her vocational decision.
                  The structure provides a clear presentation and an appropriate
                  level of detail, with a practical focus designed to support
                  students deciding whether to enter undergraduate programs or
                  technical study tracks.
                </p>
              </div>

              {/* Illustration Area */}
              <div className="mt-8 relative w-full flex flex-col items-center">
                <div className="w-[300px] h-[300px] relative">
                  <div className="w-full h-full   overflow-hidden bg-[#fcd34d] flex items-center justify-center">
                    <img
                      src="/report/1.jpeg"
                      className="w-[160%] max-w-none ml-[-5%] mt-[10%]"
                      alt="Profile Illustration"
                    />
                  </div>
                </div>

                {/* Pill */}
                <div className="mt-[-54px] z-10 bg-[#008996] rounded-full py-2.5 px-10 text-center shadow-none ">
                  <span className="text-white font-bold text-xs tracking-wide font-antonio">
                    Influence / Technical precision
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Text & Steps */}
            <div className="w-[60%] pt-2 -mt-[20mm]">
              <h2 className="text-[#008996] text-3xl font-bold mb-2 font-antonio">
                Executive Summary
              </h2>
              <p className="text-[#1e293b] text-md leading-6 mb-12 text-justify font-medium font-roboto">
                {mockData.executiveSummary}
              </p>

              <div className="space-y-8">
                {mockData.steps.map((step) => (
                  <div
                    key={step.number}
                    className="flex flex-row items-center gap-2"
                  >
                    <div className="min-w-[70px] flex justify-center">
                      {/* Distinct Cyan Number */}
                      <span className="text-[rgb(120,217,234)] font-semibold text-7xl leading-none font-montserrat">
                        {step.number}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[rgb(0,59,89)] font-bold text-md leading-tight font-roboto">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PAGE 2: SUBTESTS --- */}
      <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden shadow-none print:shadow-none print:w-[210mm] print:h-[297mm] print:break-after-page print:overflow-hidden flex flex-col pt-[30px]">
        {/* Header - 3 Bars (Absolute to prevent being hidden by flow issues) */}
        <div className="absolute top-0 left-0 w-full flex flex-row h-[22px] gap-2">
          <div className="flex-1 bg-[#008996]"></div>
          <div className="flex-1 bg-[#008996]"></div>
          <div className="flex-1 bg-[#008996]"></div>
        </div>

        {/* Header Text Row */}
        <div className="flex flex-row justify-between items-end px-10 mb-10 pt-4">
          <h2 className="text-slate-800 text-sm font-bold font-montserrat">
            Maria Paula Mendoza
          </h2>
          <span className="text-slate-800 text-sm font-montserrat">
            Septiembre 23/2025
          </span>
        </div>

        <div className="px-10 pb-12">
          <h2 className="text-[#008996] text-3xl font-bold mb-2 font-montserrat tracking-tight">
            1. Operational meaning of the LIA subtests
          </h2>
          <p className="text-[#0f172a] text-lg font-medium mb-12 font-roboto">
            Summary applied to the student
          </p>

          <div className="flex flex-col gap-5">
            {[
              {
                text: (
                  <>
                    <span className="font-bold">
                      Detection of characteristics:
                    </span>{" "}
                    Identifies errors, patterns and details; agile learning and
                    precise execution — key for quality control and project
                    review.
                  </>
                ),
                icon: (
                  <Glasses
                    size={40}
                    className="text-[#008996]"
                    strokeWidth={2}
                  />
                ),
              },
              {
                text: (
                  <>
                    <span className="font-bold">Reasoning:</span> verbal fluency
                    and logical analysis: Useful for argumentation, problem
                    solving and presenting proposals.
                  </>
                ),
                icon: (
                  <div className="relative w-10 h-10">
                    <Settings
                      size={28}
                      className="text-[#008996] absolute top-[-2px] left-[-2px]"
                      strokeWidth={2}
                    />
                    <Settings
                      size={22}
                      className="text-[#008996] absolute bottom-[-2px] right-[-2px]"
                      strokeWidth={2}
                    />
                  </div>
                ),
              },
              {
                text: (
                  <>
                    <span className="font-bold">
                      Numerical speed and accuracy:
                    </span>{" "}
                    Agility for practical calculations; sufficient for basic
                    technical tasks.
                  </>
                ),
                icon: (
                  <div className="text-[#008996] font-bold text-3xl leading-none flex flex-col items-center justify-center gap-1">
                    <div className="flex gap-2">
                      <span>+</span>
                      <span>-</span>
                    </div>
                    <div className="flex gap-2">
                      <span>×</span>
                      <span>÷</span>
                    </div>
                  </div>
                ),
              },
              {
                text: (
                  <>
                    <span className="font-bold">Working memory:</span> Retention
                    and manipulation of information; for Sara it is adequate,
                    and it is advisable to support it with tools.
                  </>
                ),
                icon: (
                  <div className="grid grid-cols-2 gap-0.5 w-9 h-9">
                    <Puzzle
                      size={18}
                      className="text-[#008996] rotate-90"
                      strokeWidth={2}
                    />
                    <Puzzle
                      size={18}
                      className="text-[#008996] rotate-180"
                      strokeWidth={2}
                    />
                    <Puzzle
                      size={18}
                      className="text-[#008996]"
                      strokeWidth={2}
                    />
                    <Puzzle
                      size={18}
                      className="text-[#008996] -rotate-90"
                      strokeWidth={2}
                    />
                  </div>
                ),
              },
              {
                text: (
                  <>
                    <span className="font-bold">
                      Orientation / General visualization:
                    </span>{" "}
                    Mental rotation, interpretation of plans and 3D prototyping
                    — a differentiating ability for spatially oriented majors.
                  </>
                ),
                icon: (
                  <Timer size={40} className="text-[#008996]" strokeWidth={2} />
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-row items-center bg-[#f3f4f6] rounded-[100px] p-4 pr-8 gap-6 min-h-[125px]"
              >
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shrink-0 shadow-none ml-1.5">
                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-[rgb(0,59,89)] text-[0.95rem] leading-snug font-roboto font-medium px-1">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- PAGE 3: DIAGNOSIS & MAJORS --- */}
      <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden shadow-none print:shadow-none print:w-[210mm] print:h-[297mm] print:break-after-page print:overflow-hidden flex flex-col pt-[30px]">

        {/* Header - 3 Bars (Absolute to prevent being hidden by flow issues) */}
        <div className="absolute top-0 left-0 w-full flex flex-row h-[22px] gap-2">
          <div className="flex-1 bg-[#008996]"></div>
          <div className="flex-1 bg-[#008996]"></div>
          <div className="flex-1 bg-[#008996]"></div>
        </div>

        {/* Header Text Row */}
        <div className="flex flex-row justify-between items-end px-10 mb-10 pt-4">
          <h2 className="text-slate-800 text-sm font-bold font-montserrat">Maria Paula Mendoza</h2>
          <span className="text-slate-800 text-sm font-montserrat">Septiembre 23/2025</span>
        </div>

        <div className="px-10 pb-12">
          <h2 className="text-[#008996] text-3xl font-bold mb-2 font-montserrat tracking-tight">
            2. Integrated diagnosis (MIL+PCA)
          </h2>
          <p className="text-[#0f172a] text-xl font-medium mb-8 font-roboto">Strengths and risks</p>

          {/* DIAGNOSIS CONTENT */}
          <div className="bg-[#f3f4f6] rounded-[3rem] p-8 pb-10 mb-12 flex flex-row gap-6 items-center relative overflow-hidden">

            {/* Custom Donut Chart Visualization - Dynamic with variable stroke widths */}
            {(() => {
              // Chart Data - ORDER: Starting from TOP going CLOCKWISE
              // Reference shows: 14% (dark) at top, then 35% (navy), 25% (teal), 9% (light cyan), 17% (cyan)
              const chartData = [
                { label: "F", value: 14, color: "#1a1a2e" },    // Dark - Needs (TOP)
                { label: "A", value: 35, color: "#0f172a" },    // Navy - Strengths
                { label: "B", value: 25, color: "#006d77" },    // Dark Teal - Opportunities
                { label: "C", value: 9, color: "#99e2e8" },     // Light Cyan - Stable Areas
                { label: "D", value: 17, color: "#22d3ee" },    // Cyan - Risks
              ];

              // Calculate total to normalize
              const total = chartData.reduce((sum, item) => sum + item.value, 0);

              // Find min/max values for scaling stroke width
              const minValue = Math.min(...chartData.map(d => d.value));
              const maxValue = Math.max(...chartData.map(d => d.value));
              const minStroke = 10;
              const maxStroke = 22;

              const centerX = 50;
              const centerY = 50;
              const baseRadius = 32;
              const startAngle = -90; // Start from top (12 o'clock)

              // Build segments with calculated positions and dynamic stroke widths
              let cumulativePercent = 0;
              const segments = chartData.map((item) => {
                const normalizedValue = (item.value / total) * 100;

                // Dynamic stroke width based on value
                const strokeWidth = minStroke + ((item.value - minValue) / (maxValue - minValue)) * (maxStroke - minStroke);

                const circumference = 2 * Math.PI * baseRadius;
                const segmentLength = (normalizedValue / 100) * circumference;
                const gapSize = 1.5;
                const adjustedSegmentLength = Math.max(0, segmentLength - gapSize);
                const dashOffset = -(cumulativePercent / 100) * circumference - gapSize / 2;

                // Midpoint angle for label/percentage positioning
                const midAngleDeg = startAngle + (cumulativePercent + normalizedValue / 2) * 3.6;
                const midAngleRad = (midAngleDeg * Math.PI) / 180;

                // Calculate outer edge for dashed ring
                const outerRingR = baseRadius + maxStroke / 2 + 6;

                // Label positioned MUCH further outside
                const labelRadius = outerRingR + 12;
                const labelX = centerX + labelRadius * Math.cos(midAngleRad);
                const labelY = centerY + labelRadius * Math.sin(midAngleRad);

                // Percentage position (center of this segment's stroke)
                const percentX = centerX + baseRadius * Math.cos(midAngleRad);
                const percentY = centerY + baseRadius * Math.sin(midAngleRad);

                // Tick line from outer ring to label - longer line
                const lineStartX = centerX + outerRingR * Math.cos(midAngleRad);
                const lineStartY = centerY + outerRingR * Math.sin(midAngleRad);
                const lineEndX = centerX + (labelRadius - 3) * Math.cos(midAngleRad);
                const lineEndY = centerY + (labelRadius - 3) * Math.sin(midAngleRad);

                cumulativePercent += normalizedValue;

                return {
                  ...item,
                  normalizedValue,
                  strokeWidth,
                  adjustedSegmentLength,
                  dashOffset,
                  dashArray: `${adjustedSegmentLength} ${circumference - adjustedSegmentLength}`,
                  circumference,
                  labelX,
                  labelY,
                  percentX,
                  percentY,
                  lineStartX,
                  lineStartY,
                  lineEndX,
                  lineEndY,
                  midAngleRad,
                };
              });

              const outerRingRadius = baseRadius + maxStroke / 2 + 6;
              const innerRadius = baseRadius - maxStroke / 2 - 2;

              return (
                <div className="relative w-[280px] h-[280px] shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
                    {/* Outer dashed ring */}
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={outerRingRadius}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="0.6"
                      strokeDasharray="2 1.5"
                    />

                    {/* Donut segments - each with dynamic stroke width based on value */}
                    {segments.map((seg, i) => (
                      <circle
                        key={i}
                        cx={centerX}
                        cy={centerY}
                        r={baseRadius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={seg.strokeWidth}
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={seg.dashOffset}
                        transform={`rotate(${startAngle} ${centerX} ${centerY})`}
                      />
                    ))}

                    {/* Inner white circle */}
                    <circle cx={centerX} cy={centerY} r={innerRadius} fill="white" />

                    {/* Tick lines from outer ring to labels - dashed style */}
                    {segments.map((seg, i) => (
                      <line
                        key={`line-${i}`}
                        x1={seg.lineStartX}
                        y1={seg.lineStartY}
                        x2={seg.lineEndX}
                        y2={seg.lineEndY}
                        stroke="#94a3b8"
                        strokeWidth="0.5"
                        strokeDasharray="1.5 1"
                      />
                    ))}

                    {/* Labels (F, A, B, C, D) outside the ring - LARGER */}
                    {segments.map((seg, i) => (
                      <text
                        key={`label-${i}`}
                        x={seg.labelX}
                        y={seg.labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-slate-500 font-semibold"
                        style={{ fontSize: '6px', fontFamily: 'sans-serif' }}
                      >
                        {seg.label}
                      </text>
                    ))}

                    {/* Percentages inside segments */}
                    {segments.map((seg, i) => {
                      // Use teal text for light backgrounds
                      const isLightBg = seg.color === "#99e2e8";
                      return (
                        <text
                          key={`percent-${i}`}
                          x={seg.percentX}
                          y={seg.percentY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={`font-bold ${isLightBg ? "fill-[#006d77]" : "fill-white"}`}
                          style={{ fontSize: '4.5px' }}
                        >
                          {seg.value}%
                        </text>
                      );
                    })}
                  </svg>

                  {/* Center Icon - Chess Pawn */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl" style={{ color: "#c9a66b" }}>♟</span>
                  </div>
                </div>
              );
            })()}

            {/* Legend List - Compact with title and desc on same line */}
            <div className="flex flex-col flex-1 gap-0">
              {[
                {
                  l: "A",
                  title: "Strengths:",
                  desc: "She quickly detects details and communicates very well with others.",
                  bg: "#0f172a",
                  borderColor: "#0f172a"
                },
                {
                  l: "B",
                  title: "Opportunities:",
                  desc: "Her reasoning and verbal skills are good and can grow even more.",
                  bg: "#006d77",
                  borderColor: "#008996"
                },
                {
                  l: "C",
                  title: "Stable Areas:",
                  desc: "Her memory works well when information is clear and organized.",
                  bg: "#99e2e8",
                  borderColor: "#22d3ee"
                },
                {
                  l: "D",
                  title: "Risks:",
                  desc: "She may struggle to make firm decisions in difficult situations.",
                  bg: "#22d3ee",
                  borderColor: "#22d3ee"
                },
                {
                  l: "F",
                  title: "Needs:",
                  desc: "She benefits from checklists and step-by-step tasks to stay on track.",
                  bg: "#1a1a2e",
                  borderColor: "#008996"
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-row items-stretch py-1.5"
                  style={{ borderBottom: `3px solid ${item.borderColor}` }}
                >
                  <div
                    className="w-10 flex items-center justify-center text-white font-bold text-lg mr-3 shrink-0 rounded-[6px] self-stretch"
                    style={{ backgroundColor: item.bg, color: item.bg === "#99e2e8" ? "#006d77" : "white" }}
                  >
                    {item.l}
                  </div>
                  <p className="text-[13px] leading-snug self-center">
                    <span className="font-bold text-[#0f172a]">{item.title}</span>{" "}
                    <span className="text-slate-500 font-roboto">{item.desc}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-[#008996] text-2xl font-bold mb-1 font-montserrat tracking-tight">
            3. Prioritized top majors
          </h2>
          <p className="text-slate-500 text-base mb-6 font-roboto">
            LIA fit (detection + orientation) and PCA (influence, service, quality)
          </p>

          <div className="space-y-5">
            {/* Perfect Fit */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[#0f172a] font-bold text-sm whitespace-nowrap font-montserrat">Perfect fit</h3>
                <div className="h-[1px] bg-[#008996] flex-1"></div>
              </div>
              <ul className="space-y-1 pl-8">
                {[
                  { id: 1, title: "Architecture", desc: "Spatial visualization + portfolio from the start; client interaction." },
                  { id: 2, title: "Industrial Design / Product Design", desc: "3D prototyping, testing and product improvement." },
                  { id: 3, title: "Civil Engineering", extra: "(project design and supervision)", desc: "plan reading, site control and technical management." }
                ].map((item) => (
                  <li key={item.id} className="text-[#0f172a] text-sm font-roboto">
                    <span className="font-bold">{item.id}. {item.title}</span>
                    {item.extra && <span className="italic text-slate-500"> {item.extra}</span>}
                    <span className="text-slate-600">: {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Highly Recommended */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[#0f172a] font-bold text-sm whitespace-nowrap font-montserrat">Highly recommended</h3>
                <div className="h-[1px] bg-[#008996] flex-1"></div>
              </div>
              <ul className="space-y-1 pl-8">
                {[
                  { id: 4, title: "Interior Architecture / Interior Design" },
                  { id: 5, title: "Mechanical Engineering", extra: "(design and prototyping)" },
                  { id: 6, title: "Materials Engineering / Materials Science" }
                ].map((item) => (
                  <li key={item.id} className="text-[#0f172a] text-sm font-roboto">
                    <span className="font-bold">{item.id}. {item.title}</span>
                    {item.extra && <span className="text-slate-500"> {item.extra}</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Complementary */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[#0f172a] font-bold text-sm whitespace-nowrap font-montserrat">Complementary</h3>
                <div className="h-[1px] bg-[#008996] flex-1"></div>
              </div>
              <ul className="space-y-1 pl-8">
                {[
                  "Naval Engineering / Naval Architecture",
                  "UX/UI with physical prototyping / 3D product focus",
                  "Technical Quality Control / Quality Engineering"
                ].map((item, i) => (
                  <li key={i} className="text-[#0f172a] text-sm font-bold font-roboto">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PAGE 4 ========== */}
      <div
        className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-lg flex flex-col relative print:w-[210mm] print:h-[297mm] print:overflow-hidden"
        style={{ breakAfter: "page" }}
      >
        {/* Alignment Overlay - Hidden in Print */}
        <div className="absolute hidden  inset-0 z-50 opacity-40 pointer-events-none print:hidden">
          <img src="/report/2.png" alt="Reference Overlay" className="w-full h-full" />
        </div>

        {/* Top teal bar - Updated to match Page 2/3 style (3 segments, absolute) */}
        <div className="absolute top-0 left-0 w-full flex flex-row h-[21px] gap-6 px-10">
          <div className="flex-1 bg-[#008996] "></div>
          <div className="flex-1 bg-[#008996]"></div>
          <div className="flex-1 bg-[#008996] mr-1"></div>
        </div>

        {/* Content */}
        <div className="px-10 pb-6 pt-12 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 ">
            <span className=" text-sm font-roboto">Maria Paula Mendoza</span>
            <span className=" text-sm font-roboto  tracking-wide">Septiembre 23/2025</span>
          </div>

          {/* Section 4: Majors NOT recommended */}
          <h2 className="text-[#008996] text-[22px] font-bold mb-6 font-montserrat  mt-[44px]">
            4. Majors NOT recommended for Maria Paula
          </h2>

          <div className="space-y-6 mb-12">
            <p className="text-[#0f172a] text-[13px] font-roboto leading-snug">
              <span className="font-bold block mb-1 tracking-wide text-">Programs that rely exclusively on repetitive routines with little visualization</span>
              <span className="text-slate-500 italic font-medium">(e.g., some pure branches of accounting without a technical component).</span>
            </p>
            <p className="text-[#0f172a] text-[13px] font-roboto leading-snug">
              <span className="font-bold block mb-1">Programs that demand high dominance or aggressive sales without support</span>
              <span className="text-slate-500 italic font-medium">(due to low dominance).</span>
            </p>
          </div>

          {/* Section 5: Exploration and decision plan */}
          <h2 className="text-[#008996] text-xl font-bold mb-1 font-montserrat tracking-wide pt-9">
            5. Exploration and decision plan (0–12 months)
          </h2>
          <p className="text-[#0f172a] text-[18px] mb-6 font-roboto font-medium tracking-wider">Step-by-step for a student</p>

          <div className="relative mb-10">
            {/* Mountain icon - positioned at top right of the timeline */}
            <div className="absolute -right-3 -top-4 w-16 h-16 z-10">
              <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
                <circle cx="32" cy="32" r="30" fill="#0f172a" stroke="white" strokeWidth="2" />
                <g transform="translate(10, 10) scale(0.7)">
                  {/* Back mountain */}
                  <polygon points="20,48 36,20 52,48" fill="#94a3b8" />
                  {/* Front mountain */}
                  <polygon points="8,48 28,16 48,48" fill="#cbd5e1" />
                  {/* Snow cap */}
                  <polygon points="28,16 32,24 24,24" fill="white" />
                  {/* Flag pole */}
                  <line x1="28" y1="16" x2="28" y2="6" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Flag */}
                  <polygon points="28,6 38,10 28,14" fill="#ef4444" />
                </g>
              </svg>
            </div>

            {/* Timeline headers - rectangular style */}
            <div className="flex h-[38px] font-montserrat text-[13px] font-bold mb-6 w-[95%]">
              {/* Month 0-1 - Dark navy */}
              <div className="flex-1 bg-[#0f3443] text-white flex items-center justify-center rounded-l-md font-bold">
                Month 0–1
              </div>
              {/* Month 1-3 - Teal */}
              <div className="flex-1 bg-[#008996] text-white flex items-center justify-center font-bold">
                Month 1–3
              </div>
              {/* Month 3-6 - Cyan */}
              <div className="flex-1 bg-[#22d3ee] text-white flex items-center justify-center font-bold">
                Month 3–6
              </div>
              {/* Month 6-12 - Light cyan */}
              <div className="flex-1 bg-[#b2f0f5] text-[#006d77] flex items-center justify-center rounded-r-md font-bold">
                Month 6–12
              </div>
            </div>

            {/* Timeline content */}
            <div className="flex bg-white pt-2 w-[95%]">
              {/* Month 0-1 */}
              <div className="flex-1 p-2 pr-3  border-slate-100 last:border-0">
                <h4 className="font-bold text-[18px] text-[#008996] mb-1 leading-tight">Quick confirmation</h4>
                <p className="text-[14px] text-slate-600 font-medium leading-snug mb-4">
                  Intensive SketchUp, AutoCAD course (20–40 h); drawing workshop (10–20 h); 1-day job-shadowing at a studio/workshop.
                </p>
                <p className="text-[14px] text-slate-700">
                  <span className="font-bold">KPI:</span> enjoy at least 2 of the 3 activities.
                </p>
              </div>

              {/* Month 1-3 */}
              <div className="flex-1 p-2 pr-3 border-slate-100 last:border-0">
                <h4 className="font-bold text-[18px] text-[#008996] mb-1 leading-tight">Minimum portfolio</h4>
                <p className="text-[14px] text-slate-600 font-medium leading-snug mb-4">
                  Create 2 projects, (A) plan + elevation + 3D view of a space; (B) documented object/prototype.
                </p>
                <p className="text-[14px] text-slate-700">
                  <span className="font-bold">Request feedback:</span> from 2 professionals
                </p>
              </div>

              {/* Month 3-6 */}
              <div className="flex-1 p-2 pr-3  border-slate-100 last:border-0">
                <h4 className="font-bold text-[18px] text-[#008996] mb-1 leading-tight">Technical validation</h4>
                <p className="text-[14px] text-slate-600 font-medium leading-snug mb-4">
                  Intermediate courses (BIM / SolidWorks); micro-internship 2–4 weeks.
                </p>
                <p className="text-[14px] text-slate-700">
                  <span className="font-bold">KPI:</span> improved portfolio and positive feedback from 1 professional.
                </p>
              </div>

              {/* Month 6-12 */}
              <div className="flex-1 p-2 pr-0">
                <h4 className="font-bold text-[18px] text-[#008996] mb-1 leading-tight">Decision and admission</h4>
                <p className="text-[14px] text-slate-600 font-medium leading-snug mb-4">
                  Select 2–4 programs (1–2 reach schools, 1–2 safe options). Prepare final portfolio, letters and admission tests.
                </p>
                <p className="text-[14px] text-slate-700">
                  <span className="font-bold">Plan B:</span> technical cycle or intensive courses.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Immediate operational plan */}
          <h2 className="text-[#008996] text-2xl font-bold mb-1 pt-10 font-montserrat tracking-tight">
            6. Immediate operational plan: 8 weeks
          </h2>
          <p className="text-[#0f172a] text-[18px] mb-6 font-roboto font-medium tracking-wide">Action checklist</p>

          <div className="relative">
            {/* Clipboard icon */}
            <div className="absolute -right-3 -top-4 w-16 h-16 z-10">
              <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
                <circle cx="32" cy="32" r="30" fill="#cffafe" stroke="white" strokeWidth="2" />
                <g transform="translate(10, 10) scale(0.7)">
                  {/* Clipboard body */}
                  <rect x="14" y="12" width="36" height="44" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                  {/* Clip */}
                  <rect x="24" y="6" width="16" height="10" rx="2" fill="#22d3ee" />
                  <rect x="28" y="4" width="8" height="4" rx="1" fill="#0891b2" />
                  {/* Lines */}
                  <line x1="22" y1="26" x2="42" y2="26" stroke="#d97706" strokeWidth="1.5" />
                  <line x1="22" y1="34" x2="42" y2="34" stroke="#d97706" strokeWidth="1.5" />
                  <line x1="22" y1="42" x2="38" y2="42" stroke="#d97706" strokeWidth="1.5" />
                </g>
              </svg>
            </div>

            {/* Timeline headers - rectangular style */}
            <div className="flex  h-[38px] font-montserrat text-[13px] font-bold mb-6 w-[95%]">
              {/* Week 1-2 - Dark navy */}
              <div className="flex-1 bg-[#0f3443] text-white flex items-center justify-center rounded-l-md font-bold">
                Week 1–2
              </div>
              {/* Week 3-4 - Teal */}
              <div className="flex-1 bg-[#008996] text-white flex items-center justify-center font-bold">
                Week 3–4
              </div>
              {/* Week 5-6 - Cyan */}
              <div className="flex-1 bg-[#22d3ee] text-white flex items-center justify-center font-bold">
                Week 5–6
              </div>
              {/* Week 7-8 - Light cyan */}
              <div className="flex-1 bg-[#b2f0f5] text-[#006d77] flex items-center justify-center rounded-r-md font-bold">
                Week 7–8
              </div>
            </div>

            {/* Timeline content */}
            <div className="flex bg-white pt-2 w-[95%]">
              {/* Week 1-2 */}
              <div className="flex-1 p-2 pr-3 border-slate-100 last:border-0">
                <p className="text-[14px] text-slate-600 leading-snug font-medium mb-4">
                  Enroll in a basic CAD course; define the portfolio project
                </p>
              </div>

              {/* Week 3-4 */}
              <div className="flex-1 p-2 pr-3  border-slate-100 last:border-0">
                <p className="text-[14px] text-slate-600 leading-snug font-medium mb-4">
                  Execute the first draft; feedback session with a mentor.
                </p>
              </div>

              {/* Week 5-6 */}
              <div className="flex-1 p-2 pr-3  border-slate-100 last:border-0">
                <p className="text-[14px] text-slate-600 leading-snug font-medium mb-4">
                  3D modeling; second feedback and adjustment.
                </p>
              </div>

              {/* Week 7-8 */}
              <div className="flex-1 p-2 pr-0">
                <p className="text-[14px] text-slate-600 leading-snug font-medium mb-4">
                  Present portfolio version 1; list target universities; prepare admission steps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom teal bar */}
        <div className="w-full h-3 bg-[#008996] mt-auto"></div>
      </div>

      {/* ========== PAGE 5: INDICATORS & TRAINING ========== */}
      <div
        className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-lg flex flex-col relative print:w-[210mm] print:h-[297mm] print:overflow-hidden"
        style={{ breakAfter: "page" }}
      >
        {/* Top teal bar - Updated to match Page 2/3 style (3 segments, absolute) */}
        <div className="absolute top-0 left-0 w-full flex flex-row h-[21px] gap-6 px-10">
          <div className="flex-1 bg-[#008996] "></div>
          <div className="flex-1 bg-[#008996]"></div>
          <div className="flex-1 bg-[#008996] mr-1"></div>
        </div>

        {/* Content */}
        <div className="px-10 pb-6 pt-12 flex-1 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <span className=" text-sm font-roboto">Maria Paula Mendoza</span>
            <span className=" text-sm font-roboto  tracking-wide">Septiembre 23/2025</span>
          </div>

          {/* Section 7: Indicators and tracking */}
          <div className="mb-16 relative">
            {/* Rocket Icon - Absolute Right - Sticker Style */}
            <div className="absolute -right-14 top-10 z-20 w-[260px] h-[320px] rotate-[15deg]">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl shadow-white">
                <defs>
                  {/* Define the Rocket Shape for reuse */}
                  <g id="rocket-shape">
                    {/* Flames */}
                    <path d="M100 175 Q120 200 100 220 Q80 200 100 175" fill="#facc15" stroke="#1e293b" strokeWidth="2.5" />
                    <path d="M100 175 Q110 190 100 205 Q90 190 100 175" fill="#f97316" stroke="#1e293b" strokeWidth="2" />

                    {/* Fins */}
                    <path d="M65 145 L40 165 L75 160 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M135 145 L160 165 L125 160 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />

                    {/* Rocket Body */}
                    <path d="M100 25 Q150 70 140 155 L60 155 Q50 70 100 25 Z" fill="white" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />

                    {/* Nose Cone */}
                    <path d="M100 25 Q124 45 130 65 L70 65 Q76 45 100 25 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />

                    {/* Window */}
                    <circle cx="100" cy="95" r="28" fill="#a5f3fc" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="100" cy="95" r="16" fill="#0e7490" stroke="#1e293b" strokeWidth="2.5" />
                    <circle cx="106" cy="89" r="4" fill="white" opacity="0.6" />

                    {/* Engine */}
                    <path d="M70 155 L75 165 L125 165 L130 155 Z" fill="#475569" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
                  </g>
                </defs>

                {/* White Halo / Sticker Border (Behind) */}
                <use href="#rocket-shape" stroke="white" strokeWidth="12" strokeLinejoin="round" />

                {/* Main Icon (Front) */}
                <use href="#rocket-shape" />
              </svg>
            </div>

            <h2 className="text-[#008996] text-[24px] font-bold mb-0.5 font-montserrat tracking-tight leading-none relative z-10 w-[70%]">
              7. Indicators and tracking
            </h2>
            <p className="text-[#0f172a] text-[15px] mb-8 font-montserrat font-bold tracking-tight pl-0.5 relative z-10">KPIs</p>

            <div className="space-y-4 w-[78%]">
              {[
                { label: "Portfolio:", text: "2 completed pieces in", bold: "3 months." },
                { label: "Deadlines:", text: "% of deliverables submitted on time,", bold: "target ≥ 90% at 3 mo." },
                { label: "Quality:", text: "reduction of errors found between revisions,", bold: "-20% in 3 mo." },
                { label: "Training:", text: "", bold: "courses completed", extra: "(basic cad, intermediate bim) within", boldEnd: "6 mo." },
                { label: "Professional feedback:", text: "", bold: "2 reviews", extra: "with recommendations implemented." },
              ].map((item, i) => (
                <div key={i} className="bg-[#f1f5f9] rounded-full py-2.5 px-6 flex items-center text-[13px] text-slate-700 font-roboto leading-none relative z-0">
                  <span className="font-bold text-[#0f172a] mr-1">{item.label}</span>
                  {item.text && <span className="mr-1">{item.text}</span>}
                  {item.bold && <span className="font-bold text-slate-900 mr-1">{item.bold}</span>}
                  {item.extra && <span className="mr-1">{item.extra}</span>}
                  {item.boldEnd && <span className="font-bold text-slate-900">{item.boldEnd}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Training and support */}
          <div className="relative">
            {/* Scroll Icon - Absolute Right - Sticker Style */}
            <div className="absolute -right-6 top-40 z-20 w-[240px] h-[240px] rotate-[8deg]">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                <defs>
                  <g id="scroll-shape">
                    {/* Rolled top (hint) */}
                    <path d="M40 38 Q100 25 160 38" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

                    {/* Main Sheet */}
                    <path d="M40 40 L160 55 L145 180 L25 165 Z" fill="#fef08a" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />

                    {/* Rolled bottom */}
                    <path d="M25 165 Q85 180 145 180 L145 165 Q85 165 25 150 Z" fill="#facc15" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M145 180 L145 165" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

                    {/* Strategy Map Path */}
                    <path d="M60 135 C80 100 120 120 115 85" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />

                    {/* Arrow Head */}
                    <path d="M115 85 L108 92 M115 85 L124 88" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Location Circle */}
                    <circle cx="125" cy="70" r="6" fill="none" stroke="#1e293b" strokeWidth="3" />

                    {/* Marks */}
                    <path d="M55 130 L65 140 M65 130 L55 140" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                  </g>
                </defs>

                {/* White Halo / Sticker Border (Behind) */}
                <use href="#scroll-shape" stroke="white" strokeWidth="12" strokeLinejoin="round" />

                {/* Main Icon (Front) */}
                <use href="#scroll-shape" />
              </svg>
            </div>

            <h2 className="text-[#008996] text-[24px] font-bold mb-8 font-montserrat tracking-tight leading-tight w-[60%] relative z-10">
              8. Training and support recommendations
            </h2>

            <div className="space-y-4 w-[75%]">
              {[
                { label: "Technical:", text: "AutoCAD, SketchUp, Revit/basic BIM, SolidWorks or Rhino (depending on focus)." },
                { label: "Practice:", text: "maker workshops / 3D printing / short internships." },
                { label: "Transversal:", text: "Project management fundamentals, technical communication and presentation skills." },
                { label: "Support:", text: "Monthly mentoring and coaching sessions focused on decisionmaking." },
              ].map((item, i) => (
                <div key={i} className="bg-[#f1f5f9] rounded-[24px] py-4 px-6 text-[13px] text-slate-700 font-roboto leading-snug relative z-0">
                  <span className="font-bold text-[#0f172a] block mb-0.5">{item.label}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom teal bar */}
        <div className="w-full h-3 bg-[#008996] mt-auto"></div>
      </div>


      {/* ========== PAGE 6: COMPARATIVE MAPPING ========== */}
      <div
        className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-lg flex flex-col relative print:w-[210mm] print:h-[297mm] print:overflow-hidden sidebar-print-page"
        style={{ breakAfter: "page" }}
      >
        {/* Top teal bar */}
        <div className="absolute top-0 left-0 w-full flex flex-row h-[21px] gap-6 px-10">
          <div className="flex-1 bg-[#008996] "></div>
          <div className="flex-1 bg-[#008996]"></div>
          <div className="flex-1 bg-[#008996] mr-1"></div>
        </div>

        {/* Content */}
        <div className="px-10 pb-6 pt-12 flex-1 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <span className=" text-sm font-roboto">Maria Paula Mendoza</span>
            <span className=" text-sm font-roboto tracking-wide">Septiembre 23/2025</span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-[#008996] text-[26px] font-bold mb-1 font-montserrat tracking-tight leading-none">
              Comparative mapping of universities
            </h2>
            <p className="text-[#008996] text-[18px] font-montserrat font-medium tracking-wide">
              Italy — Spain — Bogotá
            </p>
          </div>

          {/* Table */}
          <div className="w-full mb-8">
            {/* Table Header */}
            <div className="grid grid-cols-[0.8fr_1.8fr_1.8fr_1.4fr_1.6fr_1.6fr] gap-1 mb-1">
              {["Location", "University", "Program", "Type", "Requirements", "Highlights"].map((header, i) => (
                <div key={i} className={`bg-[#e0f7fa] text-[#008996] font-bold text-[11px] font-montserrat py-3 px-1 text-center flex items-center justify-center rounded-sm leading-tight`}>
                  {header === "Highlights" ? "Hightlights" : header}
                </div>
              ))}
            </div>

            {/* Table Body */}
            <div className="flex flex-col gap-1">
              {[
                {
                  country: "IT", code: "MIL", uni: "Politecnico di Milano", prog: "Architecture;\nProduct Design",
                  type: "Degree / Laurea\n(3–5 years)", req: "Entrance exam /\nPortfolio", high: "Top school; strong\nprototyping labs"
                },
                {
                  country: "IT", code: "TOR", uni: "Politecnico di\nTorino", prog: "Architecture;\nProduct Design",
                  type: "Laurea / Laurea\nMagistrale", req: "Entrance exam /\nPortfolio", high: "Technical focus with\nstrong industry\nconnections"
                },
                {
                  country: "IT", code: "VEN", uni: "IUAV Università\nluav di Venezia", prog: "Architecture;\nProduct Design",
                  type: "Degree / Master", req: "Entrance exam /\nPortfolio", high: "Highly practical\nprograms"
                },
                {
                  country: "IT", code: "ROM", uni: "Sapienza\nUniversità di\nRoma", prog: "Architecture;\nProduct Design",
                  type: "Degree\n/ 3+2 cycle", req: "Entrance exam /\nPortfolio", high: "Research\norientation"
                },
                {
                  country: "ES", code: "BCN", uni: "Universitat\nPolitècnica de\nCatalunya", prog: "Architecture;\nProduct Design",
                  type: "Degree\n(4–5 years)", req: "Grade cutoff /\nPortfolio", high: "Highly practical\nprograms"
                },
                {
                  country: "ES", code: "MAD", uni: "Politecnico di\nMilano", prog: "Architecture;\nProduct Design",
                  type: "Degree / Master", req: "Portfolio required", high: "Academic\nprestige"
                },
                {
                  country: "ES", code: "VLC", uni: "Politecnico di\nTorino", prog: "Architecture;\nProduct Design",
                  type: "Degree", req: "Portfolio required", high: "Project-based\nlearning"
                },
                {
                  country: "CO", code: "BCN", uni: "IUAV Università\nluav di Venezia", prog: "Architecture;\nProduct Design",
                  type: "Undergraduate\n(~10 semesters)", req: "Institutional\nadmission", high: "Applied focus\nwith ties to local\nstudios"
                },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-[0.8fr_1.8fr_1.8fr_1.4fr_1.6fr_1.6fr] gap-1 min-h-[50px]">
                  {/* Location Cell */}
                  <div className="bg-[#f8fafc] flex flex-row items-center justify-center gap-2 p-1 rounded-sm">
                    {/* Flag SVG */}
                    <div className="w-6 h-4 shrink-0 shadow-sm border border-slate-100 overflow-hidden">
                      {row.country === "IT" && (
                        <svg viewBox="0 0 3 2" className="w-full h-full">
                          <rect width="1" height="2" x="0" fill="#009246" />
                          <rect width="1" height="2" x="1" fill="#ffffff" />
                          <rect width="1" height="2" x="2" fill="#ce2b37" />
                        </svg>
                      )}
                      {row.country === "ES" && (
                        <svg viewBox="0 0 3 2" className="w-full h-full">
                          <rect width="3" height="2" fill="#aa151b" />
                          <rect width="3" height="1" y="0.5" fill="#f1bf00" />
                        </svg>
                      )}
                      {row.country === "CO" && (
                        <svg viewBox="0 0 3 2" className="w-full h-full">
                          <rect width="3" height="1" fill="#fcd116" />
                          <rect width="3" height="0.5" y="1" fill="#003893" />
                          <rect width="3" height="0.5" y="1.5" fill="#ce1126" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[14px] font-bold text-slate-800 font-roboto">{row.code}</span>
                  </div>

                  {/* University */}
                  <div className="bg-[#f8fafc] flex items-center justify-center text-center p-2 rounded-sm">
                    <span className="text-[11px] text-slate-700 font-medium leading-tight font-roboto whitespace-pre-line">{row.uni}</span>
                  </div>

                  {/* Program */}
                  <div className="bg-[#f8fafc] flex items-center justify-center text-center p-2 rounded-sm">
                    <span className="text-[11px] text-slate-700 leading-tight font-roboto whitespace-pre-line">{row.prog}</span>
                  </div>

                  {/* Type */}
                  <div className="bg-[#f8fafc] flex items-center justify-center text-center p-2 rounded-sm">
                    <span className="text-[11px] text-slate-700 leading-tight font-roboto whitespace-pre-line">{row.type}</span>
                  </div>

                  {/* Requirements */}
                  <div className="bg-[#f8fafc] flex items-center justify-center text-center p-2 rounded-sm">
                    <span className="text-[11px] text-slate-700 leading-tight font-roboto whitespace-pre-line">{row.req}</span>
                  </div>

                  {/* Highlights */}
                  <div className="bg-[#f8fafc] flex items-center justify-center text-center p-2 rounded-sm">
                    <span className="text-[11px] text-slate-700 leading-tight font-roboto whitespace-pre-line">{row.high}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Recommendation */}
          <div className="mt-8">
            <p className="text-[#0f172a] text-[13px] font-roboto leading-snug text-justify">
              Recommendations for use: prioritize universities that require a portfolio and offer workshops/labs from year one (e.g., Polimi, IUAV, ETSAB, Uniandes, ELISAVA). Plan portfolio preparation 3–6 months in advance.
            </p>
          </div>

        </div>

        {/* Bottom teal bar */}
        <div className="w-full h-3 bg-[#008996] mt-auto"></div>
      </div>

      {/* ========== PAGE 7: CONCLUSION & ROADMAP ========== */}
      <div
        className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-lg flex flex-col relative print:w-[210mm] print:h-[297mm] print:overflow-hidden sidebar-print-page"
        style={{ breakAfter: "page" }}
      >
        {/* Top teal bar */}
        <div className="absolute top-0 left-0 w-full flex flex-row h-[21px] gap-6 px-10">
          <div className="flex-1 bg-[#008996] "></div>
          <div className="flex-1 bg-[#008996]"></div>
          <div className="flex-1 bg-[#008996] mr-1"></div>
        </div>

        {/* Content */}
        <div className="px-10 pb-6 pt-12 flex-1 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <span className=" text-sm font-roboto">Maria Paula Mendoza</span>
            <span className=" text-sm font-roboto tracking-wide">Septiembre 23/2025</span>
          </div>

          {/* Title */}
          <h2 className="text-[#008996] text-[26px] font-bold mb-6 font-montserrat tracking-tight leading-none">
            Conclusion and next steps
          </h2>

          {/* Conclusion Text */}
          <div className="mb-6">
            <h3 className="text-[#008996] text-[18px] font-bold mb-2 font-montserrat">Conclusion:</h3>
            <p className="text-[#475569] text-[14px] font-roboto leading-snug text-justify">
              Maria Paula displays high potential for majors combining spatial visualization and attention to detail,
              and she also has interpersonal skills that facilitate teamwork and project presentation. Prioritizing
              Architecture, Industrial Design and Civil Engineering is the main recommendation, with an
              exploration-and-portfolio plan as the immediate path.
            </p>
          </div>

          {/* Next Steps Text */}
          <div className="mb-6">
            <h3 className="text-[#008996] text-[18px] font-bold mb-2 font-montserrat">Immediate operational next steps suggested:</h3>
            <ol className="list-decimal pl-5 text-[#475569] text-[14px] font-roboto leading-snug space-y-1">
              <li>Start the 8-week plan (enroll in a CAD course + portfolio project).</li>
              <li>Select 4 target universities (2 aspirational, 2 safe) and verify admission calls/deadlines).</li>
              <li>Request 2 portfolio reviews by professionals (mentors) during months 1–3.</li>
              <li>Schedule decision-making coaching (3 sessions) to address low dominance.</li>
            </ol>
          </div>

          {/* ANNEXES BOX (Floating Right) */}
          <div className="absolute right-0 top-[420px] w-[70%] bg-[#67e8f9] p-8 pr-10 z-10 rounded-l-md shadow-sm">
            <h3 className="text-white text-[20px] font-bold mb-3 font-montserrat">Annexes and references</h3>
            <p className="text-[#0e7490] text-[14px] font-roboto mb-2 font-medium">Model report: Professional Guidance Report (Structure and template).</p>
            <ul className="list-disc pl-5 text-[#155e75] text-[14px] font-roboto space-y-1 font-bold">
              <li>MIL — Sara Decarlini results (MIL).</li>
              <li>PCA — Sara Decarlini results (PCA).</li>
              <li>University web sources <span className="font-normal italic text-[#0e7490]">(official links consulted to review programs and requirements)</span>. <span className="font-normal text-[#0e7490]">If detailed university fact sheets are required, I can provide them with updated dates and requirements.</span></li>
            </ul>
          </div>

          {/* ROADMAP VISUALIZATION */}
          <div className="relative mt-[160px] h-[550px] w-full">
            {/* Dashed Path SVG */}
            <svg className="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 800 600">
              {/* Smoother, continuous winding path with higher bottom points */}
              <path
                d="M100 100 C 200 100, 250 160, 270 220 C 300 300, 200 340, 150 380 C 100 420, 150 480, 260 480 C 350 480, 400 400, 400 320 C 400 240, 500 240, 580 280 C 650 340, 680 440, 600 500"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                className="opacity-70"
              />
            </svg>

            {/* 1. Crossroads (Maze) - Path Start (100, 100) */}
            <div className="absolute top-[68px] left-[68px] w-24 flex flex-col items-center z-10">
              <div className="bg-[#bce6eb] p-2 rounded-lg border-2 border-slate-400 mb-1 w-16 h-16 flex items-center justify-center shadow-sm">
                {/* Maze Icon */}
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-slate-600">
                  <path fill="currentColor" d="M3 3H21V21H3V3M5 5V19H19V5H5M15 11H17V17H11V15H15V11M7 7H13V9H9V13H7V7Z" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-bold text-[12px] text-slate-800">Crossroads</span>
              <span className="text-[10px] text-slate-600 text-center leading-tight">Choosing a direction.</span>
            </div>

            {/* 2. Diagnosis (Clipboard) - Curve (270, 220) */}
            <div className="absolute top-[188px] left-[242px] w-24 flex flex-col items-center z-10">
              <div className="bg-[#fff1cd] p-1 rounded-lg border-2 border-slate-400 mb-1 w-14 h-16 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-600">
                  <path fill="currentColor" d="M19 3H14.82C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M12 3C12.55 3 13 3.45 13 4S12.55 5 12 5 11 4.55 11 4 11.45 3 12 3M7 7H17V9H7V7M7 11H17V13H7V11M7 15H14V17H7V15Z" />
                </svg>
              </div>
              <span className="font-bold text-[12px] text-slate-800">Diagnosis</span>
              <span className="text-[10px] text-slate-600 text-center leading-tight">Understanding the starting point.</span>
            </div>

            {/* 3. Planning (Flowchart) - Loop Bottom (150, 380) */}
            <div className="absolute top-[342px] left-[28px] w-24 flex flex-col items-center z-10">
              <div className="bg-[#e0f7fa] p-1 rounded-lg border-2 border-slate-400 mb-1 w-16 h-14 flex items-center justify-center shadow-sm">
                {/* Hierarchy Icon */}
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-slate-600">
                  <path fill="currentColor" d="M16 17H13V15H16V17M11 17H8V15H11V17M13.5 13H10.5L12 11L13.5 13M3 3H21V21H3V3M5 5V19H19V5H5Z" opacity="0.3" />
                  <path fill="currentColor" d="M16 6H8C6.9 6 6 6.9 6 8V10C6 11.1 6.9 12 8 12H10V15H6V18C6 19.1 6.9 20 8 20H10C11.1 20 12 19.1 12 18V16H12C12 17.1 12.9 18 14 18H16C17.1 18 18 17.1 18 16V14C18 12.9 17.1 12 16 12H14V9H16C17.1 9 18 8.1 18 7V6C18 4.9 17.1 4 16 4H16C16 5.1 16 6 16 6M8 8H16V10H8V8M8 16H10V18H8V16M14 14H16V16H14V14Z" />
                </svg>
              </div>
              <span className="font-bold text-[12px] text-slate-800">Planning</span>
              <span className="text-[10px] text-slate-600 text-center leading-tight">Designing the path forward.</span>
            </div>

            {/* 4. Implementation (A/B/C) - Rising Curve (260, 480) */}
            <div className="absolute top-[446px] left-[188px] w-24 flex flex-col items-center z-10">
              <div className="relative w-16 h-12 mb-1 pl-2">
                <div className="absolute top-4 left-0 bg-[#ef4444] rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-[10px] border border-slate-600 z-10">A</div>
                <div className="absolute top-4 left-5 bg-[#facc15] rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-[10px] border border-slate-600 z-10">B</div>
                <div className="absolute top-0 left-2.5 bg-[#22d3ee] rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-[10px] border border-slate-600 z-0">C</div>
              </div>
              <span className="font-bold text-[12px] text-slate-800 mt-1">Implementation</span>
              <span className="text-[10px] text-slate-600 text-center leading-tight">Putting the plan into action.</span>
            </div>

            {/* 5. Progress (Up Arrow) - Mid High Point (400, 320) */}
            <div className="absolute top-[246px] left-[376px] w-24 flex flex-col items-center z-10">
              {/* Arrow Icon */}
              <div className="relative w-12 h-12 flex items-end justify-center mb-1">
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm">
                  <path d="M12 2L2 12H7V22H17V12H22L12 2Z" fill="#ff5722" stroke="#475569" strokeWidth="1.5" />
                  <rect x="9" y="14" width="2" height="6" fill="white" opacity="0.5" />
                  <rect x="13" y="16" width="2" height="4" fill="white" opacity="0.5" />
                </svg>
              </div>
              <span className="font-bold text-[12px] text-slate-800">Progress</span>
              <span className="text-[10px] text-slate-600 text-center leading-tight">Tracking measurable growth.</span>
            </div>

            {/* 6. Validation (Puzzle) - Top Right Curve (580, 280) */}
            <div className="absolute top-[266px] left-[570px] w-24 flex flex-col items-center z-10">
              <div className="flex gap-0 mb-1">
                {/* Puzzle Icon */}
                <svg viewBox="0 0 24 24" className="w-12 h-12">
                  <path d="M19 19H15V19C15 17.9 14.1 17 13 17S11 17.9 11 19V19H7V15H7C8.1 15 9 14.1 9 13S8.1 11 7 11V7H11V7C11 5.9 11.9 5 13 5S15 5.9 15 7V7H19C20.1 7 21 7.9 21 9V17C21 18.1 20.1 19 19 19Z" fill="#fca5a5" stroke="#475569" strokeWidth="1.5" />
                  <path d="M13 17V13M7 13H11" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" />
                </svg>
              </div>
              <span className="font-bold text-[12px] text-slate-800">Validation</span>
              <span className="text-[10px] text-slate-600 text-center leading-tight">Confirming results and alignment.</span>
            </div>

            {/* 7. Success (Target) - End (600, 500) */}
            <div className="absolute top-[442px] left-[492px] w-24 flex flex-col items-center z-10">
              <div className="relative w-14 h-14 mb-1">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#facc15" stroke="#1e293b" strokeWidth="2" />
                  <circle cx="50" cy="50" r="30" fill="#22d3ee" stroke="#1e293b" strokeWidth="2" />
                  <circle cx="50" cy="50" r="10" fill="#ef4444" stroke="#1e293b" strokeWidth="2" />
                  {/* Arrow sticking in */}
                  <path d="M10 90 L45 55" stroke="#1e293b" strokeWidth="4" />
                  <path d="M40 50 L50 60" stroke="#1e293b" strokeWidth="4" />
                  <circle cx="10" cy="90" r="4" fill="#ef4444" stroke="#1e293b" strokeWidth="2" />
                </svg>
              </div>
              <span className="font-bold text-[12px] text-slate-800">Success</span>
              <span className="text-[10px] text-slate-600 text-center leading-tight">Reaching the final goal.</span>
            </div>
          </div>
        </div>

        {/* Bottom teal bar */}
      </div>

    </div>
  );
}
