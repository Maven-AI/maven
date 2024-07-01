#!/usr/bin/env node
import { Command } from "commander";
import { startServer } from "../index";

export function runCLI() {
  const program = new Command();

  program
    .version("1.0.0")
    .option("-p, --prisma", "Run with Prisma ORM")
    .option("-d, --drizzle", "Run with Drizzle ORM")
    .option("--gemini <api_key>", "Use Gemini AI with the provided API key")
    .option("--openai <api_key>", "Use OpenAI with the provided API key")
    .option("--claude <api_key>", "Use Claude AI with the provided API key")
    .parse(process.argv);

  const options = program.opts();

  type ORMType = "prisma" | "drizzle" | "other";
  let ormType: ORMType = "other";
  let aiProvider: string | undefined;
  let apiKey: string | undefined;

  if (options.prisma) ormType = "prisma";
  else if (options.drizzle) ormType = "drizzle";

  if (options.gemini) {
    aiProvider = "gemini";
    apiKey = options.gemini;
  } else if (options.openai) {
    aiProvider = "openai";
    apiKey = options.openai;
  } else if (options.claude) {
    aiProvider = "claude";
    apiKey = options.claude;
  }

  // Start the server after the build process completes
  startServer(ormType, aiProvider, apiKey);
}

runCLI();
