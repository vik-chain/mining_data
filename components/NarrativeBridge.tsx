"use client";

export default function NarrativeBridge({ text }: { text: string }) {
  return (
    <div className="content-wrap py-0">
      <div className="flex items-center gap-6">
        <div style={{ flex: 1, height: "1px", background: "rgba(249,115,22,0.3)" }} />
        <p
          style={{
            fontStyle: "italic",
            color: "#555",
            fontSize: "15px",
            lineHeight: 1.6,
            maxWidth: "440px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {text}
        </p>
        <div style={{ flex: 1, height: "1px", background: "rgba(249,115,22,0.3)" }} />
      </div>
    </div>
  );
}
