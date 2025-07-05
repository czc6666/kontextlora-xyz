"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const SUBSCRIPTION_TIERS = [
  {
    id: "free",
    name: "Free",
    priceMonthly: "$0",
    description: "For personal projects and exploration.",
    features: [
      "Basic access to services",
      "Limited usage",
      "Community support",
    ],
    featured: false,
    isComingSoon: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: "$9.98",
    description: "For professionals and small teams.",
    features: [
      "Full access to all services",
      "Increased usage limits",
      "Priority email support",
      "Advanced features",
    ],
    featured: true,
    isComingSoon: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: "$19.98",
    description: "For large organizations and custom needs.",
    features: [
      "All Pro features",
      "Unlimited usage",
      "Dedicated support & SLA",
      "Custom integrations",
    ],
    featured: false,
    isComingSoon: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-8 md:py-12 lg:py-24">
      <div className="container px-4 sm:px-6 lg:px-8 space-y-16 max-w-6xl">
        {/* Subscription Plans */}
        <div>
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-6xl leading-[1.1]">
              Subscription Plans
            </h2>
            <p className="max-w-[95%] sm:max-w-[85%] text-sm sm:text-lg leading-normal text-muted-foreground">
              Start building for free and scale up as you grow. All plans
              include the core features you need to get started.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mt-8 md:mt-12">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border bg-background p-4 sm:p-6 shadow-lg ${
                  tier.featured
                    ? "border-primary shadow-primary/10"
                    : "border-border"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Popular
                  </div>
                )}
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold">{tier.name}</h3>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {tier.priceMonthly}
                    {tier.priceMonthly !== "Custom" && (
                      <span className="text-base font-normal text-muted-foreground">
                        /month
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
                <div className="mt-6">
                  <ul className="space-y-3 text-sm">
                    {tier?.features?.map((feature: string) => (
                      <li key={feature} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  {tier.isComingSoon ? (
                    <Button
                      className="w-full"
                      variant={tier.featured ? "default" : "outline"}
                      disabled
                    >
                      Coming soon
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full"
                      variant={tier.featured ? "default" : "outline"}
                    >
                      <Link href="/sign-up">Get started</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
