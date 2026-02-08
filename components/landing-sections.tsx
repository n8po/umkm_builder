"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { NativeFollowCursorArea } from "@/components/uitripled/native-follow-cursor";
import { Scrollspy } from "@/components/ui/scrollspy";
import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";

const productFeatures = [
  {
    title: "An AI IDE Core",
    description:
      "The editor offers tab autocompletion, natural language code commands, and a configurable, context-aware agent.",
  },
  {
    title: "Higher-level Abstractions",
    description:
      "A more intuitive task-based approach to monitoring agent activity, with essential artifacts and verification results to build trust.",
  },
  {
    title: "Cross-surface Agents",
    description:
      "Synchronized agentic control across your editor, terminal, and browser for powerful development workflows.",
  },
  {
    title: "User Feedback",
    description:
      "Intuitively integrate feedback across surfaces and artifacts to guide and refine the agent's work.",
  },
  {
    title: "An Agent-First Experience",
    description:
      "Manage multiple agents at the same time, across any workspace, from one central mission control view.",
  },
];

const useCases = [
  {
    title: "Business Cost Analysis",
    description:
      "Streamline UX development by leveraging browser-in-the-loop agents to automate repetitive tasks.",
    href: "#use-cases/analysis",
    label: "View case",
  },
  {
    title: "Business Discovery",
    description:
      "Build production-ready applications with confidence with thoroughly designed artifacts and comprehensive verification tests.",
    href: "#use-cases/discovery",
    label: "View case",
  },
];

export function ProductDemoSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Scroll animation - video MAXIMIZES on scroll down
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Video scale: starts at 1.0, grows to 1.35 (maximize)
  const scaleRaw = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1.15, 1.25]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.2, 0.5], [0.7, 0.9, 1]);
  
  // Smooth spring physics for buttery animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const scale = useSpring(scaleRaw, springConfig);
  const opacity = useSpring(opacityRaw, springConfig);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    
    if (isModalOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen]);

  return (
    <>
      <section ref={sectionRef} id="demo" className="relative w-full overflow-hidden bg-background py-20 md:py-32 min-h-screen">
        <div className="mx-auto px-4 md:px-8 lg:px-12 h-full flex flex-col items-center justify-center">          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              scale: scale,
              opacity: opacity,
            }}
            className="w-full max-w-6xl"
          >
            {/* GIF Preview - Click to open modal */}
            <NativeFollowCursorArea
              cursorContent={<><span className="text-black">▶</span> Play intro</>}
              size="md"
              variant="solid-white"
              showDot={false}
              className="w-full overflow-hidden rounded-3xl shadow-2xl cursor-none ring-1 ring-white/20"
            >
              <div 
                className="aspect-video w-full relative group cursor-none"
                onClick={handleOpenModal}
              >
                {/* GIF Preview */}
                <Image
                  src="/assets/gif/explainer_ai.gif"
                  alt="AI Demo Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </NativeFollowCursorArea>
          </motion.div>
        </div>
      </section>

      {/* Video Modal - Fullscreen Lightbox */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative w-full max-w-6xl mx-4 aspect-video rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* YouTube Embed or Video Player */}
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                title="Product Demo Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ProductFeaturesSection() {
  return (
    <section id="product" className="relative w-full overflow-hidden bg-black py-20 md:py-28 min-h-screen">
      <Scrollspy className="mx-auto max-w-7xl px-4" offset={100}>
        <div className="flex gap-8 lg:gap-16">
          {/* Sticky Sidebar Navigation */}
          <nav className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 space-y-2">
              {productFeatures.map((item, i) => (
                <button
                  key={item.title}
                  data-scrollspy-anchor={`feature-${i}`}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    text-gray-400 hover:text-white hover:bg-white/5
                    data-[active=true]:text-primary data-[active=true]:bg-white/10"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </nav>

          {/* Content Sections */}
          <div className="flex-1 space-y-32">
            {productFeatures.map((item, i) => (
              <motion.section
                key={item.title}
                id={`feature-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="min-h-[60vh] flex flex-col justify-center"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-lg text-gray-400 max-w-2xl mb-8">
                  {item.description}
                </p>
                
                {/* Placeholder for feature visual/demo */}
                <div className="aspect-video max-w-3xl rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Feature Demo {i + 1}</span>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </Scrollspy>
    </section>
  );
}

export function SpiritBusinessSection() {
  return (
    <section id="use-cases" className="relative w-full bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Build Your Brand. 
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Whether {"you're"} a professional in a large codebase, a hobbyist vibe-coding in your spare time, or anyone in between.
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
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-4 inline-flex items-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
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
    <section id="download" className="relative w-full overflow-hidden bg-background py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-20"
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
          className="text-7xl font-black tracking-tighter md:text-8xl lg:text-9xl"
          style={{ color: 'var(--brand-primary)' }}
        >
          UMKM-HUB
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 text-lg text-muted-foreground"
        >
          Build Your Brand. Manage Your Profits. Smarter.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
        </motion.div>
      </div>
    </section>
  );
}

