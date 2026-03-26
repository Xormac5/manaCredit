import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger';
  children: ReactNode;
}

const variants: Record<string, string> = {
  primary: 'bg-indigo-600 active:bg-indigo-700 text-white',
  success: 'bg-emerald-500 active:bg-emerald-600 text-white',
  danger: 'bg-orange-500 active:bg-orange-600 text-white',
};

export default function BigButton({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      className={`w-full min-h-[56px] rounded-2xl text-lg font-bold transition-colors ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
