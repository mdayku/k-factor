-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isSimulated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "simulationId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSimulated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "simulationId" TEXT;

-- CreateIndex
CREATE INDEX "Event_isSimulated_idx" ON "Event"("isSimulated");

-- CreateIndex
CREATE INDEX "User_isSimulated_idx" ON "User"("isSimulated");
