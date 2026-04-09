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
    <div className="flex flex-col gap-4">
      {/* Display importo */}
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-2">Importo</p>
        <p className="text-5xl font-bold text-mana-green">
          € {display}
        </p>
      </div>

      {/* Tastierino 3x4 */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className="h-16 rounded-xl bg-mana-card hover:bg-mana-card-hover text-xl font-semibold text-white active:scale-95 transition-all"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Conferma */}
      <button
        type="button"
        onClick={handleConfirm}
        className="mt-2 w-full h-14 rounded-2xl bg-mana-green hover:bg-mana-green-hover text-white text-lg font-bold active:scale-95 transition-all shadow-lg"
      >
        {label}
      </button>
    </div>
  );
}
