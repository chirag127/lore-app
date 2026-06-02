import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookRequestSchema, type BookRequest } from '@knowledgeatlas/schemas';
import { Button } from '../ui/Button';
import { buildGitHubIssueUrl } from '../../lib/utils';

export function BookRequestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookRequest>({
    resolver: zodResolver(BookRequestSchema),
    defaultValues: { title: '', author: '', notes: '' },
  });
  const [preview, setPreview] = useState<{ url: string; body: string } | null>(null);

  const onSubmit = (data: BookRequest) => {
    const body = [
      '## Book Request',
      '',
      `**Title:** ${data.title}`,
      `**Author:** ${data.author}`,
      data.notes ? `\n**Notes:**\n\n${data.notes}\n` : '',
      '\n---\n',
      '_Submitted via the KnowledgeAtlas request form. The pipeline will pick this up automatically._\n',
    ].join('\n');
    const url = buildGitHubIssueUrl({
      repo: import.meta.env.PUBLIC_GH_REPO,
      title: `Add Book: ${data.title} — ${data.author}`,
      body,
      labels: ['book-request'],
    });
    setPreview({ url, body });
  };

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="grain-card grain-overlay p-5">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-mute mb-2">
            Ready to submit
          </p>
          <p className="text-sm text-ink-soft">
            Click below to open a pre-filled GitHub Issue. Sign in to GitHub,
            review the body, and submit. The pipeline will pick it up
            automatically.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a href={preview.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 h-10 px-4 bg-terracotta-400 text-parchment-50 hover:bg-terracotta-500 rounded-sm font-medium text-sm">
              Open GitHub Issue ↗
            </a>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setPreview(null);
                reset();
              }}
            >
              Edit request
            </Button>
          </div>
        </div>
        <pre className="grain-card grain-overlay p-4 text-xs whitespace-pre-wrap font-mono text-ink-soft max-h-96 overflow-y-auto">
{preview.body}
        </pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grain-card grain-overlay p-5 space-y-4">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-mute">
        New request
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">Title</span>
          <input
            {...register('title')}
            placeholder="Atomic Habits"
            className="mt-1 w-full h-10 px-3 bg-paper-soft border border-rule rounded-sm text-sm focus:border-terracotta-400 outline-none"
          />
          {errors.title && <p className="mt-1 text-xs text-terracotta-500">{errors.title.message}</p>}
        </label>
        <label className="block">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">Author</span>
          <input
            {...register('author')}
            placeholder="James Clear"
            className="mt-1 w-full h-10 px-3 bg-paper-soft border border-rule rounded-sm text-sm focus:border-terracotta-400 outline-none"
          />
          {errors.author && <p className="mt-1 text-xs text-terracotta-500">{errors.author.message}</p>}
        </label>
      </div>
      <label className="block">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">Why this book? (optional)</span>
        <textarea
          {...register('notes')}
          rows={4}
          placeholder="Anything that helps the research step find the best material."
          className="mt-1 w-full bg-paper-soft border border-rule rounded-sm p-3 text-sm focus:border-terracotta-400 outline-none resize-y"
        />
      </label>
      <Button type="submit" size="md" loading={isSubmitting}>
        Continue to GitHub
      </Button>
    </form>
  );
}
