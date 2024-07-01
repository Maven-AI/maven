import { CodeIcon } from 'lucide-react'


export const CodeCard = ({ resultQuery }:{resultQuery:any}) => {
    return (
        <div className="rounded-lg p-4 space-y-2 bg-muted">
            <div className="flex items-center gap-2">
                <CodeIcon className="w-5 h-5" />
                <span className="font-medium">Generated Code</span>
            </div>
            <pre className="text-sm">{
                resultQuery
            }</pre>
        </div>
    )
}

