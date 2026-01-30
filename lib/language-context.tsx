"use client";
import React, { createContext, useContext, useState } from 'react';

type Locale = 'en' | 'id';

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
} | undefined>(undefined);

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.product': 'Product',
    'nav.company': 'Company',
    'nav.pricing': 'Pricing',
    // Buttons
    'buttons.signIn': 'Sign In',
    'buttons.getStarted': 'Get Started',
    'buttons.seeHowItWorks': 'See How It Works',
    // Product links
    'product.websiteBuilder.title': 'Website Builder',
    'product.websiteBuilder.description': 'Create a website for your product responsively and easily',
    'product.cloudPlatform.title': 'Deploy Website',
    'product.cloudPlatform.description': 'Publish your site to the internet',
    'product.analytics.title': 'Analytics',
    'product.analytics.description': 'Conventional and Contemporary Cost Accounting',
    // Company links
    'company.aboutUs.title': 'About Us',
    'company.aboutUs.description': 'Learn more about our story and team',
    'company.customerStories.title': 'Customer Stories',
    'company.customerStories.description': "See how we've helped our clients succeed",
    'company.terms': 'Terms of Service',
    'company.privacy': 'Privacy Policy',
    'company.refund': 'Refund Policy',
    // Home
    'home.welcome': 'Creating an MSME website is as easy as sending a chat',
    'home.description': 'Write an idea, choose a category, and your website will be online. Let AI do the work for you.',
    // AI Prompt
    'home.aiPromptPlaceholder': 'Looking for quick answers or personalized?',
    // Languages
    'lang.english': 'English',
    'lang.indonesian': 'Bahasa Indonesia',
  },
  id: {
    // Navigation
    'nav.product': 'Produk',
    'nav.company': 'Perusahaan',
    'nav.pricing': 'Harga',
    // Buttons
    'buttons.signIn': 'Masuk',
    'buttons.getStarted': 'Mulai Sekarang',
    'buttons.seeHowItWorks': 'Lihat Cara Kerjanya',
    // Product links
    'product.websiteBuilder.title': 'Pembuat Website',
    'product.websiteBuilder.description': 'Buat website untuk produk anda dengan responsif dan mudah',
    'product.cloudPlatform.title': 'Publish Website',
    'product.cloudPlatform.description': 'Publikasiakan situs anda ke internet',
    'product.analytics.title': 'Analitik',
    'product.analytics.description': 'Akutansi biaya konvesional dan Kontemporer',
    // Company links
    'company.aboutUs.title': 'Tentang Kami',
    'company.aboutUs.description': 'Pelajari lebih lanjut tentang cerita dan tim kami',
    'company.customerStories.title': 'Cerita Pelanggan',
    'company.customerStories.description': 'Lihat bagaimana kami membantu kesuksesan klien kami',
    'company.terms': 'Syarat Layanan',
    'company.privacy': 'Kebijakan Privasi',
    'company.refund': 'Kebijakan Pengembalian Dana',
    // Home
    'home.welcome': 'Bikin Website UMKM Semudah Kirim Chat',
    'home.description': 'Tulis ide, pilih kategori, website langsung online. Biarkan AI yang bekerja untukmu.',
    // AI Prompt
    'home.aiPromptPlaceholder': 'Ketik jawaban instan & personal?',
    // Languages
    'lang.english': 'English',
    'lang.indonesian': 'Bahasa Indonesia',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
