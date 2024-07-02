import fs from "fs";
import path from "path";

interface QueryEntry {
  id: string;
  prompt: string;
  query: string;
  timestamp: Date;
}

class QueryHistory {
  private history: QueryEntry[] = [];
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, "queryHistory.json");
    this.loadHistory();
  }

  private loadHistory(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, "utf8");
        this.history = JSON.parse(data);
        console.log("Loaded query history:", this.history);
      }
    } catch (error) {
      console.error("Error loading query history:", error);
    }
  }

  private saveHistory(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.history, null, 2));
      console.log("Saved query history:", this.history);
    } catch (error) {
      console.error("Error saving query history:", error);
    }
  }

  addQuery(prompt: string, query: string): void {
    const entry: QueryEntry = {
      id: Date.now().toString(),
      prompt,
      query,
      timestamp: new Date(),
    };
    this.history.push(entry);
    this.saveHistory();
  }

  getHistory(): QueryEntry[] {
    return this.history;
  }
}

export const queryHistory = new QueryHistory();
