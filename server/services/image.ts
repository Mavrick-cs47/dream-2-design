import fetch from "node-fetch";

export interface ImageGenResult {
  success: boolean;
  imageURL?: string;
  error?: string;
}

function buildPrompt(dreamText: string): string {
  return (
    `Generate a surreal, cinematic artwork of the following dream scene:\n\n` +
    `Dream: '${dreamText}'\n\n` +
    `Style: Futuristic, fantasy, dreamlike, ultra-detailed, glowing lights, magical atmosphere.\n` +
    `Lighting: Soft ethereal glow with neon highlights.\n` +
    `Camera: Wide angle perspective, cinematic composition, high resolution.`
  );
}

export async function generateDreamImage(dreamText: string): Promise<ImageGenResult> {
  if (!dreamText || !dreamText.trim()) {
    return { success: false, error: "Dream text required" };
  }

  const apiKey = process.env.IMAGE_API_KEY;
  const provider = process.env.IMAGE_API_PROVIDER || "stability"; // stability | openai | replicate
  const prompt = buildPrompt(dreamText);

  // Demo or missing key -> graceful fallback
  if (!apiKey) {
    return { success: true, imageURL: "/placeholder.svg" };
  }

  try {
    if (provider === "stability") {
      // Stability AI (SDXL) Text-to-Image
      const resp = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          cfg_scale: 7,
          height: 768,
          width: 1344,
          steps: 30,
          samples: 1,
          text_prompts: [{ text: prompt, weight: 1 }],
        }),
      });
      if (!resp.ok) throw new Error(`Stability status ${resp.status}`);
      const data: any = await resp.json();
      const b64 = data?.artifacts?.[0]?.base64;
      if (!b64) throw new Error("No image data");
      const url = `data:image/png;base64,${b64}`;
      return { success: true, imageURL: url };
    }

    if (provider === "openai") {
      const resp = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024" }),
      });
      if (!resp.ok) throw new Error(`OpenAI status ${resp.status}`);
      const data: any = await resp.json();
      const url = data?.data?.[0]?.url;
      if (!url) throw new Error("No image URL");
      return { success: true, imageURL: url };
    }

    if (provider === "replicate") {
      const resp = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: process.env.REPLICATE_MODEL_VERSION || "stability-ai/sdxl:8f8f6f3d8b8b...",
          input: { prompt },
        }),
      });
      if (!resp.ok) throw new Error(`Replicate status ${resp.status}`);
      const data: any = await resp.json();
      // Polling omitted; some deployments return output URL(s) directly
      const url = data?.output?.[0] || data?.urls?.get || data?.output;
      if (!url) throw new Error("No image URL");
      return { success: true, imageURL: url };
    }

    return { success: false, error: "Unsupported provider" };
  } catch (e) {
    return { success: false, error: "Image generation failed" };
  }
}
