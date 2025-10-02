// Service layer for Prompt Rules data operations
import { createClient } from "@supabase/supabase-js";

// Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = "https://snregmhjviiklvxkiwpp.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucmVnbWhqdmlpa2x2eGtpd3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTMzNTAsImV4cCI6MjA3Mzg2OTM1MH0.QV2xQI-6MNUXNP9kFleOBUSFONCmki84RaCYLvqxl6I";

  return createClient(supabaseUrl, supabaseKey);
};

export interface PromptRule {
  id?: number;
  prompt: string;
  created_at?: string;
  updated_at?: string;
}

export class PromptRulesService {
  // Get all prompt rules
  static async getAllPromptRules(): Promise<{
    data: PromptRule[] | null;
    error: { message: string } | null;
  }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client not configured");
      }

      const { data, error } = await supabase
        .from("promptRules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[v0] Supabase error:", error);
        return { data: null, error: { message: error.message } };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error("[v0] Database error:", err);
      return {
        data: null,
        error: { message: "Failed to fetch prompt rules from database" },
      };
    }
  }

  // Get a single prompt rule by ID
  static async getPromptRuleById(id: number): Promise<{
    data: PromptRule | null;
    error: { message: string } | null;
  }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client not configured");
      }

      const { data, error } = await supabase
        .from("promptRules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("[v0] Supabase error:", error);
        return { data: null, error: { message: error.message } };
      }

      return { data: data, error: null };
    } catch (err) {
      console.error("[v0] Database error:", err);
      return {
        data: null,
        error: { message: "Failed to fetch prompt rule from database" },
      };
    }
  }

  // Create a new prompt rule
  static async createPromptRule(prompt: string): Promise<{
    data: PromptRule | null;
    error: { message: string } | null;
  }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client not configured");
      }

      const { data, error } = await supabase
        .from("promptRules")
        .insert([{ prompt }])
        .select()
        .single();

      if (error) {
        console.error("[v0] Supabase error:", error);
        return { data: null, error: { message: error.message } };
      }

      return { data: data, error: null };
    } catch (err) {
      console.error("[v0] Database error:", err);
      return {
        data: null,
        error: { message: "Failed to create prompt rule" },
      };
    }
  }

  // Update an existing prompt rule
  static async updatePromptRule(
    id: number,
    prompt: string
  ): Promise<{
    data: PromptRule | null;
    error: { message: string } | null;
  }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client not configured");
      }

      const { data, error } = await supabase
        .from("promptRules")
        .update({ prompt, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("[v0] Supabase error:", error);
        return { data: null, error: { message: error.message } };
      }

      return { data: data, error: null };
    } catch (err) {
      console.error("[v0] Database error:", err);
      return {
        data: null,
        error: { message: "Failed to update prompt rule" },
      };
    }
  }

  // Delete a prompt rule
  static async deletePromptRule(id: number): Promise<{
    success: boolean;
    error: { message: string } | null;
  }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client not configured");
      }

      const { error } = await supabase
        .from("promptRules")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[v0] Supabase error:", error);
        return { success: false, error: { message: error.message } };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error("[v0] Database error:", err);
      return {
        success: false,
        error: { message: "Failed to delete prompt rule" },
      };
    }
  }
}
