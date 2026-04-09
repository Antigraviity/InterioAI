"use client";

import { useCallback, useRef, useState } from "react";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function ComparisonSlider({ beforeImage, afterImage }: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updatePosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="comparison-slider"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      style={{ width: "100%", maxHeight: 480, cursor: "ew-resize", userSelect: "none" }}
    >
      {/* After image (base) */}
      <img
        src={afterImage}
        alt="After"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", maxHeight: 480 }}
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div style={{
        position: "absolute",
        inset: 0,
        width: `${position}%`,
        overflow: "hidden",
      }}>
        <img
          src={beforeImage}
          alt="Before"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            maxHeight: 480,
          }}
          draggable={false}
        />
      </div>

      {/* Slider handle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          width: 3,
          background: "white",
          transform: "translateX(-50%)",
          zIndex: 10,
          boxShadow: "0 0 8px rgba(0,0,0,0.3)",
        }}
      >
        {/* Circle handle */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 44,
          height: 44,
          background: "white",
          borderRadius: "50%",
          boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}>
          <div style={{ display: "flex", gap: 2 }}>
            {["◄", "►"].map((arrow, i) => (
              <span key={i} style={{ fontSize: 10, color: "var(--text-secondary)" }}>{arrow}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.7)", color: "white", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, backdropFilter: "blur(4px)" }}>
        Before
      </div>
      <div style={{ position: "absolute", top: 12, right: 12, background: "var(--accent)", color: "white", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
        After
      </div>
    </div>
  );
}
