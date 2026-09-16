// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 transition-all">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         {/* Logo Left */}
//         <Link to="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded">
//           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white tracking-tighter shadow-sm">
//             CA
//           </div>
//           <span className="font-bold text-xl tracking-tight text-slate-900">
//             Climate<span className="text-blue-600">AI</span>
//           </span>
//         </Link>

//         {/* Nav Center/Right */}
//         <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
//           <a href="#how-it-works" className="hover:text-blue-600 transition-colors focus:outline-none focus:underline">How It Works</a>
//           <a href="#services" className="hover:text-blue-600 transition-colors focus:outline-none focus:underline">Services</a>
//           <a href="#why-us" className="hover:text-blue-600 transition-colors focus:outline-none focus:underline">Why Us</a>
//         </nav>

//         {/* Right-most Action Button */}
//         <div className="flex items-center space-x-6">
          
//           {/* 🔥 VENDOR LOGIN BUTTON YAHAN HAI */}
//           <Link 
//             to="/login" 
//             className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors focus:outline-none focus:underline"
//           >
//             Vendor Login
//           </Link>

//           <a
//             href="#book-now"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 motion-reduce:transition-none"
//           >
//             Book Now
//           </a>
//         </div>
//       </div>
//     </header>
//   );
// }
import React from "react";

// const Header = () => {
//   return (
//     <header className="w-full font-sans">
//       {/* Top Bar */}
//       <div className="bg-[#0c2340] text-white">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 gap-4">
//           {/* Google Reviews badge */}
//           <div className="bg-white rounded-md px-3 py-1.5 flex flex-col items-center leading-tight shrink-0">
//             <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">
//               200,000+ Nationwide
//             </span>
//             <span className="font-bold text-base tracking-tight -my-0.5">
//               <span className="text-[#4285F4]">G</span>
//               <span className="text-[#EA4335]">o</span>
//               <span className="text-[#FBBC05]">o</span>
//               <span className="text-[#4285F4]">g</span>
//               <span className="text-[#34A853]">l</span>
//               <span className="text-[#EA4335]">e</span>
//             </span>
//             <div className="flex items-center gap-1">
//               <span className="text-[9px] text-gray-500">Reviews</span>
//               <span className="text-yellow-400 text-[9px] leading-none">★★★★★</span>
//             </div>
//           </div>

//           {/* Top nav links */}
//           <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
//             <a href="#" className="hover:text-gray-300 transition-colors">
//               FAQ
//             </a>
//             <a href="#" className="hover:text-gray-300 transition-colors">
//               Offers
//             </a>
//             <a href="#" className="hover:text-gray-300 transition-colors">
//               Careers
//             </a>
//             <a href="#" className="hover:text-gray-300 transition-colors">
//               Franchise
//             </a>
//           </nav>

//           {/* Phone number block */}
//           <a
//             href="tel:8669637996"
//             className="bg-[#9e1b3f] hover:bg-[#861732] transition-colors font-bold text-sm px-5 py-3.5 whitespace-nowrap"
//           >
//             866-963-7996
//           </a>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-6">
//           {/* Logo */}
//           <a href="/" className="flex items-center gap-2 shrink-0">
//             <svg width="42" height="42" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
//               <path
//                 d="M14 2 C15.5 10 16 10.5 24 12 C16 13.5 15.5 14 14 22 C12.5 14 12 13.5 4 12 C12 10.5 12.5 10 14 2 Z"
//                 fill="#9e1b3f"
//               />
//               <path
//                 d="M30 8 C31.5 16 32 16.5 40 18 C32 19.5 31.5 20 30 28 C28.5 20 28 19.5 20 18 C28 16.5 28.5 16 30 8 Z"
//                 fill="#1c4f8a"
//               />
//             </svg>
//             <div>
//               <div className="font-extrabold text-xl text-gray-900 leading-none tracking-tight">
//                 Service Experts
//               </div>
//               <div className="bg-[#1c4f8a] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 tracking-wide">
//                 HEATING, AC &amp; PLUMBING
//               </div>
//             </div>
//           </a>

//           {/* Bottom nav links */}
//           <nav className="hidden lg:flex items-center gap-6 font-bold text-gray-900 text-[15px] whitespace-nowrap">
//             <a href="#" className="hover:text-[#9e1b3f] transition-colors">
//               Services
//             </a>
//             <a href="#" className="hover:text-[#9e1b3f] transition-colors">
//               About Us
//             </a>
//             <a href="#" className="hover:text-[#9e1b3f] transition-colors">
//               Resources
//             </a>
//             <a href="#" className="hover:text-[#9e1b3f] transition-colors">
//               Membership
//             </a>
//           </nav>

//           {/* CTA buttons */}
//           <div className="flex items-center gap-3 shrink-0">
//             <a
//               href="#"
//               className="border-2 border-[#9e1b3f] text-[#9e1b3f] font-bold text-sm px-4 py-2.5 rounded-full hover:bg-[#9e1b3f] hover:text-white transition-colors whitespace-nowrap"
//             >
//               Lease a System
//             </a>
//             <a
//               href="#"
//               className="border-2 border-[#0c2340] text-[#0c2340] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#0c2340] hover:text-white transition-colors whitespace-nowrap"
//             >
//               Find Your Experts
//             </a>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { Link } from "react-router-dom"; // 👈 Yeh import add kiya gaya hai

const Header = () => {
  return (
    <header className="w-full font-sans">
      {/* Top Bar */}
      <div className="bg-[#0c2340] text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 gap-4">
          {/* Google Reviews badge */}
          <div className="bg-white rounded-md px-3 py-1.5 flex flex-col items-center leading-tight shrink-0">
            <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">
              200,000+ Nationwide
            </span>
            <span className="font-bold text-base tracking-tight -my-0.5">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500">Reviews</span>
              <span className="text-yellow-400 text-[9px] leading-none">★★★★★</span>
            </div>
          </div>

          {/* Top nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#" className="hover:text-gray-300 transition-colors">
              FAQ
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Offers
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Careers
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Franchise
            </a>
          </nav>

          {/* 🔥 Right Action Block: Vendor Login & Phone Number */}
          <div className="flex items-center gap-6 shrink-0">
            <Link 
              to="/login" 
              className="hover:text-gray-300 transition-colors font-bold text-sm whitespace-nowrap"
            >
              Vendor Login
            </Link>
            <a
              href="tel:8669637996"
              className="bg-[#9e1b3f] hover:bg-[#861732] transition-colors font-bold text-sm px-5 py-3.5 whitespace-nowrap"
            >
              866-963-7996
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <svg width="42" height="42" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2 C15.5 10 16 10.5 24 12 C16 13.5 15.5 14 14 22 C12.5 14 12 13.5 4 12 C12 10.5 12.5 10 14 2 Z"
                fill="#9e1b3f"
              />
              <path
                d="M30 8 C31.5 16 32 16.5 40 18 C32 19.5 31.5 20 30 28 C28.5 20 28 19.5 20 18 C28 16.5 28.5 16 30 8 Z"
                fill="#1c4f8a"
              />
            </svg>
            <div>
              <div className="font-extrabold text-xl text-gray-900 leading-none tracking-tight">
                Service Experts
              </div>
              <div className="bg-[#1c4f8a] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 tracking-wide">
                HEATING, AC &amp; PLUMBING
              </div>
            </div>
          </a>

          {/* Bottom nav links */}
          <nav className="hidden lg:flex items-center gap-6 font-bold text-gray-900 text-[15px] whitespace-nowrap">
            <a href="#" className="hover:text-[#9e1b3f] transition-colors">
              Services
            </a>
            <a href="#" className="hover:text-[#9e1b3f] transition-colors">
              About Us
            </a>
            <a href="#" className="hover:text-[#9e1b3f] transition-colors">
              Resources
            </a>
            <a href="#" className="hover:text-[#9e1b3f] transition-colors">
              Membership
            </a>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              className="border-2 border-[#9e1b3f] text-[#9e1b3f] font-bold text-sm px-4 py-2.5 rounded-full hover:bg-[#9e1b3f] hover:text-white transition-colors whitespace-nowrap"
            >
              Lease a System
            </a>
            <a
              href="#"
              className="border-2 border-[#0c2340] text-[#0c2340] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#0c2340] hover:text-white transition-colors whitespace-nowrap"
            >
              Find Your Experts
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;