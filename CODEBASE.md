# CODEBASE.md — Betopia HRMS

A frontend-only HRM Attendance & Leave Management module. Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Zustand. No backend — everything runs client-side against in-memory mock data.

For what's done vs. outstanding, see [task-progress.md](task-progress.md). For working conventions, see [CLAUDE.md](CLAUDE.md).

## 1. Architecture overview

```
data/         → static seed data (the "database")
types/        → shared TypeScript interfaces
lib/          → pure business-logic functions (no React, no state)
store/        → Zustand stores (in-memory state + mutations)
services/     → thin read-oriented aggregation over stores/data
components/   → UI, grouped by domain (ui/, layout/, employees/, attendance/, leave/, dashboard/)
app/          → Next.js App Router pages (route = URL = permission boundary)
tests/        → Node test-runner unit tests for lib/ and store/
```

Data flows one direction: **`data/` seeds a `store/`**, components read the store via hooks and call store actions to mutate it, and `lib/` functions do the actual calculations (leave-day math, attendance summaries, validation) so components stay thin. `services/` sits between stores and dashboard-style components that need several stores combined (e.g. `dashboardService.getDashboardStats` merges `attendanceStore` + `leaveStore` output).

There is no server, no API routes, no database — closing the tab discards every mutation except what's explicitly persisted (see §3).

## 2. Routing and permission boundary

Every page is a Client Component (`'use client'`) wrapped in `<AppLayout allowedRoles={[...]}>` (`components/layout/AppLayout.tsx`):

- No session → redirect to `/login`.
- Session role not in `allowedRoles` → redirect to that role's home (`/admin/dashboard` for admin, `/dashboard` for employee).

Route layout:

| Path | Role | Page |
|---|---|---|
| `/login` | anyone | persona picker (no `AppLayout`, no guard) |
| `/admin/dashboard` | admin | HR-wide stats, charts, pending approvals |
| `/admin/employees`, `/admin/employees/[id]` | admin | directory, add/edit, per-employee detail (attendance/leave tabs) |
| `/admin/attendance` | admin | org-wide attendance table/calendar |
| `/admin/leave-requests` | admin | approve/reject queue |
| `/admin/settings` | admin | office-hours/late-threshold settings, leave policy + holiday reference |
| `/dashboard` | employee | personal overview, punch widget, leave balances |
| `/attendance` | employee | personal attendance log |
| `/leave-balance` | employee | personal balances + policy reference |
| `/leave-requests`, `/leave-requests/new` | employee | personal requests, apply form |
| `/` | any authenticated | dispatches to `AdminDashboard` or `EmployeeDashboard` by role |

**This route guard is the entire access-control model.** Employee data privacy (an employee can't view another employee's profile) works because the only per-employee detail view lives under the admin-only `/admin/employees/[id]` route — there's no employee-facing "view another employee" screen to gate separately.

## 3. State — Zustand stores

Each domain has one store in `store/`. All use `zustand`'s `create()`; two use the `persist` middleware (localStorage), three don't:

| Store | Persisted? | Seeded from | Purpose |
|---|---|---|---|
| `authStore.ts` | ✅ (`hrm-auth-session`) | `data/employees.ts` (via `MOCK_USERS`) | current `AuthSession` (mock login, no real credentials) |
| `themeStore.ts` | ✅ (`hrm-theme`) | — | `'light' \| 'dark'`, **defaults to `'light'`** |
| `employeeStore.ts` | ❌ | `data/employees.ts` | employee directory; `addEmployee`/`updateEmployee` are admin-only |
| `attendanceStore.ts` | ❌ | `data/attendance.ts`, `data/settings.ts` | attendance records + office settings; `updateSettings` is admin-only |
| `leaveStore.ts` | ❌ | `data/leaveRequests.ts` | leave requests; `updateStatus`/`submitRequest`/`cancelRequest` |

**Non-persisted stores reset on a hard page reload.** This is expected for a mock app — don't mistake it for a bug when testing (a `window.location` navigation wipes the day's approvals, added employees, etc., back to the seed data; client-side route transitions do not).

### Authorization pattern (store-layer, not just UI)

Every HR-only mutation takes an `actorRole: UserRole` parameter and rejects non-admins *inside the store*, so hiding a button in the UI isn't the only thing standing between an employee-role session and an admin action:

```ts
// store/leaveStore.ts
updateStatus(requestId, status, actorRole, reviewedBy?, reviewNote?)
  // → { success: false, error: 'Unauthorized.' } if actorRole !== 'admin'

// store/attendanceStore.ts
updateSettings(settings, actorRole) // same pattern

// store/employeeStore.ts
addEmployee(employee, actorRole)
updateEmployee(id, updates, actorRole)
```

`leaveStore.submitRequest(req, requesterId)` additionally checks `requesterId === req.employeeId` and that `requesterId` resolves to a real employee, so a request can't be filed as someone else. `cancelRequest(requestId, employeeId)` checks ownership the same way.

**Callers must check the returned `{success, error}` and surface `error` to the user** — several UI bugs fixed for T-31 were exactly this: a rejected mutation being silently swallowed by the calling component.

### Cross-store side effect: leave ↔ attendance sync

`leaveStore.updateStatus` and `cancelRequest` call `attendanceStore.getState().syncLeaveRecords(employeeId, startDate, endDate, leaveRequestId, action)` directly (plain zustand store-to-store call, no event bus):

- `action: 'apply'` (on approval) — writes an `AttendanceRecord` with `status: 'Leave'` and `leaveRequestId` set, for every working day in range (weekends excluded via the live `settings.weekendDays`), overwriting whatever was there before.
- `action: 'revert'` (on rejection/cancellation) — deletes every record tagged with that `leaveRequestId`, so those dates fall back to `AttendanceCalendar`'s computed Weekend/Holiday/Absent status.

### Settings actually affect calculations

`attendanceStore.settings` (`startTime`, `endTime`, `lateThresholdMinutes`, `weekendDays`, `workHoursPerDay`) is threaded through `lib/dateUtils.ts` (`isWeekendDate`, `isWorkingDay`, `isLateArrival` — all take settings as a parameter, defaulting to the seed constant for old callers) and `lib/attendanceCalculator.ts`'s `getEffectiveStatus(record, settings)`, which re-derives Present vs. Late from `record.checkIn` against the *live* threshold rather than trusting a status baked into the mock data. Every attendance view (`AttendanceTable`, `AttendanceCalendar`, `computeAttendanceSummary` callers) reads `useAttendanceStore().settings` and passes it through — changing the late-threshold in Admin → Settings immediately changes what's displayed, with no dataset rewrite needed.

## 4. Business logic (`lib/`)

Pure functions, no React/store imports (except `attendanceCalculator.ts` taking settings as a plain argument) — the layer to unit-test:

- **`leaveCalculator.ts`** — `calculateLeaveDays` (half-day + weekend-exclusion math), `detectOverlap`, `validateStatusTransition` (the `LeaveRequestStatus` state machine: Pending → Approved/Rejected, Approved → Cancelled, everything else rejected), `validateLeaveRequest` (join/resign date bounds, balance check, overlap check), `computeLeaveBalances`.
- **`attendanceCalculator.ts`** — `computeAttendanceSummary`, `getEffectiveStatus`.
- **`dateUtils.ts`** — `isWeekendDate`, `isWorkingDay`, `isHolidayDate`, `isLateArrival`, `formatDate`, `getDaysInMonth`, `todayStr`.
- **`employeeDirectory.ts`** — `sortEmployees`, `paginateEmployees` (search/filter itself lives in `EmployeeList.tsx`).
- **`utils.ts`** — `cn` (clsx + tailwind-merge), `generateId`, status→CSS-class maps.

`tests/` covers this layer plus the store authorization/sync behavior (`tests/storePermissions.test.ts`, `tests/leaveAttendanceSync.test.ts`, `tests/attendanceSettings.test.ts`). Run via `npm test` (Node's built-in test runner, no external framework — see `tests/setup/` for the `@/` path-alias loader).

## 5. Components

- **`components/ui/`** — design-system primitives (`Button`, `Card`, `Input`, `Select`, `Modal`, `Badge`, `Avatar`, `DataTable`, `Tabs`, `StatCard`). `Card` and several others use a CSS-variable-backed `.card` class (`app/globals.css`) that already flips per theme — prefer it over one-off literal colors. `Modal` implements a full focus trap (Tab-cycling, focus-on-open, focus-restore-on-close, Escape-to-close, `role="dialog"`).
- **`components/layout/`** — `AppLayout` (route guard, see §2), `Sidebar` (role-based nav), `Navbar` (persona switcher, theme toggle), `ThemeProvider` (applies the `dark` class to `<html>` based on `themeStore`).
- **`components/employees/`** — `EmployeeList` (search/filter/sort/paginate + Add), `EmployeeDetail` (tabbed profile/leave/attendance view, Edit), `EmployeeFormModal` (shared add/edit form with validation).
- **`components/attendance/`** — `AttendanceTable`, `AttendanceCalendar` (monthly grid, day-detail modal), `AttendanceStats`, `PunchWidget` (mock live clock-in/out).
- **`components/leave/`** — `LeaveRequestForm` (apply), `LeaveRequestList` (tabbed by status, admin gets approve/reject), `LeaveApprovalModal`, `LeaveBalanceCards`.
- **`components/dashboard/`** — `AdminDashboard`, `EmployeeDashboard` — the two `/` and `/admin/dashboard`/`/dashboard` bodies.

## 6. Theming

`store/themeStore.ts` (`theme: 'light' | 'dark'`, **default `'light'`**, persisted). Tailwind v4 class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *));` in `app/globals.css`. `app/layout.tsx` runs a `next/script` (`strategy="beforeInteractive"`) to apply the persisted class before first paint (avoids a flash); `<html>` carries `suppressHydrationWarning` because of this — don't remove it. Every new literal color needs a light default paired with a `dark:` override (`bg-slate-100 dark:bg-slate-900/60` style) — see CLAUDE.md for the convention and gotchas (compound modifiers like `dark:hover:` need care with any scripted find/replace).

## 7. Extension plan — adding a new feature

1. **New data shape** → add the type to `types/`, seed data to `data/`.
2. **New state** → new file in `store/`, following the existing pattern (non-persisted unless it's a user preference like theme/auth). If it has HR-only mutations, give them an `actorRole` parameter and reject non-admins, returning `{success, error}` — never throw.
3. **New calculation** → pure function in `lib/`, unit-tested in `tests/`.
4. **New cross-store effect** (like leave→attendance sync) → a store method the *other* store calls directly via `useOtherStore.getState().method(...)`; don't build a generic event bus for two consumers.
5. **New page** → under `app/`, wrapped in `<AppLayout allowedRoles={[...]}>`. Decide up front whether it's admin-only, employee-only, or either.
6. **New UI** → compose from `components/ui/` primitives where possible; pair every literal color for both themes.
7. Update [task-progress.md](task-progress.md) if the feature maps to a tracked requirement.

## 8. Known limitations (frontend-only)

See [SECURITY.md](SECURITY.md) for the full security-specific writeup. In brief:

- **No real backend.** All "persistence" is an in-memory JS object; a hard reload resets non-persisted stores to seed data. There is no database, no API, no server-side validation.
- **No real authentication.** Login is a persona picker with no password — `authStore.login(employeeId)` trusts whatever `employeeId` it's given and looks up the matching mock user. This is a demo/assessment convenience, not a security boundary.
- **Client-side-only authorization.** The `actorRole` checks in stores prevent one honest UI from calling an action it shouldn't, but a user with devtools access can call `useLeaveStore.getState().updateStatus(id, 'Approved', 'admin')` directly from the console and it will succeed — there's no server to enforce the boundary. This is inherent to a frontend-only app, not a bug to "fix" further within this architecture.
- **Attendance/leave data is not shared across browser tabs or devices** — it's per-tab in-memory state (except `authStore`/`themeStore`, which use `localStorage` and so are shared per-browser).
- **Punch clock (`PunchWidget`) is cosmetic** — it doesn't write real check-in/out times back into `attendanceStore`.
