"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(
    callbackError === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (field: keyof LoginInput) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        setError(null);
      },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const result = loginSchema.safeParse(formData);
      if (!result.success) {
        const firstError = result.error.issues[0];
        setError(firstError?.message ?? "Invalid input");
        return;
      }

      setLoading(true);

      try {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: result.data.email,
          password: result.data.password,
        });

        if (authError) {
          setError(authError.message);
          return;
        }

        const returnUrl = searchParams.get("returnUrl") ?? "/dashboard";
        router.push(returnUrl);
        router.refresh();
      } catch {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [formData, router, searchParams]
  );

  return (
    <Card className="border border-white/10 bg-white/5 text-text-primary backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg text-text-primary">Sign In</CardTitle>
        <CardDescription className="text-text-secondary">
          Enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-secondary">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange("email")}
              className="border-white/10 bg-white/5 text-text-primary placeholder:text-text-muted"
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-text-secondary">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange("password")}
              className="border-white/10 bg-white/5 text-text-primary placeholder:text-text-muted"
              disabled={loading}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-white/5 bg-transparent">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-cyan text-bg-deep hover:bg-neon-cyan-dim"
            size="lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-neon-cyan underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
