import { LinkedInSkill } from "../types";

export interface HookFormula {
  id: string;
  name: string;
  pattern: string;
  example: string;
  psychologicalTrigger: string;
}

export const HOOK_FORMULAS_2026: HookFormula[] = [
  {
    id: "contrarian-truth",
    name: "The Contrarian Truth",
    pattern: "Most people think [Common Belief]. After [Proof of Experience], I realized the exact opposite is true.",
    example: "Most founders think hiring 5 SDRs scales outbound. After booking 142 meetings with 1 autonomous agent, the opposite is true.",
    psychologicalTrigger: "Pattern interrupt & curiosity gap",
  },
  {
    id: "exact-number-reveal",
    name: "The Exact Number Reveal",
    pattern: "In [Timeframe], I went from [Metric A] to [Metric B] using only [Method]. Here is the 4-step blueprint:",
    example: "In 28 days, we cut our software bill by $4,200/month by replacing 3 SaaS tools with Mark-LIII. Here is the blueprint:",
    psychologicalTrigger: "Credibility through hyper-specific metrics",
  },
  {
    id: "painful-mistake",
    name: "The $X Mistake",
    pattern: "I wasted [Time/Money] doing [Common Activity] wrong. If I started over from scratch tomorrow, here is what I would do:",
    example: "I wasted 6 months paying $200/month for AI tools that hallucinated. If I started over tomorrow, here is the exact free stack I'd run:",
    psychologicalTrigger: "Loss aversion & empathy",
  },
  {
    id: "one-percent-habit",
    name: "The 1% Daily Protocol",
    pattern: "99% of people do [Inefficient Habit]. The top 1% spend 10 minutes every morning doing this instead:",
    example: "99% of creators write LinkedIn posts inside the editor. The top 1% use a local humanizer audit before hitting publish:",
    psychologicalTrigger: "Status aspiration & exclusivity",
  },
  {
    id: "step-by-step-breakdown",
    name: "The Zero-Fluff Playbook",
    pattern: "How to [Desirable Outcome] in [Timeframe] without [Biggest Pain Point] (Step-by-step breakdown):",
    example: "How to run a 300-agent business operation on your laptop without paying Claude Code subscriptions (Step-by-step):",
    psychologicalTrigger: "Actionability & friction removal",
  },
  {
    id: "hard-lesson",
    name: "The Hard Uncomfortable Truth",
    pattern: "An uncomfortable truth nobody in [Industry] wants to admit publicly:",
    example: "An uncomfortable truth nobody in B2B marketing wants to admit: 90% of LinkedIn comments are lazy AI fluff.",
    psychologicalTrigger: "Raw honesty & peer validation",
  },
  {
    id: "open-secret",
    name: "The Industry Open Secret",
    pattern: "The dirty secret about [Topic] that agencies charge $[Amount] to tell you:",
    example: "The secret about LinkedIn reach that expensive ghostwriters charge $5,000/mo for: dwell time beats early likes.",
    psychologicalTrigger: "Insider access & price anchoring",
  },
  {
    id: "turning-point",
    name: "The 3:00 AM Turning Point",
    pattern: "On [Specific Date], I made a decision that changed [Core Outcome] forever. Here is what happened:",
    example: "On March 12, I deleted 7 paid AI subscriptions and migrated to local Python agents. Here is what happened to our speed:",
    psychologicalTrigger: "Narrative tension & hero's journey",
  },
  {
    id: "before-after-bridge",
    name: "The Before-After Bridge",
    pattern: "6 months ago: [Miserable State]. Today: [Thriving State]. The only variable that changed was [Key Tactic]:",
    example: "6 months ago: 4 hours a day manually replying on LinkedIn. Today: 15 minutes of voice directives to Mark-LIII.",
    psychologicalTrigger: "High contrast transformation",
  },
  {
    id: "stop-doing-this",
    name: "The Immediate Stop Sign",
    pattern: "Stop doing [Common Practice] in 2026. It is killing your [Metric]. Do this instead:",
    example: "Stop putting external links in your initial post body in 2026. It cuts impressions by 45%. Do this instead:",
    psychologicalTrigger: "Urgent warning & risk mitigation",
  },
];

export const LINKEDIN_SKILLS_DATA: LinkedInSkill[] = [
  {
    id: "post-writer",
    name: "Post Writer",
    tagline: "2026 Viral Hook & Dwell-Time Engine",
    purpose: "Drafts viral B2B LinkedIn posts adhering strictly to the 900-1,300 character sweet spot using 20+ tested hook formulas.",
    targetChars: { min: 900, max: 1300 },
    sampleInput: "How our team transitioned from paying for expensive AI coding tools to running 100% free open-source agents on our local machines with voice control.",
    voiceRules: [
      "Target 900-1,300 characters strictly",
      "Cap em dashes at ~1 per 100 words",
      "Capitalize all proper names",
      "No AI buzzwords ('leverage', 'streamline', 'fundamentally')",
      "Concrete numbers over vague adjectives",
    ],
  },
  {
    id: "comment-drafter",
    name: "Comment Drafter",
    tagline: "High-Dwell Thoughtful Engagement",
    purpose: "Generates high-value 200-350 character comments that deliver ONE sharp insight instead of generic praise.",
    targetChars: { min: 200, max: 350 },
    sampleInput: "A post arguing that voice-driven interfaces will completely replace code editors for B2B executives within 2 years.",
    voiceRules: [
      "Keep between 200 and 350 characters",
      "One sharp non-obvious insight",
      "Never say 'Great post' or 'Agree completely'",
      "Cite specific numbers or a field lesson",
    ],
  },
  {
    id: "humanizer",
    name: "Humanizer",
    tagline: "AI Tell Stripper & Voice Naturalizer",
    purpose: "Analyzes drafts, highlights robotic syntax, and rewrites text to pass human voice audits and eliminate AI clichés.",
    sampleInput: "Our revolutionary platform fundamentally leverages the power of autonomous agent swarms to streamline and foster unprecedented business synergy, unlocking new paradigms of growth.",
    voiceRules: [
      "Banned: leverage, fundamentally, streamline, harness, delve, unlock, foster",
      "Cap em dashes at 1 per 100 words",
      "Add rhythm variety (punchy 4-word sentences followed by explanatory flow)",
    ],
  },
  {
    id: "profile-optimizer",
    name: "Profile Optimizer",
    tagline: "Conversion-Focused Headline & About Audit",
    purpose: "Audits headlines (<220 chars) and About sections to maximize ICP profile visit-to-inbound conversion.",
    sampleInput: "Parth | Founder & Technologist building autonomous business agents, AI systems, and open-source voice assistants for founders.",
    voiceRules: [
      "Headlines under 220 characters",
      "Target ICP + Clear Desirable Outcome + Social Proof metric",
      "About hook must win click before 'see more'",
    ],
  },
  {
    id: "content-planner",
    name: "Content Planner",
    tagline: "7-Day Cadence & Format Architecture",
    purpose: "Constructs a strategic 7-day publishing calendar with alternating formats, hook archetypes, and posting windows.",
    sampleInput: "Targeting B2B founders, AI engineers, and agency owners interested in autonomous workflows and open-source efficiency.",
    voiceRules: [
      "7 distinct days with EST posting hours",
      "Rotate between Case Study, Contrarian Truth, Quick Tip, Personal Story, and Tool Teardown",
    ],
  },
  {
    id: "reply-handler",
    name: "Reply Handler",
    tagline: "Comment Thread Flattening & Dialog Acceleration",
    purpose: "Maintains 2-level comment thread flattening, turning early commenters into conversational champions and leads.",
    sampleInput: "Commenter asked: 'Does running 300 agents locally overheat your MacBook or require an M3 Max?'",
    voiceRules: [
      "Under 300 characters per reply",
      "Validate their question first with respect",
      "Give concrete tech specs (e.g. 'RAM usage stays under 1.2GB because agents sleep on idle')",
    ],
  },
  {
    id: "story-bank",
    name: "Story Bank Builder",
    tagline: "Career Turning Point & Metric Vault",
    purpose: "Interviews the user to extract hyper-specific career moments, numbers, failures, and breakthrough lessons.",
    sampleInput: "The time we launched our first agency project with a 72-hour deadline, crashed the server on Friday night, and rebuilt the pipeline by dawn.",
    voiceRules: [
      "Always extract exact dollar amounts, dates, or hours",
      "Isolate the single turning point decision",
      "Produce 3 ready-to-use opening hooks",
    ],
  },
  {
    id: "hook-reverse-engineer",
    name: "Hook Reverse-Engineer",
    tagline: "Viral Anatomy & Template Extractor",
    purpose: "Deconstructs viral LinkedIn posts into psychological triggers, syntax blueprints, and 3 plug-and-play templates.",
    sampleInput: "I fired my $8,000/month SEO agency 90 days ago. Yesterday, our organic search traffic hit an all-time high of 418,000 visitors. Here is the 3-part system we replaced them with:",
    voiceRules: [
      "Identify the exact curiosity gap",
      "Map noun-verb pattern",
      "Generate 3 zero-fluff templates for Parth's niche",
    ],
  },
  {
    id: "content-repurposer",
    name: "Content Repurposer",
    tagline: "Cross-Platform to LinkedIn Native Converter",
    purpose: "Converts Twitter/X threads, YouTube video transcripts, and blogs into high-performing native LinkedIn posts.",
    sampleInput: "A 10-tweet thread breaking down Mark-LIII's architecture: Python 3.12, local Vosk wake word, Gemini 3.8 Flash, and undoable desktop actions.",
    voiceRules: [
      "950-1,250 characters",
      "No hashtags in body",
      "Format for mobile thumb-scrolling with double line breaks",
    ],
  },
  {
    id: "engagement-monitor",
    name: "Engagement Monitor",
    tagline: "Warm Prospect Follow-Up & DM Drafter",
    purpose: "Screens who engaged with your posts and drafts high-converting, non-salesy direct messages to start authentic relationships.",
    sampleInput: "VP of Engineering at a 120-person SaaS company commented: 'We need this local voice undo feature for our DevOps team.'",
    voiceRules: [
      "0% pitch-slap tone",
      "Quote their exact phrasing",
      "Propose an open-ended technical exchange",
    ],
  },
  {
    id: "ai-detector-audit",
    name: "AI Detector Audit",
    tagline: "Synthetic Phrasing & Cliché Diagnostic",
    purpose: "Scores any draft from 0-100% human authenticity, flagging uniform sentence lengths, robotic rhythm, and em dash excess.",
    sampleInput: "In today's fast-paced digital landscape, it is fundamentally crucial to leverage state-of-the-art tools to streamline operations and unlock unprecedented value.",
    voiceRules: [
      "Score 0-100 based on buzzword density & variance",
      "Provide side-by-side humanized rewrite",
      "Highlight specific words triggering AI flags",
    ],
  },
];
