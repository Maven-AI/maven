/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ModeToggle } from "./mode-toggle";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DatabaseIcon,
  MaximizeIcon,
  MicIcon,
  PlusIcon,
  RefreshCwIcon,
  SendIcon,
  TableIcon,
} from "lucide-react";
import { CodeCard } from "./code-card";

export interface SchemaField {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  attributes?: string;
}

export interface SchemaModel {
  name: string;
  fields: SchemaField[];
}

export interface ParsedSchema {
  databaseType: string;
  models: SchemaModel[];
  enums: { name: string; values: string[] }[];
}

export interface QueryHistoryEntry {
  id: string;
  prompt: string;
  query: string;
  timestamp: string;
}

export default function Component() {
  const [schema, setSchema] = useState<ParsedSchema | null>(null);
  const [expandedTables, setExpandedTables] = useState<{
    [key: string]: boolean;
  }>({});
  const [schemaSummary, setSchemaSummary] = useState<string>("");
  const [resultQuery, setResultQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>([]);

  const fetchSchema = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/schema");
      const data = await response.json();
      setSchema(data);
      await fetchSchemaSummary();
    } catch (error) {
      console.error("Error fetching schema:", error);
    }
  };

  const fetchSchemaSummary = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/summarize-schema",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log("Schema summary:", data);
      setSchemaSummary(data.summary);
    } catch (error) {
      console.error("Error fetching schema summary:", error);
    }
  };

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev: any) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const fetchParsedData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/parse-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputValue, schema: schema }),
      });
      const data = await response.json();
      console.log("Parsed Data:", data);

      if (data.query) {
        setResultQuery(data.query);
      } else {
        setResultQuery("No query generated.");
      }

      console.log("Parsed prompt:", inputValue);
      console.log("Parsed schema:", schema);
    } catch (error) {
      console.error("Error parsing data:", error);
      setResultQuery("Error generating query.");
    }
  };

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleRunClick = async (): Promise<void> => {
    console.log("The input prompt is:", inputValue);
    await fetchParsedData();
    await fetchQueryHistory();
  };

  const fetchQueryHistory = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/query-history");
      const data = await response.json();
      console.log("Fetched query history:", data);
      setQueryHistory(data);
    } catch (error) {
      console.error("Error fetching query history:", error);
    }
  };

  useEffect(() => {
    fetchSchema();
    fetchQueryHistory();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-card">
      <header className="py-4 px-6 flex items-center border-b">
        <div className="flex items-center gap-4">
          <DatabaseIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold dark:text">Maven studio</h1>
        </div>
        <div className="ml-auto flex justify-center items-center gap-4">
          <ModeToggle />
          <Button variant="secondary">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Query
          </Button>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-[300px_1fr]">
        <div className="shadow-md p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Database Schema</h2>
            <Button variant="ghost" size="icon" onClick={fetchSchema}>
              <RefreshCwIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-2">
            {schema?.models.map((model) => (
              <div key={model.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-5 h-5" />
                    <span>{model.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTable(model.name)}
                  >
                    {expandedTables[model.name] ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                {expandedTables[model.name] && (
                  <div className="pl-6 space-y-1">
                    {model.fields.map((field) => (
                      <div key={field.name} className="flex items-center gap-2">
                        <span className="text-sm">
                          {field.name}: {field.type}
                        </span>
                        {field.attributes && (
                          <span className="text-xs text-gray-500">
                            {field.attributes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="border-l shadow-md p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Query Builder</h2>
            <Button variant="ghost" size="icon">
              <MaximizeIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-4">
            <Button onClick={fetchSchemaSummary}>Get Schema Summary</Button>
            {schemaSummary && (
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="font-medium mb-2">Schema Summary:</h3>
                <Markdown remarkPlugins={[remarkGfm]}>{schemaSummary}</Markdown>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MicIcon className="w-5 h-5" />
              <Input
                placeholder="Enter your prompt..."
                className="flex-1"
                autoComplete="off"
                value={inputValue}
                onChange={handleInputChanges}
              />
              <Button variant="secondary" onClick={handleRunClick}>
                <SendIcon className="w-4 h-4 mr-2" />
                Run
              </Button>
            </div>
            <CodeCard resultQuery={resultQuery} />
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Query History</h3>
              {queryHistory && queryHistory.length > 0 ? (
                queryHistory.map((entry) => (
                  <div key={entry.id} className="mb-4 p-4 bg-muted rounded-lg">
                    <p className="font-medium">Prompt: {entry.prompt}</p>
                    <p className="mt-2">
                      Query:{" "}
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {entry.query}
                      </Markdown>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No query history available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
