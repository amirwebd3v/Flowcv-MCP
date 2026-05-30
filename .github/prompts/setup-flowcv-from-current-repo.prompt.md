---
name: Setup FlowCV From Repo
description: Build and validate FlowCV directly from the current repository checkout.
argument-hint: Optional validation scope
agent: agent
---

Follow [project guidance](../copilot-instructions.md).

Set up FlowCV from the current repository:

1. Run `./setup.sh --mcp` to build, link the CLI, and install the Claude skills.
2. Run `flowcv login` to authenticate.
3. In VS Code, use the local [workspace MCP config](../../.vscode/mcp.json) to start the `flowcv` server.
4. Validate the workspace by checking `flowcv status`, then test `flowcv_get_user` and `flowcv_list_resumes`.
5. Summarize the server status, authenticated user, and any remaining manual steps.