import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PortfolioDetailClient from "./PortfolioDetailClient";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const { data: item } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!item) notFound();

    return <PortfolioDetailClient item={item} />;
  } catch {
    // Supabase not configured or network error -- show fallback
    return <PortfolioDetailClient item={null} slug={slug} />;
  }
}
