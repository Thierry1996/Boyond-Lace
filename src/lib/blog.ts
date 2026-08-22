import type { ImageryKey } from "@/lib/imagery";

/**
 * Beyond Lace Media Center content + a small block-based CMS.
 *
 * Every article is authored as an ordered list of typed content blocks, so the
 * article template renders any post — from a three-paragraph note to the full
 * playbook — through one high-conversion layout. Inline text supports **bold**
 * and [label](https://url) links (external links open in a new tab), which is
 * how posts link out to resources for SEO and reader value.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "image"; image: ImageryKey; caption?: string; ratio?: string }
  | { type: "callout"; tone?: "tip" | "insight" | "success" | "note"; title?: string; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "stats"; cards: { value: string; label: string }[] }
  | { type: "checklist"; items: string[] }
  | { type: "dodont"; dos: string[]; donts: string[] }
  | { type: "steps"; title?: string; lines: string[] }
  | {
      type: "platforms";
      cards: {
        name: string;
        tone: "tiktok" | "instagram";
        stats: { value: string; label: string }[];
        bestFor: string;
      }[];
    }
  | { type: "phases"; items: { title: string; text: string }[] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "calculator" }
  | { type: "quiz"; questions: { q: string; options: string[] }[] };

export interface BlogAuthor {
  name: string;
  role: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  tags: string[];
  /** Primary category shown as the pill on the article and index. */
  category: string;
  date: string;
  image: ImageryKey;
  excerpt: string;
  readTime: string;
  views: string;
  author: BlogAuthor;
  /** SEO keywords surfaced in <meta keywords> and JSON-LD. */
  keywords: string[];
  blocks: Block[];
}

const EDITORIAL: BlogAuthor = {
  name: "Beyond Lace Editorial Team",
  role: "Hair Education & Standards",
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "sell-hair-tiktok-shop-instagram-playbook",
    title: "How to Sell Hair on TikTok Shop & Instagram: The 2026 Playbook",
    tags: ["Business", "Entrepreneur", "Social Commerce"],
    category: "Business",
    date: "2026-07-30",
    image: "blogCover1",
    excerpt:
      "Where hair actually sells in 2026 — and the exact content, setup, and dropshipping workflow behind five-figure months.",
    readTime: "13 min read",
    views: "1,102 views",
    author: {
      name: "Beyond Lace Social Commerce Team",
      role: "E-commerce & Social Media Specialists",
    },
    keywords: [
      "sell hair on tiktok shop",
      "sell wigs on instagram",
      "hair dropshipping",
      "wig business",
      "social commerce hair",
      "tiktok shop wigs",
      "how to start a hair business",
      "wholesale human hair",
    ],
    blocks: [
      { type: "h2", text: "Introduction: The Social Commerce Gold Rush" },
      {
        type: "image",
        image: "navWholesale",
        caption: "TikTok Shop is minting new hair sellers every month — here’s how to join them.",
        ratio: "16 / 9",
      },
      {
        type: "p",
        text: "**TikTok Shop is minting new hair sellers every month.** In 2024 alone, TikTok Shop generated over **$20 billion in GMV**, with hair and beauty among the top-performing categories. Instagram Shop isn’t far behind, with **$100+ billion** in annual commerce revenue.",
      },
      {
        type: "p",
        text: "At **Beyond Lace**, we’ve partnered with 500+ sellers generating consistent **five-figure months** through social commerce. In this playbook we reveal the exact **content strategy, product photography setup, hashtag stacks, and dropshipping workflow** our most successful partners use.",
      },
      {
        type: "quote",
        text: "I started with zero followers and $500 in Beyond Lace inventory. Six months later, I’m doing $45,000/month on TikTok Shop alone. The strategy in this guide is exactly what I used.",
        cite: "Jasmine R., Beyond Lace Business Partner",
      },

      { type: "h2", text: "Why Social Commerce for Hair?" },
      {
        type: "p",
        text: "Hair products are **perfect for social commerce**. Here’s why Beyond Lace partners see 3–5x higher conversion on social versus traditional e-commerce.",
      },
      { type: "h3", text: "The Numbers Don’t Lie" },
      {
        type: "table",
        headers: ["Metric", "TikTok Shop", "Instagram Shop", "Traditional E-commerce"],
        rows: [
          ["Avg. Conversion Rate", "3–5%", "2–4%", "1–2%"],
          ["Avg. Order Value", "$145", "$135", "$95"],
          ["Customer Acquisition Cost", "$8–15", "$12–20", "$25–40"],
          ["Time to First Sale", "1–7 days", "3–14 days", "14–30 days"],
          ["Repeat Purchase Rate", "35%", "30%", "20%"],
        ],
      },
      { type: "h3", text: "Why Hair Performs Exceptionally Well" },
      {
        type: "checklist",
        items: [
          "**Visual Transformation:** before/after content goes viral easily",
          "**High Emotional Value:** hair = confidence = impulse purchases",
          "**Demonstration-Friendly:** installation videos sell themselves",
          "**Repeat Purchase:** customers buy multiple wigs once they trust you",
          "**Community-Driven:** hair enthusiasts love sharing recommendations",
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "Beyond Lace Insight",
        text: "Our data shows **video content converts 8x better** than static images for hair products. TikTok’s video-first approach is why it’s outperforming every other platform for wig sales.",
      },

      { type: "h2", text: "TikTok Shop Complete Setup Guide" },
      {
        type: "image",
        image: "navShop",
        caption: "TikTok Shop setup takes 30–60 minutes — here’s the exact step-by-step process.",
        ratio: "16 / 9",
      },
      {
        type: "platforms",
        cards: [
          {
            name: "TikTok Shop",
            tone: "tiktok",
            stats: [
              { value: "1.5B+", label: "Monthly Users" },
              { value: "$20B", label: "2024 GMV" },
              { value: "3–5%", label: "Conversion Rate" },
              { value: "$145", label: "Avg. Order Value" },
            ],
            bestFor:
              "Viral content, younger demographics (18–34), impulse purchases, video-first selling",
          },
          {
            name: "Instagram Shop",
            tone: "instagram",
            stats: [
              { value: "2B+", label: "Monthly Users" },
              { value: "$100B+", label: "Annual Commerce" },
              { value: "2–4%", label: "Conversion Rate" },
              { value: "$135", label: "Avg. Order Value" },
            ],
            bestFor:
              "Established brands, older demographics (25–45), lifestyle content, carousel posts",
          },
        ],
      },
      {
        type: "steps",
        title: "TikTok Shop Setup: Step-by-Step",
        lines: [
          "Step 1: Account Setup (15 min) — Download the TikTok Seller app · Register with a business email · Submit business licence & ID · Link a bank account for payouts · Wait for approval (24–48 hours).",
          "Step 2: Product Catalog (30 min) — Sign up for a Beyond Lace wholesale account · Download product images & descriptions · Upload 10–20 products to TikTok Shop · Set prices (2–3x wholesale cost) · Configure shipping.",
          "Step 3: Content Setup (ongoing) — Create 20+ videos before launching · Schedule daily posts · Go live 2–3x per week · Respond to comments within 2 hours · Run TikTok Shop promotions weekly.",
        ],
      },
      { type: "h3", text: "TikTok Shop Requirements" },
      {
        type: "table",
        headers: ["Requirement", "Details", "Time to Complete"],
        rows: [
          ["Business Licence", "LLC or sole proprietorship", "1–7 days"],
          ["Tax ID (EIN)", "Required for US sellers", "1 day (online)"],
          ["Bank Account", "Business checking account", "1–3 days"],
          ["Product Inventory", "10+ products minimum", "1 day (Beyond Lace)"],
          ["Content Library", "20+ videos recommended", "3–7 days"],
        ],
      },

      { type: "h2", text: "Instagram Shop Complete Setup Guide" },
      {
        type: "image",
        image: "company",
        caption: "Instagram Shop integrates seamlessly with Facebook — setup takes 1–2 hours.",
        ratio: "16 / 9",
      },
      {
        type: "steps",
        title: "Instagram Shop Setup: Step-by-Step",
        lines: [
          "Step 1: Business Account (10 min) — Convert to an Instagram Business account · Connect a Facebook Business Page · Complete business information · Add contact details & category.",
          "Step 2: Commerce Manager (30 min) — Access Facebook Commerce Manager · Create a new shop catalogue · Upload Beyond Lace product images · Write descriptions · Set pricing & inventory.",
          "Step 3: Approval & Launch (24–48 hours) — Submit shop for review · Wait for Instagram approval · Tag products in posts · Enable shopping in Stories · Launch with promotional content.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Beyond Lace Recommendation",
        text: "**Start with TikTok Shop** if you’re new to social commerce — lower barrier to entry, faster viral potential, and higher conversion for hair. Add Instagram Shop once you’re doing $10K+/month consistently.",
      },

      { type: "h2", text: "Content Strategy That Converts" },
      {
        type: "image",
        image: "navBrand",
        caption:
          "Transformation videos get 10x more engagement than product photos — here’s the formula.",
        ratio: "16 / 9",
      },
      {
        type: "p",
        text: "Content is everything on social commerce. Beyond Lace partners who follow this strategy see **5–10x higher engagement** and **3x higher conversion**.",
      },
      { type: "h3", text: "Top-Performing Content Types" },
      {
        type: "table",
        headers: ["Content Type", "Post Frequency", "Avg. Views", "Conversion Rate"],
        rows: [
          ["Transformation Videos", "Daily", "50K–500K", "3–5%"],
          ["Installation Tutorials", "3x/week", "20K–200K", "4–6%"],
          ["Customer Reviews", "2x/week", "10K–100K", "5–8%"],
          ["Live Selling", "1–2x/week", "1K–10K viewers", "8–15%"],
          ["Styling Tips", "3x/week", "15K–150K", "3–5%"],
        ],
      },
      {
        type: "steps",
        title: "Viral Video Formula (Beyond Lace Partners Use This)",
        lines: [
          "Hook (0–3s): show a dramatic before/after immediately · text overlay “POV: you found the perfect wig” · trending audio.",
          "Value (3–15s): show the install (sped up 2x) · highlight lace, density, length · add benefit text overlays.",
          "Call-to-Action (15–30s): “Link in bio to shop” · “Comment ‘WIG’ for the link” · “Limited stock — shop now!” · tag the product.",
        ],
      },
      {
        type: "callout",
        tone: "success",
        title: "Beyond Lace Content Kit",
        text: "All partners receive **500+ product photos, 100+ video clips, pre-written captions, hashtag lists, and ad templates** — save 20+ hours on content creation.",
      },

      { type: "h2", text: "Product Photography Setup" },
      {
        type: "image",
        image: "fitGuides",
        caption:
          "Good lighting costs less than $100 — here’s the exact setup Beyond Lace partners use.",
        ratio: "16 / 9",
      },
      {
        type: "steps",
        title: "Budget Photography Setup (Under $200)",
        lines: [
          'Essentials: ring light (12–18") $40–80 · tripod with phone mount $30–50 · white backdrop $20–40 · mannequin head $15–30 · a modern smartphone.',
          "Optional upgrades: softbox lighting kit $80–150 · turntable for 360° shots $50–100 · reflector panels $20–40.",
        ],
      },
      { type: "h3", text: "Photography Best Practices" },
      {
        type: "dodont",
        dos: [
          "Use natural light + a ring light",
          "Show the wig on a mannequin and a model",
          "Capture multiple angles (front, back, sides)",
          "Show the lace up close — it proves quality",
        ],
        donts: [
          "Use yellow/warm indoor lighting",
          "Only show flat-lay photos",
          "Only show the front view",
          "Hide the lace or the knots",
        ],
      },
      { type: "h3", text: "Image Requirements by Platform" },
      {
        type: "table",
        headers: ["Platform", "Main Image", "Additional Images", "Video"],
        rows: [
          ["TikTok Shop", "1080×1080px (min)", "Up to 9 images", "15–60 seconds (required)"],
          ["Instagram Shop", "1080×1080px (min)", "Up to 10 images", "Reels 15–90 seconds"],
          [
            "Both Platforms",
            "White/clean background",
            "Show detail & texture",
            "Show movement & quality",
          ],
        ],
      },

      { type: "h2", text: "Winning Hashtag Stacks" },
      {
        type: "steps",
        title: "TikTok Hashtag Strategy",
        lines: [
          "High-volume (1M+ posts): #wigs #hairtok #wiginstall #gluelesswig #hdlace #virginhair #hairtransformation #wigreview.",
          "Medium-volume (100K–1M): #wigbusiness #tiktokshop #tiktokshopfinds #affordablewigs #lacefrontwig #humanhairwigs.",
          "Niche (10K–100K): #beyondlace #wigbusinessowner #wigdropshipping #wigaffiliate #wigseller #wigentrepreneur.",
        ],
      },
      {
        type: "checklist",
        items: [
          "Use **15–20 hashtags** per post (TikTok allows up to 100, but 15–20 is optimal)",
          "**Mix hashtag sizes** — high, medium, and niche volume",
          "**Create a branded hashtag** (e.g. #YourBrandWigs)",
          "**Research trending hashtags** weekly via the [TikTok Creative Center](https://ads.tiktok.com/business/creativecenter)",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Beyond Lace Tip",
        text: "Save 5–10 hashtag sets in your notes app and rotate them to avoid being flagged as spam. Update monthly based on trending tags in your niche.",
      },

      { type: "h2", text: "Beyond Lace Dropshipping Workflow" },
      {
        type: "image",
        image: "b2bResources",
        caption: "Beyond Lace’s dropshipping program handles fulfilment — you focus on selling.",
        ratio: "16 / 9",
      },
      {
        type: "steps",
        title: "How Beyond Lace Dropshipping Works",
        lines: [
          "Step 1 — Customer orders (you): a customer buys from your TikTok/Instagram Shop · you receive payment (platform holds funds) · you forward the order to Beyond Lace.",
          "Step 2 — Beyond Lace fulfils (us): we receive your order via WhatsApp/email · we pick, pack, and quality-check · we ship under your branding · you receive tracking · you handle customer service.",
        ],
      },
      { type: "h3", text: "Dropshipping vs Holding Inventory" },
      {
        type: "table",
        headers: ["Factor", "Dropshipping", "Holding Inventory"],
        rows: [
          ["Startup Cost", "$500–2,000", "$2,000–10,000"],
          ["Risk", "Low (no inventory)", "Medium (unsold stock)"],
          ["Profit Margin", "40–60%", "60–80%"],
          ["Shipping Speed", "5–10 days", "2–5 days"],
          ["Best For", "Beginners, testing", "Established sellers"],
        ],
      },
      {
        type: "checklist",
        items: [
          "**No inventory risk:** only order when you make a sale",
          "**Low MOQ:** start with just 1 unit",
          "**Fast fulfilment:** 24–48 hour processing time",
          "**Quality guaranteed:** 30-day warranty on all products",
          "**White label:** your branding on packaging (50+ units)",
          "**Marketing support:** photos, videos, content provided",
        ],
      },
      {
        type: "callout",
        tone: "success",
        title: "Beyond Lace Partner Perks",
        text: "Sign up today and receive: **free product samples** (first order), a **marketing kit** (photos + videos), **priority support**, and **exclusive wholesale pricing** (up to 60% off retail).",
      },

      { type: "h2", text: "Profit Calculator Tool" },
      { type: "calculator" },

      { type: "h2", text: "Scaling to 5-Figure Months" },
      {
        type: "phases",
        items: [
          {
            title: "Phase 1: First 30 Days ($0–3K/month)",
            text: "Learn the platforms, test content, make first sales. Set up TikTok + Instagram Shop, post 1–2x daily, go live weekly, engage every comment, order Beyond Lace samples. Expected: 10–30 sales, $1,000–3,000.",
          },
          {
            title: "Phase 2: Months 2–3 ($3K–10K/month)",
            text: "Double down on winning content, build audience. Create variations of top videos, increase live selling to 3–4x/week, start TikTok ads ($20–50/day), build an email list. Expected: 50–100 sales.",
          },
          {
            title: "Phase 3: Months 4–6 ($10K–30K/month)",
            text: "Scale ads, hire help, expand range. Increase ad spend to $100–200/day, hire a VA for support, add 10–20 products, start influencer partnerships. Expected: 100–300 sales.",
          },
          {
            title: "Phase 4: Months 6+ ($30K+/month)",
            text: "Build brand, expand platforms, optimise operations. Launch your own store, hire a small team, expand to YouTube/Pinterest, consider private label with Beyond Lace. Expected: 300–1,000+ sales.",
          },
        ],
      },

      { type: "h2", text: "Find Your Platform Quiz" },
      {
        type: "quiz",
        questions: [
          {
            q: "What’s your content comfort level?",
            options: [
              "I love being on camera",
              "I prefer photos over video",
              "I’m shy but willing to learn",
            ],
          },
          {
            q: "What’s your monthly marketing budget?",
            options: ["Under $500", "$500–2,000", "$2,000+"],
          },
        ],
      },

      { type: "h2", text: "Frequently Asked Questions" },
      {
        type: "faq",
        items: [
          {
            q: "How much money do I need to start selling on TikTok Shop?",
            a: "You can start with $500–1,000 using Beyond Lace’s dropshipping program. This covers business registration, initial marketing, and sample orders. No inventory investment required.",
          },
          {
            q: "Do I need to show my face in videos?",
            a: "No. Many successful Beyond Lace partners sell without showing their face — focus on wig transformations, installation tutorials, and product demos. Hands-only videos perform exceptionally well.",
          },
          {
            q: "How long does it take to make a first sale?",
            a: "Most Beyond Lace partners make their first sale within 7–14 days of launching. Consistent daily posting (1–2x) and live selling (2–3x/week) accelerates this timeline.",
          },
          {
            q: "Can I sell internationally?",
            a: "Yes. TikTok Shop and Instagram Shop both support international sales, and Beyond Lace ships to 50+ countries. Start with your home country, then expand as you grow.",
          },
        ],
      },
    ],
  },

  {
    slug: "hair-grades-12a-vs-10a-vs-human-hair",
    title: "12A vs 10A vs 100% Human Hair: Which Grade Is Right for You?",
    tags: ["Wig Guide"],
    category: "Wig Guides",
    date: "2026-07-28",
    image: "blogCover2",
    excerpt:
      "Grade labels are marketing until you know what they actually measure. Here is how to read them.",
    readTime: "6 min read",
    views: "842 views",
    author: EDITORIAL,
    keywords: [
      "12a hair grade",
      "10a hair",
      "virgin remy human hair",
      "hair grade explained",
      "buy human hair wig",
    ],
    blocks: [
      { type: "h2", text: "What the Grade Actually Measures" },
      {
        type: "p",
        text: "Ask two suppliers what “12A” means and you get two answers, because the grade scale is **not standardised**. What is verifiable is the construction: whether the cuticle is intact and aligned, whether the hair is single-donor, and whether it has been silicone-coated to fake shine.",
      },
      {
        type: "p",
        text: "At Beyond Lace, **12A** is our highest grade — unprocessed virgin hair with the cuticle intact and running in one direction, which prevents tangling and shedding over time. **10A** is Remy hair: cuticle-aligned but lightly processed for a specific colour or texture. Both are 100% human; the difference is longevity and how they respond to colour.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "The Practical Rule",
        text: "Planning to bleach, dye, or keep a unit two years or more? Buy virgin **12A**. Want a season-long style at a lower entry price? **10A** Remy is honest value.",
      },
    ],
  },

  {
    slug: "lace-size-explained-4x4-5x5-13x4-13x6-full-lace",
    title: "Lace Size Explained: 4×4, 5×5, 13×4, 13×6 and Full Lace — What to Choose",
    tags: ["Lace Size Guide", "Wig Guide"],
    category: "Wig Guides",
    date: "2026-07-25",
    image: "blogCover3",
    excerpt:
      "The numbers describe the parting space, not the wig. Match them to how you actually style.",
    readTime: "5 min read",
    views: "1,286 views",
    author: EDITORIAL,
    keywords: ["lace size guide", "13x4 vs 13x6", "4x4 closure", "full lace wig", "hd frontal"],
    blocks: [
      { type: "h2", text: "The Numbers Are Parting Space, in Inches" },
      {
        type: "p",
        text: "Closure and frontal sizes describe the lace area at the front of the cap. A **4×4** closure gives four inches of parting space; a **13×6** frontal spans ear to ear with six inches of depth, so you can part anywhere and pull the hair fully back.",
      },
      {
        type: "table",
        headers: ["Lace Type", "Parting", "Best For"],
        rows: [
          ["4×4 / 5×5 Closure", "Fixed middle/side", "Budget, longevity, simple parts"],
          ["13×4 Frontal", "Ear to ear", "Versatile partings, everyday wear"],
          ["13×6 Frontal", "Ear to ear, deep", "Ponytails, seamless hairline"],
          ["Full Lace", "Anywhere", "Maximum flexibility, gentle handling"],
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Beginner Pick",
        text: "Most beginners are happiest starting with a **13×4 HD frontal** — versatile enough to learn on, forgiving enough to wear daily.",
      },
    ],
  },

  {
    slug: "make-your-human-hair-wig-last-2-years",
    title: "How to Make Your Human Hair Wig Last 2+ Years: Expert Care Routine",
    tags: ["Hair Care", "Wig Care Routine"],
    category: "Hair Care",
    date: "2026-07-22",
    image: "blogCover4",
    excerpt: "A good unit is an investment. Here is the professional routine that protects it.",
    readTime: "7 min read",
    views: "2,041 views",
    author: EDITORIAL,
    keywords: [
      "wig care routine",
      "make wig last longer",
      "human hair wig maintenance",
      "how to wash a wig",
    ],
    blocks: [
      { type: "h2", text: "Friction, Heat, Moisture — in That Order" },
      {
        type: "p",
        text: "With the right care, 100% human hair lasts **twelve months or longer** with regular wear — often well past two years with occasional wear. What decides the difference is friction, heat, and moisture.",
      },
      {
        type: "checklist",
        items: [
          "**Wash** every 1–2 weeks max with sulphate-free shampoo, detangling from the ends up",
          "**Deep condition** monthly; use a leave-in after every wash",
          "**Heat** under 180°C, always with a heat protectant",
          "**Sleep** in a silk or satin bonnet to stop friction and tangling",
          "**Store** on a stand or in a silk bag, away from direct sunlight",
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "The One-Line Version",
        text: "Treat it like it grew from your own scalp and it will behave like it did.",
      },
    ],
  },

  {
    slug: "wear-and-go-wigs-beginner-installation-guide",
    title: "Wear-N-Go Wigs: The Complete Beginner’s Installation Guide",
    tags: ["Installation Guide", "Trending"],
    category: "Wig Guides",
    date: "2026-07-19",
    image: "blogCover5",
    excerpt: "Glueless, pre-plucked, and ready in minutes. The full step-by-step for first-timers.",
    readTime: "6 min read",
    views: "3,318 views",
    author: EDITORIAL,
    keywords: [
      "wear and go wig",
      "glueless wig install",
      "beginner wig installation",
      "how to install a wig",
    ],
    blocks: [
      { type: "h2", text: "Built for Speed, No Glue Required" },
      {
        type: "p",
        text: "Wear-and-go wigs use a **pre-plucked hairline**, bleached knots, and an elastic band with adjustable straps and combs — so there’s no glue, no melting, and no wait. The trade-off is that fit matters more, so measure your head before ordering.",
      },
      {
        type: "steps",
        title: "The Install, Step-by-Step",
        lines: [
          "Braid your hair down flat or use a wig cap.",
          "Position the unit from the front hairline back.",
          "Tighten the adjustable strap so the combs sit securely.",
          "Lay any baby hairs with a little edge control, and tuck the nape.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Why It Protects Your Edges",
        text: "Because there’s no adhesive, you can take it off nightly — preserving both your edges and the lace. It’s the most beginner-friendly install on the market.",
      },
    ],
  },

  {
    slug: "hd-lace-wigs-2026-why-stylists-switching",
    title: "HD Lace Wigs in 2026: Why Every Stylist Is Switching",
    tags: ["Trending"],
    category: "Wig Guides",
    date: "2026-07-15",
    image: "blogCover6",
    excerpt:
      "HD lace melts into the skin in a way standard lace never could. Here is what changed.",
    readTime: "5 min read",
    views: "1,674 views",
    author: EDITORIAL,
    keywords: [
      "hd lace wig",
      "hd lace vs transparent lace",
      "invisible hairline wig",
      "swiss lace",
    ],
    blocks: [
      { type: "h2", text: "The Lace That Disappears" },
      {
        type: "p",
        text: "HD (High-Definition) lace is a thinner, finer-grade Swiss lace that **melts invisibly into virtually all skin tones**, creating an undetectable, scalp-like hairline that standard brown or transparent lace cannot match.",
      },
      {
        type: "callout",
        tone: "insight",
        title: "Why Stylists Love It",
        text: "HD lace needs minimal to no knot bleaching and far less foundation to blend — saving chair time and protecting the client’s hairline. The catch is fragility, so it rewards a gentle hand.",
      },
    ],
  },

  {
    slug: "density-guide-130-150-180-200",
    title: "Density Guide: 130%, 150%, 180%, 200% — What Your Customers Actually Want",
    tags: ["Specs Guide"],
    category: "Wig Guides",
    date: "2026-07-11",
    image: "blogCover7",
    excerpt: "Density is the single most returned-for spec. Get it right and reorders follow.",
    readTime: "6 min read",
    views: "958 views",
    author: EDITORIAL,
    keywords: [
      "wig density guide",
      "150 vs 180 density",
      "wig fullness",
      "what density wig to buy",
    ],
    blocks: [
      { type: "h2", text: "How Much Hair Is on the Cap" },
      {
        type: "p",
        text: "Density is how much hair sits on the cap, as a percentage of “full.” **130%** reads natural and everyday; **150%** is the popular all-rounder; **180%+** gives the dramatic, camera-ready fullness that dominates social media.",
      },
      {
        type: "table",
        headers: ["Density", "Reads As", "Best For"],
        rows: [
          ["130%", "Natural, light", "Everyday, fine-hair look"],
          ["150%", "Balanced", "Most customers, flatters everyone"],
          ["180%", "Full", "Camera-ready, performers"],
          ["200%+", "Extra full", "Bridal, editorial, stage"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Reseller Note",
        text: "Stocking **150% and 180%** in your core textures covers most demand. Publish density on every listing — vague specs are the leading cause of returns.",
      },
    ],
  },

  {
    slug: "edge-control-baby-hairs-perfect-lace-melt",
    title: "Edge Control & Baby Hairs: The Art of the Perfect Lace Melt",
    tags: ["Specs Guide", "Hair Care"],
    category: "Hair Care",
    date: "2026-07-08",
    image: "blogCover8",
    excerpt:
      "The melt is where a good install becomes an invisible one. Small tools, big difference.",
    readTime: "5 min read",
    views: "1,120 views",
    author: EDITORIAL,
    keywords: ["lace melt", "edge control", "baby hairs wig", "how to melt lace"],
    blocks: [
      { type: "h2", text: "Preparation Beats Product" },
      {
        type: "p",
        text: "A perfect lace melt is less about glue and more about preparation: a clean, oil-free hairline, lace tinted to the skin tone, and knots that disappear under the right lighting.",
      },
      {
        type: "dodont",
        dos: [
          "Prep an oil-free hairline",
          "Tint lace to your skin tone",
          "Lay baby hairs in small S-curves",
          "Set with a silk scarf for a few minutes",
        ],
        donts: [
          "Pile on heavy product",
          "Draw harsh, unnatural swoops",
          "Skip the knot tint",
          "Rush the drying stage",
        ],
      },
    ],
  },

  {
    slug: "private-label-hair-brand-beyond-lace-oem",
    title: "Private Label Hair Brand: How to Launch Your Own Line With Beyond Lace OEM",
    tags: ["Brand Launch", "Business"],
    category: "Business",
    date: "2026-07-04",
    image: "blogCover9",
    excerpt: "Your box, your logo, our floor. The realistic path from idea to first order.",
    readTime: "8 min read",
    views: "1,433 views",
    author: EDITORIAL,
    keywords: [
      "private label hair",
      "hair brand oem",
      "start a wig brand",
      "custom hair packaging",
      "wholesale hair",
    ],
    blocks: [
      { type: "h2", text: "You Own the Brand, We Run the Floor" },
      {
        type: "p",
        text: "A private label brand ships under **your** name — your box, comb, hang tag and insert — while manufacturing, QC and logistics run on our floor in Xuchang. You own the brand and the customer relationship; we stay invisible behind it.",
      },
      {
        type: "callout",
        tone: "success",
        title: "Start Small",
        text: "Beyond Lace’s programme opens at a low minimum, so you can validate a few hero SKUs and custom packaging before committing to volume. A named account manager scopes lengths, densities, lace types and branding from order one.",
      },
      {
        type: "p",
        text: "The parts that sink new brands — batch consistency on reorders, MAP protection, and dependable dispatch — are exactly what we contract for. Start your inquiry from the [wholesale page](/wholesale#apply).",
      },
    ],
  },

  {
    slug: "crochet-braiding-hair-style-guide",
    title: "Crochet & Braiding Hair: The Complete Style Guide",
    tags: ["Braiding Hair", "Protective Styles"],
    category: "Wig Guides",
    date: "2026-06-30",
    image: "blogCover10",
    excerpt: "Protective styles that grow the business and protect the hair underneath.",
    readTime: "6 min read",
    views: "774 views",
    author: EDITORIAL,
    keywords: [
      "braiding hair",
      "crochet hair",
      "protective styles",
      "knotless braids",
      "passion twists",
    ],
    blocks: [
      { type: "h2", text: "The Workhorses of a Style Menu" },
      {
        type: "p",
        text: "Crochet and braiding lines carry a salon between wig installs and open the door to a younger, repeat clientele: knotless braids, boho locs, passion twists and crochet curls.",
      },
      {
        type: "callout",
        tone: "note",
        title: "For Resellers",
        text: "Braiding hair is high-frequency, low-friction inventory: light to ship, quick to reorder, and easy to bundle with edge control and accessories at the counter.",
      },
    ],
  },

  {
    slug: "rise-of-glueless-wigs-2026",
    title: "The Rise of Glueless Wigs: Why Nobody Uses Glue Anymore",
    tags: ["2026 Trends", "Trending"],
    category: "Wig Guides",
    date: "2026-06-26",
    image: "blogCover11",
    excerpt: "Adhesive-free installs went from beginner shortcut to the default. Here is why.",
    readTime: "5 min read",
    views: "2,509 views",
    author: EDITORIAL,
    keywords: ["glueless wig", "no glue wig install", "adjustable band wig", "wear and go"],
    blocks: [
      { type: "h2", text: "From Compromise to Default" },
      {
        type: "p",
        text: "Glue damaged more edges than any other install habit, and wearers noticed. Glueless construction — adjustable elastic bands, silicone grips and pre-plucked hairlines — now delivers a secure, all-day hold without a drop of adhesive.",
      },
      {
        type: "callout",
        tone: "insight",
        title: "The Hidden Win",
        text: "Every melt-and-remove cycle stresses HD lace. Skipping the glue means a unit survives far more wears looking new — real money saved on a premium human-hair wig.",
      },
    ],
  },

  {
    slug: "colouring-bleaching-human-hair-safe-guide",
    title: "Colouring & Bleaching Human Hair: A Safe Guide for Beginners",
    tags: ["Hair Care"],
    category: "Hair Care",
    date: "2026-06-17",
    image: "blogCover12",
    excerpt:
      "Human hair takes colour like your own — which means it can be over-processed like your own too.",
    readTime: "6 min read",
    views: "1,067 views",
    author: EDITORIAL,
    keywords: [
      "bleaching human hair wig",
      "colour a wig",
      "bleach knots hd lace",
      "dye human hair",
    ],
    blocks: [
      { type: "h2", text: "The Gift and the Risk" },
      {
        type: "p",
        text: "Because our hair is **100% human**, it responds to colour, bleach, perms and relaxers much like natural hair. You can achieve almost any tone — but aggressive processing shortens the lifespan of the unit.",
      },
      {
        type: "checklist",
        items: [
          "Always **strand-test** first",
          "Use a **professional colourist** for bleaching or drastic changes",
          "Bleach knots on HD lace with **diluted** product, for a shorter time",
          "**Deep condition** thoroughly after any chemical service",
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Prefer to Skip It?",
        text: "Pre-coloured units in popular tones give you the look with none of the risk — and chemically treated hair is not eligible for return, so decide before you order.",
      },
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

/** Slugified id for an h2, so the "What You'll Learn" TOC can deep-link to it. */
export function blockAnchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Section headings (h2) an article contains — powers the TOC. */
export function tableOfContents(post: BlogPost): { text: string; id: string }[] {
  return post.blocks
    .filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ text: b.text, id: blockAnchor(b.text) }));
}
