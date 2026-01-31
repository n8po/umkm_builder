"use client";

import React from "react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
    hoverClass?: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram", hoverClass: "hover:text-pink-500 dark:hover:text-pink-400" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook", hoverClass: "hover:text-blue-600 dark:hover:text-blue-500" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter", hoverClass: "hover:text-sky-500 dark:hover:text-sky-400" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn", hoverClass: "hover:text-blue-700 dark:hover:text-blue-600" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

import { useLanguage } from "@/lib/language-context";

export const Footer = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://www.shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "UMKM-Builder.cloud",
  },
  socialLinks = defaultSocialLinks,
  copyright = "© 2026 UMKM-Builder.cloud. All rights reserved.",
  legalLinks = defaultLegalLinks,
  // Note: sections and description props are handled inside to support translation defaults
  sections,
  description,
}: FooterProps) => {
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Or return a skeleton/loading state matching server output structure if strict SEO is needed, but null wraps it safely for now
  }

  const effectiveDescription = description || t('footer.description');
  
  const defaultSectionsTranslated = [
    {
      title: t('nav.product'),
      links: [
        { name: t('nav.overview'), href: "#" },
        { name: t('nav.pricing'), href: "#" },
        { name: t('nav.features'), href: "#" },
      ],
    },
    {
      title: t('nav.company'),
      links: [
        { name: t('company.aboutUs.title'), href: "#" },
        { name: t('testimonials.label'), href: "#" },
      ],
    },
  ];

  const effectiveSections = sections || defaultSectionsTranslated;

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
              </a>
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </div>
            <p className="max-w-[70%] text-sm text-muted-foreground">
              {effectiveDescription}
            </p>
            <ul className="flex items-center space-x-6 text-muted-foreground">
              {socialLinks.map((social, idx) => (
                <li key={idx} className={`font-medium transition-colors ${social.hoverClass || "hover:text-primary"}`}>
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {effectiveSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

