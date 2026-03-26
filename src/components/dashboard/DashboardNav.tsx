"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  UserCircle,
  LogOut,
  Menu,
  X,
  Globe,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface NavItem {
  readonly labelZh: string;
  readonly labelEn: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: readonly NavItem[] = [
  { labelZh: "概览", labelEn: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { labelZh: "我的项目", labelEn: "My Projects", href: "/dashboard/projects", icon: FolderKanban },
  { labelZh: "报价", labelEn: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { labelZh: "消息", labelEn: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { labelZh: "个人资料", labelEn: "Profile", href: "/dashboard/profile", icon: UserCircle },
] as const;

interface UserInfo {
  readonly name: string;
  readonly email: string;
  readonly avatarUrl: string | null;
}

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, toggleLocale } = useLocale();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("name, avatar_url")
          .eq("id", authUser.id)
          .single();

        setUser({
          name: profile?.name ?? authUser.user_metadata?.name ?? "User",
          email: authUser.email ?? "",
          avatarUrl: profile?.avatar_url ?? null,
        });
      } catch {
        // Graceful degradation if Supabase is not configured
      }
    }

    loadUser();
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      // Force redirect even on error
      router.push("/");
    }
  }, [router]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard") {
        return pathname === "/dashboard";
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
          >
            <span className="text-lg font-bold text-gray-900">
              LingQi
            </span>
            <span className="hidden text-xs text-gray-400 sm:inline">
              Dashboard
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="size-4" />
                  {locale === "zh" ? item.labelZh : item.labelEn}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* Locale Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLocale}
              className="hidden gap-1 text-gray-500 hover:text-gray-900 md:flex"
              aria-label="Toggle language"
            >
              <Globe className="size-4" />
              {locale === "zh" ? "EN" : "中"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Avatar size="sm">
                  {user?.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {user?.name ?? "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email ?? ""}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <UserCircle className="mr-1.5 size-4" />
                  {locale === "zh" ? "个人资料" : "Profile"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-1.5 size-4" />
                  {locale === "zh" ? "退出登录" : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="size-4" />
                {locale === "zh" ? item.labelZh : item.labelEn}
              </Link>
            );
          })}
          <button
            onClick={() => {
              toggleLocale();
              setMobileOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Globe className="size-4" />
            {locale === "zh" ? "Switch to English" : "切换到中文"}
          </button>
        </div>
      )}
    </nav>
  );
}
