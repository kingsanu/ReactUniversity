export interface Coach {
  id: string;
  name: string;
  fullName?: string; // For admin view
  title?: string;
  bio?: string;
  specialization?: string;
  image?: string;
  rating?: number;
  reviews?: number | Review[];
  location?: string;
  languages?: string[];
  tags?: string[];
  availability?: Availability;
  email?: string; // For admin view
  status?: string; // For admin view
  joinedAt?: string; // For admin view
  activeStudents?: number; // For admin view
}

export interface OnboardingStatus {
  id: string;
  email: string;
  name?: string;
  status: 'invited' | 'onboarding_started' | 'completed';
  invitedAt?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  specialization: string;
  location: string;
  languages: string[];
  tags: string[];
  image?: string | null;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export interface Availability {
  timezone: string;
  weeklySchedule: DaySchedule[];
}

export interface CalendarIntegration {
  connected: boolean;
  accessToken?: string;
}

export interface CalendarIntegrations {
  google: CalendarIntegration;
  outlook: CalendarIntegration;
}

export interface OnboardingData {
  personalInfo: PersonalInfo;
  availability: Availability;
  calendarIntegrations: CalendarIntegrations;
  password?: string;
}

export interface BookingSlot {
  start: string;
  end: string;
}

export interface Booking {
  id: string;
  coachId?: string;
  studentName?: string; // For coach dashboard
  studentImage?: string; // For coach dashboard
  topic: string;
  notes?: string;
  startTime?: string; // Flattened for easier UI consumption if needed, or use slot
  endTime?: string;
  slot?: BookingSlot;
  status: 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  meetingLink?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  status?: string;
}

export interface CoachesResponse {
  data: Coach[];
  meta: {
    total: number;
    page: number;
    pages?: number; // Some APIs return pages
    limit?: number; // Some APIs return limit
    totalPages?: number; // Some APIs return totalPages
  };
}

export interface BookingResponse {
  id: string;
  status: string;
  meetingLink?: string;
  newStartTime?: string; // For reschedule response
}
