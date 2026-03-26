"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

interface ServiceFormData {
  title_zh: string;
  title_en: string;
  slug: string;
  description_zh: string;
  description_en: string;
  icon: string;
  tags: string;
  features_zh: string;
  features_en: string;
  is_active: boolean;
  sort_order: number;
}

const emptyForm: ServiceFormData = {
  title_zh: "",
  title_en: "",
  slug: "",
  description_zh: "",
  description_en: "",
  icon: "",
  tags: "",
  features_zh: "",
  features_en: "",
  is_active: true,
  sort_order: 0,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    setServices(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  function openAddDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(service: ServiceRow) {
    setEditingId(service.id);
    setForm({
      title_zh: service.title_zh,
      title_en: service.title_en,
      slug: service.slug,
      description_zh: service.description_zh ?? "",
      description_en: service.description_en ?? "",
      icon: service.icon ?? "",
      tags: service.tags.join(", "),
      features_zh: service.features_zh.join("\n"),
      features_en: service.features_en.join("\n"),
      is_active: service.is_active,
      sort_order: service.sort_order,
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
      icon: form.icon || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      features_zh: form.features_zh
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      features_en: form.features_en
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      is_active: form.is_active,
      sort_order: form.sort_order,
    };

    if (editingId) {
      await supabase.from("services").update(payload).eq("id", editingId);
    } else {
      await supabase.from("services").insert(payload);
    }

    setSaving(false);
    setDialogOpen(false);
    fetchServices();
  }

  async function handleToggleActive(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("services")
      .update({ is_active: !current })
      .eq("id", id);
    fetchServices();
  }

  function updateForm(field: keyof ServiceFormData, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-sm text-gray-500">Manage your service offerings</p>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Service List</CardTitle>
          <CardAction>
            <Button
              onClick={openAddDialog}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              <Plus className="size-4" />
              Add Service
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-gray-100" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">
              No services yet. Add your first service.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 hover:bg-transparent">
                  <TableHead className="text-gray-500">Title (ZH)</TableHead>
                  <TableHead className="text-gray-500">Title (EN)</TableHead>
                  <TableHead className="text-gray-500">Tags</TableHead>
                  <TableHead className="text-gray-500">Active</TableHead>
                  <TableHead className="text-gray-500">Order</TableHead>
                  <TableHead className="text-right text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((svc) => (
                  <TableRow
                    key={svc.id}
                    className="border-gray-50 hover:bg-gray-50"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {svc.title_zh}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {svc.title_en}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {svc.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-gray-100 text-gray-600 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={svc.is_active}
                        onCheckedChange={() =>
                          handleToggleActive(svc.id, svc.is_active)
                        }
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {svc.sort_order}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(svc)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {editingId ? "Edit Service" : "Add Service"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Fill in the bilingual service information below.
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
                  placeholder="Chinese title"
                />
              </div>
              <div>
                <Label className="text-gray-600">Title (English)</Label>
                <Input
                  value={form.title_en}
                  onChange={(e) => updateForm("title_en", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder="English title"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-600">Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                className="mt-1 border-gray-200 bg-white text-gray-900"
                placeholder="service-slug"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600">Description (Chinese)</Label>
                <Textarea
                  value={form.description_zh}
                  onChange={(e) => updateForm("description_zh", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder="Chinese description"
                />
              </div>
              <div>
                <Label className="text-gray-600">Description (English)</Label>
                <Textarea
                  value={form.description_en}
                  onChange={(e) => updateForm("description_en", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder="English description"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600">Icon (lucide name)</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => updateForm("icon", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder="e.g. Code"
                />
              </div>
              <div>
                <Label className="text-gray-600">Tags (comma-separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => updateForm("tags", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder="web, app, design"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600">Features (Chinese, one per line)</Label>
                <Textarea
                  value={form.features_zh}
                  onChange={(e) => updateForm("features_zh", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder={"Feature 1\nFeature 2"}
                />
              </div>
              <div>
                <Label className="text-gray-600">Features (English, one per line)</Label>
                <Textarea
                  value={form.features_en}
                  onChange={(e) => updateForm("features_en", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder={"Feature 1\nFeature 2"}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-gray-600">Active</Label>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(val) => updateForm("is_active", val)}
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
              disabled={saving || !form.title_zh || !form.title_en || !form.slug}
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
