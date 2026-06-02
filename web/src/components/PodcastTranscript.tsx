import type { ReactNode } from 'react';

export interface PodcastTranscriptProps {
  title?: string;
  host?: string;
  guest?: string;
  children?: ReactNode;
}

export function PodcastTranscript({
  title = 'Podcast Transcript',
  host = '',
  guest = '',
  children,
}: PodcastTranscriptProps) {
  return (
    <section className="podcast-transcript" data-host={host} data-guest={guest}>
      <header className="podcast-transcript__header">
        <h2>{title}</h2>
        {host ? <p className="podcast-transcript__host">Host: {host}</p> : null}
        {guest ? <p className="podcast-transcript__guest">Guest: {guest}</p> : null}
      </header>
      <div className="podcast-transcript__body">{children}</div>
    </section>
  );
}

export default PodcastTranscript;
