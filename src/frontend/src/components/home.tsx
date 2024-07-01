/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
interface SchemaField {
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

interface ParsedSchema {
  databaseType: string;
  models: SchemaModel[];
  enums: { name: string; values: string[] }[];
}
export default function Component() {
  const [schema, setSchema] = useState<ParsedSchema | null>(null);
  const [expandedTables, setExpandedTables] = useState<{
    [key: string]: boolean;
  }>({});
  const [schemaSummary, setSchemaSummary] = useState<string>("");

  useEffect(() => {
    fetchSchema();
  }, []);

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
      console.log("Data", data);
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





  //here is the endpoint for parsing the prompt and the schema

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
      
      console.log("Parsed prompt:", data.parsedPrompt);
      console.log("Parsed schema:", data.parsedSchema);
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  };


  const [inputValue, setInputValue] = useState('');
  const handleInputChanges = (e: any): void => {
    setInputValue(e.target.value);
  };

  const handleRunClick = (): void => {
    console.log("The input prompt is:", inputValue);
    fetchParsedData();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="py-4 px-6 bg-primary text-primary-foreground flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DatabaseIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold font-geist">Maven studio</h1>
        </div>
        <Button variant="secondary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Query
        </Button>
      </header>
      <main className="flex-1 grid grid-cols-[300px_1fr] gap-6 p-6">
        <div className="rounded-lg shadow-md p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium font-geist">Database Schema</h2>
            <Button variant="ghost" size="icon" onClick={fetchSchema}>
              <RefreshCwIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-2">
            {schema?.models.map((model: any) => (
              <div key={model.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-5 h-5" />
                    <span className="font-geist">{model.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTable(model.name)}
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </Button>
                </div>
                {expandedTables[model.name] && (
                  <div className="pl-6 space-y-1">
                    {model.fields.map((field: any) => (
                      <div key={field.name} className="flex items-center gap-2">
                        <span className="text-sm font-geist">
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
        <div className=" rounded-lg shadow-md p-4 space-y-4 ">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium font-geist">Query Builder</h2>
            <Button variant="ghost" size="icon">
              <MaximizeIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-4">
            <Button onClick={fetchSchemaSummary}>Get Schema Summary</Button>
            {schemaSummary && (
              <div className="p-4 rounded-lg">
                <h3 className="font-medium mb-2">Schema Summary:</h3>
                <p>{schemaSummary}</p>
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
            <div className=" rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CodeIcon className="w-5 h-5" />
                <span className="font-medium font-geist">Generated Code</span>
              </div>
              <pre className="text-sm text-muted-foreground font-geist">{`const users = await prisma.user.findMany({
  include: {
    posts: true,
    comments: true,
  },
});`}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function MaximizeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function MicIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function RefreshCwIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function TableIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  );
}
