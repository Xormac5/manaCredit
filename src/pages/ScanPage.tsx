import { useNavigate } from 'react-router-dom';
import QrScanner from '../components/QrScanner';

export default function ScanPage() {
  const navigate = useNavigate();

  function handleScan(text: string) {
    // Il QR contiene l'ID del wallet/cliente
    navigate(`/customer?id=${encodeURIComponent(text)}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-white text-2xl"
      >
        ←
      </button>
      <h1 className="text-white text-lg font-bold mb-4">Scansiona QR Cliente</h1>
      <QrScanner
        onScan={handleScan}
        onError={(err) => alert(`Errore fotocamera: ${err}`)}
      />
      <p className="text-slate-400 text-sm mt-4">
        Inquadra il QR code del cliente
      </p>
    </div>
  );
}
