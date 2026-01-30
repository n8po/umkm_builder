"use client";

import { useLanguage } from "@/lib/language-context";

export function DemoLayout() {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t('home.welcome')}</h1>
          <p className="mt-4 text-muted-foreground">
            {t('home.description')}
          </p>
        </div>
      </div>
    </main>
  );
}
