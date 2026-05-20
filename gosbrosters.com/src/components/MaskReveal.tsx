"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function MaskReveal({ children, className = "", delay = 0 }: MaskRevealProps) {
  return (
    <div className={`mask-reveal ${className}`}>
      <motion.div
        initial={{ translateY: "100%" }}
        whileInView={{ translateY: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
