/**
 * Uploads an image (from a URL or base64) to Cloudinary
 * and returns the permanent secure URL.
 */
export async function uploadToCloudinary(
  imageSource: string, // URL or base64 data URI
  folder = "interioai/designs"
): Promise<string | null> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;

    const timestamp = Math.floor(Date.now() / 1000);

    // Build signature string
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    // Use Web Crypto to create SHA-1 signature
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const formData = new FormData();
    formData.append("file", imageSource);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", folder);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Cloudinary upload failed:", err);
      return null;
    }

    const data2 = await response.json();
    return data2.secure_url as string;
  } catch (error) {
    console.error("Cloudinary error:", error);
    return null;
  }
}

/**
 * Uploads a user's room photo (File/Blob) to Cloudinary
 * and returns the permanent secure URL.
 */
export async function uploadRoomPhoto(file: File): Promise<string | null> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const folder = "interioai/uploads";

    const timestamp = Math.floor(Date.now() / 1000);
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", folder);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Cloudinary room photo upload failed:", err);
      return null;
    }

    const result = await response.json();
    return result.secure_url as string;
  } catch (error) {
    console.error("Cloudinary room photo error:", error);
    return null;
  }
}
