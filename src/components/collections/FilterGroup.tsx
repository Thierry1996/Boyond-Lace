import { ChevronDown } from "lucide-react";

/**
 * Collapsible filter group. Uses a native <details>/<summary> so it toggles
 * without any client JS — safe to render inside the server-component filter
 * rails on both the shop and collection pages. Open by default; click the
 * header to collapse. The chevron rotates via the `open:` state.
 */
export function FilterGroup({
  label,
  defaultOpen = true,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-white/[0.07] py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
        <span className="eyebrow">{label}</span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          aria-hidden="true"
          className="text-neutral-400 transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
