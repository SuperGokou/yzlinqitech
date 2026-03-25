/**
 * POST /api/chat
 *
 * AI chatbot endpoint using DeepSeek API (OpenAI-compatible) with RAG context.
 * Streams response tokens back to the client via Server-Sent Events (SSE).
 */

import { type NextRequest } from "next/server";
import { searchKnowledge } from "@/lib/rag/search";
import type { ChatRequest, ApiResponse } from "@/lib/types";

export const dynamic = "force-static";

/* ── Constants ──────────────────────────────────────────── */

const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const MAX_MESSAGE_LENGTH = 2000;
const FETCH_TIMEOUT_MS = 30_000;

/* ── Rate limiting (in-memory, per IP) ─────────────────── */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

/* ── Helpers ────────────────────────────────────────────── */

function errorResponse(message: string, status: number): Response {
  const body: ApiResponse = { success: false, message };
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildSystemPrompt(currentPath: string, ragContext: string): string {
  return [
    "你是软件加工厂 AI 助手，软件加工厂的智能客服。",
    "",
    "软件加工厂是一家纯 AI 驱动的软件开发公司，0 员工，客户与 AI 对话即可获得网站、小程序、游戏等数字产品。",
    "",
    "你的性格：专业、友好、略带科技感的幽默。你代表的是「AI 即生产力」的理念。",
    "",
    "你可以帮助：",
    "- 了解软件加工厂的服务（网站开发、小程序、游戏、AI定制）",
    "- 项目咨询和需求分析",
    "- 报价估算（给出大致范围）",
    "- 技术方案建议",
    "- 作品案例介绍",
    "",
    "保持回复简洁（2-3句话，除非用户要求详细说明）。",
    "语气：自信但温暖，技术但易懂。",
    "",
    `用户当前页面：${currentPath}`,
    "",
    "相关知识库内容：",
    ragContext || "（暂无匹配的知识库内容，请根据你对软件加工厂的了解回答）",
  ].join("\n");
}

/**
 * Validate the chat request body. Returns either a validated ChatRequest
 * or a string describing the validation error.
 */
function validateRequest(body: unknown): ChatRequest | string {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }

  const { message, session_id, context } = body as Record<string, unknown>;

  if (typeof message !== "string" || message.trim().length === 0) {
    return "message is required and must be a non-empty string";
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return `message must not exceed ${MAX_MESSAGE_LENGTH} characters`;
  }

  if (session_id !== undefined && typeof session_id !== "string") {
    return "session_id must be a string if provided";
  }

  if (context !== undefined) {
    if (typeof context !== "object" || context === null) {
      return "context must be an object if provided";
    }
    const ctx = context as Record<string, unknown>;
    if (ctx.current_path !== undefined && typeof ctx.current_path !== "string") {
      return "context.current_path must be a string if provided";
    }
  }

  return {
    message: message.trim(),
    session_id: session_id as string | undefined,
    context: context as ChatRequest["context"],
  };
}

/* ── Route Handler ──────────────────────────────────────── */

export async function POST(request: NextRequest): Promise<Response> {
  // 0. Rate limit
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(clientIp)) {
    return errorResponse("Too many requests. Please wait a moment.", 429);
  }

  // 1. Check API key
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return errorResponse(
      "Chat service is not configured. DEEPSEEK_API_KEY is missing.",
      500,
    );
  }

  // 2. Parse & validate request
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON in request body", 400);
  }

  const result = validateRequest(body);
  if (typeof result === "string") {
    return errorResponse(result, 400);
  }
  const chatRequest = result;

  // 3. RAG retrieval
  const relevantChunks = searchKnowledge(chatRequest.message, 3);
  const ragContext = relevantChunks
    .map((chunk) => `[${chunk.category}] ${chunk.content}`)
    .join("\n\n");

  // 4. Build messages
  const currentPath = chatRequest.context?.current_path ?? "/";
  const systemPrompt = buildSystemPrompt(currentPath, ragContext);
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: chatRequest.message },
  ];

  // 5. Call DeepSeek API with streaming
  let deepseekResponse: Response;
  try {
    deepseekResponse = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown network error";
    return errorResponse(`Failed to connect to AI service: ${message}`, 502);
  }

  if (!deepseekResponse.ok) {
    // Log details server-side for diagnostics, return generic message to client
    try {
      const errBody = await deepseekResponse.text();
      console.error("[chat] DeepSeek error", {
        status: deepseekResponse.status,
        detail: errBody.slice(0, 500),
      });
    } catch {
      // ignore parse errors on the error response
    }
    return errorResponse(
      "AI service is temporarily unavailable. Please try again.",
      502,
    );
  }

  if (!deepseekResponse.body) {
    return errorResponse("AI service returned an empty response", 502);
  }

  // 6. Stream SSE to client
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = deepseekResponse.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines from the buffer
          const lines = buffer.split("\n");
          // Keep the last (potentially incomplete) line in the buffer
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length === 0) continue;
            if (!trimmed.startsWith("data: ")) continue;

            const payload = trimmed.slice(6); // strip "data: "

            if (payload === "[DONE]") {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
              );
              continue;
            }

            try {
              const parsed = JSON.parse(payload);
              const token = parsed.choices?.[0]?.delta?.content;
              if (typeof token === "string" && token.length > 0) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ token })}\n\n`,
                  ),
                );
              }
            } catch {
              // Skip malformed chunks - the stream may contain non-JSON lines
            }
          }
        }

        // Flush any remaining buffer content
        if (buffer.trim().length > 0) {
          const trimmed = buffer.trim();
          if (trimmed.startsWith("data: ")) {
            const payload = trimmed.slice(6);
            if (payload === "[DONE]") {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
              );
            }
          }
        }

        // Ensure we always send a done signal
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Stream processing error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: message, done: true })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
