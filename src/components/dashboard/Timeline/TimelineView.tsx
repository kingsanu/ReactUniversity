"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ClipboardCheck,
  Brain,
  Users,
  BookOpen,
  Play,
  Check,
  Clock,
  Mail,
  UserPlus,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TimelineEvent,
  TimelineViewProps,
  TimelineIcon,
  TimelineColor,
  AssessmentType,
} from "@/types/timeline";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useGlobalStore } from "@/store/useGlobalStore";

/**
 * Icon mapping for timeline events
 */
const IconMap: Record<TimelineIcon, React.ElementType> = {
  "clipboard-check": ClipboardCheck,
  brain: Brain,
  users: Users,
  "book-open": BookOpen,
  play: Play,
  check: Check,
  clock: Clock,
  mail: Mail,
  "user-plus": UserPlus,
  "graduation-cap": GraduationCap,
};

/**
 * Color classes for different timeline colors
 */
const colorClasses: Record<
  TimelineColor,
  { bg: string; border: string; text: string; dot: string }
> = {
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  yellow: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-900/30",
    border: "border-gray-200 dark:border-gray-700",
    text: "text-gray-600 dark:text-gray-400",
    dot: "bg-gray-400",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-400",
    dot: "bg-purple-500",
  },
};

/**
 * Assessment type badge styles
 */
const typeBadgeStyles: Record<
  AssessmentType,
  { bg: string; text: string; label: { en: string; sp: string } }
> = {
  pca: {
    bg: "bg-violet-100 dark:bg-violet-900/40",
    text: "text-violet-700 dark:text-violet-300",
    label: { en: "PCA", sp: "PCA" },
  },
  mil: {
    bg: "bg-cyan-100 dark:bg-cyan-900/40",
    text: "text-cyan-700 dark:text-cyan-300",
    label: { en: "LIA", sp: "LIA" },
  },
  evaluation: {
    bg: "bg-orange-100 dark:bg-orange-900/40",
    text: "text-orange-700 dark:text-orange-300",
    label: { en: "360°", sp: "360°" },
  },
  course: {
    bg: "bg-teal-100 dark:bg-teal-900/40",
    text: "text-teal-700 dark:text-teal-300",
    label: { en: "Course", sp: "Curso" },
  },
};

/**
 * Format date for display
 */
function formatEventDate(
  dateString: string,
  language: "english" | "spanish"
): string {
  const date = new Date(dateString);
  const locale = language === "spanish" ? es : enUS;

  if (isToday(date)) {
    return language === "spanish" ? "Hoy" : "Today";
  }
  if (isYesterday(date)) {
    return language === "spanish" ? "Ayer" : "Yesterday";
  }

  return format(date, "MMM d, yyyy", { locale });
}

/**
 * Format time for display
 */
function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "h:mm a");
}

/**
 * Get relative time
 */
function getRelativeTime(
  dateString: string,
  language: "english" | "spanish"
): string {
  const date = new Date(dateString);
  const locale = language === "spanish" ? es : enUS;
  return formatDistanceToNow(date, { addSuffix: true, locale });
}

/**
 * Single timeline event card
 */
interface TimelineEventCardProps {
  event: TimelineEvent;
  isLast?: boolean;
  onClick?: () => void;
}

function TimelineEventCard({ event, isLast, onClick }: TimelineEventCardProps) {
  const { language } = useGlobalStore();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const IconComponent = IconMap[event.icon] || Check;
  const colors = colorClasses[event.color];
  const typeStyle = typeBadgeStyles[event.type];
  const langKey = language === "spanish" ? "sp" : "en";

  const hasMetadata = event.metadata && Object.keys(event.metadata).length > 0;

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Timeline dot */}
      <div
        className={cn(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
          colors.bg,
          colors.border
        )}
      >
        <IconComponent className={cn("h-5 w-5", colors.text)} />
      </div>

      {/* Event content */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "flex-1 rounded-lg border p-4 transition-all hover:shadow-md cursor-pointer",
          colors.bg,
          colors.border
        )}
        onClick={() => onClick?.() || setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type badge */}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                typeStyle.bg,
                typeStyle.text
              )}
            >
              {typeStyle.label[langKey]}
            </span>

            {/* Status indicator */}
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                colors.text
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
              {event.status === "completed"
                ? language === "spanish"
                  ? "Completado"
                  : "Completed"
                : event.status === "in_progress"
                ? language === "spanish"
                  ? "En Progreso"
                  : "In Progress"
                : language === "spanish"
                ? "No Iniciado"
                : "Not Started"}
            </span>
          </div>

          {/* Expand button */}
          {hasMetadata && (
            <button
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
        </div>

        {/* Title & Description */}
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {event.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {event.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
          <span>{formatEventDate(event.timestamp, language)}</span>
          <span>•</span>
          <span>{formatEventTime(event.timestamp)}</span>
          <span className="text-gray-400">
            ({getRelativeTime(event.timestamp, language)})
          </span>
        </div>

        {/* Expanded metadata */}
        <AnimatePresence>
          {isExpanded && hasMetadata && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <EventMetadata event={event} language={language} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/**
 * Event metadata display
 */
function EventMetadata({
  event,
  language,
}: {
  event: TimelineEvent;
  language: "english" | "spanish";
}) {
  const metadata = event.metadata as any;

  if (event.type === "mil") {
    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {metadata.scorePercentage !== undefined && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Puntuación" : "Score"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.scorePercentage.toFixed(1)}%
            </span>
          </div>
        )}
        {metadata.accuracyPercentage !== undefined && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Precisión" : "Accuracy"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.accuracyPercentage.toFixed(1)}%
            </span>
          </div>
        )}
        {metadata.correctAnswers !== undefined && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Correctas" : "Correct"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.correctAnswers}/{metadata.totalQuestions}
            </span>
          </div>
        )}
        {metadata.timeSpent && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Tiempo" : "Time"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.timeSpent}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (event.type === "evaluation") {
    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {metadata.evaluatorName && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Evaluador" : "Evaluator"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.evaluatorName}
            </span>
          </div>
        )}
        {metadata.relation && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Relación" : "Relation"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.relation}
            </span>
          </div>
        )}
        {metadata.groupType && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Tipo" : "Type"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.groupType}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (event.type === "pca") {
    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {metadata.overallScore !== undefined && (
          <div className="col-span-2">
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Puntuación General" : "Overall Score"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.overallScore}%
            </span>
          </div>
        )}
        {metadata.scores && (
          <>
            <div>
              <span className="text-gray-500 dark:text-gray-400">D:</span>
              <span className="ml-2 font-medium">
                {metadata.scores.dominance}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">I:</span>
              <span className="ml-2 font-medium">
                {metadata.scores.influence}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">S:</span>
              <span className="ml-2 font-medium">
                {metadata.scores.steadiness}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">C:</span>
              <span className="ml-2 font-medium">
                {metadata.scores.conscientiousness}
              </span>
            </div>
          </>
        )}
        {metadata.pcaCod && (
          <div className="col-span-2">
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Código" : "Code"}:
            </span>
            <span className="ml-2 font-mono text-xs text-gray-700 dark:text-gray-300">
              {metadata.pcaCod}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (event.type === "course") {
    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {metadata.courseTitle && (
          <div className="col-span-2">
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Curso" : "Course"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.courseTitle}
            </span>
          </div>
        )}
        {metadata.progress !== undefined && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Progreso" : "Progress"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.progress.toFixed(0)}%
            </span>
          </div>
        )}
        {metadata.completedModules !== undefined && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {language === "spanish" ? "Módulos" : "Modules"}:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {metadata.completedModules}/{metadata.totalModules}
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
}

/**
 * Group events by date
 */
function groupEventsByDate(
  events: TimelineEvent[],
  language: "english" | "spanish"
): { date: string; events: TimelineEvent[] }[] {
  const groups: Map<string, TimelineEvent[]> = new Map();

  events.forEach((event) => {
    const date = new Date(event.timestamp);
    const dateKey = format(date, "yyyy-MM-dd");
    const displayDate = formatEventDate(event.timestamp, language);

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(event);
  });

  return Array.from(groups.entries())
    .map(([dateKey, events]) => ({
      date: formatEventDate(events[0].timestamp, language),
      events,
    }))
    .sort(
      (a, b) =>
        new Date(b.events[0].timestamp).getTime() -
        new Date(a.events[0].timestamp).getTime()
    );
}

/**
 * Main Timeline View Component
 */
export function TimelineView({
  events,
  isLoading,
  onEventClick,
}: TimelineViewProps) {
  const { language } = useGlobalStore();

  if (isLoading) {
    return <TimelineViewSkeleton />;
  }

  if (!events || events.length === 0) {
    return <TimelineEmptyState language={language} />;
  }

  const groupedEvents = groupEventsByDate(events, language);

  return (
    <div className="space-y-8">
      {groupedEvents.map((group, groupIndex) => (
        <div key={group.date}>
          {/* Date header */}
          <div className="sticky top-0 z-20 mb-4 flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 px-2 py-1 rounded">
              {group.date}
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Events for this date */}
          <div className="pl-2">
            {group.events.map((event, eventIndex) => (
              <TimelineEventCard
                key={event.id}
                event={event}
                isLast={
                  groupIndex === groupedEvents.length - 1 &&
                  eventIndex === group.events.length - 1
                }
                onClick={() => onEventClick?.(event)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton
 */
function TimelineViewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {[1, 2, 3].map((group) => (
        <div key={group}>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="pl-2 space-y-6">
            {[1, 2].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 h-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state
 */
function TimelineEmptyState({ language }: { language: "english" | "spanish" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {language === "spanish"
          ? "No hay eventos en la línea de tiempo"
          : "No timeline events"}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        {language === "spanish"
          ? "Completa evaluaciones y cursos para ver tu progreso aquí."
          : "Complete assessments and courses to see your progress here."}
      </p>
    </div>
  );
}

export default TimelineView;
