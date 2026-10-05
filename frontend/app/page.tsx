import Image from "next/image";
import { Hero } from "@/components/landing/hero";
import { Logo } from "@/components/landing/logo";
import { SiteHeader } from "@/components/landing/site-header";
import { BookingPreview } from "@/components/landing/booking-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { SlugFinder } from "@/components/landing/slug-finder";

export default function Home() {
  return (
      <>
      <SiteHeader />
      <Hero />
      <HowItWorks />
      <Features/>
      <SlugFinder/>
      </>
  );
}
