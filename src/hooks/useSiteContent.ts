"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type SiteContent = Database["public"]["Tables"]["site_content"]["Row"];

export function useSiteContent(section: string) {
  const [content, setContent] = useState<Record<string, SiteContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_content")
      .select("*")
      .eq("section", section)
      .then(({ data }) => {
        if (data) {
          const mapped = Object.fromEntries(data.map((item) => [item.key, item]));
          setContent(mapped);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [section]);

  return { content, loading };
}
