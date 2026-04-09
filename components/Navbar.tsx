"use client";

import React, { useState } from "react";
import { Grid, Sparkles, Compass, LogIn, Plus, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import AuthModal from "@/components/AuthModal";

interface NavbarProps {
  activeView: "generate" | "gallery" | "explore";
  onViewChange: (view: "generate" | "gallery" | "explore") => void;
  generatedCount: number;
}

export default function Navbar({ activeView, onViewChange, generatedCount }: NavbarProps) {
  const { user, logout } = useAuth();
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, background: "var(--accent)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 21, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>
            InterioAI
          </span>
        </a>

        {/* Nav Pills */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className={`nav-pill ${activeView === "generate" ? "active" : ""}`}
            onClick={() => onViewChange("generate")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={14} />
            Generate
          </button>
          <button
            className={`nav-pill ${activeView === "gallery" ? "active" : ""}`}
            onClick={() => onViewChange("gallery")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Grid size={14} />
            My Designs
            {generatedCount > 0 && (
              <span style={{
                background: "var(--accent)", color: "white",
                borderRadius: 10, padding: "0 6px", fontSize: 11, fontWeight: 700
              }}>
                {generatedCount}
              </span>
            )}
          </button>
          <button
            className={`nav-pill ${activeView === "explore" ? "active" : ""}`}
            onClick={() => onViewChange("explore")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Compass size={14} />
            Explore
          </button>
        </div>

        {/* Auth */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "var(--bg-secondary)", border: "1.5px solid var(--border)",
                  borderRadius: 24, padding: "6px 14px 6px 8px",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <User size={14} color="white" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "white", borderRadius: 12, padding: "8px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                    border: "1px solid var(--border)", minWidth: 180, zIndex: 200,
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid var(--border)", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      width: "100%", padding: "8px 12px",
                      background: "none", border: "none", cursor: "pointer",
                      borderRadius: 8, fontSize: 14, color: "var(--accent)",
                      fontWeight: 600, fontFamily: "inherit",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#fff5f5")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="btn-secondary"
                onClick={() => setAuthModal("login")}
                style={{ padding: "8px 16px", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
              >
                <LogIn size={14} />
                Log in
              </button>
              <button
                className="btn-primary"
                onClick={() => setAuthModal("signup")}
                style={{ padding: "8px 16px", fontSize: 14 }}
              >
                Sign up free
              </button>
            </>
          )}
        </div>
      </nav>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={(m) => setAuthModal(m)}
        />
      )}
    </>
  );
}
