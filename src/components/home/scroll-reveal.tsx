"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}

export function ScrollReveal({ children, delay = 0, className, direction = "up" }: Props) {
  const initial =
    direction === "up"    ? { opacity: 0, y: 28 }  :
    direction === "left"  ? { opacity: 0, x: -28 } :
    direction === "right" ? { opacity: 0, x: 28 }  :
                            { opacity: 0 };

  const animate =
    direction === "up"    ? { opacity: 1, y: 0 }  :
    direction === "left"  ? { opacity: 1, x: 0 }  :
    direction === "right" ? { opacity: 1, x: 0 }  :
                            { opacity: 1 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children animate in sequence */
export function StaggerReveal({
  children,
  className,
  style,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
