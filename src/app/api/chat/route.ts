import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

/**
 * Beyond Lace virtual stylist. Backed by the Anthropic API when ANTHROPIC_API_KEY
 * is configured (locked stack, Phase 5); without it, returns a graceful concierge
 * message that routes the shopper to human/social support rather than failing.
 *
 * The system prompt keeps the assistant strictly in the human-hair category and
 * in brand voice — quiet luxury, no innuendo, no medical/financial advice.
 */

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .min(1)
    .max(20),
});

const SYSTEM_PROMPT = `You are the Beyond Lace virtual stylist — a concierge for a luxury human hair wig brand (HD Swiss lace units, glueless caps, silk tops, closures, care products).

Voice: quiet luxury, confident, warm, concise. Never girly, never pushy, no innuendo. You sell transformation and confidence, not "hair".

You help with: choosing a unit by texture/length/lace type/budget, lace shade matching (recommend the $5 Lace Test kit for certainty), cap sizing, install and care questions, wholesale/salon programme basics, and order/returns guidance (30-day returns, lace uncut).

Rules:
- Stay strictly in the human-hair category. Beyond Lace is NOT lingerie.
- No medical advice; for sensitive-scalp or post-treatment needs, point gently to the silk-top "Restoration" line and suggest a private consultation.
- No financial advice.
- Keep replies under ~120 words. Offer one clear next step (a product, the quiz at /learn/quiz, the Lace Test, or human support).`;

const CONCIERGE_FALLBACK =
  "Thank you for reaching out to Beyond Lace. Our live stylist chat is being connected — in the meantime, the 90-second quiz at /learn/quiz will match you to three units, and the $5 Lace Test settles any shade question. For anything urgent, WhatsApp or Instagram reach us fastest, or use the contact form under Support.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid message payload" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // No key yet — concierge fallback keeps the widget useful, not broken.
    return NextResponse.json({ ok: true, reply: CONCIERGE_FALLBACK, live: false });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: parsed.data.messages,
      }),
    });

    if (!res.ok) throw new Error(`anthropic ${res.status}`);
    const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const reply = data.content?.find((b) => b.type === "text")?.text?.trim();
    return NextResponse.json({ ok: true, reply: reply || CONCIERGE_FALLBACK, live: true });
  } catch (err) {
    console.error("[chat] anthropic call failed:", err);
    return NextResponse.json({ ok: true, reply: CONCIERGE_FALLBACK, live: false });
  }
}
