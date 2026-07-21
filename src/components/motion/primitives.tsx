"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Beyond Lace motion system.
 *
 * The house rules, so motion reads as one hand rather than a pile of effects:
 *
 *  1. One expo-out curve everywhere. Luxury motion decelerates hard and settles;
 *     it never bounces and never eases linearly.
 *  2. Slow. 0.9–1.2s for anything structural. Fast motion reads as cheap.
 *  3. Distance is small. 16–28px. Big travel reads as a template.
 *  4. Sequence, don't swarm. Children stagger; they never arrive together.
 *  5. Every primitive collapses to a plain fade when the visitor asks for
 *     reduced motion.
 */

/** Expo-out. The single easing curve for the entire site. */
export const EASE = [0.16, 1, 0.3, 1] as const;

const DIRECTION_OFFSET = {
  up: { y: 26, x: 0 },
  down: { y: -26, x: 0 },
  left: { x: 26, y: 0 },
  right: { x: -26, y: 0 },
  none: { x: 0, y: 0 },
} as const;

export type RevealDirection = keyof typeof DIRECTION_OFFSET;

/**
 * Scroll-triggered entrance. Fires once, slightly before the element is fully
 * in view so content is already settling by the time the eye lands on it.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.95,
  className,
  once = true,
}: {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const offset = DIRECTION_OFFSET[direction];

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduced ? 0.4 : duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container. Wrap a list and give each child <StaggerItem> — they
 * arrive in sequence rather than as a block.
 */
export function Stagger({
  children,
  className,
  gap = 0.075,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds between each child. */
  gap?: number;
  delay?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0.02 : gap,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
}) {
  const reduced = useReducedMotion();
  const offset = DIRECTION_OFFSET[direction];

  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: reduced ? 0.4 : 0.9, ease: EASE },
    },
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/**
 * Display-type reveal. Splits on words and lifts each from behind a mask, so
 * the headline assembles itself rather than fading in as a block. This is the
 * single most effective way to make large type feel authored.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = "span",
  italicFrom,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3";
  /** Word index from which the remainder renders italic (the brand's second line). */
  italicFrom?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.08em" }}
        >
          <motion.span
            className={`inline-block ${italicFrom !== undefined && i >= italicFrom ? "italic" : ""}`}
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.055 }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Gold rule that draws itself across as it enters. Used as a section divider —
 * a static hairline is inert; a drawn one signals the section has begun.
 */
export function DrawRule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`h-px origin-left ${className}`}
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, var(--surface-rule) 12%, var(--surface-rule) 88%, transparent 100%)",
      }}
      initial={{ scaleX: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    />
  );
}

/**
 * Parallax wrapper. Moves its child against the scroll at a fraction of page
 * speed — depth without the seasick overshoot of a large offset.
 */
export function Parallax({
  children,
  className,
  strength = 40,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: strength * 0.5 }}
      whileInView={{ y: -strength * 0.5 }}
      viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1.6, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}
