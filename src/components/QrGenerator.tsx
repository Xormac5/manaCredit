import { useRef } from 'react';
import QRCode from 'qrcode.react';

interface Props {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeDownload?: boolean;
}

export default function QrGenerator({
  value,
  size = 256,
  level = 'H',
  includeDownload = false,
}: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  function handleDownload() {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `manacredit-${value.replace(':', '-')}.png`;
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Container */}
      <div
        ref={qrRef}
        className="bg-white p-4 rounded-2xl shadow-xl border border-mana-primary/30"
      >
        <QRCode
          value={value}
          size={size}
          level={level}
          includeMargin
          quietZone={8}
          renderAs="canvas"
        />
      </div>

      {/* Value Display */}
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-1">Codice QR</p>
        <p className="text-lg font-mono font-bold text-mana-primary break-all">
          {value}
        </p>
      </div>

      {/* Download Button */}
      {includeDownload && (
        <button
          onClick={handleDownload}
          className="px-6 py-2 rounded-xl bg-mana-green hover:bg-mana-green-hover text-white font-semibold text-sm transition-colors active:scale-95"
        >
          📥 Scarica QR
        </button>
      )}
    </div>
  );
}
