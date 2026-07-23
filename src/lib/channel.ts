/**
 * Channel constants and types — deliberately NOT a client module.
 *
 * The Zustand store in stores/channel.ts is "use client", and a server
 * component (the wholesale catalogue, the wholesale PDP, its metadata) cannot
 * import anything from a client module — Next treats every such export as a
 * client reference. These plain values live here so both sides can share them.
 */

export type Channel = "retail" | "wholesale";

/** Trade orders start here. Also the brand's stated salon MOQ. */
export const WHOLESALE_MOQ = 50;
/** Quantity increment on the wholesale quote stepper. */
export const WHOLESALE_STEP = 5;
