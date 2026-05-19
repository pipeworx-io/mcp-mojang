interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Mojang/Minecraft MCP.
 */


const API = 'https://api.mojang.com';
const SESS = 'https://sessionserver.mojang.com';
const UA = 'pipeworx-mcp-mojang/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'username_to_uuid', description: 'Current UUID for username.', inputSchema: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] } },
  { name: 'username_to_uuid_at', description: 'UUID at a given epoch second.', inputSchema: { type: 'object', properties: { username: { type: 'string' }, timestamp: { type: 'number' } }, required: ['username'] } },
  { name: 'profile', description: 'Profile (name + textures).', inputSchema: { type: 'object', properties: { uuid: { type: 'string' } }, required: ['uuid'] } },
  { name: 'name_history', description: 'Historical name changes.', inputSchema: { type: 'object', properties: { uuid: { type: 'string' } }, required: ['uuid'] } },
  { name: 'blocked_servers', description: 'List blocked-server SHA1s.', inputSchema: { type: 'object', properties: {} } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (url: string) => {
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 204) return null;
    if (res.status === 404) throw new Error('Mojang: 404 — not found.');
    if (!res.ok) throw new Error(`Mojang: ${res.status}`);
    const ct = res.headers.get('content-type') ?? '';
    return ct.includes('json') ? res.json() : res.text();
  };
  switch (name) {
    case 'username_to_uuid':
      return get(`${API}/users/profiles/minecraft/${encodeURIComponent(reqStr(args, 'username', '"Notch"'))}`);
    case 'username_to_uuid_at': {
      const u = encodeURIComponent(reqStr(args, 'username', '"Notch"'));
      const ts = args.timestamp;
      return get(`${API}/users/profiles/minecraft/${u}${ts != null ? `?at=${Number(ts)}` : ''}`);
    }
    case 'profile':
      return get(`${SESS}/session/minecraft/profile/${encodeURIComponent(reqStr(args, 'uuid', '"<32-char hex>"'))}`);
    case 'name_history':
      return get(`${API}/user/profiles/${encodeURIComponent(reqStr(args, 'uuid', '"<32-char hex>"'))}/names`);
    case 'blocked_servers':
      return get(`${SESS}/blockedservers`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
