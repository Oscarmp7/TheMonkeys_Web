"use client";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-50 lg:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      style={{
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.4s ease",
      }}
    >
      <span
        className="block w-6 h-0.5 bg-brand-navy dark:bg-white transition-all duration-400 ease-in-out origin-center"
        style={{
          transform: isOpen
            ? "translateY(4px) rotate(45deg)"
            : "translateY(0) rotate(0)",
        }}
      />
      <span
        className="block w-6 h-0.5 bg-brand-navy dark:bg-white transition-all duration-400 ease-in-out"
        style={{
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? "scaleX(0)" : "scaleX(1)",
        }}
      />
      <span
        className="block w-6 h-0.5 bg-brand-navy dark:bg-white transition-all duration-400 ease-in-out origin-center"
        style={{
          transform: isOpen
            ? "translateY(-4px) rotate(-45deg)"
            : "translateY(0) rotate(0)",
        }}
      />
    </button>
  );
}
