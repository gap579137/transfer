import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";

export async function PUT(request) {
  try {
    const { id, free, used } = await request.json();

    // First get the current snapshot to save to history
    const currentSnapshot = await prisma.snapshot.findUnique({
      where: { id },
    });

    if (!currentSnapshot) {
      return NextResponse.json(
        { error: "Snapshot not found" },
        { status: 404 },
      );
    }

    // Save current state to history before updating
    await prisma.snapshotHistory.create({
      data: {
        sessionId: currentSnapshot.sessionId,
        snapshotName: currentSnapshot.name,
        total: currentSnapshot.total,
        free: currentSnapshot.free,
        used: currentSnapshot.used,
      },
    });

    // Update the snapshot with new values
    const snapshot = await prisma.snapshot.update({
      where: { id },
      data: {
        free: Number.parseFloat(free),
        used: Number.parseFloat(used),
      },
    });

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("Error updating snapshot:", error);
    return NextResponse.json(
      { error: "Failed to update snapshot" },
      { status: 500 },
    );
  }
}
