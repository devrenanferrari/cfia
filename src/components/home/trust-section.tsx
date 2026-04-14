"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "IBM", logo: "IBM" },
  { name: "Microsoft", logo: "MSFT" },
  { name: "NVIDIA", logo: "NVDA" },
  { name: "Google", logo: "GOOG" },
  { name: "Meta", logo: "META" },
  { name: "OpenAI", logo: "OAI" },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-white overflow-hidden border-y border-gray-100">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-10">
          LÍDERES TÉCNICOS DE GRANDES EMPRESAS ESTÃO CONOSCO
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-2xl font-black tracking-tighter text-gray-900"
            >
              {partner.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
