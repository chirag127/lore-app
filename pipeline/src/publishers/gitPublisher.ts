import { simpleGit, type SimpleGit } from 'simple-git';

export interface PublishResult {
  branch: string;
  commit: string;
  prUrl?: string;
}

export class GitPublisher {
  private git: SimpleGit;
  private cwd: string;
  private branchPrefix: string;
  private token?: string;
  private repo: string;

  constructor(opts: {
    cwd: string;
    branchPrefix?: string;
    token?: string;
    repo?: string;
  }) {
    this.cwd = opts.cwd;
    this.branchPrefix = opts.branchPrefix ?? 'book';
    this.token = opts.token;
    this.repo = opts.repo ?? '';
    this.git = simpleGit({ baseDir: this.cwd });
  }

  async publishFiles(opts: {
    slug: string;
    files: Array<{ path: string; content: string }>;
    commitMessage: string;
    prTitle: string;
    prBody: string;
  }): Promise<PublishResult> {
    await this.git.checkout('main').catch(() => undefined);
    await this.git.pull('origin', 'main').catch(() => undefined);

    const branch = `${this.branchPrefix}/${opts.slug}-${Date.now().toString(36)}`;
    await this.git.checkoutLocalBranch(branch);

    for (const f of opts.files) {
      await this.writeFile(f.path, f.content);
    }
    await this.git.add(opts.files.map((f) => f.path));
    const sha = (await this.git.commit(opts.commitMessage)).commit;

    if (this.token && this.repo) {
      await this.git.push('origin', branch, {
        '--set-upstream': null,
      }).catch(async () => {
        await this.git.env('GITHUB_TOKEN', this.token!);
        const remote = `https://x-access-token:${this.token}@github.com/${this.repo}.git`;
        await this.git.addRemote('origin', remote).catch(() => undefined);
        await this.git.push('origin', branch, { '--set-upstream': null });
      });
    }

    const prUrl = this.token
      ? await this.openPR(opts.prTitle, opts.prBody, branch)
      : undefined;
    return { branch, commit: sha, prUrl };
  }

  private async writeFile(path: string, content: string) {
    const fs = await import('node:fs/promises');
    const path2 = await import('node:path');
    const full = path2.resolve(this.cwd, path);
    await fs.mkdir(path2.dirname(full), { recursive: true });
    await fs.writeFile(full, content, 'utf8');
  }

  private async openPR(title: string, body: string, branch: string): Promise<string | undefined> {
    if (!this.token || !this.repo) return undefined;
    const [owner, repo] = this.repo.split('/');
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'KnowledgeAtlas-Pipeline',
      },
      body: JSON.stringify({
        title,
        body,
        head: branch,
        base: 'main',
        labels: ['book', 'pipeline'],
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`PR open failed (${res.status}): ${t.slice(0, 300)}`);
    }
    const data = (await res.json()) as { html_url: string };
    return data.html_url;
  }
}
