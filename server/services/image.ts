export interface ImageGenResult {
  success: boolean;
  imageURL?: string;
  error?: string;
}

function buildPrompt(dreamText: string): string {
  const t = (dreamText || "").trim();
  const lower = t.toLowerCase();

  const settings = [
    "forest","city","street","classroom","school","beach","ocean","desert","mountain","cave","library","space","temple","castle","island","garden","river","room","house","apartment","rooftop","market","train","subway","bridge","cemetery","church","mosque","palace","lab","museum"
  ];
  const times = ["dawn","sunrise","morning","noon","afternoon","sunset","twilight","evening","night","midnight"];
  const weathers = ["rain","snow","storm","fog","mist","wind","breeze","clear sky","cloudy","thunder"];
  const emotions = ["joy","happy","calm","peace","serene","fear","scary","anxious","anxiety","mystery","wonder","lonely","love"];
  const subjects = [
    "man","woman","boy","girl","child","friend","friends","people","crowd","teacher","professor","stranger","monster","creature","animal","bird","cat","dog","dragon","robot","ghost"
  ];
  const colors = ["red","orange","yellow","green","blue","indigo","violet","purple","pink","gold","silver","black","white","neon"];
  const actions = ["walking","running","flying","swimming","falling","chased","chasing","looking","waiting","crying","smiling","sitting","standing","dancing"];

  function pick(words: string[]) {
    return words.filter((w) => lower.includes(w));
  }

  const found = {
    settings: pick(settings),
    times: pick(times),
    weathers: pick(weathers),
    emotions: pick(emotions),
    subjects: pick(subjects),
    colors: pick(colors),
    actions: pick(actions),
  };

  // Required elements list for higher fidelity
  const required: string[] = [];
  if (found.settings.length) required.push(`setting: ${found.settings.join(", ")}`);
  if (found.times.length) required.push(`time of day: ${found.times.join(", ")}`);
  if (found.weathers.length) required.push(`weather: ${found.weathers.join(", ")}`);
  if (found.subjects.length) required.push(`subjects: ${found.subjects.join(", ")}`);
  if (found.actions.length) required.push(`key actions: ${found.actions.join(", ")}`);
  if (found.colors.length) required.push(`dominant colors: ${found.colors.join(", ")}`);
  if (found.emotions.length) required.push(`mood: ${found.emotions.join(", ")}`);

  const guidance = [
    "Accurately depict ONLY the elements described.",
    "Do not add extra people or objects not mentioned.",
    "Preserve the composition implied by the text.",
    "High fidelity to nouns, places, and actions.",
    "Photographic realism where appropriate; lightly dreamy lighting.",
  ].join(" ");

  const negative = [
    "low quality, lowres, text, watermark, extra limbs, extra people, artifacts, oversaturated, unrealistic additions",
  ].join(", ");

  const reqLine = required.length ? `Required elements: ${required.join("; ")}.` : "";

  return (
    `Create a highly faithful image for the described dream.\n` +
    `${reqLine}\n` +
    `Description: ${t}\n` +
    `Style: cinematic, detailed, coherent scene, consistent perspective.\n` +
    `Lighting: match the time-of-day and mood from the description.\n` +
    `${guidance}\n` +
    `Negative prompt: ${negative}`
  );
}

export async function generateDreamImage(
  dreamText: string,
): Promise<ImageGenResult> {
  if (!dreamText || !dreamText.trim()) {
    return { success: false, error: "Dream text required" };
  }

  const apiKey = process.env.IMAGE_API_KEY;
  const provider = process.env.IMAGE_API_PROVIDER || "stability"; // stability | openai | replicate
  const prompt = buildPrompt(dreamText);

  // Demo or missing key -> graceful fallback
  if (!apiKey) {
    const seed = Math.abs(
      [...dreamText].reduce((a, c) => a + c.charCodeAt(0), 0),
    );
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1344&height=768&nologo=true&seed=${seed}`;
    return { success: true, imageURL: url };
  }

  try {
    if (provider === "stability") {
      const resp = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
        {
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
        },
      );
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
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
        }),
      });
      if (!resp.ok) throw new Error(`OpenAI status ${resp.status}`);
      const data: any = await resp.json();
      const url = data?.data?.[0]?.url;
      if (!url) throw new Error("No image URL");
      return { success: true, imageURL: url };
    }

    if (provider === "replicate") {
      const version = process.env.REPLICATE_MODEL_VERSION || "";
      const model =
        process.env.REPLICATE_MODEL || "black-forest-labs/flux-schnell";
      const endpoint = version
        ? "https://api.replicate.com/v1/predictions"
        : `https://api.replicate.com/v1/models/${model}/predictions`;

      const body = version
        ? { version, input: { prompt } }
        : { input: { prompt } };

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error(`Replicate status ${resp.status}`);
      const data: any = await resp.json();
      const out = Array.isArray(data?.output) ? data.output[0] : data?.output;
      if (!out) throw new Error("No image URL");
      return { success: true, imageURL: out };
    }

    return { success: false, error: "Unsupported provider" };
  } catch (e) {
    const seed = Math.abs(
      [...dreamText].reduce((a, c) => a + c.charCodeAt(0), 0),
    );
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1344&height=768&nologo=true&seed=${seed}`;
    return { success: true, imageURL: url };
  }
}
