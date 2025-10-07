"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Trash2, Save, X } from "lucide-react"
import type { PromptRule } from "@/lib/prompt-rules-service"

interface RuleCardProps {
  rule: PromptRule
  onUpdate: (id: number, text: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function RuleCard({ rule, onUpdate, onDelete }: RuleCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(rule.prompt)

  const handleSave = async () => {
    if (!editText.trim()) return
    await onUpdate(rule.id!, editText)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(rule.prompt)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this rule?")) {
      await onDelete(rule.id!)
    }
  }

  return (
    <Card className={`bg-card border-border ${isEditing ? "border-2 border-primary" : ""}`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-[120px] resize-y"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{rule.prompt}</p>
              {rule.created_at && (
                <p className="text-xs text-muted-foreground mt-2">
                  Created: {new Date(rule.created_at).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="gap-2 text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
