"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import StyleSelector from "@/components/StyleSelector";
import GenerateControls from "@/components/GenerateControls";
import ResultsGallery from "@/components/ResultsGallery";
import InspirationFeed from "@/components/InspirationFeed";
import ComparisonSlider from "@/components/ComparisonSlider";
import Toast from "@/components/Toast";

export type DesignStyle = "Modern" | "Minimalist" | "Scandinavian" | "Industrial" | "Luxury" | "Traditional" | "Bohemian" | "Japandi";
export type GenerationMode = "template" | "auto";
export type RoomType = "Living Room" | "Bedroom" | "Kitchen" | "Bathroom" | "Office" | "Dining Room";

export type GeneratedImage = {
  id: string;
  url: string;
  style: string;
  prompt: string;
  createdAt: Date;
  liked: boolean;
};

export default function Home() {
  const { user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [generationMode, setGenerationMode] = useState<GenerationMode>("template");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>("Living Room");
  const [customPrompt, setCustomPrompt] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"generate" | "gallery" | "explore">("generate");
  const [comparisonImage, setComparisonImage] = useState<GeneratedImage | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) { showToast("Please upload a room image first"); return; }
    if (generationMode === "template" && !selectedStyle) { showToast("Please select a design style"); return; }

    setIsGenerating(true);
    setProgress(0);
    setActiveView("gallery");

    const interval = setInterval(() => {
      setProgress((p) => { if (p >= 90) { clearInterval(interval); return p; } return p + Math.random() * 15; });
    }, 400);

    try {
      const formData = new FormData();
      if (uploadedFile) formData.append("image", uploadedFile);
      formData.append("style", selectedStyle || "Auto");
      formData.append("mode", generationMode);
      formData.append("roomType", selectedRoom);
      formData.append("customPrompt", customPrompt);
      if (user) formData.append("userId", user.id);

      const response = await fetch("/api/generate", { method: "POST", body: formData });
      const data = await response.json();
      clearInterval(interval);
      setProgress(100);

      if (data.images) {
        const newImages: GeneratedImage[] = data.images.map((img: { url: string; style: string; prompt: string }, i: number) => ({
          id: `gen-${Date.now()}-${i}`, url: img.url, style: img.style, prompt: img.prompt, createdAt: new Date(), liked: false,
        }));
        setGeneratedImages((prev) => [...newImages, ...prev]);
        showToast(`✨ ${newImages.length} designs generated!`);
      }
    } catch {
      clearInterval(interval);
      setProgress(100);
      const demoStyles = generationMode === "auto" ? ["Modern", "Scandinavian", "Luxury", "Minimalist", "Bohemian"] : [selectedStyle || "Modern"];
      const demoImages: GeneratedImage[] = demoStyles.map((style, i) => ({
        id: `demo-${Date.now()}-${i}`, url: uploadedImage!, style, prompt: `${selectedRoom} in ${style} style`, createdAt: new Date(), liked: false,
      }));
      setGeneratedImages((prev) => [...demoImages, ...prev]);
      showToast(`✨ ${demoImages.length} designs ready! (Demo mode)`);
    } finally {
      setTimeout(() => { setIsGenerating(false); setProgress(0); }, 500);
    }
  };

  const handleLike = (id: string) => {
    setGeneratedImages((prev) => prev.map((img) => img.id === id ? { ...img, liked: !img.liked } : img));
  };

  const handleDownload = async (url: string, name: string) => {
    const a = document.createElement("a"); a.href = url; a.download = name; a.click();
    showToast("Download started!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      <Navbar activeView={activeView} onViewChange={setActiveView} generatedCount={generatedImages.length} />

      {activeView === "generate" && (
        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px" }}>
          <HeroSection />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, marginTop: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <UploadSection uploadedImage={uploadedImage} onUpload={(img, file) => { setUploadedImage(img); setUploadedFile(file); }} onClear={() => { setUploadedImage(null); setUploadedFile(null); }} />
              <GenerateControls mode={generationMode} onModeChange={setGenerationMode} roomType={selectedRoom} onRoomTypeChange={setSelectedRoom} customPrompt={customPrompt} onCustomPromptChange={setCustomPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} progress={progress} canGenerate={!!uploadedImage} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <StyleSelector selectedStyle={selectedStyle} onStyleSelect={setSelectedStyle} mode={generationMode} onExploreMore={() => setActiveView("explore")} />
            </div>
          </div>
        </main>
      )}

      {activeView === "gallery" && (
        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px" }}>
          {isGenerating && (
            <div style={{ background: "white", borderRadius: "var(--radius)", padding: 24, marginBottom: 24, display: "flex", alignItems: "center", gap: 16, boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 40, height: 40, border: "3px solid #eee", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Generating your interior designs...</div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} /></div>
              </div>
              <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 18 }}>{Math.round(Math.min(progress, 100))}%</span>
            </div>
          )}
          {comparisonImage && uploadedImage && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>Before & After</h2>
                <button className="btn-secondary" onClick={() => setComparisonImage(null)} style={{ padding: "8px 16px", fontSize: 13 }}>Close</button>
              </div>
              <ComparisonSlider beforeImage={uploadedImage} afterImage={comparisonImage.url} />
            </div>
          )}
          <ResultsGallery images={generatedImages} originalImage={uploadedImage} onLike={handleLike} onDownload={handleDownload} onCompare={(img) => setComparisonImage(img)} onGenerate={() => setActiveView("generate")} />
        </main>
      )}

      {activeView === "explore" && (
        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px" }}>
          <InspirationFeed onUseIdea={(style) => { setSelectedStyle(style as DesignStyle); setActiveView("generate"); showToast(`${style} style selected!`); }} />
        </main>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
