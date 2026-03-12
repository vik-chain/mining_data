"use client";


export default function InspectionSimulator() {
  return (
    <section
      id="inspection"
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
        {/* Label */}
        <p className="section-label section-fade" style={{ marginBottom: "24px" }}>
          05 — Inspections
        </p>

        <p
          className="section-fade"
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 300,
            color: "#f5f5f5",
            lineHeight: 1.2,
            marginBottom: "64px",
            maxWidth: "600px",
          }}
        >
          Random inspections miss the deadliest mines.
        </p>

        {/* Contrast cards */}
        <div
          className="section-fade"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "24px",
            alignItems: "center",
            marginBottom: "64px",
          }}
        >
          {/* Random card */}
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "40px 32px",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#444",
                marginBottom: "32px",
              }}
            >
              Random Inspection
            </p>
            <div
              style={{
                fontSize: "clamp(48px, 6vw, 72px)",
                fontWeight: 700,
                color: "#555",
                lineHeight: 1,
                marginBottom: "12px",
              }}
            >
              20%
            </div>
            <p style={{ color: "#444", fontSize: "13px" }}>
              high-risk mines caught
            </p>
            <div
              style={{
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p style={{ color: "#444", fontSize: "12px", lineHeight: 1.6 }}>
                Chance-based. Fair by lottery,
                <br />
                not by risk.
              </p>
            </div>
          </div>

          {/* Delta */}
          <div style={{ textAlign: "center", padding: "0 8px" }}>
            <div
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 700,
                color: "#f97316",
                lineHeight: 1,
              }}
            >
              4×
            </div>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#555",
                marginTop: "8px",
              }}
            >
              difference
            </p>
          </div>

          {/* Risk-based card */}
          <div
            style={{
              border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: "12px",
              padding: "40px 32px",
              background: "rgba(249,115,22,0.04)",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#f97316",
                marginBottom: "32px",
              }}
            >
              Risk-Based Inspection
            </p>
            <div
              style={{
                fontSize: "clamp(48px, 6vw, 72px)",
                fontWeight: 700,
                color: "#f97316",
                lineHeight: 1,
                marginBottom: "12px",
              }}
            >
              80%
            </div>
            <p style={{ color: "#888", fontSize: "13px" }}>
              high-risk mines caught
            </p>
            <div
              style={{
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(249,115,22,0.1)",
              }}
            >
              <p style={{ color: "#666", fontSize: "12px", lineHeight: 1.6 }}>
                Prioritize by composite score.
                <br />
                Same resources, better outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario note */}
        <p
          className="section-fade"
          style={{ color: "#333", fontSize: "12px", letterSpacing: "0.04em" }}
        >
          Scenario: 20% of mines inspected per quarter. Risk-based targeting
          concentrates effort on highest-score operations.
        </p>
      </div>
    </section>
  );
}
