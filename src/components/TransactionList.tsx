import type { Transaction } from '../types';

interface Props {
  transactions: (Transaction & { id: string })[];
  showCustomer?: boolean;
}

function formatDate(date: unknown): string {
  if (date instanceof Date) return date.toLocaleString('it-IT');
  if (date && typeof date === 'object' && 'toDate' in date) {
    return (date as { toDate: () => Date }).toDate().toLocaleString('it-IT');
  }
  return '—';
}

const typeBadge: Record<string, string> = {
  credit: 'bg-emerald-100 text-emerald-700',
  debit: 'bg-orange-100 text-orange-700',
  reversal: 'bg-red-100 text-red-700',
};

export default function TransactionList({ transactions, showCustomer = false }: Props) {
  if (transactions.length === 0) {
    return <p className="text-center text-slate-400 py-4">Nessun movimento</p>;
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
      {transactions.map((tx) => (
        <li key={tx.id} className="flex items-center justify-between py-3 px-1">
          <div>
            <span
              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${typeBadge[tx.type] ?? ''}`}
            >
              {tx.type === 'credit' ? '+' : tx.type === 'debit' ? '−' : '↩'}
            </span>
            {showCustomer && (
              <span className="font-medium text-sm text-slate-800 dark:text-slate-200">
                {tx.customerName}
              </span>
            )}
            <span className="text-xs text-slate-500 ml-2">{tx.reason}</span>
          </div>
          <div className="text-right">
            <span className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-orange-600'}`}>
              {tx.type === 'credit' ? '+' : '−'}€{Math.abs(tx.amount).toFixed(2)}
            </span>
            <p className="text-[10px] text-slate-400">{formatDate(tx.createdAt)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
