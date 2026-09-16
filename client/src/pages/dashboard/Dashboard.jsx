import React from 'react';
import Stats from './Stats';
import Lead from './Lead';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Top Bar / Vendor Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              ClimateAI Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
              PRO
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back! Here is the live performance of your AI voice & chat agents.
          </p>
        </div>
        
        {/* Live Status Badge */}
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Vapi Voice AI: Active
          </span>
        </div>
      </div>

      {/* Section 1: 4 Core Metrics & Revenue Recovered */}
      <section className="transition-all">
        <Stats />
      </section>

      {/* Section 2: CRM Leads & Bookings Table */}
      <section className="transition-all">
        <Lead />
      </section>

    </div>
  );
}