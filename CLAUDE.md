# WatchTower — Project Guidance

## Installed skills — when to use them

These skills live in `.agents/skills/` (symlinked into Claude Code). Invoke a skill
with the `Skill` tool when a task matches its description below, or when the user asks
for it by name / slash command. They also auto-register by their own `SKILL.md`
descriptions, so treat this list as a reinforcement, not the only trigger.

| Skill | Reach for it when… | Manual trigger |
|---|---|---|
| **ui-ux-pro-max** | Designing, building, or reviewing any UI — pages, components, color schemes, typography, layout, accessibility, animation, data-viz. Local DB of styles, palettes, font pairings, GSAP/motion presets, chart types across many stacks. | "design this", "make it look good" |
| **web-artifacts-builder** | Building an elaborate multi-component claude.ai HTML artifact needing state, routing, or shadcn/ui. Not for simple single-file artifacts. | — |
| **improve-codebase-architecture** | Scanning the codebase for structural/"deepening" improvements and producing a visual HTML report to work through. | "improve architecture", `/improve-codebase-architecture` |
| **overkill** | The user wants the maximalist / frontier / future-proofed take — advanced data structures, distributed-systems algorithms, niche frameworks. NOT a pragmatic recommendation engine; skip it when they want the simplest sufficient answer. | "overkill", "make it enterprise", `/overkill` |
| **deep-research** | Autonomous multi-step external research (market analysis, competitive landscaping, literature review, due diligence). Uses Gemini Deep Research; takes minutes and **costs ~$2–5 per run** — confirm with the user before invoking. | "deep research on…" |
| **file-organizer** | Organizing files/folders by context, finding duplicates, suggesting structures, cleanup. | "organize my files" |
| **caveman** | Token-efficient output. Compresses responses ~65% by writing in terse "caveman" style while keeping full technical accuracy. Levels: lite / full / ultra. | "caveman mode", "be brief", `/caveman` |
| **find-skills** | The user wants a capability that might exist as an installable skill ("is there a skill for X", "find a skill that…"). Searches the skills.sh registry via `npx skills find`. | — |

**Security note:** `ui-ux-pro-max` and `overkill`/`deep-research` scored **Med–High** on the
`skills` CLI generative-risk check at install time (Socket: 0 alerts; Snyk: Low–Med). They run
with full agent permissions like any skill — review their `SKILL.md` before relying on them for
anything sensitive.

**Managing skills:** update with `npx skills update`; check for updates with `npx skills check`;
add more with `npx skills add <owner/repo@skill>`.
