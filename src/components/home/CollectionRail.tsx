import Link from "next/link";
import { getCollections } from "@/lib/collections";
import { CollectionRailCarousel } from "./CollectionRailCarousel";

/**
 * Home collection rail — the shop-by-collection row that sits directly under the
 * hero. Server-rendered: fetches the collections and hands them to the client
 * carousel, which shows six bold cards at a time, auto-spotlights the active
 * card on a six-second loop, and gives chevrons for free browsing — so the whole
 * range gets exposure instead of the half a static strip could show. Imagery is
 * the on-brand gradient placeholder until the shoot lands (hair-only system).
 */
export async function CollectionRail() {
  const items = await getCollections();
  return (
    <section aria-label="Shop by collection" className="border-b border-white/[0.07] bg-ink py-10">
      <div className="mx-auto max-w-[1560px] px-[3vw]">
        <div className="mb-4 flex items-baseline justify-between px-1">
          <p className="eyebrow text-gold">Shop by collection</p>
          <Link
            href="/collections"
            className="text-[0.75rem] tracking-[0.1em] text-neutral-400 uppercase underline-offset-4 transition-colors hover:text-gold"
          >
            View all →
          </Link>
        </div>

        <CollectionRailCarousel items={items} />
      </div>
    </section>
  );
}
