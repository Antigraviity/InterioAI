"use client";

import React, { useState } from "react";
import { Heart, Search, LayoutGrid, List, Maximize2, Home, Sofa, BedDouble, ChefHat, ShowerHead, Briefcase, UtensilsCrossed } from "lucide-react";
import { type DesignStyle } from "@/app/page";
import { INSPIRATION_ITEMS, STYLE_CATEGORIES, ROOM_CATEGORIES, type RoomCategory } from "@/lib/data";
import ImageViewer from "@/components/ImageViewer";

interface InspirationFeedProps {
  onUseIdea: (style: DesignStyle) => void;
}

const ROOM_ICONS: Record<RoomCategory, React.ReactNode> = {
  "Living Room": <Sofa size={13} />,
  "Bedroom":     <BedDouble size={13} />,
  "Kitchen":     <ChefHat size={13} />,
  "Bathroom":    <ShowerHead size={13} />,
  "Office":      <Briefcase size={13} />,
  "Dining Room": <UtensilsCrossed size={13} />,
};

export default function InspirationFeed({ onUseIdea }: InspirationFeedProps) {
  const [activeStyle, setActiveStyle] = useState("All");
  const [activeRoom, setActiveRoom] = useState<RoomCategory | "All">("All");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [showFavourites, setShowFavourites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const toggleLike = (id: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Apply filters
  let items = showFavourites
    ? INSPIRATION_ITEMS.filter((i) => likedItems.has(i.id))
    : INSPIRATION_ITEMS;

  if (activeStyle !== "All")
    items = items.filter((i) => i.style === activeStyle || i.tags.includes(activeStyle));

  if (activeRoom !== "All")
    items = items.filter((i) => i.room === activeRoom);

  if (searchQuery.trim())
    items = items.filter((i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      i.room.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filtered = items;

  const pillBase: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 24, border: "1.5px solid var(--border)",
    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
    background: "white", color: "var(--text-secondary)",
    transition: "all 0.15s ease", whiteSpace: "nowrap",
  };

  const pillActive: React.CSSProperties = {
    ...pillBase,
    background: "var(--text-primary)", color: "white",
    borderColor: "var(--text-primary)",
  };

  return (
    <div>
      {/* Lightbox */}
      {viewerIndex !== null && (
        <ImageViewer
          images={filtered}
          initialIndex={viewerIndex}
          likedItems={likedItems}
          onToggleLike={toggleLike}
          onUseStyle={(style) => { onUseIdea(style as DesignStyle); setViewerIndex(null); }}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
            Explore
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Browse stunning interiors and use them as your design starting point
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* View toggle */}
          <div style={{
            display: "flex", alignItems: "center",
            background: "white", border: "1.5px solid var(--border)",
            borderRadius: 24, padding: 3, gap: 2,
          }}>
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={`${mode} view`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 20, border: "none",
                  cursor: "pointer", transition: "all 0.15s ease",
                  background: viewMode === mode ? "var(--text-primary)" : "transparent",
                  color: viewMode === mode ? "white" : "var(--text-muted)",
                }}
              >
                {mode === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>

          {/* Favourites */}
          <button
            onClick={() => setShowFavourites(!showFavourites)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
              background: showFavourites ? "var(--accent)" : "white",
              color: showFavourites ? "white" : "var(--text-primary)",
              border: `1.5px solid ${showFavourites ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 24, fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.18s ease",
              boxShadow: showFavourites ? "0 2px 12px rgba(230,0,35,0.25)" : "none",
            }}
          >
            <Heart size={15} fill={showFavourites ? "white" : "none"} color={showFavourites ? "white" : "var(--accent)"} />
            Favourites
            {likedItems.size > 0 && (
              <span style={{
                background: showFavourites ? "rgba(255,255,255,0.3)" : "var(--accent)",
                color: "white", borderRadius: 10, padding: "0 7px",
                fontSize: 11, fontWeight: 700, minWidth: 18, textAlign: "center",
              }}>
                {likedItems.size}
              </span>
            )}
          </button>

          {likedItems.size > 0 && (
            <button
              onClick={() => { setLikedItems(new Set()); setShowFavourites(false); }}
              style={{
                ...pillBase, padding: "9px 14px", fontSize: 13, fontWeight: 500,
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 400, marginBottom: 16 }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search styles, rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%", background: "white", border: "2px solid var(--border)",
            borderRadius: 24, padding: "10px 16px 10px 40px",
            fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", outline: "none",
          }}
        />
      </div>

      {/* Filter rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {/* Style filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginRight: 4, whiteSpace: "nowrap" }}>Style</span>
          {STYLE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              style={activeStyle === cat && !showFavourites ? pillActive : pillBase}
              onClick={() => { setActiveStyle(cat); setShowFavourites(false); }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Room filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginRight: 4, whiteSpace: "nowrap" }}>Room</span>
          <button
            style={activeRoom === "All" ? pillActive : pillBase}
            onClick={() => setActiveRoom("All")}
          >
            <Home size={12} /> All Rooms
          </button>
          {ROOM_CATEGORIES.map((room) => (
            <button
              key={room}
              style={activeRoom === room ? pillActive : pillBase}
              onClick={() => setActiveRoom(room)}
            >
              <span style={{ fontSize: 13 }}>{ROOM_ICONS[room]}</span>
              {room}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(activeStyle !== "All" || activeRoom !== "All" || searchQuery) && (
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {activeStyle !== "All" && <> · <strong>{activeStyle}</strong></>}
          {activeRoom !== "All" && <> · <strong>{activeRoom}</strong></>}
          {searchQuery && <> · "<strong>{searchQuery}</strong>"</>}
          <button
            onClick={() => { setActiveStyle("All"); setActiveRoom("All"); setSearchQuery(""); }}
            style={{ marginLeft: 10, background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: 13, fontWeight: 600, padding: 0 }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Empty favourites */}
      {showFavourites && likedItems.size === 0 && (
        <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
          <Heart size={48} style={{ marginBottom: 16, opacity: 0.3 }} color="var(--accent)" />
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>No favourites yet</h3>
          <p style={{ fontSize: 14 }}>Tap the heart on any design to save it here.</p>
        </div>
      )}

      {/* Empty filter result */}
      {!showFavourites && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>No results found</h3>
          <p style={{ fontSize: 14 }}>Try a different style or room combination.</p>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {filtered.length > 0 && viewMode === "grid" && (
        <div className="masonry-grid">
          {filtered.map((item, index) => (
            <div key={item.id} className="masonry-item animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="pin-card">
                <div style={{ height: item.height, position: "relative", overflow: "hidden" }}>
                  <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {/* Room badge */}
                  <div style={{
                    position: "absolute", top: 8, left: 8,
                    background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
                    borderRadius: 20, padding: "3px 10px",
                    fontSize: 10, fontWeight: 600, color: "white",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    {ROOM_ICONS[item.room]} {item.room}
                  </div>
                </div>

                <div className="pin-overlay">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewerIndex(index); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: 20, padding: "5px 11px",
                        cursor: "pointer", color: "white", fontSize: 12, fontWeight: 600,
                        fontFamily: "inherit", transition: "background 0.15s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                    >
                      <Maximize2 size={12} /> View
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                      style={{
                        background: likedItems.has(item.id) ? "var(--accent)" : "rgba(0,0,0,0.6)",
                        border: "none", borderRadius: "50%", width: 36, height: 36,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", backdropFilter: "blur(4px)", transition: "all 0.18s ease",
                        transform: likedItems.has(item.id) ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      <Heart size={16} color="white" fill={likedItems.has(item.id) ? "white" : "none"} />
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUseIdea(item.style); }}
                      className="btn-primary"
                      style={{ width: "100%", justifyContent: "center", padding: "8px 16px", fontSize: 13 }}
                    >
                      Use this style
                    </button>
                  </div>
                </div>

                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {item.tags.slice(0, 2).map((tag) => (
                        <span key={tag} style={{ background: "var(--bg-secondary)", borderRadius: 8, padding: "2px 8px", fontSize: 10, color: "var(--text-secondary)" }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
                      <Heart size={10} fill={likedItems.has(item.id) ? "var(--accent)" : "none"} color={likedItems.has(item.id) ? "var(--accent)" : "currentColor"} />
                      {(item.likes + (likedItems.has(item.id) ? 1 : 0)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {filtered.length > 0 && viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 30}ms`,
                display: "flex", alignItems: "center", gap: 0,
                background: "white", borderRadius: 14,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                overflow: "hidden", transition: "box-shadow 0.18s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)")}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.07)")}
            >
              <div onClick={() => setViewerIndex(index)} style={{ width: 120, height: 90, flexShrink: 0, overflow: "hidden", cursor: "pointer", position: "relative" }}>
                <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>

              <div style={{ flex: 1, padding: "12px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                <div style={{ display: "flex", gap: 4, marginBottom: 5, flexWrap: "wrap" }}>
                  {/* Room pill */}
                  <span style={{
                    background: "#f0f0f0", borderRadius: 6, padding: "2px 8px",
                    fontSize: 10, color: "var(--text-secondary)", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 3,
                  }}>
                    {ROOM_ICONS[item.room]} {item.room}
                  </span>
                  {item.tags.map((tag) => (
                    <span key={tag} style={{ background: "var(--bg-secondary)", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "var(--text-secondary)", fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
                  <Heart size={10} fill={likedItems.has(item.id) ? "var(--accent)" : "none"} color={likedItems.has(item.id) ? "var(--accent)" : "currentColor"} />
                  {(item.likes + (likedItems.has(item.id) ? 1 : 0)).toLocaleString()} likes · {item.style}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", flexShrink: 0 }}>
                <button
                  onClick={() => setViewerIndex(index)}
                  title="View image"
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "1.5px solid var(--border)", background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                >
                  <Maximize2 size={15} />
                </button>
                <button
                  onClick={() => toggleLike(item.id)}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "1.5px solid var(--border)",
                    background: likedItems.has(item.id) ? "var(--accent)" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.18s ease",
                  }}
                >
                  <Heart size={15} color={likedItems.has(item.id) ? "white" : "var(--accent)"} fill={likedItems.has(item.id) ? "white" : "none"} />
                </button>
                <button
                  onClick={() => onUseIdea(item.style)}
                  className="btn-primary"
                  style={{ padding: "8px 18px", fontSize: 13, whiteSpace: "nowrap" }}
                >
                  Use this style
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
