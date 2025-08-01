import { useState, useEffect } from "react";
import {
  getAllMILExams,
  MILExamMetadata,
  loadMILSession,
} from "@/services/milService";

export interface MILProgress {
  completedExams: string[];
  totalExams: number;
  isCompleted: boolean;
  lastUpdated: string;
}

export function useMILData() {
  const [exams, setExams] = useState<MILExamMetadata[]>([]);
  const [progress, setProgress] = useState<MILProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMILData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load available exams
      const examData = await getAllMILExams();
      setExams(examData);

      // Load progress from localStorage
      const completedExams = JSON.parse(
        localStorage.getItem("mil_completed_exams") || "[]"
      );

      const progressData: MILProgress = {
        completedExams,
        totalExams: examData.length,
        isCompleted: completedExams.length === examData.length,
        lastUpdated: new Date().toISOString(),
      };

      setProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load MIL data");
    } finally {
      setLoading(false);
    }
  };

  const markExamCompleted = (examId: string) => {
    if (!progress) return;

    const updatedCompleted = [...progress.completedExams, examId];
    const updatedProgress: MILProgress = {
      ...progress,
      completedExams: updatedCompleted,
      isCompleted: updatedCompleted.length === progress.totalExams,
      lastUpdated: new Date().toISOString(),
    };

    setProgress(updatedProgress);
    localStorage.setItem(
      "mil_completed_exams",
      JSON.stringify(updatedCompleted)
    );
  };

  const clearMILProgress = () => {
    localStorage.removeItem("mil_completed_exams");
    // Clear all exam sessions
    exams.forEach((exam) => {
      localStorage.removeItem(`mil_session_${exam.id}`);
    });

    setProgress({
      completedExams: [],
      totalExams: exams.length,
      isCompleted: false,
      lastUpdated: new Date().toISOString(),
    });
  };

  const getExamProgress = (examId: string) => {
    const session = loadMILSession(examId);
    return {
      isStarted: !!session,
      isCompleted: session?.isCompleted || false,
      currentQuestion: session?.currentQuestion || 0,
      totalAnswers: session?.answers.length || 0,
    };
  };

  const getOverallScore = () => {
    if (!progress || progress.completedExams.length === 0) return 0;

    // Calculate average score across completed exams
    // This is a placeholder - implement based on actual scoring logic
    return Math.round(
      (progress.completedExams.length / progress.totalExams) * 100
    );
  };

  useEffect(() => {
    loadMILData();
  }, []);

  return {
    exams,
    progress,
    loading,
    error,
    loadMILData,
    markExamCompleted,
    clearMILProgress,
    getExamProgress,
    getOverallScore,
    hasMIL: !!progress && progress.completedExams.length > 0,
    isCompleted: progress?.isCompleted || false,
  };
}
