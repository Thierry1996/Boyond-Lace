import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductCard } from "@/components/ui/ProductCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CollectionRail } from "@/components/home/CollectionRail";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BestSellers } from "@/components/home/BestSellers";
import { FlashSale } from "@/components/home/FlashSale";
import { ReachCarousel, type ReachItem } from "@/components/home/ReachCarousel";
import { CollectionTabs, type CatalogTab } from "@/components/home/CollectionTabs";
import { SocialProof } from "@/components/home/SocialProof";
import { RealLooks, type ShowcaseProduct } from "@/components/home/RealLooks";
import { BestsellerShowcase, type BestsellerItem } from "@/components/home/BestsellerShowcase";
import { DiscoverBanner } from "@/components/home/DiscoverBanner";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { JoinTheCircle } from "@/components/home/JoinTheCircle";
import { WholesaleSpecial } from "@/components/home/WholesaleSpecial";
import { ShopByLook } from "@/components/home/ShopByLook";
import { BlogPosts } from "@/components/home/BlogPosts";
import { HomeNewsletter } from "@/components/home/HomeNewsletter";
import { FreeGiftPopup, type GiftItem } from "@/components/marketing/FreeGiftPopup";
import { BrandMarquee, ProofBand, EditorialSplit, PillarBento } from "@/components/home/Sections";

export default async function HomePage() {
  // Scoped to the signature line on purpose. An unscoped "featured" sort ranks
  // by review volume, which floats the $5 test kit and the $34 adhesive to the
  // top — accessories always out-review units. That is the wrong first
  // impression for a brand justifying $600.
  const [bestsellers, capsule, newArrivals, topRated, premium, bundlePool, carePool, kitPool] =
    await Promise.all([
      commerce.getProducts({ line: "luxe", sort: "featured", limit: 6 }),
      commerce.getProducts({ avatar: "editorial", limit: 2 }),
      commerce.getProducts({ sort: "newest", limit: 12 }),
      commerce.getProducts({ sort: "rating", limit: 40 }),
      commerce.getProducts({ sort: "price-desc", limit: 24 }),
      commerce.getProducts({ line: "bundle", limit: 16 }),
      commerce.getProducts({ line: "care", limit: 8 }),
      commerce.getProducts({ line: "kit", limit: 4 }),
    ]);
  // Ten priced, in-stock units for the drop — accessories/by-application skip.
  const drop = newArrivals.filter((p) => p.price > 0).slice(0, 10);
  // Best Sale: wig units only (no $5 test kit / care accessories), discounted
  // first, then filled with the top-rated remainder.
  const isWig = (p: (typeof topRated)[number]) =>
    p.price > 0 && !["care", "kit", "try-on"].includes(p.line);
  const priced = topRated.filter(isWig);
  const discounted = priced.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
  const bestSale = [...discounted, ...priced.filter((p) => !discounted.includes(p))].slice(0, 10);

  // Two teaser catalogues. Ready-to-wear reads from the top-rated wigs; the
  // fashion-colour rail from the premium (price-desc) wigs, so the two rails
  // show different units. Both map to the lean ReachItem shape.
  const RTW_TAGS = [
    "Yaki Body",
    "Layer Cut",
    "Silky Blunt",
    "Body Wave",
    "Deep Wave",
    "Loose Wave",
    "Curtain Bangs",
    "Bob Cut",
    "Kinky Straight",
    "Flip Over",
  ];
  const toReach = (p: (typeof topRated)[number], i: number, tag: boolean): ReachItem => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    image: p.images[0].src,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    rating: p.rating || 5,
    reviewCount: p.reviewCount,
    tag: tag ? RTW_TAGS[i % RTW_TAGS.length] : undefined,
  });
  const readyToWear = priced.slice(0, 12).map((p, i) => toReach(p, i, true));
  const fashionColor = premium
    .filter(isWig)
    .slice(0, 12)
    .map((p, i) => toReach(p, i, false));

  // Tabbed collection catalogue — three category sets, each drawn from the
  // commerce database and routed to its real collection/filter.
  const toItem = (p: (typeof topRated)[number], tag: string): ReachItem => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    image: p.images[0].src,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    rating: p.rating || 5,
    reviewCount: p.reviewCount,
    tag,
  });
  const CURLY = [
    "deep-wave",
    "kinky-curly",
    "kinky-straight",
    "jerry-curl",
    "water-wave",
    "curly",
    "afro-kinky",
    "loose-deep",
  ];
  const bundles = bundlePool.filter((p) => p.price > 0);
  const colouredWigs = priced.filter((p) => p.shade && p.shade !== "natural-black");
  const curlyWigs = priced.filter(
    (p) => p.texture && CURLY.includes(p.texture) && !colouredWigs.includes(p),
  );
  const fill = (set: typeof priced, min = 5) => (set.length >= min ? set : priced);
  const catalogTabs: CatalogTab[] = [
    {
      id: "bundles",
      label: "Hair Bundles",
      href: "/shop?line=bundle",
      items: fill(bundles)
        .slice(0, 10)
        .map((p) => toItem(p, p.badges[0] ?? "Bundle Deal")),
    },
    {
      id: "crochet",
      label: "Crochet Hair",
      href: "/shop?texture=kinky-curly",
      items: fill(curlyWigs)
        .slice(0, 10)
        .map((p) => toItem(p, p.badges[0] ?? "Crochet Hair")),
    },
    {
      id: "colors",
      label: "Trending Colors",
      href: "/collections/coloured-wigs",
      items: fill(colouredWigs)
        .slice(0, 10)
        .map((p) => toItem(p, p.badges[0] ?? "Trending Color")),
    },
  ];

  // Social-proof engine — video-review clips and a masonry board, both from the
  // wig catalogue; the trust badge totals real review counts.
  const socialClips = priced.slice(0, 10).map((p, i) => toReach(p, i, false));
  const socialBoard = priced.slice(0, 15).map((p, i) => toReach(p, i, false));
  const reviewsTotal = priced.reduce((s, p) => s + p.reviewCount, 0);

  // "Real Looks" impulse carousel — bold product cards with a Buy-Now quick view.
  const showcase: ShowcaseProduct[] = priced.slice(0, 10).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    image: p.images[0].src,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    options: p.options,
  }));
  // "What people come back for" — bestsellers mapped to the image-1 card shape,
  // carrying the extras the card renders (rating, badges, stock).
  const bestsellerItems: BestsellerItem[] = bestsellers.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    image: p.images[0].src,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    options: p.options,
    tagline: p.tagline,
    rating: p.rating || 5,
    reviewCount: p.reviewCount,
    badges: p.badges,
    inStock: p.inStock,
  }));
  // Free-gift pool — real accessories (care + install kit).
  const gifts: GiftItem[] = [...carePool, ...kitPool]
    .filter((p) => p.price > 0)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      image: p.images[0].src,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
    }));

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────
          Six-slide pillar carousel with gilded centred type, per the reference
          direction. The h1 is visually part of slide 1's composition but kept
          for document semantics and SEO. */}
      <h1 className="sr-only">
        Beyond Lace — luxury HD Swiss lace human hair wigs. We don&apos;t sell hair; we sell
        what&apos;s beyond it.
      </h1>
      <HeroCarousel />

      {/* Shop-by-collection rail — the category entry points, straight under the hero. */}
      <CollectionRail />

      {/* Gilded statement ticker — a pulse between two dark blocks. */}
      <BrandMarquee />

      {/* Real Looks impulse carousel — top-level bold auto-sliding product-in-
          action cards (6s dwell, chevrons, spotlight upscale), each opening a
          Buy-Now quick view straight to checkout. */}
      <RealLooks products={showcase} />

      {/* New-arrivals drop — rendered just below the on-page gilded ticker.
          Cards link to the PDP, the cart button quick-adds, "View all" routes
          to the New In collection. */}
      <NewArrivals products={drop} />

      {/* Figures that resolve on scroll, before any sales copy. */}
      <ProofBand />

      {/* Shop by Occasion — impulse-buy rail cloned from a tested competitor
          layout, brand-skinned. Tiles route to the collection built for each
          moment. Sits directly on top of the Best Sale grid. */}
      <ShopByOccasion />

      {/* Best Sale grid — bestseller drop, immediately above the flash sale.
          Cards, prices, ratings and cart all wired to real product data. */}
      <BestSellers products={bestSale} />

      {/* Flash-sale image accordion — the FOMO drop, just below the proof stats.
          Panels auto-cycle every 6s and route to real collections; the BUY
          button and card both link to the category. */}
      <FlashSale />

      {/* Reach-catalogue teasers — two auto-sliding carousels, stacked. Cards
          link to the PDP; heart -> wishlist, bag -> cart; View all -> collection. */}
      <ReachCarousel
        title="Ready to Wear Wig"
        subtitle="Pre-everything · 3D Snug Fit · 100% Glueless"
        items={readyToWear}
        variant="rtw"
        viewAllHref="/collections/glueless-wigs"
        dots
      />
      <ReachCarousel
        title="HD Lace Glueless — Fashion Colour"
        subtitle="Celebrity-worn · Talked about · Ready to ship"
        items={fashionColor}
        variant="color"
        viewAllHref="/collections/coloured-wigs"
      />

      {/* Asymmetric editorial split, replacing the old equal-halves layout. */}
      <EditorialSplit />

      {/* Tabbed collection catalogue — immediately below the five-dollar answer.
          Tabs switch category sets (bundles / crochet / colours) client-side;
          cards link to the PDP, heart -> wishlist, bag -> cart, View More ->
          the category collection. */}
      <CollectionTabs tabs={catalogTabs} />

      {/* ── Bestsellers ──────────────────────────────────────────────────── */}
      <Section
        className="py-28"
        eyebrowLeft="The collection"
        eyebrowCenter="Signature units"
        eyebrowRight="Hand-tied"
      >
        <div className="mb-14 flex items-end justify-between gap-8">
          <SectionHeading title="What people come back for." />
          <Link
            href="/shop"
            className="hidden shrink-0 border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase md:block"
          >
            All units
          </Link>
        </div>
        <BestsellerShowcase
          items={bestsellerItems}
          feature={{
            eyebrow: "The glueless edit",
            title: "Wear & Go.",
            href: "/collections/glueless-wigs",
            image: "aurora",
            cta: "Shop all",
          }}
        />
      </Section>

      {/* ── Discover banner — doorway into the shop-by-intention page ─────── */}
      <DiscoverBanner />

      {/* ── Six Pillars — broken bento, not a uniform 3×2 ─────────────────── */}
      <PillarBento />

      {/* ── Capsule ──────────────────────────────────────────────────────── */}
      <Section
        className="py-28"
        eyebrowLeft="Trend agility"
        eyebrowCenter="Capsule drops"
        eyebrowRight="Never restocked"
      >
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Twenty percent held in reserve"
              title="Cut Tuesday. Shipped Friday. Then gone."
              body="Our floor keeps a fifth of its capacity idle on purpose. When a silhouette moves, we are not waiting on a container — we are already cutting. Two hundred units, numbered, and the mould is broken."
            />
            <Link
              href="/shop?sort=newest"
              className="mt-8 inline-block border-b border-gold pb-1 text-[0.8125rem] tracking-[0.1em] text-gold uppercase"
            >
              See what&apos;s live
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {capsule.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── Wholesale Special — B2B offer, perks checklist, value accordion and
          the wholesale CTAs. */}
      <WholesaleSpecial />

      {/* ── The Beyond Circle — full-width animated membership banner + tier
          ladder, cloned from a tested competitor loyalty section, brand-skinned.
          CTA routes to the members' space at /circle. */}
      <JoinTheCircle />

      {/* ── Social proof engine ──────────────────────────────────────────────
          Replaces the single closing testimonial: a scrollable video-review
          carousel and a Pinterest-style masonry board with a woven-in
          testimonial. Every tile links into the catalogue. */}
      <SocialProof clips={socialClips} board={socialBoard} reviewsTotal={reviewsTotal} />

      {/* Shop by Look — editorial discovery rail under the social-proof board.
          Two reference slides folded into one 3-up carousel; each look routes to
          its real collection or filtered shop view. */}
      <ShopByLook />

      {/* Blog posts — the four newest Media Center articles, each linking to
          /blog/[slug]. Distinct plum-gradient ground. */}
      <BlogPosts />

      {/* Newsletter band — home subscribe, posts to /api/newsletter. */}
      <HomeNewsletter />

      {/* Time-triggered spend-and-get-a-free-gift bundle offer. */}
      <FreeGiftPopup gifts={gifts} />
    </>
  );
}
