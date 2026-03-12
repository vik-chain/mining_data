"use client";

import { useEffect, useState, useRef } from "react";

function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center hero-grid pt-14"
    >
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <p className="text-orange-400 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            01 / Problem
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-8">
            Where Mine Fatalities{" "}
            <span className="text-orange-400">Actually</span>{" "}
            Come From
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
            Every year, dozens of miners die in preventable accidents. MSHA
            inspectors work hard — but they rely on reactive processes, siloed
            data, and gut instinct to decide where to look.{" "}
            <strong className="text-white">
              The data to identify high-risk mines already exists.
            </strong>{" "}
            It just isn&apos;t being used proactively.
          </p>

          {/* Stat counters */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-lg">
            <div className="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
              <div className="text-3xl font-bold text-orange-400">
                <AnimatedCounter target={97} />
              </div>
              <div className="text-slate-400 text-xs mt-1">Fatal Incidents</div>
            </div>
            <div className="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
              <div className="text-3xl font-bold text-orange-400">
                <AnimatedCounter target={18} />
              </div>
              <div className="text-slate-400 text-xs mt-1">States</div>
            </div>
            <div className="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
              <div className="text-3xl font-bold text-orange-400">
                <AnimatedCounter target={5} />+
              </div>
              <div className="text-slate-400 text-xs mt-1">Years of Data</div>
            </div>
          </div>

          <button
            onClick={() => scrollTo("explorer")}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base"
          >
            Explore the Data
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
