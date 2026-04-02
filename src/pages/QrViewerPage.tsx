import { useParams, useNavigate } from 'react-router-dom';
import QrGenerator from '../components/QrGenerator';

export default function QrViewerPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  if (!customerId) {
    return (
      <div className="min-h-screen bg-mana-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">Codice cliente non valido</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-xl bg-mana-primary hover:bg-mana-primary-hover text-white font-semibold"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  const qrValue = `manacredit:${customerId}`;

  return (
    <div className="min-h-screen bg-mana-bg flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-mana-primary hover:text-mana-primary-hover transition-colors text-2xl"
        >
          ←
        </button>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">QR Code Cliente</h1>
          <p className="text-slate-400 text-sm">
            Scansiona questo codice alla cassa
          </p>
        </div>

        {/* QR Generator */}
        <QrGenerator
          value={qrValue}
          size={300}
          level="H"
          includeDownload
        />

        {/* Info */}
        <div className="bg-mana-card rounded-2xl p-4 border border-slate-700 w-full">
          <p className="text-xs text-slate-400 font-semibold uppercase mb-2">ID Cliente</p>
          <p className="text-lg font-mono font-bold text-mana-primary truncate">
            {customerId}
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 text-center">
          Questa pagina può essere condivisa o stampata per il cliente
        </p>
      </div>
    </div>
  );
}
