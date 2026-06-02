import { Annotation } from '@langchain/langgraph';
import type { ResearchOutput } from './llm/research';

export const BookState = Annotation.Root({
  issueNumber: Annotation<number>(),
  issueBody: Annotation<string>(),
  title: Annotation<string>(),
  author: Annotation<string>(),
  notes: Annotation<string | undefined>(),
  slug: Annotation<string>(),
  knownMeta: Annotation<string>(),

  metadata: Annotation<Record<string, unknown>>(),
  research: Annotation<ResearchOutput | undefined>(),

  overviewMdx: Annotation<string | undefined>(),
  contentMdx: Annotation<string | undefined>(),
  analysisMdx: Annotation<string | undefined>(),
  narrationMdx: Annotation<string | undefined>(),

  files: Annotation<Array<{ path: string; content: string }>>(),
  branch: Annotation<string | undefined>(),
  prUrl: Annotation<string | undefined>(),

  errors: Annotation<string[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
  log: Annotation<string[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
});

export type BookStateType = typeof BookState.State;
