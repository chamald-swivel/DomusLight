"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Plus,
  Save,
  Trash2,
  Edit2,
  X,
  Check,
  ArrowLeft,
} from "lucide-react";
import {
  PromptRulesService,
  type PromptRule,
} from "../../lib/prompt-rules-service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function PromptRulesPage() {
  const [rules, setRules] = useState<PromptRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRuleText, setNewRuleText] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: serviceError } =
        await PromptRulesService.getAllPromptRules();

      if (serviceError) {
        setError(`Failed to fetch rules: ${serviceError.message}`);
        return;
      }

      setRules(data || []);
    } catch (err) {
      setError("Failed to connect to database");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: PromptRule) => {
    setEditingId(rule.id || null);
    setEditingText(rule.prompt);
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingText.trim()) {
      setError("Rule text cannot be empty");
      return;
    }

    try {
      const { data, error: serviceError } =
        await PromptRulesService.updatePromptRule(id, editingText);

      if (serviceError) {
        setError(`Failed to update rule: ${serviceError.message}`);
        return;
      }

      setSuccessMessage("Rule updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      setEditingId(null);
      setEditingText("");
      fetchRules();
    } catch (err) {
      setError("Failed to update rule");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this rule?")) {
      return;
    }

    try {
      const { success, error: serviceError } =
        await PromptRulesService.deletePromptRule(id);

      if (!success || serviceError) {
        setError(`Failed to delete rule: ${serviceError?.message}`);
        return;
      }

      setSuccessMessage("Rule deleted successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      fetchRules();
    } catch (err) {
      setError("Failed to delete rule");
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setNewRuleText("");
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewRuleText("");
  };

  const handleSaveNew = async () => {
    if (!newRuleText.trim()) {
      setError("Rule text cannot be empty");
      return;
    }

    try {
      const { data, error: serviceError } =
        await PromptRulesService.createPromptRule(newRuleText);

      if (serviceError) {
        setError(`Failed to create rule: ${serviceError.message}`);
        return;
      }

      setSuccessMessage("Rule created successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      setIsAddingNew(false);
      setNewRuleText("");
      fetchRules();
    } catch (err) {
      setError("Failed to create rule");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading prompt rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link href="/">
              <Button variant="ghost" className="gap-2 mb-2 -ml-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Prompt Rules Management
            </h1>
            <p className="text-muted-foreground">
              Manage rules included in the PO extraction prompt
            </p>
          </div>
          <Button
            onClick={handleAddNew}
            disabled={isAddingNew}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Rule
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Add New Rule Card */}
        {isAddingNew && (
          <Card className="bg-card border-border border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-lg">Add New Rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                placeholder="Enter the new rule text..."
                className="min-h-[120px] resize-y"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelAdd}
                  className="gap-2 bg-transparent"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveNew} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rules List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Current Rules ({rules.length})
          </h2>

          {rules.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No prompt rules found. Add your first rule to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <Card
                  key={rule.id}
                  className={`bg-card border-border ${
                    editingId === rule.id ? "border-2 border-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    {editingId === rule.id ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="min-h-[120px] resize-y"
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="gap-2 bg-transparent"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSaveEdit(rule.id!)}
                            className="gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                            {rule.prompt}
                          </p>
                          {rule.created_at && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Created:{" "}
                              {new Date(rule.created_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(rule)}
                            className="gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(rule.id!)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
