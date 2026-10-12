import { Hero } from "@/components/landing/hero";
import { SiteHeader } from "@/components/landing/site-header";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { SlugFinder } from "@/components/landing/slug-finder";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
      <>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features/>
        <SlugFinder/>
      </main>
      <SiteFooter/>
      </>
  );
}
