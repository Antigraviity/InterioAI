"use client";

import React from "react";
import { LayoutGrid, Zap, CheckCircle2, Search, ArrowRight } from "lucide-react";
import { type DesignStyle, type GenerationMode } from "@/app/page";
import { INSPIRATION_ITEMS } from "@/lib/data";

interface StyleSelectorProps {
  selectedStyle: DesignStyle | null;
  onStyleSelect: (style: DesignStyle) => void;
  mode: GenerationMode;
  onExploreMore: () => void;
}

// Deduplicate: one card per unique style (first occurrence), using real images
const templates = Array.from(
  INSPIRATION_ITEMS.reduce((map, item) => {
    if (!map.has(item.style)) map.set(item.style, item);
    return map;
  }, new Map<DesignStyle, typeof INSPIRATION_ITEMS[0]>()).values()
).map((item) => ({
  name: item.style,
  title: item.title,
  image: item.image,
  tags: item.tags,
}));

export default function StyleSelector({ selectedStyle, onStyleSelect, mode, onExploreMore }: StyleSelectorProps) {
  const [query, setQuery] = React.useState("");

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{
      background: "white",
      borderRadius: "var(--radius)",
      padding: 24,
      boxShadow: "var(--shadow-sm)",
      flex: 1,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, background: "#fff5f5",
          borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <LayoutGrid size={16} color="var(--accent)" />
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Templates</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {mode === "auto" ? "Auto mode will generate all styles" : "Pick a style to transform your room"}
          </p>
        </div>
        {mode === "auto" && (
          <div style={{
            marginLeft: "auto",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white", borderRadius: 20, padding: "4px 12px",
            fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4,
          }}>
            <Zap size={12} /> Auto
          </div>
        )}
      </div>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={14} color="var(--text-muted)" style={{
          position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none"
        }} />
        <input
          type="text"
          placeholder="Search styles or tags…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%", padding: "8px 10px 8px 30px", fontSize: 13,
            border: "1.5px solid #e5e7eb", borderRadius: 8, outline: "none",
            background: "var(--bg-secondary)", color: "var(--text-primary)",
            fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: 16, lineHeight: 1, padding: 0,
            }}
          >×</button>
        )}
      </div>

      {/* Template grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14,
        opacity: mode === "auto" ? 0.5 : 1,
        pointerEvents: mode === "auto" ? "none" : "auto",
        transition: "opacity 0.2s",
      }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13 }}>
            No styles match "<strong>{query}</strong>"
          </div>
        )}
        {filtered.map((tpl) => {
          const isSelected = selectedStyle === tpl.name;
          return (
            <div
              key={tpl.name}
              onClick={() => onStyleSelect(tpl.name)}
              className="template-card"
              style={{
                borderRadius: 12, overflow: "hidden",
                border: `2.5px solid ${isSelected ? "var(--accent)" : "transparent"}`,
                boxShadow: isSelected ? "0 0 0 3px rgba(230,0,35,0.12)" : "0 1px 4px rgba(0,0,0,0.08)",
                cursor: "pointer", transition: "all 0.18s ease",
                background: "var(--bg-secondary)", position: "relative", aspectRatio: "4/3",
              }}
            >
              <img
                src={tpl.image}
                alt={tpl.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.35s ease" }}
                className="template-img"
              />

              {isSelected && (
                <div style={{
                  position: "absolute", top: 8, right: 8, background: "var(--accent)",
                  borderRadius: "50%", width: 22, height: 22,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)", zIndex: 2,
                }}>
                  <CheckCircle2 size={14} color="white" />
                </div>
              )}

              <div className="template-overlay" style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "12px", opacity: isSelected ? 1 : 0, transition: "opacity 0.22s ease",
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 3 }}>{tpl.name}</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {tpl.tags.map((tag) => (
                    <span key={tag} style={{
                      background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 6,
                      padding: "2px 7px", fontSize: 10, fontWeight: 600,
                      backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.25)",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="template-name" style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
                color: "white", fontWeight: 600, fontSize: 12, padding: "18px 10px 8px",
                transition: "opacity 0.22s ease", opacity: isSelected ? 0 : 1,
              }}>
                {tpl.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore more button */}
      {!query && (
        <button
          onClick={onExploreMore}
          style={{
            marginTop: 16, width: "100%", padding: "11px 16px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "var(--bg-secondary)", border: "1.5px solid #e5e7eb",
            borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
            fontSize: 13, fontWeight: 600, color: "var(--text-secondary)",
            transition: "all 0.18s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
            e.currentTarget.style.background = "#fff5f5";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "var(--bg-secondary)";
          }}
        >
          Explore more styles
          <ArrowRight size={14} />
        </button>
      )}

      {mode === "auto" && (
        <div style={{
          marginTop: 16, padding: "14px 16px",
          background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
          borderRadius: 12, border: "1px solid rgba(102,126,234,0.2)",
          fontSize: 13, color: "#5a5ab5", fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Zap size={16} />
          Auto mode will generate 5 unique variations across different styles automatically
        </div>
      )}
    </div>
  );
}
