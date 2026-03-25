"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Check, Upload } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface ProfileData {
  readonly name: string;
  readonly company: string;
  readonly phone: string;
  readonly avatarUrl: string | null;
}

export default function ProfilePage() {
  const { locale } = useLocale();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    company: "",
    phone: "",
    avatarUrl: null,
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("name, company, phone, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          name: data.name ?? "",
          company: data.company ?? "",
          phone: data.phone ?? "",
          avatarUrl: data.avatar_url,
        });
      }
    } catch {
      // Graceful degradation
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = useCallback(async () => {
    setError(null);
    setSaved(false);

    if (!profile.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated.");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: profile.name.trim(),
          company: profile.company.trim() || null,
          phone: profile.phone.trim() || null,
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [profile]);

  const handlePasswordChange = useCallback(async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) {
        setPasswordError(updateError.message);
        return;
      }

      setPasswordSuccess(true);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  }, [passwordData]);

  const handleAvatarUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be less than 2MB.");
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = file.name.split(".").pop();
        const filePath = `avatars/${user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          setError("Failed to upload avatar.");
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        await supabase
          .from("profiles")
          .update({ avatar_url: publicUrl })
          .eq("id", user.id);

        setProfile((prev) => ({ ...prev, avatarUrl: publicUrl }));
      } catch {
        setError("Failed to upload avatar. Please try again.");
      }
    },
    []
  );

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-lg bg-gray-200" />
        <Skeleton className="h-64 w-full rounded-xl bg-gray-200" />
        <Skeleton className="h-48 w-full rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{locale === "zh" ? "个人资料" : "Profile"}</h1>
        <p className="text-sm text-gray-500">
          {locale === "zh" ? "管理账户设置" : "Manage your account information and settings."}
        </p>
      </div>

      {/* Profile Info */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {locale === "zh" ? "个人信息" : "Personal Information"}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {locale === "zh" ? "更新您的姓名、公司和联系方式。" : "Update your name, company, and contact details."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {profile.avatarUrl ? (
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              ) : null}
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <label htmlFor="avatar-upload">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                >
                  <Upload className="mr-1.5 size-3.5" />
                  {locale === "zh" ? "更换头像" : "Change Avatar"}
                </Button>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <p className="mt-1 text-xs text-gray-400">
                Max 2MB. JPG, PNG, or WebP.
              </p>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                {locale === "zh" ? "姓名" : "Name"}
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                {locale === "zh" ? "邮箱" : "Email"}
              </Label>
              <Input
                id="email"
                value={email}
                disabled
                className="border-gray-200 bg-gray-50 text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-700">
                {locale === "zh" ? "公司" : "Company"}{" "}
                <span className="text-gray-400">({locale === "zh" ? "选填" : "optional"})</span>
              </Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Your company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                {locale === "zh" ? "电话" : "Phone"}{" "}
                <span className="text-gray-400">({locale === "zh" ? "选填" : "optional"})</span>
              </Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="+86 138 xxxx xxxx"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving ? (locale === "zh" ? "保存中..." : "Saving...") : (locale === "zh" ? "保存修改" : "Save Changes")}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="size-4" />
                {locale === "zh" ? "已保存" : "Saved"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">{locale === "zh" ? "修改密码" : "Change Password"}</CardTitle>
          <CardDescription className="text-gray-500">
            {locale === "zh" ? "更新您的账户密码。" : "Update your account password."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-gray-700">
                {locale === "zh" ? "新密码" : "New Password"}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-700">
                {locale === "zh" ? "确认密码" : "Confirm Password"}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Re-enter new password"
                autoComplete="new-password"
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-sm text-red-500" role="alert">
              {passwordError}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handlePasswordChange}
              disabled={passwordSaving}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              {passwordSaving ? (locale === "zh" ? "更新中..." : "Updating...") : (locale === "zh" ? "更新密码" : "Update Password")}
            </Button>
            {passwordSuccess && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="size-4" />
                {locale === "zh" ? "密码已更新" : "Password updated"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
