import { ParsedSchema } from "../orm/OrmHandler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export async function summarizeSchema(
  schema: ParsedSchema,
  aiProvider?: string,
  apiKey?: string
): Promise<string> {
  if (!aiProvider || !apiKey) {
    return generateDefaultSummary(schema);
  }

  switch (aiProvider) {
    case "gemini":
      return summarizeWithGemini(schema, apiKey);
    case "claude":
      return summarizeWithClaude(schema, apiKey);
    default:
      return generateDefaultSummary(schema);
  }
}

function generateSchemaDescription(schema: ParsedSchema): string {
  let description = `Database type: ${schema.databaseType}\n\n`;
  description += "Models:\n";

  for (const model of schema.models) {
    description += `- ${model.name}:\n`;
    for (const field of model.fields) {
      description += `  - ${field.name}: ${field.type}${
        field.isRequired ? " (required)" : ""
      }${field.isList ? " (list)" : ""}`;
      if (field.relation) {
        description += ` (relates to ${field.relation.references.join(", ")})`;
      }
      description += "\n";
    }
    description += "\n";
  }

  if (schema.enums.length > 0) {
    description += "Enums:\n";
    for (const enumItem of schema.enums) {
      description += `- ${enumItem.name}: ${enumItem.values.join(", ")}\n`;
    }
  }

  return description;
}

async function summarizeWithGemini(
  schema: ParsedSchema,
  apiKey: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const schemaDescription = generateSchemaDescription(schema);
  const prompt = `Summarize the following database schema in a concise manner, highlighting key models, relationships, and any notable features:

${schemaDescription}

Provide a brief overview that a developer could quickly read to understand the structure of the database.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error using Gemini AI:", error);
    return generateDefaultSummary(schema);
  }
}

async function summarizeWithClaude(
  schema: ParsedSchema,
  apiKey: string
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  const schemaDescription = generateSchemaDescription(schema);
  const prompt = `Summarize the following database schema in a concise manner, highlighting key models, relationships, and any notable features:

${schemaDescription}

Provide a brief overview that a developer could quickly read to understand the structure of the database.`;

  try {
    const completion = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 300,
      prompt: `Human: ${prompt}\n\nAssistant:`,
    });

    return completion.completion;
  } catch (error) {
    console.error("Error using Claude AI:", error);
    return generateDefaultSummary(schema);
  }
}

function generateDefaultSummary(schema: ParsedSchema): string {
  const modelCount = schema.models.length;
  const enumCount = schema.enums.length;

  let summary = `This schema uses ${
    schema.databaseType
  } and contains ${modelCount} model${
    modelCount !== 1 ? "s" : ""
  } and ${enumCount} enum${enumCount !== 1 ? "s" : ""}.\n\n`;

  summary += "Models:\n";
  for (const model of schema.models) {
    const fieldCount = model.fields.length;
    const relationCount = model.fields.filter((f) => f.relation).length;
    summary += `- ${model.name}: ${fieldCount} field${
      fieldCount !== 1 ? "s" : ""
    }`;
    if (relationCount > 0) {
      summary += ` (including ${relationCount} relation${
        relationCount !== 1 ? "s" : ""
      })`;
    }
    summary += "\n";
  }

  if (enumCount > 0) {
    summary += "\nEnums:\n";
    for (const enumItem of schema.enums) {
      summary += `- ${enumItem.name}: ${enumItem.values.length} value${
        enumItem.values.length !== 1 ? "s" : ""
      }\n`;
    }
  }

  return summary;
}
