export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Describe the Issue",
      desc: "Tell our AI what's happening with your system in plain English — 24/7, no waiting on hold."
    },
    {
      num: "02",
      title: "AI Finds Available Tech",
      desc: "Our engine analyzes urgency, checks real-time vendor GPS, and locates the nearest qualified technician."
    },
    {
      num: "03",
      title: "Instant Calendar Lock",
      desc: "The AI books your appointment directly onto the technician's Google Calendar and sends you a confirmation link."
    },
    {
      num: "04",
      title: "Technician Arrives",
      desc: "Your verified technician arrives on schedule with the exact diagnostic data already in hand."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            How <span className="text-blue-600">ClimateAI</span> Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            No human dispatchers. No callbacks. We turned the traditional HVAC booking process into a seamless 4-step automated workflow.
          </p>
        </div>

        {/* 4 Steps Row - Flat Border-based Cards, ZERO SHADOW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col justify-between hover:border-blue-600/50 transition-colors motion-reduce:transition-none"
            >
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-4">
                  Step // {step.num}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-400 font-medium">
                Automated Step &rarr;
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}