import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ServiceDetailClient from "./ServiceDetailClient";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const { data: service } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!service) notFound();

    return <ServiceDetailClient service={service} />;
  } catch {
    // Supabase not configured or network error -- show fallback
    return <ServiceDetailClient service={null} slug={slug} />;
  }
}
