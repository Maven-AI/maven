import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { ORMType, getSchemaForORM } from "./orm/OrmHandler";

export async function startServer(
  ormType: ORMType,
  connectionString: string
): Promise<void> {
  try {
    // await connectDatabase(ormType, connectionString);

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use(express.static(path.join(__dirname, "../src/frontend/dist")));

    //     app.get("/api/schema", async (req: Request, res: Response) => {
    //       try {
    //         const schema = await getSchemaForORM(ormType);
    //         res.json(schema);
    //       } catch (error) {
    //         console.error("Error fetching schema:", error);
    //         res.status(500).json({ error: "Failed to fetch schema" });
    //       }
    //     });

    //     app.get("/api/tables/:tableName", async (req: Request, res: Response) => {
    //       try {
    //         const { tableName } = req.params;
    //         // Basic validation
    //         if (
    //           typeof tableName !== "string" ||
    //           !tableName.match(/^[a-zA-Z0-9_]+$/)
    //         ) {
    //           return res.status(400).json({ error: "Invalid table name" });
    //         }
    //         const data = await getTableData(ormType, tableName);
    //         res.json(data);
    //       } catch (error) {
    //         console.error("Error fetching table data:", error);
    //         res.status(500).json({ error: "Failed to fetch table data" });
    //       }
    //     });

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../src/frontend/dist/index.html"));
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
