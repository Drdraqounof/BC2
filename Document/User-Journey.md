# User Journey: From Problem to Solution

## Overview

Campaigns is designed around a single, powerful journey: **turning classroom problems into measurable improvements**. This document maps the user experience, core user stories, and how the solution addresses real teacher needs.

---

## Core User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  DISCOVER          CREATE            EXECUTE           MEASURE         │
│  Problem           Campaign          Tasks              Results         │
│     ↓                ↓                 ↓                 ↓              │
│  "I see 5          "Let's fix        "Assign            "Are we       │
│   students         this by           targeted           making        │
│   missing          Friday"           actions"           progress?"    │
│   work"                                                                │
│     ↓                ↓                 ↓                 ↓              │
│  Dashboard      Campaign            Task               Progress       │
│  Insights       Creation            Management         Tracking       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## User Stories

### Story 1: The Reactive Teacher
**"I need to fix a problem I just noticed"**

**Who:** Elementary/Middle School Teacher  
**When:** Daily, when issues emerge  
**Context:** During planning period or after noticing patterns

**What I Want:**
- Quick way to identify which students are struggling
- Clear diagnosis: Is it missing work? Attendance? Something else?
- Fast path to action—I don't want to spend 30 minutes setting this up

**How Campaigns Helps:**
1. **See the Problem** → Dashboard shows at-risk signals (missing assignments, attendance drops)
2. **Create Quickly** → Pick students, set goal, launch campaign in <5 minutes
3. **Assign Tasks** → Send reminders, check-ins, or extra help tasks
4. **Track Daily** → See if it's working by next week

**Success Metric:** "By Friday, I can see if my intervention actually worked"

---

### Story 2: The Strategic Planner
**"I want to design a comprehensive support system"**

**Who:** High School Teacher / Department Head  
**When:** Weekly planning sessions, semester planning  
**Context:** Preparing for upcoming assessments, managing multiple student needs

**What I Want:**
- Plan multiple campaigns in parallel (test prep, attendance, behavior)
- Link tasks to specific learning objectives
- See how different interventions affect different student groups
- Share progress with administration/parents

**How Campaigns Helps:**
1. **Campaign Library** → Create templates for recurring problems
2. **Bulk Targeting** → Use filters to select students by risk level, grade band, subject
3. **Task Integration** → Create structured tasks that feed into campaign goals
4. **Progress Dashboard** → Clear metrics showing which campaigns are working
5. **Data Export** → Share results with stakeholders

**Success Metric:** "I have a data-driven system for supporting students, not just reactive crisis management"

---

### Story 3: The Collaborative Educator
**"I want to get my whole team aligned"**

**Who:** School Counselor / Interventionist / Principal  
**When:** During team meetings, ongoing coordination  
**Context:** Working with multiple teachers, coordinating school-wide initiatives

**What I Want:**
- See campaigns across multiple teachers
- Understand who's getting support and what kind
- Coordinate overlapping efforts
- Ensure no student falls through the cracks

**How Campaigns Helps:**
1. **Visibility** → See all active campaigns in the school
2. **Student View** → For each at-risk student, see all campaigns they're in
3. **Task Aggregation** → Know what work each student has been assigned across all classes
4. **Communication** → Leave notes on campaigns, coordinate interventions
5. **Outcomes Tracking** → Track which students improved under team support

**Success Metric:** "Entire team knows which students need help and what we're doing about it"

---

## Core Features & Their Purpose

### 1. Problem Detection 🔍
**Why:** Teachers need to know what's broken before they can fix it

- **Signals Engine:** Automatically identifies:
  - Missing assignments
  - Attendance drops
  - Grade deterioration
  - Engagement issues
- **At-Risk Dashboard:** Visual indicators show students who need help
- **Outcome:** Teachers move from reactive ("I noticed...") to proactive ("The system flagged...")

### 2. Campaign Creation 🎯
**Why:** Teachers need structure to turn problems into action

- **Simple Form:** Title, goal, students, timeframe
- **Pre-populated Options:** Based on signal type detected
- **Campaign Types:** Missing Assignments, Attendance, Test Prep, Behavior, Custom
- **Outcome:** Problems become concrete, trackable initiatives with clear goals

### 3. Task Management 📋
**Why:** Campaigns need concrete actions, not just good intentions

- **Task Creation:** Define specific actions (send reminder, check-in call, tutoring session)
- **Bulk Assignment:** Assign to all campaign students at once
- **Progress Tracking:** See completion percentage, completion status by student
- **Priority Levels:** Focus on what matters most
- **Outcome:** Campaigns become real work with accountability

### 4. Progress Tracking 📈
**Why:** Teachers need to know if interventions are actually working

- **Before/After Metrics:** Compare student status before and after campaign
- **Weekly Progress:** See trends over time, not just snapshots
- **Completion Rates:** Know how many students responded to interventions
- **Goal Achievement:** Did we hit our target? By how much?
- **Outcome:** Data-driven decisions replace gut feelings

### 5. Campaign Notes 💬
**Why:** Context matters—teachers need to document what they learned

- **Team Communication:** Leave notes for collaborators
- **Reflection Journal:** What worked? What didn't?
- **Student Context:** Understand barriers and breakthroughs
- **Outcome:** Institutional knowledge is captured, not lost

---

## Solution Map: How Features Connect

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DASHBOARD (Entry Point)                         │
│  • Shows all signals (missing work, attendance, grades)                │
│  • Lists active campaigns with progress                                │
│  • Quick filters by student, risk level, campaign status              │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐
   │   SIGNALS   │  │  CAMPAIGNS   │  │  TASKS          │
   │             │  │              │  │                 │
   │ Detects:    │  │ Create:      │  │ Create:         │
   │ • Missing   │  │ • Campaign   │  │ • Task          │
   │   work      │  │   for signal │  │ • Link to       │
   │ • Attendance│  │ • Set goal   │  │   campaign      │
   │ • Grades    │  │ • Pick       │  │ • Assign to     │
   │             │  │   students   │  │   students      │
   └────────┬────┘  └──────┬───────┘  └────────┬────────┘
            │               │                   │
            └───────────────┼───────────────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │  TASK EXECUTION  │
                    │                  │
                    │ Students:        │
                    │ • Receive tasks  │
                    │ • Complete work  │
                    │ • Get feedback   │
                    │                  │
                    │ Teachers:        │
                    │ • Track status   │
                    │ • Mark complete  │
                    │ • Review work    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  PROGRESS VIEW   │
                    │                  │
                    │ • Completion %   │
                    │ • Goal achieved? │
                    │ • Student growth │
                    │ • Next steps?    │
                    └──────────────────┘
```

---

## The Workflow in Action: Example

### Scenario: Missing Assignments Crisis

**Day 1 - Morning: Problem Discovered**
- Teacher checks Dashboard
- Signals show 7 students missing assignments
- Creates new campaign: "Missing Work Recovery"
- Goal: "Reduce to 2 by end of week"
- Adds those 7 students

**Day 1 - Afternoon: Action Planned**
- Creates 3 tasks:
  - Task 1: "Gentle reminder email" (for all students)
  - Task 2: "One-on-one check-in" (for at-risk)
  - Task 3: "Makeup work planning" (for struggling students)
- Assigns tasks to relevant students

**Day 2-4: Execution**
- Students complete tasks and resubmit work
- Teacher marks tasks complete as they get work
- Campaign progress updates automatically

**Day 5: Review**
- Campaign dashboard shows progress
- 5 of 7 students caught up ✅
- Teacher adds note: "Personal check-in worked best"
- Creates follow-up campaign for remaining 2

---

## Key Design Principles

1. **Speed First** → Teachers are busy. Campaigns must be created in minutes, not hours.

2. **Clarity Over Features** → One clear goal per campaign beats 10 vague metrics.

3. **Action Oriented** → Don't just track problems. Create concrete paths to solutions.

4. **Measurable** → Every campaign has success criteria. Progress is visible.

5. **Collaborative** → Teachers work in teams. The system should reflect that.

6. **Human-Centered** → Technology serves teaching, not the reverse.

---

## Success Indicators

### For Individual Teachers
- ✅ Campaigns completed on time or ahead of schedule
- ✅ Measurable improvement in target student metrics
- ✅ Reduced time spent on administrative tracking
- ✅ Increased confidence in intervention decisions

### For Schools
- ✅ Coordinated, systematic approach to student support
- ✅ Reduced number of students needing higher-level intervention
- ✅ Data showing effective interventions
- ✅ Improved communication between teachers/specialists/counselors

---

## Future Vision

As the system matures, Campaigns could evolve to:
- **AI-Powered Insights:** Predictive alerts before problems spiral
- **Automated Interventions:** Campaigns that trigger messages/reminders automatically
- **Peer Learning:** See what worked for other teachers and schools
- **Family Portal:** Parents see campaigns affecting their student and contribute
- **Mobile App:** Teachers manage campaigns on the go
- **Integration:** Connect with SIS, LMS, and gradebook systems
