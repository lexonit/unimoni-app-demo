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
    { label: t.verifyProceedBtn.split(' ')[0], key: FlowStep.LOGIN },
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
    <div className="flex items-center justify-between w-full max-w-xl mx-auto px-4 sm:px-8 mb-1.5 sm:mb-4 lg:mb-6 shrink-0 h-10 sm:h-14">
      {steps.map((step, idx) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center relative">
            <div className={`w-6 h-6 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center text-[10px] sm:text-base font-black transition-all duration-500 z-10 ${
              idx <= currentIndex 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-100 text-slate-300'
            }`}>
              {idx + 1}
            </div>
            <span className={`absolute -bottom-3 sm:-bottom-5 whitespace-nowrap text-[7px] sm:text-[9px] font-black uppercase tracking-tighter sm:tracking-[0.1em] transition-all duration-500 ${
              idx === currentIndex ? 'text-blue-900 opacity-100' : 'text-slate-300 opacity-0 sm:opacity-60'
            }`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded-full bg-slate-100 relative overflow-hidden`}>
                <div 
                  className={`absolute inset-0 bg-blue-600 transition-all duration-700 ease-in-out ${isRTL ? 'right-0' : 'left-0'}`} 
                  style={{ width: idx < currentIndex ? '100%' : '0%' }}
                ></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;