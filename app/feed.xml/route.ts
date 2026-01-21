import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/constants";

export async function GET() {
  const posts = await getAllPosts();

  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: "en",
    favicon: `${siteConfig.url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author.name}`,
    author: {
      name: siteConfig.author.name,
      email: siteConfig.author.email,
      link: siteConfig.url,
    },
    feedLinks: {
      rss2: `${siteConfig.url}/feed.xml`,
    },
  });

  posts.forEach((post) => {
    const url = `${siteConfig.url}/blog/${post.slug}`;

    feed.addItem({
      title: post.frontMatter.title,
      id: url,
      link: url,
      description: post.frontMatter.description,
      date: new Date(post.frontMatter.date),
      author: [
        {
          name: post.frontMatter.author || siteConfig.author.name,
          email: siteConfig.author.email,
        },
      ],
      image: post.frontMatter.featured_image
        ? `${siteConfig.url}${post.frontMatter.featured_image}`
        : undefined,
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
