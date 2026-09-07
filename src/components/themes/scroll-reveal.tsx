"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 42, filter: "blur(7px)" }} transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, amount: 0.18 }} whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}>{children}</motion.div>;
}
