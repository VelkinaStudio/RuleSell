# Delivery Workflow

## Goal

Provide a minimal, repeatable path for validating, pushing, and deploying the current marketplace-first frontend without inventing backend infrastructure that does not exist yet.

## Local Validation

Run these before pushing:

```bash
npm install
npm run ci
```

`npm run ci` covers:

- ESLint
- TypeScript typecheck
- production build

## GitHub CLI

Authenticate GitHub CLI first:

```bash
gh auth login
gh auth setup-git
```

If the repo does not exist yet:

```bash
gh repo create <repo-name> --source=. --private --remote=origin
```

If the repo already exists:

```bash
git remote add origin <repo-url>
```

Push the current branch:

```bash
git push -u origin master
```

## GitHub Actions

The repo includes [`.github/workflows/ci.yml`](/D:/RulesetMarketplace-master/.github/workflows/ci.yml).

It runs on:

- pushes to `main` or `master`
- pull requests targeting `main` or `master`
- manual dispatch

Current scope:

- install dependencies with `npm ci`
- lint
- production build

This is intentionally narrower than full browser QA. Playwright and visual regression still remain future work.

## Vercel CLI

The repo includes the `vercel` CLI as a dev dependency plus npm scripts:

```bash
npm run vercel:login
npm run vercel:link
npm run vercel:pull
npm run vercel:preview
npm run vercel:prod
```

Recommended order:

1. `npm run vercel:login`
2. `npm run vercel:link`
3. `npm run vercel:pull`
4. `npm run vercel:preview`
5. `npm run vercel:prod` only when the current state is intentionally ready for production exposure

## MCP

Use the official Vercel MCP endpoint from an MCP-capable client:

```bash
codex mcp add vercel --url https://mcp.vercel.com
```

This repo does not auto-wire a GitHub MCP server by default. The GitHub path is handled through `gh` plus GitHub Actions because host support and auth shape for GitHub MCP can vary more than the Vercel remote endpoint.

## Current Limits

- No remote GitHub repo is assumed
- No Vercel project is assumed
- No deploy secrets are required for the current CI workflow
- Backend, auth, checkout, payouts, storage, and email are still mock or absent
