import { ParsedSchema } from "../orm/OrmHandler";
import { createAIHandler } from "./aiHandler";

export async function summarizeSchema(
  schema: ParsedSchema,
  aiProvider?: string,
  apiKey?: string
): Promise<string> {
  if (!aiProvider || !apiKey) {
    return generateDefaultSummary(schema);
  }

  try {
    const aiHandler = createAIHandler(aiProvider, apiKey);
    const schemaDescription = generateSchemaDescription(schema);
    const prompt = `Summarize the following database schema in a concise manner, highlighting key models, relationships, and any notable features:

${schemaDescription}

Provide a brief overview that a developer could quickly read to understand the structure of the database.`;

    return await aiHandler.generateContent(prompt);
  } catch (error) {
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
