"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, ArrowLeft, Check } from "lucide-react";
import {
  PromptRulesService,
  type PromptRule,
} from "@/lib/prompt-rules-service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { RuleCard } from "@/components/molecules/rule-card";
import { AddRuleForm } from "@/components/molecules/add-rule-form";

export default function PromptRulesPage() {
  const [rules, setRules] = useState<PromptRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
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

  const handleUpdate = async (id: number, text: string) => {
    try {
      const { error: serviceError } = await PromptRulesService.updatePromptRule(
        id,
        text
      );

      if (serviceError) {
        setError(`Failed to update rule: ${serviceError.message}`);
        return;
      }

      setSuccessMessage("Rule updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchRules();
    } catch (err) {
      setError("Failed to update rule");
    }
  };

  const handleDelete = async (id: number) => {
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

  const handleSaveNew = async (text: string) => {
    try {
      const { error: serviceError } = await PromptRulesService.createPromptRule(
        text
      );

      if (serviceError) {
        setError(`Failed to create rule: ${serviceError.message}`);
        return;
      }

      setSuccessMessage("Rule created successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsAddingNew(false);
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
            onClick={() => setIsAddingNew(true)}
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

        {isAddingNew && (
          <AddRuleForm
            onSave={handleSaveNew}
            onCancel={() => setIsAddingNew(false)}
          />
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
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
