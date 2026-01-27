export type SchoolStatus = 'active' | 'inactive' | 'invited' | 'pending';

export interface School {
  id: string;
  name: string;
  adminEmail: string;
  maxStudents: number;
  studentCount?: number;
  status: SchoolStatus;
  details?: string;
  contractStart?: string;
  contractEnd?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolInvitePayload {
  name: string;
  adminEmail: string;
  maxStudents: number;
  details?: string;
  contractStart?: string;
  contractEnd?: string;
}

export interface SchoolsResponse {
  data: School[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SchoolStats {
  totalSchools: number;
  activeSchools: number;
  pendingInvites: number;
  totalStudents: number;
}
