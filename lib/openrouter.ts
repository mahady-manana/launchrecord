import { OpenRouter } from "@openrouter/sdk";

export function getOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }
  const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  return openRouter;
}

export default getOpenRouterClient;
