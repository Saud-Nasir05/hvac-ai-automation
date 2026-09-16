import React from "react";

const testimonials = [
  {
    quote:
      "So knowledgeable, helpful and overall customer focused. They not only quickly fixed my AC but patiently explained the nuances, showed me pictures of the issue/parts, provided dates of last repairs, estimated longevity and associated costs for context.",
    name: "Karen M.",
  },
  {
    quote:
      "An extraordinarily thorough inspection of my home's total HVAC system with all necessary repairs.",
    name: "Bruce H.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-[#1c4f8a] w-full">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left — heading + CTA */}
        <div>
          <h2 className="text-white font-extrabold text-4xl md:text-5xl leading-tight">
            What Our Customers Think Of Us
          </h2>
          <button className="bg-[#9e1b3f] hover:bg-[#861732] transition-colors text-white font-bold text-sm px-6 py-3.5 rounded-full border-2 border-white/70 mt-8">
            See All Testimonials
          </button>
        </div>

        {/* Right — stacked testimonial cards */}
        <div className="space-y-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl shadow-lg px-8 py-10 md:py-12"
            >
              <p className="text-gray-800 text-center leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between mt-8">
                <span className="text-[#1c4f8a] font-bold">{t.name}</span>
                <a href="#" className="font-bold text-[#0c2340]">
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;