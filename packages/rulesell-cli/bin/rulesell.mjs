#!/usr/bin/env node

import https from "node:https";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.RULESELL_URL || "https://rulesell.com";
const VERSION = "0.1.0";

// ── HTTP helper ──────────────────────────────────────────────────────
function fetchJSON(urlStr) {
  const mod = urlStr.startsWith("https") ? https : http;
  return new Promise((resolve, reject) => {
    mod.get(urlStr, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJSON(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${urlStr}`));
      }
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try { resolve(JSON.parse(body)); }
        catch { reject(new Error("Invalid JSON from " + urlStr)); }
      });
    }).on("error", reject);
  });
}

// ── Detect local AI tool ─────────────────────────────────────────────
function detectTool(cwd) {
  const checks = [
    { files: [".cursorrules"], dirs: [".cursor"], name: "Cursor", key: "cursor" },
    { files: ["CLAUDE.md"], dirs: [".claude"], name: "Claude Code", key: "claude-code" },
    { files: [".windsurfrules"], dirs: [], name: "Windsurf", key: "windsurf" },
  ];
  for (const c of checks) {
    for (const f of c.files) {
      if (fs.existsSync(path.join(cwd, f))) return { ...c, match: f };
    }
    for (const d of c.dirs) {
      if (fs.existsSync(path.join(cwd, d))) return { ...c, match: d + "/" };
    }
  }
  return null;
}

// ── Formatting helpers ───────────────────────────────────────────────
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

function priceLabel(p) { return p > 0 ? yellow(`$${p}`) : green("Free"); }

// ── Commands ─────────────────────────────────────────────────────────
async function cmdList() {
  const idx = await fetchJSON(`${BASE}/r/index.json`);
  console.log(`\n  ${bold("RuleSell")} ${dim("— Available products")}\n`);
  for (const item of idx.items) {
    const platforms = dim(item.platforms.join(", "));
    console.log(`  ${cyan(item.name)} — ${item.title} (${priceLabel(item.price)}) [${platforms}]`);
  }
  console.log(`\n  Install: ${dim("npx rulesell install <slug>")}\n`);
}

async function cmdSearch(query) {
  if (!query) { console.error("  Usage: rulesell search <query>"); process.exit(1); }
  const idx = await fetchJSON(`${BASE}/r/index.json`);
  const q = query.toLowerCase();
  const hits = idx.items.filter((i) =>
    i.name.includes(q) || i.title.toLowerCase().includes(q) ||
    i.description.toLowerCase().includes(q) ||
    i.tags.some((t) => t.includes(q)) ||
    i.category.toLowerCase().includes(q)
  );
  if (!hits.length) { console.log(`\n  No results for "${query}".\n`); return; }
  console.log(`\n  ${bold("Results for")} "${cyan(query)}":\n`);
  hits.forEach((h, i) => {
    console.log(`  ${dim(`${i + 1}.`)} ${cyan(h.name)} — ${h.title} (${priceLabel(h.price)})`);
  });
  console.log(`\n  Install: ${dim("npx rulesell install <slug>")}\n`);
}

async function cmdInfo(slug) {
  if (!slug) { console.error("  Usage: rulesell info <slug>"); process.exit(1); }
  const product = await fetchJSON(`${BASE}/r/${slug}.json`);
  console.log(`\n  ${bold("RuleSell")} ${dim("—")} ${bold(product.title)}\n`);
  console.log(`  Category:    ${product.category}`);
  console.log(`  Platforms:   ${product.platforms.join(", ")}`);
  console.log(`  Author:      ${product.author || "—"}`);
  console.log(`  License:     ${product.license || "—"}`);
  console.log(`  Source:      ${product.source}`);
  console.log(`  Description: ${product.description}`);
  if (product.tags?.length) console.log(`  Tags:        ${dim(product.tags.join(", "))}`);
  console.log(`\n  More info: ${dim(`${BASE}/en/marketplace/${slug}`)}\n`);
}

async function cmdInstall(slug) {
  if (!slug) { console.error("  Usage: rulesell install <slug>"); process.exit(1); }
  const product = await fetchJSON(`${BASE}/r/${slug}.json`);
  const cwd = process.cwd();
  const tool = detectTool(cwd);

  console.log(`\n  ${bold("RuleSell")} ${dim("— Installing:")} ${bold(product.title)}\n`);
  console.log(`  Category:  ${product.category}`);
  console.log(`  Platforms: ${product.platforms.join(", ")}`);
  console.log(`  Source:    ${product.source}`);

  if (tool) {
    console.log(`\n  ${green("Detected:")} ${tool.name} project (${dim(tool.match + " found")})`);
  } else {
    console.log(`\n  ${yellow("No AI tool detected in current directory.")}`);
  }

  // Find best matching install config
  const installKey = tool?.key;
  const install = product.install?.[installKey] || Object.values(product.install || {})[0];

  if (!install) {
    console.log(`\n  No install instructions available.`);
    console.log(`  Visit: ${product.source}\n`);
    return;
  }

  console.log(`\n  ${bold("Install:")}`);

  if (install.type === "clone" && install.url) {
    const dest = install.target || slug;
    console.log(`    git clone ${install.url} ${dest}`);
  } else if (install.type === "config") {
    console.log(`    Target: ${install.target}`);
  } else if (install.type === "fetch") {
    console.log(`    Target: ${install.target}`);
  }

  if (install.note) {
    console.log(`\n  ${dim("Note:")} ${install.note}`);
  }

  if (product.source?.includes("github.com")) {
    console.log(`\n  Browse source: ${dim(product.source)}`);
  }

  console.log(`  More info:     ${dim(`${BASE}/en/marketplace/${slug}`)}\n`);
}

// ── Help ─────────────────────────────────────────────────────────────
function showHelp() {
  console.log(`
  ${bold("rulesell")} v${VERSION} — CLI for RuleSet AI registry

  ${bold("Usage:")}
    rulesell list                 List all available products
    rulesell search <query>       Search the registry
    rulesell info <slug>          Show product details
    rulesell install <slug>       Install instructions for a product

  ${bold("Options:")}
    --help, -h                    Show this help
    --version, -v                 Show version

  ${bold("Environment:")}
    RULESELL_URL                  Override registry URL (default: https://rulesell.com)

  ${bold("Examples:")}
    npx rulesell list
    npx rulesell search mcp
    npx rulesell install awesome-cursorrules
    npx rulesell info playwright-mcp-server

  ${dim("Registry: https://rulesell.com")}
`);
}

// ── Main ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const cmd = args[0];
const arg = args[1];

try {
  if (!cmd || cmd === "--help" || cmd === "-h") { showHelp(); }
  else if (cmd === "--version" || cmd === "-v") { console.log(VERSION); }
  else if (cmd === "list") { await cmdList(); }
  else if (cmd === "search") { await cmdSearch(arg); }
  else if (cmd === "info") { await cmdInfo(arg); }
  else if (cmd === "install") { await cmdInstall(arg); }
  else { console.error(`  Unknown command: ${cmd}\n  Run "rulesell --help" for usage.`); process.exit(1); }
} catch (err) {
  console.error(`\n  ${bold("Error:")} ${err.message}`);
  if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
    console.error(`  Could not reach the registry at ${BASE}`);
    console.error(`  For local dev, set RULESELL_URL=http://localhost:3000`);
  }
  process.exit(1);
}
