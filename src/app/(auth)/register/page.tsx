"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
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

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterInput>({
    email: "",
    password: "",
    name: "",
    company: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (field: keyof RegisterInput) =>
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

      const payload = {
        ...formData,
        company: formData.company || undefined,
      };

      const result = registerSchema.safeParse(payload);
      if (!result.success) {
        const firstError = result.error.issues[0];
        setError(firstError?.message ?? "Invalid input");
        return;
      }

      setLoading(true);

      try {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signUp({
          email: result.data.email,
          password: result.data.password,
          options: {
            data: {
              name: result.data.name,
              company: result.data.company ?? null,
            },
          },
        });

        if (authError) {
          setError(authError.message);
          return;
        }

        setSuccess(true);
      } catch {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  if (success) {
    return (
      <Card className="border border-white/10 bg-white/5 text-text-primary backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg text-text-primary">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-text-secondary">
            We sent a verification link to{" "}
            <span className="font-medium text-neon-cyan">{formData.email}</span>.
            Please check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-white/5 bg-transparent">
          <Link
            href="/login"
            className="w-full text-center text-sm text-neon-cyan underline-offset-4 hover:underline"
          >
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border border-white/10 bg-white/5 text-text-primary backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg text-text-primary">
          Create Account
        </CardTitle>
        <CardDescription className="text-text-secondary">
          Register to submit project requests and track progress.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-text-secondary">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange("name")}
              className="border-white/10 bg-white/5 text-text-primary placeholder:text-text-muted"
              disabled={loading}
              required
            />
          </div>
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
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange("password")}
              className="border-white/10 bg-white/5 text-text-primary placeholder:text-text-muted"
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-text-secondary">
              Company{" "}
              <span className="text-text-muted">(optional)</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Your company name"
              autoComplete="organization"
              value={formData.company ?? ""}
              onChange={handleChange("company")}
              className="border-white/10 bg-white/5 text-text-primary placeholder:text-text-muted"
              disabled={loading}
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
            {loading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-neon-cyan underline-offset-4 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
