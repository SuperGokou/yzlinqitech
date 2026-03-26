"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type PortfolioRow = Database["public"]["Tables"]["portfolio_items"]["Row"];

interface PortfolioFormData {
  title_zh: string;
  title_en: string;
  slug: string;
  description_zh: string;
  description_en: string;
  images: string;
  category: string;
  tech_stack: string;
  is_featured: boolean;
  sort_order: number;
}

const emptyForm: PortfolioFormData = {
  title_zh: "",
  title_en: "",
  slug: "",
  description_zh: "",
  description_en: "",
  images: "",
  category: "",
  tech_stack: "",
  is_featured: false,
  sort_order: 0,
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function openAddDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(item: PortfolioRow) {
    setEditingId(item.id);
    setForm({
      title_zh: item.title_zh,
      title_en: item.title_en,
      slug: item.slug,
      description_zh: item.description_zh ?? "",
      description_en: item.description_en ?? "",
      images: item.images.join("\n"),
      category: item.category,
      tech_stack: item.tech_stack.join(", "),
      is_featured: item.is_featured,
      sort_order: item.sort_order,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title_zh: form.title_zh,
      title_en: form.title_en,
      slug: form.slug,
      description_zh: form.description_zh || null,
      description_en: form.description_en || null,
      images: form.images
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
      category: form.category,
      tech_stack: form.tech_stack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      is_featured: form.is_featured,
      sort_order: form.sort_order,
    };

    if (editingId) {
      await supabase.from("portfolio_items").update(payload).eq("id", editingId);
    } else {
      await supabase.from("portfolio_items").insert(payload);
    }

    setSaving(false);
    setDialogOpen(false);
    fetchItems();
  }

  function updateForm(field: keyof PortfolioFormData, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <p className="text-sm text-gray-500">Manage your portfolio showcase</p>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Portfolio Items</CardTitle>
          <CardAction>
            <Button
              onClick={openAddDialog}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              <Plus className="size-4" />
              Add Item
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">
              No portfolio items yet
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-md"
                >
                  {item.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}
                  <div className="mb-3 flex aspect-video items-center justify-center rounded-md bg-gray-200 text-sm text-gray-400">
                    {item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title_en}
                        className="size-full rounded-md object-cover"
                      />
                    ) : (
                      "No image"
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">{item.title_zh}</h3>
                  <p className="text-sm text-gray-500">{item.title_en}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge
                      variant="outline"
                      className="border-gray-200 bg-white text-gray-600 text-xs"
                    >
                      {item.category}
                    </Badge>
                    {item.tech_stack.slice(0, 2).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-gray-100 text-gray-500 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEditDialog(item)}
                    className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-blue-600"
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {editingId ? "Edit Portfolio Item" : "Add Portfolio Item"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Fill in the details for this portfolio item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600">Title (Chinese)</Label>
                <Input
                  value={form.title_zh}
                  onChange={(e) => updateForm("title_zh", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                />
              </div>
              <div>
                <Label className="text-gray-600">Title (English)</Label>
                <Input
                  value={form.title_en}
                  onChange={(e) => updateForm("title_en", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => updateForm("slug", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                />
              </div>
              <div>
                <Label className="text-gray-600">Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder="e.g. web, mobile, design"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600">Description (Chinese)</Label>
                <Textarea
                  value={form.description_zh}
                  onChange={(e) => updateForm("description_zh", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                />
              </div>
              <div>
                <Label className="text-gray-600">Description (English)</Label>
                <Textarea
                  value={form.description_en}
                  onChange={(e) => updateForm("description_en", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-600">Image URLs (one per line)</Label>
              <Textarea
                value={form.images}
                onChange={(e) => updateForm("images", e.target.value)}
                className="mt-1 border-gray-200 bg-white text-gray-900"
                placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
              />
            </div>
            <div>
              <Label className="text-gray-600">Tech Stack (comma-separated)</Label>
              <Input
                value={form.tech_stack}
                onChange={(e) => updateForm("tech_stack", e.target.value)}
                className="mt-1 border-gray-200 bg-white text-gray-900"
                placeholder="React, Next.js, TypeScript"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-gray-600">Featured</Label>
                <Switch
                  checked={form.is_featured}
                  onCheckedChange={(val) => updateForm("is_featured", val)}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-gray-600">Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    updateForm("sort_order", parseInt(e.target.value, 10) || 0)
                  }
                  className="w-20 border-gray-200 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={saving || !form.title_zh || !form.title_en || !form.slug || !form.category}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
