"use client";

import { useState, useCallback } from "react";
import { z } from "zod";
import { useLocale } from "@/contexts/LocaleContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/* ---- Validation schema ---- */

const requestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  serviceType: z.string().min(1, "Service type is required"),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  budgetRange: z.string().optional(),
  phone: z.string().max(30).optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

/* ---- Bilingual labels ---- */

const labels = {
  zh: {
    title: "提交需求",
    subtitle: "告诉我们您的项目需求，我们将在 24 小时内回复。",
    name: "姓名",
    namePlaceholder: "您的姓名",
    email: "邮箱",
    emailPlaceholder: "your@email.com",
    serviceType: "服务类型",
    serviceTypePlaceholder: "请选择服务类型",
    description: "项目描述",
    descriptionPlaceholder: "请详细描述您的项目需求（至少 10 个字符）",
    budgetRange: "预算范围（可选）",
    budgetPlaceholder: "请选择预算范围",
    phone: "联系电话（可选）",
    phonePlaceholder: "您的联系电话",
    submit: "提交需求",
    submitting: "提交中...",
    successTitle: "提交成功！",
    successMessage: "感谢您的信任！我们将在 24 小时内回复您。",
    submitAnother: "提交新需求",
    loginRequired: "请先注册/登录后再提交需求。",
    loginLink: "前往注册",
    serviceOptions: [
      "网站开发",
      "小程序开发",
      "游戏开发",
      "AI 定制",
      "工业软件定制",
      "UI/UX 设计",
      "数据可视化",
      "移动端开发",
    ],
    budgetOptions: [
      "< 5,000 RMB",
      "5,000 - 20,000 RMB",
      "20,000 - 50,000 RMB",
      "> 50,000 RMB",
    ],
  },
  en: {
    title: "Submit a Request",
    subtitle: "Tell us about your project. We will respond within 24 hours.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    serviceType: "Service Type",
    serviceTypePlaceholder: "Select a service type",
    description: "Project Description",
    descriptionPlaceholder: "Describe your project in detail (at least 10 characters)",
    budgetRange: "Budget Range (optional)",
    budgetPlaceholder: "Select a budget range",
    phone: "Phone (optional)",
    phonePlaceholder: "Your phone number",
    submit: "Submit Request",
    submitting: "Submitting...",
    successTitle: "Request Submitted!",
    successMessage: "Thank you! We will respond within 24 hours.",
    submitAnother: "Submit Another",
    loginRequired: "Please register or log in before submitting a request.",
    loginLink: "Go to Register",
    serviceOptions: [
      "Web Development",
      "Mini Programs",
      "Game Development",
      "AI Custom",
      "Industrial Software",
      "UI/UX Design",
      "Data Visualization",
      "Mobile Development",
    ],
    budgetOptions: [
      "< $5,000",
      "$5,000 - $20,000",
      "$20,000 - $50,000",
      "> $50,000",
    ],
  },
} as const;

/* ---- Service slug mapping ---- */

const SERVICE_SLUG_MAP: Record<string, string> = {
  "Web Development": "web-development",
  "Mini Programs": "mini-programs",
  "Game Development": "game-development",
  "AI Custom": "ai-custom",
  "Industrial Software": "industrial-software",
  "UI/UX Design": "ui-ux-design",
  "Data Visualization": "data-visualization",
  "Mobile Development": "mobile-development",
  "\u7f51\u7ad9\u5f00\u53d1": "web-development",
  "\u5c0f\u7a0b\u5e8f\u5f00\u53d1": "mini-programs",
  "\u6e38\u620f\u5f00\u53d1": "game-development",
  "AI \u5b9a\u5236": "ai-custom",
  "\u5de5\u4e1a\u8f6f\u4ef6\u5b9a\u5236": "industrial-software",
  "UI/UX \u8bbe\u8ba1": "ui-ux-design",
  "\u6570\u636e\u53ef\u89c6\u5316": "data-visualization",
  "\u79fb\u52a8\u7aef\u5f00\u53d1": "mobile-development",
};

const SLUG_TO_INDEX: Record<string, number> = {
  "web-development": 0,
  "mini-programs": 1,
  "game-development": 2,
  "ai-custom": 3,
  "industrial-software": 4,
  "ui-ux-design": 5,
  "data-visualization": 6,
  "mobile-development": 7,
};

/* ---- Props ---- */

interface RequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedServiceSlug?: string;
}

/* ---- Component ---- */

export function RequestDialog({
  open,
  onOpenChange,
  preselectedServiceSlug,
}: RequestDialogProps) {
  const { locale } = useLocale();
  const t = labels[locale];

  // Derive initial service selection from slug
  const initialServiceIndex = preselectedServiceSlug
    ? SLUG_TO_INDEX[preselectedServiceSlug] ?? -1
    : -1;
  const initialServiceType =
    initialServiceIndex >= 0 ? t.serviceOptions[initialServiceIndex] : "";

  const [formData, setFormData] = useState<RequestFormData>({
    name: "",
    email: "",
    serviceType: initialServiceType,
    description: "",
    budgetRange: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RequestFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = useCallback(
    (field: keyof RequestFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
      setSubmitError(null);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate
      const result = requestSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Partial<Record<keyof RequestFormData, string>> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof RequestFormData;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        }
        setErrors(fieldErrors);
        return;
      }

      setSubmitting(true);
      setSubmitError(null);

      try {
        // Map service type to a slug for the order title
        const serviceSlug = SERVICE_SLUG_MAP[formData.serviceType] ?? "custom";

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `[${serviceSlug}] ${formData.name} - ${formData.email}`,
            description: [
              formData.description,
              formData.phone ? `Phone: ${formData.phone}` : "",
              formData.budgetRange ? `Budget: ${formData.budgetRange}` : "",
            ]
              .filter(Boolean)
              .join("\n\n"),
            budget_range: formData.budgetRange || undefined,
          }),
        });

        if (response.status === 401) {
          setSubmitError("login_required");
          return;
        }

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message ?? "Failed to submit request");
        }

        setSubmitted(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        setSubmitError(message);
      } finally {
        setSubmitting(false);
      }
    },
    [formData]
  );

  const handleReset = useCallback(() => {
    setFormData({
      name: "",
      email: "",
      serviceType: initialServiceType,
      description: "",
      budgetRange: "",
      phone: "",
    });
    setErrors({});
    setSubmitted(false);
    setSubmitError(null);
  }, [initialServiceType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg bg-[var(--bg-secondary)] border-border-subtle text-text-primary"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-text-primary">
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-text-muted text-sm">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          /* ---- Success state ---- */
          <div className="py-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              {t.successTitle}
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              {t.successMessage}
            </p>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border-strong text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30"
            >
              {t.submitAnother}
            </Button>
          </div>
        ) : (
          /* ---- Form ---- */
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="request-name" className="text-text-secondary text-sm">
                {t.name} <span className="text-[var(--error)]">*</span>
              </Label>
              <Input
                id="request-name"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder={t.namePlaceholder}
                className="bg-white/[0.03] border-border-subtle text-text-primary placeholder:text-text-muted/50 focus-visible:border-neon-cyan/40 focus-visible:ring-neon-cyan/10"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-[var(--error)]">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="request-email" className="text-text-secondary text-sm">
                {t.email} <span className="text-[var(--error)]">*</span>
              </Label>
              <Input
                id="request-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder={t.emailPlaceholder}
                className="bg-white/[0.03] border-border-subtle text-text-primary placeholder:text-text-muted/50 focus-visible:border-neon-cyan/40 focus-visible:ring-neon-cyan/10"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-[var(--error)]">{errors.email}</p>
              )}
            </div>

            {/* Service type - native select for reliability with base-ui */}
            <div className="space-y-1.5">
              <Label htmlFor="request-service" className="text-text-secondary text-sm">
                {t.serviceType} <span className="text-[var(--error)]">*</span>
              </Label>
              <select
                id="request-service"
                value={formData.serviceType}
                onChange={(e) => handleFieldChange("serviceType", e.target.value)}
                className="flex h-8 w-full items-center rounded-lg border border-border-subtle bg-white/[0.03] px-2.5 py-1 text-sm text-text-primary transition-colors outline-none focus-visible:border-neon-cyan/40 focus-visible:ring-3 focus-visible:ring-neon-cyan/10 appearance-none cursor-pointer"
                aria-invalid={!!errors.serviceType}
              >
                <option value="" disabled className="bg-[var(--bg-secondary)] text-text-muted">
                  {t.serviceTypePlaceholder}
                </option>
                {t.serviceOptions.map((option) => (
                  <option key={option} value={option} className="bg-[var(--bg-secondary)] text-text-primary">
                    {option}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="text-xs text-[var(--error)]">{errors.serviceType}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="request-description" className="text-text-secondary text-sm">
                {t.description} <span className="text-[var(--error)]">*</span>
              </Label>
              <Textarea
                id="request-description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder={t.descriptionPlaceholder}
                className="min-h-24 bg-white/[0.03] border-border-subtle text-text-primary placeholder:text-text-muted/50 focus-visible:border-neon-cyan/40 focus-visible:ring-neon-cyan/10"
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-[var(--error)]">{errors.description}</p>
              )}
            </div>

            {/* Budget range - native select */}
            <div className="space-y-1.5">
              <Label htmlFor="request-budget" className="text-text-secondary text-sm">
                {t.budgetRange}
              </Label>
              <select
                id="request-budget"
                value={formData.budgetRange}
                onChange={(e) => handleFieldChange("budgetRange", e.target.value)}
                className="flex h-8 w-full items-center rounded-lg border border-border-subtle bg-white/[0.03] px-2.5 py-1 text-sm text-text-primary transition-colors outline-none focus-visible:border-neon-cyan/40 focus-visible:ring-3 focus-visible:ring-neon-cyan/10 appearance-none cursor-pointer"
              >
                <option value="" className="bg-[var(--bg-secondary)] text-text-muted">
                  {t.budgetPlaceholder}
                </option>
                {t.budgetOptions.map((option) => (
                  <option key={option} value={option} className="bg-[var(--bg-secondary)] text-text-primary">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="request-phone" className="text-text-secondary text-sm">
                {t.phone}
              </Label>
              <Input
                id="request-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder={t.phonePlaceholder}
                className="bg-white/[0.03] border-border-subtle text-text-primary placeholder:text-text-muted/50 focus-visible:border-neon-cyan/40 focus-visible:ring-neon-cyan/10"
              />
            </div>

            {/* Submit error */}
            {submitError && submitError !== "login_required" && (
              <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
                <p className="text-xs text-[var(--error)]">{submitError}</p>
              </div>
            )}

            {/* Login required message */}
            {submitError === "login_required" && (
              <div className="p-3 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/20">
                <p className="text-xs text-[var(--warning)] mb-1">{t.loginRequired}</p>
                <a
                  href="/register"
                  className="text-xs text-neon-cyan hover:underline"
                >
                  {t.loginLink} &rarr;
                </a>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-10 font-display font-bold tracking-wide bg-[var(--neon-cyan)] text-[var(--bg-deep)] hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {submitting ? t.submitting : t.submit}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
