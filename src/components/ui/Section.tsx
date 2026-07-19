/**
 * Section chrome lifted from the brand boards: an inset hairline frame with
 * tracked-out eyebrow labels sitting on the top rule. See
 * docs/brand/05-visual-identity.md §5.
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
        <div className="mb-14 flex items-center justify-between border-t border-white/[0.07] pt-4">
          <span className="eyebrow">{eyebrowLeft}</span>
          <span className="eyebrow hidden md:block">{eyebrowCenter}</span>
          <span className="eyebrow">{eyebrowRight}</span>
        </div>
      )}
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-4 text-gold">{eyebrow}</p>}
      <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] text-paper">{title}</h2>
      {body && <p className="mt-5 text-[1.0625rem] leading-relaxed text-neutral-400">{body}</p>}
    </div>
  );
}
