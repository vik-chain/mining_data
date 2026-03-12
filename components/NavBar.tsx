"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "problem", label: "Problem" },
  { id: "data", label: "Data" },
  { id: "risk", label: "Risk" },
  { id: "map", label: "Map" },
  { id: "inspection", label: "Inspect" },
  { id: "prevention", label: "Prevent" },
  { id: "future", label: "Solution" },
  { id: "network", label: "Network" },
];

export default function NavBar() {
  const [activeSection, setActiveSection] = useState("problem");

  useEffect(() => {
    const handleScroll = () => {
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 140) {
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
    <nav
      style={{
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "999px",
        padding: "6px 8px",
      }}
    >
      {sections.map((s) => {
        const isActive = activeSection === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              border: "none",
              background: isActive ? "rgba(249,115,22,0.15)" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: isActive ? "#f97316" : "rgba(255,255,255,0.2)",
                transition: "background 0.2s ease",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isActive ? "#f97316" : "#555",
                transition: "color 0.2s ease",
              }}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
