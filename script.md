## Script: BC2 Auth And Email Walkthrough

### Intro
In this walkthrough I’m going to show the current authentication and email flow in this BC2 repo. This is not the Google OAuth version we discussed earlier. The code in this workspace is a prototype flow built around Prisma-backed account APIs, a client-side login and signup experience, localStorage session state, and an SMTP email endpoint.

I’ll cover five things:
1. What the repo says about the current auth scope.
2. What account data is actually persisted in Prisma.
3. How signup works for teachers and students.
4. How signin works and where session state is stored.
5. How email sending works today.

### Repo Scope And Environment Notes
Start in [README.md](README.md#L40).

The key point to call out here is that the project explicitly says authentication is still local-storage based for prototype and demo flows. That matters because it tells the audience not to expect OAuth callbacks, token refresh logic, or a provider setup in this repo.

Later in the README, look at the Docker and database notes in [README.md](README.md#L95).

What these lines are doing:
- They explain that Prisma and Postgres are part of the current stack.
- They mention `.env.example` and `.env`, but this repo does not currently include a `.env.local` walkthrough surface like the OAuth script expected.
- They also warn not to commit OAuth secrets, which is useful context because OAuth appears to be planned but not wired here.

Talk track:
“Before I dive into the routes, I want to frame the current implementation correctly. This repo is still using prototype authentication. Prisma and Postgres are live, but the sign-in state is still client-managed, and there is no Google OAuth handler in this snapshot.”

### Prisma Schema: What The App Persists
Open [prisma/schema.prisma](prisma/schema.prisma#L1).

The first lines define the Prisma client and the PostgreSQL datasource. That tells us the app persists account and workflow data in Postgres rather than keeping everything in frontend state.

Then move into the core account models in [prisma/schema.prisma](prisma/schema.prisma#L54).

What to explain here:
- `School` is a shared parent record so teachers and students can be associated with a school.
- `Teacher` stores the teacher’s email, first name, last name, optional school relation, and links to classrooms, campaigns, tasks, and activity logs.
- `Student` stores the student’s email, hashed password, name, optional grade and classroom references, plus task and campaign relationships.
- `Classroom` links teachers to students through a classroom code and teacher relation.

Important recording note:
There is no model here for OAuth tokens, Gmail sync state, onboarding answers, or provider sessions. That is the cleanest proof that the earlier Google OAuth walkthrough does not match this repo.

Talk track:
“This schema tells us what is actually durable in the app today. Teacher and student records are persisted, classrooms are persisted, and campaign or task workflows are persisted. But there’s no token table, no onboarding preference model, and no provider session state in Prisma yet.”

### Signup UI: Multi-Step Client Flow
Open [app/signup/page.tsx](app/signup/page.tsx#L1).

Start around the state setup in [app/signup/page.tsx](app/signup/page.tsx#L10).

What these lines do:
- `useSearchParams()` reads the `role` from the URL, so the same page can behave as either teacher signup or student signup.
- `step` controls the three-step flow: email, password, then profile info.
- `formData` stores the full working payload for the form.
- `isLoading` and `error` control UX feedback while requests are running.

Then explain the validation in [app/signup/page.tsx](app/signup/page.tsx#L25).

What this block is doing:
- `handleInputChange` is the generic change handler, so every input writes into the same `formData` object.
- `handleNextStep` validates the current step before moving forward.
- On the email step, it trims the email and validates it against `EMAIL_PATTERN`.
- On the password step, it checks presence, password confirmation, and a minimum length of eight characters.

This is a good moment to explain control flow:
The component is intentionally validating early in the client so the user does not hit the API with obviously bad data.

Next, show the submit logic in [app/signup/page.tsx](app/signup/page.tsx#L56).

What this block is doing:
- It stops the default form submit.
- It clears the prior error and sets loading state.
- It branches by role.
- If the role is student, it sends a `POST` to `/api/students` with name, email, password, grade, and classroom code.
- If the role is teacher, it sends a `POST` to `/api/teachers` with name, email, school, and subject.
- On success, it redirects to the matching login page.

Important nuance to call out:
Teacher signup collects a password in the shared flow, but the teacher API does not persist one. In the current repo, teacher signin only checks whether the teacher email exists. That is an implementation detail worth mentioning because it shows this is still a prototype auth system rather than a fully enforced credential flow.

Talk track:
“This page is doing most of the user-facing flow work. It decides which role we’re creating, validates the staged inputs, and turns that state into the API payload. The main job of this file is orchestration, not persistence. The actual account creation happens in the route handlers.”

### Student Account API
Open [app/api/students/route.ts](app/api/students/route.ts#L1).

Start with the `GET` handler in [app/api/students/route.ts](app/api/students/route.ts#L5).

What these lines do:
- They read optional query parameters like `email`, `classroomId`, and `teacherEmail`.
- They build a Prisma `where` filter object incrementally.
- They allow the same endpoint to support several use cases: find one student by email, find students in a classroom, or find students scoped to a teacher through the classroom relation.
- They return a selected shape instead of the full student record, which avoids exposing everything in the table.

Then move to the `POST` handler in [app/api/students/route.ts](app/api/students/route.ts#L46).

What this section is doing:
- It parses the JSON request body.
- It validates the required fields for student account creation.
- It checks for an existing student with the same email to prevent duplicates.
- It hashes the plaintext password with `bcrypt.hash(password, 10)` before saving.
- If a `classroomId` is provided, it resolves that classroom and copies its code into the student record.
- It creates the student in Prisma and returns a minimal success payload.

This is the most important backend security note in the current auth flow:
Students do at least get a hashed password stored in the database. That means the storage model is more realistic than the login model, which still does not actually verify the password on signin.

Talk track:
“This route is where the student account becomes durable. The interesting part is that it is doing real password hashing and relational lookup for classrooms, so the persistence layer is more serious than the current frontend signin behavior.”

### Teacher Account API
Open [app/api/teachers/route.ts](app/api/teachers/route.ts#L1).

Start with the `GET` handler in [app/api/teachers/route.ts](app/api/teachers/route.ts#L15).

What this block does:
- It optionally reads an email query parameter.
- If an email is present, it fetches exactly one teacher and their school relation.
- If no email is present, it returns all teachers.
- It uses `formatTeacherResponse` so the API returns a stable shape with `schoolName` flattened from the relation.

Then explain the `POST` handler in [app/api/teachers/route.ts](app/api/teachers/route.ts#L42).

What these lines are doing:
- They validate required teacher fields.
- They check for duplicate teacher email.
- If a school name is provided, they upsert a `School` record so duplicate names reuse the same row.
- They create the teacher and attach the optional `schoolId`.

The main contrast with the student route is worth saying out loud:
There is no teacher password hashing or password storage path here. So teacher creation is effectively identity registration, not full credential registration.

Talk track:
“This route is straightforward Prisma persistence. The main thing to notice is the `upsert` on school, which avoids creating duplicate school rows. It also reveals that teacher auth is not complete yet, because the route doesn’t store a password.”

### Login UI And Session State
Open [app/login/page.tsx](app/login/page.tsx#L1).

Start with the page state in [app/login/page.tsx](app/login/page.tsx#L18).

What this setup does:
- Reads the `role` from the query string so one page can render teacher or student signin.
- Stores email and password locally in `formData`.
- Uses a toast hook for success and error feedback.
- Uses `useTransition` so navigation can happen without blocking the UI.

Then show the submit flow in [app/login/page.tsx](app/login/page.tsx#L31).

What this code is doing:
- It trims and validates the email format first.
- It chooses the destination route based on the selected role.
- For teachers, it calls `/api/teachers?email=...` to verify a matching teacher exists.
- For students, it calls `/api/students?email=...` to verify at least one matching student exists.
- If the lookup succeeds, it writes either `edupanel.teacherEmail` or `edupanel.studentEmail` into localStorage.
- It removes the opposite role key so only one active role stays stored.
- It redirects with `router.push` wrapped in `startTransition`.

This is the most important explanation for the current sign-in system:
The password field is collected in the UI, but the route does not actually verify it against stored credentials. The current login is account-existence based, not real credential verification.

Then connect that to the rest of the app.
Several dashboard pages read the stored teacher email from localStorage to scope data loading. You can see this pattern in [app/(dashboard)/active-campaigns/page.tsx](app/(dashboard)/active-campaigns/page.tsx#L166), [app/(dashboard)/students/page.tsx](app/(dashboard)/students/page.tsx#L135), and [app/(dashboard)/task-assignment/page.tsx](app/(dashboard)/task-assignment/page.tsx#L236).

What those lines do:
- They read the teacher email from localStorage.
- They use that email to query teacher or student APIs.
- That means localStorage is functioning as the current lightweight session mechanism.

Talk track:
“This login page is doing verification by existence, not by password check. The key side effect is the localStorage write. Once that teacher or student email is stored, downstream dashboard pages use it as their session context when they fetch data.”

### Email Sending Route
Open [app/api/email/send/route.ts](app/api/email/send/route.ts#L1).

Start at the helper functions in [app/api/email/send/route.ts](app/api/email/send/route.ts#L4).

What these helpers do:
- `readRequiredEnv` centralizes environment variable validation.
- `buildTransport` pulls SMTP credentials from the environment.
- It detects whether the configured sender is a Gmail address and, if so, defaults to `smtp.gmail.com` and port `587` when host and port are not explicitly configured.
- It validates that the final port is numeric before creating the Nodemailer transport.
- `resolveFromEmail` chooses a custom from address when available, otherwise it falls back to `SMTP_USER`.

Then show the `POST` handler in [app/api/email/send/route.ts](app/api/email/send/route.ts#L45).

What this section is doing:
- It reads JSON from the request.
- It validates `to`, `subject`, and `message` as required fields.
- It derives the display name from `SMTP_FROM_NAME`, or falls back to the teacher name in the request, or finally `EduPanel`.
- It builds the transport and sends a plain-text email with `replyTo` pointing at the teacher when available.
- If anything fails, it logs the error and returns a structured JSON error response.

Important architecture note:
This is SMTP sending, not Gmail API access. So it can send through Gmail SMTP if the credentials are Gmail credentials, but it does not fetch messages, store OAuth tokens, proxy attachments, or call Google userinfo endpoints.

Talk track:
“This route is the actual email integration surface in the repo today. It is server-side, environment-driven, and uses Nodemailer. The Gmail part is only SMTP host inference, not OAuth-based Gmail API access.”

### Final Summary
This repo’s current auth and email story is:
- Prisma persists teachers, students, schools, classrooms, and learning workflow data.
- Signup is a multi-step client flow that sends data to Prisma-backed APIs.
- Student creation hashes passwords, but current signin still works by account lookup rather than password verification.
- Session context is stored in localStorage and reused by dashboard pages.
- Email sending happens through a server route using SMTP and Nodemailer.

### Final Notes To Say On Recording
If you want to close with the gap between current and future state, say this:

“The next hardening step would be replacing localStorage session handling with real authentication, adding password verification for both roles, and, if the product needs Google integrations, introducing a proper OAuth flow, secure token persistence, and refresh token management. None of that is in this repo snapshot yet, so this walkthrough stays focused on the code that is actually implemented.”