
import React from "react";
import vans from '../../assets/final.webp';
const services = [
  "AC Services",
  "Commercial HVAC",
  "Commercial Plumbing",
  "Ductwork Services",
  "Electrical Services",
  "Energy Efficient Solutions",
  "Heat Pumps",
  "Heating Services",
  "Indoor Air Quality Services",
  "Plumbing Services",
  "Water Heaters",
  "Water Treatment",
];

const Services = () => {
  return (
    <section
      className="relative w-full bg-cover bg-center"
      style={{ backgroundImage: `url('${vans}')` }}
    >
      {/* blue tint overlay on top of the background photo */}
      <div className="absolute inset-0 bg-[#1c4f8a]/85" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
        <h2 className="text-white font-extrabold text-3xl md:text-5xl">
          We&apos;ve Got an Expert for That
        </h2>
        <p className="text-white text-sm md:text-base mt-3 max-w-2xl mx-auto">
          Skip unreliable contractors and costly mistakes. We&apos;re the
          experts your home deserves.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mt-10">
          {services.map((s) => (
            <button
              key={s}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-center font-bold text-[#0c2340] px-4 py-9 md:py-10 min-h-[130px]"
            >
              {s}
            </button>
          ))}
        </div>

        <button className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow font-bold text-[#0c2340] px-10 py-5 mt-8">
          View All Services
        </button>

        <p className="text-white text-xs md:text-sm mt-6">
          Specific services may vary by location.
        </p>
      </div>
    </section>
  );
};

export default Services;
