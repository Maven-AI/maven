import { CodeIcon } from "lucide-react";
import Markdown from "react-markdown";

import remarkGfm from "remark-gfm";
export const CodeCard = ({ resultQuery }: { resultQuery: string }) => {
  return (
    <div className="rounded-lg p-4 space-y-2 bg-muted">
      <div className="flex items-center gap-2">
        <CodeIcon className="w-5 h-5" />
        <span className="font-medium">Generated Code</span>
      </div>
      <Markdown remarkPlugins={[remarkGfm]}>{resultQuery}</Markdown>
    </div>
  );
};
