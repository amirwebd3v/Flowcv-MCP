/**
 * Persistent config storage for the FlowCV CLI.
 * Stores session cookie at ~/.config/flowcv/config.json
 */

import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { readWorkspaceFlowcvCookie } from "../mcp-config.js";

export interface FlowCVConfig {
  cookie: string;
  email?: string;
  lastLogin?: string;
}

const CONFIG_DIR = join(homedir(), ".config", "flowcv");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function loadConfig(): FlowCVConfig | null {
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(raw) as FlowCVConfig;
  } catch {
    return null;
  }
}

export function saveConfig(config: FlowCVConfig): void {
  mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n", { mode: 0o600 });
}

export function clearConfig(): void {
  try {
    unlinkSync(CONFIG_FILE);
  } catch {
    // file doesn't exist
  }
}

/**
 * Get the raw cookie value (without "flowcvsidapp=" prefix).
 * Priority: env var > config file > workspace MCP config
 */
export function getCookie(): string | null {
  // 1. Environment variable
  const envCookie = process.env.FLOWCV_SESSION_COOKIE;
  if (envCookie) return envCookie;

  // 2. Config file
  const config = loadConfig();
  if (config?.cookie) return config.cookie;

  // 3. Workspace MCP config (.vscode/mcp.json in VS Code, or legacy .mcp.json)
  const workspaceCookie = readWorkspaceFlowcvCookie();
  if (workspaceCookie) return workspaceCookie;

  return null;
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
