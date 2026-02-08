"use client";

import {
  RippleButton,
  RippleButtonRipples,
} from '@/components/animate-ui/components/buttons/ripple';
import { NativeStartNow } from "@/components/uitripled/native-start-now-shadcnui";
import { motion, type Variants } from "framer-motion";
import { Rocket } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-[560px] w-full overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 30% 20%, rgba(129,140,248,0.06) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 70% 80%, rgba(244,114,182,0.05) 0%, transparent 50%)",
        }}
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center"
      >
        {/* Logo / Brand - top center */}
        <motion.div variants={itemVariants} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded">
            <Logo className="h-5 text-neutral-900" />
          </Link>
        </motion.div>

        {/* Headline - two lines, dark */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl font-heading"
        >
            From idea to online website in minutes.
        </motion.h1>

        {/* Optional subtext - minimal */}
        <motion.p
          variants={itemVariants}
          className="mb-10 max-w-xl text-base text-neutral-600 md:text-lg"
        >
          Build a professional MSME website with AI. No coding, no hassle.
        </motion.p>

        {/* CTAs - primary black + outline */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <NativeStartNow
            label="Get Started"
            size="lg"
            variant="solid"
            showShimmer={false}
            showRocket={false}
            onStart={async () => {
              router.push("#chat");
            }}
            className="gap-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
            icon={<Rocket className="h-4 w-4" aria-hidden />}
          />
          <RippleButton
            size="lg"
            variant="outline"
            className="h-14 px-8 rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-sm hover:bg-neutral-50 hover:border-neutral-300"
            asChild
          >
            <Link href="#use-cases">Explore use cases
            <RippleButtonRipples />
            </Link>
          </RippleButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
