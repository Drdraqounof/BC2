-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'NEEDS_FOLLOW_UP', 'ON_TRACK', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('MISSING_ASSIGNMENTS_RECOVERY', 'ATTENDANCE_IMPROVEMENT', 'TEST_PREPARATION_INITIATIVE', 'STUDENT_PERFORMANCE_BOOST', 'PARENT_ENGAGEMENT_PUSH', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CampaignStudentStatus" AS ENUM ('PENDING', 'NEEDS_REMINDER', 'FAMILY_OUTREACH', 'INTERVENTION_ADDED', 'IMPROVING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('MISSING_WORK', 'ATTENDANCE', 'ASSESSMENT_RISK', 'ENGAGEMENT', 'BEHAVIOR', 'OTHER');

-- CreateEnum
CREATE TYPE "SignalSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "PromptCategory" AS ENUM ('FAMILY_OUTREACH', 'STUDENT_CHECK_IN', 'COACHING_SUMMARY', 'ADMIN_UPDATE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CAMPAIGN_CREATED', 'CAMPAIGN_STATUS_CHANGED', 'STUDENT_ADDED_TO_CAMPAIGN', 'STUDENT_STATUS_CHANGED', 'TASK_CREATED', 'TASK_ASSIGNED', 'TASK_COMPLETED', 'NOTE_ADDED', 'SIGNAL_DETECTED', 'SIGNAL_RESOLVED', 'OTHER');

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "schoolId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gradeLabel" TEXT,
    "courseLabel" TEXT,
    "supportStatus" TEXT,
    "schoolId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "CampaignType" NOT NULL DEFAULT 'CUSTOM',
    "customType" TEXT,
    "goal" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "progressSnapshot" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignStudent" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "CampaignStudentStatus" NOT NULL DEFAULT 'PENDING',
    "customStatus" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentSignal" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "SignalType" NOT NULL,
    "customType" TEXT,
    "label" TEXT NOT NULL,
    "severity" "SignalSeverity" NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "followUpStatus" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "StudentSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignNote" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "authorId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "category" "PromptCategory" NOT NULL DEFAULT 'CUSTOM',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "campaignId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "rubric" TEXT,
    "attachmentLinks" TEXT,
    "campaignId" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskAssignment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "campaignId" TEXT,
    "campaignStudentId" TEXT,
    "studentSignalId" TEXT,
    "createdBy" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");

-- CreateIndex
CREATE INDEX "School_name_idx" ON "School"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE INDEX "Teacher_schoolId_email_idx" ON "Teacher"("schoolId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_externalId_key" ON "Student"("externalId");

-- CreateIndex
CREATE INDEX "Student_schoolId_idx" ON "Student"("schoolId");

-- CreateIndex
CREATE INDEX "Student_lastName_firstName_idx" ON "Student"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Campaign_ownerId_status_idx" ON "Campaign"("ownerId", "status");

-- CreateIndex
CREATE INDEX "Campaign_type_status_idx" ON "Campaign"("type", "status");

-- CreateIndex
CREATE INDEX "CampaignStudent_studentId_status_idx" ON "CampaignStudent"("studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignStudent_campaignId_studentId_key" ON "CampaignStudent"("campaignId", "studentId");

-- CreateIndex
CREATE INDEX "StudentSignal_studentId_isActive_idx" ON "StudentSignal"("studentId", "isActive");

-- CreateIndex
CREATE INDEX "StudentSignal_type_severity_idx" ON "StudentSignal"("type", "severity");

-- CreateIndex
CREATE INDEX "CampaignNote_campaignId_createdAt_idx" ON "CampaignNote"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "PromptTemplate_category_isSystem_idx" ON "PromptTemplate"("category", "isSystem");

-- CreateIndex
CREATE INDEX "Task_campaignId_idx" ON "Task"("campaignId");

-- CreateIndex
CREATE INDEX "Task_creatorId_createdAt_idx" ON "Task"("creatorId", "createdAt");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- CreateIndex
CREATE INDEX "TaskAssignment_studentId_completedAt_idx" ON "TaskAssignment"("studentId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TaskAssignment_taskId_studentId_key" ON "TaskAssignment"("taskId", "studentId");

-- CreateIndex
CREATE INDEX "ActivityLog_campaignId_createdAt_idx" ON "ActivityLog"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_type_createdAt_idx" ON "ActivityLog"("type", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_createdBy_idx" ON "ActivityLog"("createdBy");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignStudent" ADD CONSTRAINT "CampaignStudent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignStudent" ADD CONSTRAINT "CampaignStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSignal" ADD CONSTRAINT "StudentSignal_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignNote" ADD CONSTRAINT "CampaignNote_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignNote" ADD CONSTRAINT "CampaignNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptTemplate" ADD CONSTRAINT "PromptTemplate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_campaignStudentId_fkey" FOREIGN KEY ("campaignStudentId") REFERENCES "CampaignStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_studentSignalId_fkey" FOREIGN KEY ("studentSignalId") REFERENCES "StudentSignal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
