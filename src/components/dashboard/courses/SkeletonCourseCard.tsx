"use client";

import React from "react";

export function SkeletonCourseCard() {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm animate-pulse">
      <div className="h-28 bg-gray-200 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-16 bg-gray-200 rounded ml-auto"></div>
      </div>
    </div>
  );
}
