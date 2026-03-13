"use client";

import { useState } from "react";
import type { AccidentRecord } from "@/lib/csvLoader";

const ALERTS = [
  { mine: "Mine #7842", type: "Reportable Incident", daysAgo: 2, category: "Powered Haulage" },
  { mine: "Mine #3391", type: "S&S Violation", daysAgo: 5, category: "Fall of Ground" },
  { mine: "Mine #1204", type: "Near-Miss Report", daysAgo: 9, category: "Machinery" },
];

const AUDITS = [
  { mine: "Mine #7842", date: "Mar 18", status: "Scheduled", dot: "#22c55e" },
  { mine: "Mine #5519", date: "Mar 25", status: "Self-Audit Due", dot: "#f59e0b" },
  { mine: "Mine #2207", date: "Apr 3", status: "Scheduled", dot: "#22c55e" },
];

const SENSOR_FEED = [
  { dot: "#f97316", label: "Haul truck #T-04 — proximity alert", ago: "2m ago" },
  { dot: "#f59e0b", label: "Conveyor B-7 — vibration anomaly", ago: "11m ago" },
  { dot: "#555", label: "Shaft 2 ventilation — CO reading elevated", ago: "34m ago" },
];

const SS_VIOLATIONS = [
  { num: 1, type: "Fall of Ground", date: "Jan 14, 2026", status: "Abated" },
  { num: 2, type: "Powered Haulage", date: "Feb 3, 2026", status: "Abated" },
  { num: 3, type: "Electrical", date: "Mar 1, 2026", status: "Open" },
];

const CATEGORIES = [
  "Powered Haulage",
  "Fall of Ground",
  "Machinery",
  "Electrical",
  "Explosive",
  "Slip/Fall",
  "Other",
];

function alertDotColor(type: string) {
  if (type === "Reportable Incident") return "#f97316";
  if (type === "S&S Violation") return "#f59e0b";
  return "#555";
}

export default function MockDashboard({ records }: { records: AccidentRecord[] }) {
  const [selectedState, setSelectedState] = useState("");
  const [activeView, setActiveView] = useState<"inspector" | "operator">("inspector");

  const states = [...new Set(records.map((r) => r.state).filter(Boolean))].sort() as string[];
  const filtered = selectedState ? records.filter((r) => r.state === selectedState) : records;

  // Mine roster
  const mineMap = new Map<string, { accidents: number; fatalities: number }>();
  for (const r of filtered) {
    if (!r.mine_id) continue;
    const entry = mineMap.get(r.mine_id) ?? { accidents: 0, fatalities: 0 };
    entry.accidents += 1;
    if (r.fatal) entry.fatalities += 1;
    mineMap.set(r.mine_id, entry);
  }

  const mineRoster = Array.from(mineMap.entries())
    .map(([id, d]) => ({
      id,
      accidents: d.accidents,
      fatalities: d.fatalities,
      risk: Math.min(100, (d.accidents * 0.7 + d.fatalities * 5) / 10),
    }))
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 8);

  // Category counts
  const categoryCounts = CATEGORIES.map((cat) => {
    const count = filtered.filter((r) =>
      cat === "Other"
        ? !CATEGORIES.slice(0, -1).includes(r.accident_category)
        : r.accident_category === cat
    ).length;
    return { cat, count };
  });
  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  // KPI stats
  const totalAccidents = filtered.length;
  const totalFatalities = filtered.filter((r) => r.fatal).length;
  const avgRisk =
    mineRoster.length > 0
      ? Math.round(mineRoster.reduce((s, m) => s + m.risk, 0) / mineRoster.length)
      : 0;

  const officer = { name: "J. Martinez", title: "Senior Compliance Inspector", region: selectedState || "National" };

  const ssCount = SS_VIOLATIONS.length;

  return (
    <section
      id="dashboard"
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        paddingTop: "8vh",
        paddingBottom: "4vh",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="content-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <p className="section-label section-fade" style={{ marginBottom: "24px" }}>
          07 — Inspector Dashboard
        </p>

        <div style={{ height: "96px", overflow: "hidden", marginBottom: "24px" }}>
          <p
            className="section-fade"
            style={{
              fontSize: "clamp(24px, 3.5vw, 38px)",
              fontWeight: 300,
              color: "#f5f5f5",
              lineHeight: 1.2,
              maxWidth: "600px",
            }}
          >
            {activeView === "inspector"
              ? "What an inspector sees when they log in."
              : "What a mine operator sees when they log in."}
          </p>
        </div>

        {/* Mock app chrome */}
        <div
          className="section-fade"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            background: "#0f0f0f",
            overflow: "hidden",
            height: "490px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              background: "#141414",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#f97316",
              }}
            >
              MSHA Safety Portal
            </span>
            <span style={{ flex: 1 }} />

            {/* View toggle pills */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "3px",
              }}
            >
              {(["inspector", "operator"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "capitalize",
                    padding: "3px 10px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    background: activeView === v ? "rgba(249,115,22,0.2)" : "transparent",
                    color: activeView === v ? "#f97316" : "#555",
                    transition: "all 0.15s ease",
                  }}
                >
                  {v === "inspector" ? "Inspector View" : "Operator View"}
                </button>
              ))}
            </div>

            {/* State dropdown */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#aaa",
                fontSize: "11px",
                padding: "4px 8px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Officer badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "4px 10px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "rgba(249,115,22,0.2)",
                  border: "1px solid rgba(249,115,22,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  color: "#f97316",
                  fontWeight: 700,
                }}
              >
                {officer.name[0]}
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#ccc", fontWeight: 500 }}>
                  {officer.name}
                </div>
                <div style={{ fontSize: "9px", color: "#555" }}>{officer.region}</div>
              </div>
            </div>
          </div>

          {/* Content row */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

            {activeView === "inspector" ? (
              <>
                {/* ── INSPECTOR VIEW ── */}

                {/* Left col — Mine Roster */}
                <div
                  style={{
                    width: "210px",
                    flexShrink: 0,
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px 8px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                      }}
                    >
                      Mine Roster — Top Risk
                    </span>
                  </div>
                  <div style={{ overflow: "auto", flex: 1 }}>
                    {mineRoster.map((mine, i) => (
                      <div
                        key={mine.id}
                        style={{
                          padding: "8px 14px",
                          background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#777",
                            fontFamily: "monospace",
                            flexShrink: 0,
                            width: "72px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {mine.id}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: "4px",
                            background: "rgba(255,255,255,0.06)",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${mine.risk}%`,
                              background: "rgba(249,115,22,0.8)",
                              borderRadius: "2px",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#f97316",
                            fontWeight: 600,
                            flexShrink: 0,
                            width: "26px",
                            textAlign: "right",
                          }}
                        >
                          {mine.risk.toFixed(0)}
                        </span>
                      </div>
                    ))}
                    {mineRoster.length === 0 && (
                      <div style={{ padding: "20px 14px", fontSize: "11px", color: "#444" }}>
                        No data
                      </div>
                    )}
                  </div>
                </div>

                {/* Center col */}
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* Category bars */}
                  <div
                    style={{
                      flex: 1,
                      padding: "14px 16px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                        marginBottom: "12px",
                      }}
                    >
                      Accidents by Category
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                      {categoryCounts.map(({ cat, count }) => (
                        <div key={cat} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#555",
                              width: "100px",
                              flexShrink: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {cat}
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: "14px",
                              background: "rgba(249,115,22,0.08)",
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${(count / maxCount) * 100}%`,
                                background: "rgba(249,115,22,0.7)",
                                borderRadius: "3px",
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#777",
                              width: "36px",
                              textAlign: "right",
                              flexShrink: 0,
                            }}
                          >
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KPI chips */}
                  <div
                    style={{
                      padding: "14px 16px",
                      display: "flex",
                      gap: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {[
                      { label: "Total Accidents", value: totalAccidents.toLocaleString() },
                      { label: "Fatalities", value: totalFatalities.toLocaleString() },
                      { label: "Avg Risk Score", value: `${avgRisk}` },
                    ].map((kpi) => (
                      <div
                        key={kpi.label}
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#555",
                            marginBottom: "6px",
                          }}
                        >
                          {kpi.label}
                        </div>
                        <div style={{ fontSize: "20px", fontWeight: 300, color: "#f5f5f5" }}>
                          {kpi.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right col — Alerts & Schedule */}
                <div
                  style={{
                    width: "230px",
                    flexShrink: 0,
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Incident Alerts */}
                  <div style={{ padding: "10px 14px 6px", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                        marginBottom: "10px",
                      }}
                    >
                      Incident Alerts
                    </div>
                    {ALERTS.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: alertDotColor(a.type),
                            flexShrink: 0,
                            marginTop: "3px",
                          }}
                        />
                        <div>
                          <div style={{ fontSize: "10px", color: "#ccc", fontWeight: 500 }}>
                            {a.mine}
                          </div>
                          <div style={{ fontSize: "9px", color: "#555", marginTop: "2px" }}>
                            {a.type} · {a.category}
                          </div>
                          <div style={{ fontSize: "9px", color: "#444", marginTop: "1px" }}>
                            {a.daysAgo}d ago
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      margin: "0 14px",
                      flexShrink: 0,
                    }}
                  />

                  {/* Upcoming Audits */}
                  <div style={{ padding: "10px 14px 6px", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                        marginBottom: "10px",
                      }}
                    >
                      Upcoming Audits
                    </div>
                    {AUDITS.map((a, i) => (
                      <div key={i} style={{ marginBottom: "10px" }}>
                        <div style={{ fontSize: "10px", color: "#ccc", fontWeight: 500 }}>
                          {a.mine}
                        </div>
                        <div style={{ fontSize: "9px", color: "#555", marginTop: "2px" }}>
                          {a.date}
                        </div>
                        <div
                          style={{
                            display: "inline-block",
                            fontSize: "8px",
                            color: "#666",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px",
                            padding: "1px 6px",
                            marginTop: "3px",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {a.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      margin: "0 14px",
                      flexShrink: 0,
                    }}
                  />

                  {/* Assigned Officer */}
                  <div style={{ padding: "10px 14px", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                        marginBottom: "8px",
                      }}
                    >
                      Assigned Officer
                    </div>
                    <div style={{ fontSize: "11px", color: "#ccc", fontWeight: 500 }}>
                      {officer.name}
                    </div>
                    <div style={{ fontSize: "9px", color: "#555", marginTop: "2px" }}>
                      {officer.title}
                    </div>
                    <div style={{ fontSize: "9px", color: "#444", marginTop: "2px" }}>
                      Region: {officer.region}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ── OPERATOR VIEW ── */}

                {/* Left col — Audit Calendar + Contact */}
                <div
                  style={{
                    width: "210px",
                    flexShrink: 0,
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Upcoming Audits */}
                  <div style={{ padding: "10px 14px 8px", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                        marginBottom: "10px",
                      }}
                    >
                      Upcoming Audits
                    </div>
                    {AUDITS.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: a.dot,
                            flexShrink: 0,
                            marginTop: "3px",
                          }}
                        />
                        <div>
                          <div style={{ fontSize: "10px", color: "#ccc", fontWeight: 500 }}>
                            {a.mine}
                          </div>
                          <div style={{ fontSize: "9px", color: "#555", marginTop: "2px" }}>
                            {a.date}
                          </div>
                          <div
                            style={{
                              display: "inline-block",
                              fontSize: "8px",
                              color: "#666",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: "4px",
                              padding: "1px 6px",
                              marginTop: "3px",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {a.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      margin: "0 14px",
                      flexShrink: 0,
                    }}
                  />

                  {/* Contact Inspector */}
                  <div style={{ padding: "10px 14px", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                        marginBottom: "8px",
                      }}
                    >
                      Your Compliance Officer
                    </div>
                    <div style={{ fontSize: "11px", color: "#ccc", fontWeight: 500, marginBottom: "2px" }}>
                      J. Martinez
                    </div>
                    <div style={{ fontSize: "9px", color: "#555", marginBottom: "10px" }}>
                      Senior Inspector
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["📞 Call", "✉ Message"].map((label) => (
                        <button
                          key={label}
                          style={{
                            flex: 1,
                            fontSize: "9px",
                            color: "#888",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px",
                            padding: "4px 6px",
                            cursor: "default",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center col — Incident Report + Hazard Feed */}
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* Quick Incident Report */}
                  <div
                    style={{
                      flex: "0 0 55%",
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                        marginBottom: "2px",
                      }}
                    >
                      Report an Incident
                    </div>
                    <div style={{ fontSize: "9px", color: "#444", marginBottom: "10px" }}>
                      Replaces MSHA Form 7000-1 — digital, structured, real-time
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "10px" }}>
                      {/* Incident Type */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "9px", color: "#555", width: "70px", flexShrink: 0 }}>
                          Incident Type
                        </span>
                        <select
                          style={{
                            flex: 1,
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px",
                            color: "#888",
                            fontSize: "10px",
                            padding: "3px 6px",
                            outline: "none",
                          }}
                        >
                          <option>Powered Haulage</option>
                          <option>Fall of Ground</option>
                          <option>Machinery</option>
                          <option>Electrical</option>
                          <option>Other</option>
                        </select>
                      </div>
                      {/* Location */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "9px", color: "#555", width: "70px", flexShrink: 0 }}>
                          Location
                        </span>
                        <input
                          type="text"
                          placeholder="Shaft level, area"
                          style={{
                            flex: 1,
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px",
                            color: "#888",
                            fontSize: "10px",
                            padding: "3px 6px",
                            outline: "none",
                          }}
                        />
                      </div>
                      {/* Date/Time */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "9px", color: "#555", width: "70px", flexShrink: 0 }}>
                          Date / Time
                        </span>
                        <input
                          type="text"
                          placeholder="Today, auto-filled"
                          style={{
                            flex: 1,
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px",
                            color: "#888",
                            fontSize: "10px",
                            padding: "3px 6px",
                            outline: "none",
                          }}
                        />
                      </div>
                      {/* Severity */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "9px", color: "#555", width: "70px", flexShrink: 0 }}>
                          Severity
                        </span>
                        <select
                          style={{
                            flex: 1,
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px",
                            color: "#888",
                            fontSize: "10px",
                            padding: "3px 6px",
                            outline: "none",
                          }}
                        >
                          <option>Near-Miss</option>
                          <option>Reportable</option>
                          <option>Lost Time</option>
                          <option>Fatality</option>
                        </select>
                      </div>
                    </div>

                    <button
                      style={{
                        background: "rgba(249,115,22,0.15)",
                        border: "1px solid rgba(249,115,22,0.3)",
                        borderRadius: "5px",
                        color: "#f97316",
                        fontSize: "10px",
                        fontWeight: 500,
                        padding: "5px 14px",
                        cursor: "default",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Submit Report →
                    </button>
                  </div>

                  {/* Real-Time Hazard Feed */}
                  <div style={{ flex: 1, padding: "12px 16px", overflow: "hidden" }}>
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#555",
                        fontWeight: 500,
                        marginBottom: "10px",
                      }}
                    >
                      Live Sensor Feed
                    </div>
                    {SENSOR_FEED.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          marginBottom: "9px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: item.dot,
                            flexShrink: 0,
                            marginTop: "3px",
                          }}
                        />
                        <div>
                          <div style={{ fontSize: "10px", color: "#ccc" }}>{item.label}</div>
                          <div style={{ fontSize: "9px", color: "#444", marginTop: "2px" }}>
                            {item.ago}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right col — S&S Violation Tracker */}
                <div
                  style={{
                    width: "230px",
                    flexShrink: 0,
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#555",
                      fontWeight: 500,
                      marginBottom: "2px",
                    }}
                  >
                    S&S Violation Tracker
                  </div>
                  <div style={{ fontSize: "9px", color: "#444", marginBottom: "12px" }}>
                    Pattern of Violations (POV) Monitor
                  </div>

                  {/* Count bar */}
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        height: "8px",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(ssCount / 5) * 100}%`,
                          background: ssCount >= 5 ? "#ef4444" : ssCount >= 3 ? "#f59e0b" : "#555",
                          borderRadius: "4px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "9px", color: "#555" }}>
                      {ssCount} of 5 violations in rolling 12-month window
                    </div>
                  </div>

                  {/* Violation list */}
                  <div style={{ marginBottom: "10px" }}>
                    {SS_VIOLATIONS.map((v) => (
                      <div
                        key={v.num}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "7px",
                          fontSize: "9px",
                        }}
                      >
                        <span style={{ color: "#444", width: "12px", flexShrink: 0 }}>#{v.num}</span>
                        <span style={{ color: "#888", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {v.type}
                        </span>
                        <span style={{ color: "#555", flexShrink: 0 }}>{v.date.split(",")[0]}</span>
                        <span
                          style={{
                            flexShrink: 0,
                            fontSize: "8px",
                            color: v.status === "Open" ? "#f97316" : "#555",
                            background: v.status === "Open" ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${v.status === "Open" ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)"}`,
                            borderRadius: "3px",
                            padding: "1px 5px",
                          }}
                        >
                          {v.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      marginBottom: "10px",
                    }}
                  />

                  {/* Warning box */}
                  {ssCount >= 3 && (
                    <div
                      style={{
                        background: "rgba(245,158,11,0.06)",
                        border: "1px solid rgba(245,158,11,0.25)",
                        borderRadius: "6px",
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: "9px", color: "#f59e0b", fontWeight: 500, marginBottom: "4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        POV Warning
                      </div>
                      <div style={{ fontSize: "9px", color: "#888", lineHeight: 1.6 }}>
                        Approaching POV threshold. {5 - ssCount} more S&S citations within 12 months triggers pattern review.
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
