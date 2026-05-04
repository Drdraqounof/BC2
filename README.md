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

EduPanel is a Next.js teacher and student workspace for intervention planning, task assignment, and progress review. The app is currently in a mixed state: several dashboard surfaces now load from Prisma-backed API routes, while a few older screens still use transitional mock data from `app/dashboard-data.ts`.

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

- Campaign, student, teacher, and task API routes are implemented under `app/api/`
- Teacher task creation, campaign management, and student lookup now use database-backed fetches
- Student dashboards load assigned tasks and related campaign context from API-backed data
- Some pages still use transitional mock data while the mock-to-database migration is being completed
- Authentication is still local-storage based for now and is intended for prototype/demo flows
- Login and signup now enforce proper email formatting before continuing

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
		active-campaigns/
		ai-writer/
		task-assignment/
		view-tasks/
		students/
		layout.tsx
	api/
	components/
		sidebar-shell.tsx
	dashboard-data.ts
	features/
	homepage.tsx
	login/
	role-select/
	signup/
	student/
	page.tsx
	layout.tsx
```

## Notes For Development

- Shared dashboard demo content lives in `app/dashboard-data.ts`
- Global theme tokens and animation utilities live in `app/globals.css`
- The root page delegates to `app/homepage.tsx`
- The dashboard pages are grouped under `app/(dashboard)` and rendered inside the sidebar shell
- Reuse the Prisma singleton from `lib/prisma.ts` for server-side database access
- The repository root contains a leftover `package.json`; app commands and hosted builds should target `my-app/`

## Possible Next Steps

- Finish removing remaining mock task and campaign fallbacks
- Replace local-storage sign-in with real authentication for teachers and students
- Connect teacher submission review to live evidence and assignment data
- Add tests for navigation and page rendering
