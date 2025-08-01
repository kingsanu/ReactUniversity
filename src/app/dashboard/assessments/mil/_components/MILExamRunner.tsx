"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MILExamId,
  startMILExam,
  MILExam,
  MILQuestion,
  MILSession,
  MILAnswer,
  saveMILSession,
  loadMILSession,
  clearMILSession,
  formatTime,
  setupTabFocusMonitoring,
  submitMILExam,
  completeMILExam,
} from "@/services/milService";
import { useGlobalStore } from "@/store/useGlobalStore";

interface MILExamRunnerProps {
  examId: MILExamId;
  onComplete: () => void;
  onBack: () => void;
}

export default function MILExamRunner({
  examId,
  onComplete,
  onBack,
}: MILExamRunnerProps) {
  const [exam, setExam] = useState<MILExam | null>(null);
  const [session, setSession] = useState<MILSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tabViolations, setTabViolations] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [showViolationToast, setShowViolationToast] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useGlobalStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupTabMonitoringRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    initializeExam();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cleanupTabMonitoringRef.current) cleanupTabMonitoringRef.current();
    };
  }, [examId]);

  useEffect(() => {
    if (session && exam) {
      startTimer();
      setupTabMonitoring();
    }
  }, [session, exam]);

  const initializeExam = async () => {
    try {
      setLoading(true);

      // Check for existing session
      const existingSession = loadMILSession(examId);
      if (existingSession && !existingSession.isCompleted) {
        const examData = await startMILExam(examId);
        setExam(examData);
        setSession(existingSession);
        setCurrentQuestionIndex(existingSession.currentQuestion);

        // Calculate remaining time
        const elapsed = Math.floor(
          (Date.now() - new Date(existingSession.startTime).getTime()) / 1000
        );
        const remaining = Math.max(0, examData.timeLimitMinutes * 60 - elapsed);
        setTimeRemaining(remaining);
      } else {
        // Start new exam
        const examData = await startMILExam(examId);
        const newSession: MILSession = {
          examId,
          startTime: new Date().toISOString(),
          answers: [],
          currentQuestion: 0,
          isCompleted: false,
        };

        setExam(examData);
        setSession(newSession);
        setTimeRemaining(examData.timeLimitMinutes * 60);
        saveMILSession(newSession);
      }

      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error("Failed to initialize exam:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const setupTabMonitoring = () => {
    const cleanup = setupTabFocusMonitoring(
      () => {
        setIsTabActive(false);
        if (!showTabWarning) {
          setTabViolations((prev) => {
            const newCount = prev + 1;
            setShowViolationToast(true);
            setTimeout(() => setShowViolationToast(false), 3000);

            if (newCount >= 3) {
              setTimeout(() => handleTabViolationRestart(), 2000);
            }

            return newCount;
          });
          setShowTabWarning(true);
        }
      },
      () => {
        setIsTabActive(true);
        setTimeout(() => setShowTabWarning(false), 1000);
      }
    );

    cleanupTabMonitoringRef.current = cleanup;
  };

  const handleTabViolationRestart = () => {
    if (session) {
      clearMILSession(session.examId);
      // Silently restart - no user alert needed
      window.location.reload();
    }
  };

  const handleTimeUp = useCallback(async () => {
    if (session && !session.isCompleted) {
      try {
        setIsSubmitting(true);

        const updatedSession: MILSession = {
          ...session,
          isCompleted: true,
        };
        saveMILSession(updatedSession);

        // Time expired - silently complete
      } catch (error) {
        console.error("Failed to submit time-expired exam:", error);
        // Time expired - silently complete
      } finally {
        setIsSubmitting(false);
      }
    }

    onComplete();
  }, [session, user.id, onComplete]);

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
  };

  const handleContinue = async () => {
    if (!session || !exam || selectedAnswer === null) return;

    const timeSpent = Date.now() - questionStartTime;
    const answer: MILAnswer = {
      questionNumber: currentQuestionIndex + 1,
      answer: selectedAnswer,
      timeSpent,
      timestamp: new Date().toISOString(),
    };

    const updatedAnswers = [...session.answers];
    updatedAnswers[currentQuestionIndex] = answer;

    const updatedSession: MILSession = {
      ...session,
      answers: updatedAnswers,
      currentQuestion: currentQuestionIndex + 1,
      isCompleted: currentQuestionIndex + 1 >= exam.questions.length,
    };

    setSession(updatedSession);
    saveMILSession(updatedSession);

    // If this is the last question, submit the exam
    if (currentQuestionIndex + 1 >= exam.questions.length) {
      if (user?.id) {
        try {
          setIsSubmitting(true);
          await submitMILExam(updatedSession, user.id);
        } catch (error) {
          console.error("Failed to submit exam:", error);
          // Silently continue - no user alert needed
        } finally {
          setIsSubmitting(false);
        }
      }

      onComplete();
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    }
  };

  const renderLetterPairs = (question: MILQuestion) => {
    if (!question.data.letterPairs) return null;

    return (
      <div className="max-w-2xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
        >
          {/* Top Row */}
          <div className="grid grid-cols-4 gap-8 mb-8">
            {question.data.letterPairs.map((pair, index) => (
              <motion.div
                key={`top-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02, duration: 0.05 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-gray-800 font-mono tracking-wider drop-shadow-sm">
                  {pair.topLetter}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.1 }}
            className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-8"
          />

          {/* Bottom Row */}
          <div className="grid grid-cols-4 gap-8">
            {question.data.letterPairs.map((pair, index) => (
              <motion.div
                key={`bottom-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.02, duration: 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-gray-800 font-mono tracking-wider drop-shadow-sm">
                  {pair.bottomLetter}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!exam || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Assessment Error
          </h3>
          <p className="text-gray-600 mb-4">Failed to load assessment</p>
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Violation Toast Notification */}
      <AnimatePresence>
        {showViolationToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed top-4 right-4 z-50"
          >
            <div
              className={`rounded-xl p-4 shadow-lg border-l-4 backdrop-blur-sm ${
                tabViolations >= 3
                  ? "bg-red-50/90 border-red-500"
                  : tabViolations >= 2
                  ? "bg-orange-50/90 border-orange-500"
                  : "bg-yellow-50/90 border-yellow-500"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className={`w-5 h-5 mr-3 ${
                    tabViolations >= 3
                      ? "text-red-600"
                      : tabViolations >= 2
                      ? "text-orange-600"
                      : "text-yellow-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p
                    className={`font-medium ${
                      tabViolations >= 3
                        ? "text-red-900"
                        : tabViolations >= 2
                        ? "text-orange-900"
                        : "text-yellow-900"
                    }`}
                  >
                    {tabViolations >= 3
                      ? "Assessment Restarting"
                      : `Tab Switch Warning (${tabViolations}/3)`}
                  </p>
                  <p
                    className={`text-sm ${
                      tabViolations >= 3
                        ? "text-red-700"
                        : tabViolations >= 2
                        ? "text-orange-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {tabViolations >= 3
                      ? "Too many violations. Restarting..."
                      : "Stay focused on the assessment"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Warning Modal */}
      <AnimatePresence>
        {(showTabWarning || !isTabActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="bg-white rounded-2xl p-8 text-center max-w-md shadow-2xl border"
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  tabViolations >= 3
                    ? "bg-red-100"
                    : tabViolations >= 2
                    ? "bg-orange-100"
                    : "bg-yellow-100"
                }`}
              >
                <svg
                  className={`w-8 h-8 ${
                    tabViolations >= 3
                      ? "text-red-600"
                      : tabViolations >= 2
                      ? "text-orange-600"
                      : "text-yellow-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {tabViolations >= 3
                  ? "Assessment Restarting"
                  : "Return to Assessment"}
              </h3>

              <p className="text-gray-600 mb-6">
                {tabViolations >= 3
                  ? "You have exceeded the maximum number of tab switches. The assessment will restart automatically."
                  : "Please return to the assessment tab to continue. Switching tabs during the assessment is not allowed."}
              </p>

              {tabViolations < 3 && (
                <p className="text-sm text-gray-500">
                  Warning {tabViolations}/3 - After 3 warnings, the assessment
                  will restart.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {exam.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {exam.questions.length}
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-100"
                  />
                </div>
                <span className="text-sm text-gray-600 min-w-[60px]">
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Violation Counter */}
              {tabViolations > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    tabViolations >= 3
                      ? "bg-red-100 text-red-800"
                      : tabViolations >= 2
                      ? "bg-orange-100 text-orange-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{tabViolations}/3</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-gray-500">Time Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 sm:p-8"
          >
            {/* Question Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="mb-6"
              >
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentQuestionIndex + 1} of{" "}
                    {exam.questions.length}
                  </span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="text-xl font-bold text-gray-900 mb-6"
              >
                {currentQuestion.questionText}
              </motion.h2>

              {renderLetterPairs(currentQuestion)}
            </div>

            {/* Answer Options */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="flex justify-center space-x-4 mb-8"
            >
              {[0, 1, 2, 3, 4].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isSubmitting}
                  className={`w-16 h-16 rounded-xl font-bold text-2xl transition-all duration-100 ${
                    selectedAnswer === option
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl transform scale-110 ring-4 ring-blue-200/50"
                      : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-lg hover:shadow-xl"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {option}
                </button>
              ))}
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="text-center"
            >
              <button
                onClick={handleContinue}
                disabled={selectedAnswer === null || isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-100 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl min-w-[200px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : currentQuestionIndex + 1 >= exam.questions.length ? (
                  "Complete Assessment"
                ) : (
                  "Continue"
                )}
              </button>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="flex justify-center mt-8"
            >
              <div className="flex space-x-2">
                {exam.questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-100 ${
                      i < currentQuestionIndex
                        ? "bg-green-500"
                        : i === currentQuestionIndex
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
