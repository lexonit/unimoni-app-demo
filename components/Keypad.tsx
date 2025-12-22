
import React from 'react';
import { Delete } from 'lucide-react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  className?: string;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onDelete, className = '' }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className={`grid grid-cols-3 gap-1.5 sm:gap-2 lg:gap-3 ${className}`}>
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => onKeyPress(key)}
          className="h-12 sm:h-14 lg:h-16 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 active:bg-blue-600 active:text-white active:scale-95 transition-all shadow-sm select-none"
        >
          {key}
        </button>
      ))}
      <button
        onClick={onDelete}
        className="h-12 sm:h-14 lg:h-16 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-xl text-slate-700 active:bg-red-500 active:text-white active:scale-95 transition-all shadow-sm select-none"
      >
        <Delete className="w-5 h-5 sm:w-6 h-6 lg:w-8 lg:h-8" />
      </button>
    </div>
  );
};

export default Keypad;
