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

    let unmounted = false;
    const scanner = new Html5Qrcode(containerRef.current.id);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => {
          if (!unmounted) {
            scanner.stop().catch(() => {});
            onScan(text);
          }
        },
        () => {},
      )
      .then(() => {
        if (unmounted) {
          scanner.stop().catch(() => {});
        } else {
          setStarted(true);
        }
      })
      .catch((err) => {
        if (!unmounted && onError) onError(String(err));
      });

    return () => {
      unmounted = true;
      try {
        scanner.stop().catch(() => {});
      } catch (e) {
        // Ignora errori di stop se lo scanner non era ancora avviato
      }
    };
  }, [onScan, onError]);

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
