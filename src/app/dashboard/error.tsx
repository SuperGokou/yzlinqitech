"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md border-gray-200 bg-white text-gray-900 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-6 text-red-500" />
          </div>
          <CardTitle className="text-gray-900">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-gray-500">
            An error occurred while loading this page. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={reset}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
