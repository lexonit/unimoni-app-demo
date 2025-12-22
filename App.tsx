
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
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.2, ease: "easeOut" }
  };

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
      <header className="bg-white px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 shadow-sm flex items-center justify-between z-30 shrink-0 border-b border-slate-100 safe-pt">
        <div className="flex items-center gap-2 sm:gap-4">
          {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
            <button 
              onClick={() => {
                if (step === FlowStep.LOGIN) setStep(FlowStep.WELCOME);
                else if (step === FlowStep.OTP) setStep(FlowStep.LOGIN);
                else if (step === FlowStep.BENEFICIARY) setStep(FlowStep.LOGIN);
                else if (step === FlowStep.AMOUNT) setStep(FlowStep.BENEFICIARY);
                else if (step === FlowStep.REVIEW) setStep(FlowStep.AMOUNT);
              }}
              className="p-1 sm:p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              {isRTL ? <ChevronRightIcon className="w-5 h-5 sm:w-7 h-7 text-blue-900" /> : <ChevronLeft className="w-5 h-5 sm:w-7 h-7 text-blue-900" />}
            </button>
          )}
          <div className="flex flex-col">
             <img 
              src={'/logo.svg'} 
              alt="Unimoni Logo" 
              className="h-8 lg:h-12 w-auto mb-1" 
              style={{ maxWidth: 140 }}
            />
            <span className="text-[6px] sm:text-[8px] uppercase tracking-widest text-slate-400 font-bold">{isRTL ? 'شركة مجموعة ويز' : 'WIZ GROUP'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-600 bg-slate-50 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-slate-100 active:scale-95 transition-all"
          >
            <Globe className="w-4 h-4 sm:w-5 h-5 text-blue-500" />
            <span className="text-xs sm:text-sm font-bold">{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <HelpCircle className="w-6 h-6 sm:w-8 h-8 text-slate-200" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden px-4 sm:px-8 lg:px-16 py-2 sm:py-4">
        {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
          <StepIndicator currentStep={step} isRTL={isRTL} />
        )}
        
        <div className="flex-1 relative min-h-0 flex flex-col">
          <AnimatePresence mode="wait">
            {/* WELCOME SCREEN */}
            {step === FlowStep.WELCOME && (
              <motion.div key="welcome" {...pageTransition} className="h-full flex flex-col items-center justify-center text-center">
                <div className="relative mb-4 sm:mb-8 lg:mb-12 shrink-0">
                   <div className="absolute inset-0 bg-blue-100 rounded-full blur-[80px] opacity-30 animate-pulse"></div>
                   <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                     <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white rounded-[32px] sm:rounded-[40px] flex items-center justify-center shadow-2xl border border-slate-50">
                        <Globe className="w-16 h-16 sm:w-28 sm:h-28 lg:w-40 lg:h-40 text-blue-600 opacity-90" />
                     </div>
                   </motion.div>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-7xl font-black text-blue-950 mb-2 sm:mb-4 leading-tight tracking-tight shrink-0">
                  {t.welcomeTitle} <br className="hidden sm:block" /> <span className="text-blue-500">{t.welcomeTitleAccent}</span>
                </h2>
                <p className="text-sm sm:text-lg lg:text-2xl text-slate-500 mb-6 sm:mb-10 max-w-xl font-medium px-4 shrink-0">
                  {t.welcomeDesc}
                </p>

                <button 
                  onClick={() => setStep(FlowStep.LOGIN)}
                  className="group relative flex items-center gap-3 sm:gap-4 bg-blue-600 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-[32px] text-lg sm:text-2xl lg:text-3xl font-black shadow-xl shadow-blue-300/40 active:scale-95 transition-all shrink-0"
                >
                  {t.startBtn}
                  {isRTL ? <ArrowLeft className="w-6 h-6 sm:w-8 h-8 lg:w-10 lg:h-10" /> : <ArrowRight className="w-6 h-6 sm:w-8 h-8 lg:w-10 lg:h-10" />}
                </button>
              </motion.div>
            )}

            {/* LOGIN & OTP SCREENS */}
            {(step === FlowStep.LOGIN || step === FlowStep.OTP) && (
              <motion.div key={step} {...pageTransition} className="h-full flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-16">
                <div className="w-full max-w-md shrink-0">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-blue-950 mb-1 sm:mb-2 leading-tight">
                    {step === FlowStep.LOGIN ? t.loginTitle : t.otpTitle}
                  </h2>
                  <p className="text-xs sm:text-base lg:text-xl text-slate-500 mb-4 lg:mb-8 font-medium">
                    {step === FlowStep.LOGIN ? t.loginDesc : t.otpDesc}
                  </p>
                  
                  {step === FlowStep.LOGIN ? (
                    <div className="bg-white border-2 sm:border-4 border-blue-50 rounded-2xl sm:rounded-[24px] p-4 sm:p-6 lg:p-8 shadow-lg mb-4 sm:mb-6 transition-all focus-within:border-blue-500">
                      <label className="text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-widest block mb-1 sm:mb-2">{t.idLabel}</label>
                      <div className="text-xl sm:text-3xl lg:text-5xl font-mono tracking-[0.1em] sm:tracking-[0.2em] text-blue-900 min-h-[30px] sm:min-h-[48px] flex items-center">
                        {idNumber || <span className="text-slate-100">••••••••••••</span>}
                        <span className="w-0.5 sm:w-1 h-6 sm:h-10 bg-blue-500 mx-1 animate-pulse rounded-full"></span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8 justify-center lg:justify-start" dir="ltr">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-12 h-16 sm:w-16 sm:h-24 lg:w-20 lg:h-28 rounded-xl sm:rounded-2xl border-2 sm:border-4 flex items-center justify-center text-xl sm:text-3xl lg:text-4xl font-black transition-all ${
                          otp[i] ? 'border-blue-500 bg-white text-blue-600 shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-200'
                        }`}>
                          {otp[i] || ''}
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    disabled={step === FlowStep.LOGIN ? idNumber.length < 8 : otp.length < 4}
                    onClick={() => step === FlowStep.LOGIN && setStep(FlowStep.OTP)}
                    className={`w-full py-4 sm:py-5 lg:py-7 rounded-xl sm:rounded-[24px] text-base sm:text-xl lg:text-2xl font-black transition-all ${
                      (step === FlowStep.LOGIN ? idNumber.length >= 8 : otp.length >= 4)
                      ? 'bg-blue-600 text-white active:scale-95 shadow-lg shadow-blue-200' 
                      : 'bg-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    {step === FlowStep.LOGIN ? t.verifyBtn : t.verifyProceedBtn}
                  </button>
                </div>

                <div className="w-full max-w-sm lg:max-w-md">
                  <Keypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} className="p-1 sm:p-2 bg-slate-100/20 rounded-[24px]" />
                </div>
              </motion.div>
            )}

            {/* BENEFICIARY SCREEN */}
            {step === FlowStep.BENEFICIARY && (
              <motion.div key="beneficiary" {...pageTransition} className="h-full flex flex-col pt-1 pb-4">
                <div className="flex items-center justify-between mb-4 sm:mb-8 shrink-0">
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-blue-950 truncate">{t.recipientTitle}</h2>
                    <p className="text-slate-400 text-[10px] sm:text-sm font-bold uppercase tracking-tight truncate">{t.recipientSub}</p>
                  </div>
                  <button className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-6 lg:px-10 py-2 sm:py-4 rounded-full font-black text-xs sm:text-base lg:text-xl active:scale-95 shadow-md shadow-blue-100">
                    <Users className="w-4 h-4 sm:w-6 h-6" />
                    <span className="hidden xs:inline">{t.newContactBtn}</span>
                    <span className="xs:hidden">+</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pe-1 sm:pe-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 pb-2 min-h-0">
                  {MOCK_BENEFICIARIES.map((ben) => (
                    <button 
                      key={ben.id}
                      onClick={() => { setSelectedBeneficiary(ben); setStep(FlowStep.AMOUNT); }}
                      className="group flex items-center p-3 sm:p-6 bg-white border border-slate-50 rounded-2xl sm:rounded-[32px] shadow-sm hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.98] transition-all text-left relative overflow-hidden"
                    >
                      <img src={ben.avatar} className={`w-12 h-12 sm:w-20 lg:w-28 rounded-xl sm:rounded-[24px] object-cover ${isRTL ? 'ml-3 sm:ml-6' : 'mr-3 sm:mr-6'} shadow-md`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-xl lg:text-2xl font-black text-slate-800 truncate mb-0.5">{ben.name}</h3>
                        <p className="text-[10px] sm:text-base lg:text-lg text-slate-400 font-bold mb-1 sm:mb-2 truncate">{ben.bankName}</p>
                        <span className="text-[8px] sm:text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-widest">{ben.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AMOUNT SCREEN */}
            {step === FlowStep.AMOUNT && (
              <motion.div key="amount" {...pageTransition} className="h-full flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-10 lg:gap-20">
                <div className="w-full max-w-lg shrink-0">
                  <div className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-8 p-3 sm:p-5 bg-white rounded-2xl sm:rounded-[28px] border border-slate-50 shadow-sm">
                    <img src={selectedBeneficiary?.avatar} className="w-12 h-12 sm:w-20 lg:w-24 rounded-xl sm:rounded-2xl object-cover" />
                    <div className="min-w-0">
                      <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5">{t.sendingTo}</p>
                      <h2 className="text-sm sm:text-2xl lg:text-3xl font-black text-blue-950 truncate leading-none mb-1 sm:mb-2">{selectedBeneficiary?.name}</h2>
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-[8px] sm:text-xs font-black">1 AED = {EXCHANGE_RATES[selectedBeneficiary?.currency || 'INR']} {selectedBeneficiary?.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-6">
                    <div className="bg-white border-2 sm:border-4 border-blue-500 rounded-2xl sm:rounded-[32px] p-4 sm:p-8 shadow-xl shadow-blue-50">
                      <label className="text-[8px] sm:text-xs font-black text-blue-600 uppercase tracking-widest block mb-1">{t.amountLabel}</label>
                      <div className="flex items-baseline gap-2" dir="ltr">
                        <span className="text-3xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-none">{amount}</span>
                        <span className="text-sm sm:text-2xl font-black text-slate-300">AED</span>
                      </div>
                    </div>

                    <div className="bg-slate-100 rounded-2xl sm:rounded-[32px] p-4 sm:p-8 border border-slate-200">
                      <label className="text-[8px] sm:text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{t.recipientGets}</label>
                      <div className="flex items-baseline gap-2" dir="ltr">
                        <span className="text-2xl sm:text-4xl lg:text-6xl font-black text-blue-600 leading-none">
                          {(parseFloat(amount) * (EXCHANGE_RATES[selectedBeneficiary?.currency || 'INR'])).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs sm:text-xl font-black text-blue-300">{selectedBeneficiary?.currency}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={parseFloat(amount) <= 0}
                    onClick={calculateTransfer}
                    className={`w-full py-4 sm:py-6 lg:py-8 mt-6 sm:mt-10 rounded-2xl sm:rounded-[32px] text-base sm:text-2xl lg:text-3xl font-black transition-all ${
                      parseFloat(amount) > 0 ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {t.nextStep}
                  </button>
                </div>

                <div className="w-full max-w-sm lg:max-w-md">
                  <Keypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} className="p-1 sm:p-2" />
                </div>
              </motion.div>
            )}

            {/* REVIEW SCREEN */}
            {step === FlowStep.REVIEW && transferDetails && (
              <motion.div key="review" {...pageTransition} className="h-full flex flex-col items-center justify-center pb-2">
                <div className="w-full max-w-2xl bg-white rounded-[24px] sm:rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col min-h-0">
                  <div className="bg-blue-600 p-4 sm:p-8 lg:p-10 text-white text-center shrink-0">
                    <p className="text-blue-100 text-[8px] sm:text-xs font-black uppercase tracking-widest mb-1">{t.totalDisb}</p>
                    <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none" dir="ltr">
                      {transferDetails.receiverGets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      <span className="text-sm sm:text-2xl ml-2 opacity-70 font-bold">{transferDetails.beneficiary?.currency}</span>
                    </h2>
                  </div>

                  <div className="p-4 sm:p-10 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <div className="flex items-center gap-3 sm:gap-6 pb-4 border-b border-slate-50">
                      <img src={transferDetails.beneficiary?.avatar} className="w-12 h-12 sm:w-20 lg:w-24 rounded-2xl shadow-md" />
                      <div className="min-w-0">
                        <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{t.recipientLabel}</p>
                        <p className="text-sm sm:text-2xl font-black text-slate-800 truncate">{transferDetails.beneficiary?.name}</p>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                      {[
                        { label: t.sentLabel, val: `${transferDetails.amount.toFixed(2)}` },
                        { label: t.feeLabel, val: `${transferDetails.fee.toFixed(2)}` },
                        { label: t.rateLabel, val: `1 = ${transferDetails.exchangeRate}`, primary: true }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-xs sm:text-xl font-black">
                          <span className="text-slate-300">{item.label}</span>
                          <span className={`${item.primary ? 'text-blue-600' : 'text-slate-700'}`}>{item.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                      <span className="text-xs sm:text-2xl font-black text-blue-950 uppercase tracking-tighter">{t.netPayable}</span>
                      <span className="text-lg sm:text-4xl font-black text-blue-900">{transferDetails.totalPayable.toFixed(2)} AED</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-6 w-full max-w-2xl mt-4 sm:mt-10 shrink-0">
                  <button onClick={() => setStep(FlowStep.AMOUNT)} className="flex-1 py-3 sm:py-6 bg-slate-200 text-slate-700 rounded-xl sm:rounded-[24px] text-base sm:text-2xl font-black active:scale-95 transition-all">
                    {t.edit}
                  </button>
                  <button onClick={() => setStep(FlowStep.SUCCESS)} className="flex-[2] py-3 sm:py-6 bg-blue-600 text-white rounded-xl sm:rounded-[24px] text-base sm:text-2xl font-black shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2">
                    {t.sendNow} {isRTL ? <ArrowLeft className="w-4 h-4 sm:w-8 h-8" /> : <ArrowRight className="w-4 h-4 sm:w-8 h-8" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUCCESS SCREEN */}
            {step === FlowStep.SUCCESS && (
              <motion.div key="success" {...pageTransition} className="h-full flex flex-col items-center justify-center text-center p-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 sm:w-48 lg:w-56 bg-green-50 rounded-[40px] flex items-center justify-center mb-4 sm:mb-10 shadow-lg">
                  <CheckCircle2 className="w-12 h-12 sm:w-24 lg:w-32 text-green-600" />
                </motion.div>

                <h2 className="text-2xl sm:text-5xl lg:text-7xl font-black text-blue-950 mb-2">{t.doneTitle}</h2>
                <p className="text-xs sm:text-xl lg:text-2xl text-slate-400 mb-6 sm:mb-12 font-bold max-w-md">
                  {t.doneDesc} <span className="text-blue-600 truncate inline-block max-w-[150px] align-bottom">{transferDetails?.beneficiary?.name}</span>.
                </p>

                <div className="bg-white border border-slate-100 rounded-[24px] sm:rounded-[40px] p-4 sm:p-10 shadow-xl mb-6 sm:mb-16 w-full max-w-lg">
                  <div className="flex justify-between mb-2 sm:mb-4">
                    <span className="text-slate-300 font-black uppercase text-[8px] sm:text-xs tracking-widest">{t.refId}</span>
                    <span className="text-slate-800 font-mono font-black text-xs sm:text-xl">#UNI-99X-PP</span>
                  </div>
                  <div className="flex justify-between pt-2 sm:pt-6 border-t border-slate-50">
                    <span className="text-slate-300 font-black uppercase text-[8px] sm:text-xs tracking-widest">{t.settledAmt}</span>
                    <span className="text-xl sm:text-4xl font-black text-blue-900">{transferDetails?.amount.toFixed(2)} AED</span>
                  </div>
                </div>

                <button onClick={resetFlow} className="w-full max-w-lg py-4 sm:py-7 bg-blue-600 text-white rounded-xl sm:rounded-[32px] text-base sm:text-2xl font-black shadow-xl active:scale-95 transition-all shrink-0">
                  {t.closeSession}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-2 sm:py-4 lg:py-6 px-4 sm:px-12 flex items-center justify-between z-30 shrink-0 safe-pb">
        <div className="flex items-center gap-3 sm:gap-8">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[8px] sm:text-xs font-black opacity-70 uppercase tracking-widest">{t.encrypted}</span>
          </div>
          <span className="hidden sm:block text-[8px] sm:text-xs font-black opacity-40 uppercase tracking-widest">{t.kioskId}: DXB-7721-L</span>
        </div>

        <div className="flex items-center gap-4">
          {step !== FlowStep.WELCOME && step !== FlowStep.SUCCESS && (
             <button onClick={resetFlow} className="flex items-center gap-1.5 text-red-400 font-black hover:text-red-300 transition-colors uppercase text-[8px] sm:text-xs tracking-widest">
               <X className="w-3 h-3 sm:w-5 h-5" />
               <span className="xs:inline">{t.endSession}</span>
             </button>
          )}
          <span className="text-[8px] opacity-20 font-mono font-bold uppercase">{t.ver}</span>
        </div>
      </footer>
    </div>
  );
};

// Icon helpers for RTL
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default App;
