import React from 'react';
import { X, History, Printer, RotateCcw, Clock, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
        {/* En-tête */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">Historique des Commandes</h3>
              <p className="text-[11px] text-slate-400">
                {orders.length} tickets • Total encaissé :{' '}
                <span className="text-amber-400 font-black font-mono">{formatMoney(totalVentes, settings.currency)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-white/5 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liste des Commandes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-3">
                <History className="w-7 h-7 text-slate-600" />
              </div>
              <p className="font-bold text-slate-400">Aucune commande enregistrée</p>
              <p className="text-slate-500 mt-0.5">Les tickets validés apparaîtront ici.</p>
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
                  className={`border rounded-2xl p-4 transition ${
                    isRefunded
                      ? 'bg-slate-950/40 border-white/5 opacity-60'
                      : 'bg-slate-950/80 border-white/10 hover:border-white/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {dateStr}
                      </span>
                      {order.customerName && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                          {order.customerName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isRefunded
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isRefunded ? 'Annulée' : order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Articles de la commande */}
                  <div className="text-xs text-slate-300 space-y-1.5 my-2.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-medium text-slate-200">
                          <strong className="text-white font-mono">{item.quantity}×</strong> {item.product.name}
                        </span>
                        <span className="font-mono text-slate-400 text-xs">
                          {formatMoney(item.total, settings.currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Actions */}
                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold">Total : </span>
                      <span className="text-sm font-black text-amber-400 font-mono">
                        {formatMoney(order.total, settings.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => printReceipt(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition active:scale-95 border border-white/5"
                      >
                        <Printer className="w-3.5 h-3.5 text-sky-400" />
                        <span>Reçu</span>
                      </button>

                      {!isRefunded && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Annuler et rembourser la commande ${order.orderNumber} ? Le stock sera réintégré.`)) {
                              refundOrder(order.id);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold border border-rose-500/30 transition active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
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
