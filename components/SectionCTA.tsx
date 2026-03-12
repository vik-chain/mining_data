"use client";
import { useState } from "react";

export default function SectionCTA({ toId }: { toId: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ marginTop: "64px" }}>
      <button
        onClick={() => document.getElementById(toId)?.scrollIntoView({ behavior: "smooth" })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "32px", height: "32px",
          color: hovered ? "#f97316" : "#333",
          fontSize: "20px",
          background: "none", border: "none", cursor: "pointer",
          padding: 0,
          transition: "color 0.2s ease, transform 0.2s ease",
          transform: hovered ? "translateY(3px)" : "translateY(0)",
        }}
        aria-label="Next section"
      >
        ↓
      </button>
    </div>
  );
}
