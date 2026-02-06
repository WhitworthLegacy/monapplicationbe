import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Problems } from "@/components/Problems";
import { Solutions } from "@/components/Solutions";
import { Realisations } from "@/components/Realisations";
import { HowItWorks } from "@/components/HowItWorks";
import { Comparison } from "@/components/Comparison";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Problems />
      <Comparison />
      <Solutions />
      <Realisations />
      <HowItWorks />
      <Services />
      <FAQ />
      <CTA />
    </>
  );
}
