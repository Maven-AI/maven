import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export interface AIHandler {
  generateContent(prompt: string): Promise<string>;
}

class GeminiHandler implements AIHandler {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error using Gemini AI:", error);
      throw error;
    }
  }
}

class ClaudeHandler implements AIHandler {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const completion = await this.anthropic.completions.create({
        model: "claude-2",
        max_tokens_to_sample: 300,
        prompt: `Human: ${prompt}\n\nAssistant:`,
      });
      return completion.completion;
    } catch (error) {
      console.error("Error using Claude AI:", error);
      throw error;
    }
  }
}

export function createAIHandler(aiProvider: string, apiKey: string): AIHandler {
  switch (aiProvider) {
    case "gemini":
      return new GeminiHandler(apiKey);
    case "claude":
      return new ClaudeHandler(apiKey);
    default:
      throw new Error(`Unsupported AI provider: ${aiProvider}`);
  }
}
