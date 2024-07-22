import { CodeIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "../ui/skeleton";

export const CodeCard = ({
  resultQuery,
  loading,
}: {
  resultQuery: string;
  loading: boolean;
}) => {
  return (
    <div className="rounded-lg p-4 space-y-2 bg-muted">
      <div className="flex items-center gap-2">
        <CodeIcon className="w-5 h-5" />
        <span className="font-medium">Generated Code</span>
      </div>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-slate-200" />
                <Skeleton className="h-4 w-[200px] bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        resultQuery && (
          <Markdown remarkPlugins={[remarkGfm]}>{resultQuery}</Markdown>
        )
      )}
    </div>
  );
};
