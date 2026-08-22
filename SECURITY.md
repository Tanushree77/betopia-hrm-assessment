# SECURITY.md — Betopia HRMS

This is a **frontend-only demo application** — there is no backend, no database, and no network boundary. Everything described here should be read with that context: the goal is to be honest about what's actually enforced client-side versus what would need a real server to be a genuine security control.

## What's implemented

### Route-based access control

`components/layout/AppLayout.tsx` guards every page via an `allowedRoles` prop:

- No session → redirect to `/login`.
- Session role not in `allowedRoles` → redirect to that role's own home route.

Admin-only screens (`/admin/**`) and employee-only screens (`/dashboard`, `/attendance`, `/leave-balance`, `/leave-requests*`) are separated this way. There is no page that lets an employee browse another employee's data — the only per-employee detail view lives at the admin-only `/admin/employees/[id]`.

### Store-layer authorization (defense in depth)

Every HR-only mutation checks the caller's role *inside the Zustand store*, not just by hiding the triggering button in the UI:

```ts
leaveStore.updateStatus(requestId, status, actorRole, ...)      // actorRole !== 'admin' → rejected
attendanceStore.updateSettings(settings, actorRole)              // same
employeeStore.addEmployee(employee, actorRole)                   // same
employeeStore.updateEmployee(id, updates, actorRole)              // same
```

`leaveStore.submitRequest(req, requesterId)` requires `requesterId === req.employeeId` and that the id resolves to a real employee — a request can't be filed on someone else's behalf by passing an arbitrary `employeeId`. `cancelRequest` checks the same ownership relationship.

This means even a UI bug that accidentally rendered an admin control for an employee session would still be rejected at the store layer.

### Session handling

`store/authStore.ts` persists `{ employeeId, role, employee }` to `localStorage`. No unauthenticated route auto-grants a session — the earlier "auto-login as admin for anyone with no session" behavior was identified and removed; unauthenticated visitors now land on `/login`.

### Data validation

Leave requests are validated against join/resignation dates, remaining balance, and overlapping active requests (`lib/leaveCalculator.ts`) before they're accepted, both when submitting and when an admin attempts a status transition (`validateStatusTransition` enforces the legal state machine: `Pending → Approved/Rejected`, `Approved → Cancelled`, nothing else).

## What's explicitly NOT implemented (and why)

This is the honest part. None of the below is a bug to file — they're inherent to a frontend-only architecture and would require a real backend to fix properly.

| Gap | Detail |
|---|---|
| **No real authentication** | Login is a persona picker with no password. `authStore.login(employeeId)` trusts whatever id it's given. Anyone with the app open can switch to any persona, including admins, with one click. |
| **No server-enforced authorization** | The `actorRole` checks in stores prevent an *honest UI* from performing an action it shouldn't. They do **not** stop a user from opening devtools and running `useLeaveStore.getState().updateStatus(id, 'Approved', 'admin')` directly — the check happens in client-side JavaScript the user fully controls. A real system needs the same checks re-enforced on a server that the client cannot bypass. |
| **No encryption or secure transport concerns** | There's no network traffic carrying credentials or session tokens to secure — `localStorage` holds the mock session in plaintext, which is fine for a demo and would not be fine for real credentials. |
| **No CSRF/XSS-specific hardening beyond React's defaults** | React's JSX escaping covers the common XSS case for rendered data. There are no user-controlled `dangerouslySetInnerHTML` sites and no forms that POST to external endpoints, so CSRF doesn't apply here — but this isn't a substitute for the hardening a real API-backed app needs (CSRF tokens, SameSite cookies, input sanitization at a trust boundary). |
| **No audit trail persistence** | `reviewedBy`/`reviewedAt`/`reviewNote` are recorded on a `LeaveRequest`, but since state isn't persisted to a database, this history disappears on a hard reload. |
| **No rate limiting / abuse prevention** | Not applicable without a server to enforce it. |
| **Non-persisted mutable state** | `employeeStore`, `attendanceStore`, and `leaveStore` reset to seed data on a hard page reload (only `authStore` and `themeStore` use `localStorage`). This is a data-durability limitation, not a security one, but it's worth stating plainly: nothing done in this app survives a real restart without a backend. |

## If this were becoming a real product

The path from here to something production-appropriate: replace the mock `authStore` with real authentication (a proper identity provider or credential+session flow), move every `actorRole` check from the Zustand stores into API route handlers backed by the authenticated session (not a client-supplied parameter), persist all domain data in a real database with the same authorization checks enforced at the data-access layer, and add the transport/CSRF/rate-limiting concerns that come with having an actual network boundary. The `lib/` business-logic functions (leave-day math, validation rules, overlap detection) are already pure and framework-agnostic, so they'd port to a server context largely unchanged.
