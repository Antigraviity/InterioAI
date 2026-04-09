"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, ImagePlus } from "lucide-react";

interface UploadSectionProps {
  uploadedImage: string | null;
  onUpload: (imageUrl: string, file: File) => void;
  onClear: () => void;
}

export default function UploadSection({ uploadedImage, onUpload, onClear }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) onUpload(e.target.result as string, file);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <div style={{
      background: "white",
      borderRadius: "var(--radius)",
      padding: 24,
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 32, height: 32, background: "var(--accent-soft)",
          borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <ImagePlus size={16} color="var(--accent)" />
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Upload Room Photo</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>JPG or PNG, up to 10MB</p>
        </div>
      </div>

      {uploadedImage ? (
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
          <img
            src={uploadedImage}
            alt="Uploaded room"
            style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%)",
          }} />
          <button
            onClick={onClear}
            style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(0,0,0,0.6)", color: "white",
              border: "none", borderRadius: "50%", width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(4px)",
            }}
          >
            <X size={14} />
          </button>
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,0,0,0.6)", color: "white",
            borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600,
            backdropFilter: "blur(4px)",
          }}>
            ✓ Ready to design
          </div>
        </div>
      ) : (
        <div
          className={`upload-zone ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: 48,
            textAlign: "center",
            cursor: "pointer",
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div style={{
            width: 64, height: 64,
            background: isDragging ? "var(--accent-soft)" : "var(--bg-secondary)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            <Upload size={28} color={isDragging ? "var(--accent)" : "var(--text-muted)"} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: isDragging ? "var(--accent)" : "var(--text-primary)", marginBottom: 4 }}>
              {isDragging ? "Drop your image here" : "Drag & drop or click to upload"}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Upload an empty room photo to get started
            </p>
          </div>
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center"
          }}>
            {["Living Room", "Bedroom", "Kitchen", "Office"].map((t) => (
              <span key={t} style={{
                background: "var(--bg-secondary)", borderRadius: 12,
                padding: "4px 10px", fontSize: 12, color: "var(--text-secondary)"
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
