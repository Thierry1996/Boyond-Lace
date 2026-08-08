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

insert into public.intention_categories
  (slug, label, eyebrow, image, href, count, sort_order)
values
  ('premium-wigs', 'Premium Wigs', 'The signature line', 'plum', '/shop?line=luxe', 1200, 0),
  ('premium-double-drawn-wigs', 'Premium Double Drawn Wigs', 'Root-to-tip fullness', 'gold', '/shop?line=luxe&sort=price-desc', 700, 1),
  ('top-tier-favourites', 'Top-Tier Favourites', 'Most loved', 'gold', '/shop?sort=rating', 104, 2),
  ('currently-trending', 'Currently Trending', 'Moving fast', 'aurora', '/shop?sort=rating', 612, 3),
  ('wear-go-straight-wigs', 'Wear & Go (Glueless) Straight Wigs', 'Wear & go', 'velvet', '/shop?fit=glueless-wear-go&texture=straight', 77, 4),
  ('glueless-curly-units', 'Glueless Curly Units', 'Wear & go curls', 'plum', '/shop?fit=glueless-wear-go&texture=kinky-curly', 100, 5),
  ('curly-full-frontal-wigs', 'Curly Full Frontal Wigs', 'Defined curls', 'velvet', '/shop?lace=hd-swiss-full&texture=kinky-curly', 512, 6),
  ('fringe-bob-pixie', 'Fringe Bob & Pixie Cut', 'Short & sharp', 'blush', '/shop?texture=straight', 782, 7),
  ('crochet-braids', 'Crochet Braids', 'Protective styles', 'velvet', '/shop?texture=kinky-curly', 698, 8),
  ('headband-wigs', 'Headband Wigs', 'Five-minute, no lace', 'plum', '/shop?fit=glueless-wear-go', 683, 9),
  ('colour-highlighted-curly-fringe', 'Colour: Double Drawn Highlighted Curly Fringe', 'Fashion colour', 'blush', '/shop?shade=honey-balayage', null, 10),
  ('combos', 'Combos', 'Buy together, save', 'plum', '/shop?line=bundle', 198, 11),
  ('extensions-and-bundles', 'Extensions & Bundles', 'Build your install', 'mono', '/shop?line=bundle', 3120, 12),
  ('maintenance-accessories', 'Maintenance & Wig Accessories', 'Care & tools', 'mono', '/shop?line=care', 700, 13),
  ('accessories', 'Accessories', 'Tools & care', 'mono-2', '/shop?line=care', 542, 14),
  ('anniversary-sale', '10 Year Anniversary Sale', 'Limited time', 'blush', '/shop?sort=price-asc', 900, 15),
  ('flash-sales', 'Flash Sales', 'While stocks last', 'blush', '/shop?sort=price-asc', 83, 16),
  ('below-250', 'Below $250', 'Under budget', 'gold', '/shop?sort=price-asc', 450, 17),
  ('clearance-samples', 'Clearance: Pre-tested Samples', 'Lace cut units', 'mono', '/shop?sort=price-asc', 340, 18),
  ('hair-masterclasses', 'The Beyond Lace Hair Masterclasses', 'Learn the craft', 'mono-2', '/learn', 8, 19),
  ('all-products', 'All Products', 'The whole floor', 'mono-2', '/shop', 7860, 20)
on conflict (slug) do update set
  label      = excluded.label,
  eyebrow    = excluded.eyebrow,
  image      = excluded.image,
  href       = excluded.href,
  count      = excluded.count,
  sort_order = excluded.sort_order,
  updated_at = now();
