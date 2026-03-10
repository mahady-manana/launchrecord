interface FunnelStep {
  step: string;
  title: string;
  desc: string;
}

const funnelSteps: FunnelStep[] = [
  {
    step: "1",
    title: "Free Genericity Score",
    desc: "Enter your URL. Get a 1-page roast of your positioning in 2 minutes.",
  },
  {
    step: "2",
    title: "Full War Briefing",
    desc: "Unlock all 6 diagnostics. See your AEO Pulse, Market Position, and Threat Radar.",
  },
  {
    step: "3",
    title: "Choose Your Tier",
    desc: "Start at $49/mo. Upgrade as you climb the Sovereign Leaderboard.",
  },
];

export function PreAuditFunnel() {
  return (
    <section className="max-w-6xl mx-auto space-y-12 bg-orange-50 rounded-2xl p-12 border border-orange-100">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">
          The Pre-Audit Funnel
        </h2>
        <p className="text-lg text-muted-foreground">
          From curiosity to conversion in 3 steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {funnelSteps.map((item, idx) => (
          <div key={idx} className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold mx-auto">
              {item.step}
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
