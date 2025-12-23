import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronLeft, 
  HelpCircle, 
  Globe, 
  ShieldCheck, 
  Clock,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Users,
  X,
  ArrowLeft,
  Fingerprint,
  UserCheck,
  Zap,
  FileText,
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
    { icon: BadgePercent, title: t.promo1Title, desc: t.promo1Desc, color: 'from-blue-600 to-blue-800', bg: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000' },
    { icon: Zap, title: t.promo2Title, desc: t.promo2Desc, color: 'from-orange-500 to-red-600', bg: 'https://images.unsplash.com/photo-1611974714158-f88c1465794e?auto=format&fit=crop&q=80&w=1000' },
    { icon: Gift, title: t.promo3Title, desc: t.promo3Desc, color: 'from-indigo-600 to-purple-700', bg: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1000' }
  ];

  const pageTransition = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.3, ease: "easeOut" }
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
      else if (amount.length < 8) setAmount(prev => prev + key);
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
      const timer = setTimeout(() => setStep(FlowStep.BENEFICIARY), 400);
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

  const handleLoginContinue = () => {
    if (step === FlowStep.LOGIN) {
      setStep(FlowStep.OTP);
    } else if (step === FlowStep.OTP) {
      setStep(FlowStep.BENEFICIARY);
    }
  };

  return (
    <div className={`h-full w-full flex flex-col bg-white relative overflow-hidden text-slate-900 select-none ${isRTL ? 'font-[Cairo]' : 'font-[Inter]'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-2 sm:py-3 flex items-center justify-between z-30 shrink-0 border-b border-slate-100 safe-pt">
        <div className="flex items-center gap-2 sm:gap-4">
          {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
            <button 
              onClick={() => {
                if (step === FlowStep.LOGIN) setStep(FlowStep.WELCOME);
                else if (step === FlowStep.OTP) setStep(FlowStep.LOGIN);
                else if (step === FlowStep.BENEFICIARY) {
                  setOtp('');
                  setStep(FlowStep.LOGIN);
                }
                else if (step === FlowStep.AMOUNT) setStep(FlowStep.BENEFICIARY);
                else if (step === FlowStep.REVIEW) setStep(FlowStep.AMOUNT);
              }}
              className="p-1 sm:p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              {isRTL ? <ChevronRight className="w-5 h-5 sm:w-7 h-7 text-blue-900" /> : <ChevronLeft className="w-5 h-5 sm:w-7 h-7 text-blue-900" />}
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
        
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-600 bg-slate-50 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full border border-slate-200 active:scale-95 transition-all"
          >
            <Globe className="w-3.5 h-3.5 sm:w-5 h-5 text-blue-500" />
            <span className="text-[10px] sm:text-sm font-bold">{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <HelpCircle className="w-5 h-5 sm:w-8 h-8 text-slate-200" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
        {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
          <div className="px-4 sm:px-8 lg:px-16 pt-2 shrink-0">
            <StepIndicator currentStep={step} isRTL={isRTL} />
          </div>
        )}
        
        <div className="flex-1 relative min-h-0 flex flex-col">
          <AnimatePresence mode="wait">
            {/* WELCOME SCREEN */}
            {step === FlowStep.WELCOME && (
              <motion.div 
                key="welcome" 
                {...pageTransition} 
                className="h-full w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12 px-6 lg:px-20 py-2 lg:py-4"
              >
                <div className="flex flex-col justify-center text-center lg:text-left w-full lg:w-1/2 max-w-2xl shrink-0">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full w-fit mb-2 sm:mb-4 mx-auto lg:mx-0 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 animate-pulse" />
                    <span className="text-[8px] sm:text-[10px] font-black text-blue-600 uppercase tracking-[0.15em]">Quick Transfer</span>
                  </motion.div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-black text-blue-950 mb-2 sm:mb-4 leading-[0.9] tracking-tighter"
                  >
                    {t.welcomeTitle} <br />
                    <span className="text-blue-500">{t.welcomeTitleAccent}</span>
                  </motion.h2>

                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs sm:text-base lg:text-lg xl:text-xl text-slate-500 mb-4 sm:mb-8 font-medium leading-tight sm:leading-relaxed"
                  >
                    {t.welcomeDesc}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button 
                      onClick={() => setStep(FlowStep.LOGIN)}
                      className="group relative flex items-center justify-center gap-2 sm:gap-4 bg-blue-600 text-white px-6 sm:px-10 lg:px-14 py-3 sm:py-5 lg:py-7 rounded-[18px] sm:rounded-[28px] lg:rounded-[40px] text-base sm:text-xl lg:text-2xl xl:text-3xl font-black shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all w-full lg:w-fit"
                    >
                      {t.startBtn}
                      {isRTL ? <ArrowLeft className="w-5 h-5 sm:w-8 sm:h-8 lg:w-10 lg:h-10" /> : <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
                    </button>
                  </motion.div>
                </div>

                <div className="relative w-full lg:w-1/2 flex-1 min-h-[200px] max-h-[250px] sm:max-h-[400px] lg:max-h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <div className={`relative w-full h-full rounded-[24px] sm:rounded-[36px] lg:rounded-[56px] overflow-hidden shadow-xl bg-gradient-to-br ${promos[currentSlide].color} border-[4px] sm:border-[8px] border-white`}>
                        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                          <img src={promos[currentSlide].bg} className="w-full h-full object-cover" alt="" />
                        </div>
                        
                        <div className="absolute inset-0 p-4 sm:p-8 lg:p-12 flex flex-col justify-end">
                          <motion.div 
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="w-8 h-8 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-xl rounded-[12px] sm:rounded-[20px] flex items-center justify-center mb-2 sm:mb-4 border border-white/20 shadow-lg"
                          >
                            {React.createElement(promos[currentSlide].icon, { className: "w-4 h-4 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" })}
                          </motion.div>
                          <motion.h3 
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-1 sm:mb-3 uppercase leading-none tracking-tighter"
                          >
                            {promos[currentSlide].title}
                          </motion.h3>
                          <motion.p 
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-[10px] sm:text-base lg:text-lg xl:text-xl font-bold text-white/80 uppercase tracking-[0.1em]"
                          >
                            {promos[currentSlide].desc}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute -bottom-4 lg:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
                    {promos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${
                          idx === currentSlide ? 'w-6 sm:w-10 bg-blue-600 lg:bg-white' : 'w-1 sm:w-1.5 bg-slate-200 lg:bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LOGIN & OTP SCREENS */}
            {(step === FlowStep.LOGIN || step === FlowStep.OTP) && (
              <motion.div key={step} {...pageTransition} className="h-full flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-12 px-4 sm:px-8">
                <div className="w-full max-w-md shrink-0 flex flex-col justify-center">
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-blue-950 mb-1 leading-tight">
                    {step === FlowStep.LOGIN ? t.loginTitle : t.otpTitle}
                  </h2>
                  <p className="text-[10px] sm:text-sm lg:text-base text-slate-500 mb-4 sm:mb-6 font-medium">
                    {step === FlowStep.LOGIN ? t.loginDesc : t.otpDesc}
                  </p>
                  
                  {step === FlowStep.LOGIN ? (
                    <div className="bg-white border sm:border-2 border-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6 transition-all focus-within:border-blue-500">
                      <label className="text-[8px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">{t.idLabel}</label>
                      <div className="text-xl sm:text-3xl lg:text-4xl font-mono tracking-[0.1em] text-blue-900 min-h-[30px] sm:min-h-[40px] flex items-center">
                        {idNumber || <span className="text-slate-100">••••••••••••</span>}
                        <span className="w-0.5 h-6 sm:h-8 bg-blue-500 mx-1 animate-pulse rounded-full"></span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center lg:justify-start" dir="ltr">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-10 h-14 sm:w-14 sm:h-20 rounded-lg sm:rounded-xl border flex items-center justify-center text-lg sm:text-2xl font-black transition-all ${
                          otp[i] ? 'border-blue-500 bg-white text-blue-600 shadow-md' : 'border-slate-100 bg-slate-50 text-slate-200'
                        }`}>
                          {otp[i] || ''}
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    disabled={step === FlowStep.LOGIN ? idNumber.length < 8 : otp.length < 4}
                    onClick={handleLoginContinue}
                    className={`w-full py-3 sm:py-5 rounded-lg sm:rounded-2xl text-base sm:text-xl font-black transition-all ${
                      (step === FlowStep.LOGIN ? idNumber.length >= 8 : otp.length >= 4)
                      ? 'bg-blue-600 text-white active:scale-95 shadow-lg' 
                      : 'bg-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    {step === FlowStep.LOGIN ? t.verifyBtn : t.verifyProceedBtn}
                  </button>
                </div>

                <div className="w-full max-w-xs lg:max-w-sm">
                  <Keypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} className="p-1 sm:p-2 bg-slate-100/10 rounded-2xl" />
                </div>
              </motion.div>
            )}

            {/* BENEFICIARY SCREEN */}
            {step === FlowStep.BENEFICIARY && (
              <motion.div key="beneficiary" {...pageTransition} className="h-full flex flex-col px-4 sm:px-8 overflow-hidden">
                <div className="shrink-0 mb-2 sm:mb-6">
                  <h2 className="text-lg sm:text-3xl lg:text-4xl font-black text-blue-950 truncate">{t.recipientTitle}</h2>
                  <p className="text-slate-400 text-[8px] sm:text-xs font-bold uppercase tracking-tight truncate">{t.recipientSub}</p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pe-1 sm:pe-3 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 pb-4 min-h-0">
                  {MOCK_BENEFICIARIES.map((ben) => (
                    <button 
                      key={ben.id}
                      onClick={() => { setSelectedBeneficiary(ben); setStep(FlowStep.AMOUNT); }}
                      className="group flex items-center p-3 sm:p-5 bg-white border border-slate-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all text-left relative overflow-hidden h-fit"
                    >
                      <img src={ben.avatar} className={`w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border border-slate-50 object-cover ${isRTL ? 'ml-3 sm:ml-4' : 'mr-3 sm:mr-4'} shadow-sm`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-lg lg:text-xl font-black text-slate-800 truncate mb-0.5">{ben.name}</h3>
                        <p className="text-[9px] sm:text-xs text-slate-400 font-bold mb-1 truncate">{ben.bankName}</p>
                        <span className="text-[7px] sm:text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-widest">{ben.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AMOUNT SCREEN */}
            {step === FlowStep.AMOUNT && (
              <motion.div key="amount" {...pageTransition} className="h-full flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 px-4 sm:px-8">
                <div className="w-full max-w-md shrink-0 flex flex-col">
                  <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-slate-50 shadow-sm">
                    <img src={selectedBeneficiary?.avatar} className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border border-slate-50 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-0.5">{t.sendingTo}</p>
                      <h2 className="text-xs sm:text-xl font-black text-blue-950 truncate leading-none mb-1">{selectedBeneficiary?.name}</h2>
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                        <TrendingUp className="w-2.5 h-2.5" />
                        <span className="text-[7px] sm:text-[10px] font-black">1 OMR = {EXCHANGE_RATES[targetCurrency]} {targetCurrency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-4">
                    <div className="bg-white border sm:border-2 border-blue-500 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg">
                      <label className="text-[8px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-0.5">{t.amountLabel}</label>
                      <div className="flex items-baseline gap-1.5" dir="ltr">
                        <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-none">{amount}</span>
                        <span className="text-xs sm:text-lg font-black text-slate-300">OMR</span>
                      </div>
                    </div>

                    <div className="bg-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.recipientGets}</label>
                        <div className="relative">
                          <select 
                            value={targetCurrency}
                            onChange={(e) => setTargetCurrency(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[9px] sm:text-xs font-black text-blue-600 pr-6 focus:outline-none shadow-sm"
                          >
                            {Object.keys(EXCHANGE_RATES).map(curr => (
                              <option key={curr} value={curr}>{curr}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-2.5 h-2.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1.5" dir="ltr">
                        <span className="text-xl sm:text-3xl lg:text-4xl font-black text-blue-600 leading-none">
                          {(parseFloat(amount) * EXCHANGE_RATES[targetCurrency]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] sm:text-base font-black text-blue-300">{targetCurrency}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={parseFloat(amount) <= 0}
                    onClick={calculateTransfer}
                    className={`w-full py-3 sm:py-5 mt-4 sm:mt-6 rounded-lg sm:rounded-2xl text-base sm:text-xl font-black transition-all ${
                      parseFloat(amount) > 0 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {t.nextStep}
                  </button>
                </div>

                <div className="w-full max-w-xs lg:max-w-sm shrink-0">
                  <Keypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} className="p-1" />
                </div>
              </motion.div>
            )}

            {/* REVIEW SCREEN */}
            {step === FlowStep.REVIEW && transferDetails && (
              <motion.div key="review" {...pageTransition} className="h-full flex flex-col items-center justify-center pb-2 px-4 sm:px-8 overflow-hidden">
                <div className="w-full max-w-xl bg-white rounded-2xl sm:rounded-[32px] shadow-xl overflow-hidden border border-slate-100 flex flex-col min-h-0">
                  <div className="bg-blue-600 p-4 sm:p-6 lg:p-8 text-white text-center shrink-0">
                    <p className="text-blue-100 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5">{t.totalDisb}</p>
                    <h2 className="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none" dir="ltr">
                      {transferDetails.receiverGets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      <span className="text-[10px] sm:text-xl ml-1.5 opacity-70 font-bold">{transferDetails.beneficiary?.currency}</span>
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <div className="flex items-center gap-2 sm:gap-4 pb-3 border-b border-slate-50">
                      <img src={transferDetails.beneficiary?.avatar} className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border border-slate-50 object-cover shadow-sm" />
                      <div className="min-w-0">
                        <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{t.recipientLabel}</p>
                        <p className="text-xs sm:text-lg lg:text-xl font-black text-slate-800 truncate">{transferDetails.beneficiary?.name}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2.5">
                      {[
                        { label: t.sentLabel, val: `${transferDetails.amount.toFixed(3)}` },
                        { label: t.feeLabel, val: `${transferDetails.fee.toFixed(3)}` },
                        { label: t.rateLabel, val: `1 = ${transferDetails.exchangeRate} ${transferDetails.beneficiary?.currency}`, primary: true }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-[10px] sm:text-base font-black">
                          <span className="text-slate-300">{item.label}</span>
                          <span className={`${item.primary ? 'text-blue-600' : 'text-slate-700'}`}>{item.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] sm:text-lg font-black text-blue-950 uppercase tracking-tighter">{t.netPayable}</span>
                      <span className="text-sm sm:text-2xl lg:text-3xl font-black text-blue-900">{transferDetails.totalPayable.toFixed(3)} OMR</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-4 w-full max-w-xl mt-3 sm:mt-6 shrink-0">
                  <button onClick={() => setStep(FlowStep.AMOUNT)} className="flex-1 py-2 sm:py-4 bg-slate-200 text-slate-700 rounded-lg sm:rounded-2xl text-[10px] sm:text-lg font-black active:scale-95 transition-all">
                    {t.edit}
                  </button>
                  <button onClick={() => setStep(FlowStep.SUCCESS)} className="flex-[2] py-2 sm:py-4 bg-blue-600 text-white rounded-lg sm:rounded-2xl text-[10px] sm:text-lg font-black shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 sm:gap-2">
                    {t.sendNow} {isRTL ? <ArrowLeft className="w-3.5 h-3.5 sm:w-6 sm:h-6" /> : <ArrowRight className="w-3.5 h-3.5 sm:w-6 sm:h-6" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUCCESS SCREEN */}
            {step === FlowStep.SUCCESS && (
              <motion.div key="success" {...pageTransition} className="h-full flex flex-col items-center justify-center text-center p-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 sm:w-32 lg:w-40 bg-green-50 rounded-[24px] sm:rounded-[32px] flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 sm:w-16 lg:w-20 text-green-600" />
                </motion.div>

                <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-blue-950 mb-1">{t.doneTitle}</h2>
                <p className="text-[10px] sm:text-base lg:text-lg text-slate-400 mb-6 sm:mb-8 font-bold max-w-md">
                  {t.doneDesc} <span className="text-blue-600 truncate inline-block max-w-[120px] align-bottom">{transferDetails?.beneficiary?.name}</span>.
                </p>

                <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-md mb-6 sm:mb-8 w-full max-w-sm">
                  <div className="flex justify-between mb-1.5 sm:mb-3">
                    <span className="text-slate-300 font-black uppercase text-[7px] sm:text-[9px] tracking-widest">{t.refId}</span>
                    <span className="text-slate-800 font-mono font-black text-[9px] sm:text-base">#UNI-OM-99X</span>
                  </div>
                  <div className="flex justify-between pt-1.5 sm:pt-4 border-t border-slate-50">
                    <span className="text-slate-300 font-black uppercase text-[7px] sm:text-[9px] tracking-widest">{t.settledAmt}</span>
                    <span className="text-xs sm:text-2xl font-black text-blue-900">{transferDetails?.amount.toFixed(3)} OMR</span>
                  </div>
                </div>

                <button onClick={resetFlow} className="w-full max-w-sm py-3 sm:py-5 bg-blue-600 text-white rounded-lg sm:rounded-2xl text-sm sm:text-xl font-black shadow-md active:scale-95 transition-all shrink-0">
                  {t.closeSession}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-1.5 sm:py-2.5 lg:py-3.5 px-4 sm:px-12 flex items-center justify-between z-30 shrink-0 safe-pb">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5">
             <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[7px] sm:text-[9px] font-black opacity-70 uppercase tracking-widest">{t.encrypted}</span>
          </div>
          <span className="hidden sm:block text-[7px] sm:text-[9px] font-black opacity-40 uppercase tracking-widest">{t.kioskId}: MCT-8842-OM</span>
        </div>

        <div className="flex items-center gap-3">
          {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
             <button onClick={resetFlow} className="flex items-center gap-1 text-red-400 font-black hover:text-red-300 transition-colors uppercase text-[7px] sm:text-[9px] tracking-widest">
               <X className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
               <span className="xs:inline">{t.endSession}</span>
             </button>
          )}
          <span className="text-[7px] opacity-20 font-mono font-bold uppercase">{t.ver}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;