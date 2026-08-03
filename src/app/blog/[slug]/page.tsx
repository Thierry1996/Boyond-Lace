import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { BLOG_POSTS, getBlogPost, formatBlogDate } from "@/lib/blog";
import { EMAILS, URLS } from "@/lib/contact";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .filter((p) => p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <div className="bg-[#faf6f9] text-plum-900">
      <article className="mx-auto max-w-3xl px-[4vw] py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[0.75rem] font-medium tracking-[0.1em] text-plum-700 uppercase transition-colors hover:text-plum-500"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          Latest News
        </Link>

        <p className="mt-8 text-[0.6875rem] font-semibold tracking-[0.1em] text-plum-600 uppercase">
          {post.tags.join(", ")}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] text-plum-900">
          {post.title}
        </h1>
        <p className="mt-4 text-[0.8125rem] tracking-wide text-plum-900/45 tabular-nums">
          {formatBlogDate(post.date)}
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-plum-900/10">
          <BrandImage name={post.image} ratio="16 / 9" overlay={false} priority sizes="100vw" />
        </div>

        <div className="mt-10 space-y-6">
          {post.body.map((para, i) => (
            <p key={i} className="text-[1.0625rem] leading-[1.85] text-plum-900/80">
              {para}
            </p>
          ))}
        </div>

        {/* CTA — routes to the real desks */}
        <div className="mt-12 rounded-2xl border border-plum-700/20 bg-white/70 p-8 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl text-plum-900">
            Questions about your next unit?
          </p>
          <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-plum-900/60">
            Talk to a human — we answer product, wholesale, and care questions within 24 hours.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-plum-900 px-7 py-3.5 text-[0.75rem] font-medium tracking-[0.14em] text-blush-200 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-800"
            >
              Contact Us
              <ArrowRight size={14} strokeWidth={1.75} />
            </Link>
            <a
              href={URLS.whatsappPrefilled}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-plum-900/25 px-7 py-3.5 text-[0.75rem] font-medium tracking-[0.14em] text-plum-900 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-plum-700"
            >
              WhatsApp
            </a>
          </div>
          <p className="mt-4 text-[0.75rem] text-plum-900/45">
            Or email{" "}
            <a href={`mailto:${EMAILS.care}`} className="text-plum-700 underline underline-offset-2">
              {EMAILS.care}
            </a>
          </p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-plum-900/10 pt-10">
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-plum-700 uppercase">
              Keep reading
            </p>
            <div className="mt-6 grid gap-8 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                  <div className="overflow-hidden rounded-xl border border-plum-900/10">
                    <BrandImage
                      name={r.image}
                      ratio="4 / 3"
                      overlay={false}
                      sizes="(max-width:640px) 100vw, 30vw"
                      imgClassName="transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 text-[0.9375rem] leading-snug font-semibold text-plum-900 transition-colors group-hover:text-plum-600">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
