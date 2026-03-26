"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Save, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type ContentRow = Database["public"]["Tables"]["site_content"]["Row"];

interface GroupedContent {
  [section: string]: ContentRow[];
}

const SECTION_LABELS: Record<string, string> = {
  hero_stats: "Hero Stats",
  social_links: "Social Links",
  footer: "Footer Info",
  general: "General",
};

export default function AdminContentPage() {
  const [grouped, setGrouped] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [editedValues, setEditedValues] = useState<
    Record<string, { value_zh: string; value_en: string }>
  >({});
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("site_content")
      .select("*")
      .order("section", { ascending: true });

    const items = data ?? [];
    const groups: GroupedContent = {};
    for (const item of items) {
      const section = item.section;
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(item);
    }
    setGrouped(groups);

    // Initialize edited values
    const initial: Record<string, { value_zh: string; value_en: string }> = {};
    for (const item of items) {
      initial[item.id] = {
        value_zh: item.value_zh ?? "",
        value_en: item.value_en ?? "",
      };
    }
    setEditedValues(initial);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  function handleChange(id: string, field: "value_zh" | "value_en", value: string) {
    setEditedValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function handleSaveSection(section: string) {
    setSavingSection(section);
    const supabase = createClient();
    const items = grouped[section] ?? [];
    const updates = items.map((item) => {
      const edited = editedValues[item.id];
      return supabase
        .from("site_content")
        .update({
          value_zh: edited?.value_zh ?? item.value_zh,
          value_en: edited?.value_en ?? item.value_en,
        })
        .eq("id", item.id);
    });

    await Promise.all(updates);
    setSavingSection(null);
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-gray-200" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full bg-gray-100" />
        ))}
      </div>
    );
  }

  const sections = Object.keys(grouped);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <p className="text-sm text-gray-500">
          Manage bilingual content across your website
        </p>
      </div>

      {sections.length === 0 ? (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-gray-400">No content entries found</p>
          </CardContent>
        </Card>
      ) : (
        sections.map((section) => {
          const items = grouped[section];
          const label = SECTION_LABELS[section] ?? section;
          return (
            <Card key={section} className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">{label}</CardTitle>
                <CardDescription className="text-gray-500">
                  {items.length} content{items.length !== 1 ? " entries" : " entry"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, idx) => {
                  const edited = editedValues[item.id] ?? {
                    value_zh: item.value_zh ?? "",
                    value_en: item.value_en ?? "",
                  };
                  return (
                    <div key={item.id}>
                      {idx > 0 && <Separator className="mb-4 bg-gray-100" />}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          {item.key}
                          <span className="ml-2 text-xs text-gray-400">
                            ({item.type})
                          </span>
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-400">
                              Chinese
                            </Label>
                            <Input
                              value={edited.value_zh}
                              onChange={(e) =>
                                handleChange(item.id, "value_zh", e.target.value)
                              }
                              className="mt-1 border-gray-200 bg-white text-gray-900"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">
                              English
                            </Label>
                            <Input
                              value={edited.value_en}
                              onChange={(e) =>
                                handleChange(item.id, "value_en", e.target.value)
                              }
                              className="mt-1 border-gray-200 bg-white text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => handleSaveSection(section)}
                    disabled={savingSection === section}
                    className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                  >
                    {savedSection === section ? (
                      <>
                        <Check className="size-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        {savingSection === section ? "Saving..." : "Save Section"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
