import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
}

export default function QrScanner({ onScan, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scanner = new Html5Qrcode(containerRef.current.id);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => {
          scanner.stop().catch(() => {});
          onScan(text);
        },
        () => {},
      )
      .then(() => setStarted(true))
      .catch((err) => onError?.(String(err)));

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        id="qr-reader"
        ref={containerRef}
        className="w-full max-w-sm rounded-xl overflow-hidden"
      />
      {!started && (
        <p className="text-sm text-slate-500">Avvio fotocamera…</p>
      )}
    </div>
  );
}
