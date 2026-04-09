import type { Discussion, DiscussionCategory, DiscussionReply } from "@/types";
import { MOCK_USERS_BY_USERNAME } from "./mock-users";

function a(u: string) {
  const x = MOCK_USERS_BY_USERNAME[u];
  if (x) return { username: x.username, avatar: x.avatar, reputation: x.reputation, creatorMarks: x.creatorMarks, level: x.level };
  return { username: u, avatar: null, reputation: 10, creatorMarks: [] as never[], level: "MEMBER" as const };
}

const REF = new Date("2026-04-08T12:00:00Z").getTime();
function ts(daysAgo: number) { return new Date(REF - daysAgo * 86_400_000).toISOString(); }

function r(id: string, u: string, body: string, reactions: number, isAnswer: boolean, daysAgo: number): DiscussionReply {
  return { id, author: a(u), body, reactions, isAnswer, createdAt: ts(daysAgo) };
}

function d(
  id: string, rulesetId: string, title: string, cat: DiscussionCategory,
  u: string, body: string, replyCount: number, reactionCount: number,
  isPinned: boolean, daysAgo: number, replies: DiscussionReply[],
): Discussion {
  return { id, rulesetId, title, category: cat, author: a(u), body, replyCount, reactionCount, isPinned, createdAt: ts(daysAgo), replies };
}

export const MOCK_DISCUSSIONS: Discussion[] = [
  d("disc-1","rs-1","Best practices for composing multiple rulesets?","qa","alex-rivera","I have three .cursorrules files. What is the recommended way to layer them?",3,12,true,2,[
    r("r-1-1","yuki-tomoda","Cursor reads .cursorrules from project root. Concatenate with section headers.",8,true,1),
    r("r-1-2","priya-menon","There is an open feature request for multi-file support.",3,false,1),
    r("r-1-3","alex-rivera","Thanks both.",1,false,0),
  ]),
  d("disc-2","rs-1","Python rulesets feel stale","bugs","marc-beaulieu","The Python/Django subset references Django 4.x. Django 5.2 changed several idioms.",2,6,false,5,[
    r("r-2-1","PatrickJS","PR welcome. I will review same-day.",4,false,4),
    r("r-2-2","marc-beaulieu","Will send a PR this weekend.",2,false,3),
  ]),
  d("disc-3","rs-1","My Cursor setup for large monorepos","tips","noa-bar-lev","I keep a base .cursorrules at the repo root and override per-package via symlinks.",1,18,false,8,[
    r("r-3-1","daniel-ohta","Clever. Does Cursor follow symlinks reliably?",2,false,7),
  ]),
  d("disc-4","rs-6","Best practices for MCP server caching","qa","helena-costa","The filesystem MCP server re-reads on every tool call. Has anyone added a read-through cache?",4,22,true,3,[
    r("r-4-1","yuki-tomoda","We cache with a 30s TTL. Reduces token usage by 40%.",14,true,2),
    r("r-4-2","samuel-adeyemi","Be careful with stale reads.",8,false,2),
    r("r-4-3","helena-costa","Invalidate on fswatch events then?",3,false,1),
    r("r-4-4","yuki-tomoda","Exactly. fswatch + invalidate on change.",6,false,1),
  ]),
  d("disc-5","rs-6","Postgres MCP fails on large result sets","bugs","ravi-prasad","Queries returning >1000 rows cause the MCP server to OOM.",2,8,false,6,[
    r("r-5-1","anthropic-skills","Known issue. Fix in v1.3.0 with cursor pagination. ETA this week.",12,true,5),
    r("r-5-2","ravi-prasad","Great, will watch the release.",1,false,4),
  ]),
  d("disc-6","rs-7","Screenshot quality tips","tips","claire-dubois","Default screenshots are 1280x720. Pass {width: 1920, height: 1080, deviceScaleFactor: 2} for retina.",2,15,false,4,[
    r("r-6-1","finn-oconnor","This should be in the README.",6,false,3),
    r("r-6-2","claire-dubois","Opened a PR to add it.",3,false,2),
  ]),
  d("disc-7","rs-8","Using GitHub MCP for automated PR reviews","showcase","samuel-adeyemi","I have Claude reading and commenting on PRs across 3 repos.",3,24,false,7,[
    r("r-7-1","yuki-tomoda","What prompts do you use?",5,false,6),
    r("r-7-2","samuel-adeyemi","Will write up a full guide.",8,false,5),
    r("r-7-3","claire-dubois","Looking forward to this.",2,false,4),
  ]),
  d("disc-8","rs-10","Webhook trigger best practices","qa","emeka-chukwu","What is the recommended way to secure webhook triggers in n8n?",2,9,false,10,[
    r("r-8-1","helena-costa","Use HMAC signature verification.",7,true,9),
    r("r-8-2","emeka-chukwu","Perfect. Did not know about the HMAC option.",2,false,8),
  ]),
  d("disc-9","rs-13","Which prompts still work with GPT-5.4?","qa","alex-rivera","Some prompts were written for GPT-3.5. Has anyone tested with the latest?",4,16,false,12,[
    r("r-9-1","priya-menon","Most work but Act as X is less effective with GPT-5.",10,true,11),
    r("r-9-2","marc-beaulieu","I rewrote 20 for GPT-5. Will submit as a PR.",8,false,10),
    r("r-9-3","alex-rivera","Would love to see those.",3,false,9),
    r("r-9-4","marc-beaulieu","PR submitted: #47.",4,false,7),
  ]),
  d("disc-10","rs-15","Structured prompts vs free-form","tips","yuki-tomoda","Structured for complex tasks, free-form for creative work.",5,32,true,14,[
    r("r-10-1","claire-dubois","Structured prompts are easier to debug.",12,false,13),
    r("r-10-2","samuel-adeyemi","XML tags are underrated.",9,false,12),
    r("r-10-3","priya-menon","For code generation, always structured.",6,false,11),
    r("r-10-4","ravi-prasad","What about chain-of-thought?",4,false,10),
    r("r-10-5","yuki-tomoda","CoT is structured. Good point.",8,false,9),
  ]),
  d("disc-11","rs-2","Devin-style rules + Cursor Composer = magic","showcase","finn-oconnor","The AI now plans before coding and catches its own mistakes.",1,14,false,3,[
    r("r-11-1","grapeot","Exactly the use case I designed for.",6,false,2),
  ]),
  d("disc-12","rs-3","RIPER modes in team settings","feature_request","lukas-weber","Enforce specific RIPER modes per branch.",3,11,false,9,[
    r("r-12-1","NeekChaw","Would need branch-aware config. Filed as an issue.",5,false,8),
    r("r-12-2","lukas-weber","Could also work with git hooks.",3,false,7),
    r("r-12-3","daniel-ohta","Hacky but effective.",2,false,6),
  ]),
  d("disc-13","rs-5","Rate limiting tips for Context7","tips","ravi-prasad","Debounce to 500ms to avoid burning API quota.",2,7,false,5,[
    r("r-13-1","helena-costa","Cache responses by query hash.",5,false,4),
    r("r-13-2","ravi-prasad","localStorage cache with 1h TTL.",3,false,3),
  ]),
  d("disc-14","rs-4","TDD skill + Claude Code full workflow","showcase","priya-menon","TDD skill triggers on every feature branch. Claude writes failing tests first.",4,28,false,6,[
    r("r-14-1","anthropic-skills","The intended workflow. Great to see it in practice.",10,false,5),
    r("r-14-2","yuki-tomoda","Does Claude write better code when tests exist first?",6,false,4),
    r("r-14-3","priya-menon","Significantly. Tests constrain hallucination.",12,false,3),
    r("r-14-4","samuel-adeyemi","Just adopted this. Game changer.",4,false,2),
  ]),
  d("disc-15","rs-9","Figma frame structure matters","tips","claire-dubois","Name frames semantically and AI context improves dramatically.",1,8,false,11,[
    r("r-15-1","noa-bar-lev","Use auto-layout too. MCP extracts spacing from it.",5,false,10),
  ]),
  d("disc-16","rs-11","Windsurf rules for monorepo TypeScript","qa","daniel-ohta","Anyone have rules for NX/Turborepo monorepos?",2,5,false,8,[
    r("r-16-1","windsurf-collective","Monorepo variant ETA 2 weeks.",4,false,7),
    r("r-16-2","daniel-ohta","Will wait for that.",1,false,6),
  ]),
  d("disc-17","rs-20","CrewAI vs LangGraph for multi-agent","qa","emeka-chukwu","When should I use CrewAI vs LangGraph?",3,14,false,15,[
    r("r-17-1","ravi-prasad","CrewAI for role-based crews. LangGraph for graph workflows.",10,true,14),
    r("r-17-2","marc-beaulieu","LangGraph harder but more flexible. Start with CrewAI.",6,false,13),
    r("r-17-3","emeka-chukwu","Starting with CrewAI.",2,false,12),
  ]),
  d("disc-18","rs-25","Enterprise Cursor Rules worth the price?","qa","alex-rivera","At $29 what do you get over the free set?",4,18,false,4,[
    r("r-18-1","windsurf-collective","Compliance rules, CI integration, team enforcement.",12,false,3),
    r("r-18-2","claire-dubois","If regulated industry, saves a week.",8,false,2),
    r("r-18-3","alex-rivera","Worth it for our team then.",3,false,1),
    r("r-18-4","samuel-adeyemi","SOC2 rules alone are gold.",5,false,1),
  ]),
  d("disc-19","rs-6","Semantic search over local files","feature_request","marc-beaulieu","Embedding-based file search rather than just grep.",6,22,false,1,[
    r("r-19-1","anthropic-skills","On the roadmap for v2.0.",14,false,0),
    r("r-19-2","helena-costa","Chain filesystem MCP with a separate embedding server.",6,false,0),
  ]),
  d("disc-20","rs-1","CursorRules for Rust","feature_request","finn-oconnor","I maintain a private Rust .cursorrules. Would anyone use it?",8,34,false,1,[
    r("r-20-1","PatrickJS","Absolutely. Open a PR.",16,false,0),
    r("r-20-2","lukas-weber","Yes please. Rust + Cursor is underserved.",8,false,0),
    r("r-20-3","yuki-tomoda","Include cargo workspace support.",6,false,0),
  ]),
  d("disc-21","rs-8","GitHub Actions MCP integration","tips","ravi-prasad","Trigger CI from Claude Code via the MCP server.",3,19,false,2,[
    r("r-21-1","samuel-adeyemi","Genius. Claude pushes code and triggers its own CI.",8,false,1),
    r("r-21-2","claire-dubois","Does it read CI results back?",3,false,1),
    r("r-21-3","ravi-prasad","Yes via the runs API. Full loop.",6,false,0),
  ]),
  d("disc-22","rs-7","Playwright timeout defaults too aggressive","bugs","lukas-weber","SSR hydration often exceeds the 5s default.",2,6,false,3,[
    r("r-22-1","finn-oconnor","10s default with per-call override would be better.",4,false,2),
    r("r-22-2","claire-dubois","Pass timeout in tool call args as workaround.",3,false,1),
  ]),
  d("disc-23","rs-15","Teaching prompting to junior devs","tips","samuel-adeyemi","I use this guide as onboarding material.",1,12,false,16,[
    r("r-23-1","priya-menon","Same here. Pair with hands-on exercises.",5,false,15),
  ]),
  d("disc-24","rs-10","Error handling in n8n webhook workflows","qa","noa-bar-lev","Best pattern for retrying failed webhook deliveries?",2,7,false,7,[
    r("r-24-1","helena-costa","Error Trigger node with exponential backoff.",6,true,6),
    r("r-24-2","noa-bar-lev","Did not know about Error Trigger. Thanks!",2,false,5),
  ]),
  d("disc-25","rs-4","TDD skill with Vitest","qa","marc-beaulieu","Does it work with Vitest or only Jest?",2,5,false,4,[
    r("r-25-1","anthropic-skills","Works with any test runner. Detects from config.",8,true,3),
    r("r-25-2","marc-beaulieu","Confirmed. Works perfectly.",3,false,2),
  ]),
  d("disc-26","rs-2","Adding memory to Devin-style rules","feature_request","ravi-prasad","Rules do not persist context between sessions.",3,10,false,6,[
    r("r-26-1","grapeot","Would need AI to write a summary at session end.",4,false,5),
    r("r-26-2","priya-menon","Claude Code already has CLAUDE.md for this.",6,false,4),
    r("r-26-3","ravi-prasad","Could the rules reference CLAUDE.md explicitly?",3,false,3),
  ]),
  d("disc-27","rs-9","Figma MCP + design-to-code pipeline","showcase","noa-bar-lev","Full pipeline: Figma MCP to Claude to Tailwind. 80% correct on first pass.",2,26,false,5,[
    r("r-27-1","claire-dubois","What about responsive?",4,false,4),
    r("r-27-2","noa-bar-lev","Partially. Add breakpoint annotations as comments.",3,false,3),
  ]),
  d("disc-28","rs-13","Prompt injection defense","tips","yuki-tomoda","System prompt that detects and refuses injection attempts.",3,20,false,9,[
    r("r-28-1","samuel-adeyemi","Share the diff? Important for production.",8,false,8),
    r("r-28-2","yuki-tomoda","Posted as a gist. Will submit PR.",6,false,7),
    r("r-28-3","claire-dubois","Should be a separate item.",4,false,6),
  ]),
  d("disc-29","rs-5","Context7 + Cursor autocomplete latency","bugs","daniel-ohta","200-400ms added to suggestions. Noticeable on slow connections.",2,8,false,3,[
    r("r-29-1","ravi-prasad","Pre-fetch on file open. Cuts perceived latency.",5,false,2),
    r("r-29-2","daniel-ohta","Good idea. Will try.",2,false,1),
  ]),
  d("disc-30","rs-6","MCP server security best practices","qa","emeka-chukwu","Security considerations for exposing MCP servers?",5,16,false,2,[
    r("r-30-1","anthropic-skills","Restrict read-only paths. Never expose to network. Sandbox with Docker. Audit calls.",18,true,1),
    r("r-30-2","helena-costa","Never point at directories with secrets.",12,false,1),
    r("r-30-3","yuki-tomoda","Run all MCP servers in containers.",8,false,0),
    r("r-30-4","samuel-adeyemi","Great thread. Should be pinned.",4,false,0),
    r("r-30-5","emeka-chukwu","Pinning now.",2,false,0),
  ]),
];

export const MOCK_DISCUSSIONS_BY_RULESET: Record<string, Discussion[]> = {};
for (const disc of MOCK_DISCUSSIONS) {
  (MOCK_DISCUSSIONS_BY_RULESET[disc.rulesetId] ??= []).push(disc);
}
