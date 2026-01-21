"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/supabase";
import DeployButton from "@/components/admin/DeployButton";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Blog Posts
        </h1>
        <div className="flex items-center gap-4">
          <DeployButton />
          <Link href="/admin/edit" className="btn btn-primary">
            New Post
          </Link>
          <button
            onClick={handleLogout}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          Loading...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-muted)] mb-4">No posts yet</p>
          <Link href="/admin/edit" className="btn btn-primary">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium w-24">Status</th>
                <th className="text-left px-4 py-3 font-medium w-32">Updated</th>
                <th className="text-right px-4 py-3 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="font-medium hover:text-[var(--color-accent)] transition-colors"
                    >
                      {post.title || "Untitled"}
                    </Link>
                    {post.description && (
                      <p className="text-sm text-[var(--color-text-muted)] truncate max-w-md">
                        {post.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        post.draft
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {post.draft ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    {formatDate(post.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
