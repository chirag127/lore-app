import type { ChatMessage, ChatOptions, LLMProvider, ChatResult } from './provider';
import { getApiKey } from './loadConfig';
import type { LLMModelConfig } from '@knowledgeatlas/schemas';

const ABORT_ERR = 'AbortError';
const NETWORK_ERRS = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'ENOTFOUND',
  'FetchError',
]);

export class OpenAICompatAdapter implements LLMProvider {
  readonly id: string;
  private cfg: LLMModelConfig;
  private apiKey: string;

  constructor(cfg: LLMModelConfig) {
    this.cfg = cfg;
    this.id = cfg.id;
    this.apiKey = getApiKey(cfg);
  }

  async chat(
    messages: ChatMessage[],
    opts: ChatOptions = {},
  ): Promise<Omit<ChatResult, 'attempts' | 'totalDurationMs' | 'modelId'>> {
    const timeout = opts.timeoutMs ?? this.cfg.timeoutMs ?? 60_000;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    const start = Date.now();
    try {
      const res = await fetch(`${this.cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          ...this.cfg.headers,
        },
        body: JSON.stringify({
          model: this.cfg.model,
          messages,
          temperature: opts.temperature ?? this.cfg.temperature ?? 0.7,
          max_tokens: opts.maxTokens ?? this.cfg.maxTokens ?? 4096,
          stop: opts.stop,
          stream: false,
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} from ${this.id}: ${body.slice(0, 300)}`);
      }
      const data = (await res.json()) as {
        choices: Array<{ message: { content: string } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const content = data.choices[0]?.message?.content;
      if (!content) throw new Error(`Empty response from ${this.id}`);
      return {
        content,
        inputTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
    } catch (err) {
      const e = err as Error & { name?: string; code?: string; cause?: unknown };
      const transient =
        e.name === ABORT_ERR ||
        (typeof e.code === 'string' && NETWORK_ERRS.has(e.code)) ||
        /timeout|abort|fetch failed|rate limit|429|5\d\d/i.test(e.message);
      const wrapped = new Error(
        `[${this.id}] ${e.message}` + (transient ? ' (transient)' : ''),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (wrapped as any).transient = transient;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (wrapped as any).durationMs = Date.now() - start;
      throw wrapped;
    } finally {
      clearTimeout(t);
    }
  }
}
