"use client";

import { useEffect, useState, useRef } from "react";
import type { AccidentRecord } from "@/lib/csvLoader";

function AnimatedCounter({
  target,
  duration = 2500,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || target === 0) return;
    const delay = setTimeout(() => {
      started.current = true;
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
        else setCount(target);
      };
      requestAnimationFrame(animate);
    }, 400);
    return () => clearTimeout(delay);
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function Hero({ records }: { records: AccidentRecord[] }) {
  const fatalCount = records.filter((r) => r.fatal).length;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="problem"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "8vh",
        paddingBottom: "4vh",
      }}
    >
      <div className="content-wrap">
        {/* Section label */}
        <p
          className="section-label section-fade"
          style={{ marginBottom: "48px" }}
        >
          01 — The Problem
        </p>

        {/* Big fatal stat */}
        <div className="section-fade" style={{ marginBottom: "32px" }}>
          <div className="display-xl" style={{ lineHeight: 1 }}>
            <AnimatedCounter target={fatalCount} />
          </div>
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#555",
              marginTop: "12px",
              fontWeight: 500,
            }}
          >
            fatal mining incidents in the last decade
          </p>
        </div>

        {/* Thesis */}
        <div className="section-fade" style={{ marginBottom: "64px" }}>
          <p
            className="display-lg"
            style={{ marginBottom: "16px", maxWidth: "720px" }}
          >
            Every year, miners die in preventable accidents.
          </p>
          <p
            style={{
              fontSize: "20px",
              fontWeight: 300,
              color: "#888",
              maxWidth: "580px",
              lineHeight: 1.7,
            }}
          >
            MSHA has the data. Inspectors don&apos;t have the tools.
          </p>
        </div>

        {/* CTA */}
        <div className="section-fade">
          <button
            onClick={() => scrollTo("data")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: "#f97316",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: 0,
              transition: "gap 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.gap = "16px")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.gap = "10px")
            }
          >
            See the patterns
            <span style={{ fontSize: "18px" }}>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}
