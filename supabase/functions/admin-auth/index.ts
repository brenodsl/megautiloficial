import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for password (using Web Crypto API)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "admin_salt_key_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, username, password } = await req.json();

    if (action === "check") {
      // Check if admin credentials exist
      const { data, error } = await supabase
        .from("admin_credentials")
        .select("id")
        .limit(1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ exists: data && data.length > 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "setup") {
      // First-time setup - create admin credentials
      const { data: existing } = await supabase
        .from("admin_credentials")
        .select("id")
        .limit(1);

      if (existing && existing.length > 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Credenciais já configuradas" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      const passwordHash = await hashPassword(password);

      const { error } = await supabase
        .from("admin_credentials")
        .insert({ username, password_hash: passwordHash });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "login") {
      // Verify credentials
      const passwordHash = await hashPassword(password);

      const { data, error } = await supabase
        .from("admin_credentials")
        .select("*")
        .eq("username", username)
        .eq("password_hash", passwordHash)
        .limit(1);

      if (error) throw error;

      const isValid = data && data.length > 0;

      return new Response(
        JSON.stringify({ success: isValid }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );

  } catch (error: unknown) {
    console.error("Admin auth error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
