type Props = { text: string };

export default function SsmlScript({ text }: Props) {
  return (
    <pre className="ba-ssml" data-ssml>
      {text}
    </pre>
  );
}
