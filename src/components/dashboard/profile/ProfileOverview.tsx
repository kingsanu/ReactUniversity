"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FiAward, FiBookOpen, FiBriefcase, FiTrendingUp, FiArrowUpRight, FiClock, FiStar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileOverview() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Left Column - Main Details */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* About Me Card - Hero Style */}
        <motion.div variants={item}>
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900 rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full transition-all group-hover:scale-110" />
            
            <CardHeader className="relative px-8 pt-8 pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                About Me <span className="text-2xl">👋</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 relative z-10">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">
                Passionate Product Designer with over 5 years of experience in building user-centric digital products. 
                I specialize in <span className="font-medium text-gray-900 dark:text-gray-100">UI/UX design</span>, 
                design systems, and prototyping. Currently focusing on bringing AI-powered experiences to life.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {["UI/UX", "Product Design", "React", "Figma", "Design Systems"].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                        {skill}
                    </span>
                ))}
            </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Growth */}
        <motion.div variants={item}>
          <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 rounded-3xl p-2">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <FiTrendingUp className="mr-2 text-green-500" /> Current Competencies
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="space-y-8">
                {[
                    { label: "Advanced React Patterns", val: 78, color: "bg-blue-600" },
                    { label: "System Design", val: 55, color: "bg-indigo-600" },
                    { label: "UI Animation", val: 92, color: "bg-purple-600" }
                ].map((skill) => (
                    <div key={skill.label}>
                        <div className="flex justify-between mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <span>{skill.label}</span>
                            <span>{skill.val}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.val}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={cn("h-full rounded-full", skill.color)} 
                            />
                        </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Column - Stats & Activity */}
      <div className="space-y-8">
        
        {/* Stats Grid - Glass Cards */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {[
              { label: "Courses Completed", value: "12", icon: FiBookOpen, gradient: "from-blue-500 to-cyan-500", text: "text-blue-50" },
              { label: "Applications", value: "5", icon: FiBriefcase, gradient: "from-violet-500 to-purple-500", text: "text-purple-50" },
              { label: "Certificates", value: "8", icon: FiAward, gradient: "from-orange-400 to-pink-500", text: "text-orange-50" },
          ].map((stat, i) => (
             <div key={i} className={cn("relative overflow-hidden rounded-2xl p-6 text-white shadow-lg group transition-all hover:scale-[1.02]", "bg-gradient-to-br " + stat.gradient)}>
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className={cn("text-xs font-semibold uppercase tracking-wider mb-1", stat.text)}>{stat.label}</p>
                        <h3 className="text-3xl font-extrabold">{stat.value}</h3>
                    </div>
                    <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                        <stat.icon size={20} className="text-white" />
                    </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"/>
             </div>
          ))}
        </motion.div>

        {/* Recent Activity Timeline - Clean */}
        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                 <FiClock className="mr-2 text-gray-400" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 relative">
                {/* Vertical Line - Centered with icon (w-8 = 32px, center 16px. Line w-0.5 = 2px. Left 15px) */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700" />
                
                {[
                    { title: "Completed 'Advanced UI Design'", desc: "Scored 98% in final assessment", date: "2d ago", icon: FiStar, bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
                    { title: "Applied for 'Senior UX Role'", desc: "Application sent to Google", date: "1w ago", icon: FiBriefcase, bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
                    { title: "Profile Updated", desc: "Added new portfolio links", date: "2w ago", icon: FiUser, bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" },
                ].map((activity, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors relative z-10 group cursor-pointer">
                        <div className={cn("shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-gray-50 dark:ring-gray-900", activity.bg, activity.text)}>
                            <activity.icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                                {activity.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">{activity.desc}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 self-start">{activity.date}</span>
                    </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-4 text-xs font-semibold text-gray-500 hover:text-gray-900">
                View All Activity <FiArrowUpRight className="ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Helper component for icon
function FiUser(props: any) {
    return <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
}
