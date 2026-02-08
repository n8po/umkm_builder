"use client";

import Link from "next/link";
import {
  RippleButton,
  RippleButtonRipples,
} from '@/components/animate-ui/components/buttons/ripple';
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

import { Scrollspy } from "@/components/ui/scrollspy";

const productFeatures = [
  {
    title: "AI-Powered Website Builder",
    description:
      "Create a professional website for your business in minutes. Simply answer a few questions, and our AI will design the layout, content, and structure perfectly tailored to your brand.",
  },
  {
    title: "Cost & Break-Even Calculator",
    description:
      "Make business financial analysis effortless. Automatically calculate Cost of Goods Sold and Break-Even Point to determine optimal pricing and minimum sales targets.",
  },
  {
    title: "Location Discovery Map",
    description:
      "Integrated business location mapping. Help customers find your business easily and boost local visibility with location-based search features.",
  },
  {
    title: "One-Click Deploy & Publish",
    description:
      "Publish your website with a single click. Get a free subdomain (yourbusiness.loka.id) or connect your own custom domain. Your site goes live instantly and is ready for visitors.",
  },
];

const useCases = [
  {
    title: "Food & Beverage",
    description:
      "Restaurants, cafés, or catering services can create online menus, accept orders, and showcase their location with beautiful maps.",
    href: "#use-cases/food",
    label: "See example",
  },
  {
    title: "Fashion & Retail",
    description:
      "Clothing stores, accessories, or handmade crafts can display products in stunning galleries and connect to their marketplaces.",
    href: "#use-cases/retail",
    label: "See example",
  },
  {
    title: "Services & Freelance",
    description:
      "Photographers, designers, or consultants can showcase portfolios and receive client bookings directly from their website.",
    href: "#use-cases/services",
    label: "See example",
  },
];

export function ProductFeaturesSection() {
  const documentRef = useRef<Document>(typeof document !== 'undefined' ? document : null);
  
  return (
    <section id="product" className="relative w-full overflow-hidden bg-white py-20 md:py-32">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-neutral-900 max-w-2xl"
        >
          Build your professional website with AI-powered tools designed for small businesses.
        </motion.h2>
      </div>

      {/* Scrollspy Content */}
      <Scrollspy className="mx-auto max-w-6xl px-4" offset={200} targetRef={documentRef} history={false}>
        <div className="space-y-32 md:space-y-48">
          {productFeatures.map((item, i) => (
            <motion.div
              key={item.title}
              id={`feature-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
            >
              {/* Text Content - Left */}
              <div className="order-2 md:order-1">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              {/* Image/Demo - Right */}
              <div className="order-1 md:order-2">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-50 via-white to-yellow-50 border border-neutral-200 shadow-lg overflow-hidden flex items-center justify-center">
                  <div className="w-[90%] h-[85%] rounded-xl bg-white shadow-md border border-neutral-100 flex items-center justify-center">
                    <span className="text-neutral-400 text-sm">Feature Demo {i + 1}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Scrollspy>
    </section>
  );
}

export function BusinessSection() {
  return (
    <section id="use-cases" className="relative w-full bg-neutral-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Built for Every Small Business
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            Whether you run a local coffee shop, an online boutique, or a freelance service — we help you create a professional web presence without technical skills.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-neutral-900">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-neutral-600 leading-relaxed">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-4 inline-flex items-center text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                {item.label} →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section id="register" className="relative w-full overflow-hidden bg-white py-20 md:py-28">
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <RippleButton
            size="lg"
            className="gap-2 rounded-md bg-neutral-900 px-6 text-white hover:bg-neutral-800"
            asChild
          >
            <Link href="#register">
              <Rocket className="h-4 w-4" aria-hidden />
              Get Started
              <RippleButtonRipples/>
            </Link>
          </RippleButton>
        </motion.div>
      </div>
    </section>
  );
}
