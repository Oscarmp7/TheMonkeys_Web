"use client";

import { cn } from "@/lib/utils";

export interface ProcessStepData {
  title: string;
  description: string;
}

interface ProcessStepsGridProps {
  steps: readonly ProcessStepData[];
  activeStep: number;
  onStepEnter: (index: number) => void;
  /**
   * "home"     — static highlight, navy titles (src/components/sections/process.tsx)
   * "services" — auto-advance variant with progress line and yellow active title
   */
  variant: "home" | "services";
  /** data-* attribute names consumed by each page's GSAP selectors. */
  gridDataAttr: string;
  stepDataAttr: string;
  lineDataAttr: string;
  onGridMouseEnter?: () => void;
  onGridMouseLeave?: () => void;
  className?: string;
}

export function ProcessStepsGrid({
  steps,
  activeStep,
  onStepEnter,
  variant,
  gridDataAttr,
  stepDataAttr,
  lineDataAttr,
  onGridMouseEnter,
  onGridMouseLeave,
  className,
}: ProcessStepsGridProps) {
  const isServices = variant === "services";

  return (
    <div
      {...{ [gridDataAttr]: "" }}
      className={cn(
        "relative mt-12 grid grid-cols-2 gap-x-2 gap-y-10 sm:mt-16 sm:gap-x-0 sm:gap-y-12 lg:mt-20 lg:grid-cols-4",
        className
      )}
      onMouseEnter={onGridMouseEnter}
      onMouseLeave={onGridMouseLeave}
    >
      {/* Connecting horizontal line (visible on lg+ only) */}
      <div
        {...{ [lineDataAttr]: "" }}
        className="hidden lg:block absolute top-10 left-[10%] right-[10%] border-t-2 border-brand-navy/20"
        aria-hidden="true"
      />

      {/* Progress line — services variant only */}
      {isServices && (
        <div
          className="absolute top-10 left-[10%] hidden h-[2px] bg-brand-yellow transition-[width] duration-500 ease-premium lg:block"
          style={{ width: `${(activeStep / (steps.length - 1)) * 80}%` }}
          aria-hidden="true"
        />
      )}

      {steps.map((step, i) => {
        const num = String(i + 1).padStart(2, "0");
        const isActive = i === activeStep;

        return (
          <div
            key={step.title}
            {...{ [stepDataAttr]: "" }}
            className={cn(
              "group relative z-10 flex cursor-default flex-col items-center",
              isServices && "transition-transform duration-300 ease-premium"
            )}
            onMouseEnter={() => onStepEnter(i)}
          >
            {/* Numbered circle */}
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out hover:scale-[1.08] sm:h-20 sm:w-20",
                isActive
                  ? isServices
                    ? "border-brand-yellow bg-brand-yellow shadow-[0_0_0_10px_rgba(245,197,24,0.08)]"
                    : "bg-brand-yellow border-brand-yellow"
                  : isServices
                    ? "border-brand-navy/30 bg-off-white-warm"
                    : "bg-off-white border-brand-navy/30"
              )}
            >
              <span
                className={cn(
                  "font-display text-2xl transition-colors duration-300 ease-out sm:text-3xl",
                  isActive
                    ? isServices
                      ? "text-brand-black"
                      : "text-brand-navy"
                    : "text-brand-navy/50"
                )}
              >
                {num}
              </span>
            </div>

            {/* Title */}
            <h3
              className={cn(
                "mt-3 text-center font-display text-base uppercase sm:mt-4 sm:text-lg",
                isServices
                  ? cn(
                      "transition-colors duration-300",
                      isActive ? "text-brand-yellow" : "text-brand-navy"
                    )
                  : "text-brand-navy"
              )}
            >
              {step.title}
            </h3>

            {/* Description */}
            <p
              className={cn(
                "mx-auto mt-2 max-w-[240px] text-center font-body text-xs leading-relaxed sm:text-sm lg:max-w-[200px]",
                isServices
                  ? cn(
                      "transition-colors duration-300",
                      isActive ? "text-brand-navy/72" : "text-brand-navy/55"
                    )
                  : "text-brand-navy/65"
              )}
            >
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
