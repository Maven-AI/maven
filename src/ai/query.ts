import { ORMType, ParsedSchema } from "../orm/OrmHandler";
import { createAIHandler } from "./aiHandler";

export async function parseData(
  prompt: string,
  schema: ParsedSchema,
  ormType: ORMType,
  aiProvider?: string,
  apiKey?: string
): Promise<{ query: string }> {
  if (!aiProvider || !apiKey) {
    return {
      query:
        "AI parsing unavailable. Please provide valid AI provider and API key.",
    };
  }

  try {
    const aiHandler = createAIHandler(aiProvider, apiKey);
    const aiPrompt = `Please provide the query for ${prompt} for the ORM ${ormType} and database ${schema.databaseType} that answers the user's request based on the given schema ${schema}. Please write only the query without any comments. The query should be in the format of ORM type ${ormType} it should not be a raw ${schema.databaseType} type. Please write full ${ormType} query
`;

    const response = await aiHandler.generateContent(aiPrompt);
    console.log("AI Response:", response);

    return { query: response };
  } catch (error) {
    console.error(`Error parsing data with ${aiProvider}:`, error);
    return {
      query: "Error generating query. Please try again.",
    };
  }
}
