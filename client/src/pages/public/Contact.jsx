
import React, { useState } from 'react';
import api from '../../api/axios'; // 👈 Hamara centralized Axios import kiya
import AiCallButton from './AiCallButton';// 👈 🔥 Naya Vapi Voice Button Import Kiya

export default function Contact() {
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm the ClimateAI dispatcher. What HVAC issue are you experiencing today?" }
  ]);

  // 🔥 THE REAL AUTOMATION LOOP (Connected to Node.js & Gemini)
  const [sessionId] = useState(() => crypto.randomUUID());

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/qualify', {
        message: userMsg,
        sessionId: sessionId, // 👈 1. Customer ki random UUID chat memory ke liye
        vendorId: "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e" // 👈 2. Yahan apne database se ASLI Vendor ki ID daalo
      });

      const { data, calendarLink } = response.data;

      // Gemini ka conversational reply aur booking link set karo
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: data.reply, link: calendarLink }
      ]);

    } catch (error) {
      console.error("Backend AI Error:", error);
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: "Sorry, I couldn't reach dispatch right now. Please try again in a moment." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="book-now" className="bg-slate-50">
      {/* 5. WHY US / TRUST STATS ROW */}
      {/* <section id="why-us" className="border-y border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">24/7</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Dispatch Ready</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 tracking-tight">30 Min</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Avg Response Time</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">100%</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Verified Technicians</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">$0</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Hidden Dispatch Fees</div>
          </div>
        </div>
      </section> */}

      {/* 6. BOOK NOW / FUNCTIONAL CORE */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Book Your Service <span className="text-blue-600">Now</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Choose how you want to connect. Type to our AI dispatcher for instant booking, or start a real-time voice call directly from your browser.
          </p>
        </div>

        {/* Two Clear Paths Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Path 1: "Chat with our AI" */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[460px]">
            {/* Dark Slate Header Bar */}
            <div className="bg-slate-700 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="font-bold text-sm tracking-wide">ClimateAI // Instant Chat Dispatch</span>
              </div>
              <span className="text-xs text-slate-300 font-mono">24/7 ONLINE</span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3.5 text-sm rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-slate-200 text-slate-900 font-medium'
                      : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
                  }`}>
                    <p>{m.text}</p>
                    

                  </div>
                </div>
              ))}
              
              {/* AI Processing Animation */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-400 text-xs p-3 rounded-xl shadow-sm animate-pulse">
                    ⚡ AI is diagnosing issue & checking calendar slots...
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your HVAC issue here..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>

          {/* Path 2: "Voice Calling" - 🔥 UPGRADED TO VAPI WEB SDK */}
          <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-between h-[460px]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  Web-RTC Live Streaming
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                Speak to Voice AI Now
              </h3>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Don't want to type? Start an interactive voice session right here in your browser. Our AI voice agent listens to your HVAC emergency, checks live technician availability, and locks in your appointment seamlessly.
              </p>
              
              {/* Little bullet points for trust */}
              <ul className="text-xs text-slate-500 space-y-2 mb-6 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> No telephone calling charges (100% free browser call)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Zero hold times — instant voice recognition
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Automatically syncs with our CRM & WhatsApp
                </li>
              </ul>
            </div>

            {/* 🔥 VAPI CALL BUTTON BOX */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
              <div className="text-xs text-slate-400 font-mono uppercase mb-3">
                🎤 Click below & allow microphone access
              </div>
              
              {/* Hamara banaya hua Vapi component yahan render ho raha hai */}
              <AiCallButton />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}