// export default function Services() {
//   const services = [
//     {
//       title: "AC Repair & Diagnostics",
//       desc: "Fast, accurate troubleshooting for cooling failures, refrigerant leaks, and airflow restrictions.",
//       isEmergency: false
//     },
//     {
//       title: "Heating & Furnace Repair",
//       desc: "Comprehensive diagnostic and repair services to restore heat safely during freezing weather.",
//       isEmergency: false
//     },
//     {
//       title: "Preventative Maintenance",
//       desc: "Annual tune-ups and coil cleaning to extend equipment lifespan and reduce utility bills.",
//       isEmergency: false
//     },
//     {
//       title: "24/7 Emergency Breakdown",
//       desc: "Total system failure in extreme temperatures? Our AI triggers priority override dispatch instantly.",
//       isEmergency: true // ⚠️ Using our reserved Peach/Orange badge!
//     },
//     {
//       title: "Ductwork & Air Quality",
//       desc: "Duct inspection, sealing, and filtration enhancements for healthier indoor breathing.",
//       isEmergency: false
//     },
//     {
//       title: "Smart Thermostat Setup",
//       desc: "Installation and calibration of automated climate control systems for peak energy efficiency.",
//       isEmergency: false
//     }
//   ];

//   return (
//     <section id="services" className="py-20 px-6 bg-white border-t border-slate-200">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center max-w-2xl mx-auto mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
//             Our HVAC <span className="text-[#9e1b3f]">Services</span>
//           </h2>
//           <p className="text-slate-600 text-base sm:text-lg">
//             From routine seasonal tune-ups to critical midnight breakdowns, our AI dispatcher connects you with specialized local technicians.
//           </p>
//         </div>

//         {/* Quiet Cards Grid - ZERO SHADOW Rule */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {services.map((srv, idx) => (
//             <div 
//               key={idx} 
//               className={`bg-white border p-6 rounded-xl flex flex-col justify-between transition-colors motion-reduce:transition-none ${
//                 srv.isEmergency 
//                   ? 'border-orange-200 bg-orange-50/20' 
//                   : 'border-slate-200 hover:border-slate-300'
//               }`}
//             >
//               <div>
//                 {srv.isEmergency && (
//                   <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider mb-3">
//                     ⚠️ Priority Dispatch
//                   </span>
//                 )}
//                 <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
//                   {srv.title}
//                 </h3>
//                 <p className="text-slate-600 text-sm leading-relaxed">
//                   {srv.desc}
//                 </p>
//               </div>
              
//               <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
//                 <span className="text-xs font-medium text-slate-500">Auto-booking available</span>
//                 <a href="#book-now" className="text-xs font-bold text-blue-600 hover:underline">
//                   Book Slot &rarr;
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
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
