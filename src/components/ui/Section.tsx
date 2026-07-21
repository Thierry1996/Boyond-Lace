"use client";

import { Reveal, SplitText, DrawRule } from "@/components/motion/primitives";

/**
 * Section chrome lifted from the brand boards: an inset hairline frame with
 * tracked-out eyebrow labels sitting on the top rule
 * (docs/brand/05-visual-identity.md §5).
 *
 * The rule now draws itself across on entry and the eyebrows arrive staggered,
 * so a section announces itself rather than simply existing.
 */
export function Section({
  children,
  className = "",
  eyebrowLeft,
  eyebrowCenter,
  eyebrowRight,
}: {
  children: React.ReactNode;
  className?: string;
  eyebrowLeft?: string;
  eyebrowCenter?: string;
  eyebrowRight?: string;
}) {
  const hasFrame = eyebrowLeft || eyebrowCenter || eyebrowRight;

  return (
    <section className={`mx-auto max-w-[1440px] px-[4vw] ${className}`}>
      {hasFrame && (
        <div className="mb-14">
          <DrawRule />
          <div className="flex items-center justify-between pt-4">
            {[eyebrowLeft, eyebrowCenter, eyebrowRight].map((label, i) => (
              <Reveal
                key={`${label}-${i}`}
                delay={0.12 + i * 0.09}
                duration={0.7}
                className={i === 1 ? "hidden md:block" : ""}
              >
                <span className="eyebrow">{label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Section heading. The title assembles word-by-word from behind a mask; the
 * eyebrow and body follow on a short delay so the eye is led downward in
 * sequence rather than presented with a finished block.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  /** Word index from which the remainder sets italic — the brand's second line. */
  italicFrom,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  italicFrom?: number;
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <Reveal duration={0.7}>
          <p className="eyebrow mb-4 text-gold">{eyebrow}</p>
        </Reveal>
      )}

      <SplitText
        as="h2"
        text={title}
        italicFrom={italicFrom}
        delay={0.05}
        className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.04] text-paper"
      />

      {body && (
        <Reveal delay={0.28} duration={0.85}>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-neutral-400">{body}</p>
        </Reveal>
      )}
    </div>
  );
}
