// import React, { useState, useEffect } from 'react';

// export default function Lead() {
//   const [loading, setLoading] = useState(true);
//   const [leads, setLeads] = useState([]);

//   // 🚨 Wahi same test Vendor ID:
//   const VENDOR_ID = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e";
//   const BASE_URL = "https://hvac-ai-automation.onrender.com/api/v1/dashboard";

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${BASE_URL}/leads?vendorId=${VENDOR_ID}`);
//         const data = await response.json();

//         if (data.success) {
//           setLeads(data.leads);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching leads:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeads();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6 animate-fadeIn">
//       {/* Page Header */}
//       <div className="flex justify-between items-end">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Qualified Leads</h1>
//           <p className="text-sm text-slate-500 mt-1">All incoming service calls and chats processed by your AI assistant.</p>
//         </div>
//         <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg">
//           Total Records: {leads.length}
//         </div>
//       </div>

//       {/* CRM Table */}
//       <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
//                 <th className="py-3.5 px-6">Customer</th>
//                 <th className="py-3.5 px-6">Phone & Location</th>
//                 <th className="py-3.5 px-6">Reported Issue</th>
//                 <th className="py-3.5 px-6">Date</th>
//                 <th className="py-3.5 px-6">Status</th>
//                 <th className="py-3.5 px-6">Channel</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 text-sm">
//               {leads.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="py-12 text-center text-slate-400">
//                     No leads found for this vendor yet.
//                   </td>
//                 </tr>
//               ) : (
//                 leads.map((lead) => (
//                   <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
//                     <td className="py-4 px-6 font-semibold text-slate-900">
//                       {lead.name}
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="font-medium text-slate-800">{lead.phone}</div>
//                       <div className="text-xs text-slate-400 truncate max-w-[200px]">{lead.address}</div>
//                     </td>
//                     <td className="py-4 px-6 text-slate-600 font-medium">
//                       <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
//                         {lead.issue}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6 text-slate-500 text-xs whitespace-nowrap">
//                       {lead.date}
//                     </td>
//                     <td className="py-4 px-6 whitespace-nowrap">
//                       {lead.status === 'booked' ? (
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
//                           <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
//                           Booked
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
//                           In Progress
//                         </span>
//                       )}
//                     </td>
//                     <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-400 font-medium uppercase tracking-wider">
//                       📞 {lead.channel}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';

export default function Lead() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  // 🚨 Wahi same test Vendor ID:
  const VENDOR_ID = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e";
  const BASE_URL = "https://hvac-ai-automation.onrender.com/api/v1/dashboard";

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/leads?vendorId=${VENDOR_ID}`);
        const data = await response.json();

        if (data.success) {
          setLeads(data.leads);
        }
      } catch (error) {
        console.error("❌ Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#1C4F8A]"></div>
        <span className="text-xs font-medium tracking-wide text-slate-500">Loading leads…</span>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#861732]"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#861732]">
              Lead Register
            </span>
          </div>
          <h1 className="mt-2 text-[22px] font-semibold tracking-tight text-[#12263F]">
            AI Qualified Leads
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
            All incoming service calls and chats processed by your AI assistant.
          </p>
        </div>
        <div className="flex items-baseline gap-2 text-sm text-slate-500">
          <span>Total records</span>
          <span className="text-lg font-semibold tabular-nums text-[#1C4F8A]">{leads.length}</span>
        </div>
      </div>

      {/* CRM Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Phone &amp; Location</th>
                <th className="px-6 py-3">Reported Issue</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="text-sm font-medium text-slate-700">No leads yet</div>
                    <div className="mt-1 text-xs text-slate-400">
                      No leads found for this vendor yet.
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 font-semibold text-[#12263F]">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium tabular-nums text-slate-800">{lead.phone}</div>
                      <div className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">{lead.address}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {lead.issue}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs tabular-nums text-slate-500">
                      {lead.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {lead.status === 'booked' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1C4F8A] px-2.5 py-1 text-xs font-medium text-white">
                          Booked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#861732]"></span>
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {lead.channel}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}