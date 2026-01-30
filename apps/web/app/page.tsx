import { Hero } from "@/components/Hero";
import { Problems } from "@/components/Problems";
import { Solutions } from "@/components/Solutions";
import { HowItWorks } from "@/components/HowItWorks";
import { Comparison } from "@/components/Comparison";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Problems />
      <Solutions />
      <HowItWorks />
      <Comparison />
      <FAQ />
      <CTA />
    </>
  );
}
