import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/constants";

export default async function HomePage() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 6);

  return (
    <div className="py-12 md:py-16">
      {/* Hero Section */}
      <section className="content-width text-center mb-16">
        <h1
          className="text-4xl md:text-5xl font-semibold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Welcome to {siteConfig.name}
        </h1>
        <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
          {siteConfig.description}
        </p>
      </section>

      {/* Recent Posts */}
      <section className="content-width-wide">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Recent Posts
          </h2>
          <Link
            href="/blog"
            className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
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
      </section>
    </div>
  );
}
