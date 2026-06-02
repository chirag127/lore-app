/* eslint-disable no-console */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export interface McpTool {
  name: string;
  description: string;
  inputSchema: unknown;
}

export class McpClient {
  private client: Client;
  private transport: StdioClientTransport;
  private tools: McpTool[] = [];

  constructor(opts: { command: string; args: string[]; env?: Record<string, string> }) {
    this.client = new Client({ name: 'knowledgeatlas-pipeline', version: '0.1.0' });
    this.transport = new StdioClientTransport({
      command: opts.command,
      args: opts.args,
      env: { ...process.env, ...(opts.env ?? {}) } as Record<string, string>,
    });
  }

  static fromLocalResearchServer(): McpClient {
    const here = dirname(fileURLToPath(import.meta.url));
    const root = resolve(here, '..', '..', '..', 'mcp', 'research');
    return new McpClient({
      command: 'pnpm',
      args: ['--dir', root, 'start'],
    });
  }

  async connect(): Promise<void> {
    await this.client.connect(this.transport);
    const { tools } = await this.client.listTools();
    this.tools = tools as McpTool[];
    console.log(`[mcp] connected, ${this.tools.length} tools available`);
  }

  listTools(): McpTool[] {
    return this.tools;
  }

  async call(name: string, args: Record<string, unknown>): Promise<string> {
    const res = await this.client.callTool({ name, arguments: args });
    const c = (res as { content: Array<{ type: string; text?: string }> }).content;
    return c?.map((x) => x.text ?? '').join('\n') ?? '';
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
