import { createClient } from '@/lib/supabase/client';

export interface CourseAdminItem {
  id: string;
  name: string;
  level: string;
  parallels: string[];
}

export interface StudentAdminItem {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  course: string;
  listNum: number;
}

export interface UserAdminItem {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN_INST' | 'DIRECTIVO' | 'DOCENTE' | 'TUTOR' | 'SECRETARIO';
  status: 'approved' | 'pending' | 'suspended';
  institution: string;
}

const STORAGE_KEYS = {
  COURSES: 'pb_admin_courses',
  STUDENTS: 'pb_admin_students',
  USERS: 'pb_admin_users',
};

const DEFAULT_COURSES: CourseAdminItem[] = [
  { id: 'c-1', name: '1.º BGU', level: 'BGU', parallels: ['A', 'B'] },
  { id: 'c-2', name: '2.º BGU', level: 'BGU', parallels: ['A', 'B', 'C'] },
  { id: 'c-3', name: '3.º BGU', level: 'BGU', parallels: ['A'] },
];

const DEFAULT_STUDENTS: StudentAdminItem[] = [
  { id: 'st-1', firstName: 'Juan', lastName: 'Pérez', idNumber: '1712345678', email: 'juan@email.com', course: '2do BGU - A', listNum: 1 },
  { id: 'st-2', firstName: 'María', lastName: 'García', idNumber: '1787654321', email: 'maria@email.com', course: '2do BGU - A', listNum: 2 },
  { id: 'st-3', firstName: 'Carlos', lastName: 'Ruiz', idNumber: '1700112233', email: 'carlos@email.com', course: '2do BGU - A', listNum: 3 },
  { id: 'st-4', firstName: 'Ana', lastName: 'López', idNumber: '1722334455', email: 'ana@email.com', course: '2do BGU - B', listNum: 1 },
  { id: 'st-5', firstName: 'Luis', lastName: 'Torres', idNumber: '1799887766', email: 'luis@email.com', course: '3ro BGU - A', listNum: 1 },
];

const DEFAULT_USERS: UserAdminItem[] = [
  { id: 'u-1', name: 'Byron Vera', email: 'byron@colegio.edu.ec', role: 'DOCENTE', status: 'approved', institution: 'Técnica Nacional' },
  { id: 'u-2', name: 'Roberto Gómez', email: 'roberto@colegio.edu.ec', role: 'DIRECTIVO', status: 'approved', institution: 'Técnica Nacional' },
  { id: 'u-3', name: 'Ana Martínez', email: 'ana.martinez@colegio.edu.ec', role: 'DOCENTE', status: 'pending', institution: 'Técnica Nacional' },
  { id: 'u-4', name: 'Carlos Ruiz', email: 'carlos.ruiz@colegio.edu.ec', role: 'TUTOR', status: 'approved', institution: 'Técnica Nacional' },
  { id: 'u-5', name: 'Elena Gómez', email: 'elena@colegio.edu.ec', role: 'DOCENTE', status: 'suspended', institution: 'Técnica Nacional' },
];

export const adminService = {
  isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes('your-project') && !url.includes('placeholder');
  },

  // 1. COURSES & PARALLELS
  async getCourses(): Promise<CourseAdminItem[]> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('courses').select('*, parallels(*)');
        if (!error && data && data.length > 0) {
          return data.map(c => ({
            id: c.id,
            name: c.name,
            level: c.level || 'BGU',
            parallels: (c.parallels || []).map((p: any) => p.name).sort(),
          }));
        }
      } catch (err) {
        console.warn('Supabase getCourses fallback:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(DEFAULT_COURSES));
    }
    return DEFAULT_COURSES;
  },

  async createCourse(name: string, level: string, initialParallels: string[]): Promise<CourseAdminItem> {
    const newCourse: CourseAdminItem = {
      id: 'c-' + Date.now(),
      name,
      level,
      parallels: initialParallels.length > 0 ? initialParallels : ['A'],
    };

    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('courses').insert([{ name, level }]).select().single();
        if (!error && data) {
          newCourse.id = data.id;
          const parallelsToInsert = newCourse.parallels.map(p => ({
            course_id: data.id,
            name: p,
          }));
          await supabase.from('parallels').insert(parallelsToInsert);
        }
      } catch (err) {
        console.warn('Supabase createCourse fallback:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const current = await this.getCourses();
      const updated = [...current, newCourse];
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
    }
    return newCourse;
  },

  async addParallel(courseId: string, parallelName: string): Promise<CourseAdminItem[]> {
    const courses = await this.getCourses();
    const updated = courses.map(c => {
      if (c.id === courseId && !c.parallels.includes(parallelName)) {
        return { ...c, parallels: [...c.parallels, parallelName].sort() };
      }
      return c;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
    }
    return updated;
  },

  async deleteCourse(id: string): Promise<CourseAdminItem[]> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.from('courses').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteCourse fallback:', err);
      }
    }

    const courses = await this.getCourses();
    const updated = courses.filter(c => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
    }
    return updated;
  },

  // 2. STUDENTS
  async getStudents(): Promise<StudentAdminItem[]> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('students').select('*').order('last_name');
        if (!error && data && data.length > 0) {
          return data.map((st, idx) => ({
            id: st.id,
            firstName: st.first_name,
            lastName: st.last_name,
            idNumber: st.identification_number || '',
            email: st.email || '',
            course: '2do BGU - A',
            listNum: idx + 1,
          }));
        }
      } catch (err) {
        console.warn('Supabase getStudents fallback:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    return DEFAULT_STUDENTS;
  },

  async createStudent(data: Omit<StudentAdminItem, 'id' | 'listNum'>): Promise<StudentAdminItem> {
    const students = await this.getStudents();
    const newStudent: StudentAdminItem = {
      ...data,
      id: 'st-' + Date.now(),
      listNum: students.length + 1,
    };

    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data: inserted, error } = await supabase.from('students').insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            identification_number: data.idNumber,
            email: data.email,
          }
        ]).select().single();

        if (!error && inserted) {
          newStudent.id = inserted.id;
        }
      } catch (err) {
        console.warn('Supabase createStudent fallback:', err);
      }
    }

    const updated = [...students, newStudent];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
    }
    return newStudent;
  },

  async importStudentsBatch(studentsToImport: Array<Omit<StudentAdminItem, 'id' | 'listNum'>>): Promise<StudentAdminItem[]> {
    const current = await this.getStudents();
    let currentIdx = current.length;

    const newItems: StudentAdminItem[] = studentsToImport.map(item => {
      currentIdx++;
      return {
        ...item,
        id: 'st-' + Date.now() + '-' + currentIdx,
        listNum: currentIdx,
      };
    });

    const updated = [...current, ...newItems];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
    }
    return updated;
  },

  async deleteStudent(id: string): Promise<StudentAdminItem[]> {
    const current = await this.getStudents();
    const updated = current.filter(s => s.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
    }
    return updated;
  },

  exportStudentsCSV(students: StudentAdminItem[]) {
    const headers = 'Numero_Lista,Apellidos,Nombres,Cedula,Correo,Curso\n';
    const rows = students.map(s => 
      `${s.listNum},"${s.lastName}","${s.firstName}","${s.idNumber}","${s.email}","${s.course}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Nomina_Estudiantes_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // 3. USERS & ROLES
  async getUsers(): Promise<UserAdminItem[]> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    return DEFAULT_USERS;
  },

  async inviteUser(user: Omit<UserAdminItem, 'id' | 'status'>): Promise<UserAdminItem> {
    const current = await this.getUsers();
    const newUser: UserAdminItem = {
      ...user,
      id: 'u-' + Date.now(),
      status: 'approved',
    };

    const updated = [...current, newUser];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    }
    return newUser;
  },

  async updateUserStatus(id: string, status: 'approved' | 'suspended' | 'pending'): Promise<UserAdminItem[]> {
    const current = await this.getUsers();
    const updated = current.map(u => (u.id === id ? { ...u, status } : u));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    }
    return updated;
  },

  async deleteUser(id: string): Promise<UserAdminItem[]> {
    const current = await this.getUsers();
    const updated = current.filter(u => u.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    }
    return updated;
  },

  // 4. SUBJECTS
  async getSubjects(): Promise<SubjectAdminItem[]> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pb_admin_subjects');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem('pb_admin_subjects', JSON.stringify(DEFAULT_SUBJECTS));
    }
    return DEFAULT_SUBJECTS;
  },

  async createSubject(subject: Omit<SubjectAdminItem, 'id'>): Promise<SubjectAdminItem> {
    const current = await this.getSubjects();
    const newSubject: SubjectAdminItem = {
      ...subject,
      id: 'sub-' + Date.now(),
    };
    const updated = [...current, newSubject];
    if (typeof window !== 'undefined') {
      localStorage.setItem('pb_admin_subjects', JSON.stringify(updated));
    }
    return newSubject;
  },

  async deleteSubject(id: string): Promise<SubjectAdminItem[]> {
    const current = await this.getSubjects();
    const updated = current.filter(s => s.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pb_admin_subjects', JSON.stringify(updated));
    }
    return updated;
  },

  // 5. INSTITUTION CONFIG
  async getInstitutionConfig() {
    const defaultConfig = {
      name: 'Unidad Educativa Técnica Nacional',
      code: '17H00123',
      address: 'Av. América y Universitaria, Quito - Ecuador',
      phone: '022345678',
      email: 'rectorado@tecnicanacional.edu.ec',
      currentYear: '2026-2027',
    };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pb_admin_config');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
      localStorage.setItem('pb_admin_config', JSON.stringify(defaultConfig));
    }
    return defaultConfig;
  },

  async saveInstitutionConfig(config: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pb_admin_config', JSON.stringify(config));
    }
    return config;
  }
};

export interface SubjectAdminItem {
  id: string;
  code: string;
  name: string;
  area: string;
  level: string;
  weeklyHours: number;
  teachersCount: number;
}

const DEFAULT_SUBJECTS: SubjectAdminItem[] = [
  { id: '1', code: 'MAT-01', name: 'Matemáticas', area: 'Ciencias Exactas', level: 'BGU', weeklyHours: 5, teachersCount: 3 },
  { id: '2', code: 'LEN-02', name: 'Lengua y Literatura', area: 'Lenguaje y Comunicación', level: 'BGU', weeklyHours: 5, teachersCount: 3 },
  { id: '3', code: 'ECA-03', name: 'Educación Cultural y Artística', area: 'Artes y Humanidades', level: 'BGU', weeklyHours: 2, teachersCount: 2 },
  { id: '4', code: 'FIS-04', name: 'Física', area: 'Ciencias Naturales', level: 'BGU', weeklyHours: 4, teachersCount: 2 },
  { id: '5', code: 'ING-05', name: 'Inglés', area: 'Lenguas Extranjeras', level: 'BGU', weeklyHours: 5, teachersCount: 2 },
  { id: '6', code: 'SOR-06', name: 'Sistemas Operativos y Redes', area: 'Técnica Informática', level: 'BT Informática', weeklyHours: 6, teachersCount: 2 },
];

