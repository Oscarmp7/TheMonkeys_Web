import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { ClientLogo } from "@/lib/site-data";

type LogoCloudProps = {
  logos: ClientLogo[];
};

function LogoItem({ logo }: { logo: ClientLogo }) {
  const content = (
    <div className="flex h-20 min-w-[140px] items-center justify-center px-4 sm:min-w-[160px] sm:px-6 md:min-w-[180px] md:px-8">
      <Image
        src={logo.src}
        alt={logo.name}
        width={160}
        height={64}
        className="h-10 w-auto object-contain opacity-40 grayscale transition-all duration-400 hover:opacity-80 hover:grayscale-0"
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
      <div className="mx-auto flex items-center justify-center gap-12 px-6">
        {logos.map((logo) => (
          <LogoItem key={logo._id} logo={logo} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <InfiniteSlider gap={0} duration={40} durationOnHover={60} reverse>
        {logos.map((logo) => (
          <LogoItem key={logo._id} logo={logo} />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute left-0 top-0 h-full w-[60px] sm:w-[80px] md:w-[100px]"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute right-0 top-0 h-full w-[60px] sm:w-[80px] md:w-[100px]"
        direction="right"
      />
    </div>
  );
}
