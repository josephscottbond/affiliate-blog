import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, PostInput } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single post
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT update post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body: Partial<PostInput> = await request.json();

  const { data, error } = await supabaseAdmin
    .from("posts")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
