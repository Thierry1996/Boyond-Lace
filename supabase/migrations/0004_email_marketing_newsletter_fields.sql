-- Beyond Lace — newsletter subscriber fields on the marketing-capture table.
--
-- The /contact "Join the Beyond Circle" form captures more than the spin-wheel:
-- a name, a self-declared role, and per-channel marketing preferences. These
-- nullable columns hold that context alongside the existing lead columns.
-- Idempotent: safe to run repeatedly, and additive only (no existing column or
-- policy is altered, so the spin-wheel capture keeps working unchanged).
--
-- Run in the Supabase SQL editor, or via the project MCP after `claude /mcp`.

alter table public."Beyond-Lace email-marketing"
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists role text,
  add column if not exists marketing_prefs text;

-- Applied to the live project via the Supabase MCP on 2026-08-04.
