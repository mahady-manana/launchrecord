interface ProtocolStep {
  step: string;
  title: string;
  description: string;
  activeColor: string;
}

const protocolSteps: ProtocolStep[] = [
  {
    step: "01",
    title: "Deep-Vector Submission",
    description:
      'Submit your URL. We cross-reference your positioning against 1,400+ competitors to detect "Commodity Convergence."',
    activeColor: "bg-red-600",
  },
  {
    step: "02",
    title: "The Stress-Test",
    description:
      "We simulate AEO (AI-Engine Optimization) visibility and run a CFO ROI-Clarity scan. We find where you are invisible.",
    activeColor: "bg-red-600",
  },
  {
    step: "03",
    title: "The War Briefing",
    description:
      "Receive your Record. Status: JUNK, VULNERABLE, or SOVEREIGN. Know the truth about your defensibility.",
    activeColor: "bg-red-600",
  },
  {
    step: "04",
    title: "Moat Missions",
    description:
      "Complete weekly missions to fix your record. Upload proof, climb the Sovereign 100, and build a fortress.",
    activeColor: "bg-green-600",
  },
];

export function ProtocolSection() {
  return (
    <section className="max-w-6xl mx-auto bg-white py-24 rounded-xl text-slate-900 px-6 border border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-2 mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            The Protocol
          </h2>
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            Standardized Defensibility Testing v1.04
          </p>
        </div>

        <div className="space-y-12">
          {protocolSteps.map((step, index) => (
            <div key={index} className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 ${
                    index === 0
                      ? "bg-primary text-white"
                      : `border-2 border-slate-300 text-slate-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary`
                  } flex items-center justify-center font-black text-xs transition-all rounded-md`}
                >
                  {step.step}
                </div>
                {index < protocolSteps.length - 1 && (
                  <div className="w-px h-full bg-slate-300 my-2"></div>
                )}
              </div>
              <div
                className={`${index < protocolSteps.length - 1 ? "pb-12" : ""} space-y-2`}
              >
                <h4 className="text-xl font-bold uppercase tracking-tight">
                  {step.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
