"use client";

export default function HeroSection() {
  return (
    <div style={{
      textAlign: "center",
      padding: "40px 24px 32px",
      maxWidth: 640,
      margin: "0 auto",
    }}>

      <h1 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "clamp(34px, 5vw, 54px)",
        fontWeight: 800,
        lineHeight: 1.15,
        marginBottom: 16,
        letterSpacing: "-0.5px",
        color: "var(--text-primary)",
      }}>
        Transform any room
        <br />
        <span style={{ color: "var(--accent)" }}>with InterioAI</span>
      </h1>
      <p style={{
        fontSize: 16,
        color: "var(--text-secondary)",
        lineHeight: 1.6,
        marginBottom: 0,
      }}>
        Upload a photo of your empty room and watch <span style={{ color: "var(--accent)", fontWeight: 600 }}>InterioAI</span> create stunning interior designs in seconds. Choose from 8 styles or let <span style={{ color: "var(--accent)", fontWeight: 600 }}>InterioAI</span> surprise you.
      </p>
    </div>
  );
}
