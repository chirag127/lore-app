import type { ChatMessage, LLMProvider } from './provider';
import { loadPrompt, renderTemplate } from '../prompts/loader';

export interface IndexOutput {
  meta: Record<string, unknown>;
  overviewMdx: string;
}

const FENCE_JSON = /^```json\s*([\s\S]*?)```/i;
const FENCE_MDX = /^```mdx\s*([\s\S]*?)```/i;

function extractPair(raw: string): IndexOutput {
  const jsonMatch = raw.match(FENCE_JSON);
  const mdxMatch = raw.match(FENCE_MDX);
  const jsonBody = jsonMatch?.[1];
  const mdxBody = mdxMatch?.[1];
  if (jsonBody === undefined || mdxBody === undefined) {
    throw new Error('generate-index: missing json or mdx fence');
  }
  const meta = JSON.parse(jsonBody.trim()) as Record<string, unknown>;
  const overviewMdx = mdxBody.trim();
  return { meta, overviewMdx };
}

export async function runGenerateIndex(
  llm: LLMProvider,
  args: {
    title: string;
    author: string;
    slug: string;
    research: string;
    knownMeta: string;
  },
): Promise<IndexOutput> {
  const tpl = loadPrompt('generate-index');
  const prompt = renderTemplate(tpl, args);
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content:
        'You are an MDX author for KnowledgeAtlas. Output only the requested fenced blocks.',
    },
    { role: 'user', content: prompt },
  ];
  const r = await llm.chat(messages, { temperature: 0.4, maxTokens: 4096 });
  return extractPair(r.content);
}

function extractMdxBlock(name: string, raw: string): string {
  const m = raw.match(FENCE_MDX);
  const body = m?.[1];
  if (body === undefined) throw new Error(`${name}: missing mdx fence`);
  return body.trim();
}

export async function runGenerateContent(
  llm: LLMProvider,
  args: { title: string; author: string; research: string; overview: string },
): Promise<string> {
  const tpl = loadPrompt('generate-content');
  const prompt = renderTemplate(tpl, args);
  const r = await llm.chat(
    [
      {
        role: 'system',
        content: 'You are an MDX author for KnowledgeAtlas. Output only the requested fenced block.',
      },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.5, maxTokens: 6000 },
  );
  return extractMdxBlock('content', r.content);
}

export async function runGenerateAnalysis(
  llm: LLMProvider,
  args: { title: string; author: string; research: string; content: string },
): Promise<string> {
  const tpl = loadPrompt('generate-analysis');
  const prompt = renderTemplate(tpl, args);
  const r = await llm.chat(
    [
      {
        role: 'system',
        content: 'You are a literary critic writing for KnowledgeAtlas. Output only the fenced block.',
      },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.4, maxTokens: 5000 },
  );
  return extractMdxBlock('analysis', r.content);
}

export async function runGenerateNarration(
  llm: LLMProvider,
  args: { title: string; author: string; content: string; analysis: string },
): Promise<string> {
  const tpl = loadPrompt('generate-narration');
  const prompt = renderTemplate(tpl, args);
  const r = await llm.chat(
    [
      {
        role: 'system',
        content: 'You are a long-form narrator for KnowledgeAtlas. Output only the fenced block.',
      },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.7, maxTokens: 6000 },
  );
  return extractMdxBlock('narration', r.content);
}
