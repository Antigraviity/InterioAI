"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";

export type ViewerImage = {
  id: number;
  image: string;
  title: string;
  tags: string[];
  style: string;
  likes: number;
};

interface ImageViewerProps {
  images: ViewerImage[];
  initialIndex: number;
  likedItems: Set<number>;
  onToggleLike: (id: number) => void;
  onUseStyle: (style: string) => void;
  onClose: () => void;
}

export default function ImageViewer({
  images, initialIndex, likedItems, onToggleLike, onUseStyle, onClose,
}: ImageViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const item = images[index];

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => setIndex(initialIndex), [initialIndex]);

  const isLiked = likedItems.has(item.id);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(10,10,10,0.96)",
        display: "flex", flexDirection: "column",
        animation: "fadeIn 0.15s ease",
      }}
    >
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", flexShrink: 0,
      }}>
        <span style={{
          color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 500,
        }}>
          {index + 1} <span style={{ opacity: 0.4 }}>/</span> {images.length}
        </span>

        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700, fontSize: 15, color: "white", opacity: 0.7,
        }}>
          {item.title}
        </span>

        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "white", transition: "background 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        >
          <X size={16} />
        </button>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: 0 }}>

        {/* Left: image + nav */}
        <div style={{
          flex: 1, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 72px",
        }}>
          {/* Image */}
          <img
            key={item.image}
            src={item.image}
            alt={item.title}
            style={{
              maxWidth: "100%", maxHeight: "100%",
              objectFit: "contain", borderRadius: 12,
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              display: "block",
              animation: "fadeIn 0.2s ease",
            }}
          />

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "white", backdropFilter: "blur(8px)",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "white", backdropFilter: "blur(8px)",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Right: info panel */}
        <div style={{
          width: 300, flexShrink: 0,
          background: "rgba(255,255,255,0.04)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column",
          padding: "28px 24px 24px",
          overflowY: "auto",
          gap: 20,
        }}>
          {/* Style badge */}
          <span style={{
            alignSelf: "flex-start",
            background: "rgba(230,0,35,0.15)",
            color: "#ff4d6d",
            borderRadius: 20, padding: "5px 14px",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.5px",
            border: "1px solid rgba(230,0,35,0.25)",
          }}>
            {item.style}
          </span>

          {/* Title + tags */}
          <div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 22, fontWeight: 800, lineHeight: 1.25,
              color: "white", marginBottom: 12,
            }}>
              {item.title}
            </h2>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {item.tags.map((tag) => (
                <span key={tag} style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                  borderRadius: 8, padding: "3px 10px",
                  fontSize: 11, fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

          {/* Likes */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Heart
              size={15}
              fill={isLiked ? "#ff4d6d" : "none"}
              color={isLiked ? "#ff4d6d" : "rgba(255,255,255,0.4)"}
            />
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              {(item.likes + (isLiked ? 1 : 0)).toLocaleString()} likes
            </span>
          </div>

          {/* Thumbnail strip */}
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)",
              marginBottom: 10, textTransform: "uppercase", letterSpacing: "1px",
            }}>
              More styles
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {images.slice(0, 6).map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => setIndex(i)}
                  style={{
                    aspectRatio: "4/3", borderRadius: 8, overflow: "hidden",
                    cursor: "pointer",
                    border: `2px solid ${i === index ? "#ff4d6d" : "transparent"}`,
                    opacity: i === index ? 1 : 0.55,
                    transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => { if (i !== index) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                  onMouseOut={(e) => { if (i !== index) (e.currentTarget as HTMLElement).style.opacity = "0.55"; }}
                >
                  <img src={img.image} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => onUseStyle(item.style)}
              style={{
                width: "100%", padding: "13px",
                background: "var(--accent)", color: "white",
                border: "none", borderRadius: 12, cursor: "pointer",
                fontFamily: "inherit", fontSize: 14, fontWeight: 700,
                transition: "opacity 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Use this style
            </button>
            <button
              onClick={() => onToggleLike(item.id)}
              style={{
                width: "100%", padding: "11px",
                background: isLiked ? "rgba(230,0,35,0.15)" : "rgba(255,255,255,0.06)",
                color: isLiked ? "#ff4d6d" : "rgba(255,255,255,0.6)",
                border: `1.5px solid ${isLiked ? "rgba(230,0,35,0.3)" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 12, cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.15s",
              }}
            >
              <Heart size={14} fill={isLiked ? "#ff4d6d" : "none"} color={isLiked ? "#ff4d6d" : "currentColor"} />
              {isLiked ? "Saved to Favourites" : "Save to Favourites"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom keyboard hint */}
      <div style={{
        textAlign: "center", padding: "12px",
        color: "rgba(255,255,255,0.2)", fontSize: 11,
        display: "flex", justifyContent: "center", gap: 20, flexShrink: 0,
      }}>
        <span>← → navigate</span>
        <span>·</span>
        <span>Esc to close</span>
      </div>
    </div>
  );
}
