"use client";

import { useEffect, useState } from "react";
import { loadAccidents, type AccidentRecord } from "@/lib/csvLoader";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import FatalityExplorer from "@/components/FatalityExplorer";
import RiskScoreCalculator from "@/components/RiskScoreCalculator";
import PreventionPanel from "@/components/PreventionPanel";
import MockDashboard from "@/components/MockDashboard";
import MineRiskMap from "@/components/MineRiskMap";
import FutureSafetyNetwork from "@/components/FutureSafetyNetwork";
import FixedArrow from "@/components/FixedArrow";

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

  if (loading) return <SkeletonLoader />;

  return (
    <main style={{ background: "#0a0a0a" }}>
      <NavBar />
      <FixedArrow />

      <Hero records={records} />
      <FatalityExplorer records={records} />
      <RiskScoreCalculator />
      <MineRiskMap records={records} />
      <PreventionPanel />
      <FutureSafetyNetwork />
      <MockDashboard records={records} />

      <section
        id="closing"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "8vh",
          paddingBottom: "4vh",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="content-wrap">
          <p
            style={{
              fontSize: "clamp(28px,4vw,48px)",
              fontWeight: 300,
              color: "#f5f5f5",
              lineHeight: 1.3,
              marginBottom: "16px",
              maxWidth: "560px",
            }}
          >
            The data to save lives already exists.
          </p>
          <p style={{ color: "#555", fontSize: "16px" }}>
            The question is whether we act on it.
          </p>
          <p
            style={{
              marginTop: "80px",
              paddingTop: "40px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "#333",
              fontSize: "12px",
              letterSpacing: "0.04em",
            }}
          >
            Built with synthetic MSHA data for analytical demonstration. Data
            structure is compatible with real MSHA Part 50 exports.
          </p>
        </div>
      </section>
    </main>
  );
}
