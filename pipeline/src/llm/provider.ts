export type ChatMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string };

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  timeoutMs?: number;
}

export interface ChatResult {
  content: string;
  modelId: string;
  attempts: Array<{ modelId: string; error: string; durationMs: number }>;
  totalDurationMs: number;
  inputTokens?: number;
  outputTokens?: number;
}

export interface LLMProvider {
  readonly id: string;
  chat(
    messages: ChatMessage[],
    opts?: ChatOptions,
  ): Promise<Omit<ChatResult, 'attempts' | 'totalDurationMs' | 'modelId'>>;
}
