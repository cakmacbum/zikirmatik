'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ChevronDown, Globe, BarChart2, X, Trash2 } from 'lucide-react';

type Language = 'tr' | 'ar' | 'bn' | 'ur';
type StatsData = Record<number, Record<string, number>>;

const UI_TRANSLATIONS: Record<Language, {
  stats: string;
  daily: string;
  weekly: string;
  monthly: string;
  allTime: string;
  resetData: string;
  areYouSure: string;
  yes: string;
  no: string;
  close: string;
  dir: 'ltr' | 'rtl';
  changeDhikrTitle: string;
  resetAndContinue: string;
  continueWithCurrent: string;
  cancel: string;
  resetCounterTitle: string;
}> = {
  tr: {
    stats: 'Zikir Toplamı',
    daily: 'Günlük',
    weekly: 'Haftalık',
    monthly: 'Aylık',
    allTime: 'Tüm Zamanlar',
    resetData: 'Verileri Sıfırla',
    areYouSure: 'Tüm istatistikleri sıfırlamak istediğinize emin misiniz?',
    yes: 'Evet',
    no: 'Hayır',
    close: 'Kapat',
    dir: 'ltr',
    changeDhikrTitle: 'Zikir değiştiriliyor. Sayacı sıfırlamak ister misiniz?',
    resetAndContinue: 'Sıfırla ve devam et',
    continueWithCurrent: 'Mevcut sayıya ekleyerek devam et',
    cancel: 'İptal',
    resetCounterTitle: 'Zikri sıfırlamak istediğinize emin misiniz?'
  },
  ar: {
    stats: 'مجموع الأذكار',
    daily: 'يومياً',
    weekly: 'أسبوعياً',
    monthly: 'شهرياً',
    allTime: 'كل الوقت',
    resetData: 'إعادة ضبط البيانات',
    areYouSure: 'هل أنت متأكد أنك تريد إعادة ضبط جميع الإحصائيات؟',
    yes: 'نعم',
    no: 'لا',
    close: 'إغلاق',
    dir: 'rtl',
    changeDhikrTitle: 'جاري تغيير الذكر. هل تريد تصفير العداد؟',
    resetAndContinue: 'تصفير ومتابعة',
    continueWithCurrent: 'المتابعة مع العدد الحالي',
    cancel: 'إلغاء',
    resetCounterTitle: 'هل أنت متأكد أنك تريد تصفير العداد؟'
  },
  bn: {
    stats: 'মোট জিকির',
    daily: 'দৈনিক',
    weekly: 'সাপ্তাহিক',
    monthly: 'মাসিক',
    allTime: 'সব সময়',
    resetData: 'ডেটা রিসেট করুন',
    areYouSure: 'আপনি কি নিশ্চিত যে আপনি সমস্ত পরিসংখ্যান রিসেট করতে চান?',
    yes: 'হ্যাঁ',
    no: 'না',
    close: 'বন্ধ করুন',
    dir: 'ltr',
    changeDhikrTitle: 'জিকির পরিবর্তন করা হচ্ছে। আপনি কি কাউন্টারটি রিসেট করতে চান?',
    resetAndContinue: 'রিসেট করুন এবং চালিয়ে যান',
    continueWithCurrent: 'বর্তমান সংখ্যার সাথে চালিয়ে যান',
    cancel: 'বাতিল করুন',
    resetCounterTitle: 'আপনি কি নিশ্চিত যে আপনি কাউন্টারটি রিসেট করতে চান?'
  },
  ur: {
    stats: 'کل ذکر',
    daily: 'روزانہ',
    weekly: 'ہفتہ وار',
    monthly: 'ماہانہ',
    allTime: 'ہر وقت',
    resetData: 'ڈیٹا ری سیٹ کریں',
    areYouSure: 'کیا آپ واقعی تمام شماریات کو ری سیٹ کرنا چاہتے ہیں؟',
    yes: 'ہاں',
    no: 'نہیں',
    close: 'بند کریں',
    dir: 'rtl',
    changeDhikrTitle: 'ذکر تبدیل کیا جا رہا ہے۔ کیا آپ کاؤنٹر کو ری سیٹ کرنا چاہتے ہیں؟',
    resetAndContinue: 'ری سیٹ کریں اور جاری رکھیں',
    continueWithCurrent: 'موجودہ گنتی کے ساتھ جاری رکھیں',
    cancel: 'منسوخ کریں',
    resetCounterTitle: 'کیا آپ واقعی کاؤنٹر کو ری سیٹ کرنا چاہتے ہیں؟'
  }
};

const TRANSLATIONS: Record<Language, { name: string, dhikrs: string[] }> = {
  tr: {
    name: 'Türkçe',
    dhikrs: [
      "Allahuekber",
      "Elhamdülillah",
      "Subhanallah",
      "Allahümme salli ala seyyidina Muhammed"
    ]
  },
  ar: {
    name: 'العربية',
    dhikrs: [
      "الله أكبر",
      "الحمد لله",
      "سبحان الله",
      "اللهم صل على سيدنا محمد"
    ]
  },
  bn: {
    name: 'বাংলা',
    dhikrs: [
      "আল্লাহু আকবার",
      "আলহামদুলিল্লাহ",
      "সুবহানাল্লাহ",
      "আল্লাহুম্মা সাল্লি আলা সাইয়্যিদিনা মুহাম্মদ"
    ]
  },
  ur: {
    name: 'اردو',
    dhikrs: [
      "اللہ اکبر",
      "الحمدللہ",
      "سبحان اللہ",
      "اللهم صل على سیدنا محمد"
    ]
  }
};

export default function DhikrCounter() {
  const [language, setLanguage] = useState<Language>('tr');
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(TRANSLATIONS['tr'].dhikrs[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingDhikr, setPendingDhikr] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [bgColor, setBgColor] = useState('green');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [stats, setStats] = useState<StatsData>({});
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [statsTab, setStatsTab] = useState<'daily' | 'weekly' | 'monthly' | 'allTime'>('daily');
  const [isStatsResetDialogOpen, setIsStatsResetDialogOpen] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect lint error
    const timer = setTimeout(() => {
      setIsMounted(true);
      const savedCount = localStorage.getItem('dhikr_count');
      const savedDhikr = localStorage.getItem('dhikr_selected');
      const savedBg = localStorage.getItem('dhikr_bg_color');
      const savedLang = localStorage.getItem('dhikr_language') as Language;
      const savedStats = localStorage.getItem('dhikr_stats');
      
      let currentLang: Language = 'tr';
      if (savedLang && TRANSLATIONS[savedLang]) {
        currentLang = savedLang;
        setLanguage(savedLang);
      }
      
      if (savedCount) setCount(parseInt(savedCount, 10));
      if (savedDhikr && TRANSLATIONS[currentLang].dhikrs.includes(savedDhikr)) {
        setSelectedDhikr(savedDhikr);
      } else {
        setSelectedDhikr(TRANSLATIONS[currentLang].dhikrs[0]);
      }
      if (savedBg) setBgColor(savedBg);
      if (savedStats) {
        try {
          setStats(JSON.parse(savedStats));
        } catch (e) {}
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save data on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('dhikr_count', count.toString());
      localStorage.setItem('dhikr_selected', selectedDhikr);
      localStorage.setItem('dhikr_bg_color', bgColor);
      localStorage.setItem('dhikr_language', language);
    }
  }, [count, selectedDhikr, bgColor, language, isMounted]);

  // Save stats on change
  useEffect(() => {
    if (isMounted && Object.keys(stats).length > 0) {
      localStorage.setItem('dhikr_stats', JSON.stringify(stats));
    }
  }, [stats, isMounted]);

  const getThemeStyles = (color: string) => {
    switch(color) {
      case 'red': return { backgroundColor: '#4A1C1C', color: '#F5E6E6' };
      case 'white': return { backgroundColor: '#F5F5F5', color: '#1A1A1A' };
      case 'black': return { backgroundColor: '#000000', color: '#F5F5F5' };
      case 'green':
      default: return { backgroundColor: '#1A2E24', color: '#E8E3D2' };
    }
  };

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

    const todayStr = new Date().toISOString().split('T')[0];
    const dhikrIndex = TRANSLATIONS[language].dhikrs.indexOf(selectedDhikr);
    
    if (dhikrIndex !== -1) {
      setStats(prev => {
        const currentDhikrStats = prev[dhikrIndex] || {};
        const currentCount = currentDhikrStats[todayStr] || 0;
        
        return {
          ...prev,
          [dhikrIndex]: {
            ...currentDhikrStats,
            [todayStr]: currentCount + 1
          }
        };
      });
    }
  };

  const getStatsForTab = (dhikrIndex: number, tab: string) => {
    const dhikrStats = stats[dhikrIndex] || {};
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayDate = new Date(todayStr);
    let total = 0;

    if (tab === 'allTime') {
      Object.values(dhikrStats).forEach(count => total += count);
      return total;
    }

    Object.entries(dhikrStats).forEach(([dateStr, count]) => {
      const d = new Date(dateStr);
      if (tab === 'daily') {
        if (dateStr === todayStr) {
          total += count;
        }
      } else if (tab === 'weekly') {
        const diffTime = todayDate.getTime() - d.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays >= 0 && diffDays < 7) {
          total += count;
        }
      } else if (tab === 'monthly') {
        if (d.getMonth() === todayDate.getMonth() && d.getFullYear() === todayDate.getFullYear()) {
          total += count;
        }
      }
    });

    return total;
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

  const handleLanguageChange = (newLang: Language) => {
    const currentIndex = TRANSLATIONS[language].dhikrs.indexOf(selectedDhikr);
    setLanguage(newLang);
    if (currentIndex !== -1) {
      setSelectedDhikr(TRANSLATIONS[newLang].dhikrs[currentIndex]);
    } else {
      setSelectedDhikr(TRANSLATIONS[newLang].dhikrs[0]);
    }
    setIsLangDropdownOpen(false);
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#1A2E24]" />;
  }

  return (
    <div 
      className="min-h-screen selection:bg-[#D4C3A3] selection:text-[#1A2E24] flex flex-col items-center justify-between py-12 px-6 overflow-hidden relative transition-colors duration-500"
      style={getThemeStyles(bgColor)}
    >
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#112018] to-transparent opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#112018] to-transparent opacity-50 pointer-events-none" />
      
      {/* Top Left Color Picker */}
      <div className="absolute top-6 left-6 z-40 flex gap-2 bg-black/20 p-2 rounded-full backdrop-blur-sm border border-white/10 shadow-lg">
        {[
          { id: 'green', hex: '#1A2E24' },
          { id: 'red', hex: '#4A1C1C' },
          { id: 'white', hex: '#F5F5F5' },
          { id: 'black', hex: '#000000' }
        ].map(color => (
          <button
            key={color.id}
            onClick={() => setBgColor(color.id)}
            className={`w-6 h-6 rounded-full shadow-sm transition-transform ${bgColor === color.id ? 'scale-125 border-2 border-white/70' : 'border border-white/20 hover:scale-110'}`}
            style={{ backgroundColor: color.hex }}
            aria-label={`${color.id} arka plan`}
          />
        ))}
      </div>

      {/* Bottom Left Language Selector */}
      <div className="absolute bottom-6 left-6 z-40">
        <div className="relative">
          <AnimatePresence>
            {isLangDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-0 mb-3 bg-[#1A2E24] border border-[#3A5A4A] rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[140px]"
              >
                {(Object.keys(TRANSLATIONS) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full text-left px-4 py-3 font-sans text-sm hover:bg-[#233B2F] transition-colors ${language === lang ? 'text-[#D4C3A3] bg-[#233B2F]/50' : 'text-[#A0B0A5]'}`}
                  >
                    {TRANSLATIONS[lang].name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center gap-2 p-3 rounded-full bg-[#233B2F]/50 text-[#A0B0A5] hover:text-[#D4C3A3] hover:bg-[#2A4538] transition-colors border border-[#3A5A4A]/50 backdrop-blur-sm shadow-lg"
            aria-label="Dil Seçimi"
          >
            <Globe className="w-6 h-6" />
            <span className="text-sm font-medium uppercase pr-1">{language}</span>
          </button>
        </div>
      </div>

      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 z-40 flex gap-3">
        <button
          onClick={() => setIsStatsOpen(true)}
          className="flex items-center gap-2 p-3 rounded-full bg-[#233B2F]/50 text-[#A0B0A5] hover:text-[#D4C3A3] hover:bg-[#2A4538] transition-colors border border-[#3A5A4A]/50 backdrop-blur-sm shadow-lg"
          aria-label={UI_TRANSLATIONS[language].stats}
          title={UI_TRANSLATIONS[language].stats}
        >
          <span className="text-sm font-medium hidden sm:block pl-1">{UI_TRANSLATIONS[language].stats}</span>
          <BarChart2 className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsResetDialogOpen(true)}
          className="p-3 rounded-full bg-[#233B2F]/50 text-[#A0B0A5] hover:text-[#D4C3A3] hover:bg-[#2A4538] transition-colors border border-[#3A5A4A]/50 backdrop-blur-sm shadow-lg"
          aria-label="Sıfırla"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

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
                {TRANSLATIONS[language].dhikrs.map((dhikr, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (dhikr !== selectedDhikr) {
                        setPendingDhikr(dhikr);
                      }
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-center px-6 py-5 font-serif text-xl hover:bg-[#233B2F] transition-colors ${selectedDhikr === dhikr ? 'text-[#D4C3A3] bg-[#233B2F]/50' : 'text-[#A0B0A5]'} ${idx !== TRANSLATIONS[language].dhikrs.length - 1 ? 'border-b border-[#3A5A4A]/30' : ''}`}
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
            className="text-8xl md:text-9xl font-light tracking-tighter"
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={UI_TRANSLATIONS[language].dir}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1A2E24] border border-[#3A5A4A] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <h3 className="text-xl font-serif text-[#D4C3A3] text-center leading-relaxed">
                {UI_TRANSLATIONS[language].changeDhikrTitle}
              </h3>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => confirmDhikrChange(true)}
                  className="w-full py-4 px-4 bg-[#D4C3A3] hover:bg-[#E8E3D2] text-[#1A2E24] font-medium rounded-2xl transition-colors shadow-lg"
                >
                  {UI_TRANSLATIONS[language].resetAndContinue}
                </button>
                <button
                  onClick={() => confirmDhikrChange(false)}
                  className="w-full py-4 px-4 bg-[#2A4538] hover:bg-[#3A5A4A] text-[#D4C3A3] font-medium rounded-2xl transition-colors"
                >
                  {UI_TRANSLATIONS[language].continueWithCurrent}
                </button>
                <button
                  onClick={() => setPendingDhikr(null)}
                  className="w-full py-3 px-4 text-[#A0B0A5] hover:text-white rounded-2xl transition-colors mt-1"
                >
                  {UI_TRANSLATIONS[language].cancel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {isResetDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={UI_TRANSLATIONS[language].dir}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1A2E24] border border-[#3A5A4A] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <h3 className="text-xl font-serif text-[#D4C3A3] text-center leading-relaxed">
                {UI_TRANSLATIONS[language].resetCounterTitle}
              </h3>
              
              <div className="flex gap-3">
                <button
                  onClick={executeReset}
                  className="flex-1 py-4 px-4 bg-[#D4C3A3] hover:bg-[#E8E3D2] text-[#1A2E24] font-medium rounded-2xl transition-colors shadow-lg"
                >
                  {UI_TRANSLATIONS[language].yes}
                </button>
                <button
                  onClick={() => setIsResetDialogOpen(false)}
                  className="flex-1 py-4 px-4 bg-[#2A4538] hover:bg-[#3A5A4A] text-[#D4C3A3] font-medium rounded-2xl transition-colors"
                >
                  {UI_TRANSLATIONS[language].no}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {isStatsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={UI_TRANSLATIONS[language].dir}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1A2E24] border border-[#3A5A4A] rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-[#D4C3A3]">{UI_TRANSLATIONS[language].stats}</h2>
                <button onClick={() => setIsStatsOpen(false)} className="p-2 text-[#A0B0A5] hover:text-[#D4C3A3] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#233B2F] rounded-xl p-1 mb-6">
                {['daily', 'weekly', 'monthly', 'allTime'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatsTab(tab as any)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${statsTab === tab ? 'bg-[#3A5A4A] text-[#D4C3A3] shadow' : 'text-[#A0B0A5] hover:text-[#D4C3A3]'}`}
                  >
                    {UI_TRANSLATIONS[language][tab as keyof typeof UI_TRANSLATIONS[Language]]}
                  </button>
                ))}
              </div>

              {/* Stats List */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3A5A4A transparent' }}>
                {TRANSLATIONS[language].dhikrs.map((dhikr, idx) => (
                  <div key={idx} className="bg-[#233B2F]/50 border border-[#3A5A4A]/50 rounded-2xl p-4">
                    <p className="font-serif text-[#D4C3A3] text-lg mb-2 leading-snug">{dhikr}</p>
                    <p className="text-3xl font-sans font-light text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {getStatsForTab(idx, statsTab).toLocaleString(language === 'ar' ? 'ar-EG' : language === 'bn' ? 'bn-BD' : language === 'ur' ? 'ur-PK' : 'tr-TR')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reset Stats Button */}
              <button
                onClick={() => setIsStatsResetDialogOpen(true)}
                className="mt-6 w-full py-4 rounded-2xl border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                {UI_TRANSLATIONS[language].resetData}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Stats Confirmation Dialog */}
      <AnimatePresence>
        {isStatsResetDialogOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={UI_TRANSLATIONS[language].dir}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1A2E24] border border-[#3A5A4A] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <h3 className="text-xl font-serif text-[#D4C3A3] text-center leading-relaxed">
                {UI_TRANSLATIONS[language].areYouSure}
              </h3>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStats({});
                    localStorage.removeItem('dhikr_stats');
                    setIsStatsResetDialogOpen(false);
                  }}
                  className="flex-1 py-4 px-4 bg-[#D4C3A3] hover:bg-[#E8E3D2] text-[#1A2E24] font-medium rounded-2xl transition-colors shadow-lg"
                >
                  {UI_TRANSLATIONS[language].yes}
                </button>
                <button
                  onClick={() => setIsStatsResetDialogOpen(false)}
                  className="flex-1 py-4 px-4 bg-[#2A4538] hover:bg-[#3A5A4A] text-[#D4C3A3] font-medium rounded-2xl transition-colors"
                >
                  {UI_TRANSLATIONS[language].no}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
