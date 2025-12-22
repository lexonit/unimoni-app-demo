
import React, { useState, useEffect } from 'react';
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
  ArrowLeft
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
  const [transferDetails, setTransferDetails] = useState<TransferDetails | null>(null);

  const t = translations[lang];
  const isRTL = lang === 'ar';

  const pageTransition = {
    initial: { opacity: 0, x: isRTL ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? 20 : -20 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  };

  const handleKeypadPress = (key: string) => {
    if (step === FlowStep.LOGIN) {
      if (idNumber.length < 12) setIdNumber(prev => prev + key);
    } else if (step === FlowStep.OTP) {
      if (otp.length < 4) setOtp(prev => prev + key);
    } else if (step === FlowStep.AMOUNT) {
      if (key === '.' && amount.includes('.')) return;
      if (amount === '0' && key !== '.') setAmount(key);
      else if (amount.length < 10) setAmount(prev => prev + key);
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
      setTimeout(() => setStep(FlowStep.BENEFICIARY), 400);
    }
  }, [otp]);

  const calculateTransfer = () => {
    if (!selectedBeneficiary) return;
    const sendAmount = parseFloat(amount);
    const rate = EXCHANGE_RATES[selectedBeneficiary.currency];
    const fee = 15;
    setTransferDetails({
      beneficiary: selectedBeneficiary,
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
    setTransferDetails(null);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <div className={`h-screen w-full flex flex-col bg-slate-50 relative overflow-hidden text-slate-900 select-none ${isRTL ? 'font-[Cairo]' : 'font-[Inter]'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white px-6 lg:px-10 py-4 lg:py-5 shadow-sm flex items-center justify-between z-30 shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-4">
          {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
            <button 
              onClick={() => {
                if (step === FlowStep.LOGIN) setStep(FlowStep.WELCOME);
                else if (step === FlowStep.OTP) setStep(FlowStep.LOGIN);
                else if (step === FlowStep.BENEFICIARY) setStep(FlowStep.LOGIN);
                else if (step === FlowStep.AMOUNT) setStep(FlowStep.BENEFICIARY);
                else if (step === FlowStep.REVIEW) setStep(FlowStep.AMOUNT);
              }}
              className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              {isRTL ? <ChevronRightIcon className="w-7 h-7 text-blue-900" /> : <ChevronLeft className="w-7 h-7 text-blue-900" />}
            </button>
          )}
          <div className="flex flex-col">
            <img 
              src={'/logo.svg'} 
              alt="Unimoni Logo" 
              className="h-8 lg:h-12 w-auto mb-1" 
              style={{ maxWidth: 140 }}
            />
            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold ml-1">{isRTL ? 'شركة مجموعة ويز' : 'WIZ GROUP COMPANY'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 active:scale-95 transition-all"
          >
            <Globe className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold">{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
          <HelpCircle className="w-8 h-8 text-slate-200" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
        {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
          <div className="shrink-0 pt-4 lg:pt-8 bg-slate-50/80 backdrop-blur-sm z-20">
            <StepIndicator currentStep={step} isRTL={isRTL} />
          </div>
        )}
        
        <div className="flex-1 relative min-h-0">
          <AnimatePresence mode="wait">
            {/* WELCOME SCREEN */}
            {step === FlowStep.WELCOME && (
              <motion.div key="welcome" {...pageTransition} className="h-full flex flex-col items-center justify-center px-8 lg:px-20 text-center landscape-compact">
                <div className="relative mb-8 lg:mb-12">
                   <div className="absolute inset-0 bg-blue-200 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                   <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                     <div className="w-48 h-48 lg:w-72 lg:h-72 bg-white rounded-[40px] flex items-center justify-center shadow-2xl border border-slate-50">
                        <Globe className="w-28 h-28 lg:w-44 lg:h-44 text-blue-600 opacity-90" />
                     </div>
                   </motion.div>
                </div>

                <h2 className="text-4xl lg:text-7xl font-[1000] text-blue-950 mb-4 leading-[1.1] tracking-tight">
                  {t.welcomeTitle} <br /> <span className="text-blue-500">{t.welcomeTitleAccent}</span>
                </h2>
                <p className="text-lg lg:text-2xl text-slate-500 mb-10 lg:mb-14 max-w-2xl font-medium">
                  {t.welcomeDesc}
                </p>

                <button 
                  onClick={() => setStep(FlowStep.LOGIN)}
                  className="group relative flex items-center gap-4 bg-blue-600 text-white px-10 lg:px-16 py-5 lg:py-7 rounded-[32px] text-2xl lg:text-3xl font-black shadow-2xl shadow-blue-300/50 active:scale-95 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
                  {t.startBtn}
                  {isRTL ? <ArrowLeft className="w-8 h-8 lg:w-10 lg:h-10 group-hover:-translate-x-2 transition-transform" /> : <ArrowRight className="w-8 h-8 lg:w-10 lg:h-10 group-hover:translate-x-2 transition-transform" />}
                </button>
                
                <div className="mt-12 lg:mt-20 grid grid-cols-3 gap-6 lg:gap-12 w-full max-w-3xl landscape-hide">
                  {[
                    { icon: ShieldCheck, color: 'text-green-500', label: t.featureBank },
                    { icon: Clock, color: 'text-orange-500', label: t.featureRealtime },
                    { icon: CreditCard, color: 'text-blue-500', label: t.featureBestRates }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <item.icon className={`w-6 h-6 lg:w-9 lg:h-9 ${item.color}`} />
                      </div>
                      <span className="text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LOGIN & OTP SCREENS */}
            {(step === FlowStep.LOGIN || step === FlowStep.OTP) && (
              <motion.div key={step} {...pageTransition} className="h-full flex flex-col lg:flex-row px-8 lg:px-16 items-center justify-center gap-8 lg:gap-20">
                <div className="w-full max-w-lg">
                  <h2 className="text-3xl lg:text-5xl font-black text-blue-950 mb-2 lg:mb-4">
                    {step === FlowStep.LOGIN ? t.loginTitle : t.otpTitle}
                  </h2>
                  <p className="text-base lg:text-xl text-slate-500 mb-6 lg:mb-10 font-medium">
                    {step === FlowStep.LOGIN ? t.loginDesc : t.otpDesc}
                  </p>
                  
                  {step === FlowStep.LOGIN ? (
                    <div className="bg-white border-4 border-blue-50 rounded-[32px] p-6 lg:p-10 shadow-xl mb-6 lg:mb-8 transition-all focus-within:border-blue-500 group">
                      <label className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-3">{t.idLabel}</label>
                      <div className="text-3xl lg:text-6xl font-mono tracking-[0.2em] text-blue-900 min-h-[40px] lg:min-h-[64px] flex items-center">
                        {idNumber || <span className="text-slate-100">••••••••••••</span>}
                        <span className="w-1 h-12 lg:h-16 bg-blue-500 mx-1 animate-pulse rounded-full"></span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 lg:gap-6 mb-8 lg:mb-14 justify-center lg:justify-start" dir="ltr">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-16 h-20 lg:w-24 lg:h-32 rounded-[24px] lg:rounded-[32px] border-4 flex items-center justify-center text-3xl lg:text-5xl font-black transition-all ${
                          otp[i] ? 'border-blue-500 bg-white text-blue-600 shadow-2xl shadow-blue-100' : 'border-slate-100 bg-slate-50 text-slate-200'
                        }`}>
                          {otp[i] || ''}
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    disabled={step === FlowStep.LOGIN ? idNumber.length < 8 : otp.length < 4}
                    onClick={() => step === FlowStep.LOGIN && setStep(FlowStep.OTP)}
                    className={`w-full py-5 lg:py-7 rounded-[28px] lg:rounded-[32px] text-xl lg:text-2xl font-black transition-all shadow-2xl ${
                      (step === FlowStep.LOGIN ? idNumber.length >= 8 : otp.length >= 4)
                      ? 'bg-blue-600 text-white active:scale-95 shadow-blue-200' 
                      : 'bg-slate-200 text-slate-400 opacity-50'
                    }`}
                  >
                    {step === FlowStep.LOGIN ? t.verifyBtn : t.verifyProceedBtn}
                  </button>
                </div>

                <div className="w-full max-w-sm lg:max-w-md shrink-0">
                  <Keypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} className="shadow-2xl shadow-slate-200/50 p-2 bg-slate-100/30 rounded-[32px]" />
                </div>
              </motion.div>
            )}

            {/* BENEFICIARY SCREEN */}
            {step === FlowStep.BENEFICIARY && (
              <motion.div key="beneficiary" {...pageTransition} className="h-full flex flex-col px-8 lg:px-16 pt-2 pb-8">
                <div className="flex items-center justify-between mb-6 lg:mb-10 shrink-0">
                  <div>
                    <h2 className="text-3xl lg:text-5xl font-black text-blue-950">{t.recipientTitle}</h2>
                    <p className="text-slate-400 text-sm lg:text-lg font-bold uppercase tracking-wide">{t.recipientSub}</p>
                  </div>
                  <button className="flex items-center gap-3 bg-blue-600 text-white px-6 py-4 lg:px-10 lg:py-5 rounded-full font-black text-sm lg:text-xl active:scale-95 shadow-xl shadow-blue-200 transition-all">
                    <Users className="w-5 h-5 lg:w-7 lg:h-7" />
                    {t.newContactBtn}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pe-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-8 pb-4">
                  {MOCK_BENEFICIARIES.map((ben) => (
                    <button 
                      key={ben.id}
                      onClick={() => { setSelectedBeneficiary(ben); setStep(FlowStep.AMOUNT); }}
                      className="group flex items-center p-6 lg:p-10 bg-white border border-slate-50 rounded-[32px] lg:rounded-[48px] shadow-sm hover:shadow-2xl hover:border-blue-100 hover:translate-y-[-4px] active:scale-[0.98] transition-all text-left relative overflow-hidden"
                    >
                      <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-2 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                      <img src={ben.avatar} className={`w-16 h-16 lg:w-28 lg:h-28 rounded-[24px] lg:rounded-[40px] object-cover ${isRTL ? 'ml-6 lg:ml-10' : 'mr-6 lg:mr-10'} shadow-lg shadow-slate-200`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl lg:text-3xl font-black text-slate-800 truncate mb-1">{ben.name}</h3>
                        <p className="text-sm lg:text-xl text-slate-400 font-bold mb-3">{ben.bankName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] lg:text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-wider">{ben.country}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AMOUNT SCREEN */}
            {step === FlowStep.AMOUNT && (
              <motion.div key="amount" {...pageTransition} className="h-full flex flex-col lg:flex-row px-8 lg:px-16 items-center justify-center gap-10 lg:gap-24">
                <div className="w-full max-w-xl">
                  <div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-[32px] border border-slate-50 shadow-sm">
                    <img src={selectedBeneficiary?.avatar} className="w-20 h-20 lg:w-28 lg:h-28 rounded-[24px] lg:rounded-[32px] object-cover shadow-inner" />
                    <div className="min-w-0">
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{t.sendingTo}</p>
                      <h2 className="text-2xl lg:text-4xl font-black text-blue-950 truncate leading-none mb-2">{selectedBeneficiary?.name}</h2>
                      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs lg:text-sm font-black">1 AED = {EXCHANGE_RATES[selectedBeneficiary?.currency || 'INR']} {selectedBeneficiary?.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 lg:space-y-8">
                    <div className="bg-white border-4 border-blue-500 rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 shadow-2xl shadow-blue-100">
                      <label className="text-xs lg:text-sm font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">{t.amountLabel}</label>
                      <div className="flex items-baseline gap-3" dir="ltr">
                        <span className="text-5xl lg:text-8xl font-[1000] text-slate-900 leading-none">{amount}</span>
                        <span className="text-2xl lg:text-4xl font-black text-slate-300">AED</span>
                      </div>
                    </div>

                    <div className="bg-slate-100 rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 border border-slate-200">
                      <label className="text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">{t.recipientGets}</label>
                      <div className="flex items-baseline gap-3" dir="ltr">
                        <span className="text-4xl lg:text-7xl font-[1000] text-blue-600 leading-none">
                          {(parseFloat(amount) * (EXCHANGE_RATES[selectedBeneficiary?.currency || 'INR'])).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xl lg:text-3xl font-black text-blue-300">{selectedBeneficiary?.currency}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={parseFloat(amount) <= 0}
                    onClick={calculateTransfer}
                    className={`w-full py-6 lg:py-8 mt-10 rounded-[32px] lg:rounded-[40px] text-2xl lg:text-4xl font-black transition-all shadow-2xl ${
                      parseFloat(amount) > 0 ? 'bg-blue-600 text-white active:scale-95 shadow-blue-300' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {t.nextStep}
                  </button>
                </div>

                <div className="w-full max-w-sm lg:max-w-md shrink-0">
                  <Keypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} className="p-2" />
                </div>
              </motion.div>
            )}

            {/* REVIEW SCREEN */}
            {step === FlowStep.REVIEW && transferDetails && (
              <motion.div key="review" {...pageTransition} className="h-full flex flex-col px-8 lg:px-20 items-center justify-center landscape-compact">
                <div className="w-full max-w-2xl bg-white rounded-[48px] lg:rounded-[64px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col min-h-0 landscape-row">
                  <div className="bg-blue-600 p-8 lg:p-14 text-white text-center shrink-0 lg:w-[45%] flex flex-col justify-center">
                    <p className="text-blue-100 text-xs lg:text-sm font-black uppercase tracking-[0.3em] mb-4">{t.totalDisb}</p>
                    <h2 className="text-4xl lg:text-7xl font-[1000] tracking-tighter leading-none mb-2" dir="ltr">
                      {transferDetails.receiverGets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                    <p className="text-2xl lg:text-4xl font-black text-blue-200">{transferDetails.beneficiary?.currency}</p>
                  </div>

                  <div className="p-8 lg:p-14 space-y-6 lg:space-y-10 overflow-y-auto custom-scrollbar flex-1">
                    <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                      <div className="flex items-center gap-5">
                        <img src={transferDetails.beneficiary?.avatar} className="w-16 h-16 lg:w-24 lg:h-24 rounded-[20px] lg:rounded-[32px] shadow-lg" />
                        <div>
                          <p className="text-slate-400 text-[10px] lg:text-xs font-black uppercase tracking-widest">{t.recipientLabel}</p>
                          <p className="text-xl lg:text-3xl font-black text-slate-800">{transferDetails.beneficiary?.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 lg:space-y-5">
                      {[
                        { label: t.sentLabel, val: `${transferDetails.amount.toFixed(2)}` },
                        { label: t.feeLabel, val: `${transferDetails.fee.toFixed(2)}` },
                        { label: t.rateLabel, val: `1 AED = ${transferDetails.exchangeRate}`, primary: true }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-lg lg:text-2xl font-black">
                          <span className="text-slate-300">{item.label}</span>
                          <span className={`${item.primary ? 'text-blue-600' : 'text-slate-700'} font-mono`}>{item.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 lg:pt-10 border-t-4 border-dashed border-slate-100 flex justify-between items-center">
                      <span className="text-lg lg:text-3xl font-[1000] text-blue-950 uppercase tracking-tighter">{t.netPayable}</span>
                      <span className="text-3xl lg:text-5xl font-[1000] text-blue-900 font-mono">{transferDetails.totalPayable.toFixed(2)} AED</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 w-full max-w-2xl mt-8 lg:mt-14 shrink-0">
                  <button onClick={() => setStep(FlowStep.AMOUNT)} className="flex-1 py-5 lg:py-8 bg-slate-200 text-slate-700 rounded-[32px] text-xl lg:text-3xl font-black active:scale-95 transition-all">
                    {t.edit}
                  </button>
                  <button onClick={() => setStep(FlowStep.SUCCESS)} className="flex-[2] py-5 lg:py-8 bg-blue-600 text-white rounded-[32px] text-xl lg:text-3xl font-black shadow-[0_20px_50px_rgba(59,130,246,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4">
                    {t.sendNow} {isRTL ? <ArrowLeft className="w-7 h-7 lg:w-9 lg:h-9" /> : <ArrowRight className="w-7 h-7 lg:w-9 lg:h-9" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUCCESS SCREEN */}
            {step === FlowStep.SUCCESS && (
              <motion.div key="success" {...pageTransition} className="h-full flex flex-col items-center justify-center text-center p-10 lg:p-20 overflow-hidden">
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="w-40 h-40 lg:w-60 lg:h-60 bg-green-50 rounded-[60px] flex items-center justify-center mb-8 lg:mb-14 shadow-2xl shadow-green-100">
                  <CheckCircle2 className="w-24 h-24 lg:w-40 lg:h-40 text-green-600" />
                </motion.div>

                <h2 className="text-5xl lg:text-8xl font-[1000] text-blue-950 mb-4 tracking-tighter">{t.doneTitle}</h2>
                <p className="text-xl lg:text-3xl text-slate-400 mb-10 lg:mb-16 max-w-2xl font-bold">
                  {t.doneDesc} <span className="text-blue-600">{transferDetails?.beneficiary?.name}</span>.
                </p>

                <div className="bg-white border-2 border-slate-50 rounded-[48px] p-8 lg:p-14 shadow-2xl mb-12 lg:mb-20 w-full max-w-xl relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-2 rounded-full font-black text-sm tracking-widest uppercase">{t.slipHeader}</div>
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-300 font-black uppercase text-xs lg:text-base tracking-[0.2em]">{t.refId}</span>
                    <span className="text-slate-800 font-mono font-black text-base lg:text-2xl">#UNI-77X-99P</span>
                  </div>
                  <div className="flex justify-between pt-6 border-t-2 border-slate-50">
                    <span className="text-slate-300 font-black uppercase text-xs lg:text-base tracking-[0.2em]">{t.settledAmt}</span>
                    <span className="text-3xl lg:text-5xl font-[1000] text-blue-900 font-mono">{transferDetails?.amount.toFixed(2)} AED</span>
                  </div>
                </div>

                <div className="flex gap-6 w-full max-w-xl">
                  <button onClick={resetFlow} className="flex-1 py-6 lg:py-8 bg-blue-600 text-white rounded-[32px] text-xl lg:text-3xl font-black shadow-xl active:scale-95 transition-all">
                    {t.closeSession}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-4 lg:py-7 px-8 lg:px-14 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-6 lg:gap-12">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.8)]"></div>
             <span className="text-xs lg:text-base font-black opacity-80 uppercase tracking-widest">{t.encrypted}</span>
          </div>
          <span className="hidden sm:block text-xs lg:text-base font-black opacity-40 uppercase tracking-widest">{t.kioskId}: DXB-7721-L</span>
        </div>

        <div className="flex items-center gap-8">
          {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
             <button onClick={resetFlow} className="flex items-center gap-3 text-red-400 font-black hover:text-red-300 transition-colors uppercase text-xs lg:text-base tracking-[0.2em]">
               <X className="w-5 h-5 lg:w-7 lg:h-7" />
               <span className="hidden xs:block">{t.endSession}</span>
             </button>
          )}
          <span className="text-[10px] lg:text-xs opacity-30 font-mono font-bold uppercase">{t.ver}</span>
        </div>
      </footer>

      {/* Background Accents */}
      <div className="fixed -top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] bg-blue-950/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
};

// Icon helpers for RTL
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default App;
