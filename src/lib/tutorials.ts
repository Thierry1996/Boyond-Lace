/**
 * Tutorial library — trending wig-education topics for the PDP carousel.
 *
 * Placeholder posters (gradient fields) and seeded like counts until real video
 * lands; the copy is Beyond Lace's own. Ordered so the most broadly useful
 * guides lead, and `getTutorials` can bias the order toward a product's texture
 * so a curly unit surfaces the curl guides first.
 */

export interface Tutorial {
  id: string;
  title: string;
  subtitle: string;
  poster: string;
  duration: string;
  likes: number;
  /** Loose texture affinity, so a PDP can float the most relevant guides. */
  tag: "care" | "install" | "style" | "colour" | "curl" | "straight";
}

const TUTORIALS: Tutorial[] = [
  {
    id: "bundle-care",
    title: "Bundle Care Guide",
    subtitle: "How to wash without shedding",
    poster: "velvet",
    duration: "3:12",
    likes: 342,
    tag: "care",
  },
  {
    id: "lace-melt",
    title: "Lace Melt 101",
    subtitle: "A hairline nobody questions",
    poster: "plum",
    duration: "5:04",
    likes: 511,
    tag: "install",
  },
  {
    id: "glueless-install",
    title: "Glueless Install",
    subtitle: "On your head in four minutes",
    poster: "mono",
    duration: "4:28",
    likes: 468,
    tag: "install",
  },
  {
    id: "curl-define",
    title: "Curling Guide",
    subtitle: "Create defined curls that last",
    poster: "aurora",
    duration: "6:41",
    likes: 397,
    tag: "curl",
  },
  {
    id: "fullness",
    title: "Fullness Showcase",
    subtitle: "From root to tip",
    poster: "gold",
    duration: "2:55",
    likes: 289,
    tag: "style",
  },
  {
    id: "restyle-bodywave",
    title: "How to Restyle",
    subtitle: "Soft body-wave movement",
    poster: "blush",
    duration: "7:18",
    likes: 423,
    tag: "style",
  },
  {
    id: "colour-tone",
    title: "Colour & Tone at Home",
    subtitle: "Custom shades without the salon",
    poster: "mono-2",
    duration: "8:02",
    likes: 356,
    tag: "colour",
  },
];

/** Map a product texture to the tag its guides should lead with. */
function affinityFor(texture?: string): Tutorial["tag"] | undefined {
  if (!texture) return undefined;
  if (/curl|curly|wave|coil|deep|jerry/.test(texture)) return "curl";
  if (/straight|yaki/.test(texture)) return "straight";
  return undefined;
}

export function getTutorials(texture?: string): Tutorial[] {
  const lead = affinityFor(texture);
  if (!lead) return TUTORIALS;
  // Stable partition: matching guides first, order otherwise preserved.
  return [...TUTORIALS].sort((a, b) => Number(b.tag === lead) - Number(a.tag === lead));
}
