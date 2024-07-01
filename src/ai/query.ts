import { ORMType, ParsedSchema } from "../orm/OrmHandler";
import { createAIHandler } from "./aiHandler";

export async function parseData(
  prompt: string,
  schema: ParsedSchema,
  ormType: ORMType,
  aiProvider?: string,
  apiKey?: string
): Promise<string> {
  if (!aiProvider || !apiKey) {
    return "AI parsing unavailable. Please provide valid AI provider and API key.";
  }

  try {
    const aiHandler = createAIHandler(aiProvider, apiKey);
    const aiPrompt = `Given the following database schema and user prompt, generate a query for the orm ${ormType} and database ${schema.databaseType} that addresses the user's request:

Schema:
${JSON.stringify(schema, null, 2)}

User Prompt:
${prompt}

Please provide only the query for the orm ${ormType} and database ${schema.databaseType} that answers the user's request based on the given schema.`;

    const sqlQuery = await aiHandler.generateContent(aiPrompt);
    return sqlQuery.trim();
  } catch (error) {
    console.error(`Error parsing data with ${aiProvider}:`, error);
    return "Error generating SQL query. Please try again.";
  }
}