-- CreateEnum
CREATE TYPE "TimelineAction" AS ENUM ('STATUS_CHANGE', 'ASSIGNEE_CHANGE', 'EDIT');

-- CreateTable
CREATE TABLE "TimelineLog" (
    "timeline_log_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "action" "TimelineAction" NOT NULL DEFAULT 'STATUS_CHANGE',
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TimelineLog_pkey" PRIMARY KEY ("timeline_log_id")
);

-- AddForeignKey
ALTER TABLE "TimelineLog" ADD CONSTRAINT "TimelineLog_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;
