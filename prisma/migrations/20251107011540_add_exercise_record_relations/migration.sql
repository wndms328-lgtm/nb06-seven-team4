/*
  Warnings:

  - Added the required column `groupId` to the `ExerciseRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantId` to the `ExerciseRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciseRecord" ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "participantId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ExerciseRecord_groupId_idx" ON "ExerciseRecord"("groupId");

-- CreateIndex
CREATE INDEX "ExerciseRecord_participantId_idx" ON "ExerciseRecord"("participantId");

-- CreateIndex
CREATE INDEX "ExerciseRecord_groupId_createdAt_idx" ON "ExerciseRecord"("groupId", "createdAt");

-- AddForeignKey
ALTER TABLE "ExerciseRecord" ADD CONSTRAINT "ExerciseRecord_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRecord" ADD CONSTRAINT "ExerciseRecord_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
