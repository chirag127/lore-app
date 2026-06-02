import { OpenAICompatAdapter } from './openaiCompat';
import { loadModelsConfig } from './loadConfig';
import type { ChatMessage, ChatOptions, ChatResult, LLMProvider } from './provider';

export class WaterfallProvider {
  readonly id = 'waterfall';
  private providers: LLMProvider[];
  private order: string[];

  constructor(providers: LLMProvider[] = []) {
    this.providers = providers;
    this.order = providers.map((p) => p.id);
  }

  static fromConfigFile(): WaterfallProvider {
    const cfg = loadModelsConfig();
    return new WaterfallProvider(cfg.models.map((m) => new OpenAICompatAdapter(m)));
  }

  listOrder(): string[] {
    return [...this.order];
  }

  async chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<ChatResult> {
    const start = Date.now();
    const attempts: ChatResult['attempts'] = [];
    let lastErr: unknown;
    for (const p of this.providers) {
      try {
        const r = await p.chat(messages, opts);
        return {
          content: r.content,
          modelId: p.id,
          attempts,
          totalDurationMs: Date.now() - start,
          inputTokens: r.inputTokens,
          outputTokens: r.outputTokens,
        };
      } catch (e) {
        const err = e as Error & { transient?: boolean; durationMs?: number };
        attempts.push({
          modelId: p.id,
          error: err.message,
          durationMs: err.durationMs ?? 0,
        });
        // Only fall back on transient failures. A bad schema or
        // authentication error means we'll just hit the same wall downstream.
        if (err.transient === false) break;
        lastErr = err;
        // eslint-disable-next-line no-console
        console.warn(
          `[llm] ${p.id} failed (${err.transient ? 'transient' : 'fatal'}), ` +
            `falling back. Error: ${err.message}`,
        );
      }
    }
    throw new Error(
      `All ${this.providers.length} LLM provider(s) failed. Last error: ` +
        ((lastErr as Error | undefined)?.message ?? 'unknown'),
    );
  }
}
