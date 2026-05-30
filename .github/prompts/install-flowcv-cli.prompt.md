---
name: Install FlowCV CLI
description: Clone, build, authenticate, and smoke-test the FlowCV CLI.
argument-hint: Optional install constraints or target path
agent: agent
---

Follow [project guidance](../copilot-instructions.md).

Install the FlowCV CLI from https://github.com/amirwebd3v/Flowcv-mcp:

1. Clone the repository if it is not already available locally.
2. Run `./setup.sh` to install dependencies, build the project, and link the `flowcv` CLI.
3. Run `flowcv login` to authenticate.
4. Validate the install with `flowcv status` and `flowcv resume list`.
5. Summarize the installed path, auth status, and any blockers.