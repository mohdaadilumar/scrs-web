# Student Course Registration System (SCRS) — HTML / CSS / JavaScript Version

A simple, beginner-friendly **client-side only** web app for a college lab project.
No server, no database install, no build step — just open it in a browser.

Two user types: **Admin** (manages students and courses) and **Student** (registers for courses within a credit limit).

---

## 1. Tech Stack

- **Plain HTML, CSS, and vanilla JavaScript** — no frameworks, no build tools
- **`localStorage`** acts as the "database" — all data (admin, students, courses, registrations) is saved in the browser
- **Web Crypto API** (`crypto.subtle`) — built into every modern browser, used to hash passwords (SHA-256) so nothing is stored in plain text
- **jsPDF** (loaded from a CDN) — used only on the "Download Registration Card" page to generate a real, downloadable `.pdf` file. Everything else needs zero external libraries.

Because everything runs in the browser, this project needs **no XAMPP, no MySQL, no Node.js** — it is the simplest possible way to demo this system.

---

## 2. Folder Structure

```
scrs-web/
├── admin/                        Admin pages
│   ├── login.html
│   ├── dashboard.html
│   ├── students.html             List + delete
│   ├── student-form.html         Add AND Edit (same form, ?id=.. switches mode)
│   ├── student-view.html
│   ├── courses.html              List + delete
│   ├── course-form.html          Add AND Edit
│   └── registrations.html
├── student/                      Student pages
│   ├── login.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── register.html             Course selection + credit-limit check + submit
│   ├── my-registration.html
│   └── registration-card.html    Printable card + real PDF download (jsPDF)
├── assets/
│   ├── css/style.css             All styling
│   └── js/
│       ├── db.js                 localStorage "database" layer + seed data
│       └── auth.js               Session/login/logout helpers
└── index.html                    Landing page (choose Admin or Student login)
```

---

## 3. How to Run (30 seconds, no installation)

1. Unzip the project anywhere on your computer.
2. Double-click `index.html` to open it in your browser (Chrome, Edge, or Firefox recommended).
   - Or, for the cleanest experience, right-click the folder in VS Code and choose **"Open with Live Server"** if you have that extension.
3. That's it — the database is created automatically the first time the site loads (see credentials below).

> **Note on the PDF download:** the "Download as PDF" button loads the `jsPDF` library from a CDN, so it needs an internet connection. Everything else (login, adding students/courses, credit-limit checks, registration) works fully offline. The "Print" button always works offline via the browser's own print dialog.

---

## 4. Default Login Credentials

| Role    | Username / Enrollment No | Password    |
|---------|---------------------------|-------------|
| Admin   | `admin`                    | `admin123`  |
| Student | `ENR2026001`                | `student123`|

These are created automatically the first time the site runs. Change them via the Admin dashboard / student profile after logging in.

---

## 5. Sample Data Included

8 sample courses are pre-loaded (CS101, CS102, CS201, CS202, CS301, CS302, MA101, HS101) with credits ranging 2–4 and modes A/B/C, so the credit-limit logic can be demoed immediately.

---

## 6. Testing Steps (Demo Script)

1. **Admin login** → `admin` / `admin123`.
2. **Manage Students → Add Student** — create a student with **Maximum Credit Limit = 10** (makes the limit easy to demo).
3. **Manage Courses** — confirm the 8 sample courses are listed.
4. **Logout**, then **Student Login** as the student you created.
5. **Course Registration** — select courses one by one; watch **Selected Credit** / **Remaining Credit** update live.
6. Select enough courses to exceed the limit (e.g. limit 10, pick two 4-credit + one 3-credit = 11). Confirm the message **"Credit limit exceeded. You cannot select this course."** appears.
7. Deselect a course, then **Submit Registration**. Confirm the popup, then check the Registration Summary and unique Registration ID.
8. **My Registration** — confirm the saved summary is correct.
9. **Download Course Registration Card** → click **Download as PDF** to save a real PDF, or **Print** to use the browser's print dialog.
10. Back in **Admin → Registrations**, confirm the student's registration is visible to Admin.
11. In **Manage Students**, test **Edit** (change email/mobile, reset password) and **View**.
12. As the student, go to **My Profile** and confirm only **Profile Picture, Email, and Mobile Number** are editable — Name, Enrollment Number, Faculty Number, and Credit Limit are read-only.

---

## 7. Important Notes About This Version

- **Data lives only in your browser.** It's stored in that browser's `localStorage` under the key `scrs_data_v1`, scoped to wherever you're opening the file from. Clearing your browser's site data, or opening the file from a different computer/browser, starts fresh.
- **This is not multi-device or multi-user in real time.** Two people opening `index.html` on two different computers will each have their own separate data — there's no shared server. This matches the scope of a client-side lab demo; if your instructor requires shared/multi-user data, use the PHP + MySQL version instead.
- **Passwords are hashed** (SHA-256 via the browser's built-in Web Crypto API) before being stored, so they aren't kept in plain text — though for a genuinely secure production system you'd want a server-side backend, since anyone with browser dev tools can technically inspect `localStorage`.
- Profile pictures are stored as embedded Base64 images directly inside `localStorage` (kept under 2MB per upload to avoid hitting browser storage limits).
- **To reset all data** back to the sample defaults, open your browser's DevTools Console on any page of the site and run: `localStorage.clear()`, then refresh.

---

## 8. Possible Extensions (optional, if you have extra time)

- Add an Admin "reset registration" button so a submitted registration can be reopened for edits.
- Add course seat limits (max students per course).
- Add a "Reset Sample Data" button in the UI instead of using DevTools.
- Move to the PHP + MySQL version if your lab requires a real shared server-side database.
