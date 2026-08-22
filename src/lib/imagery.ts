/**
 * Beyond Lace imagery registry.
 *
 * Every photograph used in navigation and resource pages is declared here, once,
 * so art direction is a single-file decision rather than scattered through JSX.
 *
 * SOURCING: Unsplash CDN (Unsplash License — free for commercial use, no
 * attribution required). Every URL below was verified to return 200 before
 * shipping. Pixabay's CDN is also reachable and may be mixed in the same way.
 *
 * CATEGORY GUARD: the brand name reads as lingerie to image models and ad
 * classifiers (docs/brand/05-visual-identity.md §8), so every image here is
 * drawn from hair-category searches — salon, braids, styling, hair tools — and
 * every alt string states hair explicitly. Do not add imagery that could be
 * read as intimates.
 *
 * REPLACE WITH OWNED PHOTOGRAPHY BEFORE LAUNCH. Stock is a placeholder for art
 * direction, not a final asset: swap the `id` values for your own CDN paths and
 * nothing else in the app needs to change.
 */

const CDN = "https://images.unsplash.com";

export interface BrandPhoto {
  id: string;
  alt: string;
}

/** Builds a sized, format-optimised URL. Square by default for 1:1 grids.
 *  An owned asset (a local `/media/…` path or an absolute http(s) URL) is used
 *  verbatim — only Unsplash `photo-…` ids get the CDN + sizing params. */
export function photoUrl(id: string, w = 800, h?: number): string {
  if (/^(https?:|\/)/.test(id)) return id;
  const crop = h ? `&fit=crop&w=${w}&h=${h}` : `&fit=crop&w=${w}`;
  return `${CDN}/${id}?auto=format&q=75${crop}`;
}

/**
 * Named art direction slots. Keys are stable; the photo behind a key can change
 * without touching a component.
 */
export const IMAGERY = {
  // --- Navigation / menu panels -------------------------------------------
  navShop: {
    id: "photo-1636302925868-52075f44d810",
    alt: "Close-up of long, smooth human hair styled straight",
  },
  navWholesale: {
    id: "photo-1521590832167-7bcbfaa6381f",
    alt: "Interior of a professional hair salon studio",
  },
  navBrand: {
    id: "photo-1709672262859-68cb9b39ae4f",
    alt: "Portrait of a woman with long styled hair",
  },
  navCircle: {
    id: "photo-1648010035195-6b0a56e14667",
    alt: "Woman wearing long box-braided hair outdoors",
  },
  navLearn: {
    id: "photo-1634449571010-02389ed0f9b0",
    alt: "Stylist cutting and shaping a client's hair in a salon",
  },
  navSupport: {
    id: "photo-1562322140-8baeececf3df",
    alt: "Stylist blow-drying and finishing a client's hair",
  },

  // --- Owned mega-menu panel art (public/media/images/menu), one per panel --
  menuShop: {
    id: "/media/images/menu/shop-mega-menu.jpg",
    alt: "Beyond Lace human hair wig collection",
  },
  menuWholesale: {
    id: "/media/images/menu/wholesale-menu-new.jpg",
    alt: "Beyond Lace wholesale hair programme",
  },
  menuBrand: {
    id: "/media/images/menu/menu-new-18.jpg",
    alt: "Beyond Lace brand editorial",
  },
  menuRecommended: {
    id: "/media/images/menu/recommended-mega-menu.jpg",
    alt: "Recommended Beyond Lace human hair wig styles",
  },
  menuBundles: {
    id: "/media/images/menu/bundle-and-extension.webp",
    alt: "Human hair bundles and extensions",
  },
  menuTools: {
    id: "/media/images/menu/tools-and-accessories.jpg",
    alt: "Wig tools and accessories",
  },
  menuCircle: {
    id: "/media/images/menu/beyond-circle.jpg",
    alt: "The Beyond Circle community wearing Beyond Lace hair",
  },
  menuLearn: {
    id: "/media/images/menu/learn-mega-menu.jpg",
    alt: "Beyond Lace hair education and tutorials",
  },
  menuSupport: {
    id: "/media/images/menu/mega-menu-support.jpg",
    alt: "Beyond Lace customer support",
  },

  // --- Support resource groups --------------------------------------------
  fitGuides: {
    id: "photo-1595475884562-073c30d45670",
    alt: "Hair brush and styling tools laid out on a surface",
  },
  b2bResources: {
    id: "photo-1600948836101-f9ffda59d250",
    alt: "Salon styling chairs in a professional studio",
  },
  brandPress: {
    id: "photo-1606415918835-88d0614e75ad",
    alt: "Editorial portrait of a woman with braided hair",
  },
  educationPartnership: {
    id: "photo-1572954889228-2b12a55144d1",
    alt: "Hands holding a section of long braided hair",
  },
  ordersLogistics: {
    id: "photo-1580618672591-eb180b1a973f",
    alt: "Woman holding a length of hair extensions",
  },
  company: {
    id: "photo-1554519934-e32b1629d9ee",
    alt: "Portrait of a person with styled hair against a plain background",
  },

  // --- Ambassador tiers ----------------------------------------------------
  tier3: {
    id: "photo-1673470907547-1c0c6a996095",
    alt: "Creator with cornrow-braided hair filming content",
  },
  tier2: {
    id: "photo-1613099084406-4b9140fc780a",
    alt: "Woman with long braided hair styled for camera",
  },
  tier1: {
    id: "photo-1572955304332-bf714bd49add",
    alt: "Editorial styling portrait with intricate braided hair",
  },

  // --- Misc ---------------------------------------------------------------
  laceDetail: {
    id: "photo-1560869713-7d0a29430803",
    alt: "Close-up of hair being curled and styled with a heat tool",
  },

  // --- Blog post covers (public/media/images/blog) -------------------------
  blogCover1: {
    id: "/media/images/blog/blog-1.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover2: {
    id: "/media/images/blog/blog-2.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover3: {
    id: "/media/images/blog/blog-3.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover4: {
    id: "/media/images/blog/blog-4.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover5: {
    id: "/media/images/blog/blog-5.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover6: {
    id: "/media/images/blog/blog-6.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover7: {
    id: "/media/images/blog/blog-7.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover8: {
    id: "/media/images/blog/blog-8.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover9: {
    id: "/media/images/blog/blog-9.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover10: {
    id: "/media/images/blog/blog-10.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover11: {
    id: "/media/images/blog/blog-11.jpg",
    alt: "Beyond Lace journal article cover",
  },
  blogCover12: {
    id: "/media/images/blog/blog-12.jpg",
    alt: "Beyond Lace journal article cover",
  },
} as const satisfies Record<string, BrandPhoto>;

export type ImageryKey = keyof typeof IMAGERY;

/** Convenience: full URL for a named slot. */
export function img(key: ImageryKey, w = 800, h?: number) {
  const p = IMAGERY[key];
  return { src: photoUrl(p.id, w, h), alt: p.alt };
}
