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
} from "@/components/ui/dialog";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type BlogRow = Database["public"]["Tables"]["blog_posts"]["Row"];

interface BlogFormData {
  title_zh: string;
  title_en: string;
  slug: string;
  excerpt_zh: string;
  excerpt_en: string;
  content_zh: string;
  content_en: string;
  tags: string;
  tag_color: string;
  is_published: boolean;
}

const emptyForm: BlogFormData = {
  title_zh: "",
  title_en: "",
  slug: "",
  excerpt_zh: "",
  excerpt_en: "",
  content_zh: "",
  content_en: "",
  tags: "",
  tag_color: "",
  is_published: false,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function openAddDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(post: BlogRow) {
    setEditingId(post.id);
    setForm({
      title_zh: post.title_zh,
      title_en: post.title_en,
      slug: post.slug,
      excerpt_zh: post.excerpt_zh ?? "",
      excerpt_en: post.excerpt_en ?? "",
      content_zh: post.content_zh,
      content_en: post.content_en,
      tags: post.tags.join(", "),
      tag_color: post.tag_color ?? "",
      is_published: post.is_published,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingId) {
      await supabase
        .from("blog_posts")
        .update({
          title_zh: form.title_zh,
          title_en: form.title_en,
          slug: form.slug,
          excerpt_zh: form.excerpt_zh || null,
          excerpt_en: form.excerpt_en || null,
          content_zh: form.content_zh,
          content_en: form.content_en,
          tags,
          tag_color: form.tag_color || null,
          is_published: form.is_published,
        })
        .eq("id", editingId);
    } else {
      await supabase.from("blog_posts").insert({
        title_zh: form.title_zh,
        title_en: form.title_en,
        slug: form.slug,
        excerpt_zh: form.excerpt_zh || null,
        excerpt_en: form.excerpt_en || null,
        content_zh: form.content_zh,
        content_en: form.content_en,
        tags,
        tag_color: form.tag_color || null,
        is_published: form.is_published,
      });
    }

    setSaving(false);
    setDialogOpen(false);
    fetchPosts();
  }

  async function handleTogglePublish(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("blog_posts")
      .update({
        is_published: !current,
      })
      .eq("id", id);
    fetchPosts();
  }

  function updateForm(field: keyof BlogFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <p className="text-sm text-gray-500">Manage blog posts and articles</p>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Blog Posts</CardTitle>
          <CardAction>
            <Button
              onClick={openAddDialog}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              <Plus className="size-4" />
              New Post
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-gray-100" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">
              No blog posts yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 hover:bg-transparent">
                  <TableHead className="text-gray-500">Title</TableHead>
                  <TableHead className="text-gray-500">Tags</TableHead>
                  <TableHead className="text-gray-500">Status</TableHead>
                  <TableHead className="text-gray-500">Read Time</TableHead>
                  <TableHead className="text-gray-500">Date</TableHead>
                  <TableHead className="text-right text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow
                    key={post.id}
                    className="border-gray-50 hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {post.title_zh}
                        </p>
                        <p className="text-xs text-gray-400">{post.title_en}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
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
                      <Badge
                        variant="outline"
                        className={cn(
                          "border text-xs",
                          post.is_published
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        )}
                      >
                        {post.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {post.read_time} min
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            handleTogglePublish(post.id, post.is_published)
                          }
                          className={cn(
                            "text-gray-400",
                            post.is_published
                              ? "hover:text-amber-600"
                              : "hover:text-green-600"
                          )}
                          title={
                            post.is_published ? "Unpublish" : "Publish"
                          }
                        >
                          {post.is_published ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDialog(post)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </div>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {editingId ? "Edit Post" : "New Post"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Create bilingual blog content.
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
                <Label className="text-gray-600">Tags (comma-separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => updateForm("tags", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                  placeholder="AI, web, tutorial"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600">Excerpt (Chinese)</Label>
                <Textarea
                  value={form.excerpt_zh}
                  onChange={(e) => updateForm("excerpt_zh", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                />
              </div>
              <div>
                <Label className="text-gray-600">Excerpt (English)</Label>
                <Textarea
                  value={form.excerpt_en}
                  onChange={(e) => updateForm("excerpt_en", e.target.value)}
                  className="mt-1 border-gray-200 bg-white text-gray-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600">Content (Chinese)</Label>
                <Textarea
                  value={form.content_zh}
                  onChange={(e) => updateForm("content_zh", e.target.value)}
                  className="mt-1 min-h-[150px] border-gray-200 bg-white text-gray-900"
                />
              </div>
              <div>
                <Label className="text-gray-600">Content (English)</Label>
                <Textarea
                  value={form.content_en}
                  onChange={(e) => updateForm("content_en", e.target.value)}
                  className="mt-1 min-h-[150px] border-gray-200 bg-white text-gray-900"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-gray-600">Tag Color</Label>
                <Input
                  value={form.tag_color}
                  onChange={(e) => updateForm("tag_color", e.target.value)}
                  className="mt-1 w-32 border-gray-200 bg-white text-gray-900"
                  placeholder="#3b82f6"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Label className="text-gray-600">Published</Label>
                <Switch
                  checked={form.is_published}
                  onCheckedChange={(val) => updateForm("is_published", val)}
                  size="sm"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={
                saving ||
                !form.title_zh ||
                !form.title_en ||
                !form.slug ||
                !form.content_zh ||
                !form.content_en
              }
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
