interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What problem does LaunchRecord solve?",
    answer:
      "Most startups are invisible to AI and sound like everyone else. Your positioning converges toward commodity every week. LLMs don't cite you. Prospects can't understand you in 5 seconds. LaunchRecord detects these blind spots with cold, clinical data—then gives you a War Briefing with exact fixes before competitors or AI erase you from the market.",
  },
  {
    question: "What is LaunchRecord?",
    answer:
      "LaunchRecord is the #1 platform for verified sovereignty and defensibility ledger for startups. Our SIO-V5 Engine analyzes your positioning, clarity, AEO presence, and strategic moat against 10,000+ records. You get a Global Score, Survival Probability, and weekly missions to make your product obvious and convert more users.",
  },
  {
    question: "How does the audit work?",
    answer:
      "Submit your URL. Our SIO-V5 Engine scrapes your site and cross-references your positioning against 1,400+ competitors to detect Commodity Convergence. We simulate AEO visibility and run a clarity scan. Within 2-4 minutes, you receive your War Briefing with status: JUNK, VULNERABLE, or SOVEREIGN. Then complete weekly missions to fix your record and climb the Sovereign Leaderboard.",
  },
  {
    question: "What is SIO-V5?",
    answer:
      "SIO-V5 (Sovereign Intelligence Officer, Version 5) is our proprietary multi-agent auditing protocol. It analyzes your product across five clinical pillars—Positioning, Clarity, AEO Presence, Momentum, and Founder Proof—then compares against thousands of startups. Output: Global Score, brutal truth summary, Survival Probability. No fluff, no marketing speak, just cold data.",
  },
  {
    question: "What is the SIDL framework?",
    answer:
      "SIDL (Sovereign Intelligence Defensibility Ledger) is our proprietary methodology for measuring startup defensibility in the age of AI. It evaluates five pillars: AEO Engine (will LLMs cite you?), Positioning Engine (how different are you?), Clarity Engine (can we understand you instantly?), Momentum Engine (social proof density), and Proof Engine (hard evidence vs. empty claims). Your SIDL score determines your Sovereign Leaderboard rank.",
  },
  {
    question: "Who should use LaunchRecord?",
    answer:
      "Startup founders, SaaS companies, product leaders, and strategic planners who refuse to be commoditized. If you're building a SaaS and you care about being irreplaceable in the age of AI, this is your weapon. The Core System is free. Upgrade to unlock competitive intelligence, strategic warfare capabilities, and white-glove support.",
  },
  {
    question: "What outcomes can I expect?",
    answer:
      "Founders who fix their positioning and clarity see: +127% conversion rate (average after clarity fixes), +89% more citations in LLM responses, +2.3x improvement vs category competitors, and -43% CAC reduction from clearer messaging. Your War Briefing shows exactly where you're vulnerable and what to fix first.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes. The Free plan includes the SIO-V5 audit, Global Score, 5-pillar scoring, positioning analysis, and score evolution tracking. Upgrade to Founder ($49/mo) for competitive intelligence, weekly auto audits, and deeper strategy insights.",
  },
  {
    question: "What happens after I get my War Briefing?",
    answer:
      "You get access to your Sovereign Dashboard where you can track scores across all five SIDL pillars. Complete weekly Moat Missions to improve your record. Upload proof of shipping, revenue velocity, and social proof. Climb the Sovereign Leaderboard. This isn't a one-time audit—it's ongoing defensibility tracking.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 md:px-0 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-12 ">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-100">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about LaunchRecord, SIO-V5, and the SIDL
            framework.
          </p>
        </div>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-700 bg-slate-800/50 rounded-xl overflow-hidden"
            >
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-slate-100 pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className="w-5 h-5 text-slate-400 transform group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
