# Project Guidelines

- Build after TypeScript changes with `npm run build`; this repo targets Node.js 18+ and ESM output.
- Keep MCP behavior changes aligned across [src/index.ts](../src/index.ts), [src/api-client.ts](../src/api-client.ts), and [src/mcp-config.ts](../src/mcp-config.ts).
- Treat `~/.config/flowcv/config.json`, workspace `.vscode/mcp.json`, and legacy `.mcp.json` as supported auth/config surfaces; avoid adding secrets to tracked workspace files by default.
- Keep setup and onboarding changes consistent across [README.md](../README.md), [SETUP_PROMPT.md](../SETUP_PROMPT.md), and the prompt files in [./prompts](./prompts).
- Keep Copilot skill content in [.github/skills](./skills) aligned with the source FlowCV guidance in [skill](../skill) when tool behavior or setup changes.
- The CLI surface lives under [src/cli](../src/cli); prefer fixing shared auth/config logic once instead of duplicating command-specific workarounds.