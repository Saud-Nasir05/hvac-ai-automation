import React from 'react';
import HowItWorks from './HowItWorks';
import Services from './Services';
import Contact from './Contact';
import Hero from './Hero';
import ExpertsSection from './ExpertsSection';
import CoverageMap from './CoverageMap';
import Testimonials from './Testimonials';
export default function Home() {
  return (
    <div className="flex flex-col bg-slate-50">
      {/* 2. HERO SECTION (Already built and approved by you)
        Aap ka existing approved hero component / code yahan upar render hoga.
      */}
      {/* <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200">
          ⚡ Automated 24/7 Dispatch
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
          Next-Gen HVAC Repair. <br />
          <span className="text-blue-600">Zero Wait Times.</span>
        </h1>
        <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
          No human dispatchers. Our AI agent qualifies your service request and locks your appointment directly on the technician's calendar.
        </p>
      </section> */}
      <Hero />
      <ExpertsSection />
      {/* 3. HOW IT WORKS SECTION */}
      {/* <HowItWorks /> */}


      {/* 4. SERVICES SECTION */}
      <Services />
      <CoverageMap />
      <Testimonials />

      {/* 5. WHY US / TRUST & 6. BOOK NOW (Embedded inside Contact component) */}
      <Contact />
    </div>
  );
}