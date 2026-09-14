-- =============================================================================
-- SCHEMA: PROFE. BYRON GESTIÓN DOCENTE
-- Version: 1.0
-- Description: Multi-tenant academic management system with RBAC.
-- =============================================================================

-- 1. INSTITUTIONS
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    logo_url TEXT,
    address TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- 'SUPERADMIN', 'ADMIN_INST', 'DIRECTIVO', 'DOCENTE', 'TUTOR', 'SECRETARIO'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROFILES (Extended from auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. INSTITUTION MEMBERS (The bridge for Multi-tenancy)
CREATE TABLE institution_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'suspended'
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(institution_id, user_id)
);

-- 5. ACADEMIC YEAR
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    year_label TEXT NOT NULL, -- e.g., '2026-2027'
    is_active BOOLEAN DEFAULT false,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. COURSES
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., '2do BGU'
    level TEXT, -- e.g., 'BGU'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. PARALLELS
CREATE TABLE parallels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'A', 'B'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SUBJECTS
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    area TEXT, -- e.g., 'ECA'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. STUDENTS
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    identification_number TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. ENROLLMENTS (Student <-> Parallel <-> Year)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    parallel_id UUID REFERENCES parallels(id) ON DELETE CASCADE,
    year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    list_number INTEGER,
    status TEXT DEFAULT 'active', -- 'active', 'transferred', 'inactive'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, year_id)
);

-- 11. TEACHER ASSIGNMENTS (Teacher <-> Subject <-> Parallel <-> Year)
CREATE TABLE teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    parallel_id UUID REFERENCES parallels(id) ON DELETE CASCADE,
    year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    is_tutor BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, subject_id, parallel_id, year_id)
);

-- 12. PERIODS ( Trimestres )
CREATE TABLE periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 'I PERIODO', 'II PERIODO', 'III PERIODO'
    weight DECIMAL DEFAULT 0.33,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. ACTIVITIES (The "Insumos" Definition)
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    parallel_id UUID REFERENCES parallels(id) ON DELETE CASCADE,
    period_id UUID REFERENCES periods(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- 'Individual', 'Grupal', 'Trabajo', 'Tarea', 'Proyecto', 'Evaluacion'
    weight DECIMAL DEFAULT 1.0,
    date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. GRADES (The "Insumos" Values)
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    grade DECIMAL(5,2),
    observation TEXT,
    is_recovery BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, activity_id)
);

-- 15. SUMMATIVE GRADES & IMPROVEMENTS
CREATE TABLE summative_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    period_id UUID REFERENCES periods(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    initial_grade DECIMAL(5,2),
    improvement_activity TEXT,
    improved_grade DECIMAL(5,2),
    final_grade DECIMAL(5,2),
    observation TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, period_id, subject_id)
);

-- 16. ANNUAL GRADES (The Consolidado)
CREATE TABLE annual_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    p1_grade DECIMAL(5,2),
    p2_grade DECIMAL(5,2),
    p3_grade DECIMAL(5,2),
    final_annual_grade DECIMAL(5,2),
    status TEXT, -- 'Promoted', 'Supletorio', 'Failed'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, subject_id, year_id)
);

-- 17. MAKEUP EXAMS (Supletorios)
CREATE TABLE makeup_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    annual_grade DECIMAL(5,2),
    exam_grade DECIMAL(5,2),
    final_grade DECIMAL(5,2),
    observation TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, subject_id, year_id)
);

-- 18. QUALITATIVE REPORTS
CREATE TABLE qualitative_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    period_id UUID REFERENCES periods(id) ON DELETE CASCADE,
    strengths TEXT,
    difficulties TEXT,
    recommendations TEXT,
    commitments TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 19. COURSE MEETINGS (Juntas de Curso)
CREATE TABLE course_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    parallel_id UUID REFERENCES parallels(id) ON DELETE CASCADE,
    year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    tutor_id UUID REFERENCES profiles(id),
    director_id UUID REFERENCES profiles(id),
    agenda TEXT,
    status TEXT DEFAULT 'programmed', -- 'programmed', 'in_progress', 'finished', 'closed'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 20. MEETING AGREEMENTS (Compromisos)
CREATE TABLE meeting_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES course_meetings(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    responsible_id UUID REFERENCES profiles(id),
    deadline DATE,
    status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'not_completed'
    observation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 21. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    institution_id UUID REFERENCES institutions(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- SECURITY POLICIES (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE parallels ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE summative_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE makeup_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualitative_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Basic Multi-tenant Policy Example for Students
-- Users can see students if they are a member of the student's institution
CREATE POLICY "Users can view students of their institution" 
ON students FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM institution_members 
        WHERE institution_members.institution_id = students.institution_id 
        AND institution_members.user_id = auth.uid()
    )
);

-- More granular policies would be added per role during implementation.
