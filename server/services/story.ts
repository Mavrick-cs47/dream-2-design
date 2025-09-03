import { generateDreamImage } from "./image";

function splitIntoScenes(text: string): string[] {
  const t = (text || "").trim();
  if (t.length < 40) {
    return [
      "A quiet introduction to the dream world",
      "A hint of wonder appears in the distance",
      "The scene builds with motion and color",
      "The dream reaches a surreal climax",
      "A moment of clarity and reflection",
      "A gentle resolution as the dream fades",
    ];
  }
  // naive splitting by sentences, padded to 6
  const sentences = t
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const scenes: string[] = [];
  for (let i = 0; i < 6; i++) {
    scenes.push(
      sentences[i] ||
        [
          "A quiet introduction to the dream world",
          "A hint of wonder appears in the distance",
          "The scene builds with motion and color",
          "The dream reaches a surreal climax",
          "A moment of clarity and reflection",
          "A gentle resolution as the dream fades",
        ][i],
    );
  }
  return scenes;
}

export async function generateDreamStory(
  dreamText: string,
): Promise<{ success: boolean; storyImages: string[]; error?: string }> {
  try {
    const scenes = splitIntoScenes(dreamText);
    const urls: string[] = [];
    for (let i = 0; i < 6; i++) {
      const focus = scenes[i];
      const scenePrompt =
        `Create a surreal cinematic artwork for Scene ${i + 1} of the dream.\n\n` +
        `Dream: '${dreamText}'\n` +
        `Scene focus: ${focus}\n` +
        `Style: Storyboard, cinematic, fantasy, ultra-detailed, magical.\n` +
        `Lighting: Match the mood of the scene.\n` +
        `Camera: Dynamic cinematic shot, appropriate to the scene.\n` +
        `Resolution: High quality.`;
      const img = await generateDreamImage(scenePrompt);
      urls.push(img.imageURL || "/placeholder.svg");
    }
    return { success: true, storyImages: urls };
  } catch (e) {
    return {
      success: false,
      storyImages: [],
      error: "Failed to generate story",
    };
  }
}
