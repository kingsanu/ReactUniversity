"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Skeleton loader for chart components
 */
export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading chart"
    >
      <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
      <div className="flex items-end gap-2 h-32">
        {[40, 60, 30, 80, 50, 70, 45].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-200 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <span className="sr-only">Loading chart data...</span>
    </div>
  );
}

/**
 * Skeleton loader for PDF/document components
 */
export function DocumentSkeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse space-y-4 ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading document"
    >
      <div className="h-8 w-48 bg-slate-200 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-5/6 bg-slate-200 rounded" />
        <div className="h-4 w-4/6 bg-slate-200 rounded" />
      </div>
      <div className="h-40 w-full bg-slate-200 rounded" />
      <span className="sr-only">Loading document...</span>
    </div>
  );
}

/**
 * Skeleton loader for modal content
 */
export function ModalSkeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse space-y-6 p-6 ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading modal content"
    >
      <div className="h-6 w-32 bg-slate-200 rounded" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
      </div>
      <div className="flex gap-3 justify-end">
        <div className="h-10 w-20 bg-slate-200 rounded" />
        <div className="h-10 w-24 bg-slate-200 rounded" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Skeleton loader for cards
 */
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`animate-pulse p-6 bg-white rounded-2xl border border-slate-100 ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-200 rounded" />
        <div className="h-3 w-4/5 bg-slate-200 rounded" />
      </div>
      <span className="sr-only">Loading card content...</span>
    </motion.div>
  );
}

/**
 * Full page loading state
 */
export function PageSkeleton() {
  return (
    <div 
      className="min-h-screen bg-slate-50 p-8 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-12 w-96 bg-slate-200 rounded" />
          <div className="h-4 w-64 bg-slate-200 rounded" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton className="md:col-span-2" />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton className="md:col-span-2" />
        </div>
      </div>
      <span className="sr-only">Loading page content...</span>
    </div>
  );
}

