import { WaterfallProvider } from './llm/waterfall';
import { GitPublisher } from './publishers/gitPublisher';
import { buildGraph } from './graph/buildGraph';
import { slugify } from './util/slug';

export interface RunArgs {
  issueNumber: number;
  issueBody: string;
  title: string;
  author: string;
  notes?: string;
  publish?: boolean;
}

export async function run(args: RunArgs): Promise<{
  branch?: string;
  prUrl?: string;
  files: Array<{ path: string; content: string }>;
}> {
  const llm = WaterfallProvider.fromConfigFile();
  const repo = process.env.GITHUB_REPOSITORY ?? '';
  const token = process.env.GITHUB_TOKEN;
  const cwd = process.cwd();
  const publisher = args.publish
    ? new GitPublisher({ cwd, token, repo, branchPrefix: 'book' })
    : undefined;
  const graph = buildGraph({ llm, publisher, repo });
  const slug = slugify(`${args.title}-${args.author}`);
  const result = await graph.invoke({
    issueNumber: args.issueNumber,
    issueBody: args.issueBody,
    title: args.title,
    author: args.author,
    notes: args.notes,
    slug,
    knownMeta: '{}',
    files: [],
    errors: [],
    log: [],
  });
  return {
    branch: result.branch,
    prUrl: result.prUrl,
    files: result.files,
  };
}
