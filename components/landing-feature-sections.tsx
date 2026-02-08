"use client";

import Link from "next/link";
import {
  RippleButton,
  RippleButtonRipples,
} from '@/components/animate-ui/components/buttons/ripple';
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";

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
    title: "Frontend developer",
    description:
      "Streamline UX development by leveraging browser-in-the-loop agents to automate repetitive tasks.",
    href: "#use-cases/frontend",
    label: "View case",
  },
  {
    title: "Full stack developer",
    description:
      "Build production-ready applications with confidence with thoroughly designed artifacts and comprehensive verification tests.",
    href: "#use-cases/fullstack",
    label: "View case",
  },
  {
    title: "Enterprise developer",
    description:
      "Streamline operations and reduce context switching by orchestrating agents across workspaces using the Agent Manager.",
    href: "#use-cases/enterprise",
    label: "View case",
  },
];

export function ProductFeaturesSection() {
  return (
    <section id="product" className="relative w-full overflow-hidden bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Built for the agent-first era
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            Evolve the IDE into an agentic development platform with trust and control at the center.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productFeatures.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-neutral-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
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
            Built for developers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            Whether you&apos;re a professional in a large codebase, a hobbyist vibe-coding in your spare time, or anyone in between.
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
