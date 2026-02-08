"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FeatureSection } from "@/components/feature-section";
import { motion } from "framer-motion";

export default function MapPage() {
  return (
    <>
      <Header />
      <main className="pt-14">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Discover Local Businesses
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Find and connect with MSMEs in your area. Explore our map to discover restaurants, shops, and services near you.
            </p>
          </div>
        </section>

        {/* Map Feature Section */}
        <FeatureSection />

        {/* CTA Section */}
        <section className="relative w-full overflow-hidden bg-white py-20 md:py-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden
            style={{
              backgroundImage: `radial-gradient(circle at center, rgb(100 116 139) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl"
            >
              LOKA
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-lg text-neutral-600"
            >
              For Your Brand. Manage Your Profits. Smarter.
            </motion.p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
