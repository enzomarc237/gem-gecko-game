import React from 'react';
import { COLORS } from '../constants';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary', className = '', disabled = false }) => {
  let bgClass = '';
  const textClass = 'text-[#F8F8F2] font-bold';
  
  switch (variant) {
    case 'primary':
      bgClass = `bg-[${COLORS.ACCENT_ORANGE}] hover:bg-orange-600 border-b-4 border-orange-800`;
      break;
    case 'secondary':
      bgClass = `bg-[${COLORS.NEUTRAL_DARK}] hover:bg-slate-700 border-2 border-[${COLORS.NEUTRAL_LIGHT}]`;
      break;
    case 'danger':
      bgClass = `bg-red-600 hover:bg-red-700 border-b-4 border-red-800`;
      break;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 rounded-lg text-xl uppercase tracking-wider transition-all transform active:scale-95 active:border-b-0 active:translate-y-1
        ${bgClass} ${textClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{
        backgroundColor: variant === 'primary' ? COLORS.ACCENT_ORANGE : undefined,
        borderColor: variant === 'primary' ? '#C26A00' : undefined // Manual override for Tailwind arbitrary values
      }}
    >
      {label}
    </button>
  );
};

export default Button;