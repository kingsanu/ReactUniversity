"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, CreditCard, Activity, FileQuestion, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { questions360Service } from "@/services/questions360Service";

interface DashboardStatsData {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  questionsStats: {
    total: number;
    active: number;
    inactive: number;
  };
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch real questions stats
        const questionsData = await questions360Service.getAllQuestions();
        const questions = Array.isArray(questionsData) ? questionsData : [];
        const activeQuestions = questions.filter((q) => q.isActive).length;

        // Mock other data (simulate API delay)
        await new Promise((resolve) => setTimeout(resolve, 800));

        setStats({
          totalUsers: 1247,
          activeSubscriptions: 892,
          totalRevenue: 26450.0,
          questionsStats: {
            total: questions.length,
            active: activeQuestions,
            inactive: questions.length - activeQuestions,
          },
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      subValue: "+12% from last month",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      trend: "up",
    },
    {
      label: "Monthly Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      subValue: "+15% from last month",
      icon: CreditCard,
      color: "text-green-600",
      bg: "bg-green-50/50",
      border: "border-green-100",
      trend: "up",
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubscriptions.toLocaleString(),
      subValue: "72% conversion rate",
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-50/50",
      border: "border-purple-100",
      trend: "up",
    },
    {
      label: "360° Questions",
      value: stats.questionsStats.total.toString(),
      subValue: `${stats.questionsStats.active} active questions`,
      icon: FileQuestion,
      color: "text-orange-600",
      bg: "bg-orange-50/50",
      border: "border-orange-100",
      trend: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`group relative overflow-hidden rounded-2xl border ${item.border} bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
        >
          <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full ${item.bg} opacity-20 blur-2xl transition-transform duration-500 group-hover:scale-150`} />
          
          <div className="relative flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              {item.trend === "up" && (
                <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{item.value}</h3>
              <p className="text-sm font-medium text-gray-500 mt-1">{item.label}</p>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                {item.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {item.subValue}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
