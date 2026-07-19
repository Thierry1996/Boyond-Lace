import type { Metadata } from "next";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Capsule Drops — Limited Numbered Editions",
  description:
    "Beyond Lace capsule drops: limited runs of 200 numbered human hair units, cut from the trend reserve. Never restocked.",
};

export default async function DropsPage() {
  const products = await commerce.getProducts({ sort: "newest" });
  const drops = products.filter((p) =>
    p.badges.some((b) => b.startsWith("Limited") || b === "New"),
  );

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Capsule drops</span>
        <span className="eyebrow hidden md:block">Trend agility pillar</span>
        <span className="eyebrow">Never restocked</span>
      </div>

      <div className="mt-16 mb-14">
        <SectionHeading
          eyebrow="Twenty percent of the floor, held in reserve"
          title="Cut Tuesday. Shipped Friday. Then gone."
          body="When a silhouette moves, the reserve floor is already cutting while everyone else waits on a container. Two hundred numbered units per edition, and the mould is broken. Circle members see every drop first."
        />
      </div>

      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {drops.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-20 border border-gold/25 p-8 text-center">
        <p className="eyebrow mb-3 text-gold">Early access</p>
        <p className="mx-auto max-w-xl text-[0.9375rem] leading-relaxed text-neutral-400">
          Drops open to The Beyond Circle and care subscribers 48 hours before the public.{" "}
          <Link href="/circle" className="text-gold underline-offset-4 hover:underline">
            Join the Circle
          </Link>{" "}
          to stop reading about editions after they sell through.
        </p>
      </div>
    </div>
  );
}
