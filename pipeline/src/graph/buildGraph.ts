import { StateGraph, START, END } from '@langchain/langgraph';
import { WaterfallProvider } from '../llm/waterfall';
import { runResearch } from '../llm/research';
import {
  runGenerateIndex,
  runGenerateContent,
  runGenerateAnalysis,
  runGenerateNarration,
} from '../llm/generate';
import { BookState, type BookStateType } from '../state';
import { fetchOpenLibraryMetadata, estimateListeningTime, estimateReadingTime, difficultyFromResearch } from '../sources/openLibrary';
import { GitPublisher } from '../publishers/gitPublisher';
import { validateMeta, validateMdx } from '../validate';

export interface BuildOptions {
  llm: WaterfallProvider;
  publisher?: GitPublisher;
  repo?: string;
}

export function buildGraph(opts: BuildOptions) {
  async function parseIssue(state: BookStateType): Promise<Partial<BookStateType>> {
    const body = state.issueBody || '';
    const lines = body.split(/\r?\n/);
    const get = (key: string) => {
      const re = new RegExp(`\\*\\*${key}:\\*\\*\\s*(.+)`, 'i');
      const m = body.match(re);
      return m?.[1]?.trim();
    };
    const title = get('Title') ?? state.title;
    const author = get('Author') ?? state.author;
    const notes = get('Notes') ?? state.notes ?? '';
    return { title, author, notes };
  }

  async function collectMetadata(state: BookStateType): Promise<Partial<BookStateType>> {
    const m = await fetchOpenLibraryMetadata(state.title, state.author);
    return { metadata: m as unknown as Record<string, unknown> };
  }

  async function research(state: BookStateType): Promise<Partial<BookStateType>> {
    const r = await runResearch(opts.llm, {
      title: state.title,
      author: state.author,
      notes: state.notes,
      knownMeta: JSON.stringify(state.metadata ?? {}),
    });
    return { research: r };
  }

  async function genIndex(state: BookStateType): Promise<Partial<BookStateType>> {
    const out = await runGenerateIndex(opts.llm, {
      title: state.title,
      author: state.author,
      slug: state.slug,
      research: JSON.stringify(state.research ?? {}),
      knownMeta: JSON.stringify(state.metadata ?? {}),
    });
    const meta = {
      ...(state.metadata ?? {}),
      ...out.meta,
      slug: state.slug,
    } as Record<string, unknown>;
    if (out.overviewMdx) {
      const words = out.overviewMdx.split(/\s+/).length;
      meta.readingTimeMinutes = estimateReadingTime(out.overviewMdx);
      meta.listeningTimeMinutes = estimateListeningTime(out.overviewMdx);
      // Pages estimate at ~250 words per page when not available
      if (!meta.pages) meta.pages = Math.max(80, Math.round(words * 4 / 100) * 25);
    }
    if (state.research) {
      meta.difficulty = difficultyFromResearch(state.research);
    }
    meta.addedAt = Math.floor(Date.now() / 1000);
    validateMeta(meta);
    return { metadata: meta, overviewMdx: out.overviewMdx };
  }

  async function genContent(state: BookStateType): Promise<Partial<BookStateType>> {
    const body = await runGenerateContent(opts.llm, {
      title: state.title,
      author: state.author,
      research: JSON.stringify(state.research ?? {}),
      overview: state.overviewMdx ?? '',
    });
    validateMdx('content', body);
    return { contentMdx: body };
  }

  async function genAnalysis(state: BookStateType): Promise<Partial<BookStateType>> {
    const body = await runGenerateAnalysis(opts.llm, {
      title: state.title,
      author: state.author,
      research: JSON.stringify(state.research ?? {}),
      content: state.contentMdx ?? '',
    });
    validateMdx('analysis', body);
    return { analysisMdx: body };
  }

  async function genNarration(state: BookStateType): Promise<Partial<BookStateType>> {
    const body = await runGenerateNarration(opts.llm, {
      title: state.title,
      author: state.author,
      content: state.contentMdx ?? '',
      analysis: state.analysisMdx ?? '',
    });
    validateMdx('narration', body);
    return { narrationMdx: body };
  }

  async function assemble(state: BookStateType): Promise<Partial<BookStateType>> {
    const slug = state.slug;
    const meta = state.metadata;
    if (!meta || !state.overviewMdx || !state.contentMdx || !state.analysisMdx || !state.narrationMdx) {
      throw new Error('assemble: missing artifacts');
    }
    const files = [
      { path: `books/${slug}/meta.json`, content: JSON.stringify(meta, null, 2) + '\n' },
      { path: `books/${slug}/index.mdx`, content: state.overviewMdx + '\n' },
      { path: `books/${slug}/01-content.mdx`, content: state.contentMdx + '\n' },
      { path: `books/${slug}/02-analysis.mdx`, content: state.analysisMdx + '\n' },
      { path: `books/${slug}/03-narration.mdx`, content: state.narrationMdx + '\n' },
    ];
    return { files };
  }

  async function publish(state: BookStateType): Promise<Partial<BookStateType>> {
    if (!opts.publisher || !state.files) {
      return { branch: undefined, prUrl: undefined };
    }
    const result = await opts.publisher.publishFiles({
      slug: state.slug,
      files: state.files,
      commitMessage: `book: add ${state.title} — ${state.author}`,
      prTitle: `Book: ${state.title} — ${state.author}`,
      prBody: [
        '## Generated by KnowledgeAtlas pipeline',
        '',
        `- Title: ${state.title}`,
        `- Author: ${state.author}`,
        `- Slug: \`${state.slug}\``,
        '',
        'Artifacts:',
        '- `meta.json` — frontmatter',
        '- `index.mdx` — overview',
        '- `01-content.mdx` — content',
        '- `02-analysis.mdx` — analysis',
        '- `03-narration.mdx` — narration',
        '',
        'After merge, the deploy workflow will publish the book.',
      ].join('\n'),
    });
    return { branch: result.branch, prUrl: result.prUrl };
  }

  const g = new StateGraph(BookState)
    .addNode('parseIssue', parseIssue)
    .addNode('collectMetadata', collectMetadata)
    .addNode('research', research)
    .addNode('genIndex', genIndex)
    .addNode('genContent', genContent)
    .addNode('genAnalysis', genAnalysis)
    .addNode('genNarration', genNarration)
    .addNode('assemble', assemble)
    .addNode('publish', publish)
    .addEdge(START, 'parseIssue')
    .addEdge('parseIssue', 'collectMetadata')
    .addEdge('collectMetadata', 'research')
    .addEdge('research', 'genIndex')
    .addEdge('genIndex', 'genContent')
    .addEdge('genContent', 'genAnalysis')
    .addEdge('genAnalysis', 'genNarration')
    .addEdge('genNarration', 'assemble')
    .addEdge('assemble', 'publish')
    .addEdge('publish', END);

  return g.compile();
}
