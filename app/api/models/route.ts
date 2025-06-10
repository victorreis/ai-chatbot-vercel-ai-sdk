import { NextResponse } from "next/server";

import type { Model } from "@/components/ModelSelector";
import { env } from "@/env.mjs";

export async function GET() {
  const models: Model[] = [];

  // Add OpenAI models if API key is available
  if (env.OPENAI_API_KEY) {
    models.push({
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      provider: "openai",
      description: "Most capable OpenAI model",
    });
  }

  // Add Google models if API key is available
  if (env.GEMINI_API_KEY) {
    models.push({
      id: "gemini-2.0-flash",
      name: "Gemini 2.0 Flash",
      provider: "google",
      description: "Fast and efficient Google model",
    });
  }

  return NextResponse.json({ models });
}
