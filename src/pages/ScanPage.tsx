import { useNavigate } from 'react-router-dom';
import QrScanner from '../components/QrScanner';

export default function ScanPage() {
  const navigate = useNavigate();

  function handleScan(text: string) {
    if (text.startsWith('manacredit:')) {
      const id = text.split('manacredit:')[1];
      navigate(`/customer?id=${encodeURIComponent(id)}`);
    } else {
      alert('QR Code non valido per ManaCredit');
    }
  }

  return (
    <div className="min-h-screen bg-mana-bg flex flex-col items-center justify-between p-4 pb-safe">
      {/* Header */}
      <div className="flex items-center justify-start w-full pt-2">
        <button
          onClick={() => navigate('/')}
          className="text-mana-primary hover:text-mana-primary-hover p-2 -ml-2 transition-colors text-2xl"
        >
          ←
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-4 text-center">Scansiona QR Cliente</h1>
        <QrScanner
          onScan={handleScan}
          onError={(err) => alert(`Errore fotocamera: ${err}`)}
        />
        <p className="text-slate-400 text-sm mt-6 text-center">
          Inquadra il codice QR del cliente per procedere
        </p>
      </div>

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}
