
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
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-10 mb-6 lg:mb-12">
      {steps.map((step, idx) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center relative">
            <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-3xl flex items-center justify-center text-lg lg:text-2xl font-black transition-all duration-500 z-10 ${
              idx <= currentIndex 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                : 'bg-white border-2 border-slate-100 text-slate-300'
            }`}>
              {idx + 1}
            </div>
            <span className={`absolute -bottom-8 lg:-bottom-10 whitespace-nowrap text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              idx === currentIndex ? 'text-blue-900 opacity-100 translate-y-0' : 'text-slate-300 opacity-0 lg:opacity-100 translate-y-1'
            }`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-1.5 lg:h-2 mx-1 lg:mx-3 rounded-full transition-all duration-700 bg-slate-100 relative overflow-hidden`}>
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
