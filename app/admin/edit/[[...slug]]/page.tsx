"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Editor from "@/components/admin/Editor";
import { Post } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default function EditPostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const postId = resolvedParams.slug?.[0];
  const isNew = !postId;

  const router = useRouter();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [draft, setDraft] = useState(true);
  const [currentPostId, setCurrentPostId] = useState<string | null>(postId || null);

  // Load existing post
  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  const fetchPost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const post: Post = await res.json();
        setTitle(post.title);
        setContent(post.content || "");
        setDescription(post.description || "");
        setTags(post.tags?.join(", ") || "");
        setFeaturedImage(post.featured_image || "");
        setDraft(post.draft);
      }
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!title) return; // Don't auto-save empty posts

    const interval = setInterval(() => {
      handleSave(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [title, content, description, tags, featuredImage, draft, currentPostId]);

  const handleSave = useCallback(
    async (isAutoSave = false) => {
      if (!title.trim()) {
        if (!isAutoSave) alert("Please enter a title");
        return;
      }

      setSaving(true);

      const postData = {
        title: title.trim(),
        content,
        description: description.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured_image: featuredImage.trim() || null,
        draft,
        slug: title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      };

      try {
        let res;
        if (currentPostId) {
          // Update existing
          res = await fetch(`/api/posts/${currentPostId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
          });
        } else {
          // Create new
          res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
          });
        }

        if (res.ok) {
          const savedPost = await res.json();
          setCurrentPostId(savedPost.id);
          setLastSaved(new Date());

          // Update URL if this was a new post
          if (!postId && !isAutoSave) {
            router.replace(`/admin/edit/${savedPost.id}`);
          }
        }
      } catch (error) {
        console.error("Save failed:", error);
        if (!isAutoSave) alert("Failed to save");
      } finally {
        setSaving(false);
      }
    },
    [title, content, description, tags, featuredImage, draft, currentPostId, postId, router]
  );

  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    setSaving(true);

    const postData = {
      title: title.trim(),
      content,
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      featured_image: featuredImage.trim() || null,
      draft: false,
      slug: title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    };

    try {
      let res;
      if (currentPostId) {
        res = await fetch(`/api/posts/${currentPostId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
      } else {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
      }

      if (res.ok) {
        const savedPost = await res.json();
        setCurrentPostId(savedPost.id);
        setDraft(false);
        setLastSaved(new Date());

        // Update URL if this was a new post
        if (!postId) {
          router.replace(`/admin/edit/${savedPost.id}`);
        }

        // Trigger deploy after publish
        await fetch("/api/deploy", { method: "POST" });
        alert("Published and deploying! Your post will be live in about a minute.");
      }
    } catch (error) {
      console.error("Publish failed:", error);
      alert("Failed to publish");
    } finally {
      setSaving(false);
    }
  };

  const handleRevertToDraft = async () => {
    setSaving(true);

    try {
      const res = await fetch(`/api/posts/${currentPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: true }),
      });

      if (res.ok) {
        setDraft(true);
        setLastSaved(new Date());

        // Trigger deploy to remove from live site
        await fetch("/api/deploy", { method: "POST" });
        alert("Reverted to draft. The post will be removed from the live site in about a minute.");
      }
    } catch (error) {
      console.error("Revert failed:", error);
      alert("Failed to revert to draft");
    } finally {
      setSaving(false);
    }
  };

  const [uploadingFeatured, setUploadingFeatured] = useState(false);

  const uploadFeaturedImage = async (file: File) => {
    setUploadingFeatured(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setFeaturedImage(url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploadingFeatured(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFeaturedImage(file);
  };

  const handleFeaturedDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await uploadFeaturedImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--color-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/admin"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            ← Back to posts
          </Link>

          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-sm text-[var(--color-text-muted)]">
                {saving ? "Saving..." : `Saved ${lastSaved.toLocaleTimeString()}`}
              </span>
            )}

            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="btn btn-outline"
            >
              Save Draft
            </button>

            {draft ? (
              <button onClick={handlePublish} disabled={saving} className="btn btn-primary">
                {saving ? "Publishing..." : "Publish"}
              </button>
            ) : (
              <button onClick={handleRevertToDraft} disabled={saving} className="btn btn-outline">
                Revert to Draft
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="w-full text-3xl font-semibold bg-transparent border-none focus:outline-none"
              style={{ fontFamily: "var(--font-serif)" }}
            />

            {/* Content Editor */}
            <Editor content={content} onChange={setContent} />
          </div>

          {/* Sidebar - Metadata */}
          <div className="space-y-6">
            <div className="sticky top-24">
              {/* Status */}
              <div className="mb-6 p-4 rounded-lg bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
                <p className="text-sm font-medium mb-1">Status</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    draft
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {draft ? "Draft" : "Published"}
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for SEO and previews"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
                />
              </div>

              {/* Tags */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Separate with commas
                </p>
              </div>

              {/* Featured Image */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Featured Image
                </label>
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFeaturedImage("")}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label
                    className={`block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                      uploadingFeatured
                        ? "border-[var(--color-accent)] bg-blue-50"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                    }`}
                    onDrop={handleFeaturedDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {uploadingFeatured ? "Uploading..." : "Click or drag image here"}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
