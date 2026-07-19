"use client";

/** Shared form primitives — kit-styled inputs used by every RHF form. */

export const inputClass =
  "w-full border border-white/15 bg-transparent px-4 py-3 text-[0.9375rem] text-paper placeholder:text-neutral-400/60 focus:border-gold focus:outline-none transition-colors";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-[0.75rem] text-rose-400">
          {error}
        </span>
      )}
    </label>
  );
}

export function SubmitButton({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-gold bg-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-ink uppercase transition-all duration-500 hover:bg-transparent hover:text-gold disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Sending…" : children}
    </button>
  );
}

export function FormSuccess({ title, body }: { title: string; body: string }) {
  return (
    <div role="status" className="border border-gold/40 p-8 text-center">
      <p className="eyebrow mb-3 text-gold">Received</p>
      <h3 className="text-2xl text-paper">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-neutral-400">
        {body}
      </p>
    </div>
  );
}
