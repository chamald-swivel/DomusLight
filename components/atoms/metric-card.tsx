import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  value: string | number
  label: string
  variant?: "default" | "error"
}

export function MetricCard({ value, label, variant = "default" }: MetricCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className={`text-4xl font-bold ${variant === "error" ? "text-destructive" : "text-foreground"}`}>
          {value}
        </div>
        <p className="text-base text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
