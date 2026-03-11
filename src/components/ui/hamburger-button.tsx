"use client";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  controlsId?: string;
  label?: string;
}

export function HamburgerButton({
  isOpen,
  onClick,
  controlsId = "mobile-navigation",
  label = "Toggle menu",
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-[1.2rem] border border-brand-yellow-border/20 bg-brand-yellow-soft/88 text-brand-navy shadow-[0_22px_48px_-34px_rgba(181,141,0,0.55)] backdrop-blur-xl transition hover:border-brand-yellow-border/45 hover:bg-brand-yellow dark:border-white/10 dark:bg-brand-navy/78 dark:text-white dark:shadow-[0_22px_48px_-34px_rgba(0,0,0,0.7)] lg:hidden"
      aria-controls={controlsId}
      aria-expanded={isOpen}
      aria-label={label}
      style={{
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.4s ease",
      }}
    >
      <span
        className="block h-0.5 w-[22px] rounded-full bg-brand-navy transition-all duration-400 ease-in-out origin-center dark:bg-white"
        style={{
          transform: isOpen
            ? "translateY(4px) rotate(45deg)"
            : "translateY(0) rotate(0)",
        }}
      />
      <span
        className="block h-0.5 w-[22px] rounded-full bg-brand-navy transition-all duration-400 ease-in-out dark:bg-white"
        style={{
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? "scaleX(0)" : "scaleX(1)",
        }}
      />
      <span
        className="block h-0.5 w-[22px] rounded-full bg-brand-navy transition-all duration-400 ease-in-out origin-center dark:bg-white"
        style={{
          transform: isOpen
            ? "translateY(-4px) rotate(-45deg)"
            : "translateY(0) rotate(0)",
        }}
      />
    </button>
  );
}
