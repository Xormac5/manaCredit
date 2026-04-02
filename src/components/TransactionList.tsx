import type { Transaction } from '../types';

interface Props {
  transactions: (Transaction & { id: string })[];
  showCustomer?: boolean;
  compact?: boolean;
}

function formatDate(date: unknown): string {
  if (date instanceof Date) return date.toLocaleString('it-IT');
  if (date && typeof date === 'object' && 'toDate' in date) {
    return (date as { toDate: () => Date }).toDate().toLocaleString('it-IT');
  }
  return '—';
}

export default function TransactionList({
  transactions,
  showCustomer = false,
  compact = false,
}: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Nessun movimento
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-700/50">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className={`${
            compact ? 'py-2' : 'py-3'
          } px-2 hover:bg-mana-card-hover/30 transition-colors`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left: Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {/* Type Badge */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${
                    tx.type === 'credit'
                      ? 'bg-mana-green/20 text-mana-green'
                      : tx.type === 'debit'
                      ? 'bg-mana-orange/20 text-mana-orange'
                      : 'bg-slate-700/50 text-slate-300'
                  }`}
                >
                  {tx.type === 'credit'
                    ? '➕ Carica'
                    : tx.type === 'debit'
                    ? '➖ Scala'
                    : '↻ Storno'}
                </span>
              </div>

              {/* Customer or Reason */}
              <p className="text-sm font-semibold text-white truncate">
                {showCustomer ? tx.customerName : tx.reason}
              </p>

              {/* Timestamp */}
              {!compact && (
                <p className="text-xs text-slate-500 mt-1">
                  {formatDate(tx.createdAt)}
                </p>
              )}
            </div>

            {/* Right: Amount */}
            <span
              className={`font-bold text-base whitespace-nowrap ${
                tx.type === 'credit'
                  ? 'text-mana-green'
                  : tx.type === 'debit'
                  ? 'text-mana-orange'
                  : 'text-slate-400'
              }`}
            >
              {tx.type === 'credit' ? '+' : tx.type === 'debit' ? '−' : '↻'}€
              {tx.amount.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
      ))}
    </ul>
  );
}
