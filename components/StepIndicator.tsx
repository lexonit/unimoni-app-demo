
import React from 'react';
import { FlowStep } from '../types';
import { translations } from '../translations';

interface StepIndicatorProps {
  currentStep: FlowStep;
  isRTL?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, isRTL }) => {
  const lang = isRTL ? 'ar' : 'en';
  const t = translations[lang];

  const steps = [
    { label: t.verifyProceedBtn, key: FlowStep.LOGIN },
    { label: t.recipientTitle, key: FlowStep.BENEFICIARY },
    { label: t.amountLabel.split(' ')[0], key: FlowStep.AMOUNT },
    { label: t.edit, key: FlowStep.REVIEW },
  ];

  const getStepIndex = (step: FlowStep) => {
    if (step === FlowStep.OTP) return 0;
    if (step === FlowStep.SUCCESS) return 3;
    return steps.findIndex(s => s.key === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto px-2 mb-2 shrink-0">
      {steps.map((step, idx) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center relative">
            <div className={`w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center text-[10px] md:text-base lg:text-xl font-black transition-all duration-500 z-10 shadow-sm ${
              idx <= currentIndex 
                ? 'bg-[#003D7E] text-white scale-110 shadow-md' 
                : 'bg-white border border-slate-100 text-slate-200'
            }`}>
              {idx + 1}
            </div>
            <span className={`absolute -bottom-4 whitespace-nowrap text-[6px] md:text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${
              idx === currentIndex ? 'text-[#003D7E] opacity-100 translate-y-0' : 'text-slate-200 opacity-0 -translate-y-1'
            }`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-0.5 md:h-1 mx-1.5 md:mx-3 rounded-full bg-slate-100 relative overflow-hidden">
                <div 
                  className={`absolute inset-0 bg-[#00ADEF] transition-all duration-700 ease-in-out ${isRTL ? 'right-0' : 'left-0'}`} 
                  style={{ width: idx < currentIndex ? '100%' : '0%' }}
                />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
