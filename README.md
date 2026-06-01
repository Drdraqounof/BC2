# EduPanel

## Problem Statement

Teachers currently rely on fragmented tools (gradebooks, spreadsheets, LMS dashboards, emails) to manage student performance and behavior. While data is available, it is not actionable in a structured workflow, making it difficult to:

- Identify which students need intervention
- Turn insights into concrete actions
- Track whether interventions are working
- Communicate effectively with students/parents

As a result, student issues are often reactive instead of proactive, and teacher workload increases due to manual tracking and messaging.

## Solution

EduPanel introduces **Campaigns**, a structured intervention system that transforms classroom data into goal-driven action plans.

Each campaign:
- Targets a specific issue (attendance, missing work, grades)
- Groups relevant students
- Defines a measurable outcome
- Tracks progress over time
- Automates communication via AI messaging

## Expected Outcome

EduPanel shifts teachers from:
- ❌ "Looking at data"
- ✅ "Acting on data with measurable outcomes"

## About

EduPanel is a Next.js teacher and student workspace for intervention planning, task assignment, and progress review. All core dashboard surfaces (campaigns, tasks, students) now load from Prisma-backed API routes with full database consistency. The landing page features user stories showing how teachers, students, and administrators benefit from structured interventions.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL (Docker)

## Product Areas

### Public Pages

- `/` landing page for EduPanel
- `/features` product overview and workflow explanation
- `/login` role-aware sign-in screen
- `/signup` teacher and student account creation flow
- `/role-select` workspace role chooser

### Dashboard Pages

- `/active-campaigns` teacher progress and campaign management workspace
- `/task-assignment` teacher task creation and assignment workspace
- `/view-tasks` teacher task review workspace
- `/students` student list with signals and support status
- `/ai-writer` prompt library and outreach draft preview

### Student Pages

- `/student` student task dashboard
- `/student/campaigns` assigned campaign overview
- `/student/submissions` student submission workspace
- `/student/progress` student progress metrics
- `/student/profile` student account summary

## Current Scope

- Campaign, student, teacher, and task API routes are fully implemented under `app/api/`
- All dashboard pages load real data from the database (no mock data fallbacks)
- Teacher task creation, campaign management, and student lookup use database-backed fetches
- Student dashboards load assigned tasks and campaigns from the API
- Campaign and task lists fetch from `/api/campaigns` and `/api/tasks` endpoints
- Student workspace now loads campaigns from the database based on real task assignments
- Authentication is still local-storage based for now and is intended for prototype/demo flows
- Login and signup now enforce proper email formatting before continuing
- Teacher profile page with edit capability is available under `/profile`

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Start Postgres With Docker

```bash
npm run docker:up
```

The database runs on `localhost:5432` by default.

### Prepare Prisma

```bash
npm run prisma:generate
npm run prisma:push
```

### Run The App

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run docker:up
npm run docker:down
npm run prisma:generate
npm run prisma:validate
npm run prisma:push
npm run prisma:migrate
npm run prisma:studio
```

## Docker And Database

- `docker-compose.yml` starts a Postgres 16 database and an app container
- `Dockerfile` builds the Next.js app for containerized runs
- `.env.example` shows the local database variables Prisma expects
- `.env` is included for local development only and is ignored by git
- Never commit real OAuth secrets; keep them only in `.env` or your deployment platform secret store
- Do not expose server secrets with a `NEXT_PUBLIC_` prefix
- Prisma config tolerates missing `.env` files so hosted environments like Vercel can use injected environment variables

## Prisma Schema

The schema lives in `prisma/schema.prisma` and models the current EduPanel domain:

- `Teacher` for teacher accounts and campaign ownership
- `Student` for tracked learners
- `Classroom` for teacher-linked class groups and roster organization
- `Campaign` for intervention plans
- `CampaignStudent` for campaign membership and per-student status
- `StudentSignal` for risk indicators like missing work or attendance
- `CampaignNote` for intervention notes
- `PromptTemplate` for reusable AI writer prompts
- `Task` for teacher-assigned work items
- `TaskAssignment` for per-student task completion tracking
- `ActivityLog` for high-level workflow history

## Project Structure

```text
app/
	(dashboard)/
		active-campaigns/       (campaigns from /api/campaigns)
		ai-writer/              (prompt templates and AI outreach)
		task-assignment/        (task creation and student assignment)
		view-tasks/             (teacher task review workspace)
		students/               (student roster with signals)
		profile/                (teacher profile with edit capability)
		layout.tsx
	api/
		campaigns/              (campaign CRUD)
		students/               (student roster and profile)
		tasks/                  (task management)
		teachers/               (teacher profile endpoints)
	components/
		sidebar-shell.tsx
		task-card.tsx
		task-list.tsx
	homepage.tsx                (landing page with user stories)
	use-teacher-workspace.ts    (teacher dashboard data hook)
	login/
	role-select/
	signup/
	student/
		use-student-workspace.ts (student dashboard data hook)
	page.tsx
	layout.tsx
```

## Notes For Development

- The landing page (`app/homepage.tsx`) includes user stories showcasing real workflows for teachers, students, and administrators
- Global theme tokens and animation utilities live in `app/globals.css`
- The root page delegates to `app/homepage.tsx` (redirects to features/login on non-root paths)
- The dashboard pages are grouped under `app/(dashboard)` and rendered inside the sidebar shell
- All dashboard pages fetch real data from API endpoints—no mock data fallbacks
- Reuse the Prisma singleton from `lib/prisma.ts` for server-side database access
- Teacher workspace hook is at `app/use-teacher-workspace.ts`
- Student workspace hook is at `app/student/use-student-workspace.ts`
- `app/dashboard-data.ts` contains only TypeScript type definitions (mock data has been removed)

## Possible Next Steps (Prioritized by Impact)

### Phase 2 — Improve UX
- [ ] Add "Risk Breakdown" cards showing why students are at risk (missing work, attendance patterns, etc.)
- [ ] Simplify dashboard navigation to reduce cognitive overload
- [ ] Add basic notification system for overdue tasks and campaign inactivity
- [ ] Add student motivation features: progress streaks, completion milestones

### Phase 3 — Authentication & Security
- [ ] Replace local-storage sign-in with session-based authentication (Auth.js or similar)
- [ ] Add protected routes and role-based access validation
- [ ] Implement secure session handling for teachers and students
- [ ] Add FERPA compliance considerations (data privacy, access controls)

### Phase 4 — Advanced Features
- [ ] Connect teacher submission review to live evidence and assignment data
- [ ] Add LMS integrations
- [ ] Implement outcome metrics (completion rates, grade improvements, attendance trends)
- [ ] Add predictive AI for intervention recommendations
