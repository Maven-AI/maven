import { ORMType, ParsedSchema } from "../orm/OrmHandler";
import { createAIHandler } from "./aiHandler";

export async function parseData(
  prompt: string,
  schema: ParsedSchema,
  summary: string,
  history: any,
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
    const limitedHistory = history.slice(-5);
    const aiPrompt = `Generate a ${ormType} query based on the following information:
- User's request: ${prompt}
- ORM type: ${ormType}
- Database type: ${schema.databaseType}
- Schema: ${JSON.stringify(schema)}
- Summary of the schema : ${summary}
-  History of previous queries: ${JSON.stringify(limitedHistory)}
Guidelines:
1. Only return the ${ormType} query without any comments.
2. Ensure the query conforms to ${ormType} standards and not raw ${
      schema.databaseType
    } SQL.
3. The query should be complete and ready to execute.
4. Double-check (triple-check) the query for accuracy before providing the final response.
5. The query should be in a complete TypeScript/JavaScript code snippet format.
Provide only the query without any additional comments or explanations.

Query should always be in ${ormType} syntax format and in complete TypeScript/JavaScript code snippet!!

Examples of ${ormType} queries:

Prisma:
- Fetch all users whose role is ADMIN:
\`\`\`javascript
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
  },
  select: {
    id: true,
    name: true,
    email: true,
  },
});
\`\`\`

Drizzle:
- Fetch all users whose role is ADMIN:
\`\`\`javascript
const users = await db.select().from(users)
  .where(eq(users.role, 'ADMIN'))
  .fields('id', 'name', 'email');
\`\`\`

Please write the query now. in ${ormType} format in complete TypeScript/JavaScript code snippet..Always write the minimal query. Refer the history, don't over complicate stuff.`;

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
