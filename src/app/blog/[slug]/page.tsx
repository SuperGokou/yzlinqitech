import { getAllSlugs } from "@/lib/blog-data";
import BlogPostClient from "./BlogPostClient";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
