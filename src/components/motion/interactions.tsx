"use client";

import { motion, useMotionValue, useSpring, useReducedMotion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EASE } from "./primitives";

/**
 * Pointer-aware interactions.
 *
 * Every one of these is pointer-gated: on touch devices they render as inert
 * markup rather than firing on tap. Hover effects that trigger on touch are the
 * fastest way to make a premium site feel broken on a phone.
 */

/**
 * Magnetic element. Drifts toward the cursor as it approaches and springs back
 * on exit. Applied sparingly — primary CTAs only. On everything, it's a gimmick.
 */
export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 18, mass: 0.6 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        // Fine pointers only — a finger has no hover state to respond to.
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Subtle 3D tilt. The card leans toward the cursor, which gives a flat grid
 * physical presence. Rotation is capped low — past ~7deg it stops reading as
 * material and starts reading as a toy.
 */
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Infinite marquee. Two identical tracks scrolling in lockstep so the seam is
 * never visible. Pauses on hover so a reader can actually catch a word.
 */
export function Marquee({
  children,
  speed = 42,
  reverse = false,
  className = "",
  pauseOnHover = true,
}: {
  children: ReactNode;
  /** Seconds for one full pass. Higher = slower. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <div className={`group/marquee relative flex overflow-hidden ${className}`} aria-hidden="true">
      {[0, 1].map((track) => (
        <div
          key={track}
          className={`flex shrink-0 items-center ${
            pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : ""
          }`}
          style={
            reduced
              ? undefined
              : {
                  animation: `blMarquee ${speed}s linear infinite`,
                  animationDirection: reverse ? "reverse" : "normal",
                }
          }
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/**
 * Number that counts up when it scrolls into view. Static figures on a stats
 * band read as filler; a figure that resolves reads as data.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1600,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // Expo-out, matched to the site's easing curve.
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/**
 * Link whose underline draws from the left on hover and retracts on exit.
 * Replaces the default text-decoration, which is the single most template-like
 * detail on a page.
 */
export function DrawLink({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`group/draw relative inline-block ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/draw:origin-left group-hover/draw:scale-x-100"
      />
    </span>
  );
}

export { EASE };
