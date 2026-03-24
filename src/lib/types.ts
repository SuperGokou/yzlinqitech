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
