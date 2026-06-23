const DPROXY_URL = process.env.DPROXY_URL || "http://host.docker.internal:4800";
const DPROXY_API_KEY = process.env.DPROXY_API_KEY || "";

const SYSTEM_PROMPT =
  'You are an expert nutritionist. Given food described in text or a food image, estimate the calories and macronutrients. Respond ONLY in valid JSON: { "description": string, "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number }. Be precise but conservative. If unsure about portion, assume standard serving.';

interface MealAnalysis {
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

async function dproxyAsk(prompt: string, systemPrompt: string): Promise<string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (DPROXY_API_KEY) {
    headers["Authorization"] = `Bearer ${DPROXY_API_KEY}`;
  }

  const res = await fetch(`${DPROXY_URL}/v1/ask`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt,
      systemPrompt,
      provider: "claude",
      memory: false,
      life: false,
      saveHistory: false,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`dproxy error ${res.status}: ${body}`);
  }

  const result = (await res.json()) as { text: string };
  return result.text;
}

export async function analyzeMeal(input: {
  text?: string;
  imageBase64?: string;
  mediaType?: string;
}): Promise<MealAnalysis> {
  let prompt: string;
  if (input.imageBase64) {
    prompt = `[Image attached as base64 ${input.mediaType || "image/jpeg"}]\n\n${input.text || "What food is this? Estimate its nutritional content."}`;
  } else if (input.text) {
    prompt = input.text;
  } else {
    throw new Error("text or imageBase64 required");
  }

  const text = await dproxyAsk(prompt, SYSTEM_PROMPT);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("dproxy did not return valid JSON in response");
  }

  return JSON.parse(jsonMatch[0]) as MealAnalysis;
}
