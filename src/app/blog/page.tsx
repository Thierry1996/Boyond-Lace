import type { Metadata } from "next";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Latest News",
  description:
    "The Beyond Lace Media Center — guides, trends, and business playbooks on luxury human-hair wigs, HD lace, wig care, and building a hair brand.",
};

export default function BlogPage() {
  return (
    <div className="bg-[#faf6f9] text-plum-900">
      <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
        <header className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,3.25rem)] text-plum-900">
            Latest News
          </h1>
          <p className="mt-3 text-[0.9375rem] text-plum-900/55">
            Welcome to the Beyond Lace Media Center
          </p>
        </header>

        <div className="mt-16">
          <BlogGrid posts={BLOG_POSTS} />
        </div>
      </div>
    </div>
  );
}
