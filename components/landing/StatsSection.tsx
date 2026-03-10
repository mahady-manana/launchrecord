interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  {
    value: "94.2%",
    label: "Founders Invisible to LLMs",
  },
  {
    value: "12%",
    label: "Avg. Differentiation Loss/Month",
  },
  {
    value: "48s",
    label: "Avg. Time-to-Aha (Target: 15s)",
  },
];

export function StatsSection() {
  return (
    <section className="max-w-6xl mx-auto grid grid-cols-3 gap-8 pt-8 border-t border-border">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="text-3xl font-bold text-foreground">{stat.value}</div>
          <p className="text-sm text-muted-foreground font-medium">
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}
