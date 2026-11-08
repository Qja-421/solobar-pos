import React from 'react';
import { X, History, Printer, RotateCcw, CheckCircle2, User, Clock, AlertCircle } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { formatMoney } from '../utils/security';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const { orders, refundOrder, printReceipt, settings } = useSoloBarStore();

  if (!isOpen) return null;

  const totalVentes = orders
    .filter((o) => o.status === 'paye')
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Historique des Commandes</h3>
              <p className="text-[11px] text-slate-400">
                {orders.length} commandes • Total encaissé :{' '}
                <span className="text-amber-400 font-bold">{formatMoney(totalVentes, settings.currency)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liste des Commandes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
              <History className="w-8 h-8 mb-2 stroke-[1.5]" />
              <p>Aucune commande enregistrée pour l'instant.</p>
            </div>
          ) : (
            orders.map((order) => {
              const isRefunded = order.status === 'rembourse';
              const dateStr = new Date(order.date).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={order.id}
                  className={`border rounded-2xl p-3.5 transition ${
                    isRefunded
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-amber-400">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {dateStr}
                      </span>
                      {order.customerName && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {order.customerName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isRefunded
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isRefunded ? 'Annulée / Remboursée' : order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Articles de la commande */}
                  <div className="text-xs text-slate-300 space-y-1 my-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.quantity}× {item.product.name}
                        </span>
                        <span className="font-mono text-slate-400">
                          {formatMoney(item.total, settings.currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400">Total : </span>
                      <span className="text-sm font-black text-white font-mono">
                        {formatMoney(order.total, settings.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => printReceipt(order)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                      >
                        <Printer className="w-3 h-3 text-sky-400" />
                        <span>Reçu</span>
                      </button>

                      {!isRefunded && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Annuler et rembourser la commande ${order.orderNumber} ? Le stock sera réintégré.`)) {
                              refundOrder(order.id);
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Annuler</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
