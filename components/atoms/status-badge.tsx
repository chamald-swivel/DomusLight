import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface StatusBadgeProps {
  hasError: boolean
}

export function StatusBadge({ hasError }: StatusBadgeProps) {
  if (hasError) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Error
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
      <CheckCircle2 className="h-3 w-3" />
      Success
    </Badge>
  )
}
