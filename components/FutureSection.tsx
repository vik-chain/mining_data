"use client";

const IDEAS = [
  {
    icon: "📋",
    number: "01",
    title: "Automated Incident Reporting",
    subtitle: "Replace Form 7000-1",
    description:
      "Form 7000-1, MSHA's primary fatality/injury report, is still submitted as paper or fax. A structured digital intake — integrated with mine operator systems — would eliminate transcription delays and enable real-time pattern detection the day an incident occurs.",
    tags: ["Data Collection", "Automation", "Part 50"],
    impact: "2–3 day reporting lag → real-time",
  },
  {
    icon: "📡",
    number: "02",
    title: "Equipment Telemetry Integration",
    subtitle: "Real-Time Sensor Data",
    description:
      "Modern haul trucks and continuous miners ship with GPS, collision sensors, and load monitors. Integrating this telemetry stream with MSHA's risk platform would flag anomalies — unexpected stops, proximity violations, equipment failures — before they become fatalities.",
    tags: ["IoT", "Telemetry", "Powered Haulage"],
    impact: "Reactive inspection → predictive alerting",
  },
  {
    icon: "🔔",
    number: "03",
    title: "Real-Time Hazard Alerts",
    subtitle: "Inspector Push Notifications",
    description:
      "When a mine's risk score spikes — new S&S violations, a near-miss incident, or a sudden increase in complaint reports — inspectors in that district should receive an automated alert. The same way a bank flags unusual transactions, MSHA can flag unusual mine behavior.",
    tags: ["Notifications", "Risk Monitoring", "Inspector Tooling"],
    impact: "Annual inspection cadence → event-driven response",
  },
];

export default function FutureSection() {
  return (
    <section id="future" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-orange-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          06 / Future
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Where This Goes Next
        </h2>
        <p className="text-slate-400 text-lg mb-16 max-w-2xl">
          The prototype above uses publicly available data and a simple risk
          formula. Here&apos;s what a production-grade system would add.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {IDEAS.map((idea) => (
            <div
              key={idea.number}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col hover:border-orange-500/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="text-4xl">{idea.icon}</div>
                <span className="text-slate-700 text-5xl font-bold leading-none">
                  {idea.number}
                </span>
              </div>
              <p className="text-orange-400 text-xs font-semibold tracking-wide uppercase mb-1">
                {idea.subtitle}
              </p>
              <h3 className="text-white font-bold text-xl mb-3">{idea.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">
                {idea.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-500 text-xs">Impact</p>
                <p className="text-orange-400 text-sm font-medium mt-0.5">
                  {idea.impact}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="border border-orange-500/30 bg-orange-500/5 rounded-2xl p-10 text-center max-w-3xl mx-auto">
          <p className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            The data to save lives already exists.
          </p>
          <p className="text-slate-400 text-lg">
            The question is whether we act on it.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-slate-800 text-center text-slate-600 text-sm">
          <p>
            Built with synthetic MSHA data for analytical demonstration purposes.
            Data structure is fully compatible with real MSHA Part 50 exports.
          </p>
        </div>
      </div>
    </section>
  );
}
