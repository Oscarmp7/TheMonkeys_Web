import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

type Logo = {
  src: string;
  alt: string;
};

type LogoCloudProps = {
  logos: Logo[];
};

export function LogoCloud({ logos }: LogoCloudProps) {
  return (
    <div className="relative mx-auto max-w-4xl py-6">
      <InfiniteSlider gap={48} duration={40} durationOnHover={80} reverse>
        {logos.map((logo) => (
          <img
            alt={logo.alt}
            className="pointer-events-none h-8 w-auto select-none grayscale opacity-60 hover:opacity-100 transition-opacity md:h-10"
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
          />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 left-0 h-full w-[120px]"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 right-0 h-full w-[120px]"
        direction="right"
      />
    </div>
  );
}
