# Phase 5: Pro & Admin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the analytics dashboard (seller overview, Pro-only detailed analytics), admin panel (user management, content moderation, reports, stats), reports API, trending score cron job, and settings pages.

**Architecture:** Analytics queries aggregate data from existing models. Admin endpoints require ADMIN role guard. Trending cron recalculates scores from RulesetEvent table using weighted formula with 7-day window. Reports allow users to flag content for admin review.

**Tech Stack:** Next.js 16.2.2, TypeScript, Prisma 7, PostgreSQL, NextAuth v5

---

## Phases Overview
- Phase 1-4 (done)
- **Phase 5 (this plan): Pro & Admin**
- Phase 6: Polish & Deploy

## Tasks

1. Analytics API + dashboard page
2. Reports API
3. Admin API endpoints
4. Admin pages (overview, users, rulesets, reports)
5. Trending score cron job script
6. Settings pages (billing placeholder, notification prefs)
7. Final verification
