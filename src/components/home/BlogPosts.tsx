import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { BLOG_POSTS, formatBlogDate } from "@/lib/blog";

/**
 * "Blog posts" — a home-page teaser cloned from a competitor editorial strip:
 * the four newest Media Center articles as image cards with title, byline, a
 * short excerpt and a Read-more link, each routing to /blog/[slug]. Given its
 * own warm plum-gradient ground so it reads as a distinct band between the
 * dark sections around it. Legible in light and dark via dark-island.
 */
export function BlogPosts() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  if (posts.length === 0) return null;

  return (
    <section
      aria-label="Blog posts"
      className="dark-island border-t border-white/[0.06] bg-gradient-to-br from-[#241019] via-plum-900 to-[#180a14] py-20"
    >
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-3 text-gold">The Media Center</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] text-paper">
              Blog posts
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 items-center gap-1.5 border-b border-gold pb-1 text-[0.75rem] tracking-[0.12em] text-gold uppercase transition-colors hover:text-gold-400 sm:inline-flex"
          >
            All articles
            <ArrowRight size={13} strokeWidth={1.75} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p) => (
            <article key={p.slug} className="group flex flex-col">
              <Link href={`/blog/${p.slug}`} className="block">
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/[0.08] transition-all duration-500 group-hover:ring-gold/40">
                  <BrandImage
                    name={p.image}
                    ratio="4 / 3"
                    overlay={false}
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    imgClassName="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.06]"
                  />
                </div>
              </Link>

              <h3 className="mt-5 text-[1.0625rem] leading-snug font-semibold text-paper transition-colors duration-300 group-hover:text-gold">
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h3>
              <p className="mt-2 text-[0.75rem] tracking-wide text-neutral-400 tabular-nums">
                By {p.author.name} · {formatBlogDate(p.date)}
              </p>
              <p className="mt-3 line-clamp-3 text-[0.875rem] leading-relaxed text-blush-200/70">
                {p.excerpt}
              </p>
              <Link
                href={`/blog/${p.slug}`}
                className="mt-4 inline-flex w-fit items-center gap-1.5 border-b border-gold/60 pb-0.5 text-[0.75rem] font-semibold tracking-[0.1em] text-gold uppercase transition-colors hover:border-gold"
              >
                Read more
                <ArrowRight
                  size={12}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
