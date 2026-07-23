/**
 * Navigation is data, not markup. This is the Beyond Lace Link Navigation
 * Ecosystem — cross-referenced 1:1 against the sitemap directive
 * (docs/brand/01-sitemap.md). Every href here resolves to a real route or
 * an existing in-page anchor; nothing 404s.
 */

import type { ImageryKey } from "@/lib/imagery";

export interface NavLink {
  label: string;
  href: string;
  note?: string;
  /** Downloads and third-party destinations open in a new tab. */
  external?: boolean;
  /** Nested third level, e.g. the three ambassador tiers. */
  children?: NavLink[];
}

export interface NavGroup {
  heading: string;
  links: NavLink[];
  /** Photograph shown when this column is hovered — guides where you are. */
  image?: ImageryKey;
  /** One-line orientation copy for the image panel. */
  blurb?: string;
}

export interface PrimaryNavItem {
  label: string;
  href: string;
  groups?: NavGroup[];
  /** Default panel image before any column is hovered. */
  image?: ImageryKey;
  feature?: { eyebrow: string; title: string; body: string; href: string; cta: string };
}

export const primaryNav: PrimaryNavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    image: "navShop",
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
          // The coil range is now typed precisely (kinky-curly / jerry-curl)
          // rather than lumped under a generic "curly", so this points at the
          // 4C-adjacent pattern the launch assortment actually stocks.
          { label: "Coily & Curly", href: "/shop?texture=kinky-curly" },
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
    image: "navWholesale",
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
    image: "navBrand",
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
  {
    /**
     * Recommended — the conversion hub. Category names below are generic
     * industry terms; the hrefs deliberately resolve to Beyond Lace's own
     * filtered shop routes rather than the competitor URLs they were sourced
     * from. Linking a competitor from your own primary nav hands them the
     * traffic you paid to acquire.
     */
    label: "Recommended",
    href: "/recommended",
    image: "navShop",
    groups: [
      {
        heading: "By Construction",
        image: "laceDetail",
        blurb: "How the cap is built decides how it wears.",
        links: [
          { label: "Glueless Wigs", href: "/shop?lace=glueless" },
          { label: "HD Lace Wigs", href: "/shop?lace=hd-swiss-full" },
          { label: "Front Lace Wigs", href: "/shop?lace=hd-swiss-13x6" },
          { label: "V / U Part Wigs", href: "/recommended#v-u-part" },
          { label: "Headband Wigs", href: "/recommended#headband" },
          { label: "Drawstring 360 Wigs", href: "/recommended#drawstring-360" },
        ],
      },
      {
        heading: "By Silhouette",
        image: "navShop",
        blurb: "The shape people actually ask for by name.",
        links: [
          { label: "Bob & Short Wigs", href: "/recommended#bob-short" },
          { label: "Layer Cut Wigs", href: "/recommended#layer-cut" },
          { label: "Wigs With Bangs", href: "/recommended#bangs" },
          { label: "Crochet Wigs", href: "/recommended#crochet" },
          { label: "3-in-1 Half Wigs", href: "/recommended#half-wig" },
          { label: "4C Edge Hairline", href: "/recommended#4c-edge" },
        ],
      },
      {
        heading: "By Purpose",
        image: "navBrand",
        blurb: "Restoration, reinvention, or the red carpet.",
        links: [
          { label: "Medical & Sensitive Scalp", href: "/shop?lace=silk-top" },
          { label: "Colored & Fashion Wigs", href: "/shop?shade=platinum" },
          { label: "Salon Quality Series", href: "/wholesale" },
          { label: "Top Picks — Hottest Now", href: "/recommended#top-picks" },
        ],
      },
      {
        heading: "Beyond Care",
        image: "fitGuides",
        blurb: "What decides twelve months versus thirty.",
        links: [
          { label: "Shampoo & Conditioners", href: "/shop?line=care" },
          { label: "Treatment & Scalp Oils", href: "/recommended#treatment-oils" },
          { label: "Edge Control & Restoration", href: "/recommended#edge-control" },
          { label: "Bonnets & Wig Stands", href: "/recommended#bonnets" },
          { label: "Adhesives & Solvents", href: "/product/the-hold-lace-adhesive" },
        ],
      },
    ],
    feature: {
      eyebrow: "Before you decide",
      title: "Compare us honestly",
      body: "A side-by-side against the category norm — construction, batch policy, returns and what actually drives the price. Including where we are not the cheapest.",
      href: "/recommended#compare",
      cta: "Open the comparison",
    },
  },
  {
    /**
     * Extensions & Bundles. The submenu names are generic industry categories;
     * the hrefs resolve to Beyond Lace's own shop filters and bundle SKUs, not
     * the competitor URLs they were sourced from. Categories we do not yet stock
     * as distinct products (clip-in, tape-in, ponytail) route to the nearest
     * real inventory rather than a dead page — nothing here 404s.
     */
    label: "Extensions & Bundles",
    href: "/shop?line=bundle",
    image: "navShop",
    groups: [
      {
        heading: "Shop by Style",
        image: "laceDetail",
        blurb: "The texture, as a bundle or a weft.",
        links: [
          { label: "Hair Bundles", href: "/shop?line=bundle" },
          { label: "Body Wave", href: "/shop?texture=body-wave" },
          { label: "Straight", href: "/shop?texture=straight" },
          { label: "Deep Wave", href: "/shop?texture=deep-wave" },
          // Water Wave and Yaki are not yet stocked as distinct textures — the
          // yaki finish lives under Kinky Straight — so these route to the
          // nearest real inventory rather than an empty facet.
          { label: "Water Wave", href: "/shop?texture=deep-wave" },
          { label: "Kinky Curly", href: "/shop?texture=kinky-curly" },
          { label: "Yaki Straight", href: "/shop?texture=kinky-straight" },
          { label: "Kinky Straight", href: "/shop?texture=kinky-straight" },
          { label: "Jerry Curl", href: "/shop?texture=jerry-curl" },
        ],
      },
      {
        heading: "Shop by Type",
        image: "navShop",
        blurb: "How it attaches.",
        links: [
          { label: "Sew-In / Weave", href: "/shop?line=bundle" },
          { label: "Closure + Bundle Kits", href: "/shop?lace=closure-4x4" },
          { label: "Frontal + Bundle Kits", href: "/shop?lace=hd-swiss-13x4" },
          { label: "The Foundation Set", href: "/product/the-foundation-closure-set" },
          { label: "The Workroom Set", href: "/product/the-workroom-deep-wave-frontal-set" },
        ],
      },
      {
        heading: "Shop by Hair Type",
        image: "navBrand",
        blurb: "Origin and grade.",
        links: [
          { label: "Human Hair Bundles", href: "/shop?line=bundle" },
          { label: "Virgin Remy", href: "/shop?line=bundle" },
          { label: "Colored Bundles", href: "/shop?shade=blonde-613" },
          { label: "Burgundy 99J", href: "/shop?shade=burgundy-99j" },
          { label: "Auburn Copper", href: "/shop?shade=auburn-copper" },
        ],
      },
    ],
    feature: {
      eyebrow: "Batch-matched",
      title: "Closure and bundles from one run",
      body: "Every piece in a set is cut from a single production run, so the closure and the bundles agree on tone and texture without a colourist.",
      href: "/product/the-foundation-closure-set",
      cta: "See The Foundation",
    },
  },
  {
    /**
     * Tools & Accessories. Same rule: generic accessory category names, routed
     * to our real care products, install kit and care bundle. Where we do not
     * yet stock a discrete SKU (scalp massagers, steamers, styling irons) the
     * link lands on the nearest real product or the care listing.
     */
    label: "Tools & Accessories",
    href: "/shop?line=care",
    image: "navSupport",
    groups: [
      {
        heading: "Cleaning & Care",
        image: "navSupport",
        blurb: "What decides twelve months or thirty.",
        links: [
          { label: "Shampoo & Conditioner", href: "/shop?line=care" },
          { label: "Detangler", href: "/shop?line=care" },
          { label: "The Care Ritual", href: "/product/beyond-care-ritual-box" },
          { label: "Brushes & Combs", href: "/product/beyond-wig-care-bundle" },
          { label: "Bags & Storage", href: "/product/beyond-wig-care-bundle" },
        ],
      },
      {
        heading: "Installation Tools",
        image: "laceDetail",
        blurb: "Everything the first install needs.",
        links: [
          { label: "The Install Kit", href: "/product/beyond-install-kit" },
          { label: "Wig Glue & Tapes", href: "/product/the-hold-lace-adhesive" },
          { label: "Stands & Mannequins", href: "/product/beyond-wig-care-bundle" },
          { label: "Glue Remover", href: "/product/beyond-install-kit" },
          { label: "Scalp Protector", href: "/product/beyond-install-kit" },
        ],
      },
      {
        heading: "Styling & Extension Care",
        image: "navLearn",
        blurb: "Keep the finish you paid for.",
        links: [
          { label: "Heat Protectant", href: "/shop?line=care" },
          { label: "Edge Control", href: "/shop?line=care" },
          { label: "Hair Nets & Wig Caps", href: "/product/beyond-wig-care-bundle" },
          { label: "Weave Sealer", href: "/shop?line=care" },
          { label: "Parting Tools", href: "/shop?line=care" },
        ],
      },
    ],
    feature: {
      eyebrow: "Ships with every unit",
      title: "The Install Kit",
      body: "Waterproof adhesive, lace tape, melting spray and a grip band. Most first installs fail for want of one of the four.",
      href: "/product/beyond-install-kit",
      cta: "See the kit",
    },
  },
  {
    label: "The Beyond Circle",
    href: "/circle",
    image: "navCircle",
    groups: [
      {
        heading: "Community",
        image: "navCircle",
        blurb: "The proof arrives before the parcel does.",
        links: [
          { label: "The Circle", href: "/circle" },
          { label: "Transformation Stories", href: "/circle#stories" },
          { label: "Loyalty Rewards", href: "/circle#loyalty" },
          { label: "Masterclasses & Events", href: "/circle#events" },
        ],
      },
      {
        heading: "Ambassador Programme",
        image: "educationPartnership",
        blurb: "Three tiers. Not gifting — partnership.",
        links: [
          { label: "Programme Overview", href: "/ambassadors" },
          { label: "Apply to Join", href: "/ambassadors/apply" },
          { label: "Tier 3 — Micro Affiliate", href: "/ambassadors/apply/tier-3" },
          { label: "Tier 2 — Macro Contract", href: "/ambassadors/apply/tier-2" },
          { label: "Tier 1 — Celebrity Stylist", href: "/ambassadors/apply/tier-1" },
        ],
      },
      {
        heading: "Ambassador Portal",
        image: "tier2",
        blurb: "Track sales, log content, request payouts.",
        links: [
          { label: "Sign In", href: "/sign-in" },
          { label: "Create Account", href: "/sign-up" },
          { label: "Ambassador Dashboard", href: "/ambassadors/dashboard" },
        ],
      },
    ],
    feature: {
      eyebrow: "Earn from your reach",
      title: "15–20% commission, tracked honestly",
      body: "Link your Instagram and TikTok, log the content you run, and watch commission accrue against your own affiliate links. Paid by PayPal, CashApp, or crypto wallet.",
      href: "/ambassadors",
      cta: "See the programme",
    },
  },
  {
    label: "Learn",
    href: "/learn",
    image: "navLearn",
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
  {
    label: "Support",
    href: "/support",
    image: "navSupport",
    groups: [
      {
        heading: "Fit & Product Guides",
        image: "fitGuides",
        blurb: "Get the shade and the cap right before you commit.",
        links: [
          { label: "Size Guide", href: "/support/size-guide" },
          { label: "Lace Comparison Chart", href: "/support/lace-comparison" },
        ],
      },
      {
        heading: "B2B Resources",
        image: "b2bResources",
        blurb: "Everything a salon or reseller needs to sell the line.",
        links: [
          { label: "Wholesale Pricing PDF", href: "/support/wholesale-pricing", note: "Download" },
          { label: "Private Label Mockup Gallery", href: "/support/private-label-gallery" },
        ],
      },
      {
        heading: "Brand & Press",
        image: "brandPress",
        blurb: "Logos, palette, and media assets, correctly licensed.",
        links: [
          { label: "Full Brand Kit", href: "/support/brand-kit", note: "Download" },
          { label: "Press Kit for Influencers & Media", href: "/support/press-kit" },
        ],
      },
      {
        heading: "Education & Partnership",
        image: "educationPartnership",
        blurb: "Learn the craft, then get paid to teach it.",
        links: [
          { label: "All Tutorial Videos Library", href: "/support/tutorials" },
          {
            label: "Influencer Partnership Application",
            href: "/ambassadors/apply",
            children: [
              { label: "Tier 3 — Micro Affiliate Sign-Up", href: "/ambassadors/apply/tier-3" },
              { label: "Tier 2 — Macro Exclusive Contract", href: "/ambassadors/apply/tier-2" },
              {
                label: "Tier 1 — Celebrity Stylist Collaboration",
                href: "/ambassadors/apply/tier-1",
              },
            ],
          },
        ],
      },
      {
        heading: "Orders & Logistics",
        image: "ordersLogistics",
        blurb: "Track, return, or scale an order without an email chain.",
        links: [
          { label: "Return Portal — Self-Service", href: "/support/returns-portal" },
          { label: "Bulk Order Support", href: "/support/bulk-orders" },
          { label: "Track My Order", href: "/support#track" },
          { label: "Shipping & Returns Policy", href: "/legal/shipping-policy" },
          { label: "Warranty", href: "/support#warranty" },
        ],
      },
      {
        heading: "Company",
        image: "company",
        blurb: "Who we are, how we hire, and how to reach us.",
        links: [
          { label: "Accessibility Statement", href: "/legal/accessibility" },
          { label: "Careers", href: "/careers" },
          { label: "Contact Headquarters", href: "/support/contact-hq" },
        ],
      },
    ],
    feature: {
      eyebrow: "Fastest answer",
      title: "Ask the virtual stylist",
      body: "Shade, texture, sizing and fit — answered in the support hub, bottom-right of any page. WhatsApp and Instagram reach a human within the hour.",
      href: "/support#contact",
      cta: "Contact options",
    },
  },
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
