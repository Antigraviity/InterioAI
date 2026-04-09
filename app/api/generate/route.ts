import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabase";

const STYLE_PROMPTS: Record<string, string> = {
  Modern: "Transform this room into a sleek modern interior with clean lines, neutral palette of white and grey, minimalist furniture, recessed lighting, polished concrete or hardwood floors, contemporary art pieces, high quality photorealistic rendering",
  Minimalist: "Transform this room into an ultra-minimalist space with pure white walls, essential furniture only, maximum negative space, soft natural light, neutral tones, zen-like calm, professional interior photography quality",
  Scandinavian: "Transform this room into a cozy Scandinavian interior with warm wood tones, hygge atmosphere, white walls, natural textures, sheepskin throws, pendant lighting, indoor plants, photorealistic quality",
  Industrial: "Transform this room into an industrial loft interior with exposed brick walls, concrete ceiling, steel fixtures, Edison bulb lighting, reclaimed wood furniture, dark moody tones, urban aesthetic, high quality render",
  Luxury: "Transform this room into a high-end luxury interior with marble surfaces, velvet furniture, gold accents, crystal chandeliers, rich jewel tones, bespoke furnishings, hotel suite quality, photorealistic photography",
  Traditional: "Transform this room into a classic traditional interior with mahogany furniture, Persian rugs, wainscoting, crown molding, warm amber lighting, oil painting artwork, timeless elegance, professional photography",
  Bohemian: "Transform this room into an eclectic bohemian interior with colorful textiles, macrame wall art, rattan furniture, floor cushions, mix of patterns, hanging plants, warm lighting, vibrant and creative atmosphere",
  Japandi: "Transform this room into a japandi style interior combining Japanese wabi-sabi and Scandinavian simplicity, natural materials, muted earth tones, bamboo accents, shoji screens, bonsai plants, serene minimalism",
  Auto: "Transform this room into a beautifully designed modern interior with stylish furniture, perfect lighting, and sophisticated decor, photorealistic quality",
};

const AUTO_STYLES = ["Modern", "Scandinavian", "Luxury", "Minimalist", "Bohemian"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const style = formData.get("style") as string || "Auto";
    const mode = formData.get("mode") as string || "template";
    const roomType = formData.get("roomType") as string || "Living Room";
    const customPrompt = formData.get("customPrompt") as string || "";
    const imageFile = formData.get("image") as File | null;
    const userId = formData.get("userId") as string | null;

    const hasReplicate = process.env.REPLICATE_API_KEY && process.env.REPLICATE_API_KEY !== "your_replicate_api_key_here";
    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here";

    // ── DEMO MODE (no AI key) ──────────────────────────────────────
    if (!hasReplicate && !hasOpenAI) {
      const styles = mode === "auto" ? AUTO_STYLES : [style];
      const images = styles.map((s) => ({
        url: `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop&sig=${s}${Date.now()}`,
        style: s,
        prompt: `${roomType} in ${s} style${customPrompt ? ` - ${customPrompt}` : ""}`,
      }));

      // Save to Supabase even in demo mode if user is logged in
      if (userId) {
        await saveDesigns(images, userId, roomType);
      }

      return NextResponse.json({ images, mode: "demo" });
    }

    // ── CONVERT IMAGE TO BASE64 ────────────────────────────────────
    let imageBase64 = "";
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      imageBase64 = Buffer.from(bytes).toString("base64");
    }

    const stylesToGenerate = mode === "auto" ? AUTO_STYLES : [style];
    const images: { url: string; style: string; prompt: string }[] = [];

    for (const styleName of stylesToGenerate) {
      let prompt = STYLE_PROMPTS[styleName] || STYLE_PROMPTS.Auto;
      prompt = prompt.replace("this room", `this ${roomType.toLowerCase()}`);
      if (customPrompt) prompt += `, ${customPrompt}`;

      let generatedUrl: string | null = null;

      // ── REPLICATE ──────────────────────────────────────────────
      if (hasReplicate) {
        const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: "854e8727697a057c525cdb45ab037f64ecca770a4dedce699c0523d1b4e41c8",
            input: {
              prompt,
              image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined,
              strength: 0.75,
              guidance_scale: 7.5,
              num_inference_steps: 30,
            },
          }),
        });

        if (replicateResponse.ok) {
          const prediction = await replicateResponse.json();
          let result = prediction;
          let attempts = 0;
          while (result.status !== "succeeded" && result.status !== "failed" && attempts < 30) {
            await new Promise((r) => setTimeout(r, 2000));
            const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
              headers: { Authorization: `Token ${process.env.REPLICATE_API_KEY}` },
            });
            result = await poll.json();
            attempts++;
          }
          if (result.status === "succeeded" && result.output?.[0]) {
            generatedUrl = result.output[0];
          }
        }
      }

      // ── OPENAI ────────────────────────────────────────────────
      else if (hasOpenAI) {
        const openaiResponse = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `Interior design photography: ${prompt}. Professional architectural photography, wide angle, beautiful composition.`,
            n: 1,
            size: "1792x1024",
            quality: "hd",
          }),
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          if (openaiData.data?.[0]?.url) {
            generatedUrl = openaiData.data[0].url;
          }
        }
      }

      // ── UPLOAD TO CLOUDINARY ───────────────────────────────────
      if (generatedUrl) {
        const permanentUrl = await uploadToCloudinary(generatedUrl);
        images.push({
          url: permanentUrl || generatedUrl, // fallback to temp URL if upload fails
          style: styleName,
          prompt,
        });
      }
    }

    // ── FALLBACK TO DEMO ───────────────────────────────────────────
    if (images.length === 0) {
      const demoImages = stylesToGenerate.map((s) => ({
        url: `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop`,
        style: s,
        prompt: `${roomType} in ${s} style`,
      }));
      if (userId) await saveDesigns(demoImages, userId, roomType);
      return NextResponse.json({ images: demoImages, mode: "demo" });
    }

    // ── SAVE TO SUPABASE ───────────────────────────────────────────
    if (userId) {
      await saveDesigns(images, userId, roomType);
    }

    return NextResponse.json({ images, mode: "ai" });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

async function saveDesigns(
  images: { url: string; style: string; prompt: string }[],
  userId: string,
  roomType: string
) {
  try {
    const rows = images.map((img) => ({
      user_id: userId,
      style: img.style,
      room_type: roomType,
      prompt: img.prompt,
      image_url: img.url,
      liked: false,
    }));

    const { error } = await supabaseAdmin.from("designs").insert(rows);
    if (error) console.error("Supabase save error:", error);
  } catch (err) {
    console.error("Save designs error:", err);
  }
}
