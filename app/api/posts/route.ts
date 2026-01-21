import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, PostInput } from "@/lib/supabase";

// GET all posts
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST create new post
export async function POST(request: NextRequest) {
  const body: PostInput = await request.json();

  // Generate slug from title if not provided
  if (!body.slug) {
    body.slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert([
      {
        ...body,
        draft: body.draft ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
