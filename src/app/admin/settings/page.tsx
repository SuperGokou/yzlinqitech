"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Check } from "lucide-react";

interface SettingsState {
  siteName: string;
  defaultLocale: string;
  maintenanceMode: boolean;
  contactEmail: string;
  analyticsEnabled: boolean;
}

const defaultSettings: SettingsState = {
  siteName: "LingQi Tech",
  defaultLocale: "zh-CN",
  maintenanceMode: false,
  contactEmail: "contact@lingqitech.com",
  analyticsEnabled: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateSetting<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    // In a full implementation, this would save to the database
    // For now, simulate a save delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Configure general platform settings
        </p>
      </div>

      {/* General Settings */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">General</CardTitle>
          <CardDescription className="text-gray-500">
            Basic platform configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="site-name" className="text-gray-600">
                Site Name
              </Label>
              <Input
                id="site-name"
                value={settings.siteName}
                onChange={(e) => updateSetting("siteName", e.target.value)}
                className="mt-1 border-gray-200 bg-white text-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="default-locale" className="text-gray-600">
                Default Locale
              </Label>
              <Input
                id="default-locale"
                value={settings.defaultLocale}
                onChange={(e) => updateSetting("defaultLocale", e.target.value)}
                className="mt-1 border-gray-200 bg-white text-gray-900"
                placeholder="e.g. zh-CN, en-US"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contact-email" className="text-gray-600">
              Contact Email
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateSetting("contactEmail", e.target.value)}
              className="mt-1 max-w-md border-gray-200 bg-white text-gray-900"
            />
          </div>

          <Separator className="bg-gray-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </p>
                <p className="text-xs text-gray-400">
                  Enable to show a maintenance page to visitors
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(val) =>
                  updateSetting("maintenanceMode", val)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Analytics
                </p>
                <p className="text-xs text-gray-400">
                  Enable visitor analytics tracking
                </p>
              </div>
              <Switch
                checked={settings.analyticsEnabled}
                onCheckedChange={(val) =>
                  updateSetting("analyticsEnabled", val)
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              {saved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
