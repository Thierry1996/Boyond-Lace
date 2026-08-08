-- Beyond Lace — shop-by-intention categories table + seed.
-- Mirrors src/lib/intention-categories.ts. Safe to run repeatedly (idempotent
-- upsert). These are the merchandising circles on /shop-by-intentions; each
-- routes to an existing collection, a pre-filtered /shop view, or a hub.

create table if not exists public.intention_categories (
  slug        text primary key,
  label       text not null,
  eyebrow     text not null,
  image       text not null,
  href        text not null,
  count       integer,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Public storefront data: anyone may read, no one may write via the anon key.
alter table public.intention_categories enable row level security;
drop policy if exists "Public read intention_categories" on public.intention_categories;
create policy "Public read intention_categories"
  on public.intention_categories for select
  to anon, authenticated
  using (true);

-- Trim the wall: drop the redundant-destination / weak buckets so any DB that
-- ran the earlier 21-row version matches the tightened seed below.
delete from public.intention_categories
where slug in (
  'currently-trending', 'crochet-braids', 'headband-wigs',
  'colour-highlighted-curly-fringe', 'accessories', 'flash-sales',
  'below-250', 'clearance-samples', 'hair-masterclasses', 'all-products'
);

insert into public.intention_categories
  (slug, label, eyebrow, image, href, count, sort_order)
values
  ('premium-wigs', 'Premium Wigs', 'The signature line', 'plum', '/shop?line=luxe', 1200, 0),
  ('premium-double-drawn-wigs', 'Premium Double Drawn Wigs', 'Root-to-tip fullness', 'gold', '/shop?line=luxe&sort=price-desc', 700, 1),
  ('top-tier-favourites', 'Top-Tier Favourites', 'Most loved', 'gold', '/shop?sort=rating', 104, 2),
  ('wear-go-straight-wigs', 'Wear & Go (Glueless) Straight Wigs', 'Wear & go', 'velvet', '/shop?fit=glueless-wear-go&texture=straight', 77, 3),
  ('glueless-curly-units', 'Glueless Curly Units', 'Wear & go curls', 'plum', '/shop?fit=glueless-wear-go&texture=kinky-curly', 100, 4),
  ('curly-full-frontal-wigs', 'Curly Full Frontal Wigs', 'Defined curls', 'velvet', '/shop?lace=hd-swiss-full&texture=kinky-curly', 512, 5),
  ('fringe-bob-pixie', 'Fringe Bob & Pixie Cut', 'Short & sharp', 'blush', '/shop?texture=straight', 782, 6),
  ('combos', 'Combos', 'Buy together, save', 'plum', '/shop?line=bundle', 198, 7),
  ('extensions-and-bundles', 'Extensions & Bundles', 'Build your install', 'mono', '/shop?line=bundle', 3120, 8),
  ('maintenance-accessories', 'Maintenance & Wig Accessories', 'Care & tools', 'mono', '/shop?line=care', 700, 9),
  ('anniversary-sale', '10 Year Anniversary Sale', 'Limited time', 'blush', '/shop?sort=price-asc', 900, 10)
on conflict (slug) do update set
  label      = excluded.label,
  eyebrow    = excluded.eyebrow,
  image      = excluded.image,
  href       = excluded.href,
  count      = excluded.count,
  sort_order = excluded.sort_order,
  updated_at = now();
