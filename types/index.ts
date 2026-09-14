export type Role = 'SUPERADMIN' | 'ADMIN_INST' | 'DIRECTIVO' | 'DOCENTE' | 'TUTOR' | 'SECRETARIO';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  fullName: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
}

export interface AcademicYear {
  id: string;
  label: string; // e.g. "2026-2027"
  isActive: boolean;
}

export interface Course {
  id: string;
  name: string; // e.g. "2do BGU"
  level: string;
}

export interface Parallel {
  id: string;
  courseId: string;
  name: string; // e.g. "A", "B"
}

export interface Subject {
  id: string;
  name: string;
  area: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  identificationNumber: string;
  email?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  activityId: string;
  value: number;
  observation?: string;
  isRecovery: boolean;
}

export interface Activity {
  id: string;
  subjectId: string;
  name: string;
  type: 'Individual' | 'Grupal' | 'Trabajo' | 'Tarea' | 'Proyecto' | 'Evaluacion';
  weight: number;
  date: string;
}
