import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
};

type FooterContactItem = {
  label: string;
  value: string;
  href?: string;
};

type FooterSocialItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function isNativeAnchorHref(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
}

function FooterLink({
  item,
  className,
}: {
  item: FooterLinkItem;
  className?: string;
}) {
  if (item.external || isNativeAnchorHref(item.href)) {
    return (
      <a
        href={item.href}
        target={item.href.startsWith("http") ? "_blank" : undefined}
        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={item.ariaLabel ?? item.label}
        className={className}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href as "/"} aria-label={item.ariaLabel ?? item.label} className={className}>
      {item.label}
    </Link>
  );
}

export interface EditorialFooterProps extends React.HTMLAttributes<HTMLElement> {
  logoSrc: string;
  logoAlt: string;
  kicker: string;
  description: string;
  navTitle: string;
  navLinks: FooterLinkItem[];
  contactTitle: string;
  contactItems: FooterContactItem[];
  socialTitle: string;
  socialLinks: FooterSocialItem[];
  bottomLocation: string;
  bottomRights: string;
  bottomSignature: string;
}

export function EditorialFooter({
  logoSrc,
  logoAlt,
  kicker,
  description,
  navTitle,
  navLinks,
  contactTitle,
  contactItems,
  socialTitle,
  socialLinks,
  bottomLocation,
  bottomRights,
  bottomSignature,
  className,
  ...props
}: EditorialFooterProps) {
  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t border-white/8 bg-brand-black px-6 py-10 md:px-8 lg:px-12 lg:py-12",
        className
      )}
      {...props}
    >
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-10 border-b border-white/8 pb-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.9fr)] lg:gap-10 lg:pb-10">
          <div className="max-w-[28rem]">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-brand-yellow/72">
              {kicker}
            </p>

            <Link href="/" className="mt-4 inline-flex cursor-pointer">
              <Image src={logoSrc} width={122} height={44} alt={logoAlt} className="h-auto object-contain" />
            </Link>

            <p className="mt-4 max-w-[31ch] font-body text-sm leading-relaxed text-off-white/54 sm:text-[0.95rem]">
              {description}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(140px,0.7fr)_minmax(220px,1fr)] lg:border-l lg:border-white/8 lg:pl-10">
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-brand-yellow/72">
                {navTitle}
              </p>
              <nav className="mt-4 grid gap-2.5" aria-label={navTitle}>
                {navLinks.map((item) => (
                  <FooterLink
                    key={`${item.label}-${item.href}`}
                    item={item}
                    className="w-fit cursor-pointer font-display text-[0.95rem] uppercase leading-none text-off-white/72 transition-colors duration-200 hover:text-brand-yellow"
                  />
                ))}
              </nav>
            </div>

            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-brand-yellow/72">
                {contactTitle}
              </p>
              <div className="mt-4 grid gap-2.5">
                {contactItems.map((item) =>
                  item.href ? (
                    <a
                      key={`${item.label}-${item.value}`}
                      href={item.href}
                      className="w-fit cursor-pointer font-body text-sm text-off-white/60 transition-colors duration-200 hover:text-brand-yellow"
                    >
                      <span className="mr-2 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-off-white/28">
                        {item.label}
                      </span>
                      {item.value}
                    </a>
                  ) : (
                    <div key={`${item.label}-${item.value}`} className="font-body text-sm text-off-white/48">
                      <span className="mr-2 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-off-white/28">
                        {item.label}
                      </span>
                      {item.value}
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 border-t border-white/8 pt-4">
                <p className="font-mono text-[0.56rem] uppercase tracking-[0.24em] text-off-white/32">
                  {socialTitle}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  {socialLinks.map(({ icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/8 text-off-white/34 transition-all duration-200 hover:border-white/14 hover:text-off-white/58"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-off-white/28">
              {bottomLocation}
            </span>
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-off-white/22">
              {bottomRights}
            </span>
          </div>

          <div className="font-mono text-[0.54rem] uppercase tracking-[0.2em] text-off-white/18">
            {bottomSignature}
          </div>
        </div>
      </div>
    </footer>
  );
}
