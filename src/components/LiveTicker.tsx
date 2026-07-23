import React, { useState, useEffect } from 'react';

const FIRST_NAMES = [
  "Abdul", "Abraham", "Musa", "Chinedu", "Fatima", 
  "Amina", "Ngozi", "Emeka", "Oluwaseun", "Chioma", 
  "Yusuf", "Adebayo", "Babajide", "Chinonso", 
  "Olamide", "Zainab", "Uche", "Abiodun", "Tunde"
];

const LAST_NAMES = [
  "Adamu", "Adebayo", "Ibrahim", "Alabi", "Okafor", 
  "Bello", "Okonkwo", "Balogun", "Eze", "Sani", 
  "Nwachukwu", "Igwe", "Soyinka", "Owolabi", "Danladi", 
  "Mustapha", "Adeyemi"
];

export default function LiveTicker() {
  const [currentText, setCurrentText] = useState("");

  const generateRandomWithdrawalText = () => {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    // Multiples of 500 between 100,000 and 200,000 inclusive
    const amountVal = Math.floor(Math.random() * 201) * 500 + 100000;
    const formattedAmount = `₦${amountVal.toLocaleString()}`;
    return `${firstName} ${lastName} withdrew ${formattedAmount}`;
  };

  useEffect(() => {
    // Generate initial text
    setCurrentText(generateRandomWithdrawalText());

    // Periodically change text to simulate continuous feed
    const interval = setInterval(() => {
      setCurrentText(generateRandomWithdrawalText());
    }, 15000); // changes every 15s (matching animation cycle)

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="live-withdrawal-news-ticker" className="w-full bg-[#0a0a12] border-b border-white/[0.06] py-1 overflow-hidden flex items-center relative z-20 select-none shrink-0 font-sans">
      <style>{`
        @keyframes tickerMarquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-ticker {
          display: inline-block;
          white-space: nowrap;
          padding-left: 100%;
          animation: tickerMarquee 15s linear infinite;
        }
      `}</style>
      
      {/* Static "LIVE" Badge */}
      <div className="bg-red-500/10 text-red-400 border-r border-white/5 px-2.5 py-0.5 flex items-center gap-1.5 shrink-0 z-30 text-[9px] font-bold font-mono tracking-wider uppercase bg-[#0c0c14] h-full">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
        </span>
        LIVE
      </div>

      {/* Scrolling Text Container */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        <div className="animate-ticker text-[10px] sm:text-[11px] font-mono text-teal-400 tracking-wide font-medium">
          {currentText}
        </div>
      </div>
    </div>
  );
}
