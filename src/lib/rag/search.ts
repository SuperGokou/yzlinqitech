/**
 * Lightweight keyword-based RAG search.
 * Scores knowledge chunks by keyword overlap with the user query,
 * then returns the top-K most relevant chunks.
 */

import { type KnowledgeChunk, knowledgeBase } from "./knowledge";

/* ── Helpers ────────────────────────────────────────────── */

/**
 * Segment a Chinese/mixed string into individual characters and
 * whitespace-delimited tokens. This is intentionally simple -
 * good enough for keyword matching without a segmentation library.
 */
function tokenize(text: string): string[] {
  const normalized = text.toLowerCase().trim();
  // Split on whitespace, punctuation, and between CJK / latin boundaries
  const raw = normalized.split(/[\s,.:;!?，。：；！？、\-_/\\()（）【】\[\]{}""'']+/);
  const tokens: string[] = [];

  for (const segment of raw) {
    if (segment.length === 0) continue;

    // For segments that contain CJK characters, break into individual chars
    // plus keep the full segment (for multi-char keyword matches)
    const hasCJK = /[\u4e00-\u9fff]/.test(segment);
    if (hasCJK) {
      tokens.push(segment);
      for (const char of segment) {
        if (/[\u4e00-\u9fff]/.test(char)) {
          tokens.push(char);
        }
      }
    } else if (segment.length > 0) {
      tokens.push(segment);
    }
  }

  return Array.from(new Set(tokens));
}

/**
 * Score a knowledge chunk against a set of query tokens.
 * Higher score = more relevant.
 */
function scoreChunk(chunk: KnowledgeChunk, queryTokens: string[]): number {
  let score = 0;
  const contentLower = chunk.content.toLowerCase();
  const keywordsLower = chunk.keywords.map((k) => k.toLowerCase());

  for (const token of queryTokens) {
    // Exact keyword match (highest weight)
    if (keywordsLower.some((kw) => kw === token)) {
      score += 10;
      continue;
    }

    // Partial keyword match (keyword contains the token or vice versa)
    if (keywordsLower.some((kw) => kw.includes(token) || token.includes(kw))) {
      score += 5;
      continue;
    }

    // Content substring match (lowest weight)
    if (contentLower.includes(token)) {
      score += 2;
    }
  }

  return score;
}

/* ── Public API ─────────────────────────────────────────── */

const DEFAULT_TOP_K = 3;
const MIN_SCORE = 2;

/**
 * Search the knowledge base for chunks relevant to the given query.
 * Returns the top-K chunks sorted by relevance score (descending).
 * Chunks with a score below MIN_SCORE are excluded.
 */
export function searchKnowledge(
  query: string,
  topK: number = DEFAULT_TOP_K,
): KnowledgeChunk[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  const scored = knowledgeBase
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryTokens) }))
    .filter((entry) => entry.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map((entry) => entry.chunk);
}
