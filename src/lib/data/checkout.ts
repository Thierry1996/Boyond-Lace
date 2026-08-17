import "server-only";

/**
 * Medusa checkout data layer — the real cart → order flow, run server-side against
 * Medusa's Store API. The storefront's client cart (zustand) is resolved into a
 * genuine Medusa cart here: variants matched from selections, addresses + shipping
 * set, a payment collection opened, and the cart completed into an order. Ambassador
 * attribution rides `metadata.referral_code` → the backend `order.placed` subscriber
 * credits the commission.
 *
 * Payment providers are read live from Medusa, so each method (Stripe → Card/Apple
 * Pay/Google Pay/Klarna/Afterpay, Paystack → mobile money, PayPal, etc.) appears the
 * moment it's enabled in the backend — the UI never hardcodes the list.
 */

const BACKEND = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
const KEY = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const REGION_ID = process.env.MEDUSA_REGION_ID || "";

async function store<T = any>(
  path: string,
  init: RequestInit & { query?: Record<string, string | undefined> } = {},
): Promise<T> {
  const url = new URL(`${BACKEND}/store/${path}`);
  for (const [k, v] of Object.entries(init.query ?? {})) if (v != null) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-publishable-api-key": KEY,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Medusa ${path} → ${res.status} ${body.slice(0, 200)}`);
  }
  return res.json();
}

export interface CheckoutContext {
  regionId: string;
  paymentProviders: { id: string; label: string }[];
}

const PROVIDER_LABELS: Record<string, string> = {
  pp_system_default: "Test payment (no charge)",
  pp_stripe_stripe: "Card · Apple Pay · Google Pay · Klarna · Afterpay",
  pp_paypal_paypal: "PayPal",
  pp_paystack_paystack: "Card & Mobile Money (Paystack)",
  pp_flutterwave_flutterwave: "Card & Mobile Money (Flutterwave)",
};
const labelFor = (id: string) =>
  PROVIDER_LABELS[id] ??
  id.replace(/^pp_/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** What the checkout UI needs up front: the region and the live list of methods. */
export async function getCheckoutContext(): Promise<CheckoutContext> {
  const { payment_providers = [] } = await store<{ payment_providers: { id: string; is_enabled: boolean }[] }>(
    "payment-providers",
    { query: { region_id: REGION_ID } },
  ).catch(() => ({ payment_providers: [] }));
  return {
    regionId: REGION_ID,
    paymentProviders: payment_providers
      .filter((p) => p.is_enabled)
      .map((p) => ({ id: p.id, label: labelFor(p.id) })),
  };
}

export interface OrderLineInput {
  slug: string;
  selections: Record<string, string>;
  quantity: number;
}
export interface CheckoutAddress {
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  postal_code: string;
  country_code: string; // ISO-2, lowercase
  province?: string;
  phone?: string;
}

/** Match a cart line's option selections to a Medusa variant id. */
async function resolveVariantId(line: OrderLineInput): Promise<string> {
  const { products } = await store<{ products: any[] }>("products", {
    query: {
      handle: line.slug,
      region_id: REGION_ID,
      fields: "id,*variants,*variants.options",
    },
  });
  const product = products?.[0];
  if (!product) throw new Error(`Unknown unit: ${line.slug}`);
  const wanted = Object.entries(line.selections);
  const variant =
    product.variants.find((v: any) =>
      wanted.every(([, val]) => (v.options ?? []).some((o: any) => o.value === val)),
    ) ?? product.variants[0];
  if (!variant) throw new Error(`No variant for ${line.slug}`);
  return variant.id;
}

export interface PlaceOrderResult {
  ok: boolean;
  orderId?: string;
  displayId?: number;
  /** Set when the provider needs a client-side step (e.g. Stripe) before completion. */
  requiresAction?: { providerId: string; paymentCollectionId: string; clientSecret?: string };
  error?: string;
}

/**
 * Build a real Medusa cart from the client cart and either complete it (test/redirect
 * providers) or hand back the payment session for a client-side provider to finish.
 */
export async function placeOrder(input: {
  lines: OrderLineInput[];
  address: CheckoutAddress;
  providerId: string;
  referralCode?: string;
}): Promise<PlaceOrderResult> {
  try {
    // 1. Resolve variants, create the cart with items + attribution.
    const items = await Promise.all(
      input.lines.map(async (l) => ({ variant_id: await resolveVariantId(l), quantity: l.quantity })),
    );
    const addr = {
      first_name: input.address.first_name,
      last_name: input.address.last_name,
      address_1: input.address.address_1,
      city: input.address.city,
      postal_code: input.address.postal_code,
      country_code: input.address.country_code,
      province: input.address.province,
      phone: input.address.phone,
    };
    const { cart } = await store<{ cart: any }>("carts", {
      method: "POST",
      body: JSON.stringify({
        region_id: REGION_ID,
        email: input.address.email,
        items,
        shipping_address: addr,
        billing_address: addr,
        metadata: input.referralCode ? { referral_code: input.referralCode } : undefined,
      }),
    });

    // 2. Shipping — pick the first option available to this cart.
    const { shipping_options = [] } = await store<{ shipping_options: any[] }>("shipping-options", {
      query: { cart_id: cart.id },
    });
    if (!shipping_options.length) {
      return { ok: false, error: "No shipping option is available for this destination yet." };
    }
    await store(`carts/${cart.id}/shipping-methods`, {
      method: "POST",
      body: JSON.stringify({ option_id: shipping_options[0].id }),
    });

    // 3. Payment collection + session for the chosen provider.
    const { payment_collection } = await store<{ payment_collection: any }>("payment-collections", {
      method: "POST",
      body: JSON.stringify({ cart_id: cart.id }),
    });
    const { payment_collection: withSession } = await store<{ payment_collection: any }>(
      `payment-collections/${payment_collection.id}/payment-sessions`,
      { method: "POST", body: JSON.stringify({ provider_id: input.providerId }) },
    );

    // 4. Providers that settle client-side (Stripe) hand back their session; the UI
    //    confirms, then calls completeOrder. Test/redirect providers complete now.
    const session = (withSession.payment_sessions ?? []).find(
      (s: any) => s.provider_id === input.providerId,
    );
    const clientStep = /stripe/.test(input.providerId);
    if (clientStep) {
      return {
        ok: true,
        requiresAction: {
          providerId: input.providerId,
          paymentCollectionId: payment_collection.id,
          clientSecret: session?.data?.client_secret,
        },
      };
    }

    return completeOrder(cart.id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Checkout failed" };
  }
}

/** Complete a cart into an order (called after client-side payment confirmation too). */
export async function completeOrder(cartId: string): Promise<PlaceOrderResult> {
  try {
    const result = await store<any>(`carts/${cartId}/complete`, { method: "POST" });
    if (result.type === "order") {
      return { ok: true, orderId: result.order.id, displayId: result.order.display_id };
    }
    return { ok: false, error: result.error?.message ?? "Order could not be completed" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Completion failed" };
  }
}
