"use client";

import { useState } from "react";

const ANIMATION_STYLES = `
  @keyframes travel-ltr {
    0%   { transform: translateX(0px); opacity: 1; }
    100% { transform: translateX(180px); opacity: 0; }
  }
  @keyframes travel-rtl {
    0%   { transform: translateX(0px); opacity: 1; }
    100% { transform: translateX(-180px); opacity: 0; }
  }
  @keyframes broadcast-ring {
    0%   { r: 6; opacity: 1; }
    100% { r: 50; opacity: 0; }
  }
  @keyframes warning-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.15); opacity: 0.5; }
  }
  @keyframes zone-flash {
    0%, 100% { fill-opacity: 0.05; }
    50%       { fill-opacity: 0.18; }
  }
`;

type Category = "Powered Haulage" | "Machinery" | "Electrical" | "Explosives" | "Slip/Fall";

const CATEGORIES: Category[] = ["Powered Haulage", "Machinery", "Electrical", "Explosives", "Slip/Fall"];

const SCENARIOS: Record<Category, { scenario: string; response: string }> = {
  "Powered Haulage": {
    scenario: "Worker detected in haul truck blind spot during backing maneuver.",
    response: "Proximity alert transmitted to truck cab. Auto-brake engaged. Supervisor notified within 2 seconds.",
  },
  "Machinery": {
    scenario: "Conveyor belt entanglement risk — worker within 0.5m of rotating components.",
    response: "Emergency stop signal sent to conveyor. 'STOP' lockout indicator activated on equipment panel.",
  },
  "Electrical": {
    scenario: "Voltage anomaly detected on panel — risk of arc flash within worker range.",
    response: "Alert propagated to worker wearable. Zone lockout requested. Electrical inspector dispatched.",
  },
  "Explosives": {
    scenario: "Blast zone perimeter breach — unauthorized worker entry detected.",
    response: "Zone lockdown initiated. All entry points sealed. Blast sequence paused pending clearance.",
  },
  "Slip/Fall": {
    scenario: "Base station detects worker fall signature — accelerometer spike on wearable.",
    response: "Emergency broadcast to all nearby workers. Location transmitted to rescue team within 1 second.",
  },
};

function SVGDiagram({ category }: { category: Category }) {
  const isElectrical = category === "Electrical";
  const isExplosives = category === "Explosives";
  const isSlipFall = category === "Slip/Fall";
  const isMachinery = category === "Machinery";

  const equipmentLabel =
    category === "Powered Haulage" ? "HAUL TRUCK" :
    category === "Machinery" ? "CONVEYOR" :
    category === "Electrical" ? "PANEL" :
    category === "Explosives" ? "BLAST ZONE" : "BASE STATION";

  return (
    <svg viewBox="0 0 480 280" style={{ width: "100%", height: "auto" }}>
      {/* Zone flash background for Explosives */}
      {isExplosives && (
        <rect
          x="0" y="0" width="480" height="280"
          fill="#f97316"
          style={{ animation: "zone-flash 1.2s ease-in-out infinite" }}
        />
      )}

      {/* Background */}
      <rect x="0" y="0" width="480" height="280" fill="#0a0a0a" fillOpacity={isExplosives ? 0 : 1} />
      <rect x="0" y="0" width="480" height="280" fill="#111" fillOpacity={isExplosives ? 0 : 0.6} />

      {/* Grid lines */}
      {[80, 160, 240, 320, 400].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}
      {[70, 140, 210].map((y) => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}

      {/* ─── Worker figure (left, x=100) ─── */}
      {/* Head */}
      <circle cx="100" cy="100" r="14" fill="#333" stroke="#f97316" strokeWidth="1.5" />
      {/* Body */}
      <rect x="90" y="118" width="20" height="36" rx="4" fill="#333" />
      {/* Legs */}
      <line x1="95" y1="154" x2="90" y2="176" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      <line x1="105" y1="154" x2="110" y2="176" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      {/* Worker label */}
      <text x="100" y="196" textAnchor="middle" fill="#555" fontSize="9" letterSpacing="0.15em">WORKER</text>

      {/* Worker sensor dot */}
      <circle cx="100" cy="100" r="20" fill="none" stroke="#f97316" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* ─── Equipment figure (right, x=360) ─── */}
      <rect x="322" y="86" width="76" height="68" rx="6" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
      <text x="360" y="120" textAnchor="middle" fill="#555" fontSize="8" letterSpacing="0.12em">{equipmentLabel}</text>
      {/* Machinery STOP text */}
      {isMachinery && (
        <text x="360" y="136" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="700" letterSpacing="0.2em">STOP</text>
      )}
      {/* Padlock for Explosives */}
      {isExplosives && (
        <g transform="translate(342, 104)">
          <rect x="0" y="8" width="20" height="14" rx="2" fill="#f97316" fillOpacity="0.8" />
          <path d="M4 8 Q4 0 10 0 Q16 0 16 8" fill="none" stroke="#f97316" strokeWidth="2" />
        </g>
      )}
      <text x="360" y="174" textAnchor="middle" fill="#444" fontSize="9" letterSpacing="0.15em">EQUIPMENT</text>

      {/* ─── Signal animations ─── */}

      {/* LTR signals (Powered Haulage, Machinery) */}
      {(category === "Powered Haulage" || category === "Machinery") && [0, 0.4, 0.8].map((delay, i) => (
        <circle
          key={i}
          cx="130"
          cy="136"
          r="5"
          fill="#f97316"
          fillOpacity="0.8"
          style={{ animation: `travel-ltr 1.6s ease-in-out infinite`, animationDelay: `${delay}s` }}
        />
      ))}

      {/* RTL signals (Electrical) */}
      {isElectrical && [0, 0.4, 0.8].map((delay, i) => (
        <circle
          key={i}
          cx="320"
          cy="136"
          r="5"
          fill="#f97316"
          fillOpacity="0.8"
          style={{ animation: `travel-rtl 1.6s ease-in-out infinite`, animationDelay: `${delay}s` }}
        />
      ))}

      {/* Broadcast rings (Slip/Fall) */}
      {isSlipFall && [0, 0.5, 1.0].map((delay, i) => (
        <circle
          key={i}
          cx="100"
          cy="136"
          r="6"
          fill="none"
          stroke="#f97316"
          strokeWidth="1.5"
          style={{ animation: `broadcast-ring 1.8s ease-out infinite`, animationDelay: `${delay}s` }}
        />
      ))}

      {/* ─── Warning indicators ─── */}

      {/* Warning above equipment (Powered Haulage, Machinery) */}
      {(category === "Powered Haulage" || category === "Machinery") && (
        <g style={{ animation: "warning-pulse 1s ease-in-out infinite", transformOrigin: "360px 62px" }}>
          <polygon points="360,46 374,72 346,72" fill="none" stroke="#f97316" strokeWidth="2" />
          <text x="360" y="68" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="700">!</text>
        </g>
      )}

      {/* Warning above worker (Electrical) */}
      {isElectrical && (
        <g style={{ animation: "warning-pulse 1s ease-in-out infinite", transformOrigin: "100px 62px" }}>
          <polygon points="100,46 114,72 86,72" fill="none" stroke="#f97316" strokeWidth="2" />
          <text x="100" y="68" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="700">!</text>
        </g>
      )}

      {/* Broadcast ring for Slip/Fall warning */}
      {isSlipFall && (
        <g style={{ animation: "warning-pulse 1.2s ease-in-out infinite", transformOrigin: "100px 62px" }}>
          <circle cx="100" cy="60" r="12" fill="none" stroke="#f97316" strokeWidth="1.5" />
          <text x="100" y="65" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="700">SOS</text>
        </g>
      )}

      {/* Connection line */}
      <line
        x1="120" y1="136" x2="322" y2="136"
        stroke="rgba(249,115,22,0.12)"
        strokeWidth="1"
        strokeDasharray="6 4"
      />

      {/* Caption */}
      <text x="240" y="256" textAnchor="middle" fill="#333" fontSize="10" letterSpacing="0.08em">
        Select a category to change the hazard scenario
      </text>
    </svg>
  );
}

export default function FutureSafetyNetwork() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Powered Haulage");
  const scenario = SCENARIOS[selectedCategory];

  return (
    <section
      id="network"
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
      <style>{ANIMATION_STYLES}</style>

      <div className="content-wrap">
        <p className="section-label section-fade" style={{ marginBottom: "24px" }}>
          08 — Future Direction
        </p>

        <p
          className="section-fade"
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 300,
            color: "#f5f5f5",
            lineHeight: 1.2,
            marginBottom: "12px",
            maxWidth: "680px",
          }}
        >
          Real-Time Mine Safety Network
        </p>

        <p
          className="section-fade"
          style={{ color: "#666", fontSize: "16px", marginBottom: "48px", maxWidth: "560px" }}
        >
          Moving from reactive reporting to proactive hazard detection.
        </p>

        {/* Category pills */}
        <div
          className="section-fade"
          style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pill-filter${selectedCategory === cat ? " active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Two-column grid */}
        <div
          className="section-fade"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* LEFT — text */}
          <div>
            <div style={{ marginBottom: "40px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f97316", marginBottom: "8px" }}>
                Worker Sensor Network
              </p>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.8 }}>
                Wearable sensors on each worker broadcast location, biometrics, and motion data. Proximity alerts fire when a worker enters a hazard zone.
              </p>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f97316", marginBottom: "8px" }}>
                Equipment Integration
              </p>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.8 }}>
                Haul trucks, conveyors, and electrical panels stream telemetry. Anomaly detection models run on-edge to minimize latency.
              </p>
            </div>

            {/* Active scenario box */}
            <div
              style={{
                borderLeft: "2px solid #f97316",
                paddingLeft: "20px",
                background: "rgba(249,115,22,0.04)",
                borderRadius: "0 8px 8px 0",
                padding: "20px 20px 20px 22px",
              }}
            >
              <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f97316", marginBottom: "12px" }}>
                Active Scenario — {selectedCategory}
              </p>
              <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.7, marginBottom: "12px" }}>
                {scenario.scenario}
              </p>
              <p style={{ color: "#555", fontSize: "12px", lineHeight: 1.7 }}>
                <span style={{ color: "#f97316" }}>Response:</span> {scenario.response}
              </p>
            </div>
          </div>

          {/* RIGHT — SVG diagram */}
          <div>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#0a0a0a",
              }}
            >
              <SVGDiagram key={selectedCategory} category={selectedCategory} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
