-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'PARENT', 'TUTOR', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "age" INTEGER,
    "isMinor" BOOLEAN NOT NULL DEFAULT false,
    "parentalConsent" BOOLEAN NOT NULL DEFAULT false,
    "parentEmail" TEXT,
    "coppaCompliant" BOOLEAN NOT NULL DEFAULT false,
    "optedOutGrowth" BOOLEAN NOT NULL DEFAULT false,
    "dataRetentionDate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignedLink" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "loop" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "SignedLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribution" (
    "id" TEXT NOT NULL,
    "signedLinkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "touchpoint" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "surface" TEXT NOT NULL,
    "loop" TEXT,
    "signedLinkId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "variant" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "triggers" JSONB NOT NULL,
    "eligibility" JSONB NOT NULL,
    "rewards" JSONB NOT NULL,
    "throttle" JSONB,
    "copyTemplates" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tutorId" TEXT,
    "subject" TEXT NOT NULL,
    "transcribed" BOOLEAN NOT NULL DEFAULT false,
    "transcription" TEXT,
    "summary" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgenticAction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "targetPersona" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "executed" BOOLEAN NOT NULL DEFAULT false,
    "executedAt" TIMESTAMP(3),
    "invitesSent" INTEGER NOT NULL DEFAULT 0,
    "invitesOpened" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgenticAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultsPage" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "skillsHeatmap" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "shareCardGenerated" BOOLEAN NOT NULL DEFAULT false,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultsPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentDecision" (
    "id" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "decision" JSONB NOT NULL,
    "rationale" TEXT NOT NULL,
    "featuresUsed" JSONB NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "loop" TEXT,
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudFlag" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "email" TEXT,
    "reason" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isMinor_idx" ON "User"("isMinor");

-- CreateIndex
CREATE UNIQUE INDEX "SignedLink_shortCode_key" ON "SignedLink"("shortCode");

-- CreateIndex
CREATE INDEX "SignedLink_shortCode_idx" ON "SignedLink"("shortCode");

-- CreateIndex
CREATE INDEX "SignedLink_referrerId_idx" ON "SignedLink"("referrerId");

-- CreateIndex
CREATE INDEX "SignedLink_loop_idx" ON "SignedLink"("loop");

-- CreateIndex
CREATE INDEX "SignedLink_createdAt_idx" ON "SignedLink"("createdAt");

-- CreateIndex
CREATE INDEX "Attribution_signedLinkId_idx" ON "Attribution"("signedLinkId");

-- CreateIndex
CREATE INDEX "Attribution_userId_idx" ON "Attribution"("userId");

-- CreateIndex
CREATE INDEX "Attribution_touchpoint_idx" ON "Attribution"("touchpoint");

-- CreateIndex
CREATE INDEX "Attribution_createdAt_idx" ON "Attribution"("createdAt");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- CreateIndex
CREATE INDEX "Event_userId_idx" ON "Event"("userId");

-- CreateIndex
CREATE INDEX "Event_loop_idx" ON "Event"("loop");

-- CreateIndex
CREATE INDEX "Event_sessionId_idx" ON "Event"("sessionId");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");

-- CreateIndex
CREATE INDEX "Experiment_name_idx" ON "Experiment"("name");

-- CreateIndex
CREATE INDEX "Experiment_cohort_idx" ON "Experiment"("cohort");

-- CreateIndex
CREATE UNIQUE INDEX "Experiment_name_userId_key" ON "Experiment"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Loop_name_key" ON "Loop"("name");

-- CreateIndex
CREATE INDEX "Loop_active_idx" ON "Loop"("active");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_tutorId_idx" ON "Session"("tutorId");

-- CreateIndex
CREATE INDEX "Session_subject_idx" ON "Session"("subject");

-- CreateIndex
CREATE INDEX "Session_transcribed_idx" ON "Session"("transcribed");

-- CreateIndex
CREATE INDEX "Session_startedAt_idx" ON "Session"("startedAt");

-- CreateIndex
CREATE INDEX "AgenticAction_type_idx" ON "AgenticAction"("type");

-- CreateIndex
CREATE INDEX "AgenticAction_sessionId_idx" ON "AgenticAction"("sessionId");

-- CreateIndex
CREATE INDEX "AgenticAction_targetPersona_idx" ON "AgenticAction"("targetPersona");

-- CreateIndex
CREATE INDEX "AgenticAction_executed_idx" ON "AgenticAction"("executed");

-- CreateIndex
CREATE INDEX "ResultsPage_userId_idx" ON "ResultsPage"("userId");

-- CreateIndex
CREATE INDEX "ResultsPage_type_idx" ON "ResultsPage"("type");

-- CreateIndex
CREATE INDEX "ResultsPage_subject_idx" ON "ResultsPage"("subject");

-- CreateIndex
CREATE INDEX "ResultsPage_createdAt_idx" ON "ResultsPage"("createdAt");

-- CreateIndex
CREATE INDEX "AgentDecision_agent_idx" ON "AgentDecision"("agent");

-- CreateIndex
CREATE INDEX "AgentDecision_userId_idx" ON "AgentDecision"("userId");

-- CreateIndex
CREATE INDEX "AgentDecision_createdAt_idx" ON "AgentDecision"("createdAt");

-- CreateIndex
CREATE INDEX "FraudFlag_userId_idx" ON "FraudFlag"("userId");

-- CreateIndex
CREATE INDEX "FraudFlag_deviceId_idx" ON "FraudFlag"("deviceId");

-- CreateIndex
CREATE INDEX "FraudFlag_ipAddress_idx" ON "FraudFlag"("ipAddress");

-- CreateIndex
CREATE INDEX "FraudFlag_severity_idx" ON "FraudFlag"("severity");

-- CreateIndex
CREATE INDEX "FraudFlag_resolved_idx" ON "FraudFlag"("resolved");

-- CreateIndex
CREATE INDEX "Complaint_userId_idx" ON "Complaint"("userId");

-- CreateIndex
CREATE INDEX "Complaint_type_idx" ON "Complaint"("type");

-- CreateIndex
CREATE INDEX "Complaint_resolved_idx" ON "Complaint"("resolved");

-- AddForeignKey
ALTER TABLE "SignedLink" ADD CONSTRAINT "SignedLink_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribution" ADD CONSTRAINT "Attribution_signedLinkId_fkey" FOREIGN KEY ("signedLinkId") REFERENCES "SignedLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribution" ADD CONSTRAINT "Attribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_signedLinkId_fkey" FOREIGN KEY ("signedLinkId") REFERENCES "SignedLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgenticAction" ADD CONSTRAINT "AgenticAction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
