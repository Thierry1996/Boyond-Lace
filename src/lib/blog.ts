import type { ImageryKey } from "@/lib/imagery";

/**
 * Beyond Lace Media Center content. A small in-code CMS: the blog index and the
 * article pages both read from BLOG_POSTS, so every card on the front page links
 * to a real, statically generated article. Replace with a headless CMS later
 * without touching the components — they only depend on this shape.
 */
export interface BlogPost {
  slug: string;
  title: string;
  tags: string[];
  /** ISO date; formatted for display by formatBlogDate. */
  date: string;
  image: ImageryKey;
  excerpt: string;
  /** Article body as paragraphs. */
  body: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "hair-grades-12a-vs-10a-vs-human-hair",
    title: "12A vs 10A vs 100% Human Hair: Which Grade Is Right for You?",
    tags: ["Wig Guide"],
    date: "2026-07-28",
    image: "navShop",
    excerpt:
      "Grade labels are marketing until you know what they actually measure. Here is how to read them.",
    body: [
      "Ask two suppliers what “12A” means and you will get two answers, because the grade scale is not standardised across the industry. What is verifiable is the construction: whether the cuticle is intact and aligned, whether the hair is single-donor, and whether it has been silicone-coated to fake shine.",
      "At Beyond Lace, 12A is our highest grade — unprocessed virgin hair with the cuticle intact and running in one direction, which is what prevents tangling and shedding over time. 10A is Remy hair: cuticle-aligned but lightly processed for a specific colour or texture. Both are 100% human; the difference is longevity and how they respond to colour.",
      "The practical rule: if you plan to bleach, dye, or keep a unit for two years or more, buy virgin 12A and treat it like your own hair. For a season-long style at a lower entry price, 10A Remy is honest value.",
    ],
  },
  {
    slug: "lace-size-explained-4x4-5x5-13x4-13x6-full-lace",
    title: "Lace Size Explained: 4×4, 5×5, 13×4, 13×6 and Full Lace — What to Choose",
    tags: ["Lace Size Guide", "Wig Guide"],
    date: "2026-07-25",
    image: "laceDetail",
    excerpt:
      "The numbers describe the parting space, not the wig. Match them to how you actually style.",
    body: [
      "Closure and frontal sizes describe the lace area at the front of the cap, measured in inches. A 4×4 closure gives four inches of parting space; a 13×6 frontal spans ear to ear with six inches of depth, so you can part anywhere and pull the hair fully back.",
      "If you part in one place and keep a simple middle or side part, a 4×4 or 5×5 closure is cheaper and lasts longer because there is less lace to maintain. If you want versatile partings, ponytails away from the face, or a truly seamless hairline, a 13×4 or 13×6 frontal earns its cost.",
      "Full lace is the most flexible and the most delicate — the entire cap is hand-tied lace, so it breathes and parts anywhere, but it needs the gentlest handling. Beginners are usually happiest starting with a 13×4 HD frontal.",
    ],
  },
  {
    slug: "make-your-human-hair-wig-last-2-years",
    title: "How to Make Your Human Hair Wig Last 2+ Years: Expert Care Routine",
    tags: ["Hair Care", "Wig Care Routine"],
    date: "2026-07-22",
    image: "navSupport",
    excerpt:
      "A good unit is an investment. Here is the professional routine that protects it.",
    body: [
      "With the right care, 100% human hair lasts twelve months or longer with regular wear — often well past two years with occasional wear. What decides the difference is friction, heat, and moisture, in that order.",
      "Wash every one to two weeks at most with a sulphate-free shampoo, always detangling from the ends up before you wet the hair. Deep condition monthly, use a leave-in after every wash, and never sleep in a unit without wrapping it in a silk or satin bonnet.",
      "Keep hot tools under 180°C and always use a heat protectant. Store the wig on a stand or in a silk bag away from direct sunlight. Treat it like it grew from your own scalp and it will behave like it did.",
    ],
  },
  {
    slug: "wear-and-go-wigs-beginner-installation-guide",
    title: "Wear-N-Go Wigs: The Complete Beginner’s Installation Guide",
    tags: ["Installation Guide", "Trending"],
    date: "2026-07-19",
    image: "navBrand",
    excerpt:
      "Glueless, pre-plucked, and ready in minutes. The full step-by-step for first-timers.",
    body: [
      "Wear-and-go wigs are built for speed: a pre-plucked hairline, bleached knots, and an elastic band with adjustable straps and combs, so there is no glue, no melting, and no wait time. The trade-off is that fit matters more, so measure your head before ordering.",
      "To install: braid your hair down flat or use a wig cap, position the unit from the front hairline back, then tighten the adjustable strap so the combs sit securely. Lay any baby hairs with a little edge control, and tuck the nape.",
      "Because there is no adhesive, you can take it off nightly and preserve both your edges and the lace. It is the most beginner-friendly install on the market — and increasingly what experienced wearers choose too.",
    ],
  },
  {
    slug: "hd-lace-wigs-2026-why-stylists-switching",
    title: "HD Lace Wigs in 2026: Why Every Stylist Is Switching",
    tags: ["Trending"],
    date: "2026-07-15",
    image: "company",
    excerpt:
      "HD lace melts into the skin in a way standard lace never could. Here is what changed.",
    body: [
      "HD (High-Definition) lace is a thinner, finer-grade Swiss lace that melts invisibly into virtually all skin tones, creating an undetectable, scalp-like hairline that standard brown or transparent lace simply cannot match.",
      "For stylists, the appeal is practical as much as aesthetic: HD lace needs minimal to no knot bleaching and far less foundation or concealer to blend, which saves chair time and protects the client’s hairline. The result photographs as if the hair grew from the scalp.",
      "The catch is fragility — HD lace tears if handled roughly — so it rewards a gentle hand. For editorial work and everyday wear alike, it has quietly become the new standard.",
    ],
  },
  {
    slug: "density-guide-130-150-180-200",
    title: "Density Guide: 130%, 150%, 180%, 200% — What Your Customers Actually Want",
    tags: ["Specs Guide"],
    date: "2026-07-11",
    image: "ordersLogistics",
    excerpt:
      "Density is the single most returned-for spec. Get it right and reorders follow.",
    body: [
      "Density describes how much hair is on the cap, as a percentage of a “full” head. 130% reads as natural and everyday; 150% is the most popular all-rounder; 180% and above give the dramatic, camera-ready fullness that dominates social media.",
      "For retail customers new to wigs, 150% flatters almost everyone and rarely triggers a return. For performers, brides, and content creators, 180%–250% is the look they are actually asking for even when they say “natural.”",
      "As a reseller, stocking 150% and 180% in your core textures covers the vast majority of demand. Publish the density on every listing — vague specs are the leading cause of returns.",
    ],
  },
  {
    slug: "edge-control-baby-hairs-perfect-lace-melt",
    title: "Edge Control & Baby Hairs: The Art of the Perfect Lace Melt",
    tags: ["Specs Guide", "Hair Care"],
    date: "2026-07-08",
    image: "tier1",
    excerpt:
      "The melt is where a good install becomes an invisible one. Small tools, big difference.",
    body: [
      "A perfect lace melt is less about glue and more about preparation: a clean, oil-free hairline, lace tinted to the skin tone, and knots that disappear under the right lighting. Rushing any of those three shows up instantly in photos.",
      "Baby hairs are the finishing signature. Use a fine-tooth edge brush and a light-hold control, working in small S-curves rather than heavy swoops — the goal is to mimic how real edges fall, not to draw them on.",
      "Less is more with product: a thin layer laid and left to set beats a heavy hand that flakes by midday. Finish with a silk scarf tied for a few minutes to lock everything down.",
    ],
  },
  {
    slug: "private-label-hair-brand-beyond-lace-oem",
    title: "Private Label Hair Brand: How to Launch Your Own Line With Beyond Lace OEM",
    tags: ["Brand Launch", "Business"],
    date: "2026-07-04",
    image: "b2bResources",
    excerpt:
      "Your box, your logo, our floor. The realistic path from idea to first order.",
    body: [
      "A private label brand means the product ships under your name — your box, comb, hang tag and insert — while the manufacturing, quality control and logistics run on our floor in Xuchang. You own the brand and the customer relationship; we stay invisible behind it.",
      "Start small. Beyond Lace’s programme opens at a low minimum, so you can validate a few hero SKUs and custom packaging before committing to volume. A named account manager scopes lengths, densities, lace types and branding with you from order one.",
      "The parts that sink new brands — batch consistency on reorders, MAP protection so partners don’t undercut each other, and dependable dispatch — are exactly the parts we contract for. Start your inquiry from the wholesale page.",
    ],
  },
  {
    slug: "crochet-braiding-hair-style-guide",
    title: "Crochet & Braiding Hair: The Complete Style Guide",
    tags: ["Braiding Hair", "Protective Styles"],
    date: "2026-06-30",
    image: "navCircle",
    excerpt:
      "Protective styles that grow the business and protect the hair underneath.",
    body: [
      "Crochet and braiding lines are the workhorses of a protective-style menu: knotless braids, boho locs, passion twists and crochet curls carry a salon between wig installs and open the door to a younger, repeat clientele.",
      "The quality markers are different from wigs — you are judging fibre memory, how the pre-stretched hair holds tension, and whether it frizzes after a week. Premium synthetic and human-blend options each have a place depending on price point and finish.",
      "For resellers, braiding hair is high-frequency, low-friction inventory: light to ship, quick to reorder, and easy to bundle with edge control and accessories at the counter.",
    ],
  },
  {
    slug: "rise-of-glueless-wigs-2026",
    title: "The Rise of Glueless Wigs: Why Nobody Uses Glue Anymore",
    tags: ["2026 Trends", "Trending"],
    date: "2026-06-26",
    image: "tier2",
    excerpt:
      "Adhesive-free installs went from beginner shortcut to the default. Here is why.",
    body: [
      "Glue damaged more edges than any other install habit, and wearers noticed. Glueless construction — adjustable elastic bands, silicone grips and pre-plucked hairlines — now delivers a secure, all-day hold without a drop of adhesive.",
      "The shift is also about lace longevity. Every melt-and-remove cycle stresses HD lace; skipping the glue means a unit survives far more wears looking new. For a premium human-hair wig, that is real money saved.",
      "Glueless is no longer the beginner’s compromise. It is the informed choice — which is why our newest wear-and-go units are built around it.",
    ],
  },
  {
    slug: "sell-hair-tiktok-shop-instagram-playbook",
    title: "How to Sell Hair on TikTok Shop & Instagram: The Playbook",
    tags: ["Business", "Entrepreneur"],
    date: "2026-06-21",
    image: "navWholesale",
    excerpt:
      "Where hair actually sells in 2026, and how to set up without a warehouse.",
    body: [
      "Hair is a demonstration product, which is why short-form video sells it better than any storefront. TikTok Shop and Instagram put the checkout inside the content, so a install reel or a texture close-up converts on the spot.",
      "You do not need to hold stock to start. With dropship-ready fulfilment, orders ship to your customer under your brand from our warehouses, so your capital goes into content and ads rather than inventory sitting in a spare room.",
      "The winners post consistently, show real texture in natural light, and pin a few hero SKUs. Pair that with reliable dispatch and honest specs, and reviews compound into a brand.",
    ],
  },
  {
    slug: "colouring-bleaching-human-hair-safe-guide",
    title: "Colouring & Bleaching Human Hair: A Safe Guide for Beginners",
    tags: ["Hair Care"],
    date: "2026-06-17",
    image: "navLearn",
    excerpt:
      "Human hair takes colour like your own — which means it can be over-processed like your own too.",
    body: [
      "Because our hair is 100% human, it responds to colour, bleach, perms and relaxers much like natural hair. That is the gift and the risk: you can achieve almost any tone, but aggressive processing shortens the lifespan of the unit.",
      "Always strand-test first, use a professional colourist for bleaching or drastic changes, and bleach knots on HD lace with diluted product for a shorter time than standard lace. Deep condition thoroughly after any chemical service to put moisture back.",
      "If you would rather skip the process, pre-coloured units in popular tones give you the look with none of the risk — and chemically treated hair is not eligible for return, so it is worth deciding before you order.",
    ],
  },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-07-28" -> "July 28, 2026". Parsed as UTC so it never drifts a day. */
export function formatBlogDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
