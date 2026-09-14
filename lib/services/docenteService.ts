import { createClient } from '@/lib/supabase/client';

export interface ActivityItem {
  id: string;
  subject_id?: string;
  parallel_id?: string;
  period_id?: string;
  name: string;
  type: 'Individual' | 'Grupal' | 'Trabajo' | 'Tarea' | 'Proyecto' | 'Evaluacion';
  weight: number;
  date: string;
}

export interface StudentItem {
  id: string;
  listNum: number;
  name: string;
  idNumber?: string;
  email?: string;
}

export interface SummativeItem {
  id: string;
  studentId: string;
  studentName: string;
  listNum: number;
  initialGrade: number;
  activity: string;
  improvedGrade: number;
  finalGrade: number;
}

export interface AnnualRecord {
  id: string;
  studentId: string;
  studentName: string;
  listNum: number;
  p1: number;
  p2: number;
  p3: number;
  annualAverage: number;
  status: 'Promovido' | 'Supletorio' | 'Reprobado';
}

const STORAGE_KEYS = {
  ACTIVITIES: 'pb_activities',
  GRADES: 'pb_grades',
  MEJORAS: 'pb_mejoras',
  CONSOLIDADO: 'pb_consolidado',
};

// Initial fallback mock data
const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: 'act-1', name: 'Taller de Expresión Plástica', type: 'Individual', weight: 1.0, date: '2026-10-12' },
  { id: 'act-2', name: 'Proyecto Artístico Colectivo', type: 'Grupal', weight: 1.5, date: '2026-10-25' },
  { id: 'act-3', name: 'Evaluación Trimestral Teórica', type: 'Evaluacion', weight: 2.0, date: '2026-11-05' },
];

const INITIAL_STUDENTS: StudentItem[] = [
  { id: 's1', listNum: 1, name: 'Juan Pérez', idNumber: '1712345678', email: 'juan.perez@colegio.edu.ec' },
  { id: 's2', listNum: 2, name: 'María García', idNumber: '1787654321', email: 'maria.garcia@colegio.edu.ec' },
  { id: 's3', listNum: 3, name: 'Carlos Ruiz', idNumber: '1700112233', email: 'carlos.ruiz@colegio.edu.ec' },
  { id: 's4', listNum: 4, name: 'Ana López', idNumber: '1722334455', email: 'ana.lopez@colegio.edu.ec' },
  { id: 's5', listNum: 5, name: 'Luis Torres', idNumber: '1799887766', email: 'luis.torres@colegio.edu.ec' },
];

const INITIAL_GRADES: Record<string, number> = {
  's1_act-1': 8.5, 's1_act-2': 9.0, 's1_act-3': 7.0,
  's2_act-1': 10.0, 's2_act-2': 9.5, 's2_act-3': 9.0,
  's3_act-1': 6.0, 's3_act-2': 5.5, 's3_act-3': 4.0,
  's4_act-1': 7.0, 's4_act-2': 8.0, 's4_act-3': 6.5,
  's5_act-1': 9.0, 's5_act-2': 7.0, 's5_act-3': 8.0,
};

export const docenteService = {
  // Helper to check if Supabase is connected
  isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes('your-project') && !url.includes('placeholder');
  },

  // 1. ACTIVITIES / INSUMOS
  async getActivities(): Promise<ActivityItem[]> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('activities').select('*').order('date', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type || 'Individual',
            weight: Number(item.weight) || 1.0,
            date: item.date || new Date().toISOString().split('T')[0],
          }));
        }
      } catch (err) {
        console.warn('Fallback to local storage for activities:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    }
    return INITIAL_ACTIVITIES;
  },

  async createActivity(activity: Omit<ActivityItem, 'id'>): Promise<ActivityItem> {
    const newItem: ActivityItem = {
      ...activity,
      id: 'act-' + Date.now(),
    };

    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('activities').insert([
          {
            name: activity.name,
            type: activity.type,
            weight: activity.weight,
            date: activity.date,
          }
        ]).select().single();

        if (!error && data) {
          newItem.id = data.id;
        }
      } catch (err) {
        console.warn('Could not insert in Supabase, using local state:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const current = await this.getActivities();
      const updated = [...current, newItem];
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
    }

    return newItem;
  },

  async deleteActivity(id: string): Promise<boolean> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.from('activities').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete activity failed, updating local state:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const current = await this.getActivities();
      const updated = current.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
    }
    return true;
  },

  // 2. STUDENTS & GRADES MATRIX
  async getStudents(): Promise<StudentItem[]> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('students').select('*').order('last_name');
        if (!error && data && data.length > 0) {
          return data.map((st, idx) => ({
            id: st.id,
            listNum: idx + 1,
            name: `${st.first_name} ${st.last_name}`,
            idNumber: st.identification_number,
            email: st.email,
          }));
        }
      } catch (err) {
        console.warn('Supabase getStudents fallback:', err);
      }
    }
    return INITIAL_STUDENTS;
  },

  async getGrades(): Promise<Record<string, number>> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('grades').select('student_id, activity_id, grade');
        if (!error && data && data.length > 0) {
          const map: Record<string, number> = {};
          data.forEach(g => {
            map[`${g.student_id}_${g.activity_id}`] = Number(g.grade);
          });
          return map;
        }
      } catch (err) {
        console.warn('Supabase getGrades fallback:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.GRADES);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(INITIAL_GRADES));
    }
    return INITIAL_GRADES;
  },

  async saveGrades(grades: Record<string, number>): Promise<boolean> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const records = Object.entries(grades).map(([key, value]) => {
          const [student_id, activity_id] = key.split('_');
          return {
            student_id,
            activity_id,
            grade: value,
            updated_at: new Date().toISOString(),
          };
        });

        if (records.length > 0) {
          await supabase.from('grades').upsert(records, { onConflict: 'student_id,activity_id' });
        }
      } catch (err) {
        console.warn('Supabase saveGrades failed, updating local state:', err);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    }
    return true;
  },

  // 3. IMPROVEMENTS / RECUPERACIONES
  async getImprovements(): Promise<SummativeItem[]> {
    const students = await this.getStudents();
    const defaultData: SummativeItem[] = [
      { id: 'imp-1', studentId: 's1', studentName: 'Juan Pérez', listNum: 1, initialGrade: 6.5, activity: 'Taller de Recuperación', improvedGrade: 8.0, finalGrade: 8.0 },
      { id: 'imp-2', studentId: 's2', studentName: 'María García', listNum: 2, initialGrade: 9.0, activity: '', improvedGrade: 0, finalGrade: 9.0 },
      { id: 'imp-3', studentId: 's3', studentName: 'Carlos Ruiz', listNum: 3, initialGrade: 4.0, activity: 'Ensayo Artístico Correctivo', improvedGrade: 7.5, finalGrade: 7.5 },
      { id: 'imp-4', studentId: 's4', studentName: 'Ana López', listNum: 4, initialGrade: 5.5, activity: 'Maqueta de Composición', improvedGrade: 8.0, finalGrade: 8.0 },
      { id: 'imp-5', studentId: 's5', studentName: 'Luis Torres', listNum: 5, initialGrade: 8.0, activity: '', improvedGrade: 0, finalGrade: 8.0 },
    ];

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.MEJORAS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem(STORAGE_KEYS.MEJORAS, JSON.stringify(defaultData));
    }
    return defaultData;
  },

  async saveImprovements(items: SummativeItem[]): Promise<boolean> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEJORAS, JSON.stringify(items));
    }
    return true;
  },

  // 4. CONSOLIDADO ANUAL
  async getConsolidado(): Promise<AnnualRecord[]> {
    const defaultData: AnnualRecord[] = [
      { id: 'c1', studentId: 's1', studentName: 'Juan Pérez', listNum: 1, p1: 7.5, p2: 8.0, p3: 7.0, annualAverage: 7.50, status: 'Promovido' },
      { id: 'c2', studentId: 's2', studentName: 'María García', listNum: 2, p1: 9.5, p2: 9.0, p3: 9.8, annualAverage: 9.43, status: 'Promovido' },
      { id: 'c3', studentId: 's3', studentName: 'Carlos Ruiz', listNum: 3, p1: 4.0, p2: 5.0, p3: 4.5, annualAverage: 4.50, status: 'Supletorio' },
      { id: 'c4', studentId: 's4', studentName: 'Ana López', listNum: 4, p1: 6.5, p2: 7.0, p3: 6.0, annualAverage: 6.50, status: 'Supletorio' },
      { id: 'c5', studentId: 's5', studentName: 'Luis Torres', listNum: 5, p1: 8.0, p2: 8.5, p3: 8.0, annualAverage: 8.17, status: 'Promovido' },
    ];

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.CONSOLIDADO);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem(STORAGE_KEYS.CONSOLIDADO, JSON.stringify(defaultData));
    }
    return defaultData;
  },

  async saveConsolidado(records: AnnualRecord[]): Promise<boolean> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CONSOLIDADO, JSON.stringify(records));
    }
    return true;
  }
};
