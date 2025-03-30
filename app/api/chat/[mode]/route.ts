import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request, { params }: { params: { mode: string } }) {
  const { messages } = await req.json()
  const mode = params.mode

  // Different system prompts based on mode
  let systemPrompt = "You are CryptoSec, an expert assistant specializing in cryptography and network security."

  if (mode === "reasoning") {
    systemPrompt +=
      " Provide detailed reasoning and explanations for your answers. Break down complex concepts step by step."
  } else if (mode === "search") {
    systemPrompt +=
      " When you don't know something, suggest what to search for online. Provide specific search terms that would be helpful."
  }

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: systemPrompt,
  })

  return result.toDataStreamResponse()
}

