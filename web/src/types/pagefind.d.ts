declare module '*/pagefind/pagefind.js' {
  const mod: {
    search: (q: string) => Promise<{
      results: Array<{ id: string; data: () => Promise<Record<string, unknown>> }>;
    }>;
    init?: () => Promise<void>;
  };
  export default mod;
}
