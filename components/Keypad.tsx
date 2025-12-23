
import React from 'react';
import { Delete } from 'lucide-react';
import { motion } from 'framer-motion';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  className?: string;
  compact?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onDelete, className = '', compact = false }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className={`grid grid-cols-3 gap-2 md:gap-3 ${className}`}>
      {keys.map((key) => (
        <motion.button
          key={key}
          whileTap={{ scale: 0.9, backgroundColor: '#00ADEF', color: '#ffffff' }}
          onClick={() => onKeyPress(key)}
          className={`${
            compact ? 'h-10 md:h-14 lg:h-20 text-lg md:text-xl lg:text-3xl' : 'h-14 md:h-16 lg:h-28 text-xl md:text-2xl lg:text-5xl'
          } flex items-center justify-center bg-white border border-slate-100 rounded-xl md:rounded-2xl font-black text-slate-700 transition-colors shadow-sm select-none active:border-[#00ADEF]`}
        >
          {key}
        </motion.button>
      ))}
      <motion.button
        whileTap={{ scale: 0.9, backgroundColor: '#ef4444', color: '#ffffff' }}
        onClick={onDelete}
        className={`${
          compact ? 'h-10 md:h-14 lg:h-20' : 'h-14 md:h-16 lg:h-28'
        } flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-slate-400 transition-colors shadow-sm select-none`}
      >
        <Delete className={compact ? 'w-5 h-5 md:w-6 md:h-6 lg:w-10 lg:h-10' : 'w-6 h-6 md:w-8 md:h-8 lg:w-14 lg:h-14'} />
      </motion.button>
    </div>
  );
};

export default Keypad;
