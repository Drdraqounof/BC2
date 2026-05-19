Feature-list.md

Overview.md

User-journey.md


# Non-negotatiable 
temparture = 1
top-p 0, 1
top-k 500

Ask Clarify High question when direction is clear 
always read Feature-list.md
always read Overview.md
always read User-journey.md
always read the readme.md 
always read the issues.md 
always read the troubleshooting.md 


awalys udpate status after feature past testing
always udpate issue and troubleshooting when issue are found and fixed 

## Troubleshooting 
use online resources 
w3shools.com


## Status 


# Branching 
always create branch for feature you're working on 
example 
branch/feature-name

main/feature-auth

# Core Feature 
always 

Collapse

# Week 6 Reliability And Readiness

This week continues directly from Week 5.

## Week 6 Focus
- move from AI planning into real AI integration
- strengthen the app with Jest testing
- debug unstable flows and document fixes
- validate Docker setup and local container workflow
- improve CI habits so changes are easier to verify before merge

## Carryover From Week 5
- complete full CRUD coverage across the core product flows
- keep analytics surfaces connected to real app behavior
- continue building AI prompt ideas into usable product paths
- maintain and expand project scripts for common workflows
- preserve the full app structure while reducing prototype fragility

## Week 6 Outcome
By the end of this week, associates should be moving the project from feature assembly into reliability work. New work should favor correctness, testability, debuggability, and deployment readiness over adding disconnected surface features.

## Execution Order
1. connect real AI behavior to existing product entry points
2. verify CRUD flows end to end for campaigns, students, tasks, and related dashboards
3. add Jest coverage for the most failure-prone utilities, API handlers, and UI logic
4. debug known regressions and record the root cause plus the fix
5. run and verify Docker-based local setup
6. tighten CI habits: lint, test, build, and validation before feature completion

## Required Deliverables
- at least one real AI integration path working in the app
- Jest test coverage added for critical logic
- documented debugging notes for issues found and fixed
- Docker workflow confirmed for local development
- scripts reviewed and updated if the current workflow is missing verification steps
- status updated after testing, not before

## Engineering Standard For This Week
- prefer root-cause fixes over visual-only patches
- every completed feature should include a validation step
- when a bug is fixed, update issue and troubleshooting notes
- protect existing app structure unless a simplification clearly improves reliability
- if a workflow cannot be tested yet, state the blocker explicitly

## Definition Of Done For Week 6
- core CRUD flows are working
- AI integration is real, not placeholder-only
- important logic has repeatable Jest coverage
- Docker setup is usable by another developer
- project scripts support day-to-day verification
- the app feels more reliable and closer to release readiness