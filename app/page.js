"use client";

import HeroSection from "./components/sections/HeroSection";
import ProgramsGrid from "./components/sections/ProgramsGrid";
import ImpactSection from "./components/sections/ImpactSection";
import RegistrationTeaser from "./components/sections/RegistrationTeaser";

export default function Home() {
  return (
    <main className="flex-1 bg-deep-black">
      <HeroSection
        backgroundImage="/group.jpg"
        headline="One Platform. Many Programs. Real Impact."
        subheadline="Join our family of programs: Taekwondo, Community Impact, Online Learning & more."
        ctaText="Explore Programs"
        ctaLink="#programs"
      />

      <ProgramsGrid />

      <ImpactSection />

      <RegistrationTeaser />
    </main>
  );
}
