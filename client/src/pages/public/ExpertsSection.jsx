import React from "react";
import happy from '../../assets/happy.webp';
const features = [
  {
    title: "The Service Experts Guarantee",
    desc: "We promise that every piece of equipment we work on and install will be set up with care and precision—exactly as the manufacturer intended.",
  },
  {
    title: "Fast Response, Anytime You Need Us",
    desc: "From emergency repairs to routine maintenance, we respond quickly to keep small HVAC issues from becoming major disruptions.",
  },
  {
    title: "Licensed, Bonded & ACE-Certified Experts",
    desc: "Our nationally certified, ACE-certified professionals are licensed, bonded, and insured, delivering top-tier expert service with complete peace of mind.",
  },
  {
    title: "Schedule Anytime, Day or Night",
    desc: "Book your appointment whenever it's convenient for you. Our scheduling and customer support are available 24 hours a day, 7 days a week.",
  },
];

// Circular "Service Guarantee Experts" stamp badge
const StampBadge = () => (
  <svg
    viewBox="0 0 200 200"
    width="170"
    height="170"
    className="-rotate-12 drop-shadow-md"
  >
    <defs>
      <path id="stampTop" d="M 28,105 A 72,72 0 1,1 172,105" fill="none" />
      <path id="stampBottom" d="M 172,100 A 72,72 0 1,1 28,100" fill="none" />
    </defs>

    <circle cx="100" cy="100" r="94" fill="none" stroke="#a3123a" strokeWidth="3" />
    <circle cx="100" cy="100" r="86" fill="none" stroke="#a3123a" strokeWidth="1.5" />

    <text fill="#a3123a" fontSize="19" fontWeight="800" letterSpacing="3">
      <textPath href="#stampTop" startOffset="50%" textAnchor="middle">
        SERVICE
      </textPath>
    </text>

    <text fill="#a3123a" fontSize="19" fontWeight="800" letterSpacing="3">
      <textPath href="#stampBottom" startOffset="50%" textAnchor="middle">
        EXPERTS
      </textPath>
    </text>

    <text
      x="100"
      y="110"
      textAnchor="middle"
      fill="#a3123a"
      fontSize="27"
      fontWeight="900"
      letterSpacing="0.5"
    >
      GUARANTEE
    </text>
  </svg>
);

const ExpertsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-12 md:gap-16 items-start">
      {/* Left column — heading, subtext, image + stamp */}
      <div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0c2340] leading-tight">
          Our Experts Make You Feel Right at Home
        </h2>
        <p className="text-[#1c4f8a] font-semibold text-lg md:text-xl mt-5 max-w-md">
          Creating comfortable, efficient homes with expert service and
          innovative solutions.
        </p>

        <div className="relative mt-10">
          <img
            src={happy}
            alt="Service expert helping a customer"
            className="rounded-xl w-full h-auto object-cover"
          />
          <div className="absolute -top-14 right-0 md:-right-8">
            <StampBadge />
          </div>
        </div>
      </div>

      {/* Right column — feature grid + CTA */}
      <div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
          {features.map((f) => (
            <div key={f.title}>
              <h3 className="font-bold text-[#0c2340] text-lg leading-snug">
                {f.title}
              </h3>
              <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <button className="mt-10 bg-[#9e1b3f] hover:bg-[#861732] transition-colors text-white font-bold text-sm px-6 py-4 rounded-md">
          Find Your Local Experts
        </button>
      </div>
    </section>
  );
};

export default ExpertsSection;
