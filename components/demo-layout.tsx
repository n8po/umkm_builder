"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";

export function DemoLayout() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen">
      {/* Hero Content Container */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center place-items-center min-h-[80vh]">
          {/* Left Column - Text Content */}
          <div className="flex flex-col space-y-6 w-full max-w-xl">
            {/* Badge */}
            <div className="inline-flex w-fit items-center rounded-full bg-blue-100 dark:bg-blue-950 px-4 py-1.5">
              <Sparkles className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                AI-Powered Website Builder
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {t('home.welcome')}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground md:text-xl">
              {t('home.description')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t('buttons.getStarted')}
              </Button>
              <Button size="lg" variant="outline">
                {t('buttons.seeHowItWorks')}
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            {/* AI Prompt Input */}
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-2 rounded-full border bg-background p-2 shadow-lg">
                <Sparkles className="ml-2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t('home.aiPromptPlaceholder')}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button size="icon" className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
