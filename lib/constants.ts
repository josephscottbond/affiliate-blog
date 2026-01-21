// Site configuration
export const siteConfig = {
  name: "Your Blog Name",
  description: "A blog about [your niche]",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com",
  author: {
    name: "Your Name",
    email: "hello@yourblog.com",
  },
  // Social links (add your handles)
  social: {
    pinterest: "",
    instagram: "",
    facebook: "",
  },
};

// Google Analytics - add your tracking ID here
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Affiliate disclosure text (FTC compliant)
export const affiliateDisclosure = {
  short:
    "This post may contain affiliate links. If you make a purchase through these links, I may earn a small commission at no extra cost to you.",
  full: `Disclosure: Some of the links on this page are affiliate links, meaning I may receive a small commission if you click through and make a purchase. This comes at no additional cost to you and helps support the blog. I only recommend products I personally use and believe in. Thank you for your support!`,
};

// Post settings
export const postsPerPage = 10;

// Front matter field requirements
export const requiredFrontMatter = [
  "title",
  "date",
  "description",
] as const;

export const optionalFrontMatter = [
  "featured_image",
  "tags",
  "author",
  "draft",
  "deploy",
] as const;
