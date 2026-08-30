/* ============================================================
   auth.js - session management (sessionStorage) + login/logout
   ============================================================ */

const SESSION_KEY = 'scrs_session_v1';

function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}

function setSession(session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}

// Redirect helpers to be called at the top of protected pages.
// basePath = '' when the page is in the project root, '../' when one folder deep.
function requireAdmin(basePath) {
    const s = getSession();
    if (!s || s.role !== 'admin') {
        window.location.href = basePath + 'admin/login.html';
    }
}

function requireStudent(basePath) {
    const s = getSession();
    if (!s || s.role !== 'student') {
        window.location.href = basePath + 'student/login.html';
    }
}

async function adminLogin(username, password) {
    await seedIfEmpty();
    const data = Store.get();
    const hash = await hashPassword(password);
    if (data.admin && data.admin.username.toLowerCase() === username.toLowerCase() && data.admin.passwordHash === hash) {
        setSession({ role: 'admin', username: data.admin.username });
        return true;
    }
    return false;
}

async function studentLogin(enrollment_no, password) {
    await seedIfEmpty();
    const student = Store.findStudentByEnrollment(enrollment_no);
    if (!student) return false;
    const hash = await hashPassword(password);
    if (student.passwordHash === hash) {
        setSession({ role: 'student', id: student.id, enrollment_no: student.enrollment_no });
        return true;
    }
    return false;
}

function logout(redirectTo) {
    clearSession();
    window.location.href = redirectTo;
}

// ---------- Flash messages (survive one page navigation) ----------
function setFlash(type, message) {
    sessionStorage.setItem('scrs_flash', JSON.stringify({ type, message }));
}

function popFlash() {
    const raw = sessionStorage.getItem('scrs_flash');
    if (!raw) return null;
    sessionStorage.removeItem('scrs_flash');
    try { return JSON.parse(raw); } catch (e) { return null; }
}

function renderFlash(containerId) {
    const flash = popFlash();
    if (!flash) return;
    const el = document.getElementById(containerId);
    if (!el) return;
    const div = document.createElement('div');
    div.className = 'alert alert-' + flash.type;
    div.textContent = flash.message;
    el.prepend(div);
}
