declare module 'mermaid' {
  const mermaid: {
    initialize: (config: {
      startOnLoad?: boolean;
      theme?: 'default' | 'dark' | 'neutral' | 'forest' | 'base';
      securityLevel?: 'strict' | 'loose' | 'antiscript' | 'sandbox';
      fontFamily?: string;
    }) => void;
    render: (id: string, src: string) => Promise<{ svg: string }>;
    run: (opts?: { nodes?: HTMLElement[] }) => Promise<void>;
  };
  export default mermaid;
}
