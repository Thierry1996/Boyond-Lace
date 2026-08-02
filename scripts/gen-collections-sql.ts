/**
 * Generates supabase/migrations/0001_collections.sql from the canonical
 * collection registry, so the seeded rows always match the in-code source.
 *
 * Run: node --experimental-strip-types scripts/gen-collections-sql.ts
 *
 * The registry uses only `import type` (erased at runtime), so Node can strip
 * types and import it with no path-alias resolution.
 */
import { writeFileSync } from "node:fs";
import { collections } from "../src/lib/collections.ts";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const jsonb = (v: unknown) => (v == null ? "null" : `${q(JSON.stringify(v))}::jsonb`);
const txtOrNull = (s: string | undefined) => (s == null ? "null" : q(s));

const rows = collections
  .map((c, i) => {
    const vals = [
      q(c.slug),
      q(c.label),
      q(c.eyebrow),
      q(c.title),
      txtOrNull(c.titleItalic),
      q(c.tagline),
      q(c.cardImage),
      q(c.metaDescription),
      jsonb(c.query ?? null),
      txtOrNull(c.select),
      jsonb(c.refine ?? null),
      q(c.intro),
      jsonb(c.faqs),
      String(i),
    ];
    return `  (${vals.join(", ")})`;
  })
  .join(",\n");

const sql = `-- Beyond Lace — collections table + seed.
-- Generated from src/lib/collections.ts (scripts/gen-collections-sql.ts). Do not
-- edit the seed by hand; regenerate. Safe to run repeatedly (idempotent upsert).

create table if not exists public.collections (
  slug             text primary key,
  label            text not null,
  eyebrow          text not null,
  title            text not null,
  title_italic     text,
  tagline          text not null,
  card_image       text not null,
  meta_description text not null,
  query            jsonb,
  selection        text,
  refine           jsonb,
  intro            text not null,
  faqs             jsonb not null default '[]'::jsonb,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Public storefront data: anyone may read, no one may write via the anon key.
alter table public.collections enable row level security;
drop policy if exists "Public read collections" on public.collections;
create policy "Public read collections"
  on public.collections for select
  to anon, authenticated
  using (true);

insert into public.collections
  (slug, label, eyebrow, title, title_italic, tagline, card_image, meta_description,
   query, selection, refine, intro, faqs, sort_order)
values
${rows}
on conflict (slug) do update set
  label            = excluded.label,
  eyebrow          = excluded.eyebrow,
  title            = excluded.title,
  title_italic     = excluded.title_italic,
  tagline          = excluded.tagline,
  card_image       = excluded.card_image,
  meta_description = excluded.meta_description,
  query            = excluded.query,
  selection        = excluded.selection,
  refine           = excluded.refine,
  intro            = excluded.intro,
  faqs             = excluded.faqs,
  sort_order       = excluded.sort_order,
  updated_at       = now();
`;

writeFileSync(new URL("../supabase/migrations/0001_collections.sql", import.meta.url), sql);
console.log(`Wrote supabase/migrations/0001_collections.sql (${collections.length} collections)`);
