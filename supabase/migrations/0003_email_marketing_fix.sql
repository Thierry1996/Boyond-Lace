-- Beyond Lace — normalise the marketing-capture table.
--
-- The live table shipped with `phone` typed NUMERIC, which cannot store a real
-- phone number ("+234 8012345678" — country code, plus sign, spaces). This makes
-- `phone` TEXT and guarantees every lead column exists with the right type.
-- Idempotent: safe to run repeatedly, and safe whether or not 0002 was applied.
--
-- Run in the Supabase SQL editor, or via the project MCP after `claude /mcp`.

-- Ensure the columns exist (adds `phone` as text only if it is missing).
alter table public."Beyond-Lace email-marketing"
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists phone_country text,
  add column if not exists consent_marketing boolean not null default false,
  add column if not exists consent_terms boolean not null default false,
  add column if not exists prize text,
  add column if not exists source text,
  add column if not exists page_path text,
  add column if not exists user_agent text;

-- Convert an existing NUMERIC phone column to TEXT (no-op if already text).
alter table public."Beyond-Lace email-marketing"
  alter column phone type text using phone::text;

-- Write-only for the public: anyone may submit a lead, no one may read them back
-- with the anon key. The marketing desk reads via the dashboard/service role.
alter table public."Beyond-Lace email-marketing" enable row level security;
drop policy if exists "Public insert leads" on public."Beyond-Lace email-marketing";
create policy "Public insert leads"
  on public."Beyond-Lace email-marketing" for insert
  to anon, authenticated
  with check (email is not null and char_length(email) between 3 and 320);

-- Applied to the live project via the Supabase MCP on 2026-08-02.
