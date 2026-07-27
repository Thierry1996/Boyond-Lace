/**
 * Channel constants and types — deliberately NOT a client module.
 *
 * The Zustand store in stores/channel.ts is "use client", and a server
 * component (the wholesale catalogue, the wholesale PDP, its metadata) cannot
 * import anything from a client module — Next treats every such export as a
 * client reference. These plain values live here so both sides can share them.
 */

export type Channel = "retail" | "wholesale";

/**
 * Trade orders start here — five units, the first-trial minimum a small salon
 * or a new wig business can test us with before committing to a full tier.
 * Standing volume breaks then open at 50 and 200 (see the reseller ladder in
 * commerce/catalog.ts).
 */
export const WHOLESALE_MOQ = 5;
/** Quantity increment on the wholesale quote stepper. */
export const WHOLESALE_STEP = 5;
