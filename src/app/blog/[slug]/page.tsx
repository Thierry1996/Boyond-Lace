import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Eye, Rocket, MessageCircle } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";
import { BLOG_POSTS, getBlogPost, formatBlogDate, tableOfContents } from "@/lib/blog";
import { URLS } from "@/lib/contact";

const SITE = "https://beyondlace.com";

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
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "Beyond Lace",
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();

  const toc = tableOfContents(post);
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .filter((p) => p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);
  const fallback = related.length
    ? related
    : BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: "Beyond Lace",
      url: SITE,
    },
    keywords: post.keywords.join(", "),
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
    articleSection: post.category,
  };

  return (
    <div className="bg-[#faf6f9] text-plum-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Title band */}
      <div className="mx-auto max-w-3xl px-[4vw] pt-14 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-plum-900">
          {post.title}
        </h1>
      </div>

      {/* Hero image — wide */}
      <div className="mx-auto mt-10 max-w-[1100px] px-[4vw]">
        <div className="overflow-hidden rounded-2xl border border-plum-900/10">
          <BrandImage name={post.image} ratio="21 / 9" overlay={false} priority sizes="100vw" />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-[4vw] py-12">
        {/* Meta card */}
        <div className="rounded-2xl bg-gradient-to-br from-plum-700/[0.06] to-blush-400/[0.12] p-7 sm:p-9">
          <span className="inline-block rounded-full bg-plum-600 px-3.5 py-1 text-[0.625rem] font-semibold tracking-[0.12em] text-white uppercase">
            {post.category}
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2rem)] leading-tight text-plum-900">
            {post.title}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-plum-900/55">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} strokeWidth={1.75} /> {formatBlogDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} strokeWidth={1.75} /> {post.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={13} strokeWidth={1.75} /> {post.views}
            </span>
          </div>
          <div className="mt-5 border-t border-plum-900/10 pt-5">
            <p className="text-[0.9375rem] font-semibold text-plum-900">{post.author.name}</p>
            <p className="text-[0.8125rem] text-plum-900/55">{post.author.role}</p>
          </div>
          <nav className="mt-4 flex items-center gap-1.5 text-[0.75rem] text-plum-900/45">
            <Link href="/" className="hover:text-plum-700">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-plum-700">
              Blog
            </Link>
            <span>/</span>
            <span className="text-plum-900/70">{post.category}</span>
          </nav>
        </div>

        {/* What You'll Learn — TOC */}
        {toc.length > 2 && (
          <div className="mt-10 rounded-2xl border border-plum-900/10 bg-white/70 p-7">
            <p className="mb-4 font-semibold text-plum-900">What You’ll Learn</p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="text-[0.875rem] text-plum-700 underline-offset-2 hover:underline"
                  >
                    {t.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Body */}
        <div className="mt-12">
          <BlogArticleBody blocks={post.blocks} />
        </div>

        {/* CTA band */}
        <div className="mt-14 overflow-hidden rounded-2xl bg-gradient-to-br from-plum-900 via-plum-800 to-plum-600 px-7 py-10 text-center">
          <p className="font-[family-name:var(--font-display)] text-[1.75rem] text-paper">
            Ready to Start Selling?
          </p>
          <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-blush-200/75">
            Join 500+ entrepreneurs building five-figure businesses with Beyond Lace wholesale. Low
            MOQ, factory-direct pricing, and dedicated support.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/wholesale#apply"
              className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-plum-900 uppercase transition-all duration-300 hover:-translate-y-0.5"
            >
              <Rocket size={14} strokeWidth={1.75} />
              Start Wholesale Account
            </Link>
            <a
              href={URLS.whatsappPrefilled}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-blush-200/40 px-7 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-blush-200 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold"
            >
              <MessageCircle size={14} strokeWidth={1.75} />
              Chat With Us
            </a>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-10 flex flex-wrap gap-2.5 border-t border-plum-900/10 pt-8">
          {post.tags.map((t) => (
            <Link
              key={t}
              href="/blog"
              className="rounded-full border border-plum-700/25 bg-plum-700/[0.05] px-3.5 py-1.5 text-[0.75rem] text-plum-700 transition-colors hover:bg-plum-700/[0.1]"
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Share */}
        <div className="mt-6 rounded-2xl border border-plum-900/10 bg-white/70 p-6">
          <ShareButtons title={post.title} />
        </div>
      </article>

      {/* Related */}
      {fallback.length > 0 && (
        <section className="bg-plum-700/[0.05] py-16">
          <div className="mx-auto max-w-[1100px] px-[4vw]">
            <h2 className="text-center font-[family-name:var(--font-display)] text-2xl text-plum-900">
              Related Articles
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {fallback.map((r) => (
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
                  <p className="mt-3 text-[0.625rem] font-semibold tracking-[0.1em] text-plum-600 uppercase">
                    {r.category}
                  </p>
                  <h3 className="mt-1 text-[0.9375rem] leading-snug font-semibold text-plum-900 transition-colors group-hover:text-plum-600">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-plum-900/55">
                    {r.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter band */}
      <section className="bg-gradient-to-r from-plum-900 to-plum-800 py-16">
        <div className="mx-auto max-w-2xl px-[4vw] text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.5vw,2.25rem)] text-paper">
            Get the Latest <span className="italic text-blush-300">Business Tips</span> in Your
            Inbox
          </h2>
          <p className="mx-auto mt-3 mb-7 max-w-md text-[0.9375rem] leading-relaxed text-blush-200/70">
            Guides, trends, and playbooks for building your hair business — no spam, unsubscribe
            anytime.
          </p>
          <BlogNewsletter slug={post.slug} />
        </div>
      </section>
    </div>
  );
}
