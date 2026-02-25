"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json();
        setIsLoggedIn(!!data?.authenticated);
      } catch {
        setIsLoggedIn(false);
      }
    };
    void checkSession();
  }, []);

  const plans = [
    {
      id: "starter",
      name: "Free Plan",
      description: "Perfect for startups and small teams",
      monthlyPrice: "Rp0",
      features: [
        { label: "Free 5 credits/day", included: true },
        { label: "HPP & BEP Calculator", included: true },
        { label: "Basic Business Listing", included: false },
        { label: "Publish site", included: false },
      ],
    },
    {
      id: "growth",
      name: "Growth Plan",
      description: "For growing businesses needing more power",
      monthlyPrice: "Rp20.000",
      features: [
        { label: "200 credits/month", included: true },
        { label: "HPP & BEP Calculator", included: true },
        { label: "Basic Business Listing", included: true },
        { label: "Publish site", included: true },
      ],
    }
  ];

  return (
    <section className="pt-32 lg:pt-48 pb-16 lg:pb-24 bg-white text-slate-900">
      <div className="container mx-auto px-4">
        {/* HEADER SECTION */}
        <div className="mx-auto flex max-w-3xl flex-col items-center space-y-8 text-center mb-14">
          <header className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-slate-950">
              Flexible Plans for Every Stage
            </h2>
            <p className="text-slate-500 text-lg lg:text-xl max-w-xl mx-auto">
              Whether you&#39;re just starting out or scaling fast, we&apos;ve got a plan that fits your needs.
            </p>
          </header>
        </div>

        {/* CARDS SECTION */}
        <div className="flex flex-col items-stretch gap-8 md:flex-row w-full justify-center max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isStarter = plan.id === "starter";

            // Tentukan teks & href tombol berdasarkan login status
            let buttonText: string;
            let buttonHref: string;
            let buttonDisabled = false;
            let showIcon = false;

            if (isLoggedIn) {
              if (isStarter) {
                buttonText = "Current Plan";
                buttonHref = "#";
                buttonDisabled = true;
              } else {
                buttonText = "Upgrade";
                buttonHref = "/pricing"; // nanti ganti ke checkout
                showIcon = true;
              }
            } else {
              buttonText = isStarter ? "Free" : "Get Started";
              buttonHref = "/register";
            }

            return (
              <Card
                key={plan.id}
                className="flex w-full flex-col justify-between border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[32px] p-2 bg-white"
              >
                <div className="p-6 md:p-8 flex flex-col h-full">
                  <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed h-10">
                      {plan.description}
                    </p>

                    {/* CONTAINER HARGA UTAMA */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <div className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950">
                          {plan.monthlyPrice}
                        </span>
                        {!isStarter && (
                          <span className="text-slate-400 text-2xl font-medium">
                            /mo
                          </span>
                        )}
                      </div>
                    </div>

                  </CardHeader>

                  <CardContent className="p-0 flex-grow">
                    <div className="w-full h-px bg-slate-100 mb-8" />
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="h-5 w-5 rounded-full border border-slate-900 flex items-center justify-center">
                              {feature.included ? (
                                <Check className="h-3 w-3 text-slate-900 stroke-[3]" />
                              ) : (
                                <X className="h-3 w-3 text-slate-400 stroke-[3]" />
                              )}
                            </div>
                          </div>
                          <span className="text-slate-600 text-sm font-medium">
                            {feature.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-0 mt-10">
                    {buttonDisabled ? (
                      <Button
                        disabled
                        className="w-full h-12 rounded-full text-base font-semibold bg-slate-200 text-slate-500 cursor-not-allowed"
                      >
                        {buttonText}
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="w-full h-12 rounded-full text-base font-semibold bg-slate-950 text-white hover:bg-slate-800 transition-colors"
                      >
                        <Link href={buttonHref} className="flex items-center justify-center gap-2">
                          {buttonText}
                          {showIcon && <TrendingUp className="h-4 w-4" />}
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}