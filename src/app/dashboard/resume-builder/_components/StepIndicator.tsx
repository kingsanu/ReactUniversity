"use client";
import { useState } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { resumeSteps } from './resumeData';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { validateAllSteps, getStepStatus } from './validation';
import { AlertTriangle } from 'lucide-react';

// Simple Tooltip Component
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10">
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function StepIndicator() {
  const { resumeBuilder, setResumeStep } = useGlobalStore();
  const currentStep = resumeBuilder.currentStep;

  // Get validation status for all steps
  const validation = validateAllSteps(resumeBuilder.data);

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-start justify-between w-full">
        {resumeSteps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id <= currentStep;
          const stepValidation = validation[step.id];
          const hasWarnings = !stepValidation.isValid && stepValidation.completionPercentage > 0;

          return (
            <motion.li
              key={step.id}
              className="flex items-start flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center w-full">
                <Tooltip content={
                  stepValidation.isValid
                    ? step.description
                    : `${step.description}\n\nMissing: ${stepValidation.missingFields.join(', ')}`
                }>
                  <motion.button
                    onClick={() => isClickable && setResumeStep(step.id)}
                    disabled={!isClickable}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 w-full group",
                      isClickable ? "hover:bg-white/70 hover:shadow-md cursor-pointer" : "cursor-not-allowed",
                      isCurrent && "bg-white/80 backdrop-blur-sm shadow-lg ring-2 ring-indigo-500/20"
                    )}
                    whileHover={isClickable ? { scale: 1.02 } : {}}
                    whileTap={isClickable ? { scale: 0.98 } : {}}
                  >
                    <motion.div
                      className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                        isCompleted && stepValidation.isValid
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg"
                          : isCompleted && !stepValidation.isValid
                          ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg"
                          : isCurrent
                          ? "bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      )}
                      animate={isCurrent ? {
                        boxShadow: [
                          "0 4px 14px 0 rgba(79, 70, 229, 0.3)",
                          "0 6px 20px 0 rgba(79, 70, 229, 0.4)",
                          "0 4px 14px 0 rgba(79, 70, 229, 0.3)"
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {/* Animated background for current step */}
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}

                      {isCompleted && stepValidation.isValid ? (
                        <motion.svg
                          className="w-7 h-7"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      ) : isCompleted && !stepValidation.isValid ? (
                        <AlertTriangle className="w-6 h-6 text-white" />
                      ) : (
                        <step.icon
                          className={cn(
                            "w-7 h-7 transition-all duration-300 relative z-10",
                            isCurrent ? "text-white" : isCompleted ? "text-white" : "text-gray-600 group-hover:text-gray-700"
                          )}
                        />
                      )}
                    </motion.div>

                    <div className="flex-1 text-left">
                      <h3
                        className={cn(
                          "text-sm font-semibold transition-colors duration-300",
                          isCurrent
                            ? "text-indigo-700"
                            : isCompleted && stepValidation.isValid
                            ? "text-green-700"
                            : isCompleted && !stepValidation.isValid
                            ? "text-amber-700"
                            : "text-gray-600 group-hover:text-gray-800"
                        )}
                      >
                        {step.title}
                      </h3>
                      <p className={cn(
                        "text-xs mt-1 transition-colors duration-300",
                        isCurrent
                          ? "text-indigo-500"
                          : isCompleted && stepValidation.isValid
                          ? "text-green-500"
                          : isCompleted && !stepValidation.isValid
                          ? "text-amber-500"
                          : "text-gray-400"
                      )}>
                        Step {step.id} of {resumeSteps.length}
                        {!stepValidation.isValid && stepValidation.missingFields.length > 0 && (
                          <span className="block text-xs text-amber-600 mt-0.5">
                            {stepValidation.missingFields.length} item{stepValidation.missingFields.length !== 1 ? 's' : ''} missing
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.button>
                </Tooltip>
              </div>

              {/* Enhanced Connector Line with Animation */}
              {index < resumeSteps.length - 1 && (
                <div className="flex-1 flex items-center px-4 mt-10">
                  <div className="w-full h-0.5 bg-gray-200 rounded-full relative overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isCompleted ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-transparent"
                      )}
                      initial={{ width: "0%" }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}
