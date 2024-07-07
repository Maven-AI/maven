import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { ORMType, getSchemaForORM } from "./orm/OrmHandler";
import { summarizeSchema } from "./ai/summary";
import { parseData } from "./ai/query";
import { queryHistory } from "./ai/queryHistory";

export async function startServer(
  ormType: ORMType,
  aiProvider?: string,
  apiKey?: string
): Promise<void> {
  try {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../dist")));

    let schema: any;

    app.get("/api/schema", async (req: Request, res: Response) => {
      try {
        if (!schema) {
          schema = await getSchemaForORM(ormType);
        }
        console.log("Sending schema:", schema);
        res.json(schema);
      } catch (error) {
        console.error("Error fetching schema:", error);
        res.status(500).json({ error: "Failed to fetch schema" });
      }
    });

    app.post("/api/summarize-schema", async (req: Request, res: Response) => {
      try {
        if (!schema) {
          schema = await getSchemaForORM(ormType);
        }
        const summary = await summarizeSchema(schema, aiProvider, apiKey);
        console.log("Sending summary:", summary);
        res.json({ summary });
      } catch (error) {
        console.error("Error summarizing schema:", error);
        res.status(500).json({ error: "Failed to summarize schema" });
      }
    });

    app.post("/api/parse-data", async (req: Request, res: Response) => {
      try {
        const { prompt, schema } = req.body;
        const summary = await summarizeSchema(schema, aiProvider, apiKey);
        const history = queryHistory.getHistory();
        if (!prompt || !schema) {
          return res
            .status(400)
            .json({ error: "Prompt and schema are required" });
        }
        const result = await parseData(
          prompt,
          schema,
          summary,
          history,
          ormType,
          aiProvider,
          apiKey
        );
        console.log("Generated Query:", result.query);

        // Add the query to history
        queryHistory.addQuery(prompt, result.query);
        console.log("Updated query history:", queryHistory.getHistory());

        res.json(result);
      } catch (error) {
        console.error("Error parsing data:", error);
        res.status(500).json({ error: "Failed to generate query" });
      }
    });

    app.get("/api/query-history", (req: Request, res: Response) => {
      try {
        const history = queryHistory.getHistory();
        console.log("Sending query history:", history);
        res.json(history);
      } catch (error) {
        console.error("Error retrieving query history:", error);
        res.status(500).json({ error: "Failed to retrieve query history" });
      }
    });

    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT} ORM - ${ormType}, AI - ${
          aiProvider || "None"
        }`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

export { runCLI } from "./cli/cli";
