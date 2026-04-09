/**
 * Vitest global setup — ensures a running Next.js server + seeded DB
 * for integration tests.
 *
 * Behavior:
 *   1. If server is already running at BASE_URL → skip everything
 *   2. Otherwise: verify postgres → migrate → seed → start next dev → wait
 *   3. Teardown: kill server (leaves DB running for faster re-runs)
 *
 * Environment:
 *   TEST_BASE_URL  — override server URL (default: http://localhost:3000)
 *   TEST_SKIP_SETUP — set to "1" to skip all setup (assume infra is ready)
 */

import { execSync, spawn, type ChildProcess } from "child_process";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let serverProcess: ChildProcess | null = null;

async function isUp(url: string, timeout = 3000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res.status < 500;
  } catch {
    return false;
  }
}

async function waitFor(url: string, maxMs = 90_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (await isUp(url)) return;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server at ${url} did not become ready within ${maxMs / 1000}s`);
}

function run(cmd: string, label: string): void {
  console.log(`[test-setup] ${label}...`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "pipe", timeout: 120_000 });
  } catch (err: unknown) {
    const stderr =
      err && typeof err === "object" && "stderr" in err
        ? (err as { stderr: Buffer }).stderr?.toString().slice(0, 200)
        : "";
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[test-setup] ${label} failed: ${msg}\n${stderr}`);
  }
}

function isPostgresReady(): boolean {
  try {
    execSync("pg_isready -h localhost -p 5432 -U ruleset", {
      cwd: ROOT,
      stdio: "pipe",
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
}

function startPostgres(): void {
  // Try docker compose first, then local systemctl
  const strategies = [
    { cmd: "docker compose up -d db", label: "docker compose" },
    { cmd: "docker-compose up -d db", label: "docker-compose" },
    { cmd: "sudo systemctl start postgresql", label: "systemctl" },
  ];

  for (const { cmd, label } of strategies) {
    try {
      execSync(cmd, { cwd: ROOT, stdio: "pipe", timeout: 30_000 });
      console.log(`[test-setup] Started PostgreSQL via ${label}`);
      return;
    } catch {
      // try next strategy
    }
  }

  throw new Error(
    "[test-setup] Could not start PostgreSQL.\n" +
      "  Options: docker compose up -d db | sudo systemctl start postgresql",
  );
}

async function waitForPostgres(maxMs = 30_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (isPostgresReady()) return;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`PostgreSQL did not become ready within ${maxMs / 1000}s`);
}

function isDbSeeded(): boolean {
  try {
    const result = execSync(
      `psql -h localhost -U ruleset -d ruleset -t -c "SELECT count(*) FROM \\"User\\""`,
      { cwd: ROOT, stdio: "pipe", timeout: 5000, env: { ...process.env, PGPASSWORD: "ruleset_dev" } },
    );
    return parseInt(result.toString().trim(), 10) >= 5;
  } catch {
    return false;
  }
}

export async function setup(): Promise<void> {
  if (process.env.TEST_SKIP_SETUP === "1") {
    console.log("[test-setup] TEST_SKIP_SETUP=1, skipping");
    return;
  }

  // 1. If server is already running, assume everything is ready
  if (await isUp(`${BASE_URL}/api/health`)) {
    console.log(`[test-setup] Server already running at ${BASE_URL}`);
    return;
  }

  console.log("[test-setup] Server not running — starting infrastructure...");

  // 2. Ensure PostgreSQL is running
  if (!isPostgresReady()) {
    startPostgres();
    await waitForPostgres();
  } else {
    console.log("[test-setup] PostgreSQL already running");
  }

  // 3. Push schema + seed (if not already seeded)
  run("npx prisma db push --accept-data-loss", "Pushing schema");

  // 3b. Apply search infrastructure (column + trigger) that lives outside Prisma schema
  try {
    execSync(
      `psql -h localhost -U ruleset -d ruleset -f prisma/migrations/20260402210535_search_setup/migration.sql`,
      { cwd: ROOT, stdio: "pipe", timeout: 10_000, env: { ...process.env, PGPASSWORD: "ruleset_dev" } },
    );
    console.log("[test-setup] Search infrastructure applied");
  } catch {
    console.log("[test-setup] Search infrastructure already present (or psql unavailable)");
  }

  if (!isDbSeeded()) {
    run("npx tsx prisma/seed.ts", "Seeding database");
  } else {
    console.log("[test-setup] Database already seeded (≥5 users)");
  }

  // 4. Start Next.js dev server
  console.log("[test-setup] Starting Next.js dev server...");
  serverProcess = spawn("npx", ["next", "dev", "--port", "3000"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "development" },
    detached: true,
  });

  serverProcess.stdout?.on("data", (chunk: Buffer) => {
    const text = chunk.toString().trim();
    if (text.includes("Ready") || text.includes("started") || text.includes("localhost")) {
      console.log(`[next-dev] ${text}`);
    }
  });

  serverProcess.stderr?.on("data", (chunk: Buffer) => {
    const text = chunk.toString().trim();
    if (text.includes("Error") || text.includes("error")) {
      console.error(`[next-dev] ${text}`);
    }
  });

  serverProcess.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`[test-setup] Next.js exited with code ${code}`);
    }
    serverProcess = null;
  });

  // 5. Wait for server to be ready
  await waitFor(`${BASE_URL}/api/health`);
  console.log(`[test-setup] Server ready at ${BASE_URL}`);
}

export async function teardown(): Promise<void> {
  if (!serverProcess) return;

  console.log("[test-setup] Stopping Next.js server...");
  try {
    if (serverProcess.pid) {
      process.kill(-serverProcess.pid, "SIGTERM");
    }
  } catch {
    try {
      serverProcess.kill("SIGTERM");
    } catch {
      // already dead
    }
  }
  serverProcess = null;

  // Give it a moment to clean up
  await new Promise((r) => setTimeout(r, 1000));
  console.log("[test-setup] Server stopped");
}
