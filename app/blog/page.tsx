import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: `All posts from ${siteConfig.name}`,
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: `All posts from ${siteConfig.name}`,
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="py-12 md:py-16">
      <div className="content-width-wide">
        <header className="mb-12">
          <h1
            className="text-4xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Blog
          </h1>
          <p className="text-xl text-[var(--color-text-muted)]">
            All articles and posts
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <p className="text-lg mb-4">No posts yet.</p>
            <p className="text-sm">
              Create your first post in the{" "}
              <Link href="/admin" className="text-[var(--color-accent)] underline">
                admin panel
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
