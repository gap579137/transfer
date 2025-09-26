-- CreateTable
CREATE TABLE "public"."transfer_sessions" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "startTime" TIMESTAMP(3),
    "currentTime" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3),
    "percentManual" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfer_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."snapshots" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "free" DOUBLE PRECISION NOT NULL,
    "used" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jobs" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."snapshots" ADD CONSTRAINT "snapshots_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."transfer_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."transfer_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
