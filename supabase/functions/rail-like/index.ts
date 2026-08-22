// Supabase Edge Function: rail-like
// POST { line } -> toggles this visitor's heart on one railway line of
// tokyorail.tanishk.ai and returns { likes, liked }.
//
// The twin of increment-like: deployed with verify_jwt=false (the static
// site calls it with no account at all), access control is origin-based,
// the caller IP is hashed with the VIEW_IP_SALT secret so only the hash
// ever reaches the database, and the service-role-only
// public.record_rail_like RPC does the toggle and the count.

import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://tokyorail.tanishk.ai",
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

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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

  let line: unknown;
  try {
    ({ line } = await req.json());
  } catch {
    return new Response(null, { status: 400, headers: corsHeaders(origin) });
  }
  if (typeof line !== "string" || line === "" || line.length > 120) {
    return new Response(null, { status: 400, headers: corsHeaders(origin) });
  }

  const salt = Deno.env.get("VIEW_IP_SALT");
  if (!salt) {
    console.error("VIEW_IP_SALT secret is not set");
    return new Response(null, { status: 500, headers: corsHeaders(origin) });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const ipHash = await sha256Hex(ip + salt);

  const { data, error } = await supabase.rpc("record_rail_like", {
    p_line: line,
    p_ip_hash: ipHash,
  });
  if (error) {
    console.error("record_rail_like failed:", error.message);
    return new Response(null, { status: 500, headers: corsHeaders(origin) });
  }

  const row = Array.isArray(data) ? data[0] : data;
  return new Response(JSON.stringify(row ?? {}), {
    status: 200,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
});
