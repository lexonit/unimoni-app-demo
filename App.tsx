
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronLeft, 
  Globe, 
  TrendingUp,
  CheckCircle2,
  X,
  ArrowLeft,
  Zap,
  Gift,
  BadgePercent,
  Sparkles,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { FlowStep, Beneficiary, TransferDetails } from './types';
import { MOCK_BENEFICIARIES, EXCHANGE_RATES } from './constants';
import { translations } from './translations';
import Keypad from './components/Keypad';
import StepIndicator from './components/StepIndicator';

type Language = 'en' | 'ar';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [step, setStep] = useState<FlowStep>(FlowStep.WELCOME);
  const [idNumber, setIdNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [amount, setAmount] = useState('0');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [transferDetails, setTransferDetails] = useState<TransferDetails | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const t = translations[lang];
  const isRTL = lang === 'ar';

  const promos = [
    { 
      icon: BadgePercent, 
      title: t.promo1Title, 
      desc: t.promo1Desc, 
      color: 'from-[#003D7E] to-[#00ADEF]', 
      bg: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000' 
    },
    { 
      icon: Zap, 
      title: t.promo2Title, 
      desc: t.promo2Desc, 
      color: 'from-[#00ADEF] to-[#003D7E]', 
      bg: 'https://images.unsplash.com/photo-1611974714158-f88c1465794e?auto=format&fit=crop&q=80&w=1000' 
    },
    { 
      icon: Gift, 
      title: t.promo3Title, 
      desc: t.promo3Desc, 
      color: 'from-[#003D7E] via-[#00ADEF] to-[#003D7E]', 
      bg: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1000' 
    }
  ];

  const pageTransition = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.25, ease: "easeOut" }
  };

  useEffect(() => {
    if (step === FlowStep.WELCOME) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % promos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [step, promos.length]);

  useEffect(() => {
    if (selectedBeneficiary) {
      setTargetCurrency(selectedBeneficiary.currency);
    }
  }, [selectedBeneficiary]);

  const handleKeypadPress = (key: string) => {
    if (step === FlowStep.LOGIN) {
      if (idNumber.length < 12) setIdNumber(prev => prev + key);
    } else if (step === FlowStep.OTP) {
      if (otp.length < 4) setOtp(prev => prev + key);
    } else if (step === FlowStep.AMOUNT) {
      if (key === '.' && amount.includes('.')) return;
      if (amount === '0' && key !== '.') setAmount(key);
      else if (amount.length < 7) setAmount(prev => prev + key);
    }
  };

  const handleKeypadDelete = () => {
    if (step === FlowStep.LOGIN) setIdNumber(prev => prev.slice(0, -1));
    else if (step === FlowStep.OTP) setOtp(prev => prev.slice(0, -1));
    else if (step === FlowStep.AMOUNT) {
      if (amount.length === 1) setAmount('0');
      else setAmount(prev => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    if (otp.length === 4) {
      const timer = setTimeout(() => setStep(FlowStep.BENEFICIARY), 300);
      return () => clearTimeout(timer);
    }
  }, [otp]);

  const calculateTransfer = () => {
    if (!selectedBeneficiary) return;
    const sendAmount = parseFloat(amount);
    const rate = EXCHANGE_RATES[targetCurrency];
    const fee = 0.500; 
    setTransferDetails({
      beneficiary: { ...selectedBeneficiary, currency: targetCurrency },
      amount: sendAmount,
      exchangeRate: rate,
      fee: fee,
      totalPayable: sendAmount + fee,
      receiverGets: sendAmount * rate
    });
    setStep(FlowStep.REVIEW);
  };

  const resetFlow = () => {
    setStep(FlowStep.WELCOME);
    setIdNumber('');
    setOtp('');
    setSelectedBeneficiary(null);
    setAmount('0');
    setTargetCurrency('INR');
    setTransferDetails(null);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <div className={`h-full w-full flex flex-col bg-slate-50 relative overflow-hidden text-slate-900 select-none ${isRTL ? 'font-[Cairo]' : 'font-[Inter]'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white px-4 md:px-8 py-2 md:py-4 flex items-center justify-between z-40 shrink-0 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
            <button 
              onClick={() => {
                if (step === FlowStep.LOGIN) setStep(FlowStep.WELCOME);
                else if (step === FlowStep.OTP) setStep(FlowStep.LOGIN);
                else if (step === FlowStep.BENEFICIARY) setStep(FlowStep.LOGIN);
                else if (step === FlowStep.AMOUNT) setStep(FlowStep.BENEFICIARY);
                else if (step === FlowStep.REVIEW) setStep(FlowStep.AMOUNT);
              }}
              className="p-1.5 md:p-2 rounded-lg bg-slate-50 text-[#003D7E] active:scale-90 transition-all"
            >
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
          <div className="flex flex-col">
            <img 
                src={'/logo.svg'} 
                alt="Unimoni Logo" 
                className="h-8 lg:h-12 w-auto mb-1" 
                style={{ maxWidth: 140 }}
              />
            </div>
        </div>
        
        <button 
          onClick={toggleLang}
          className="flex items-center gap-1.5 text-slate-700 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-slate-200 shadow-sm active:scale-95 transition-all"
        >
          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#00ADEF]" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{lang === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
        {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
          <div className="px-4 pt-4 shrink-0">
            <StepIndicator currentStep={step} isRTL={isRTL} />
          </div>
        )}
        
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {/* WELCOME SCREEN */}
            {step === FlowStep.WELCOME && (
              <motion.div 
                key="welcome" 
                {...pageTransition} 
                className="h-full w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-6 md:px-12 overflow-hidden"
              >
                <div className="flex flex-col justify-center text-center md:text-left md:w-1/2 shrink-0">
                  <div className="inline-flex items-center gap-2 bg-[#00ADEF]/10 px-3 py-1.5 rounded-full w-fit mb-4 mx-auto md:mx-0 border border-[#00ADEF]/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#00ADEF]" />
                    <span className="text-[8px] md:text-[10px] font-black text-[#003D7E] uppercase tracking-widest">Global Kiosk Network</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 leading-[0.9] tracking-tighter">
                    <span className="text-[#003D7E]">{t.welcomeTitle}</span> <br />
                    <span className="text-[#00ADEF]">{t.welcomeTitleAccent}</span>
                  </h2>
                  <p className="text-sm md:text-lg text-slate-500 mb-6 md:mb-10 font-medium max-w-sm md:max-w-md">
                    {t.welcomeDesc}
                  </p>
                  <button onClick={() => setStep(FlowStep.LOGIN)} className="flex items-center justify-center gap-4 bg-[#003D7E] text-white px-8 py-4 md:px-10 md:py-6 rounded-2xl md:rounded-[32px] text-lg md:text-2xl font-black shadow-xl active:scale-95 transition-all w-full md:w-fit">
                    {t.startBtn}
                    {isRTL ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                  </button>
                </div>

                <div className="relative w-full md:w-1/2 h-[200px] md:h-full flex flex-col justify-center py-4 md:py-8 min-h-0">
                  <div className="relative flex-1 overflow-hidden rounded-3xl md:rounded-[40px] shadow-2xl border-[4px] md:border-[8px] border-white">
                    <AnimatePresence mode="wait">
                      <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 bg-gradient-to-br ${promos[currentSlide].color}`}>
                        <img src={promos[currentSlide].bg} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
                          <h3 className="text-lg md:text-3xl font-black text-white mb-1 uppercase leading-tight">{promos[currentSlide].title}</h3>
                          <p className="text-[10px] md:text-base font-bold text-white/80 uppercase tracking-widest">{promos[currentSlide].desc}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AMOUNT SCREEN - STRICT VERTICAL OPTIMIZATION */}
            {step === FlowStep.AMOUNT && (
              <motion.div 
                key="amount" 
                {...pageTransition} 
                className="h-full w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 px-4 md:px-8 lg:px-12 overflow-hidden"
              >
                {/* Left Side (Display) */}
                <div className="flex flex-col flex-1 w-full md:max-w-md space-y-3 md:space-y-4 shrink min-h-0">
                  <div className="bg-white border-2 md:border-4 border-[#003D7E] rounded-2xl md:rounded-[32px] p-4 md:p-6 shadow-md flex flex-col justify-center">
                    <label className="text-[8px] md:text-[10px] font-black text-[#00ADEF] uppercase tracking-widest mb-1 md:mb-2">
                      {t.amountLabel}
                    </label>
                    <div className="flex items-center justify-between" dir="ltr">
                      <span className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-none truncate">
                        {amount}
                      </span>
                      <span className="text-sm md:text-xl lg:text-3xl font-black text-slate-300 ml-2 shrink-0">
                        OMR
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#00ADEF]/5 rounded-2xl md:rounded-[32px] p-4 md:p-6 border border-[#00ADEF]/10 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {t.recipientGets}
                      </label>
                      <div className="relative">
                        <select 
                          value={targetCurrency}
                          onChange={(e) => setTargetCurrency(e.target.value)}
                          className="appearance-none bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] md:text-xs font-black text-[#003D7E] pr-6 focus:outline-none"
                        >
                          {Object.keys(EXCHANGE_RATES).map(curr => (
                            <option key={curr} value={curr}>{curr}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2" dir="ltr">
                      <span className="text-2xl md:text-4xl lg:text-5xl font-black text-[#00ADEF] leading-none truncate">
                        {(parseFloat(amount) * EXCHANGE_RATES[targetCurrency]).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs md:text-lg font-black text-[#00ADEF]/50 shrink-0">
                        {targetCurrency}
                      </span>
                    </div>
                  </div>

                  <button 
                    disabled={parseFloat(amount) <= 0}
                    onClick={calculateTransfer}
                    className={`hidden md:flex w-full py-4 lg:py-6 rounded-2xl items-center justify-center text-xl lg:text-2xl font-black transition-all transform active:scale-95 ${
                      parseFloat(amount) > 0 ? 'bg-[#003D7E] text-white shadow-xl' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {t.nextStep}
                  </button>
                </div>

                {/* Right Side (Keypad) */}
                <div className="w-full md:max-w-[280px] lg:max-w-[360px] shrink-0">
                  <div className="p-2 md:p-3 bg-white/50 rounded-2xl md:rounded-[40px] border border-white/60 shadow-sm">
                    <Keypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} compact />
                  </div>
                  <button 
                    disabled={parseFloat(amount) <= 0}
                    onClick={calculateTransfer}
                    className={`md:hidden mt-3 w-full py-4 rounded-xl text-lg font-black transition-all ${
                      parseFloat(amount) > 0 ? 'bg-[#003D7E] text-white shadow-lg' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {t.nextStep}
                  </button>
                </div>
              </motion.div>
            )}

            {/* LOGIN & OTP */}
            {(step === FlowStep.LOGIN || step === FlowStep.OTP) && (
              <motion.div key={step} {...pageTransition} className="h-full w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-6 md:px-12 overflow-hidden">
                <div className="w-full md:max-w-md shrink-0 text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-black text-[#003D7E] mb-1 tracking-tighter leading-none">{step === FlowStep.LOGIN ? t.loginTitle : t.otpTitle}</h2>
                  <p className="text-sm md:text-lg text-slate-500 mb-4 md:mb-6 font-medium">{step === FlowStep.LOGIN ? t.loginDesc : t.otpDesc}</p>
                  
                  <div className="bg-white border-2 border-slate-100 rounded-2xl md:rounded-[32px] p-4 md:p-8 shadow-xl mb-4 md:mb-6 border-b-[#00ADEF] border-b-4 md:border-b-8">
                    {step === FlowStep.LOGIN ? (
                      <>
                        <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 md:mb-2">{t.idLabel}</label>
                        <div className="text-2xl md:text-4xl lg:text-5xl font-mono tracking-widest text-[#003D7E] h-10 md:h-16 flex items-center justify-center md:justify-start">
                          {idNumber || <span className="text-slate-100">••••••••••••</span>}
                          <span className="w-1 h-8 md:h-10 bg-[#00ADEF] mx-1 md:mx-2 animate-pulse rounded-full" />
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-2 md:gap-4 justify-center md:justify-start" dir="ltr">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`w-12 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 rounded-xl border-2 md:border-4 flex items-center justify-center text-xl md:text-4xl lg:text-6xl font-black transition-all ${otp[i] ? 'border-[#003D7E] bg-slate-50 text-[#003D7E]' : 'border-slate-50 bg-slate-50 text-slate-100'}`}>
                            {otp[i] || ''}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    disabled={step === FlowStep.LOGIN ? idNumber.length < 8 : otp.length < 4} 
                    onClick={() => setStep(step === FlowStep.LOGIN ? FlowStep.OTP : FlowStep.BENEFICIARY)} 
                    className={`hidden md:block w-full py-4 md:py-6 rounded-2xl text-xl font-black transition-all transform active:scale-95 ${(step === FlowStep.LOGIN ? idNumber.length >= 8 : otp.length >= 4) ? 'bg-[#003D7E] text-white shadow-xl' : 'bg-slate-200 text-slate-400'}`}
                  >
                    {step === FlowStep.LOGIN ? t.verifyBtn : t.verifyProceedBtn}
                  </button>
                </div>
                
                <div className="w-full md:max-w-[280px] lg:max-w-[360px] shrink-0">
                  <div className="p-2 md:p-3 bg-white/50 rounded-2xl md:rounded-[40px] border border-white/60 shadow-sm">
                    <Keypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} compact />
                  </div>
                  <button 
                    disabled={step === FlowStep.LOGIN ? idNumber.length < 8 : otp.length < 4} 
                    onClick={() => setStep(step === FlowStep.LOGIN ? FlowStep.OTP : FlowStep.BENEFICIARY)} 
                    className={`md:hidden mt-3 w-full py-4 rounded-xl text-lg font-black transition-all transform active:scale-95 ${(step === FlowStep.LOGIN ? idNumber.length >= 8 : otp.length >= 4) ? 'bg-[#003D7E] text-white shadow-xl' : 'bg-slate-200 text-slate-400'}`}
                  >
                    {step === FlowStep.LOGIN ? t.verifyBtn : t.verifyProceedBtn}
                  </button>
                </div>
              </motion.div>
            )}

            {/* BENEFICIARY */}
            {step === FlowStep.BENEFICIARY && (
              <motion.div key="beneficiary" {...pageTransition} className="h-full w-full flex flex-col px-6 md:px-12 overflow-hidden">
                <div className="shrink-0 mb-3 mt-1">
                  <h2 className="text-3xl md:text-5xl font-black text-[#003D7E] tracking-tighter leading-none">{t.recipientTitle}</h2>
                  <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5">{t.recipientSub}</p>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pe-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-4 min-h-0">
                  {MOCK_BENEFICIARIES.map((ben) => (
                    <button 
                      key={ben.id} 
                      onClick={() => { setSelectedBeneficiary(ben); setStep(FlowStep.AMOUNT); }} 
                      className="flex items-center p-3 md:p-4 bg-white border border-slate-100 rounded-2xl md:rounded-[28px] shadow-sm active:scale-95 transition-all text-left"
                    >
                      <img src={ben.avatar} className={`w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full border-2 md:border-4 border-slate-50 object-cover ${isRTL ? 'ml-3 md:ml-4' : 'mr-3 md:mr-4'}`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-lg lg:text-2xl font-black text-slate-800 truncate leading-tight">{ben.name}</h3>
                        <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate mb-1">{ben.bankName}</p>
                        <span className="inline-block text-[7px] md:text-[9px] px-2 py-0.5 bg-blue-50 text-[#003D7E] rounded-full font-black uppercase tracking-wider">{ben.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* REVIEW */}
            {step === FlowStep.REVIEW && transferDetails && (
              <motion.div key="review" {...pageTransition} className="h-full w-full flex flex-col items-center justify-center px-6 md:px-12 overflow-hidden">
                <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90%] md:max-h-[85%]">
                  <div className="bg-[#003D7E] p-4 md:p-8 text-white text-center shrink-0">
                    <p className="text-blue-200 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">{t.totalDisb}</p>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none" dir="ltr">
                      {transferDetails.receiverGets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      <span className="text-xs md:text-xl ml-2 opacity-60 font-bold">{transferDetails.beneficiary?.currency}</span>
                    </h2>
                  </div>
                  
                  <div className="p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
                      <img src={transferDetails.beneficiary?.avatar} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-slate-50 shadow-md object-cover" />
                      <div>
                        <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-0.5">{t.recipientLabel}</p>
                        <p className="text-base md:text-2xl font-black text-slate-800 truncate">{transferDetails.beneficiary?.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:space-y-4">
                      {[
                        { label: t.sentLabel, val: `${transferDetails.amount.toFixed(3)} OMR` },
                        { label: t.feeLabel, val: `${transferDetails.fee.toFixed(3)} OMR` },
                        { label: t.rateLabel, val: `1 = ${transferDetails.exchangeRate} ${transferDetails.beneficiary?.currency}`, primary: true }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs md:text-lg font-black">
                          <span className="text-slate-300 uppercase tracking-wider">{item.label}</span>
                          <span className={`${item.primary ? 'text-[#00ADEF]' : 'text-slate-700'}`}>{item.val}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t-2 border-dashed border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] md:text-base font-black text-[#003D7E] uppercase tracking-widest">{t.netPayable}</span>
                      <span className="text-xl md:text-3xl font-black text-[#003D7E]">{transferDetails.totalPayable.toFixed(3)} <span className="text-[10px] md:text-sm opacity-50">OMR</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 md:gap-6 w-full max-w-2xl mt-4 md:mt-6 shrink-0">
                  <button onClick={() => setStep(FlowStep.AMOUNT)} className="flex-1 py-3 md:py-5 bg-white border border-slate-100 text-slate-700 rounded-xl md:rounded-[24px] text-xs md:text-lg font-black shadow-sm active:scale-95">{t.edit}</button>
                  <button onClick={() => setStep(FlowStep.SUCCESS)} className="flex-[2] py-3 md:py-5 bg-[#003D7E] text-white rounded-xl md:rounded-[24px] text-xs md:text-lg font-black shadow-xl active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
                    {t.sendNow} 
                    {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === FlowStep.SUCCESS && (
              <motion.div key="success" {...pageTransition} className="h-full w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="w-16 h-16 md:w-32 md:h-32 bg-green-50 rounded-2xl md:rounded-[40px] flex items-center justify-center mb-4 shadow-lg border-2 md:border-4 border-white">
                  <CheckCircle2 className="w-10 h-10 md:w-20 text-green-600" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-[#003D7E] mb-1 tracking-tighter">{t.doneTitle}</h2>
                <p className="text-sm md:text-lg text-slate-400 mb-4 md:mb-8 font-bold max-w-md leading-tight">
                  {t.doneDesc} <br />
                  <span className="text-[#00ADEF] underline decoration-2 decoration-[#00ADEF]/10">{transferDetails?.beneficiary?.name}</span>
                </p>
                
                <div className="bg-white border border-slate-50 rounded-2xl md:rounded-[32px] p-4 md:p-8 shadow-xl mb-6 md:mb-10 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-300 font-black uppercase text-[8px] md:text-sm tracking-widest">{t.refId}</span>
                    <span className="text-slate-800 font-mono font-black text-xs md:text-xl tracking-widest bg-slate-50 px-3 py-1 rounded-lg">UNI-778-99</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <span className="text-slate-300 font-black uppercase text-[8px] md:text-sm tracking-widest">{t.settledAmt}</span>
                    <span className="text-xl md:text-4xl font-black text-[#003D7E]">{transferDetails?.amount.toFixed(3)} <span className="text-[10px] md:text-lg opacity-30">OMR</span></span>
                  </div>
                </div>
                
                <button onClick={resetFlow} className="w-full max-w-md py-4 md:py-6 bg-[#003D7E] text-white rounded-xl md:rounded-[24px] text-lg md:text-2xl font-black shadow-xl active:scale-95">{t.closeSession}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-3 md:py-4 px-6 md:px-8 flex items-center justify-between z-40 shrink-0 border-t border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[8px] md:text-[10px] font-black opacity-80 uppercase tracking-widest">{t.encrypted}</span>
          </div>
          <span className="hidden sm:block text-[8px] md:text-[10px] font-black opacity-30 uppercase tracking-widest">{t.kioskId}: MUSCAT-772</span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
             <button onClick={resetFlow} className="flex items-center gap-1.5 text-red-400 font-black uppercase text-[8px] md:text-[10px] tracking-widest bg-red-500/10 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
               <X size={12} />
               <span>{t.endSession}</span>
             </button>
          )}
          <span className="text-[8px] md:text-[10px] opacity-20 font-mono font-bold">{t.ver}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
