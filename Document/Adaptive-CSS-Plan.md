# Adaptive CSS Plan

## Current Status

Adaptive CSS has already been added in these areas:

- Global responsive defaults in `app/globals.css`
- Shared mobile-aware workspace shell in `app/components/sidebar-shell.tsx`
- Public entry pages:
  - `app/homepage.tsx`
  - `app/features/page.tsx`
  - `app/login/page.tsx`
  - `app/signup/page.tsx`
  - `app/role-select/page.tsx`

This means the project already has a responsive foundation, but not every route has been individually tuned yet.

## What Still Needs a Full Pass

The remaining work is mostly page-specific responsive cleanup across dashboard and student routes.

Examples of pages likely to need direct breakpoint work:

- `app/(dashboard)/active-campaigns/page.tsx`
- `app/(dashboard)/students/page.tsx`
- `app/(dashboard)/students/[id]/page.tsx`
- `app/(dashboard)/submissions/page.tsx`
- `app/(dashboard)/task-assignment/page.tsx`
- `app/(dashboard)/task-assignment/[id]/page.tsx`
- `app/student/page.tsx`
- `app/student/campaigns/page.tsx`
- `app/student/submissions/page.tsx`
- `app/student/progress/page.tsx`
- `app/student/profile/page.tsx`
- `app/student/tasks/[id]/page.tsx`

## Estimated Time

Estimated time for a full adaptive CSS pass across every page:

- 2 to 4 hours total

Rough breakdown:

- 30 to 45 minutes for remaining student pages
- 1.5 to 2.5 hours for dashboard pages
- 30 to 45 minutes for validation and cleanup

## Scope of the Full Pass

The full pass would focus on:

- Mobile and tablet layout cleanup
- Removing overflow and cramped card layouts
- Stacking complex grids cleanly at smaller breakpoints
- Making buttons, filters, forms, and detail panels usable on narrow screens
- Preserving the current design rather than redesigning the product

## Notes

This estimate assumes:

- CSS and Tailwind class updates only
- No major visual redesign
- No new feature work
- No backend or data-model changes

If the goal changes from "responsive cleanup" to "fully redesign every page for mobile," the estimate would increase.