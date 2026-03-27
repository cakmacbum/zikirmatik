'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ChevronDown } from 'lucide-react';

const DHIKR_OPTIONS = [
  "Subhanallah",
  "Elhamdülillah",
  "Allahu Ekber",
  "Allahümme salli ala seyyidina Muhammed"
];

export default function DhikrCounter() {
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_OPTIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingDhikr, setPendingDhikr] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect lint error
    const timer = setTimeout(() => {
      setIsMounted(true);
      const savedCount = localStorage.getItem('dhikr_count');
      const savedDhikr = localStorage.getItem('dhikr_selected');
      
      if (savedCount) setCount(parseInt(savedCount, 10));
      if (savedDhikr && DHIKR_OPTIONS.includes(savedDhikr)) setSelectedDhikr(savedDhikr);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save data on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('dhikr_count', count.toString());
      localStorage.setItem('dhikr_selected', selectedDhikr);
    }
  }, [count, selectedDhikr, isMounted]);

  const playBeadSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.error("Audio playback failed:", e);
    }
  };

  const handleIncrement = () => {
    setCount(c => c + 1);
    
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
    
    playBeadSound();
  };

  const executeReset = () => {
    setCount(0);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    setIsResetDialogOpen(false);
  };

  const confirmDhikrChange = (reset: boolean) => {
    if (pendingDhikr) {
      setSelectedDhikr(pendingDhikr);
      if (reset) {
        setCount(0);
      }
    }
    setPendingDhikr(null);
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#1A2E24]" />;
  }

  return (
    <div className="min-h-screen bg-[#1A2E24] text-[#E8E3D2] selection:bg-[#D4C3A3] selection:text-[#1A2E24] flex flex-col items-center justify-between py-12 px-6 overflow-hidden relative">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#112018] to-transparent opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#112018] to-transparent opacity-50 pointer-events-none" />
      
      {/* Top Right Reset Button */}
      <button
        onClick={() => setIsResetDialogOpen(true)}
        className="absolute top-6 right-6 z-40 p-3 rounded-full bg-[#233B2F]/50 text-[#A0B0A5] hover:text-[#D4C3A3] hover:bg-[#2A4538] transition-colors border border-[#3A5A4A]/50 backdrop-blur-sm shadow-lg"
        aria-label="Sıfırla"
      >
        <RotateCcw className="w-6 h-6" />
      </button>

      {/* Top Section: Dropdown & Counter */}
      {/* Changed z-10 to z-30 so the dropdown renders above the bottom section */}
      <div className="w-full max-w-md z-30 flex flex-col items-center mt-8">
        
        {/* Dhikr Selector Dropdown */}
        <div className="relative w-full mb-6">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-center gap-3 bg-[#233B2F]/40 backdrop-blur-md border border-[#3A5A4A]/50 rounded-3xl px-6 py-6 transition-all hover:bg-[#2A4538]/60 active:scale-[0.98]"
          >
            <span className="flex-1 text-center font-serif text-2xl md:text-3xl text-[#D4C3A3] leading-snug">
              {selectedDhikr}
            </span>
            <ChevronDown className={`w-6 h-6 text-[#A0B0A5] shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full mt-3 bg-[#1A2E24] border border-[#3A5A4A] rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {DHIKR_OPTIONS.map((dhikr, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (dhikr !== selectedDhikr) {
                        setPendingDhikr(dhikr);
                      }
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-center px-6 py-5 font-serif text-xl hover:bg-[#233B2F] transition-colors ${selectedDhikr === dhikr ? 'text-[#D4C3A3] bg-[#233B2F]/50' : 'text-[#A0B0A5]'} ${idx !== DHIKR_OPTIONS.length - 1 ? 'border-b border-[#3A5A4A]/30' : ''}`}
                  >
                    {dhikr}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Counter Display */}
        <div className="flex flex-col items-center justify-center my-8 h-32">
          <motion.div
            key={count}
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="text-8xl md:text-9xl font-light tracking-tighter text-[#E8E3D2]"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {count}
          </motion.div>
        </div>
      </div>

      {/* Center/Bottom Section: Main Button */}
      <div className="w-full max-w-md z-10 flex flex-col items-center mb-12">
        <div className="relative">
          {/* Outer glow/ring */}
          <div className="absolute inset-0 rounded-full bg-[#D4C3A3] opacity-5 blur-3xl scale-150 pointer-events-none" />
          
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleIncrement}
            className="relative w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-b from-[#2A4538] to-[#1A2E24] border-4 border-[#3A5A4A] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-center focus:outline-none touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Inner circle for depth */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-[#1A2E24] to-[#233B2F] shadow-[inset_0_10px_20px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[#D4C3A3] opacity-10 blur-xl" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Change Dhikr Confirmation Dialog */}
      <AnimatePresence>
        {pendingDhikr && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1A2E24] border border-[#3A5A4A] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <h3 className="text-xl font-serif text-[#D4C3A3] text-center leading-relaxed">
                Zikir değiştiriliyor. Sayacı sıfırlamak ister misiniz?
              </h3>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => confirmDhikrChange(true)}
                  className="w-full py-4 px-4 bg-[#D4C3A3] hover:bg-[#E8E3D2] text-[#1A2E24] font-medium rounded-2xl transition-colors shadow-lg"
                >
                  Sıfırla ve devam et
                </button>
                <button
                  onClick={() => confirmDhikrChange(false)}
                  className="w-full py-4 px-4 bg-[#2A4538] hover:bg-[#3A5A4A] text-[#D4C3A3] font-medium rounded-2xl transition-colors"
                >
                  Mevcut sayıya ekleyerek devam et
                </button>
                <button
                  onClick={() => setPendingDhikr(null)}
                  className="w-full py-3 px-4 text-[#A0B0A5] hover:text-white rounded-2xl transition-colors mt-1"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {isResetDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1A2E24] border border-[#3A5A4A] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <h3 className="text-xl font-serif text-[#D4C3A3] text-center leading-relaxed">
                Zikri sıfırlamak istediğinize emin misiniz?
              </h3>
              
              <div className="flex gap-3">
                <button
                  onClick={executeReset}
                  className="flex-1 py-4 px-4 bg-[#D4C3A3] hover:bg-[#E8E3D2] text-[#1A2E24] font-medium rounded-2xl transition-colors shadow-lg"
                >
                  Evet
                </button>
                <button
                  onClick={() => setIsResetDialogOpen(false)}
                  className="flex-1 py-4 px-4 bg-[#2A4538] hover:bg-[#3A5A4A] text-[#D4C3A3] font-medium rounded-2xl transition-colors"
                >
                  Hayır
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
