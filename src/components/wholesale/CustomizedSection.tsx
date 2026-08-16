import { ProductImage } from "@/components/ui/ProductImage";

/**
 * "Customized" — the private-label capability block, cloned in layout from the
 * reference: a Custom Styles model grid and a Custom Colours swatch chart, in the
 * Beyond Lace dark/gold system. Style images are pulled from the live catalogue.
 */

// The colour ring wholesale partners can order against. Solid shades plus the
// two multi-tone finishes rendered as gradients, matching the reference chart.
const COLORS: { label: string; css: string }[] = [
  { label: "#1", css: "#0a0a0a" },
  { label: "#1B", css: "#191512" },
  { label: "#2", css: "#3b2a1e" },
  { label: "#4", css: "#5a3b28" },
  { label: "#6", css: "#7a5236" },
  { label: "#8", css: "#94765a" },
  { label: "#27", css: "#b98a4e" },
  { label: "#30", css: "#7a4a2a" },
  { label: "#33", css: "#6e3826" },
  { label: "#350", css: "#a8442a" },
  { label: "#99J", css: "#4a1220" },
  { label: "#425", css: "#5f2e22" },
  { label: "#613", css: "#e6d3a0" },
  { label: "#Orange", css: "#cf6a24" },
  { label: "#Purple", css: "#5b2a83" },
  { label: "#Blue", css: "#2a4d9b" },
  { label: "#Red", css: "#a01f2e" },
  { label: "#Pink", css: "#d98aa8" },
  { label: "#Grey", css: "#b4b4b4" },
  { label: "#613/27", css: "linear-gradient(180deg,#e6d3a0 0%,#b98a4e 100%)" },
  { label: "#Highlight", css: "linear-gradient(180deg,#241a14 0%,#c69a5b 100%)" },
];

export function CustomizedSection({ styleImages }: { styleImages: { src: string; alt: string }[] }) {
  const imgs = styleImages.slice(0, 7);
  return (
    <section className="surface-velvet border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="text-center">
          <p className="eyebrow text-gold">Private label</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,4rem)] tracking-[0.02em] text-paper uppercase">
            Customized
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-blush-200/70">
            Your styles, your colours, your label. Order any texture and cut against our full colour
            ring — from natural black to fashion tones and custom highlights.
          </p>
        </div>

        {/* Custom Styles — model grid + faint index */}
        <div className="mt-14 rounded-2xl border border-white/[0.08] bg-ink/30 p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {imgs.slice(0, 3).map((im) => (
              <div key={im.src} className="overflow-hidden rounded-lg">
                <ProductImage src={im.src} alt={im.alt} ratio="4 / 5" />
              </div>
            ))}
            <div className="relative flex flex-col items-end justify-center p-2 text-right">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 -bottom-2 font-[family-name:var(--font-display)] text-[5rem] leading-none text-gold/15"
              >
                01
              </span>
              <p className="eyebrow text-gold">Custom</p>
              <p className="font-[family-name:var(--font-display)] text-2xl text-paper uppercase">
                Styles
              </p>
            </div>
            {imgs.slice(3, 7).map((im) => (
              <div key={im.src} className="overflow-hidden rounded-lg">
                <ProductImage src={im.src} alt={im.alt} ratio="4 / 5" />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Colours — label + swatch chart */}
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-ink/30 p-5 sm:p-7">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 left-0 font-[family-name:var(--font-display)] text-[5rem] leading-none text-gold/15"
              >
                02
              </span>
              <p className="eyebrow relative text-gold">Custom</p>
              <p className="relative font-[family-name:var(--font-display)] text-3xl text-paper uppercase">
                Colours
              </p>
              <p className="relative mt-3 text-[0.8125rem] leading-relaxed text-neutral-400">
                21 stock tones and finishes — or send a colour-ring reference for a bespoke dye lot.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-7">
              {COLORS.map((c) => (
                <div key={c.label} className="flex flex-col items-center gap-1.5">
                  <span
                    className="h-16 w-full rounded-md border border-white/10 sm:h-20"
                    style={{ background: c.css }}
                    aria-hidden="true"
                  />
                  <span className="rounded-full bg-gold/90 px-2 py-0.5 text-[0.625rem] font-medium text-ink tabular-nums">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
