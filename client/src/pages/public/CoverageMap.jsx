import React from "react";
import nyc from '../../assets/nnyc.jpg';
const CoverageMap = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-start">
      {/* Left — coverage map image */}
      <div>
        <img
          src={nyc}
          alt="Map of US states served by Service Experts"
          className="w-full h-auto"
        />
      </div>

      {/* Right — heading, copy, CTA */}
      <div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0c2340] leading-tight">
          Expert HVAC, Plumbing, and Electrical Services
        </h2>

        <p className="text-[#1c4f8a] font-semibold text-xl md:text-2xl mt-5 leading-snug">
          Licensed, Bonded, and Insured Home Service Professionals Across the
          Country
        </p>

        <p className="text-gray-800 text-base mt-6 leading-relaxed">
          <span className="font-bold">Since 1996</span>, Service Experts has
          been the trusted name for comprehensive HVAC repair, plumbing, and
          electrical services across North America.{" "}
          <span className="font-bold">We serve over 800,000 homes</span> and
          have over{" "}
          <span className="font-bold">200k 5-star reviews online</span>.
        </p>

        <p className="text-gray-800 text-base mt-4 leading-relaxed">
          When your heater stops working on the coldest night or your AC
          fails during a heat wave, our expert technicians deliver fast,
          reliable solutions that keep your home running smoothly.
        </p>

        <hr className="border-gray-300 mt-6" />

        <a
          href="#"
          className="inline-block font-bold text-[#0c2340] underline underline-offset-4 mt-4"
        >
          Read More
        </a>

        <div className="mt-8">
          <button className="bg-[#9e1b3f] hover:bg-[#861732] transition-colors text-white font-bold text-sm px-6 py-4 rounded-md">
            Find Your Experts
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoverageMap;
