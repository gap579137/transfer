-- Ensure snapshots table has updatedAt column used by Prisma schema
ALTER TABLE "public"."snapshots"
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create snapshot_history table used to track historical values
CREATE TABLE IF NOT EXISTS "public"."snapshot_history" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "snapshotName" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "free" DOUBLE PRECISION NOT NULL,
    "used" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "snapshot_history_pkey" PRIMARY KEY ("id")
);

-- Link snapshot_history rows to transfer_sessions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        WHERE tc.constraint_name = 'snapshot_history_sessionId_fkey'
          AND tc.table_name = 'snapshot_history'
          AND tc.table_schema = 'public'
    ) THEN
        ALTER TABLE "public"."snapshot_history"
        ADD CONSTRAINT "snapshot_history_sessionId_fkey"
        FOREIGN KEY ("sessionId") REFERENCES "public"."transfer_sessions"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END;
$$;
