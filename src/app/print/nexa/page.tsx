import React from 'react';

// Mock Data for Visual Dev
const mockData = {
  candidateName: "Maria Paula Mendoza",
  date: "Septiembre 23/2025",
  executiveSummary: "Maria Paula shows two exceptional cognitive markers: Detection of Characteristics = 96% (Exceptional) and Spatial Orientation / Visualization = Exceptional (78%). Her PCA shows high Influence, a service orientation, a strong concern for quality, and low Dominance. In simple terms: she has a keen eye for detail, can visualize in 2D/3D with ease, and relates very well to others — making her an ideal candidate for Architecture, Industrial Design, and programs that combine design with technical precision.",
  steps: [
    { number: 1, text: "Translate LIA and PCA results into clear study recommendations." },
    { number: 2, text: "Prioritize majors (Top-10) with cognitive behavioral justification." },
    { number: 3, text: "Provide an exploration and decision plan (0–12 months) for a student." },
    { number: 4, text: "Deliver an immediate operational plan (8 weeks) and tracking KPIs." },
    { number: 5, text: "Map recommended universities and facilitate immediate application actions." },
  ]
};

export default function NexaValuesPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col items-center gap-8 print:py-0 print:gap-0 print:bg-white">
      
      {/* --- PAGE 1: EXECUTIVE SUMMARY --- */}
      <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden shadow-md print:shadow-none print:w-full print:h-full print:break-after-page">
       <div className="relative h-48 w-full">
         {/* Background SVG Shapes */}
         <div className="absolute inset-0 w-full h-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                {/* Dark Blue Angle */}
                <path d="M0 0 H40 L50 100 H0 Z" fill="#0f172a" />
                {/* Teal Angle */}
                <path d="M30 0 H100 V30 L50 30 L40 0 Z" fill="#008996" /> {/* Top Bar */}
                <path d="M100 30 V35 H55 L65 15 L100 15 Z" fill="#22d3ee" opacity="0.2" /> {/* Decorative Slice */}
            </svg>
            {/* Real Header Bar overlay to match exact design */}
             <div className="absolute top-8 right-0 w-[65%] h-16 bg-[#008996] flex items-center px-8 shadow-sm" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                 <h1 className="text-white font-bold text-3xl tracking-wide">{mockData.candidateName}</h1>
             </div>
             <div className="absolute top-2 right-8">
                 <span className="text-xs font-bold text-slate-800">{mockData.date}</span>
             </div>
         </div>

         {/* Logo Logo Placeholder */}
         <div className="absolute top-12 left-8">
             <div className="flex flex-col">
                 <h2 className="text-5xl font-black text-white tracking-tighter" style={{ lineHeight: 0.8 }}>NEXA</h2>
                 <h3 className="text-xl font-bold text-[#bde9ed]" style={{ letterSpacing: '0.2em' }}>LOGO ACA</h3>
             </div>
         </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="px-12 pt-8 pb-16">
          <h2 className="text-[#008996] text-3xl font-bold mb-8">Executive Summary</h2>

          <div className="flex flex-row gap-12">
              {/* Left Column: Summary Box */}
              <div className="w-1/3">
                  <div className="bg-slate-100/50 rounded-3xl p-8 border border-slate-100">
                      <p className="text-[#0f172a] font-bold text-lg leading-tight mb-4">
                          This report practically integrates the results of Sara Decarlini’s Work Intelligence Assessment (LIA) and Personal Competences Analysis (PCA).
                      </p>
                      <p className="text-[#008996] font-bold text-sm leading-snug">
                          The structure provides a clear presentation and an appropriate level of detail, with a practical focus designed to support students.
                      </p>
                  </div>
                  
                  {/* Illustration Placeholder */}
                  <div className="mt-8 flex justify-center">
                     <div className="w-48 h-48 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden">
                         <span className="text-orange-400 font-bold text-xs">[Illustration]</span>
                         {/* We can add a real SVG avatar here later */}
                     </div>
                  </div>
                  <div className="mt-4 bg-[#008996] rounded-full py-2 px-6 text-center shadow-lg mx-auto w-max">
                      <span className="text-white font-bold text-sm">Influence / Technical precision</span>
                  </div>
              </div>

              {/* Right Column: Text & Steps */}
              <div className="w-2/3">
                  <p className="text-slate-600 text-sm leading-relaxed mb-12 text-justify">
                      {mockData.executiveSummary}
                  </p>

                  <div className="space-y-6">
                      {mockData.steps.map((step) => (
                          <div key={step.number} className="flex flex-row items-center gap-6">
                              <div className="min-w-[50px]">
                                  <span className="text-[#bde9ed] font-black text-6xl leading-none">{step.number}</span>
                              </div>
                              <div className="border-l-2 border-[#bde9ed] pl-6 py-1">
                                  <p className="text-[#0f172a] font-bold text-sm leading-tight">
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
      <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden shadow-md print:shadow-none print:w-full print:h-full print:break-after-page flex flex-col pt-12 px-12 pb-12">
          {/* Header Repeat (Optional, mostly clean in PDF) */}
          <div className="flex justify-between items-end border-b-4 border-[#008996] pb-4 mb-12">
              <span className="text-slate-500 text-xs font-bold">{mockData.candidateName}</span>
              <span className="text-slate-400 text-xs">{mockData.date}</span>
          </div>

          <h2 className="text-[#008996] text-2xl font-bold mb-2">1. Operational meaning of the LIA subtests</h2>
          <p className="text-slate-500 text-sm mb-12">Summary applied to the student</p>

          <div className="flex flex-col gap-6">
              {[
                { title: "Detection of characteristics", desc: "Identifies errors, patterns and details; agile learning and precise execution — key for quality control and project review.", icon: "glasses" },
                { title: "Reasoning", desc: "Verbal fluency and logical analysis: Useful for argumentation, problem solving and presenting proposals.", icon: "gears" },
                { title: "Numerical speed and accuracy", desc: "Agility for practical calculations; sufficient for basic technical tasks.", icon: "calc" },
                { title: "Working memory", desc: "Retention and manipulation of information; for Sara it is adequate, and it is advisable to support it with tools.", icon: "puzzle" },
                { title: "Orientation / General visualization", desc: "Mental rotation, interpretation of plans and 3D prototyping — a differentiating ability for spatially oriented majors.", icon: "compass" },
              ].map((item, i) => (
                  <div key={i} className="flex flex-row items-center bg-slate-50 rounded-[40px] p-4 pr-8 gap-8 shadow-sm">
                      <div className="w-20 h-20 rounded-full bg-white border-4 border-[#e2e8f0] flex items-center justify-center shrink-0">
                          {/* Placeholder Icon */}
                          <div className="w-10 h-10 bg-[#008996]/20 rounded-full flex items-center justify-center">
                              <span className="text-[#008996] text-[10px] font-bold">{item.icon.toUpperCase()}</span>
                          </div>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="text-[#0f172a] font-bold text-sm mb-1">{item.title}</h3>
                         <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* --- PAGE 3: DIAGNOSIS & MAJORS --- */}
      <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden shadow-md print:shadow-none print:w-full print:h-full print:break-after-page flex flex-col pt-12 px-12 pb-12">
          {/* Header Repeat */}
          <div className="flex justify-between items-end border-b-4 border-[#008996] pb-4 mb-12">
              <span className="text-slate-500 text-xs font-bold">{mockData.candidateName}</span>
              <span className="text-slate-400 text-xs">{mockData.date}</span>
          </div>

          <h2 className="text-[#008996] text-2xl font-bold mb-2">2. Integrated diagnosis (MIL+PCA)</h2>
          <p className="text-slate-500 text-sm mb-8">Strengths and risks</p>

          {/* DIAGNOSIS CONTENT */}
          <div className="bg-slate-100 rounded-3xl p-8 mb-12 flex flex-row gap-12 items-center">
              {/* Custom Donut Chart Visualization */}
              <div className="relative w-64 h-64 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* Segments - Simplified for template */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="20" />
                      {/* Segment 1 (Blue) */}
                      <path d="M50 50 L90 50 A40 40 0 0 1 50 90 Z" fill="#0f172a" />
                      {/* Segment 2 (Teal) */}
                      <path d="M50 50 L50 90 A40 40 0 0 1 10 50 Z" fill="#008996" />
                      {/* Segment 3 (Cyan) */}
                      <path d="M50 50 L10 50 A40 40 0 0 1 30 15 Z" fill="#22d3ee" />
                      
                      {/* Center */}
                      <circle cx="50" cy="50" r="15" fill="#fff" />
                  </svg>
                  {/* Labels overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg">♟️</span>
                  </div>
                  {/* Outer dashed ring decoration */}
                  <div className="absolute inset-0 border-2 border-dashed border-slate-400 rounded-full scale-110" />
              </div>

              {/* Legend List */}
              <div className="flex flex-col gap-4 flex-1">
                 {[
                     { l: "A", title: "Strengths", desc: "She quickly detects details and communicates very well with others.", bg: "bg-[#0f172a]" },
                     { l: "B", title: "Opportunities", desc: "Her reasoning and verbal skills are good and can grow even more.", bg: "bg-[#008996]" },
                     { l: "C", title: "Stable Areas", desc: "Her memory works well when information is clear and organized.", bg: "bg-[#22d3ee]" },
                     { l: "D", title: "Risks", desc: "She may struggle to make firm decisions in difficult situations.", bg: "bg-[#fb923c]" },
                 ].map((item, i) => (
                    <div key={i} className="flex flex-row items-stretch border-b border-slate-300 pb-2">
                        <div className={`${item.bg} w-10 flex items-center justify-center text-white font-bold text-lg mr-4`}>
                            {item.l}
                        </div>
                        <div>
                            <span className={`font-bold text-xs ${item.bg.replace('bg-', 'text-')}`}>{item.title}: </span>
                            <span className="text-slate-600 text-xs">{item.desc}</span>
                        </div>
                    </div>
                 ))}
              </div>
          </div>

          <h2 className="text-[#008996] text-2xl font-bold mb-4">3. Prioritized top majors</h2>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider">LIA fit (detection + orientation) and PCA (influence, service, quality)</p>

          <div className="space-y-6">
               <div>
                   <h3 className="text-[#008996] font-bold text-sm mb-2 border-b border-[#008996]/30 pb-1">Perfect fit</h3>
                   <ul className="list-decimal list-inside text-xs space-y-2 text-slate-700 font-medium">
                       <li><span className="font-bold">Architecture:</span> Spatial visualization + portfolio from the start; client interaction.</li>
                       <li><span className="font-bold">Industrial Design / Product Design:</span> 3D prototyping, testing and product improvement.</li>
                       <li><span className="font-bold">Civil Engineering:</span> (project design and supervision): plan reading, site control and technical management.</li>
                   </ul>
               </div>

               <div>
                   <h3 className="text-[#22d3ee] font-bold text-sm mb-2 border-b border-[#22d3ee]/30 pb-1">Highly recommended</h3>
                   <ul className="list-decimal list-inside text-xs space-y-2 text-slate-700">
                       <li>Interior Architecture / Interior Design</li>
                       <li>Mechanical Engineering (design and prototyping)</li>
                       <li>Materials Engineering / Materials Science</li>
                   </ul>
               </div>
          </div>

      </div>

    </div>
  );
}
