/**
 * Page entrance fade — pure CSS (.page-fade in globals.css).
 * CSS animations run without JS and start before hydration, so content is
 * never trapped at opacity:0 and LCP is not delayed (unlike the old GSAP
 * version that server-rendered the wrapper invisible).
 * Reduced-motion users skip it via the global animation override.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
