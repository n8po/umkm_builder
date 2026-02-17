"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { FeatureIllustration, FeatureType } from "@/components/example-product";
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

const useCases: {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  label: string;
  color: string;
  type: FeatureType;
}[] = [
  {
    title: "Food & Beverage",
    subtitle: "Deliciously Online.",
    description:
      "Restaurants, cafés, or catering services can create online menus, accept orders, and showcase their location with beautiful maps.",
    href: "#use-cases/food",
    label: "See example",
    color: "from-orange-100 to-orange-50",
    type: "food",
  },
  {
    title: "Fashion & Retail",
    subtitle: "Style Showcased.",
    description:
      "Clothing stores, accessories, or handmade crafts can display products in stunning galleries and connect to their marketplaces.",
    href: "#use-cases/retail",
    label: "See example",
    color: "from-purple-100 to-purple-50",
    type: "fashion",
  },
  {
    title: "Services & Freelance",
    subtitle: "Portfolio Ready.",
    description:
      "Photographers, designers, or consultants can showcase portfolios and receive client bookings directly from their website.",
    href: "#use-cases/services",
    label: "See example",
    color: "from-blue-100 to-blue-50",
    type: "service",
  },
];

export function ProductFeaturesSection() {
  const documentRef = useRef<Document>(
    typeof document !== "undefined" ? document : null
  );

  return (
    <section
      id="product"
      className="relative w-full overflow-hidden bg-white py-20 md:py-32"
    >
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-neutral-900 max-w-2xl"
        >
          Build your professional website with AI-powered tools designed for
          small businesses.
        </motion.h2>
      </div>

      {/* Scrollspy Content */}
      <Scrollspy
        className="mx-auto max-w-6xl px-4"
        offset={200}
        targetRef={documentRef}
        history={false}
      >
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
              {/* Text Content */}
              <div className="order-2 md:order-1">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Demo Box */}
              <div className="order-1 md:order-2">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-50 via-white to-yellow-50 border border-neutral-200 shadow-lg overflow-hidden flex items-center justify-center">
                  <div className="w-[90%] h-[85%] rounded-xl bg-white shadow-md border border-neutral-100 flex items-center justify-center">
                    <span className="text-neutral-400 text-sm">
                      Feature Demo {i + 1}
                    </span>
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="use-cases"
      className="relative w-full bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 md:text-right"
        >
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            Here's how you get
            <br />
            going.
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-4 md:h-[420px]">
          {useCases.map((item, i) => {
            const isHovered = hoveredIndex === i;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  relative flex flex-col rounded-3xl bg-gradient-to-b ${item.color} 
                  p-6 transition-all duration-500 ease-out cursor-pointer overflow-hidden
                  ${isHovered ? "md:flex-[2]" : "md:flex-1"}
                  min-h-[280px] md:min-h-0
                `}
              >
                {/* Title */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-lg font-medium text-neutral-700">
                    {item.subtitle}
                  </p>
                </div>

                {/* Description */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    height: isHovered ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6 md:mb-4">
                    {item.description}
                  </p>
                </motion.div>

                <div className="flex-1" />

                {/* Illustration */}
                <div className="flex justify-center items-end mb-4 mt-6 md:mt-0 aspect-[5/3] min-h-24 w-full">
                  <FeatureIllustration
                    type={item.type}
                    priority={i === 0}
                    className="w-full max-w-[500px] md:max-w-[280px] lg:max-w-[320px] aspect-[4/3] object-contain drop-shadow-lg transition-transform duration-300 md:group-hover:scale-95 mx-auto"
                  />
                </div>

                {/* Button */}
                <div className="flex justify-end">
                  <Link
                    href={item.href}
                    className={`
                      flex items-center justify-center rounded-full 
                      border border-neutral-300 bg-white/80 backdrop-blur-sm
                      transition-all duration-300 hover:bg-white hover:scale-105
                      ${isHovered ? "px-4 py-2 gap-2" : "w-10 h-10"}
                    `}
                  >
                    {isHovered ? (
                      <>
                        <span className="text-sm font-medium text-neutral-900">
                          {item.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-neutral-700" />
                      </>
                    ) : (
                      <Plus className="w-5 h-5 text-neutral-700" />
                    )}
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section
      id="register"
      className="relative w-full overflow-hidden bg-white py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgb(100 116 139) 1px, transparent 1px)",
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
  );
}
