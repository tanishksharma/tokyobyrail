// Supabase Edge Function: rail-open
// POST -> counts one opening of Tokyo by rail and returns { opens }.
//
// The twin of rail-like, and the same rules: verify_jwt=false because the
// site calls it with no account, access control is origin-based against
// BOTH production hostnames, and the service-role-only
// public.record_rail_open RPC does the counting. Nothing about the
// visitor is stored, not even a hash — an open is a tally, not a visit.

import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://tokyorail.tanishk.ai",
  "https://tokyobyrail.vercel.app",
]);

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) {
    return new Response(null, { status: 403 });
  }
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: corsHeaders(origin) });
  }

  const { data, error } = await supabase.rpc("record_rail_open");
  if (error) {
    console.error("record_rail_open failed:", error.message);
    return new Response(null, { status: 500, headers: corsHeaders(origin) });
  }
  return new Response(JSON.stringify({ opens: data ?? 0 }), {
    status: 200,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
});
