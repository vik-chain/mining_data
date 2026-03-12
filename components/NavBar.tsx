"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Problem" },
  { id: "explorer", label: "Patterns" },
  { id: "risk", label: "Risk Score" },
  { id: "simulator", label: "Inspections" },
  { id: "prevention", label: "Prevention" },
  { id: "future", label: "Future" },
];

export default function NavBar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docEl = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = docEl.scrollHeight - docEl.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);

      // Determine active section
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        id="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            className="text-white font-semibold text-sm tracking-wide hover:text-orange-400 transition-colors"
          >
            MSHA Analytics
          </button>
          <div className="hidden md:flex items-center gap-6">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`text-xs font-medium tracking-wide transition-colors flex items-center gap-1.5 ${
                  activeSection === s.id
                    ? "text-orange-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {activeSection === s.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                )}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
