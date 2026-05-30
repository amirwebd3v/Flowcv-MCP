---
name: Install FlowCV MCP
description: Set up the FlowCV MCP server for GitHub Copilot or another local MCP client.
argument-hint: Optional install path or client preference
agent: agent
---

Follow [project guidance](../copilot-instructions.md).

Install the FlowCV MCP server from https://github.com/amirwebd3v/Flowcv-mcp:

1. Clone the repository if needed and run `./setup.sh --mcp`.
2. Run `flowcv login` to authenticate.
3. For VS Code / GitHub Copilot, use the committed [workspace MCP config](../../.vscode/mcp.json) or explain how to add the same server to user `mcp.json`.
4. Start or trust the `flowcv` server if VS Code prompts for confirmation.
5. Test `flowcv_get_user` and `flowcv_list_resumes`.
6. Return the auth result, tool availability, and any follow-up steps.