"use client";
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  className?: string;
}

export function LoadingState({ className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header Skeleton */}
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
      </div>

      {/* Billing Toggle Skeleton */}
      <div className="flex justify-center">
        <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse" />
      </div>

      {/* Plans Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 shadow-lg"
          >
            {/* Icon */}
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-2xl mx-auto mb-4 animate-pulse" />
            
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse" />
            
            {/* Description */}
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-6 animate-pulse" />
            
            {/* Price */}
            <div className="h-12 bg-gray-200 rounded w-40 mx-auto mb-6 animate-pulse" />
            
            {/* Features */}
            <div className="space-y-3 mb-8">
              {[1, 2, 3, 4, 5].map((featureIndex) => (
                <div key={featureIndex} className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded flex-1 ml-3 animate-pulse" />
                </div>
              ))}
            </div>
            
            {/* Button */}
            <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
          </motion.div>
        ))}
      </div>

      {/* Features Comparison Skeleton */}
      <div className="mt-12 md:mt-16">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse" />
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <div className="min-w-[600px] p-6">
              {/* Table Header */}
              <div className="flex mb-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="flex-1 flex justify-around ml-6">
                  {[1, 2, 3].map((col) => (
                    <div key={col} className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                  ))}
                </div>
              </div>
              
              {/* Table Rows */}
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex items-center py-3 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  <div className="flex-1 flex justify-around ml-6">
                    {[1, 2, 3].map((col) => (
                      <div key={col} className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error state component
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  message = "Failed to load subscription plans", 
  onRetry, 
  className 
}: ErrorStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
