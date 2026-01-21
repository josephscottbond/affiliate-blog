import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const extension = file.name.split(".").pop();
  const filename = `${timestamp}.${extension}`;

  // Upload to Supabase Storage
  const { error } = await supabaseAdmin.storage
    .from("post-images")
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from("post-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}
