import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { ORMType, getSchemaForORM } from "../orm/OrmHandler";

export function startServer(ormType: ORMType): void {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Serve the static files from the Vite build output
  app.use(express.static(path.join(__dirname, "../src/frontend/dist")));

  app.get("/api/schema", async (req: Request, res: Response) => {
    try {
      const schema = await getSchemaForORM(ormType);
      res.json(schema);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schema" });
    }
  });

  // Handle all other routes by serving the index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/frontend/dist/index.html"));
  });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
