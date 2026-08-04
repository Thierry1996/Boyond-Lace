import { Fragment, type ReactNode } from "react";
import { Lightbulb, Trophy, Info, Check, X } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { blockAnchor, type Block } from "@/lib/blog";
import { ProfitCalculator } from "./ProfitCalculator";
import { PlatformQuiz } from "./PlatformQuiz";

/* --------------------------------------------------- inline rich text ----- */

/** Renders **bold** and [label](url) — external URLs open in a new tab. */
function rich(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = linkRe.exec(text))) {
    if (m.index > last) out.push(...bold(text.slice(last, m.index), `t${k++}`));
    const href = m[2];
    const external = /^https?:/i.test(href);
    out.push(
      <a
        key={`l${k++}`}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-medium text-plum-700 underline underline-offset-2 hover:text-plum-500"
      >
        {m[1]}
      </a>,
    );
    last = linkRe.lastIndex;
  }
  if (last < text.length) out.push(...bold(text.slice(last), `t${k++}`));
  return out;
}

function bold(text: string, keyBase: string): ReactNode[] {
  return text.split("**").map((seg, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyBase}-${i}`} className="font-semibold text-plum-900">
        {seg}
      </strong>
    ) : (
      <Fragment key={`${keyBase}-${i}`}>{seg}</Fragment>
    ),
  );
}

/* ------------------------------------------------------------ callouts ---- */

const CALLOUT = {
  tip: { Icon: Lightbulb, ring: "border-plum-600", bg: "bg-plum-700/[0.05]", ic: "text-plum-600" },
  insight: {
    Icon: Lightbulb,
    ring: "border-blush-400",
    bg: "bg-blush-400/[0.12]",
    ic: "text-plum-600",
  },
  success: {
    Icon: Trophy,
    ring: "border-emerald-500",
    bg: "bg-emerald-500/[0.08]",
    ic: "text-emerald-600",
  },
  note: { Icon: Info, ring: "border-plum-900/25", bg: "bg-plum-900/[0.04]", ic: "text-plum-700" },
} as const;

/* -------------------------------------------------------- block render ---- */

export function BlogArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.type) {
    case "p":
      return <p className="text-[1.0625rem] leading-[1.85] text-plum-900/80">{rich(b.text)}</p>;

    case "h2":
      return (
        <h2
          id={blockAnchor(b.text)}
          className="scroll-mt-28 pt-6 font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2rem)] text-plum-900"
        >
          {b.text}
        </h2>
      );

    case "h3":
      return (
        <h3 className="pt-2 font-[family-name:var(--font-display)] text-[1.25rem] text-plum-900">
          {b.text}
        </h3>
      );

    case "image":
      return (
        <figure className="overflow-hidden">
          <div className="overflow-hidden rounded-2xl border border-plum-900/10">
            <BrandImage
              name={b.image}
              ratio={b.ratio ?? "16 / 9"}
              overlay={false}
              sizes="(max-width:768px) 100vw, 720px"
            />
          </div>
          {b.caption && (
            <figcaption className="mt-3 text-center text-[0.8125rem] text-plum-900/50 italic">
              {b.caption}
            </figcaption>
          )}
        </figure>
      );

    case "callout": {
      const c = CALLOUT[b.tone ?? "note"];
      return (
        <div className={`rounded-r-xl border-l-[3px] ${c.ring} ${c.bg} px-6 py-5`}>
          {b.title && (
            <p className="mb-2 flex items-center gap-2 font-semibold text-plum-900">
              <c.Icon size={16} strokeWidth={1.75} className={c.ic} aria-hidden />
              {b.title}
            </p>
          )}
          <p className="text-[0.9375rem] leading-[1.75] text-plum-900/80">{rich(b.text)}</p>
        </div>
      );
    }

    case "quote":
      return (
        <blockquote className="rounded-r-xl border-l-[3px] border-plum-600 bg-white/60 px-6 py-5">
          <p className="text-[1.0625rem] leading-relaxed text-plum-900/85 italic">
            “{rich(b.text)}”
          </p>
          {b.cite && (
            <cite className="mt-3 block text-[0.8125rem] text-plum-900/55 not-italic">
              — {b.cite}
            </cite>
          )}
        </blockquote>
      );

    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-plum-900/10">
          <table className="w-full min-w-[36rem] border-collapse text-left text-[0.875rem]">
            <thead>
              <tr className="bg-plum-900 text-blush-200">
                {b.headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} className="border-t border-plum-900/8">
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className={`px-4 py-3 ${c === 0 ? "font-semibold text-plum-900" : "text-plum-900/70"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "stats":
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {b.cards.map((s) => (
            <div key={s.label} className="rounded-xl border border-plum-900/10 bg-white/70 p-4">
              <p className="font-[family-name:var(--font-display)] text-2xl text-plum-600">
                {s.value}
              </p>
              <p className="mt-1 text-[0.6875rem] tracking-wide text-plum-900/50 uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      );

    case "checklist":
      return (
        <ul className="space-y-3">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-plum-900/80">
              <Check
                size={18}
                strokeWidth={2.25}
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden
              />
              <span>{rich(it)}</span>
            </li>
          ))}
        </ul>
      );

    case "dodont":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5">
            <p className="mb-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-emerald-700 uppercase">
              Do
            </p>
            <ul className="space-y-2.5">
              {b.dos.map((d, i) => (
                <li key={i} className="flex gap-2.5 text-[0.875rem] text-plum-900/80">
                  <Check
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                  <span>{rich(d)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/[0.06] p-5">
            <p className="mb-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-rose-600 uppercase">
              Don’t
            </p>
            <ul className="space-y-2.5">
              {b.donts.map((d, i) => (
                <li key={i} className="flex gap-2.5 text-[0.875rem] text-plum-900/80">
                  <X
                    size={16}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-rose-500"
                    aria-hidden
                  />
                  <span>{rich(d)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "steps":
      return (
        <div className="rounded-xl border border-plum-700/15 bg-plum-700/[0.06] p-6">
          {b.title && <p className="mb-4 font-semibold text-plum-900">{b.title}</p>}
          <ol className="space-y-3">
            {b.lines.map((line, i) => (
              <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-plum-900/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-plum-600 text-[0.6875rem] font-semibold text-white tabular-nums">
                  {i + 1}
                </span>
                <span>{rich(line)}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "platforms":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          {b.cards.map((card) => (
            <div
              key={card.name}
              className="overflow-hidden rounded-2xl border border-plum-900/10 bg-white/70"
            >
              <div
                className={`px-6 py-5 ${
                  card.tone === "tiktok"
                    ? "bg-gradient-to-r from-[#111] to-[#25203a] text-white"
                    : "bg-gradient-to-r from-[#c13584] to-[#e1306c] text-white"
                }`}
              >
                <p className="font-[family-name:var(--font-display)] text-xl">{card.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 p-5">
                {card.stats.map((s) => (
                  <div key={s.label} className="rounded-lg bg-plum-900/[0.04] p-3">
                    <p className="font-[family-name:var(--font-display)] text-xl text-plum-900">
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-[0.625rem] tracking-wide text-plum-900/50 uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="px-5 pb-5 text-[0.8125rem] leading-relaxed text-plum-900/70">
                <span className="font-semibold text-plum-900">Best for:</span> {card.bestFor}
              </p>
            </div>
          ))}
        </div>
      );

    case "phases":
      return (
        <div className="space-y-5">
          {b.items.map((ph) => (
            <div
              key={ph.title}
              className="rounded-xl border border-plum-700/15 bg-plum-700/[0.06] p-6"
            >
              <p className="font-[family-name:var(--font-display)] text-lg text-plum-900">
                {ph.title}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-plum-900/75">
                {rich(ph.text)}
              </p>
            </div>
          ))}
        </div>
      );

    case "faq":
      return (
        <div className="space-y-6">
          {b.items.map((f) => (
            <div key={f.q}>
              <p className="font-[family-name:var(--font-display)] text-[1.125rem] text-plum-900">
                Q: {f.q}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-plum-900/75">
                <span className="font-semibold text-plum-700">A:</span> {rich(f.a)}
              </p>
            </div>
          ))}
        </div>
      );

    case "calculator":
      return <ProfitCalculator />;

    case "quiz":
      return <PlatformQuiz questions={b.questions} />;

    default:
      return null;
  }
}
