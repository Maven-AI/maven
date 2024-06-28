#!/usr/bin/env node

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { ORMType, getSchemaForORM } from "./orm/OrmHandler";

export async function startServer(
  ormType: ORMType,
  apiKey?: string
): Promise<void> {
  try {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use(express.static(path.join(__dirname, "../dist")));

    app.get("/api/schema", async (req: Request, res: Response) => {
      try {
        const schema = await getSchemaForORM(ormType);
        console.log(schema);
        res.json(schema);
      } catch (error) {
        console.error("Error fetching schema:", error);
        res.status(500).json({ error: "Failed to fetch schema" });
      }
    });

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../dist/index.html"));
    });

    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT} ORM - ${ormType}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

export { runCLI } from "./cli/cli";
