"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, X } from "lucide-react"

interface AddRuleFormProps {
  onSave: (text: string) => Promise<void>
  onCancel: () => void
}

export function AddRuleForm({ onSave, onCancel }: AddRuleFormProps) {
  const [text, setText] = useState("")

  const handleSave = async () => {
    if (!text.trim()) return
    await onSave(text)
    setText("")
  }

  return (
    <Card className="bg-card border-border border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-lg">Add New Rule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the new rule text..."
          className="min-h-[120px] resize-y"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2" disabled={!text.trim()}>
            <Save className="h-4 w-4" />
            Save Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
