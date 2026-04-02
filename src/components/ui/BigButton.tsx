import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger';
  children: ReactNode;
}

const variants: Record<string, string> = {
  primary: 'bg-mana-primary hover:bg-mana-primary-hover active:scale-95 text-white',
  success: 'bg-mana-green hover:bg-mana-green-hover active:scale-95 text-white',
  danger: 'bg-mana-orange hover:bg-mana-orange-hover active:scale-95 text-white',
};

export default function BigButton({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled}
      className={`w-full min-h-[56px] rounded-2xl text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
