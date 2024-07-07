import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { SkeletonPage } from "@/components/comps/skeleton-card";

export default function SchemaSummary() {
  const [schemaSummary, setSchemaSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSchemaSummary();
  }, []);

  const fetchSchemaSummary = async () => {
    setIsLoading(true);
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
      setSchemaSummary("Error fetching schema summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <h2 className="text-lg font-medium mb-4">Schema Summary</h2>
      {isLoading ? (
        <SkeletonPage />
      ) : schemaSummary ? (
        <div className="p-4 rounded-lg bg-muted">
          <Markdown remarkPlugins={[remarkGfm]}>{schemaSummary}</Markdown>
        </div>
      ) : (
        <p>Error fetching schema summary</p>
      )}
      <Button onClick={fetchSchemaSummary} className="mt-4">
        Refresh Schema Summary
      </Button>
    </div>
  );
}
