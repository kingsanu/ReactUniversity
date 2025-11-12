import {
  Course,
  CourseEnrollment,
  CourseEnrollmentPayload,
  CourseProgressPayload,
  CourseCompletionPayload,
} from "@/types/course";

const enrollmentStore = new Map<string, CourseEnrollment>();

const simulateNetworkDelay = async <T>(value: T, delay = 200): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
};

const buildEnrollmentRecord = (
  course: Course,
  enrollmentId: string,
  _source: "catalog" | "recommended" | "dashboard"
): CourseEnrollment => {
  const now = new Date().toISOString();

  return {
    enrollmentId,
    courseId: course.id,
    courseTitle: course.title,
    courseThumbnail: course.thumbnailUrl,
    courseraUrl: course.courseraUrl,
    enrolledAt: now,
    status: "in_progress",
    progress: {
      completedModules: 0,
      totalModules: course.syllabus.length,
      percentage: 0,
      lastAccessedAt: now,
    },
  };
};

export async function enrollInCourse(
  payload: CourseEnrollmentPayload
): Promise<CourseEnrollment> {
  const { course, enrollmentSource } = payload;
  const enrollmentId = `enrollment_${course.id}_${Date.now()}`;
  const enrollment = buildEnrollmentRecord(
    course,
    enrollmentId,
    enrollmentSource
  );

  enrollmentStore.set(enrollmentId, enrollment);

  return simulateNetworkDelay(enrollment);
}

export async function trackCourseProgress(
  payload: CourseProgressPayload
): Promise<CourseEnrollment | null> {
  const existing = enrollmentStore.get(payload.enrollmentId);

  if (!existing) {
    return simulateNetworkDelay(null);
  }

  const updated: CourseEnrollment = {
    ...existing,
    status: payload.status ?? existing.status,
    progress: {
      ...existing.progress,
      completedModules:
        payload.completedModules ?? existing.progress.completedModules,
      totalModules: payload.totalModules ?? existing.progress.totalModules,
      percentage: payload.percentage ?? existing.progress.percentage,
      lastAccessedAt: payload.lastAccessedAt ?? new Date().toISOString(),
    },
  };

  enrollmentStore.set(payload.enrollmentId, updated);

  return simulateNetworkDelay(updated);
}

export async function markCourseCompleted(
  payload: CourseCompletionPayload
): Promise<CourseEnrollment | null> {
  const existing = enrollmentStore.get(payload.enrollmentId);

  if (!existing) {
    return simulateNetworkDelay(null);
  }

  const updated: CourseEnrollment = {
    ...existing,
    status: "completed",
    progress: {
      ...existing.progress,
      completedModules: existing.progress.totalModules,
      percentage: 100,
      lastAccessedAt: payload.completedAt ?? new Date().toISOString(),
    },
  };

  enrollmentStore.set(payload.enrollmentId, updated);

  return simulateNetworkDelay(updated);
}
