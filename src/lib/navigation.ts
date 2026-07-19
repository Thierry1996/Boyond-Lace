/**
 * Navigation is data, not markup. This is the Beyond Lace Link Navigation
 * Ecosystem — cross-referenced 1:1 against the sitemap directive
 * (docs/brand/01-sitemap.md). Every href here resolves to a real route or
 * an existing in-page anchor; nothing 404s.
 */

export interface NavLink {
  label: string;
  href: string;
  note?: string;
}

export interface NavGroup {
  heading: string;
  links: NavLink[];
}

export interface PrimaryNavItem {
  label: string;
  href: string;
  groups?: NavGroup[];
  feature?: { eyebrow: string; title: string; body: string; href: string; cta: string };
}

export const primaryNav: PrimaryNavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    groups: [
      {
        heading: "Collections",
        links: [
          { label: "All Wigs", href: "/shop" },
          { label: "Bestsellers", href: "/shop/bestsellers" },
          { label: "New Arrivals", href: "/shop/new-arrivals" },
          { label: "Capsule Drops", href: "/drops" },
          { label: "Archive Sale", href: "/shop/sale" },
        ],
      },
      {
        heading: "By Construction",
        links: [
          { label: "HD Swiss Full Lace", href: "/shop?lace=hd-swiss-full" },
          { label: "13x6 HD Frontals", href: "/shop?lace=hd-swiss-13x6" },
          { label: "Glueless", href: "/shop?lace=glueless" },
          { label: "Silk Top — Sensitive Scalp", href: "/shop?lace=silk-top" },
          { label: "Closures & Bundles", href: "/shop?lace=hd-swiss-13x4" },
        ],
      },
      {
        heading: "By Texture",
        links: [
          { label: "Straight", href: "/shop?texture=straight" },
          { label: "Body Wave", href: "/shop?texture=body-wave" },
          { label: "Deep Wave", href: "/shop?texture=deep-wave" },
          { label: "Coily & Curly", href: "/shop?texture=curly" },
          { label: "Kinky Straight", href: "/shop?texture=kinky-straight" },
        ],
      },
      {
        heading: "Fit & Care",
        links: [
          { label: "The Lace Test — $5", href: "/product/lace-test-kit" },
          { label: "Virtual Try-On", href: "/try-on" },
          { label: "Care Subscription", href: "/product/beyond-care-ritual-box" },
          { label: "Care Products", href: "/shop?line=care" },
        ],
      },
    ],
    feature: {
      eyebrow: "Start here",
      title: "The Lace Test",
      body: "Six lace swatches and five shade cards for five dollars, redeemable in full. Shade mismatch causes more returns than every other factor combined.",
      href: "/product/lace-test-kit",
      cta: "Order the kit",
    },
  },
  {
    label: "Wholesale",
    href: "/wholesale",
    groups: [
      {
        heading: "Programmes",
        links: [
          { label: "Salon Programme", href: "/wholesale", note: "Bronze · Silver · Gold" },
          { label: "Private Label", href: "/wholesale#private-label" },
          { label: "Beyond Lace Pro", href: "/product/beyond-lace-pro-salon-program" },
          { label: "Sample Requests", href: "/wholesale#samples" },
        ],
      },
      {
        heading: "Transparency",
        links: [
          { label: "Sourcing Standards", href: "/wholesale#sourcing" },
          { label: "MAP Policy", href: "/wholesale#map" },
          { label: "Batch Consistency", href: "/wholesale#sourcing" },
        ],
      },
      {
        heading: "Partners",
        links: [
          { label: "Apply Now", href: "/wholesale#apply" },
          { label: "Partner Portal Login", href: "/account" },
          { label: "Salon Onboarding", href: "/lp/salon-onboarding" },
        ],
      },
    ],
    feature: {
      eyebrow: "Margin protection",
      title: "MAP is enforced, not suggested",
      body: "Your retail price is contractually defended. No partner undercuts another, and none of them undercut us.",
      href: "/wholesale#map",
      cta: "Read the policy",
    },
  },
  {
    label: "Our Brand",
    href: "/brand",
    groups: [
      {
        heading: "The Why",
        links: [
          { label: "Brand Manifesto", href: "/brand" },
          { label: "Mission & Vision", href: "/brand#mission" },
          { label: "Founder Story", href: "/brand#founder" },
        ],
      },
      {
        heading: "The How",
        links: [
          { label: "The 6 Empire Pillars", href: "/brand#pillars" },
          { label: "Supply Chain Transparency", href: "/wholesale#sourcing" },
          { label: "Manufacturing Tour", href: "/brand#facility" },
        ],
      },
      {
        heading: "The Look",
        links: [
          { label: "Brand Visual Identity Kit", href: "/brand#identity" },
          { label: "Editorial Brand Gallery", href: "/brand#gallery" },
          { label: "Press Kit", href: "/brand#press" },
        ],
      },
    ],
  },
  { label: "The Beyond Circle", href: "/circle" },
  {
    label: "Learn",
    href: "/learn",
    groups: [
      {
        heading: "Before You Buy",
        links: [
          { label: "Find Your Unit — Quiz", href: "/learn/quiz" },
          { label: "Lace Colour Matching", href: "/learn#shade" },
          { label: "Size & Cap Guide", href: "/learn#sizing" },
          { label: "Hair Grade, Explained", href: "/learn#grades" },
        ],
      },
      {
        heading: "Styling Tutorials",
        links: [
          { label: "Lace Melting", href: "/learn#melting" },
          { label: "Hairline Plucking", href: "/learn#plucking" },
          { label: "Daily Maintenance", href: "/learn#maintenance" },
          { label: "Masterclasses", href: "/learn#masterclasses" },
        ],
      },
      {
        heading: "Answers",
        links: [{ label: "FAQ Library", href: "/learn#faq" }],
      },
    ],
  },
  { label: "Support", href: "/support" },
];

export const utilityNav: NavLink[] = [
  { label: "Search", href: "/search" },
  { label: "Track Order", href: "/support#track" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Account", href: "/account" },
];

export const footerColumns: NavGroup[] = [
  {
    heading: "Shop",
    links: [
      { label: "All Wigs", href: "/shop" },
      { label: "Bestsellers", href: "/shop/bestsellers" },
      { label: "The Lace Test", href: "/product/lace-test-kit" },
      { label: "Virtual Try-On", href: "/try-on" },
      { label: "Size Guide", href: "/learn#sizing" },
      { label: "Lace Comparison Chart", href: "/learn#shade" },
      { label: "Hair Grade Breakdown", href: "/learn#grades" },
    ],
  },
  {
    heading: "Wholesale & Private Label",
    links: [
      { label: "Salon Programme", href: "/wholesale" },
      { label: "Private Label Solutions", href: "/wholesale#private-label" },
      { label: "Wholesale Pricing Sheet", href: "/wholesale#assets" },
      { label: "MAP Policy Document", href: "/wholesale#map" },
      { label: "Mockup Gallery", href: "/wholesale#private-label" },
      { label: "Partner Portal", href: "/account" },
    ],
  },
  {
    heading: "Brand & Culture",
    links: [
      { label: "Brand Manifesto", href: "/brand" },
      { label: "The 6 Empire Pillars", href: "/brand#pillars" },
      { label: "Founder Story", href: "/brand#founder" },
      { label: "Brand Identity Kit", href: "/brand#identity" },
      { label: "Press Kit", href: "/brand#press" },
      { label: "Brand Asset Request", href: "/brand#assets" },
    ],
  },
  {
    heading: "Education & Community",
    links: [
      { label: "The Beyond Circle", href: "/circle" },
      { label: "Transformation Stories", href: "/circle#stories" },
      { label: "Loyalty Programme", href: "/circle#loyalty" },
      { label: "Tutorial Library", href: "/learn" },
      { label: "Masterclasses", href: "/learn#masterclasses" },
      { label: "Become an Ambassador", href: "/circle#ambassadors" },
    ],
  },
  {
    heading: "Support & Logistics",
    links: [
      { label: "Track My Order", href: "/support#track" },
      { label: "Returns & Exchanges", href: "/support#returns" },
      { label: "Shipping Information", href: "/support#shipping" },
      { label: "Warranty", href: "/support#warranty" },
      { label: "Bulk Order Support", href: "/support#bulk" },
      { label: "Care Product Guides", href: "/learn#maintenance" },
    ],
  },
  {
    heading: "Legal & Company",
    links: [
      { label: "About Us", href: "/brand" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Wholesale Partner Terms", href: "/legal/wholesale-terms" },
      { label: "Shipping Policy", href: "/legal/shipping-policy" },
      { label: "Cookie Settings", href: "/legal/cookies" },
      { label: "Accessibility Statement", href: "/legal/accessibility" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Headquarters", href: "/support#contact" },
    ],
  },
];

/** Hidden ad-driven landing pages — deliberately absent from all nav (sitemap). */
export const campaignPages = [
  "/lp/influencer-affiliates",
  "/lp/salon-onboarding",
  "/lp/quiz",
  "/lp/comeback",
  "/try-on",
  "/drops",
];
