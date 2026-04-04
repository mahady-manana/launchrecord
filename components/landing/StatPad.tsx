interface Stat {
  value: string;
  label: string;
  percent?: boolean;
}

const stats: Stat[] = [
  {
    value: "6,630+",
    label: "Startups Audited",
  },
  {
    value: "250+",
    label: "Categories & Niche",
  },
  {
    value: "47.1",
    label: "Avg. Sovereignty Score",
    percent: true,
  },
  {
    value: "62.5",
    label: "Avg. Positioning Score",
    percent: true,
  },
];

export function StatPad() {
  return (
    <section className="pb-10 pt-0 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto flex md:flex-row flex-col justify-between gap-4 p-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="px-4 text-center md:w-1/4 w-full rounded-xl py-4 border border-slate-200 bg-white shadow-sm"
          >
            <div className="md:text-4xl text-2xl font-black text-primary">
              {stat.value}{" "}
              {stat.percent ? <span className="text-sm">/100</span> : null}
            </div>
            <p className="font-bold text-slate-700">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
