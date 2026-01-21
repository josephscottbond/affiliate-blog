import Link from "next/link";
import Image from "next/image";
import type { PostPreview } from "@/lib/posts";

interface PostCardProps {
  post: PostPreview;
}

export default function PostCard({ post }: PostCardProps) {
  const { slug, frontMatter } = post;
  const { title, date, description, featured_image, tags } = frontMatter;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="post-card">
      <Link href={`/blog/${slug}`} className="block">
        {featured_image && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={featured_image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-5">
          <time
            dateTime={date}
            className="text-sm text-[var(--color-text-light)]"
          >
            {formattedDate}
          </time>

          <h2
            className="text-xl font-semibold mt-2 mb-2 leading-snug"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h2>

          <p className="text-[var(--color-text-muted)] line-clamp-2">
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags
                .filter((tag) => tag !== "deploy")
                .slice(0, 3)
                .map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
