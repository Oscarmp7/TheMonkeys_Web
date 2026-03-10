import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { ClientLogos } from "@/components/sections/client-logos";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Portfolio />
      <ClientLogos />
      <About />
      <Contact />
    </main>
  );
}
