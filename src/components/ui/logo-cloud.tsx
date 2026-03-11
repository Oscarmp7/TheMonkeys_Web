import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { ClientLogo } from "@/lib/site-data";

type LogoCloudProps = {
  logos: ClientLogo[];
};

function LogoItem({ logo }: { logo: ClientLogo }) {
  const content = (
    <div className="group flex h-28 min-w-[210px] items-center justify-center rounded-[2rem] border border-brand-yellow-border/12 bg-white/72 px-7 shadow-[0_24px_50px_-42px_rgba(0,38,62,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-yellow-border/28 hover:bg-white/92 sm:min-w-[240px] sm:px-9 md:h-32 md:min-w-[280px] md:px-11 dark:border-white/8 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
      <Image
        src={logo.src}
        alt={logo.name}
        width={220}
        height={96}
        className="h-12 w-auto object-contain opacity-70 grayscale saturate-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:saturate-100 sm:h-14 md:h-16"
      />
    </div>
  );

  if (!logo.href) {
    return content;
  }

  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={logo.name}
    >
      {content}
    </a>
  );
}

export function LogoCloud({ logos }: LogoCloudProps) {
  if (logos.length <= 2) {
    return (
      <div className="mx-auto flex items-center justify-center gap-8 px-6 md:gap-12">
        {logos.map((logo) => (
          <LogoItem key={logo._id} logo={logo} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <InfiniteSlider gap={18} duration={52} durationOnHover={72} reverse className="px-6">
        {logos.map((logo) => (
          <LogoItem key={logo._id} logo={logo} />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={0.8}
        className="pointer-events-none absolute left-0 top-0 h-full w-[48px] sm:w-[64px] md:w-[84px]"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={0.8}
        className="pointer-events-none absolute right-0 top-0 h-full w-[48px] sm:w-[64px] md:w-[84px]"
        direction="right"
      />
    </div>
  );
}
