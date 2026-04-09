import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabase";

const STYLE_PROMPTS: Record<string, string> = {
  Modern:       "a sleek modern living room, clean lines, neutral palette, white and grey tones, minimalist furniture, recessed lighting, polished hardwood floors, contemporary art on walls, high quality photorealistic interior photography",
  Minimalist:   "an ultra-minimalist room, pure white walls, only essential furniture, maximum negative space, soft natural light, neutral tones, zen-like calm, professional interior photography",
  Scandinavian: "a cozy Scandinavian interior, warm wood tones, hygge atmosphere, white walls, natural textures, sheepskin throws, pendant lighting, indoor plants, photorealistic quality",
  Industrial:   "an industrial loft interior, exposed brick walls, concrete ceiling, steel pipe fixtures, Edison bulb lighting, reclaimed wood furniture, dark moody tones, urban aesthetic, high quality render",
  Luxury:       "a high-end luxury interior, marble surfaces, velvet sofa, gold accents, crystal chandelier, rich jewel tones, bespoke furnishings, five-star hotel suite quality, photorealistic photography",
  Traditional:  "a classic traditional interior, mahogany furniture, Persian rug, wainscoting panels, crown molding, warm amber lighting, oil painting artwork, timeless elegant decor",
  Bohemian:     "an eclectic bohemian interior, colorful layered textiles, macrame wall art, rattan furniture, floor cushions, mixed patterns and prints, hanging plants, warm string lighting",
  Japandi:      "a japandi style interior, Japanese wabi-sabi meets Scandinavian simplicity, natural wood materials, muted earth tones, bamboo accents, shoji screen, bonsai plant, serene minimalism",
  Auto:         "a beautifully designed modern interior with stylish furniture, perfect lighting, and sophisticated decor, photorealistic quality",
};

const AUTO_STYLES = ["Modern", "Scandinavian", "Luxury", "Minimalist", "Bohemian"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const style        = (formData.get("style")        as string) || "Auto";
    const mode         = (formData.get("mode")         as string) || "template";
    const roomType     = (formData.get("roomType")     as string) || "Living Room";
    const customPrompt = (formData.get("customPrompt") as string) || "";
    const imageFile    = formData.get("image") as File | null;
    const userId       = formData.get("userId") as string | null;

    const hasReplicate = !!(
      process.env.REPLICATE_API_KEY &&
      process.env.REPLICATE_API_KEY !== "your_replicate_api_key_here"
    );

    // ── DEMO MODE ──────────────────────────────────────────────────
    if (!hasReplicate) {
      const styles = mode === "auto" ? AUTO_STYLES : [style];
      const demoImages = styles.map((s) => ({
        url: `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop`,
        style: s,
        prompt: `${roomType} in ${s} style`,
      }));
      if (userId) await saveDesigns(demoImages, userId, roomType);
      return NextResponse.json({ images: demoImages, mode: "demo" });
    }

    // ── UPLOAD USER'S ROOM IMAGE TO CLOUDINARY FIRST ───────────────
    // Replicate needs a public URL, not base64
    let roomImageUrl = "";
    if (imageFile) {
      const uploadedUrl = await uploadRoomPhotoToCloudinary(imageFile);
      if (uploadedUrl) roomImageUrl = uploadedUrl;
    }

    const stylesToGenerate = mode === "auto" ? AUTO_STYLES : [style];
    const images: { url: string; style: string; prompt: string }[] = [];

    for (const styleName of stylesToGenerate) {
      const stylePrompt = STYLE_PROMPTS[styleName] || STYLE_PROMPTS.Auto;
      const fullPrompt  = customPrompt
        ? `${stylePrompt}, ${customPrompt}`
        : stylePrompt;

      try {
        console.log(`Generating ${styleName} with prompt: ${fullPrompt.slice(0, 80)}...`);

        // ── Use adirik/interior-design on Replicate ──────────────
        const body: Record<string, unknown> = {
          version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
          input: {
            prompt:          fullPrompt,
            negative_prompt: "ugly, blurry, low quality, distorted, deformed, watermark, text, poorly lit, bad proportions, unrealistic",
            guidance_scale:  15,
            num_inference_steps: 50,
            strength:        0.8,
          },
        };

        // Only pass image if we have one
        if (roomImageUrl) {
          (body.input as Record<string, unknown>).image = roomImageUrl;
        }

        const predictionRes = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!predictionRes.ok) {
          const errText = await predictionRes.text();
          console.error(`Replicate error for ${styleName}:`, errText);
          continue;
        }

        let prediction = await predictionRes.json();
        console.log(`Prediction started: ${prediction.id}, status: ${prediction.status}`);

        // ── Poll until complete (max ~2.5 min) ──────────────────
        let attempts = 0;
        while (
          prediction.status !== "succeeded" &&
          prediction.status !== "failed" &&
          prediction.status !== "canceled" &&
          attempts < 50
        ) {
          await new Promise((r) => setTimeout(r, 3000));
          const pollRes = await fetch(
            `https://api.replicate.com/v1/predictions/${prediction.id}`,
            { headers: { Authorization: `Token ${process.env.REPLICATE_API_KEY}` } }
          );
          prediction = await pollRes.json();
          console.log(`Poll ${attempts}: status=${prediction.status}`);
          attempts++;
        }

        if (prediction.status === "succeeded") {
          // Output can be a string or array
          const rawUrl = Array.isArray(prediction.output)
            ? prediction.output[0]
            : prediction.output;

          console.log(`Success for ${styleName}: ${rawUrl}`);

          // Upload generated image to Cloudinary for permanent storage
          const permanentUrl = await uploadToCloudinary(rawUrl);
          images.push({
            url:    permanentUrl || rawUrl,
            style:  styleName,
            prompt: fullPrompt,
          });
        } else {
          console.error(`Prediction ${prediction.status} for ${styleName}:`, prediction.error);
        }
      } catch (err) {
        console.error(`Error generating ${styleName}:`, err);
      }
    }

    // ── FALLBACK TO DEMO IF NOTHING GENERATED ───────────────────
    if (images.length === 0) {
      console.log("AI generation produced no results, falling back to demo");
      const demoImages = stylesToGenerate.map((s) => ({
        url:    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
        style:  s,
        prompt: `${roomType} in ${s} style`,
      }));
      if (userId) await saveDesigns(demoImages, userId, roomType);
      return NextResponse.json({ images: demoImages, mode: "demo" });
    }

    // ── SAVE TO SUPABASE ─────────────────────────────────────────
    if (userId) {
      await saveDesigns(images, userId, roomType);
    }

    return NextResponse.json({ images, mode: "ai" });

  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

// ── Upload user's room photo to Cloudinary to get a public URL ──
async function uploadRoomPhotoToCloudinary(file: File): Promise<string | null> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const apiKey    = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const folder    = "interioai/uploads";
    const timestamp = Math.floor(Date.now() / 1000);

    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-1", encoder.encode(signatureString));
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", apiKey);
    fd.append("timestamp", timestamp.toString());
    fd.append("folder", folder);
    fd.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: fd }
    );

    if (!res.ok) {
      console.error("Room photo upload failed:", await res.text());
      return null;
    }

    const data = await res.json();
    console.log("Room photo uploaded:", data.secure_url);
    return data.secure_url;
  } catch (err) {
    console.error("uploadRoomPhotoToCloudinary error:", err);
    return null;
  }
}

// ── Save generated designs to Supabase ──────────────────────────
async function saveDesigns(
  images: { url: string; style: string; prompt: string }[],
  userId: string,
  roomType: string
) {
  try {
    const rows = images.map((img) => ({
      user_id:   userId,
      style:     img.style,
      room_type: roomType,
      prompt:    img.prompt,
      image_url: img.url,
      liked:     false,
    }));
    const { error } = await supabaseAdmin.from("designs").insert(rows);
    if (error) console.error("Supabase save error:", error);
    else console.log(`Saved ${rows.length} designs to Supabase`);
  } catch (err) {
    console.error("saveDesigns error:", err);
  }
}
