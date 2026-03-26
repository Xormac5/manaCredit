import { useState } from 'react';

interface Props {
  onConfirm: (value: number) => void;
  label: string;
}

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export default function NumPad({ onConfirm, label }: Props) {
  const [display, setDisplay] = useState('0');

  function handleKey(key: string) {
    if (key === '⌫') {
      setDisplay((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
      return;
    }
    if (key === '.' && display.includes('.')) return;
    // Massimo 2 decimali
    const parts = display.split('.');
    if (parts[1] && parts[1].length >= 2) return;

    setDisplay((prev) => (prev === '0' && key !== '.' ? key : prev + key));
  }

  function handleConfirm() {
    const value = parseFloat(display);
    if (value > 0) {
      onConfirm(value);
      setDisplay('0');
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Display importo */}
      <div className="text-center text-4xl font-bold py-4 text-slate-900 dark:text-white">
        € {display}
      </div>

      {/* Tastierino */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-xl font-semibold text-slate-800 dark:text-slate-200 active:bg-slate-200 dark:active:bg-slate-700 transition-colors"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Conferma */}
      <button
        type="button"
        onClick={handleConfirm}
        className="mt-2 w-full h-14 rounded-2xl bg-indigo-600 text-white text-lg font-bold active:bg-indigo-700 transition-colors"
      >
        {label}
      </button>
    </div>
  );
}
