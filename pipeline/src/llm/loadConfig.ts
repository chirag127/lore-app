import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { LLMModelsFileSchema, type LLMModelsFile, type LLMModelConfig } from '@knowledgeatlas/schemas';

const here = dirname(fileURLToPath(import.meta.url));
const candidates = [
  resolve(here, '..', '..', 'models.llm.models.json'),
  resolve(here, '..', 'models.llm.models.json'),
  resolve(process.cwd(), 'models.llm.models.json'),
];

export function loadModelsConfig(): LLMModelsFile {
  let raw: string | null = null;
  let path: string | null = null;
  for (const c of candidates) {
    try {
      raw = readFileSync(c, 'utf8');
      path = c;
      break;
    } catch {
      /* try next */
    }
  }
  if (!raw) {
    throw new Error(
      `models.llm.models.json not found. Looked in:\n${candidates.join('\n')}`,
    );
  }
  const parsed = LLMModelsFileSchema.parse(JSON.parse(raw));
  // eslint-disable-next-line no-console
  console.log(`[llm] loaded ${parsed.models.length} model(s) from ${path}`);
  return parsed;
}

export function getApiKey(cfg: LLMModelConfig): string {
  const v = process.env[cfg.apiKeyEnv];
  if (!v) {
    throw new Error(
      `Missing API key env var "${cfg.apiKeyEnv}" for model "${cfg.id}". ` +
        `Set it as a repo secret / environment variable.`,
    );
  }
  return v;
}
