// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function Footer() {
//   return (
//     <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-between">
        
//         {/* Left: Brand */}
//         <div className="space-y-2 text-center md:text-left">
//           <span className="font-bold text-xl tracking-tight text-white">
//             Climate<span className="text-blue-500">AI</span>
//           </span>
//           <p className="text-xs text-slate-400">
//             Automated HVAC Service & Dispatch Platform.
//           </p>
//         </div>

//         {/* Center: Copy Reassurance */}
//         <div className="text-center">
//           <p className="text-sm font-medium text-slate-300">
//             🚨 Emergency? We're here 24/7. Call <a href="tel:18002546283" className="text-blue-400 font-bold hover:underline">1-800-CLIMATE-AI</a>
//           </p>
//         </div>

//         {/* Right: Quick Links & Copyright */}
//         <div className="flex flex-col md:items-end space-y-2 text-center md:text-right text-xs">
//           <div className="space-x-4">
//             <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
//             <a href="#services" className="hover:text-white transition-colors">Services</a>
//             <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
//           </div>
//           <p className="text-slate-500">
//             &copy; {new Date().getFullYear()} ClimateAI Inc. All rights reserved.
//           </p>
//         </div>

//       </div>
//     </footer>
//   );
// }
import React from "react";

const navLinks = [
  "Services",
  "Careers",
  "Reviews",
  "Membership",
  "FAQ",
  "Franchise",
  "Blog",
];

const legalLinks = ["Accessibility", "Site Map", "Privacy Policy", "Site Search"];

// Brand mark reused across the site
const BrandMark = ({ size = 60 }) => (
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

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Top white bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-wrap items-start justify-between gap-10">
          {/* Logo */}
          <div className="flex flex-col shrink-0">
            <BrandMark size={64} />
            <span className="font-extrabold text-2xl text-gray-900 mt-1">
              Service Experts
            </span>
          </div>

          {/* Contact info */}
          <div className="text-sm">
            <a href="tel:8669637996" className="text-[#9e1b3f] font-bold">
              866-963-7996
            </a>
            <p className="text-gray-800 mt-2">3400 N Central Expressway</p>
            <p className="text-gray-800">Ste 410</p>
            <p className="text-gray-800">Richardson, TX 75080</p>
          </div>

          {/* Nav links + partner badges */}
          <div className="flex flex-col gap-6">
            <nav className="flex flex-wrap gap-6 font-bold text-gray-900 text-sm">
              {navLinks.map((link) => (
                <a key={link} href="#" className="hover:text-[#9e1b3f] transition-colors">
                  {link}
                </a>
              ))}
            </nav>

            <div className="flex flex-wrap items-center gap-8">
              {/* Go Solar Power badge */}
              <div className="leading-none">
                <div className="font-extrabold text-lg tracking-tight">
                  <span className="text-[#4285F4]">GO</span>{" "}
                  <span className="text-[#34A853]">SOLAR</span>{" "}
                  <span className="text-[#FBBC05]">POWER</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  A Service Experts Company
                </div>
              </div>

              {/* Engineering Excellence badge */}
              <div className="leading-none">
                <div className="font-extrabold text-sm text-gray-900 tracking-wide">
                  ENGINEERING
                </div>
                <div className="font-extrabold text-sm text-[#1c4f8a] tracking-wide">
                  E&raquo;&raquo;CELLENCE
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  National HVACR Solutions. Local Expertise.
                </div>
              </div>
            </div>
          </div>

          {/* CTA + Follow */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <button className="bg-[#9e1b3f] hover:bg-[#861732] transition-colors text-white font-bold text-sm px-7 py-3.5 rounded-full whitespace-nowrap">
              Find Your Local Experts
            </button>
            <a href="#" className="text-[#1c4f8a] font-semibold text-sm hover:underline">
              Follow Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom dark legal bar */}
      <div className="bg-[#161616] text-gray-400">
        <div className="max-w-7xl mx-auto px-4 py-8 text-xs">
          <p className="leading-relaxed max-w-4xl">
            © 2026 Service Experts, Service Experts Heating &amp; Air
            Conditioning, and the Service Experts logo and design are
            registered trademarks of Service Experts LLC. All Rights
            Reserved. Services, promotions and pricing may vary by Service
            Experts location, call your local Center for more details.
            Service Experts Advantage Program: See the terms and conditions
            within your Lease Agreement for full information on pricing and
            program details. Lease with approved credit. *See items 6, 7 &amp;
            19 of the current Franchise Disclosure Document (FDD). $6,881,668
            Average Gross Revenue as reported by 48 disclosed outlets. See
            the current FDD for additional details.
          </p>

          <p className="mt-4">© 2026 All Rights Reserved.</p>

          <div className="flex flex-wrap gap-6 mt-3">
            {legalLinks.map((link) => (
              <a key={link} href="#" className="underline hover:text-gray-200">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;