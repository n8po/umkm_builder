"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, HelpCircle, Sparkles } from "lucide-react";

interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
  tooltip?: string;
}

interface PricingCardProps {
  title?: string;
  description?: string;
  price?: {
    monthly: number;
    annually: number;
  };
  features?: PricingFeature[];
  popular?: boolean;
  highlighted?: boolean;
  ctaText?: string;
  discount?: number;
}

// ... imports unchanged

export const PricingCard = ({
  title = "Professional",
  description = "Perfect for growing businesses and teams.",
  price = {
    monthly: 29,
    annually: 290,
  },
  features = [
    { name: "Up to 10 team members", included: true, highlight: true },
    { name: "Unlimited projects", included: true, highlight: true },
    { name: "Advanced analytics", included: true },
    { name: "Priority support", included: true },
    {
      name: "Custom integrations",
      included: false,
      tooltip: "Available on Enterprise plan",
    },
    { name: "AI-powered insights", included: false },
  ],
  popular = true,
  highlighted = false,
  ctaText = "Get Started",
  discount = 15,
}: PricingCardProps) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );
  
  const currentPrice =
    billingCycle === "monthly" ? price.monthly : price.annually;
  const annualSavings = price.monthly * 12 - price.annually;

  return (
    <Card
      className={`w-full max-w-sm relative overflow-hidden transition-all duration-300 border bg-card text-card-foreground ${
        highlighted ? "border-primary shadow-lg ring-1 ring-primary" : "border-border shadow-sm hover:shadow-md hover:border-primary/50"
      }`}
    >
      {/* Background gradient effect */}
      {highlighted && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      )}

      {/* Popular badge */}
      {popular && (
        <div className="absolute top-0 right-0 z-10 pointer-events-none overflow-hidden h-[150px] w-[150px]">
          <div className="absolute top-[32px] -right-[50px] rotate-45 bg-primary text-primary-foreground py-1 w-[170px] text-center text-xs font-semibold shadow-sm">
            Popular
          </div>
        </div>
      )}

      <CardHeader className={`pb-8 ${popular ? "pt-12" : ""}`}>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {highlighted && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 gap-1 border-primary/20"
            >
              <Sparkles className="h-3 w-3" />
              Recommended
            </Badge>
          )}
        </div>
        <CardDescription className="pt-1.5 text-muted-foreground">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pricing section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-foreground">${currentPrice}</span>
              <span className="text-muted-foreground">
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  billingCycle === "monthly"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </span>
              <Switch
                checked={billingCycle === "annually"}
                onCheckedChange={(checked) =>
                  setBillingCycle(checked ? "annually" : "monthly")
                }
                className="cursor-pointer data-[state=unchecked]:bg-zinc-200 dark:data-[state=unchecked]:bg-zinc-700 data-[state=checked]:bg-zinc-950 dark:data-[state=checked]:bg-white border-2 border-transparent hover:data-[state=unchecked]:bg-zinc-300 dark:hover:data-[state=unchecked]:bg-zinc-600 transition-colors"
              />
              <span
                className={`text-xs ${
                  billingCycle === "annually"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Annually
              </span>
            </div>
          </div>

          {billingCycle === "annually" && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Save ${annualSavings} ({discount}%) with annual billing
            </div>
          )}
        </div>

        {/* Features list */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">What&apos;s included:</div>
          <ul className="space-y-2.5">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                    feature.included
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm ${
                      !feature.included ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {feature.name}
                  </span>
                  {feature.tooltip && (
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          className={`w-full transition-all border ${
            highlighted 
            ? "bg-primary text-primary-foreground shadow-md border-primary hover:shadow-lg hover:-translate-y-0.5" 
              : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground border-input hover:border-primary hover:shadow-sm"
          }`}
          size="lg"
          variant={highlighted ? "default" : "outline"}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}
