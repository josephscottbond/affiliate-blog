import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Post type matching our database schema
export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  description: string | null;
  tags: string[] | null;
  featured_image: string | null;
  draft: boolean;
  author: string | null;
  created_at: string;
  updated_at: string;
}

// For creating/updating posts
export interface PostInput {
  slug: string;
  title: string;
  content?: string;
  description?: string;
  tags?: string[];
  featured_image?: string;
  draft?: boolean;
  author?: string;
}
