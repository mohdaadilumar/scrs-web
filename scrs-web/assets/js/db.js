/* ============================================================
   db.js - localStorage-backed "database" for the
   Student Course Registration System (pure HTML/CSS/JS version)
   ============================================================ */

const DB_KEY = 'scrs_data_v1';

// ---------- Low-level load / save ----------
function loadDB() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// ---------- Password hashing (SHA-256 via built-in Web Crypto API) ----------
async function hashPassword(plain) {
    const enc = new TextEncoder().encode(plain);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------- ID helpers ----------
function nextId(list) {
    return list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
}

function makeRegistrationId(studentId) {
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `REG${year}-${String(studentId).padStart(4, '0')}-${rand}`;
}

// ---------- Seed default data on first run ----------
async function seedIfEmpty() {
    let data = loadDB();
    if (data) return data;

    const adminHash = await hashPassword('admin123');
    const studentHash = await hashPassword('student123');

    data = {
        admin: { username: 'admin', passwordHash: adminHash },
        students: [
            {
                id: 1,
                name: 'Rahul Sharma',
                enrollment_no: 'ENR2026001',
                faculty_no: 'FAC5501',
                email: 'rahul.sharma@example.com',
                mobile: '9876543210',
                passwordHash: studentHash,
                max_credit: 24,
                profile_pic: null,
                created_at: new Date().toISOString()
            }
        ],
        courses: [
            { id: 1, code: 'CS101', name: 'Introduction to Programming', credit: 4, mode: 'A' },
            { id: 2, code: 'CS102', name: 'Data Structures', credit: 4, mode: 'A' },
            { id: 3, code: 'CS201', name: 'Database Systems', credit: 3, mode: 'B' },
            { id: 4, code: 'CS202', name: 'Computer Networks', credit: 3, mode: 'B' },
            { id: 5, code: 'CS301', name: 'Operating Systems', credit: 4, mode: 'A' },
            { id: 6, code: 'CS302', name: 'Web Technologies', credit: 3, mode: 'C' },
            { id: 7, code: 'MA101', name: 'Discrete Mathematics', credit: 3, mode: 'B' },
            { id: 8, code: 'HS101', name: 'Communication Skills', credit: 2, mode: 'C' }
        ],
        cart: [],           // { student_id, course_id }
        registrations: []   // { id, registration_id, student_id, total_credit, remaining_credit, date, courses: [...] }
    };

    saveDB(data);
    return data;
}

// ---------- Convenience accessors ----------
const Store = {
    get: () => loadDB() || { admin: null, students: [], courses: [], cart: [], registrations: [] },
    save: saveDB,

    findStudentByEnrollment(enrollment_no) {
        return this.get().students.find(s => s.enrollment_no.toLowerCase() === enrollment_no.toLowerCase());
    },
    findStudentById(id) {
        return this.get().students.find(s => s.id === Number(id));
    },
    findCourseById(id) {
        return this.get().courses.find(c => c.id === Number(id));
    },
    cartForStudent(studentId) {
        const data = this.get();
        const courseIds = data.cart.filter(c => c.student_id === Number(studentId)).map(c => c.course_id);
        return data.courses.filter(c => courseIds.includes(c.id));
    },
    registrationForStudent(studentId) {
        const data = this.get();
        return data.registrations.find(r => r.student_id === Number(studentId)) || null;
    }
};

// ---------- Escape helper (avoid basic HTML injection from stored text) ----------
function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
