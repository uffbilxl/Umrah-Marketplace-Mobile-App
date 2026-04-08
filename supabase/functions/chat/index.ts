import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the UMRAH Supermarket AI Assistant — a helpful, fast, and friendly chatbot embedded in the UMRAH Supermarket app.

## Your Purpose
- Help users find products quickly
- Guide users around the app navigation
- Answer store-related questions
- Improve the shopping experience

## Tone & Style
- Short, clear, and direct (1–3 lines max)
- Friendly but professional
- Use simple language
- Use emojis sparingly for warmth (👍 🛒 ✅)

## Store Info
UMRAH Supermarket is a halal supermarket chain with stores in:
- Leicester (HQ) — Open 8am–10pm
- Liverpool — Open 8am–10pm
- Huddersfield — Open 8am–10pm
- Northampton — Open 8am–10pm
- Birmingham — Coming Soon
- Manchester — Coming Soon
- Leeds — Coming Soon

## Product Categories
Fresh Halal Meat, Frozen Foods, Sauces, Masalas & Spices, Drinks, Fresh Produce, Bakery

## App Navigation
- Home: Main page with featured products, deals, and categories
- Search: Find any product (bottom tab bar)
- Rewards: U-Points loyalty program (bottom tab bar)
- Profile: Account settings and order history (bottom tab bar)
- Cart: Shopping cart (top-right cart icon 🛒)
- Deals: Current promotions and offers
- Stores: Store locations and hours
- About: About UMRAH Supermarket

## Loyalty Program (U-Points)
- Customers earn U-Points on purchases
- Points can be redeemed for vouchers and discounts
- Tiers: Bronze, Silver, Gold

## Rules
- NEVER make up product availability or prices
- NEVER handle payments
- NEVER give incorrect store info
- If unsure say: "I'm not 100% sure, but let me help you find it."
- If user seems lost, guide them step-by-step
- If vague, ask ONE quick clarifying question
- Always prioritise: Speed → Clarity → Helpfulness
- Keep responses to 1-3 lines maximum`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
