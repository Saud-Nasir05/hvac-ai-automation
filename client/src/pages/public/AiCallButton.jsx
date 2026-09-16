import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = "2c94d1cd-5f3c-4d2e-84a9-d0c260bb8131";
const ASSISTANT_ID = "a6d61f7c-724f-4e17-9e6b-b0c89d360897";

export default function AiCallButton() {
  const [callStatus, setCallStatus] = useState('inactive');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // 🔥 SINGLETON LOCK: React 18 ke double render crash ko rokne ke liye
  const vapiRef = useRef(null);

  useEffect(() => {
    if (!vapiRef.current) {
      const VapiClass = Vapi.default || Vapi;
      vapiRef.current = new VapiClass(VAPI_PUBLIC_KEY);
    }

    const vapi = vapiRef.current;

    const onCallStart = () => {
      console.log('✅ [Vapi Success] Live Call Connected!');
      setCallStatus('active');
      setErrorMsg('');
    };

    const onCallEnd = () => {
      console.log('⏹️ [Vapi] Call Ended / Ejected');
      setCallStatus('inactive');
      setIsSpeaking(false);
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error) => {
      console.error('❌ [Vapi Error Triggered]:', error);
      setCallStatus('inactive');
      
      // Ejection error ka specific notification
      if (JSON.stringify(error).includes("ejection") || error?.errorMsg?.includes("ended")) {
        setErrorMsg("Call Ejected by Vapi Server! Please check if your Assistant ID is valid & Ngrok Webhook is responding 200 OK.");
      } else {
        setErrorMsg(error?.message || error?.errorMsg || "Connection Failed!");
      }
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const startCall = () => {
    if (vapiRef.current) {
      console.log('⏳ Starting Vapi Call for Assistant:', ASSISTANT_ID);
      setErrorMsg('');
      setCallStatus('loading');
      vapiRef.current.start(ASSISTANT_ID);
    }
  };

  const stopCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      setCallStatus('inactive');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {callStatus === 'inactive' && (
        <button type="button" onClick={startCall} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all">
          🎧 Start AI Voice Dispatcher
        </button>
      )}

      {callStatus === 'loading' && (
        <button type="button" disabled className="w-full bg-slate-700 text-white font-bold py-4 px-8 rounded-full animate-pulse cursor-not-allowed flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting to Vapi Cloud...</span>
        </button>
      )}

      {callStatus === 'active' && (
        <button type="button" onClick={stopCall} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full animate-pulse flex items-center justify-center gap-2">
          <span className="w-3 h-3 bg-white rounded-full"></span>
          <span>End Call ({isSpeaking ? "AI Talking..." : "Listening..."})</span>
        </button>
      )}

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-600 text-xs rounded-lg text-center font-semibold w-full">
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}