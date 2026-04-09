"use client";

import { Download, Heart, Maximize2, ArrowLeftRight, Plus } from "lucide-react";
import { type GeneratedImage } from "@/app/page";

interface ResultsGalleryProps {
  images: GeneratedImage[];
  originalImage: string | null;
  onLike: (id: string) => void;
  onDownload: (url: string, name: string) => void;
  onCompare: (img: GeneratedImage) => void;
  onGenerate: () => void;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export default function ResultsGallery({
  images, originalImage, onLike, onDownload, onCompare, onGenerate
}: ResultsGalleryProps) {
  if (images.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: 400, gap: 20,
        background: "white", borderRadius: "var(--radius)", padding: 60,
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{
          width: 80, height: 80, background: "var(--bg-secondary)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Maximize2 size={32} color="var(--text-muted)" />
        </div>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 8 }}>
            Your designs will appear here
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 360 }}>
            Upload a room photo and generate designs to see your AI-powered interior transformations
          </p>
        </div>
        <button className="btn-primary" onClick={onGenerate}>
          <Plus size={16} /> Start Designing
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20,
      }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 2 }}>
            Your Designs
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {images.length} design{images.length !== 1 ? "s" : ""} generated
          </p>
        </div>
        <button className="btn-primary" onClick={onGenerate} style={{ padding: "10px 20px", fontSize: 14 }}>
          <Plus size={14} /> New Design
        </button>
      </div>

      {/* Masonry grid */}
      <div className="masonry-grid">
        {/* Original image card */}
        {originalImage && (
          <div className="masonry-item">
            <div className="pin-card">
              <img src={originalImage} alt="Original room" style={{ width: "100%", display: "block" }} />
              <div className="pin-overlay">
                <div style={{
                  background: "rgba(0,0,0,0.7)", borderRadius: 20,
                  padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "white",
                  alignSelf: "flex-start",
                }}>
                  Original
                </div>
              </div>
            </div>
          </div>
        )}

        {images.map((img, index) => (
          <div
            key={img.id}
            className="masonry-item animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="pin-card">
              <img
                src={img.url}
                alt={`${img.style} design`}
                style={{ width: "100%", display: "block" }}
              />
              <div className="pin-overlay">
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{
                    background: "var(--accent)", color: "white",
                    borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700,
                  }}>
                    {img.style}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onLike(img.id); }}
                    style={{
                      background: img.liked ? "var(--accent)" : "rgba(0,0,0,0.6)",
                      border: "none", borderRadius: "50%", width: 36, height: 36,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", backdropFilter: "blur(4px)",
                      transition: "all 0.2s",
                    }}
                  >
                    <Heart size={16} color="white" fill={img.liked ? "white" : "none"} />
                  </button>
                </div>

                {/* Bottom row */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDownload(img.url, `design-${img.style.toLowerCase()}.jpg`); }}
                    style={{
                      flex: 1, background: "rgba(0,0,0,0.6)", border: "none",
                      borderRadius: 20, padding: "8px 12px", color: "white",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      backdropFilter: "blur(4px)", fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.8)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.6)"; }}
                  >
                    <Download size={12} /> Download
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onCompare(img); }}
                    style={{
                      background: "rgba(0,0,0,0.6)", border: "none",
                      borderRadius: 20, padding: "8px 12px", color: "white",
                      fontSize: 12, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4,
                      backdropFilter: "blur(4px)", fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <ArrowLeftRight size={12} />
                  </button>
                </div>
              </div>

              {/* Info below image */}
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{img.style} Design</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(img.createdAt)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
