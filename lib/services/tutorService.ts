import { createClient } from '@/lib/supabase/client';

export interface CourseOverview {
  name: string;
  parallel: string;
  level: string;
  studentsCount: number;
  teachersCount: number;
  avgGrade: string;
  studentsAtRiskCount: number;
}

export interface SubjectPerformance {
  subject: string;
  teacher: string;
  avg: string;
  riskStudents: number;
  status: 'success' | 'warning' | 'critical';
}

export interface CriticalStudent {
  name: string;
  subjectsFailed: number;
  avg: string;
  status: 'warning' | 'critical';
}

export interface MeetingAgreement {
  id: string;
  meetingId?: string;
  description: string;
  responsible: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  observation?: string;
}

export interface CourseMeeting {
  id: string;
  date: string;
  time: string;
  tutor: string;
  director: string;
  agenda: string;
  status: 'programmed' | 'in_progress' | 'finished' | 'closed';
  course: string;
  agreements: MeetingAgreement[];
}

const STORAGE_KEYS = {
  MEETINGS: 'pb_tutor_meetings',
  AGREEMENTS: 'pb_tutor_agreements',
};

const DEFAULT_OVERVIEW: CourseOverview = {
  name: '2.º BGU',
  parallel: 'A',
  level: 'Bachillerato General Unificado',
  studentsCount: 32,
  teachersCount: 8,
  avgGrade: '7.85',
  studentsAtRiskCount: 4,
};

const DEFAULT_SUBJECTS: SubjectPerformance[] = [
  { subject: 'Lengua y Literatura', teacher: 'Lic. Luis Mora', avg: '8.4', riskStudents: 1, status: 'success' },
  { subject: 'Educación Cultural y Artística', teacher: 'Lic. Byron Vera', avg: '8.1', riskStudents: 2, status: 'success' },
  { subject: 'Inglés', teacher: 'Lic. John Doe', avg: '7.9', riskStudents: 3, status: 'success' },
  { subject: 'Sistemas Operativos', teacher: 'Ing. Carlos Ortiz', avg: '7.6', riskStudents: 4, status: 'success' },
  { subject: 'Matemáticas', teacher: 'Lic. Ana Pérez', avg: '6.9', riskStudents: 6, status: 'warning' },
  { subject: 'Física', teacher: 'Lic. Marta Solís', avg: '5.8', riskStudents: 10, status: 'critical' },
];

const DEFAULT_CRITICAL_STUDENTS: CriticalStudent[] = [
  { name: 'Carlos Ruiz', subjectsFailed: 3, avg: '4.50', status: 'critical' },
  { name: 'Ana López', subjectsFailed: 2, avg: '6.50', status: 'warning' },
  { name: 'Juan Pérez', subjectsFailed: 1, avg: '6.80', status: 'warning' },
];

const DEFAULT_MEETINGS: CourseMeeting[] = [
  {
    id: 'meet-1',
    date: '2026-06-25',
    time: '10:30',
    tutor: 'Lic. Byron Vera',
    director: 'MSc. Roberto Gómez',
    agenda: '1. Análisis de rendimiento del I Trimestre.\n2. Identificación de asignaturas críticas (Física y Matemáticas).\n3. Compromisos con padres de familia de casos críticos.',
    status: 'finished',
    course: '2.º BGU - A',
    agreements: [
      { id: 'agr-1', description: 'Implementar tutorías intensivas para el grupo de riesgo en Física', responsible: 'Lic. Marta Solís', deadline: '2026-07-15', status: 'completed' },
      { id: 'agr-2', description: 'Citar a representantes legales de estudiantes con promedio < 7.0', responsible: 'Lic. Byron Vera', deadline: '2026-07-08', status: 'completed' },
      { id: 'agr-3', description: 'Elaborar talleres de refuerzo pedagógico en Matemáticas', responsible: 'Lic. Ana Pérez', deadline: '2026-07-20', status: 'in_progress' },
    ],
  },
];

export const tutorService = {
  isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes('your-project') && !url.includes('placeholder');
  },

  async getCourseOverview(): Promise<CourseOverview> {
    return DEFAULT_OVERVIEW;
  },

  async getSubjectPerformances(): Promise<SubjectPerformance[]> {
    return DEFAULT_SUBJECTS;
  },

  async getCriticalStudents(): Promise<CriticalStudent[]> {
    return DEFAULT_CRITICAL_STUDENTS;
  },

  async getMeetings(): Promise<CourseMeeting[]> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('course_meetings').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(m => ({
            id: m.id,
            date: m.date ? m.date.split('T')[0] : '',
            time: m.date ? m.date.split('T')[1]?.slice(0, 5) : '09:00',
            tutor: 'Lic. Byron Vera',
            director: 'MSc. Roberto Gómez',
            agenda: m.agenda || '',
            status: m.status || 'finished',
            course: '2.º BGU - A',
            agreements: [],
          }));
        }
      } catch (err) {
        console.warn('Fallback to local storage for meetings:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.MEETINGS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(DEFAULT_MEETINGS));
    }
    return DEFAULT_MEETINGS;
  },

  async saveMeeting(meeting: Omit<CourseMeeting, 'id'>): Promise<CourseMeeting> {
    const newMeeting: CourseMeeting = {
      ...meeting,
      id: 'meet-' + Date.now(),
    };

    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('course_meetings').insert([
          {
            date: new Date(`${meeting.date}T${meeting.time || '09:00'}:00`).toISOString(),
            agenda: meeting.agenda,
            status: meeting.status,
          }
        ]).select().single();

        if (!error && data) {
          newMeeting.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase meeting save fallback:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const current = await this.getMeetings();
      const updated = [newMeeting, ...current];
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(updated));
    }

    return newMeeting;
  },

  async toggleAgreementStatus(meetingId: string, agreementId: string): Promise<CourseMeeting[]> {
    const meetings = await this.getMeetings();
    const updated = meetings.map(m => {
      if (m.id === meetingId) {
        const updatedAgreements = m.agreements.map(a => {
          if (a.id === agreementId) {
            const nextStatus = a.status === 'completed' ? 'pending' : 'completed';
            return { ...a, status: nextStatus as any };
          }
          return a;
        });
        return { ...m, agreements: updatedAgreements };
      }
      return m;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(updated));
    }
    return updated;
  }
};
