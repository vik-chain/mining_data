"use client";

import { useEffect, useState, useCallback } from "react";
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

const DEFAULT_DRIVERS: RiskDrivers = {
  accidents: 5,
  ssViolations: 10,
  hasHaulage: false,
  isUnderground: false,
};

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4 px-6 max-w-md w-full">
        <div className="skeleton mx-auto rounded" style={{ height: "2rem", width: "66%" }} />
        <div className="skeleton rounded" style={{ height: "1rem", width: "100%" }} />
        <div className="skeleton mx-auto rounded" style={{ height: "1rem", width: "80%" }} />
        <div className="skeleton mx-auto rounded" style={{ height: "1rem", width: "75%" }} />
        <p className="text-slate-600 text-sm mt-8">Loading data...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [records, setRecords] = useState<AccidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskDrivers, setRiskDrivers] = useState<RiskDrivers>(DEFAULT_DRIVERS);

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
    <main className="min-h-screen bg-slate-900">
      <NavBar />

      <div className="section-fade">
        <Hero records={records} />
      </div>

      <div className="section-fade">
        <FatalityExplorer records={records} />
      </div>

      <div className="section-fade">
        <RiskScoreCalculator onDriversChange={handleDriversChange} />
      </div>

      <div className="section-fade">
        <InspectionSimulator />
      </div>

      <div className="section-fade">
        <PreventionPanel riskDrivers={riskDrivers} />
      </div>

      <div className="section-fade">
        <FutureSection />
      </div>
    </main>
  );
}
