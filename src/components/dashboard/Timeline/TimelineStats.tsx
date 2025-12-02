"use client";

import React from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Activity,
  ClipboardCheck,
  Brain,
  Users,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TimelineStats as TimelineStatsType } from "@/types/timeline";
import { useGlobalStore } from "@/store/useGlobalStore";
import { format, formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface TimelineStatsProps {
  stats?: TimelineStatsType;
  isLoading?: boolean;
}

/**
 * Stat card component
 */
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, subValue, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                color
              )}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">{label}</p>
              <p className="text-xl font-bold">{value}</p>
              {subValue && (
                <p className="text-xs text-muted-foreground truncate">{subValue}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Progress ring component
 */
function ProgressRing({ progress, size = 80, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{progress}%</span>
      </div>
    </div>
  );
}

/**
 * Assessment breakdown item
 */
interface BreakdownItemProps {
  icon: React.ElementType;
  label: string;
  status: string;
  detail: string;
  color: string;
  isCompleted: boolean;
}

function BreakdownItem({ icon: Icon, label, status, detail, color, isCompleted }: BreakdownItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isCompleted ? "bg-emerald-100 dark:bg-emerald-900/30" : color
        )}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{detail}</p>
      </div>
      <span
        className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-full",
          isCompleted
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : status === "in_progress"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        )}
      >
        {status === "completed"
          ? "✓"
          : status === "in_progress"
          ? "..."
          : "—"}
      </span>
    </div>
  );
}

/**
 * Main Timeline Stats Component
 */
export function TimelineStats({ stats, isLoading }: TimelineStatsProps) {
  const { language } = useGlobalStore();
  const locale = language === "spanish" ? es : enUS;

  if (isLoading) {
    return <TimelineStatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  const lastActivity = stats.recentActivity.lastActivityDate
    ? formatDistanceToNow(new Date(stats.recentActivity.lastActivityDate), {
        addSuffix: true,
        locale,
      })
    : language === "spanish"
    ? "Sin actividad"
    : "No activity";

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label={language === "spanish" ? "Progreso General" : "Overall Progress"}
          value={`${stats.overallCompletion.percentage}%`}
          subValue={`${stats.overallCompletion.completedAssessments}/${stats.overallCompletion.totalAssessments} ${
            language === "spanish" ? "evaluaciones" : "assessments"
          }`}
          color="bg-primary"
          delay={0}
        />
        <StatCard
          icon={Activity}
          label={language === "spanish" ? "Última Actividad" : "Last Activity"}
          value={lastActivity}
          color="bg-blue-500"
          delay={0.1}
        />
        <StatCard
          icon={Clock}
          label={language === "spanish" ? "Esta Semana" : "This Week"}
          value={stats.recentActivity.eventsThisWeek}
          subValue={language === "spanish" ? "eventos" : "events"}
          color="bg-amber-500"
          delay={0.2}
        />
        <StatCard
          icon={CheckCircle2}
          label={language === "spanish" ? "Este Mes" : "This Month"}
          value={stats.recentActivity.eventsThisMonth}
          subValue={language === "spanish" ? "eventos" : "events"}
          color="bg-emerald-500"
          delay={0.3}
        />
      </div>

      {/* Assessment Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Progress Ring */}
              <div className="flex flex-col items-center justify-center gap-2 lg:pr-6 lg:border-r">
                <ProgressRing progress={stats.overallCompletion.percentage} />
                <p className="text-sm font-medium text-center">
                  {language === "spanish" ? "Completado" : "Completed"}
                </p>
              </div>

              {/* Breakdown List */}
              <div className="flex-1 divide-y dark:divide-gray-800">
                <BreakdownItem
                  icon={ClipboardCheck}
                  label="PCA"
                  status={stats.assessmentBreakdown.pca.status}
                  detail={
                    stats.assessmentBreakdown.pca.score
                      ? `${language === "spanish" ? "Puntuación" : "Score"}: ${stats.assessmentBreakdown.pca.score}%`
                      : language === "spanish"
                      ? "Análisis de Competencias"
                      : "Competence Analysis"
                  }
                  color="bg-violet-100 dark:bg-violet-900/30"
                  isCompleted={stats.assessmentBreakdown.pca.status === "completed"}
                />
                <BreakdownItem
                  icon={Brain}
                  label="LIA"
                  status={stats.assessmentBreakdown.mil.status}
                  detail={`${stats.assessmentBreakdown.mil.completedSubtests}/${stats.assessmentBreakdown.mil.totalSubtests} subtests${
                    stats.assessmentBreakdown.mil.averageScore
                      ? ` • ${stats.assessmentBreakdown.mil.averageScore.toFixed(0)}% avg`
                      : ""
                  }`}
                  color="bg-cyan-100 dark:bg-cyan-900/30"
                  isCompleted={stats.assessmentBreakdown.mil.status === "completed"}
                />
                <BreakdownItem
                  icon={Users}
                  label="360°"
                  status={stats.assessmentBreakdown.evaluation.status}
                  detail={`${stats.assessmentBreakdown.evaluation.completedEvaluations}/${stats.assessmentBreakdown.evaluation.totalEvaluators} ${
                    language === "spanish" ? "evaluaciones" : "evaluations"
                  }`}
                  color="bg-orange-100 dark:bg-orange-900/30"
                  isCompleted={stats.assessmentBreakdown.evaluation.status === "completed"}
                />
                <BreakdownItem
                  icon={BookOpen}
                  label={language === "spanish" ? "Cursos" : "Courses"}
                  status={
                    stats.assessmentBreakdown.courses.completed > 0
                      ? "in_progress"
                      : "not_started"
                  }
                  detail={`${stats.assessmentBreakdown.courses.completed} ${
                    language === "spanish" ? "completados" : "completed"
                  } • ${stats.assessmentBreakdown.courses.inProgress} ${
                    language === "spanish" ? "en progreso" : "in progress"
                  }`}
                  color="bg-teal-100 dark:bg-teal-900/30"
                  isCompleted={stats.assessmentBreakdown.courses.completed > 0}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

/**
 * Loading skeleton
 */
function TimelineStatsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

export default TimelineStats;
