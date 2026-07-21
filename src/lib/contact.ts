/**
 * Contact details — single source of truth.
 *
 * Every phone number, email, handle and business hour on the site reads from
 * here. The source pages this was consolidated from carried two different
 * support emails and two different domains across sibling pages; centralising
 * makes that class of drift impossible.
 *
 * Beyond Lace operates as its own entity (Est. 2026). The operations desk and
 * manufacturing floor are shared infrastructure, so the voice line is real —
 * everything customer-addressable is Beyond Lace branded.
 */

/** E.164 without punctuation, for tel: and wa.me links. */
export const PHONE_E164 = "8614726001244";
/** Human-readable, for display. */
export const PHONE_DISPLAY = "+86 147 2600 1244";

export const EMAILS = {
  care: "care@beyondlace.com",
  partners: "partners@beyondlace.com",
  press: "press@beyondlace.com",
  ambassadors: "ambassadors@beyondlace.com",
  privacy: "privacy@beyondlace.com",
  accessibility: "accessibility@beyondlace.com",
} as const;

export const HANDLES = {
  instagram: "beyondlace",
  tiktok: "beyondlace",
  youtube: "beyondlace",
  pinterest: "beyondlace",
  telegram: "beyondlace",
  wechat: "beyondlace-official",
} as const;

export const URLS = {
  whatsapp: `https://wa.me/${PHONE_E164}`,
  whatsappPrefilled: `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
    "Hi Beyond Lace — I have a question about a unit.",
  )}`,
  phone: `tel:+${PHONE_E164}`,
  instagram: `https://instagram.com/${HANDLES.instagram}`,
  instagramDm: `https://ig.me/m/${HANDLES.instagram}`,
  tiktok: `https://tiktok.com/@${HANDLES.tiktok}`,
  youtube: `https://youtube.com/@${HANDLES.youtube}`,
  pinterest: `https://pinterest.com/${HANDLES.pinterest}`,
  telegram: `https://t.me/${HANDLES.telegram}`,
} as const;

/** Operations run on China Standard Time; the floor is in Xuchang. */
export const HOURS = [
  { day: "Monday – Friday", time: "9:00 – 18:00", note: "Full desk" },
  { day: "Saturday", time: "10:00 – 16:00", note: "Reduced desk" },
  { day: "Sunday", time: "Closed", note: "" },
  { day: "Public holidays", time: "By appointment", note: "" },
] as const;

export const TIMEZONE_NOTE =
  "All times China Standard Time (UTC+8) — the timezone of our manufacturing floor. International messages are answered within 24 hours regardless of when they land.";

/** Published response commitments, stated as targets we hold ourselves to. */
export const RESPONSE_TIMES = {
  whatsapp: "Under 2 hours",
  phone: "Mon–Fri, 9–18 CST",
  email: "Within 24 hours",
  instagram: "Checked daily",
  wechat: "Business hours CST",
  telegram: "Broadcast channel",
} as const;

export const LOCATION = {
  line1: "Hair District, Xuchang City",
  line2: "Henan Province, China",
  short: "Xuchang, China",
} as const;

/** Legal line. Beyond Lace is a separate entity — no other brand appears here. */
export const LEGAL = {
  entity: "Beyond Lace",
  established: 2026,
  copyright: (year: number = new Date().getFullYear()) =>
    `© ${year} Beyond Lace. All rights reserved.`,
} as const;
