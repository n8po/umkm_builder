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
    // Product links
    'product.websiteBuilder.title': 'Website Builder',
    'product.websiteBuilder.description': 'Create responsive websites with ease',
    'product.cloudPlatform.title': 'Cloud Platform',
    'product.cloudPlatform.description': 'Deploy and scale apps in the cloud',
    'product.analytics.title': 'Analytics',
    'product.analytics.description': 'Track and analyze your website traffic',
    // Company links
    'company.aboutUs.title': 'About Us',
    'company.aboutUs.description': 'Learn more about our story and team',
    'company.customerStories.title': 'Customer Stories',
    'company.customerStories.description': "See how we've helped our clients succeed",
    'company.terms': 'Terms of Service',
    'company.privacy': 'Privacy Policy',
    'company.refund': 'Refund Policy',
    // Home
    'home.welcome': 'Welcome',
    'home.description': 'This is a demo layout. Add your content here.',
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
    // Product links
    'product.websiteBuilder.title': 'Pembuat Website',
    'product.websiteBuilder.description': 'Buat website responsif dengan mudah',
    'product.cloudPlatform.title': 'Platform Cloud',
    'product.cloudPlatform.description': 'Deploy dan scaling aplikasi di cloud',
    'product.analytics.title': 'Analitik',
    'product.analytics.description': 'Lacak dan analisis traffic website Anda',
    // Company links
    'company.aboutUs.title': 'Tentang Kami',
    'company.aboutUs.description': 'Pelajari lebih lanjut tentang cerita dan tim kami',
    'company.customerStories.title': 'Cerita Pelanggan',
    'company.customerStories.description': 'Lihat bagaimana kami membantu kesuksesan klien kami',
    'company.terms': 'Syarat Layanan',
    'company.privacy': 'Kebijakan Privasi',
    'company.refund': 'Kebijakan Pengembalian Dana',
    // Home
    'home.welcome': 'Selamat Datang',
    'home.description': 'Ini adalah layout demo. Tambahkan konten Anda di sini.',
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
