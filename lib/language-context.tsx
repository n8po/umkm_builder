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
    // Timeline
    'timeline.title': 'Web Automation Innovation',
    'timeline.desc1': 'Transforming simple conversations into digital identities.',
    'timeline.desc2_part1': 'We are dedicated to helping Indonesian MSMEs have a professional appearance instantly through the power of',
    // About
    'about.whoWeAre.title': 'Who We Are',
    'about.whoWeAre.desc1': 'We are a team of innovators who believe that the future of web development is automation.',
    'about.whoWeAre.desc2': 'Efferd is not just a tool, but a smart assistant for your business.',
    'about.whatWeDo.title': 'What We Do',
    'about.whatWeDo.desc1': 'We turn abstract ideas into functional websites in seconds, without complex lines of code.',
    'about.whatWeDo.desc2': 'Just type your vision, and our AI will translate it into stunning layouts, content, and designs.',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'To be the fastest digital bridge for MSMEs to reach the global market.',
    // Testimonials
    'testimonials.label': 'Testimonials',
    'testimonials.title': 'What our users say',
    'testimonials.description': 'See what our customers have to say about us.',
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
    // Timeline
    'timeline.title': 'Inovasi Otomatisasi Web',
    'timeline.desc1': 'Mengubah percakapan sederhana menjadi identitas digital.',
    'timeline.desc2_part1': 'Kami berdedikasi membantu UMKM Indonesia memiliki tampilan profesional secara instan lewat kekuatan',
    // About
    'about.whoWeAre.title': 'Siapa Kami',
    'about.whoWeAre.desc1': 'Kami adalah tim inovator yang percaya bahwa masa depan pengembangan web adalah otomatisasi.',
    'about.whoWeAre.desc2': 'Efferd bukan sekadar tools, tapi asisten cerdas bagi bisnis Anda.',
    'about.whatWeDo.title': 'Apa yang kami Lakukan',
    'about.whatWeDo.desc1': 'Kami mengubah ide abstrak menjadi website fungsional dalam hitungan detik, tanpa baris kode yang rumit.',
    'about.whatWeDo.desc2': 'Cukup ketik visi Anda, dan AI kami akan menerjemahkannya menjadi layout, konten, dan desain yang memukau.',
    'about.vision.title': 'Visi Kami',
    'about.vision.desc': 'Menjadi jembatan digital tercepat bagi UMKM untuk menjangkau pasar global.',
    // Testimonials
    'testimonials.label': 'Testimonial',
    'testimonials.title': 'Apa kata pengguna kami',
    'testimonials.description': 'Lihat apa yang dikatakan pelanggan tentang kami.',
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
