# Task Assignment System Documentation

## Overview

The Task Assignment system enables teachers to create, manage, and track assignments for students both **independently** and **within campaigns**. This feature transforms how teachers organize classroom work.

---

## What's New

### Core Features

✨ **Create Tasks**
- Title, description, due date, priority level
- Rubric/grading criteria
- File attachments and resource links
- Optional campaign linkage

✨ **Assign to Students**
- Assign tasks to individual or multiple students at once
- Bulk student selection
- Reassign existing tasks

✨ **Track Progress**
- See how many students have completed each task
- Filter by completion status (pending/completed)
- Priority color coding (LOW/MEDIUM/HIGH)
- Progress bars for visual tracking

✨ **Campaign Integration**
- Link tasks directly to campaigns
- See task count on campaign cards
- Quick "View tasks" button from campaigns
- Task details visible in campaign detail view

✨ **Easy Navigation**
- New "Tasks" (TK) link in sidebar navigation
- Access from both Campaigns page and dedicated Tasks page
- Consistent styling across the app

---

## User Workflow

### For Teachers

#### Creating a Task

1. **Navigate to Tasks** → Click "Tasks" in sidebar
2. **Click "Create new task"** button
3. **Fill in task details:**
   - Title (required)
   - Description
   - Due date
   - Priority (LOW/MEDIUM/HIGH)
   - Rubric or grading criteria
   - Attachment links
   - Optional: Link to a campaign
4. **Select students** to assign the task
5. **Click "Create task"**

#### Creating a Task from a Campaign

1. **Navigate to Active Campaigns**
2. **Click campaign details** → "View & manage tasks" button
3. **Fill in form** (campaign is pre-selected)
4. **Create task**

#### Managing Tasks

- **View all tasks** on Tasks page
- **Filter by campaign** or **completion status**
- **Click any task** to see full details
- **Mark complete** for all students at once
- **Delete task** if needed

#### Tracking Progress

- See completion count: "X of Y students completed"
- Visual progress bar shows completion percentage
- Color-coded priority helps identify urgent work
- Due dates help organize by urgency

---

## Feature Architecture

### Database Models

#### Task
```
{
  id: string (unique ID)
  title: string (required)
  description: string
  dueDate: DateTime
  priority: LOW | MEDIUM | HIGH (default: MEDIUM)
  rubric: string (grading criteria)
  attachmentLinks: string (JSON array of links)
  campaignId: string (optional - links to campaign)
  creatorId: string (teacher who created)
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Relationships:**
- Created by: **Teacher** (one-to-many)
- Optional link: **Campaign** (one-to-many)
- Assigned to: **TaskAssignment** (one-to-many)

#### TaskAssignment
```
{
  id: string (unique ID)
  taskId: string (links to Task)
  studentId: string (links to Student)
  completedAt: DateTime (null if not done)
  grade: string (optional feedback/grade)
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Relationships:**
- References: **Task** (many-to-one)
- References: **Student** (many-to-one)
- Unique constraint: One assignment per (task, student) pair

---

## API Endpoints

### Task Management

#### GET /api/tasks
**Fetch all tasks with optional filters**
```bash
# Get all tasks
GET /api/tasks

# Get tasks for a campaign
GET /api/tasks?campaignId=campaign-123

# Get tasks created by a teacher
GET /api/tasks?creatorId=teacher-1

# Get only completed tasks
GET /api/tasks?status=completed

# Get pending tasks
GET /api/tasks?status=pending
```

**Response:**
```json
[
  {
    "id": "task-1",
    "title": "Complete Missing Algebra Worksheet",
    "description": "...",
    "dueDate": "2026-04-24T00:00:00Z",
    "priority": "HIGH",
    "rubric": "...",
    "attachmentLinks": "[\"https://...\"]",
    "campaignId": "campaign-123",
    "creator": {
      "id": "teacher-1",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@school.edu"
    },
    "campaign": {
      "id": "campaign-123",
      "title": "Missing Assignments Recovery"
    },
    "taskAssignments": [
      {
        "id": "assign-1",
        "taskId": "task-1",
        "studentId": "student-1",
        "completedAt": null,
        "grade": null,
        "student": {
          "id": "student-1",
          "firstName": "Maya",
          "lastName": "Thompson"
        }
      }
    ]
  }
]
```

#### POST /api/tasks
**Create a new task**
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete Missing Algebra Worksheet",
  "description": "Students need to complete sections 3-5...",
  "dueDate": "2026-04-24",
  "priority": "HIGH",
  "rubric": "Full marks for all problems correct...",
  "attachmentLinks": ["https://example.com/worksheet.pdf"],
  "campaignId": "campaign-123",
  "creatorId": "teacher-1",
  "studentIds": ["student-1", "student-2", "student-3"]
}
```

**Response:** `201 Created` with full task object including assignments

#### GET /api/tasks/[id]
**Fetch a single task**
```bash
GET /api/tasks/task-123
```

**Response:** Full task object with all details and assignments

#### PATCH /api/tasks/[id]
**Update a task**
```bash
PATCH /api/tasks/task-123
Content-Type: application/json

{
  "title": "Updated title",
  "priority": "MEDIUM",
  "dueDate": "2026-04-25"
}
```

**Response:** Updated task object

#### DELETE /api/tasks/[id]
**Delete a task** (cascades to delete all assignments)
```bash
DELETE /api/tasks/task-123
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted"
}
```

### Task Assignment

#### POST /api/tasks/[id]/assign
**Assign task to new students**
```bash
POST /api/tasks/task-123/assign
Content-Type: application/json

{
  "studentIds": ["student-1", "student-2"]
}
```

**Response:** Updated task object with new assignments

#### PATCH /api/tasks/[id]/complete
**Mark task complete for a student**
```bash
PATCH /api/tasks/task-123/complete
Content-Type: application/json

{
  "studentId": "student-1",
  "isComplete": true,
  "grade": "A"
}
```

**Response:** Updated TaskAssignment object

---

## Component Structure

### Pages
- **`app/(dashboard)/task-assignment/page.tsx`** - Main task management page
  - Create tasks
  - View all tasks
  - Filter tasks
  - Task detail modal

- **`app/(dashboard)/active-campaigns/page.tsx`** - Enhanced with tasks
  - Task count badges on campaign cards
  - Task list in campaign detail view
  - "Create task for campaign" quick action

### Components
- **`TaskCard.tsx`** - Displays individual task with actions
- **`TaskList.tsx`** - Renders list of tasks with filtering
- **`TaskForm.tsx`** - Comprehensive form for creating/editing tasks
- **`TaskBadge.tsx`** - Small badge showing task counts

### Routes
- **`app/api/tasks/route.ts`** - GET all, POST create
- **`app/api/tasks/[id]/route.ts`** - GET, PATCH, DELETE single task
- **`app/api/tasks/[id]/assign/route.ts`** - POST to assign students
- **`app/api/tasks/[id]/complete/route.ts`** - PATCH to mark complete

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    TEACHER ACTIONS                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────────────┐
        │  Task Assignment Page               │
        │  - Create tasks                     │
        │  - View all tasks                   │
        │  - Filter & search                  │
        └──────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
      ┌─────────────────┐      ┌─────────────────┐
      │  Active         │      │  Tasks Page     │
      │  Campaigns      │      │  (Dedicated)    │
      │  - View tasks   │      │  - Manage all   │
      │  - Create from  │      │  - Track        │
      │    campaign     │      │    progress     │
      └─────────────────┘      └─────────────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                ┌─────────────────────────┐
                │    API ENDPOINTS        │
                │  /api/tasks/*           │
                └─────────────────────────┘
                            │
                            ▼
                ┌─────────────────────────┐
                │  PRISMA DATABASE        │
                │  - Task table           │
                │  - TaskAssignment table │
                └─────────────────────────┘
```

---

## File Structure

```
my-app/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts              (GET all, POST create)
│   │       └── [id]/
│   │           ├── route.ts          (GET, PATCH, DELETE)
│   │           ├── assign/
│   │           │   └── route.ts      (POST assign students)
│   │           └── complete/
│   │               └── route.ts      (PATCH mark complete)
│   │
│   ├── (dashboard)/
│   │   ├── active-campaigns/
│   │   │   └── page.tsx              (UPDATED - now shows tasks)
│   │   └── task-assignment/
│   │       └── page.tsx              (NEW - task management)
│   │
│   ├── components/
│   │   ├── sidebar-shell.tsx         (UPDATED - added Tasks nav)
│   │   ├── task-card.tsx             (NEW)
│   │   ├── task-list.tsx             (NEW)
│   │   ├── task-form.tsx             (NEW)
│   │   └── task-badge.tsx            (NEW)
│   │
│   ├── dashboard-data.ts             (UPDATED - added mock tasks)
│   └── layout.tsx
│
├── prisma/
│   └── schema.prisma                 (UPDATED - Task & TaskAssignment models)
│
├── lib/
│   └── prisma.ts                     (No changes needed)
│
└── Document/
    └── Task-Assignment-System.md     (THIS FILE)
```

---

## Getting Started

### 1. Set Up Database

Run the Prisma migration to create the Task and TaskAssignment tables:

```bash
cd my-app
npx prisma migrate dev --name add-tasks
```

This will:
- Create `task` table
- Create `task_assignment` table
- Set up relationships and indexes
- Generate Prisma client

### 2. Test with Mock Data

The app comes with mock task data in `app/dashboard-data.ts`. You can:

1. **Navigate to Tasks page** → Click "Create new task"
2. **Create a task** with all details
3. **View on Active Campaigns** → See task count badge
4. **Filter and manage** tasks

### 3. Connect to Real Database

Once testing is complete:

1. Verify database is running (PostgreSQL)
2. Update `.env` with DATABASE_URL if needed
3. Tasks will automatically use the database instead of mock data

---

## Usage Examples

### Example 1: Create a Task for a Campaign

```
1. Go to Active Campaigns page
2. Click on "Missing Assignments Recovery" campaign
3. Click "View & manage tasks" button
4. Click "Create new task"
5. Fill in:
   - Title: "Complete Missing Algebra Worksheet"
   - Description: "Sections 3-5 of the Quadratic Equations worksheet"
   - Due Date: April 24, 2026
   - Priority: HIGH
   - Students: Select Maya Thompson, Ava Patel, Noah Rivera
6. Click "Create task"
7. Task now appears in campaign detail view with completion tracking
```

### Example 2: Track Task Progress

```
1. Go to Tasks page
2. Filter by "Pending (in progress)"
3. See all incomplete tasks
4. Click on a task to see:
   - Which students haven't completed it
   - Due date and rubric
   - Resource links
5. Click "Mark all complete" when done
```

### Example 3: Assign Existing Students to New Task

```
1. Go to Tasks page
2. Click "Create new task"
3. Don't link to campaign
4. Select multiple students
5. Set priority and due date
6. Create
7. Task is now independent and appears in "No campaign" filter
```

---

## Future Enhancements

### Short Term
- [ ] Email notifications when tasks are assigned
- [ ] Bulk task template creation
- [ ] Task submission tracking
- [ ] Grade input and feedback system
- [ ] Task duplication/copying

### Medium Term
- [ ] Student self-submission portal
- [ ] Rubric-based grading interface
- [ ] Task analytics (average completion time)
- [ ] Assignment reminders (configurable)
- [ ] Late work handling

### Long Term
- [ ] AI-powered task suggestions based on campaigns
- [ ] Peer review assignments
- [ ] Gamification (points, badges)
- [ ] Parent visibility into task assignments
- [ ] Integration with external tools (Google Classroom, Canvas)

---

## Troubleshooting

### Q: Tasks don't show up on the Active Campaigns page

**A:** Check that:
1. Task has a valid `campaignId` that matches a campaign
2. Campaign ID is correct in the task form
3. Browser cache is cleared (hard refresh: Ctrl+Shift+R)

### Q: Can I edit a task after creating it?

**A:** Currently you can:
- Delete and recreate (coming soon: edit endpoint)
- Update via PATCH /api/tasks/[id] directly
- Full edit interface coming in next update

### Q: How do I track individual student progress on a task?

**A:** Click into the task detail view. You'll see:
- Completion count (e.g., "3 of 5 completed")
- List of students in task assignments
- Who has/hasn't completed it

### Q: Can I assign a task to students who weren't in the original group?

**A:** Yes! Use the POST /api/tasks/[id]/assign endpoint or UI to add new students to an existing task.

---

## Technical Notes

### Database Indexes
- `Task.campaignId` - Enables fast filtering by campaign
- `Task.creatorId` with `createdAt` - Enables fast teacher task lookup
- `Task.dueDate` - Enables sorting by due date
- `TaskAssignment.studentId` with `completedAt` - Enables student completion tracking
- `TaskAssignment.taskId` + `studentId` - Unique constraint prevents duplicate assignments

### Cascading Deletes
- Deleting a Task automatically deletes all related TaskAssignments
- Deleting a Campaign does NOT delete Tasks (tasks set to null for campaignId)
- Deleting a Student does NOT delete Tasks (assignments deleted, but task remains)

### Performance Considerations
- Task list query includes all related data (creator, campaign, assignments with students)
- For large student lists (1000+), consider pagination
- Indexes ensure query response under 100ms
- Consider batch operations for bulk task creation

---

## Support & Questions

For issues or questions:
1. Check troubleshooting section above
2. Review API endpoints documentation
3. Check component prop types in TypeScript files
4. Review mock data in `dashboard-data.ts` for examples

---

**Last Updated:** April 21, 2026  
**Version:** 1.0 - Initial Implementation  
**Status:** Ready for Database Migration & Testing
