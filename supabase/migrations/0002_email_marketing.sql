-- Beyond Lace — spin-wheel marketing capture.
-- Adds the lead columns to the existing table and locks RLS down so the public
-- (publishable key) can INSERT a lead but cannot read anyone else's — the
-- marketing desk reads rows from the Supabase dashboard (service role bypasses
-- RLS). Safe to run repeatedly.
--
-- Run in the Supabase SQL editor, or via the project MCP after `claude /mcp`.

alter table public."Beyond-Lace email-marketing"
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists consent_marketing boolean not null default false,
  add column if not exists consent_terms boolean not null default false,
  add column if not exists prize text,
  add column if not exists source text,
  add column if not exists page_path text,
  add column if not exists user_agent text;

-- Write-only for the public: anyone may submit a lead, no one may read them back
-- with the anon key.
alter table public."Beyond-Lace email-marketing" enable row level security;

drop policy if exists "Public insert leads" on public."Beyond-Lace email-marketing";
create policy "Public insert leads"
  on public."Beyond-Lace email-marketing" for insert
  to anon, authenticated
  with check (true);

-- Deliberately NO select/update/delete policy, so leads are readable only via
-- the dashboard or a service-role key.
