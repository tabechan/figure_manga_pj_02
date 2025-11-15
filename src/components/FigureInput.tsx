import React from 'react';
import { cn } from './ui/utils';

interface FigureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FigureInput({ label, error, className, ...props }: FigureInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[#111111] font-medium">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 rounded-[16px] border border-[#E6E8EF] bg-white",
          "focus:outline-none focus:ring-2 focus:ring-[#7A5AF8] focus:border-transparent",
          "placeholder:text-[#555555]",
          error && "border-[#EF4444] focus:ring-[#EF4444]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function NumberStepper({ value, onChange, min = 1, max = 30, label }: NumberStepperProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[#111111] font-medium">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-10 h-10 rounded-full border border-[#E6E8EF] flex items-center justify-center disabled:opacity-50"
        >
          −
        </button>
        <span className="w-12 text-center font-medium">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-10 h-10 rounded-full border border-[#E6E8EF] flex items-center justify-center disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
}