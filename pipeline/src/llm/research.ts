import type { ChatMessage } from './provider';
import type { LLMProvider } from './provider';

export interface ResearchOutput {
  summary: string;
  coreArguments: string[];
  keyTerms: Array<{ term: string; definition: string }>;
  frameworks: Array<{ name: string; description: string; steps: string[] }>;
  critiques: string[];
  counterarguments: string[];
  scientificEvidence: string[];
  communityReception: {
    averageRating: number;
    notablePraise: string[];
    notableCriticism: string[];
  };
  sources: Array<{ title: string; url: string; kind: string }>;
}

export async function runResearch(
  llm: LLMProvider,
  args: { title: string; author: string; notes?: string; knownMeta?: string },
): Promise<ResearchOutput> {
  const prompt = (await import('../prompts/loader.js')).loadPrompt('research');
  const tpl = (await import('../prompts/loader.js')).renderTemplate(prompt, {
    title: args.title,
    author: args.author,
    notes: args.notes ?? '',
    knownMeta: args.knownMeta ?? '{}',
  });
  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a precise research librarian. Output strict JSON.' },
    { role: 'user', content: tpl },
  ];
  const r = await llm.chat(messages, { temperature: 0.2, maxTokens: 4096 });
  const cleaned = r.content
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();
  return JSON.parse(cleaned) as ResearchOutput;
}
