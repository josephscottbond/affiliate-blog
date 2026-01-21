import { NextResponse } from "next/server";

export async function POST() {
  const deployHook = process.env.VERCEL_DEPLOY_HOOK;

  if (!deployHook) {
    return NextResponse.json(
      { error: "Deploy hook not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(deployHook, { method: "POST" });

    if (!res.ok) {
      throw new Error("Deploy hook failed");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Deploy failed" },
      { status: 500 }
    );
  }
}
