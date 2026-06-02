import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { cn, formatDuration } from '../../lib/utils';

type Section = { heading: string; text: string };

export function SpeechPlayer({
  source,
  estimatedMinutes,
  estimatedWords,
  onSectionChange,
}: {
  source: string;
  estimatedMinutes: number;
  estimatedWords: number;
  onSectionChange?: (i: number) => void;
}) {
  const sections = useMemo(() => splitIntoSections(source), [source]);
  const totalWords = useMemo(
    () => sections.reduce((s, x) => s + x.text.split(/\s+/).length, 0),
    [sections],
  );
  const totalMinutes = Math.max(1, Math.round(totalWords / 160));

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playIdRef = useRef(0);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [activeSection, setActiveSection] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ttsError, setTtsError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }
    synthRef.current = window.speechSynthesis;
    let cancelled = false;

    const refresh = () => {
      if (cancelled) return;
      const list = synthRef.current?.getVoices() ?? [];
      setVoices(list);
      setVoiceName((prev) => {
        if (prev) return prev;
        if (!list.length) return prev;
        const preferred =
          list.find(
            (v) =>
              /en[-_](GB|US)/i.test(v.lang) &&
              /female|samantha|karen|google|microsoft.*zira|microsoft.*aria/i.test(v.name),
          ) ||
          list.find((v) => /en[-_](GB|US)/i.test(v.lang)) ||
          list[0];
        return preferred?.name ?? prev;
      });
    };
    refresh();

    const synth: SpeechSynthesis = synthRef.current;
    synth.addEventListener?.('voiceschanged', refresh);
    const pollId = window.setInterval(() => {
      const list = synth.getVoices();
      if (list.length !== voices.length) refresh();
    }, 1500);

    return () => {
      cancelled = true;
      synth.removeEventListener?.('voiceschanged', refresh);
      window.clearInterval(pollId);
    };
  }, []);

  const stop = useCallback(() => {
    playIdRef.current++;
    synthRef.current?.cancel();
    setPlaying(false);
    setPaused(false);
    setProgress(0);
    utteranceRef.current = null;
  }, []);

  const playFrom = useCallback(
    (idx: number) => {
      const synth = synthRef.current;
      if (!synth) return;
      setTtsError(null);
      synth.cancel();
      const id = ++playIdRef.current;
      setActiveSection(idx);
      onSectionChange?.(idx);

      const speakSection = (i: number) => {
        if (id !== playIdRef.current) return;
        if (i >= sections.length) {
          setPlaying(false);
          setPaused(false);
          setProgress(100);
          return;
        }
        const sec = sections[i];
        if (!sec || !sec.text.trim()) {
          speakSection(i + 1);
          return;
        }

        const sentences = splitIntoSentences(sec.text);
        let sIdx = 0;

        const speakSentence = () => {
          if (id !== playIdRef.current) return;
          if (sIdx >= sentences.length) {
            speakSection(i + 1);
            return;
          }
          const u = new SpeechSynthesisUtterance(sentences[sIdx]);
          const v = voices.find((x) => x.name === voiceName);
          if (v) u.voice = v;
          u.rate = rate;
          u.pitch = pitch;
          u.onstart = () => {
            if (id !== playIdRef.current) return;
            setActiveSection(i);
            onSectionChange?.(i);
            setTtsError(null);
          };
          u.onend = () => {
            if (id !== playIdRef.current) return;
            sIdx++;
            speakSentence();
          };
          u.onerror = (e) => {
            if (id !== playIdRef.current) return;
            if (e.error === 'canceled' || e.error === 'interrupted') return;
            setTtsError(`Speech engine error: ${e.error || 'unknown'}`);
            sIdx++;
            speakSentence();
          };
          utteranceRef.current = u;
          synth.speak(u);
        };

        speakSentence();
        setPlaying(true);
        setPaused(false);
      };

      speakSection(idx);
    },
    [sections, voiceName, voices, rate, pitch, onSectionChange],
  );

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (!synthRef.current) return;
      const sp = synthRef.current.speaking || synthRef.current.pending;
      setProgress((prev) => (sp ? Math.min(99, prev + 1) : 100));
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => () => stop(), [stop]);

  if (!supported) {
    return (
      <div className="grain-card grain-overlay p-5 text-sm text-ink-soft">
        Your browser doesn't support <code>speechSynthesis</code>. Try a recent
        Chrome, Edge, Safari, or Firefox build.
      </div>
    );
  }

  const hasVoices = voices.length > 0;

  return (
    <div className="grain-card grain-overlay p-5 sm:p-6 space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3 reading-rule">
        <div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-mute">
            Narration
          </p>
          <h2 className="font-display text-display-md font-light leading-tight">
            Listen
          </h2>
        </div>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">
          {formatDuration(totalMinutes)} · {sections.length} sections
        </p>
      </header>

      {!hasVoices && (
        <p className="text-sm text-ink-soft bg-paper-deep border border-rule rounded-sm p-3">
          No speech voices are installed in this browser yet. The controls will
          activate as soon as the operating system finishes indexing its TTS
          voices (Chrome and Edge usually expose them within a second of opening
          this page).
        </p>
      )}
      {ttsError && (
        <p
          role="alert"
          className="text-sm text-terracotta-700 bg-terracotta-50 border border-terracotta-200 rounded-sm p-3"
        >
          {ttsError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!playing ? (
          <Button
            onClick={() => playFrom(activeSection)}
            disabled={!hasVoices}
          >
            ▶ Play from section {activeSection + 1}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              const synth = synthRef.current;
              if (!synth) return;
              if (paused) {
                synth.resume();
                setPaused(false);
              } else {
                synth.pause();
                setPaused(true);
              }
            }}
          >
            {paused ? '▶ Resume' : '❚❚ Pause'}
          </Button>
        )}
        <Button variant="ghost" onClick={stop} disabled={!playing}>
          ■ Stop
        </Button>
        <div className="flex-1 min-w-[120px] h-1 bg-paper-deep rounded-full overflow-hidden">
          <div
            className="h-full bg-terracotta-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <label className="block">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">
            Voice
          </span>
          <select
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            disabled={!hasVoices}
            className="mt-1 w-full h-9 px-2 bg-paper-soft border border-rule rounded-sm text-sm focus:border-terracotta-400 outline-none disabled:opacity-50"
          >
            {hasVoices ? (
              voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))
            ) : (
              <option value="">Loading voices…</option>
            )}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">
            Speed ({rate.toFixed(2)}×)
          </span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-2 w-full accent-terracotta-400"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-mute">
            Pitch ({pitch.toFixed(2)})
          </span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            className="mt-2 w-full accent-terracotta-400"
          />
        </label>
      </div>

      <ol className="space-y-1 max-h-72 overflow-y-auto pr-2">
        {sections.map((s, i) => (
          <li key={i}>
            <button
              onClick={() => playFrom(i)}
              disabled={!hasVoices}
              className={cn(
                'w-full text-left p-3 rounded-sm transition-colors flex items-start gap-3 disabled:opacity-50',
                i === activeSection
                  ? 'bg-terracotta-50/30 border-l-2 border-terracotta-400'
                  : 'hover:bg-paper-deep',
              )}
            >
              <span className="font-mono text-[0.6875rem] text-ink-mute mt-0.5 w-8">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <span className="text-sm">
                <span className="block font-medium">{s.heading}</span>
                <span className="block text-ink-soft line-clamp-2">
                  {s.text.slice(0, 200)}…
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {estimatedWords > 0 && (
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-mute">
          Indexed {estimatedWords.toLocaleString()} source words · estimated
          listening {formatDuration(estimatedMinutes)}
        </p>
      )}
    </div>
  );
}

const SECTION_BREAK = /\n(?=^---\s*$)/gm;
const HEADING_BREAK = /(?=^##\s+)/gm;

function splitIntoSections(md: string): Section[] {
  const stripped = md
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/import\s.+?from\s.+?;?$/gm, '')
    .replace(/<[^>]+>/g, '');

  const rawBlocks = stripped.split(SECTION_BREAK).flatMap((part) => part.split(HEADING_BREAK));
  const sections: Section[] = [];
  for (const b of rawBlocks) {
    const trimmed = b.trim();
    if (!trimmed) continue;
    const lines = trimmed.split('\n');
    const firstLine = lines[0]?.replace(/^#+\s*/, '').trim() ?? '';
    const rest = lines.slice(1).join('\n');
    const heading = firstLine.replace(/^#+\s*/, '').trim();
    const text = rest
      .replace(/^#+\s+.*$/gm, '')
      .replace(/[*_`>#]/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) sections.push({ heading: heading || 'Section', text });
  }
  if (sections.length === 0 && stripped.trim()) {
    sections.push({
      heading: 'Full narration',
      text: stripped.replace(/\s+/g, ' ').trim(),
    });
  }
  return sections;
}

function splitIntoSentences(text: string, maxLen = 220): string[] {
  const matches = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
  const sentences = matches && matches.length ? matches : [text];
  const chunks: string[] = [];
  let buf = '';
  for (const s of sentences) {
    const next = (buf ? buf + ' ' : '') + s.trim();
    if (next.length > maxLen && buf) {
      chunks.push(buf);
      buf = s.trim();
    } else {
      buf = next;
    }
  }
  if (buf) chunks.push(buf);
  return chunks.length ? chunks : [text];
}
