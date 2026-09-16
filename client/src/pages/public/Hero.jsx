import React from "react";
import heroVideo from '../../assets/hero.mp4';
const stats = [
  {
    value: "31",
    label: "States",
    desc: "Bringing trusted comfort, reliability, and efficiency to homes just like yours.",
  },
  {
    value: "75+",
    label: "Locations",
    desc: "With locations nationwide, expert service is never far away.",
  },
  {
    value: "3,000+",
    label: "Employees",
    desc: "Dedicated pros keeping your home running smoothly.",
  },
  {
    value: "2,500+",
    label: "Daily Customers",
    desc: "Millions trust us to keep their home systems running smoothly.",
  },
];

// Small red/blue brand mark reused from the header logo
const BrandMark = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2 C15.5 10 16 10.5 24 12 C16 13.5 15.5 14 14 22 C12.5 14 12 13.5 4 12 C12 10.5 12.5 10 14 2 Z"
      fill="#9e1b3f"
    />
    <path
      d="M30 8 C31.5 16 32 16.5 40 18 C32 19.5 31.5 20 30 28 C28.5 20 28 19.5 20 18 C28 16.5 28.5 16 30 8 Z"
      fill="#1c4f8a"
    />
  </svg>
);

const Hero = () => {
  return (
    <div className="w-full">
      {/* PART 1 — hero section with background video */}
      <section className="relative h-[560px] md:h-[640px] w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white font-extrabold text-4xl md:text-6xl leading-tight max-w-4xl">
            Your Home&apos;s Expert Care Team
          </h1>
          <p className="text-white text-base md:text-lg mt-4 max-w-xl">
            We deliver expert HVAC, plumbing, and electrical services nationwide.
          </p>
          <p className="text-white font-bold text-sm mt-8">Find Your Experts</p>

        </div>

        {/* decorative slide dots */}
        <div className="absolute right-8 bottom-10 z-10 flex gap-3">
          <span className="w-4 h-4 rounded-full bg-white/90" />
          <span className="w-4 h-4 rounded-full bg-white/60" />
        </div>
      </section>

      {/* wrapper holds the overlap effect: negative margin pulls part 2 up onto part 1 */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-20 md:-mt-24">
        {/* PART 2 — blue stats patch, half on video / half on white */}
        <div className="bg-[#1c4f8a] rounded-2xl text-white grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10 md:px-10 md:py-12 shadow-xl">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-extrabold text-3xl md:text-4xl">{s.value}</div>
              <div className="font-bold text-sm md:text-base mt-2">{s.label}</div>
              <p className="text-xs md:text-sm text-white/80 mt-2 leading-snug">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* PART 3 — two equal-width offer cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12 pb-16">
          {/* Card 1 */}
          <div className="relative border-2 border-dashed border-[#1c4f8a]/40 rounded-xl p-6 md:p-8">
            <span className="absolute -top-4 right-6 bg-[#9e1b3f] text-white text-xs font-bold text-center leading-tight px-3 py-2 rounded-sm shadow-md">
              Limited
              <br />
              Time
              <br />
              Offer!
            </span>

            <div className="mb-4">
              <BrandMark size={72} />
            </div>

            <div className="bg-[#eaf3fa] text-[#0c2340] font-bold text-lg md:text-xl px-4 py-3 rounded">
              $0 Diagnostic Fee
            </div>

            <p className="text-gray-700 text-sm mt-4">
              Waived fee for all HVAC, Plumbing, Electrical and Water service calls.
            </p>
            <p className="text-gray-500 text-xs mt-4 leading-relaxed">
              Promotion valid for service visits occurring 8/20/26 - 9/18/26. Cannot
              be combined with other offers outside of membership discounts. No cash
              value. Offer may be modified, suspended, or withdrawn at any time as
              permitted by law.
            </p>
            <p className="text-gray-700 text-sm font-medium mt-4">
              Aug 20, 2026 - Sep 18, 2026
            </p>

            <div className="flex gap-6 mt-4">
              <a href="#" className="text-[#9e1b3f] font-semibold text-sm hover:underline">
                Text
              </a>
              <a href="#" className="text-[#9e1b3f] font-semibold text-sm hover:underline">
                Email
              </a>
              <a href="#" className="text-[#9e1b3f] font-semibold text-sm hover:underline">
                Download
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative border-2 border-dashed border-[#1c4f8a]/40 rounded-xl p-6 md:p-8">
            <p className="text-[#9e1b3f] font-bold text-sm">Service Experts</p>
            <h3 className="font-extrabold text-3xl md:text-4xl text-gray-900 leading-none mt-1">
              Advantage Program<span className="text-base align-super">™</span>
            </h3>

            <div className="bg-[#eaf3fa] text-[#0c2340] font-bold text-lg md:text-xl px-4 py-3 rounded mt-6">
              No Payments Until 2027
            </div>

            <p className="text-gray-700 text-sm mt-4">
              With any new HVAC, Indoor Air Quality, Water Heater or Water Treatment
              Service Experts Advantage Program lease agreement, we will make your
              payments for the first 6 months.
            </p>
            <p className="text-gray-500 text-xs mt-4 leading-relaxed">
              Valid on new Advantage Program lease agreements from 7/1/26 to 9/30/26.
              Customer owes $0 for the first six months; regular monthly lease
              payments begin thereafter. Early termination during promotional period
              will result in charges for elapsed months. See your full Advantage
              Program Lease Agreement for complete terms and conditions, including
              total lease costs and payment schedule.
            </p>
            <p className="text-gray-700 text-sm font-medium mt-4">
              Jul 1, 2026 - Sep 30, 2026
            </p>

            <div className="flex gap-6 mt-4">
              <a href="#" className="text-[#9e1b3f] font-semibold text-sm hover:underline">
                Text
              </a>
              <a href="#" className="text-[#9e1b3f] font-semibold text-sm hover:underline">
                Email
              </a>
              <a href="#" className="text-[#9e1b3f] font-semibold text-sm hover:underline">
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
