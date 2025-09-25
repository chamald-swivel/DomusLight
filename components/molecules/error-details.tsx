import { AlertCircle } from "lucide-react"

interface ErrorDetailsProps {
  errors: string[]
}

export function ErrorDetails({ errors }: ErrorDetailsProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-destructive">Error Details</h4>
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
        <div className="space-y-3">
          <ul className="text-sm text-destructive space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
