/**
 * Shared test helpers for integration tests.
 * Tests run against the live dev server at BASE_URL.
 */

export const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

/* ── Cookie jar (session management) ────────────────── */

type CookieJar = Record<string, string>;

function parseCookies(headers: Headers, jar: CookieJar): CookieJar {
  const setCookies = headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    const [pair] = cookie.split(";");
    const [name, ...rest] = pair.split("=");
    jar[name.trim()] = rest.join("=").trim();
  }
  return jar;
}

function cookieHeader(jar: CookieJar): string {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

/* ── Auth helper ────────────────────────────────────── */

export interface AuthSession {
  cookies: CookieJar;
  fetch: (path: string, init?: RequestInit) => Promise<Response>;
  getJSON: <T = unknown>(path: string) => Promise<{ status: number; body: T }>;
  postJSON: <T = unknown>(path: string, data?: unknown) => Promise<{ status: number; body: T }>;
  patchJSON: <T = unknown>(path: string, data?: unknown) => Promise<{ status: number; body: T }>;
  deleteJSON: <T = unknown>(path: string) => Promise<{ status: number; body: T }>;
  putJSON: <T = unknown>(path: string, data?: unknown) => Promise<{ status: number; body: T }>;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const jar: CookieJar = {};

  // 1. Get CSRF token
  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  parseCookies(csrfRes.headers, jar);
  const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };

  // 2. Submit credentials
  const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieHeader(jar),
    },
    body: new URLSearchParams({ email, password, csrfToken }),
    redirect: "manual",
  });
  parseCookies(loginRes.headers, jar);

  // 3. Follow redirect(s) to capture final session cookie
  if (loginRes.status >= 300 && loginRes.status < 400) {
    const location = loginRes.headers.get("location") || "/";
    const url = location.startsWith("http") ? location : `${BASE_URL}${location}`;
    const followRes = await fetch(url, {
      headers: { Cookie: cookieHeader(jar) },
      redirect: "manual",
    });
    parseCookies(followRes.headers, jar);
  }

  // Build helper functions
  function authFetch(path: string, init?: RequestInit): Promise<Response> {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    return fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Cookie: cookieHeader(jar),
      },
      redirect: "manual",
    });
  }

  async function jsonRequest<T>(method: string, path: string, data?: unknown) {
    const res = await authFetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    const text = await res.text();
    let body: T;
    try {
      body = JSON.parse(text) as T;
    } catch {
      body = text as unknown as T;
    }
    return { status: res.status, body };
  }

  return {
    cookies: jar,
    fetch: authFetch,
    getJSON: <T = unknown>(path: string) => jsonRequest<T>("GET", path),
    postJSON: <T = unknown>(path: string, data?: unknown) => jsonRequest<T>("POST", path, data),
    patchJSON: <T = unknown>(path: string, data?: unknown) => jsonRequest<T>("PATCH", path, data),
    deleteJSON: <T = unknown>(path: string) => jsonRequest<T>("DELETE", path),
    putJSON: <T = unknown>(path: string, data?: unknown) => jsonRequest<T>("PUT", path, data),
  };
}

/* ── Unauthenticated helpers ────────────────────────── */

export async function getJSON<T = unknown>(path: string): Promise<{ status: number; body: T }> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url);
  const text = await res.text();
  let body: T;
  try {
    body = JSON.parse(text) as T;
  } catch {
    body = text as unknown as T;
  }
  return { status: res.status, body };
}

export async function fetchPage(path: string, cookies?: CookieJar): Promise<{ status: number; size: number }> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: cookies ? { Cookie: cookieHeader(cookies) } : {},
    redirect: "manual",
  });
  const text = await res.text();
  return { status: res.status, size: text.length };
}

/* ── Seed account credentials ───────────────────────── */

export const ACCOUNTS = {
  alice: { email: "alice@example.com", password: "password123" },
  bob: { email: "bob@example.com", password: "password123" },
  carol: { email: "carol@example.com", password: "password123" },
  dave: { email: "dave@example.com", password: "password123" },
  admin: { email: "admin@ruleset.ai", password: "password123" },
} as const;
