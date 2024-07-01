import { ORMType, ParsedSchema } from "../orm/OrmHandler";
import { createAIHandler } from "./aiHandler";

export async function parseData(
  prompt: string,
  schema: ParsedSchema,
  ormType: ORMType,
  aiProvider?: string,
  apiKey?: string
): Promise<{ query: string; explanation: string }> {
  if (!aiProvider || !apiKey) {
    return { 
      query: "AI parsing unavailable. Please provide valid AI provider and API key.",
      explanation: ""
    };
  }

  try {
    const aiHandler = createAIHandler(aiProvider, apiKey);
    const aiPrompt = `Given the following database schema and user prompt, generate a query for the ORM ${ormType} and database ${schema.databaseType} that addresses the user's request:

Schema:
${JSON.stringify(schema, null, 2)}

User Prompt:
${prompt}

Please provide:
1. The query for the ORM ${ormType} and database ${schema.databaseType} that answers the user's request based on the given schema.
2. A brief explanation of how the query addresses the user's request.

Format your response as follows:
Query:
[Your generated query here]

Explanation:
[Your explanation here]`;

    const response = await aiHandler.generateContent(aiPrompt);
    const parts = response.split('\n\n');
    let query = '';
    let explanation = '';

    if (parts.length >= 2) {
      query = parts[0].replace('Query:', '').trim();
      explanation = parts[1].replace('Explanation:', '').trim();
    } else {
      query = "Unable to generate a proper query.";
      explanation = response;
    }

    return { query, explanation };
  } catch (error) {
    console.error(`Error parsing data with ${aiProvider}:`, error);
    return { 
      query: "Error generating query. Please try again.",
      explanation: String(error)
    };
  }
}