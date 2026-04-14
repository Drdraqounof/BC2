# EduPanel

EduPanel is a Next.js prototype for a teacher-facing intervention workspace. It focuses on one workflow: surface classroom signals, turn them into campaigns, and track whether support is improving outcomes.

The current app is a front-end demo. Pages are driven by local mock data in `app/dashboard-data.ts`, and the login flow is navigational only.

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
- `/login` teacher sign-in screen

### Dashboard Pages

- `/active-campaigns` active intervention campaigns
- `/progress-tracking` outcome metrics and four-week trends
- `/students` student list with signals and support status
- `/ai-writer` prompt library and outreach draft preview

## Current Scope

- Marketing site and dashboard UI are implemented
- Dashboard content is powered by static demo data
- Sidebar navigation is shared through the dashboard layout
- No database, API routes, or persistent auth are configured yet
- No form submission or server-side data mutations are implemented yet

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

## Prisma Schema

The schema lives in `prisma/schema.prisma` and models the current EduPanel domain:

- `Teacher` for teacher accounts and campaign ownership
- `Student` for tracked learners
- `Campaign` for intervention plans
- `CampaignStudent` for campaign membership and per-student status
- `StudentSignal` for risk indicators like missing work or attendance
- `CampaignNote` for intervention notes
- `PromptTemplate` for reusable AI writer prompts

## Project Structure

```text
app/
	(dashboard)/
		active-campaigns/
		ai-writer/
		progress-tracking/
		students/
		layout.tsx
	components/
		sidebar-shell.tsx
	dashboard-data.ts
	features/
	homepage.tsx
	login/
	page.tsx
	layout.tsx
```

## Notes For Development

- Shared dashboard demo content lives in `app/dashboard-data.ts`
- Global theme tokens and animation utilities live in `app/globals.css`
- The root page delegates to `app/homepage.tsx`
- The dashboard pages are grouped under `app/(dashboard)` and rendered inside the sidebar shell
- Reuse the Prisma singleton from `lib/prisma.ts` for server-side database access

## Possible Next Steps

- Replace mock dashboard data with a real backend
- Add real authentication for teachers
- Connect campaign creation and student detail flows
- Add tests for navigation and page rendering
