import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

interface FlowcvServerConfig {
  env?: Record<string, string>;
}

interface WorkspaceMcpConfig {
  servers?: Record<string, FlowcvServerConfig>;
  mcpServers?: Record<string, FlowcvServerConfig>;
}

const WORKSPACE_MCP_CONFIG_PATHS = [
  resolve(process.cwd(), ".vscode", "mcp.json"),
  resolve(process.cwd(), ".mcp.json"),
];

function loadWorkspaceMcpConfig(filePath: string): WorkspaceMcpConfig | null {
  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as WorkspaceMcpConfig;
  } catch {
    return null;
  }
}

function getFlowcvCookie(config: WorkspaceMcpConfig): string | null {
  const cookie =
    config.servers?.flowcv?.env?.FLOWCV_SESSION_COOKIE ??
    config.mcpServers?.flowcv?.env?.FLOWCV_SESSION_COOKIE;

  return cookie || null;
}

export function readWorkspaceFlowcvCookie(): string | null {
  for (const filePath of WORKSPACE_MCP_CONFIG_PATHS) {
    const config = loadWorkspaceMcpConfig(filePath);
    if (!config) continue;

    const cookie = getFlowcvCookie(config);
    if (cookie) return cookie;
  }

  return null;
}

export function persistWorkspaceFlowcvCookie(rawCookieValue: string): { updated: string[]; errors: string[] } {
  const updated: string[] = [];
  const errors: string[] = [];

  for (const filePath of WORKSPACE_MCP_CONFIG_PATHS) {
    const config = loadWorkspaceMcpConfig(filePath);
    if (!config) continue;

    let changed = false;

    if (config.servers?.flowcv?.env) {
      config.servers.flowcv.env.FLOWCV_SESSION_COOKIE = rawCookieValue;
      changed = true;
    }

    if (config.mcpServers?.flowcv?.env) {
      config.mcpServers.flowcv.env.FLOWCV_SESSION_COOKIE = rawCookieValue;
      changed = true;
    }

    if (!changed) continue;

    try {
      writeFileSync(filePath, JSON.stringify(config, null, 2) + "\n", { mode: 0o600 });
      updated.push(filePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${filePath}: ${message}`);
    }
  }

  return { updated, errors };
}