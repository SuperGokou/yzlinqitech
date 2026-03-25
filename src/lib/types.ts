/**
 * Shared TypeScript types for the LingQi Tech platform.
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  context?: {
    current_path?: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type OrderStatus = "pending" | "quoted" | "confirmed" | "in_progress" | "delivered" | "completed" | "cancelled";
export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected";
export type UserRole = "admin" | "client";
