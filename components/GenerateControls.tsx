"use client";

import { Wand2, Zap, ChevronDown } from "lucide-react";
import { type GenerationMode, type RoomType } from "@/app/page";

interface GenerateControlsProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  roomType: RoomType;
  onRoomTypeChange: (room: RoomType) => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  progress: number;
  canGenerate: boolean;
}

const ROOM_TYPES: RoomType[] = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Dining Room"];

export default function GenerateControls({
  mode, onModeChange, roomType, onRoomTypeChange,
  customPrompt, onCustomPromptChange, onGenerate,
  isGenerating, canGenerate,
}: GenerateControlsProps) {
  return (
    <div style={{
      background: "white",
      borderRadius: "var(--radius)",
      padding: 24,
      boxShadow: "var(--shadow-sm)",
    }}>
      {/* Mode Toggle */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Generation Mode
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          background: "var(--bg-secondary)", borderRadius: 12, padding: 4,
        }}>
          <button
            onClick={() => onModeChange("template")}
            style={{
              padding: "10px 16px", borderRadius: 10, border: "none",
              background: mode === "template" ? "white" : "transparent",
              color: mode === "template" ? "var(--text-primary)" : "var(--text-secondary)",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: mode === "template" ? "var(--shadow-sm)" : "none",
              transition: "all 0.15s",
            }}
          >
            <Wand2 size={14} /> Style Mode
          </button>
          <button
            onClick={() => onModeChange("auto")}
            style={{
              padding: "10px 16px", borderRadius: 10, border: "none",
              background: mode === "auto" ? "white" : "transparent",
              color: mode === "auto" ? "var(--text-primary)" : "var(--text-secondary)",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: mode === "auto" ? "var(--shadow-sm)" : "none",
              transition: "all 0.15s",
            }}
          >
            <Zap size={14} /> Auto Mode
          </button>
        </div>
      </div>

      {/* Room Type */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Room Type
        </p>
        <div style={{ position: "relative" }}>
          <select
            value={roomType}
            onChange={(e) => onRoomTypeChange(e.target.value as RoomType)}
            style={{
              width: "100%", padding: "12px 40px 12px 16px",
              borderRadius: 12, border: "2px solid var(--border)",
              background: "white", fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, color: "var(--text-primary)", cursor: "pointer",
              appearance: "none", outline: "none", fontWeight: 500,
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
          >
            {ROOM_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown size={16} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Custom Prompt */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Custom Instructions <span style={{ fontWeight: 400, textTransform: "none", color: "var(--text-muted)" }}>(optional)</span>
        </p>
        <textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder="e.g. 'Add warm lighting, marble floors, a fireplace, plants near windows...'"
          rows={3}
          style={{
            width: "100%", padding: "12px 16px",
            borderRadius: 12, border: "2px solid var(--border)",
            background: "white", fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, color: "var(--text-primary)", resize: "none", outline: "none",
            lineHeight: 1.5, transition: "border-color 0.2s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
        />
      </div>

      {/* Generate Button */}
      <button
        className="btn-primary"
        onClick={onGenerate}
        disabled={isGenerating || !canGenerate}
        style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: 16 }}
      >
        {isGenerating ? (
          <>
            <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Designing your room...
          </>
        ) : (
          <>
            <Wand2 size={18} />
            {mode === "auto" ? "Generate 5 Variations" : "Generate Design"}
          </>
        )}
      </button>

      {!canGenerate && (
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
          Upload a room photo to get started
        </p>
      )}
    </div>
  );
}
