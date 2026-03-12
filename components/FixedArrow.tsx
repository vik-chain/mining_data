"use client";

import { useEffect, useState } from "react";

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "up" | "down";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#333",
        fontSize: "24px",
        padding: "6px 8px",
        zIndex: 100,
        transition: "color 0.2s, transform 0.2s",
        lineHeight: 1,
        display: "block",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#f97316";
        e.currentTarget.style.transform =
          direction === "down" ? "translateY(3px)" : "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#333";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {direction === "down" ? "↓" : "↑"}
    </button>
  );
}

export default function FixedArrow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sectionCount, setSectionCount] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section"));
    setSectionCount(sections.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setCurrentIndex(idx);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const navigate = (dir: "up" | "down") => {
    const sections = Array.from(document.querySelectorAll("section"));
    const target = sections[currentIndex + (dir === "down" ? 1 : -1)];
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  if (sectionCount === 0) return null;

  const showUp = currentIndex > 0;
  const showDown = currentIndex < sectionCount - 1;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0",
      }}
    >
      {showUp && <ArrowButton direction="up" onClick={() => navigate("up")} />}
      {showDown && <ArrowButton direction="down" onClick={() => navigate("down")} />}
    </div>
  );
}
