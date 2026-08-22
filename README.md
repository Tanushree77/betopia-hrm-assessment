# Betopia HRMS — Attendance & Leave Management

A frontend-only HR Management System covering employee directory, attendance tracking, and leave management with role-based Admin/Employee views. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Zustand. No backend — all data is in-memory mock data, seeded at startup.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on a login screen with preconfigured personas (no password needed).

Other scripts:

```bash
npm run build   # production build
npm start       # run the production build
npm test        # run the unit test suite (Node's built-in test runner)
npm run lint    # eslint
```

## Logging in

Pick any persona from the login screen:

| Persona | Role |
|---|---|
| Tanusree Sen — Engineering Manager | Admin |
| Sadia Islam — HR Manager | Admin |
| Sultana Razia — Head of Product | Admin |
| Nusrat Jahan — Senior Engineer | Employee |
| Rakibul Islam — Software Engineer | Employee |
| Nayeem Chowdhury — UI/UX Designer | Employee |
| Tanvir Ahmed — Product Manager | Employee |
| Rima Sultana — Financial Analyst | Employee |

**Admins** get the workforce directory, org-wide attendance, leave approvals, and office-hours/policy settings. **Employees** get a personal dashboard, their own attendance log, leave balances, and the ability to apply for/cancel leave.

## What's here

- **Employee directory** — search, filter, sort, paginate, add/edit, per-employee profile with attendance and leave history.
- **Attendance** — monthly calendar and table views, daily punch widget, admin-configurable office hours/late threshold/weekend days that actually drive the displayed Late/Present status.
- **Leave management** — apply, approve/reject/cancel, full/half-day and overlap-aware validation, live balance calculation, and automatic sync into attendance records when a request is approved or reverted.
- **Dashboards** — an HR-wide stats/charts view for admins, a personal summary for employees.
- **Light/dark theme** — light by default, toggle in the top bar, persisted per browser.

## Project docs

- [CODEBASE.md](CODEBASE.md) — architecture, data flow, state management, component map, and how to extend the app.
- [SECURITY.md](SECURITY.md) — what's actually enforced, what isn't, and why (this is a frontend-only demo, not a production system).
- [task-progress.md](task-progress.md) — requirement-by-requirement build status.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zustand · Recharts · date-fns · lucide-react
