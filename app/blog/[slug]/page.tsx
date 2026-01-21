import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { siteConfig } from "@/lib/constants";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import ShareButtons from "@/components/ShareButtons";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Calculate reading time from HTML content
function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const { title, description, featured_image, date, tags } = post.frontMatter;

  return {
    title,
    description,
    keywords: tags,
    authors: [{ name: post.frontMatter.author || siteConfig.author.name }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: date,
      authors: [post.frontMatter.author || siteConfig.author.name],
      tags: tags,
      images: featured_image
        ? [
            {
              url: featured_image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: featured_image ? [featured_image] : [],
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontMatter, content } = post;
  const { title, date, description, featured_image, tags, author } =
    frontMatter;

  const readingTime = getReadingTime(content);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: featured_image ? `${siteConfig.url}${featured_image}` : undefined,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Person",
      name: author || siteConfig.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-12 md:py-16">
        <div className="content-width">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-8"
          >
            ← Back to blog
          </Link>

          {/* Post header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)] mb-4">
              <time dateTime={date}>{formattedDate}</time>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-semibold leading-tight mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {title}
            </h1>

            <p className="text-xl text-[var(--color-text-muted)]">
              {description}
            </p>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured image */}
          {featured_image && (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
              <Image
                src={featured_image}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          )}

          {/* Affiliate disclosure */}
          <AffiliateDisclosure />

          {/* Post content - HTML from TipTap editor */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Share buttons */}
          <ShareButtons
            title={title}
            url={`/blog/${slug}`}
            description={description}
            image={featured_image}
          />
        </div>
      </article>
    </>
  );
}
