import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  return createSupabaseClient(
    "https://snregmhjviiklvxkiwpp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucmVnbWhqdmlpa2x2eGtpd3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTMzNTAsImV4cCI6MjA3Mzg2OTM1MH0.QV2xQI-6MNUXNP9kFleOBUSFONCmki84RaCYLvqxl6I"
  );
}
