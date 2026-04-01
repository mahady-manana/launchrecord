import { SIOV5Report } from "../sio-v5-report-schema";

export const mockStartup = {
  name: "StandupAI",
  url: "https://standupai.example.com",
  description: "Async standup automation for remote engineering teams",
  category: "Productivity Software",
  employees: "11-50",
  founded: "2024",
};

export const mockReport: SIOV5Report = {
  score: 58,
  overallScore: 58,
  statement:
    "Your startup is stuck in the 'Blended' zone—visitors understand what you do after 8-10 seconds, but you're not distinctive enough to be memorable or recommended. Your positioning uses generic SaaS language that blends with 20+ competitors, and your AI visibility is nearly non-existent. The core issue: you're describing features before establishing what specific problem you solve and for whom.",
  overallCommentPositive: [
    "Clear problem-solution structure on homepage",
    "Good use of integration logos (Slack, Teams) for credibility",
    "Dashboard screenshot demonstrates product functionality",
  ],
  overallCommentNegative: [
    "Generic SaaS language throughout - could apply to any productivity tool",
    "No quantified outcomes or specific ICP mentioned in key sections",
    "AI visibility is nearly non-existent in major engines",
    "Features are listed before establishing what specific problem is solved",
  ],
  websiteSummary: {
    summary:
      "StandupAI helps teams reduce meeting time with automated standups. The Future of Work is async.",
    summaryComment:
      "Generic tagline ('Future of Work') without specific ICP or quantified outcome",
    problems: {
      currents: [
        "Teams waste time in meetings and status updates",
        "Daily standups take too long",
        "Remote teams struggle with async communication",
      ],
      positiveComments: ["Identifies real pain point around meeting fatigue"],
      negativeComments: [
        "Vague - no specific time/cost metrics",
        "Doesn't quantify how long is 'too long'",
      ],
    },
    outcomes: {
      currents: [
        "Save time and improve productivity",
        "Reduce meeting hours by 10+ hours/week",
        "Better async collaboration",
      ],
      positiveComments: ["Good - specific metric provided in second item"],
      negativeComments: [
        "Generic outcome - 'improve productivity' is meaningless",
        "Vague - what does 'better' mean?",
      ],
    },
    solutions: {
      currents: [
        "Automated standup tool with async updates",
        "Dashboards for team visibility",
        "Slack and Teams integrations",
      ],
      positiveComments: ["Clear integration mentions (Slack, Teams)"],
      negativeComments: [
        "Describes what it is, not what it achieves",
        "Feature-focused, not outcome-focused",
      ],
    },
    features: {
      currents: [
        "Automated daily standups",
        "Async video updates",
        "Team dashboards",
        "Slack integration",
        "Progress tracking",
      ],
      positiveComments: ["Good variety of features for standup automation"],
      negativeComments: [
        "No outcome attached to feature",
        "List format without benefits",
      ],
    },
    isPositioningClear: false,
    isMessagingClear: false,
    areUsersLeftGuessing: true,
  },
  firstImpression: {
    score: 42,
    statement:
      "Your hero section fails the 5-second test. The headline leads with your brand name instead of the visitor's problem, the subheadline is generic marketing speak, and the CTA doesn't tell visitors what happens next. This structure causes 60%+ bounce rate.",
    overallCommentPositive: [
      "Clear visual hierarchy with headline, subhead, and CTA present",
      "Dashboard screenshot shows product interface",
    ],
    overallCommentNegative: [
      "Your hero section follows a feature-first pattern instead of problem-first",
      "Visitors see your brand name, a dashboard screenshot, and generic CTAs before understanding what problem you solve",
      "Restructure to lead with the visitor's pain point, then show the outcome, then support with social proof and visuals",
    ],
    headline: {
      current: "StandupAI - The Future of Work",
      positiveComments: ["Short and memorable brand name"],
      negativeComments: [
        "Leads with brand name - visitors don't know what you do until reading further",
      ],
      suggested: [
        "Tired of endless standups? We help engineering managers save 10 hours/week",
        "Stop wasting 15 hours/week on status meetings - automate your standups today",
      ],
    },
    subheadline: {
      current: "Streamline your team's workflow with our innovative platform",
      positiveComments: ["Attempts to describe the benefit"],
      negativeComments: [
        "Generic marketing jargon - 'streamline', 'innovative', 'platform' could apply to any SaaS",
      ],
      suggested: [
        "For remote engineering teams wasting 15 hours/week on status updates, we automate standups asynchronously",
        "Replace daily standup meetings with 2-minute async video updates that your team actually enjoys",
      ],
    },
    cta: {
      current: "Get Started",
      positiveComments: ["Clear action-oriented language"],
      negativeComments: [
        "Generic CTA - doesn't tell visitor what happens next (demo? trial? pricing?)",
      ],
      suggested: [
        "Start Free Trial · No credit card required · 14 days free",
        "Try Free for 14 Days · Setup in 2 minutes",
      ],
    },
  },
  positioning: {
    score: 52,
    statement:
      "Your positioning is understandable but not distinctive. Visitors can tell you're a 'productivity tool for teams' but can't articulate what makes you different from Monday, Asana, or Notion. You're using the same generic language ('streamline workflows', 'boost productivity') as 80% of competitors.",
    overallCommentPositive: [
      "Clear attempt to define category with async standup automation",
      "Good integration mentions (Slack, Teams) for credibility",
      "Consistent messaging around remote team benefits",
    ],
    overallCommentNegative: [
      "Generic category language ('productivity tool') without specific differentiation",
      "No quantified outcomes or specific ICP mentioned in positioning",
      "Could apply to any collaboration/standup tool on the market",
      "Missing explicit competitor contrasts or differentiation claims",
    ],
    summary: {
      current:
        "StandupAI helps teams reduce meeting time with automated standups. The Future of Work is async.",
      positiveComments: [
        "Attempts to define category with async standup automation",
      ],
      negativeComments: [
        "Generic category ('productivity tool') without specific differentiation",
        "No quantified outcomes or specific ICP mentioned",
        "Could apply to any collaboration/standup tool on the market",
      ],
      suggested: [
        "StandupAI helps remote engineering teams save 10 hours/week by automating daily standups asynchronously. The only standup tool built specifically for engineering managers who need visibility without meetings.",
        "Async standup automation for engineering managers - save 10 hours/week on status meetings without losing team alignment.",
      ],
    },
    subMetrics: {
      categoryOwnership: {
        name: "Category Ownership",
        score: 45,
        current: "Project management software / Productivity tool",
        positiveComments: ["Attempts to position in recognizable category"],
        negativeComments: [
          "Too broad - competing against Asana, Monday, ClickUp without defensible niche",
          "No distinctive category language that you can own",
        ],
        suggested: [
          "Async Standup Automation for Remote Engineering Teams",
          "Engineering Standup Automation - Built for Remote-First Teams",
        ],
      },
      uniqueValueProp: {
        name: "Unique Value Proposition",
        score: 55,
        current: "Streamline your team's workflow with our innovative platform",
        positiveComments: ["Attempts to communicate workflow benefits"],
        negativeComments: [
          "Describes features instead of specific outcomes",
          "Generic jargon ('streamline', 'innovative') without quantified benefits",
        ],
        suggested: [
          "Save 10 hours/week on status meetings. Get back 25% of your workweek for actual building.",
          "Replace 15 hours of weekly standups with 10 minutes of async updates - ship features 2x faster.",
        ],
      },
      competitiveDiff: {
        name: "Competitive Differentiation",
        score: 50,
        current: "Better than alternatives for modern teams",
        positiveComments: ["Attempts to differentiate from alternatives"],
        negativeComments: [
          "No explicit competitor contrasts",
          "Doesn't name alternatives or explain why you win",
        ],
        suggested: [
          "Unlike Monday.com for general teams, built specifically for engineering managers. Unlike Loom for async video, built for automated standups.",
          "While Slack is for general chat and Loom is for general video, we're purpose-built for engineering standups with automated scheduling and transcriptions.",
        ],
      },
      targetAudience: {
        name: "Target Audience Clarity",
        score: 58,
        current: "Teams and businesses",
        positiveComments: ["Attempts to define audience"],
        negativeComments: [
          "Too broad - could mean anyone from 2-person startup to 500-person enterprise",
          "No specific role, company size, or industry focus",
        ],
        suggested: [
          "Engineering managers at 20-200 person remote-first tech companies",
          "Remote engineering teams of 10-50 developers who need async-first communication",
        ],
      },
      problemSolutionFit: {
        name: "Problem-Solution Fit",
        score: 52,
        current: "We help teams communicate better",
        positiveComments: ["Addresses a real communication pain point"],
        negativeComments: [
          "Problem is implied but never explicitly stated",
          "Visitors must infer what pain you address",
        ],
        suggested: [
          "Tired of wasting 15 hours/week on status updates that could be async? We automate daily standups so your team stays aligned without meetings.",
          "Engineering managers lose 10+ hours/week on status meetings. Our async standups give that time back while keeping everyone aligned.",
        ],
      },
      messagingConsistency: {
        name: "Messaging Consistency",
        score: 54,
        current:
          "Homepage: 'productivity' | Pricing: 'collaboration' | About: 'teamwork'",
        positiveComments: ["Consistent focus on team benefits"],
        negativeComments: [
          "Different pages tell different stories",
          "Creates narrative confusion for visitors",
        ],
        suggested: [
          "All pages lead with 'async standup automation for engineering teams' - same core message, different supporting points",
          "Homepage, pricing, and about pages all lead with 'engineering standup automation' with consistent ICP and outcome messaging",
        ],
      },
    },
  },
  clarity: {
    score: 48,
    statement:
      "Visitors need 8-10 seconds to understand what you offer—3x longer than high-converting sites. Your headline leads with your company name instead of the visitor's problem, and multiple sentences use generic jargon without specific outcomes.",
    overallCommentPositive: [
      "Good visual structure with clear sections",
      "Some specific metrics mentioned (10 hours/week)",
      "Integration logos provide credibility",
    ],
    overallCommentNegative: [
      "Multiple unclear sentences throughout the site using generic jargon",
      "Features mentioned before benefits in most sections",
      "Generic language without specific ICP in key areas",
      "Headline leads with brand name instead of visitor problem",
    ],
    summary: {
      current:
        "StandupAI helps teams reduce meeting time with automated standups. The Future of Work is async.",
      positiveComments: ["Attempts to communicate core value proposition"],
      negativeComments: [
        "Generic language without specific ICP or quantified outcomes",
        "Multiple unclear sentences throughout the site",
        "Features mentioned before benefits",
      ],
      suggested: [
        "StandupAI helps remote engineering managers save 10 hours/week by automating daily standups asynchronously. No more wasted meetings—your team stays aligned without synchronous calls.",
        "Remote engineering teams save 15 hours/week with async standups - automated scheduling, 2-minute video updates, and transcribed notes.",
      ],
    },
    unclearSentences: [
      {
        text: "Streamline your team's workflow with our innovative platform",
        issue:
          "Generic jargon - 'streamline', 'innovative', 'platform' could apply to any SaaS",
        fix: "Save 10 hours/week on status meetings with automated async standups built for engineering teams",
      },
      {
        text: "Boost productivity and collaboration",
        issue:
          "Vague outcome - doesn't specify how much or what kind of productivity",
        fix: "Ship features 2x faster by eliminating 15 hours/week of status meetings",
      },
      {
        text: "Modern teams need modern tools",
        issue: "Empty marketing speak - no specific benefit mentioned",
        fix: "Remote engineering teams need async-first tools to stay aligned across timezones",
      },
    ],
    subMetrics: {
      headlineClarity: {
        name: "Headline Clarity",
        score: 35,
        current: "StandupAI - The Future of Work",
        positiveComments: ["Short and memorable"],
        negativeComments: [
          "Leads with brand name instead of visitor problem",
          "'Future of Work' is generic and doesn't explain what you do",
        ],
        suggested: [
          "Tired of endless standups? We help engineering managers save 10 hours/week",
          "Stop wasting 15 hours/week on status meetings - automate your standups today",
        ],
        unclearTexts: [
          {
            text: "StandupAI - The Future of Work",
            issue: "Brand-first instead of problem-first, generic tagline",
            fix: "Tired of endless standups? We help engineering managers save 10 hours/week",
          },
        ],
      },
      valueProposition: {
        name: "Value Proposition",
        score: 40,
        current: "Streamline your team's workflow with our innovative platform",
        positiveComments: ["Attempts to communicate benefits"],
        negativeComments: [
          "Uses generic jargon without specifics",
          "No quantified benefits",
        ],
        suggested: [
          "Save 10 hours/week on status meetings. Get back 25% of your workweek for actual building.",
          "Replace 15 hours of weekly standups with 10 minutes of async updates",
        ],
        unclearTexts: [
          {
            text: "Streamline your team's workflow",
            issue: "'Streamline' is vague - doesn't say what specific outcome",
            fix: "Save 10 hours/week on status meetings",
          },
        ],
      },
      featureBenefitMapping: {
        name: "Feature-Benefit Mapping",
        score: 50,
        current: "Automated standups, async video updates, team dashboards",
        positiveComments: ["Clear feature list"],
        negativeComments: [
          "Features listed without explaining benefits",
          "No connection between features and outcomes",
        ],
        suggested: [
          "Automated standups (save 10 hours/week), async video updates (2-min max, transcribed), team dashboards (real-time visibility without meetings)",
          "Automated daily standups (10 hours/week saved), 2-minute async video updates (transcribed), real-time team dashboards",
        ],
        unclearTexts: [
          {
            text: "Automated standups",
            issue:
              "Feature without benefit - what does this actually do for me?",
            fix: "Automated standups that save 10 hours/week",
          },
        ],
      },
      visualHierarchy: {
        name: "Visual Hierarchy",
        score: 45,
        current: "Dashboard screenshot in hero before problem is explained",
        positiveComments: ["Clean visual design"],
        negativeComments: [
          "Visual appears before value is communicated",
          "Logo and nav compete with headline for attention",
        ],
        suggested: [
          "Headline (64px) → Subhead → Social proof → CTA → Dashboard showing '10 hours saved'",
          "Problem headline → Outcome subhead → Trust badges → CTA → Product visual",
        ],
        unclearTexts: [],
      },
      ctaClarity: {
        name: "CTA Clarity",
        score: 55,
        current: "Get Started",
        positiveComments: ["Clear action verb"],
        negativeComments: [
          "Generic CTA doesn't tell visitor what happens next",
          "No friction-reducing microcopy",
        ],
        suggested: [
          "Start Free Trial · No credit card required · 14 days free",
          "Try Free for 14 Days · Setup in 2 minutes · No credit card",
        ],
        unclearTexts: [
          {
            text: "Get Started",
            issue:
              "Doesn't tell visitor what happens next - demo? trial? pricing?",
            fix: "Start Free Trial · No credit card required",
          },
        ],
      },
      proofPlacement: {
        name: "Proof Placement",
        score: 48,
        current: "Customer logos at bottom of page after 3 CTAs",
        positiveComments: ["Has social proof elements"],
        negativeComments: [
          "Social proof appears after conversion asks",
          "Trust signals should appear before or alongside CTAs",
        ],
        suggested: [
          "Hero: Headline → Subhead → 'Trusted by 500+ teams' (logos) → CTA",
          "Headline → Subhead → Social proof logos → Primary CTA → Dashboard visual",
        ],
        unclearTexts: [],
      },
    },
  },
  aeo: {
    score: 35,
    statement:
      "Your startup has low visibility in AI-generated responses. When asked about 'async standup tools', ChatGPT, Claude, and Gemini don't mention you.",
    aiPresence: {
      isPresent: false,
      engines: [],
      comment:
        "Not mentioned in any major AI engine for category queries. Competitors Loom and Geekbot appear consistently.",
    },
    recommendations: [
      "Create definitive category content ('Complete Guide to Async Standups')",
      "Implement SoftwareApplication schema markup",
      "Build topical authority with 10+ articles on async communication",
    ],
  },
  analyzedUrl: "https://standupai.example.com",
  analyzedAt: "2026-03-30T10:00:00Z",
  band: {
    name: "Blended",
    scoreRange: "50-69",
    description: "Understandable but not distinctive",
  },
};
