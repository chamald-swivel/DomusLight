interface FieldDisplayProps {
  label: string
  value: string | number
  variant?: "default" | "bold" | "success"
}

export function FieldDisplay({ label, value, variant = "default" }: FieldDisplayProps) {
  const getValueClasses = () => {
    switch (variant) {
      case "bold":
        return "text-sm font-bold text-foreground"
      case "success":
        return "text-sm font-bold text-green-600 dark:text-green-400"
      default:
        return "text-sm font-medium text-foreground"
    }
  }

  return (
    <div className="bg-background rounded-md p-3 border border-border">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={getValueClasses()}>{value || "N/A"}</div>
    </div>
  )
}
