"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import {
  TikTokGlyph,
  PinterestGlyph,
  InstagramGlyph,
  YouTubeGlyph,
} from "@/components/brand/SocialIcons";

/**
 * Linked creator accounts.
 *
 * Handles are captured and verified manually by the marketing division today.
 * Automatic metric sync requires Meta Graph API and TikTok Display API app
 * review — a platform approval process, not a code change — so the panel is
 * explicit that follower figures here are self-declared until that lands.
 */

interface Account {
  platform: "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "PINTEREST";
  label: string;
  handle: string | null;
  followers: number;
  verified: boolean;
}

const INITIAL: Account[] = [
  {
    platform: "INSTAGRAM",
    label: "Instagram",
    handle: "@yourhandle",
    followers: 24800,
    verified: true,
  },
  { platform: "TIKTOK", label: "TikTok", handle: "@yourhandle", followers: 41200, verified: true },
  { platform: "YOUTUBE", label: "YouTube", handle: null, followers: 0, verified: false },
  { platform: "PINTEREST", label: "Pinterest", handle: null, followers: 0, verified: false },
];

function Mark({ platform }: { platform: Account["platform"] }) {
  const cls = "text-gold";
  if (platform === "INSTAGRAM") return <InstagramGlyph size={18} className={cls} />;
  if (platform === "TIKTOK") return <TikTokGlyph size={18} className={cls} />;
  if (platform === "YOUTUBE") return <YouTubeGlyph size={18} className={cls} />;
  return <PinterestGlyph size={18} className={cls} />;
}

export function LinkedAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const totalReach = accounts.reduce((sum, a) => sum + a.followers, 0);

  function save(platform: string) {
    setAccounts((list) =>
      list.map((a) =>
        a.platform === platform ? { ...a, handle: draft || null, verified: false } : a,
      ),
    );
    setEditing(null);
    setDraft("");
  }

  return (
    <div className="space-y-10">
      <div className="rounded-xl border border-gold/30 bg-plum-900/50 p-6">
        <p className="eyebrow mb-2 text-gold">Combined reach</p>
        <p className="font-[family-name:var(--font-display)] text-3xl text-paper tabular-nums">
          {totalReach.toLocaleString()}
        </p>
        <p className="mt-2 text-[0.75rem] text-blush-200/70">
          Cross 100,000 on any single linked platform and you are reviewed for Tier 2 automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((a) => (
          <div
            key={a.platform}
            className="rounded-xl border border-white/[0.07] p-6 transition-colors duration-400 hover:border-gold/50"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <Mark platform={a.platform} />
                <span className="text-[0.9375rem] text-paper">{a.label}</span>
              </span>
              {a.verified && (
                <span className="flex items-center gap-1 text-[0.625rem] tracking-[0.1em] text-gold uppercase">
                  <Check size={11} /> Verified
                </span>
              )}
            </div>

            {editing === a.platform ? (
              <div className="mt-5 flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="@handle"
                  className="min-w-0 flex-1 border border-white/15 bg-transparent px-3 py-2 text-[0.875rem] text-paper placeholder:text-neutral-400/50 focus:border-gold focus:outline-none"
                />
                <button
                  onClick={() => save(a.platform)}
                  className="border border-gold px-4 text-[0.6875rem] tracking-[0.1em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink"
                >
                  Save
                </button>
              </div>
            ) : a.handle ? (
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.875rem] text-neutral-200">{a.handle}</p>
                  <p className="text-[0.75rem] text-neutral-400 tabular-nums">
                    {a.followers.toLocaleString()} followers
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditing(a.platform);
                    setDraft(a.handle ?? "");
                  }}
                  className="text-[0.6875rem] tracking-[0.1em] text-gold uppercase hover:opacity-75"
                >
                  Edit
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditing(a.platform);
                  setDraft("");
                }}
                className="mt-5 flex items-center gap-2 text-[0.75rem] tracking-[0.1em] text-gold uppercase hover:opacity-75"
              >
                <Plus size={12} strokeWidth={1.75} />
                Link account
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.07] p-6">
        <p className="eyebrow mb-2">How verification works</p>
        <p className="text-[0.875rem] leading-relaxed text-neutral-400">
          Handles are checked by hand against your public profile within two business days.
          Automatic follower and engagement sync requires Meta and TikTok platform approval — until
          that is granted, the figures above are self-declared and reconciled against your tracked
          affiliate link performance, which we can measure independently.
        </p>
      </div>
    </div>
  );
}
