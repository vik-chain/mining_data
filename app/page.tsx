"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { loadAccidents, type AccidentRecord } from "@/lib/csvLoader";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import FatalityExplorer from "@/components/FatalityExplorer";
import RiskScoreCalculator, {
  type RiskDrivers,
} from "@/components/RiskScoreCalculator";
import InspectionSimulator from "@/components/InspectionSimulator";
import PreventionPanel from "@/components/PreventionPanel";
import FutureSection from "@/components/FutureSection";
import MineRiskMap from "@/components/MineRiskMap";
import FutureSafetyNetwork from "@/components/FutureSafetyNetwork";
import NarrativeBridge from "@/components/NarrativeBridge";

const DEFAULT_DRIVERS: RiskDrivers = {
  accidents: 5,
  ssViolations: 10,
  hasHaulage: false,
  isUnderground: false,
};

function SkeletonLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "320px",
        }}
      >
        <div className="skeleton" style={{ height: "32px", width: "66%" }} />
        <div className="skeleton" style={{ height: "14px", width: "100%" }} />
        <div className="skeleton" style={{ height: "14px", width: "80%" }} />
        <p
          style={{
            color: "#333",
            fontSize: "12px",
            marginTop: "16px",
            letterSpacing: "0.08em",
          }}
        >
          Loading data...
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [records, setRecords] = useState<AccidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskDrivers, setRiskDrivers] = useState<RiskDrivers>(DEFAULT_DRIVERS);
  const lenisRef = useRef<import("lenis").default | null>(null);

  // Load CSV data
  useEffect(() => {
    loadAccidents()
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load accidents CSV:", err);
        setLoading(false);
      });
  }, []);

  // Lenis smooth scroll
  useEffect(() => {
    if (loading) return;

    let raf: number;
    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.08, duration: 1.2 });
      lenisRef.current = lenis;

      const animate = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [loading]);

  // Section fade-in via IntersectionObserver
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.06 }
      );
      document.querySelectorAll(".section-fade").forEach((el) => {
        observer.observe(el);
      });
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleDriversChange = useCallback((drivers: RiskDrivers) => {
    setRiskDrivers(drivers);
  }, []);

  if (loading) return <SkeletonLoader />;

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <NavBar />

      <Hero records={records} />

      <NarrativeBridge text="The data to prevent it already exists." />

      <FatalityExplorer records={records} />

      <NarrativeBridge text="The patterns are clear. But buried in fragmented tools." />

      <RiskScoreCalculator onDriversChange={handleDriversChange} />

      <NarrativeBridge text="Risk isn't evenly distributed across the country." />

      <MineRiskMap records={records} />

      <NarrativeBridge text="Now see what that means for inspection strategy." />

      <InspectionSimulator />

      <NarrativeBridge text="Smarter targeting changes the outcome." />

      <PreventionPanel riskDrivers={riskDrivers} />

      <NarrativeBridge text="This isn't hypothetical. It's buildable." />

      <FutureSection />

      <NarrativeBridge text="But detecting patterns after the fact is only half the answer." />

      <FutureSafetyNetwork />
    </main>
  );
}
