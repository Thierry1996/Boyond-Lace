import Link from "next/link";
import { BrandImage } from "./BrandImage";
import type { ImageryKey } from "@/lib/imagery";

/** Consistent image-led header for every support/resource page. */
export function ResourceHero({
  eyebrow,
  title,
  italic,
  body,
  image,
  breadcrumb = { label: "Support", href: "/support" },
  cta,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  body: string;
  image: ImageryKey;
  breadcrumb?: { label: string; href: string };
  cta?: { label: string; href: string; external?: boolean };
}) {
  return (
    <section className="grain relative overflow-hidden border-b border-gold/15">
      <div className="absolute inset-0">
        <BrandImage
          name={image}
          ratio="auto"
          width={1800}
          sizes="100vw"
          priority
          className="h-full w-full"
          overlay={false}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgb(9 9 9 / 0.94) 0%, rgb(50 21 40 / 0.86) 45%, rgb(90 45 103 / 0.55) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-[4vw] pt-16 pb-20">
        <div className="flex items-center gap-2 text-[0.75rem] text-neutral-400">
          <Link href={breadcrumb.href} className="transition-colors hover:text-gold">
            {breadcrumb.label}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-200">{title}</span>
        </div>

        <div className="mt-14 max-w-3xl">
          <p className="eyebrow mb-5 text-gold">{eyebrow}</p>
          <h1 className="text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] text-paper">
            {title}
            {italic && <span className="block italic">{italic}</span>}
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-200/80">
            {body}
          </p>
          {cta && (
            <Link
              href={cta.href}
              {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-9 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
