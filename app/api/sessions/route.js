import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";

export async function GET() {
  try {
    // Get the latest session or create a new one if none exists
    let session = await prisma.transferSession.findFirst({
      orderBy: { updatedAt: "desc" },
      include: {
        snapshots: {
          orderBy: { createdAt: "asc" },
        },
        jobs: {
          orderBy: { createdAt: "asc" },
        },
        snapshotHistory: {
          orderBy: { createdAt: "desc" },
          take: 10, // Get last 10 history entries for speed calculation
        },
      },
    });

    if (!session) {
      // Create default session with initial data
      session = await prisma.transferSession.create({
        data: {
          name: "Default Session",
          snapshots: {
            create: [
              {
                name: "A",
                total: 8.0, // 8 TB total
                free: 2.5, // 2.5 TB free
                used: 5.5, // 5.5 TB used
              },
              {
                name: "B",
                total: 8.0, // 8 TB total
                free: 7.8, // 7.8 TB free
                used: 0.2, // 0.2 TB used
              },
            ],
          },
          jobs: {
            create: [
              {
                name: "Backup job",
                startTime: "17:55",
              },
            ],
          },
        },
        include: {
          snapshots: {
            orderBy: { createdAt: "asc" },
          },
          jobs: {
            orderBy: { createdAt: "asc" },
          },
          snapshotHistory: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();

    // Get the latest session
    const existingSession = await prisma.transferSession.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "No session found" }, { status: 404 });
    }

    // Prepare the update data
    const updateData = {};

    // Only allow setting startTime if it's not already set
    if (data.startTime && !existingSession.startTime) {
      updateData.startTime = new Date(data.startTime);
    }

    // Always allow updating lastUpdated
    if (data.lastUpdated) {
      updateData.lastUpdated = new Date(data.lastUpdated);
    }

    const session = await prisma.transferSession.update({
      where: { id: existingSession.id },
      data: updateData,
      include: {
        snapshots: {
          orderBy: { createdAt: "asc" },
        },
        jobs: {
          orderBy: { createdAt: "asc" },
        },
        snapshotHistory: {
          orderBy: { createdAt: "desc" },
          take: 10, // Get last 10 history entries for speed calculation
        },
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 },
    );
  }
}
