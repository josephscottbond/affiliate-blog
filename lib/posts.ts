import { supabaseAdmin, Post as DbPost } from "./supabase";

export interface PostFrontMatter {
  title: string;
  date: string;
  description: string;
  featured_image?: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
}

export interface Post {
  slug: string;
  frontMatter: PostFrontMatter;
  content: string;
}

export interface PostPreview {
  slug: string;
  frontMatter: PostFrontMatter;
}

// Convert database post to our Post format
function dbPostToPost(dbPost: DbPost): Post {
  return {
    slug: dbPost.slug,
    frontMatter: {
      title: dbPost.title,
      date: dbPost.created_at,
      description: dbPost.description || "",
      featured_image: dbPost.featured_image || undefined,
      tags: dbPost.tags || undefined,
      author: dbPost.author || undefined,
      draft: dbPost.draft,
    },
    content: dbPost.content || "",
  };
}

function dbPostToPreview(dbPost: DbPost): PostPreview {
  return {
    slug: dbPost.slug,
    frontMatter: {
      title: dbPost.title,
      date: dbPost.created_at,
      description: dbPost.description || "",
      featured_image: dbPost.featured_image || undefined,
      tags: dbPost.tags || undefined,
      author: dbPost.author || undefined,
      draft: dbPost.draft,
    },
  };
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return dbPostToPost(data);
}

/**
 * Get all posts sorted by date (newest first)
 * Only returns published posts (draft = false)
 */
export async function getAllPosts(): Promise<PostPreview[]> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("draft", false)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(dbPostToPreview);
}

/**
 * Get all unique tags from published posts
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.frontMatter.tags?.forEach((tag) => {
      tagsSet.add(tag.toLowerCase());
    });
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<PostPreview[]> {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    post.frontMatter.tags
      ?.map((t) => t.toLowerCase())
      .includes(tag.toLowerCase())
  );
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("slug")
    .eq("draft", false);

  if (error || !data) {
    return [];
  }

  return data.map((post) => post.slug);
}
