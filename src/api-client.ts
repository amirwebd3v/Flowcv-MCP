/**
 * FlowCV API client. Uses session cookie for authentication.
 * All requests are forwarded to https://app.flowcv.com/api/
 */

import { persistWorkspaceFlowcvCookie } from "./mcp-config.js";

const API_BASE = "https://app.flowcv.com";

let sessionCookie = "";
let authenticated = false;

export function setSessionCookie(cookie: string): void {
  sessionCookie = cookie;
  authenticated = false; // reset — will be verified on next request
}

export function getSessionCookie(): string {
  return sessionCookie;
}

export function isAuthenticated(): boolean {
  return authenticated;
}

/**
 * Update the cookie in memory and persist it to any supported workspace MCP config
 * that already defines a FlowCV env block.
 */
export function updateCookieEverywhere(rawCookieValue: string): { updated: string[]; errors: string[] } {
  setSessionCookie(`flowcvsidapp=${rawCookieValue}`);

  const persisted = persistWorkspaceFlowcvCookie(rawCookieValue);
  return {
    updated: ["in-memory session", ...persisted.updated],
    errors: persisted.errors,
  };
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error: string;
  code: number;
}

const SESSION_EXPIRED_MSG = `SESSION_EXPIRED: Your FlowCV session cookie is missing, invalid, or expired. To fix this:

1. Use the flowcv_update_cookie tool with a fresh cookie value.
2. To get a new cookie: open https://app.flowcv.com in a browser → log in → DevTools (F12) → Application → Cookies → app.flowcv.com → copy the "flowcvsidapp" value (starts with s%3A...).
3. Or use the CLI: run "flowcv login" to open Chrome and extract the cookie automatically.`;

const NO_COOKIE_MSG = `NO_COOKIE: No session cookie is configured. The server started without authentication.

To fix this, use the flowcv_update_cookie tool with your cookie value.
To get a cookie: open https://app.flowcv.com → log in → DevTools (F12) → Application → Cookies → copy the "flowcvsidapp" value.`;

/**
 * Verify authentication by checking init_user endpoint.
 * Returns the user object if authenticated, null if not.
 */
export async function verifyAuth(): Promise<Record<string, unknown> | null> {
  if (!sessionCookie) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/init_user`, {
      headers: { Accept: "application/json", Cookie: sessionCookie },
    });
    const data = (await res.json()) as ApiResponse<{ user: Record<string, unknown> | null }>;
    if (data.success && data.data.user) {
      authenticated = true;
      return data.data.user;
    }
    authenticated = false;
    return null;
  } catch {
    authenticated = false;
    return null;
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
  body?: unknown,
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  // No cookie at all
  if (!sessionCookie) {
    throw new Error(NO_COOKIE_MSG);
  }

  let url = `${API_BASE}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Cookie: sessionCookie,
  };

  const fetchOptions: RequestInit = { method, headers, redirect: "manual" };

  if (body && method !== "GET") {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  // Redirect to login page = expired session
  if (response.status === 302 || response.status === 301) {
    const location = response.headers.get("location") || "";
    if (location.includes("login") || location.includes("signin") || location.includes("auth")) {
      authenticated = false;
      throw new Error(SESSION_EXPIRED_MSG);
    }
  }

  // 401 / 403
  if (response.status === 401 || response.status === 403) {
    authenticated = false;
    throw new Error(SESSION_EXPIRED_MSG);
  }

  let data: ApiResponse<T>;
  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    if (response.headers.get("content-type")?.includes("text/html")) {
      authenticated = false;
      throw new Error(SESSION_EXPIRED_MSG);
    }
    throw new Error(`API returned non-JSON response (status ${response.status})`);
  }

  // FlowCV returns success:true with user:null for unauthenticated init_user calls.
  // For other endpoints it returns success:false with a generic "An error occurred" and code 500.
  // Detect both patterns as auth failures.
  if (data.success) {
    // Check for the init_user "logged out" pattern: success but user is null
    const anyData = data.data as Record<string, unknown> | null;
    if (endpoint.includes("init_user") && anyData && anyData.user === null) {
      authenticated = false;
      throw new Error(SESSION_EXPIRED_MSG);
    }
    authenticated = true;
    return data;
  }

  // success: false
  const errMsg = data.error || "";

  // Detect auth-related failures
  if (
    errMsg.includes("not authenticated") ||
    errMsg.includes("unauthorized") ||
    data.code === 401
  ) {
    authenticated = false;
    throw new Error(SESSION_EXPIRED_MSG);
  }

  // Generic "An error occurred" with code 500 on data endpoints = likely auth issue.
  // Verify by calling init_user.
  if (!authenticated && data.code === 500 && errMsg === "An error occurred") {
    const user = await verifyAuth();
    if (!user) {
      throw new Error(SESSION_EXPIRED_MSG);
    }
    // If we ARE authenticated, it's a real server error — fall through
  }

  throw new Error(errMsg || `API request failed with status ${response.status}`);
}

export async function downloadResumePdf(resumeId: string, previewPageCount = 1): Promise<Uint8Array> {
  if (!sessionCookie) {
    throw new Error(NO_COOKIE_MSG);
  }

  const url = new URL(`${API_BASE}/api/resumes/download`);
  url.searchParams.set("resumeId", resumeId);
  url.searchParams.set("previewPageCount", String(previewPageCount));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      Cookie: sessionCookie,
    },
    redirect: "manual",
  });

  if (response.status === 302 || response.status === 301) {
    const location = response.headers.get("location") || "";
    if (location.includes("login") || location.includes("signin") || location.includes("auth")) {
      authenticated = false;
      throw new Error(SESSION_EXPIRED_MSG);
    }
  }

  if (response.status === 401 || response.status === 403) {
    authenticated = false;
    throw new Error(SESSION_EXPIRED_MSG);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok || contentType.includes("application/json")) {
    let errMsg = `Download failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { error?: string; code?: number };
      errMsg = data.error || errMsg;
      if (data.code === 401) {
        authenticated = false;
        throw new Error(SESSION_EXPIRED_MSG);
      }
    } catch (error) {
      if (error instanceof Error && error.message === SESSION_EXPIRED_MSG) {
        throw error;
      }
      // Keep the fallback error message when JSON parsing fails.
    }
    throw new Error(errMsg);
  }

  authenticated = true;
  return new Uint8Array(await response.arrayBuffer());
}

type ResumeSection = {
  entries?: Record<string, unknown>[];
};

type ResumeRecord = {
  content?: Record<string, ResumeSection>;
};

export async function mergeEntryWithExisting(
  resumeId: string,
  sectionId: string,
  entry: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const entryId = entry.id;

  if (typeof entryId !== "string" || entryId.length === 0) {
    return entry;
  }

  const res = await apiRequest<{ resume: ResumeRecord }>(`/api/resumes/${resumeId}`);
  const existingEntry = res.data.resume.content?.[sectionId]?.entries?.find(
    (candidate) => candidate.id === entryId
  );

  if (!existingEntry) {
    return entry;
  }

  return { ...existingEntry, ...entry, id: entryId };
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return `Error: ${String(error)}`;
}

/**
 * Initialize the session cookie from CLI config (~/.config/flowcv/config.json).
 * Used by the CLI entry point. Does not affect MCP server behavior.
 */
export async function initFromConfig(): Promise<boolean> {
  try {
    const { getCookie } = await import("./cli/config.js");
    const cookie = getCookie();
    if (cookie) {
      setSessionCookie(`flowcvsidapp=${cookie}`);
      return true;
    }
  } catch {
    // CLI config module not available — MCP server context
  }
  return false;
}
