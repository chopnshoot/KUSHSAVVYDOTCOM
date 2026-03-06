import { NextRequest, NextResponse } from "next/server";
import { getServerProfile, setServerProfile, deleteServerProfile } from "@/lib/profile-store";

export async function GET(request: NextRequest) {
  const installationId = request.nextUrl.searchParams.get("installationId");
  if (!installationId) {
    return NextResponse.json({ error: "Missing installationId" }, { status: 400 });
  }

  const profile = await getServerProfile(installationId);
  if (!profile) return NextResponse.json({ found: false });

  return NextResponse.json({
    found: true,
    userProfile: profile.userProfile,
    lastSynced: profile.lastSynced,
  });
}

export async function PUT(request: NextRequest) {
  const { installationId, userProfile, checksum } = await request.json() as {
    installationId: string;
    userProfile: unknown;
    checksum?: string;
  };

  if (!installationId || !userProfile) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await setServerProfile(installationId, {
    userProfile: userProfile as import("@/extension/src/lib/types").UserProfile,
    lastSynced: Date.now(),
    checksum: checksum ?? "",
  });

  return NextResponse.json({ ok: true, serverChecksum: checksum });
}

export async function DELETE(request: NextRequest) {
  const { installationId } = await request.json() as { installationId: string };
  if (!installationId) {
    return NextResponse.json({ error: "Missing installationId" }, { status: 400 });
  }
  await deleteServerProfile(installationId);
  return NextResponse.json({ ok: true });
}
