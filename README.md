# @pipeworx/mojang

[Mojang/Minecraft](https://wiki.vg/Mojang_API) MCP — keyless lookups for Minecraft profiles.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `username_to_uuid(username)` — current UUID for a username
- `username_to_uuid_at(username, timestamp?)` — UUID at a given epoch second
- `profile(uuid)` — name + textures (skin/cape) payload
- `name_history(uuid)` — historical name changes (legacy endpoint)
- `blocked_servers()` — list of blocked-server SHA1s

## Data source

`https://api.mojang.com`, `https://sessionserver.mojang.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "mojang": {
      "url": "https://gateway.pipeworx.io/mojang/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Mojang data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
