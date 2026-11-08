import React, { useState, useEffect } from 'react';
import { 
  X, Banknote, Smartphone, CreditCard, UserCheck, 
  Printer, AlertCircle, ArrowRight, CheckCircle2, Sparkles 
} from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { formatMoney } from '../utils/security';
import type { PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { cart, cartDiscount, checkout, settings, customerName } = useSoloBarStore();

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const totalToPay = Math.max(0, subtotal - cartDiscount);

  const [method, setMethod] = useState<PaymentMethod>('especes');
  const [cashGiven, setCashGiven] = useState<number>(totalToPay);
  const [momoOperator, setMomoOperator] = useState<string>('MTN Mobile Money');
  const [clientTabName, setClientTabName] = useState<string>(customerName);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCashGiven(totalToPay);
      setClientTabName(customerName);
      setErrorMsg(null);
    }
  }, [isOpen, totalToPay, customerName]);

  if (!isOpen) return null;

  const changeDue = Math.max(0, cashGiven - totalToPay);
  const isCashInsufficient = method === 'especes' && cashGiven < totalToPay;

  const handleValidate = () => {
    if (isCashInsufficient) {
      setErrorMsg('Le montant reçu en espèces est inférieur au total à payer.');
      return;
    }

    const res = checkout(method, method === 'especes' ? cashGiven : totalToPay);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Erreur lors de la validation');
    }
  };

  const handleQuickCash = (amount: number) => {
    setCashGiven(amount);
  };

  const addQuickCash = (delta: number) => {
    setCashGiven((prev) => prev + delta);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/10 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
        {/* En-tête */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                Validation & Reçu
              </span>
              <h3 className="text-lg font-black text-white tracking-tight">Règlement de la Commande</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-white/5 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total à Encaisser Grand Format */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-5 text-center border-b border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Montant Total Net
          </span>
          <div className="text-4xl font-black text-amber-400 font-mono tracking-tight mt-1 drop-shadow-md">
            {formatMoney(totalToPay, settings.currency)}
          </div>
        </div>

        {/* Sélection Mode de Paiement */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'especes', label: 'Espèces', icon: <Banknote className="w-5 h-5" /> },
              { id: 'momo', label: 'MoMo / Wave', icon: <Smartphone className="w-5 h-5" /> },
              { id: 'carte', label: 'Carte Bancaire', icon: <CreditCard className="w-5 h-5" /> },
              { id: 'credit', label: 'Ardoise / Crédit', icon: <UserCheck className="w-5 h-5" /> }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as PaymentMethod)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 active:scale-95 select-none ${
                  method === m.id
                    ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/40'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border-white/5 hover:border-white/15 font-bold'
                }`}
              >
                {m.icon}
                <span className="text-xs mt-1.5 text-center leading-tight">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Formulaire spécifique au mode de paiement */}
          {method === 'especes' && (
            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Montant Reçu en Espèces :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-2xl font-black text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-amber-400 font-mono">
                    {settings.currency}
                  </span>
                </div>
              </div>

              {/* Raccourcis coupures usuelles */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                  Coupures directes :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleQuickCash(totalToPay)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-black border border-emerald-500/30 transition active:scale-95"
                  >
                    Montant exact
                  </button>
                  {[1000, 2000, 5000, 10000, 20000].map((billet) => (
                    <button
                      key={billet}
                      onClick={() => handleQuickCash(billet)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/5 transition active:scale-95 font-mono"
                    >
                      {billet.toLocaleString('fr-FR')} F
                    </button>
                  ))}
                  <button
                    onClick={() => addQuickCash(500)}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/20 transition active:scale-95 font-mono"
                  >
                    +500 F
                  </button>
                </div>
              </div>

              {/* Calculateur de Monnaie à Rendre */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-xs font-extrabold text-slate-400 block uppercase tracking-wider">
                    Monnaie à Rendre :
                  </span>
                  {isCashInsufficient && (
                    <span className="text-[11px] text-rose-400 font-bold">
                      Montant manquant : {formatMoney(totalToPay - cashGiven, settings.currency)}
                    </span>
                  )}
                </div>
                <div className={`text-2xl font-black font-mono tracking-tight ${isCashInsufficient ? 'text-rose-500' : 'text-emerald-400 drop-shadow-sm'}`}>
                  {formatMoney(changeDue, settings.currency)}
                </div>
              </div>
            </div>
          )}

          {method === 'momo' && (
            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 space-y-3">
              <label className="block text-xs font-bold text-slate-400">Opérateur Mobile Money :</label>
              <div className="grid grid-cols-2 gap-2">
                {['MTN Mobile Money', 'Airtel Money', 'Orange Money', 'Wave'].map((op) => (
                  <button
                    key={op}
                    onClick={() => setMomoOperator(op)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-left transition ${
                      momoOperator === op
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 italic mt-1 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                Le client transfère <strong>{formatMoney(totalToPay, settings.currency)}</strong> sur le compte barman ({momoOperator}).
              </p>
            </div>
          )}

          {method === 'carte' && (
            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-6 text-center">
              <CreditCard className="w-10 h-10 text-sky-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">Terminal Carte / TPE</p>
              <p className="text-xs text-slate-400 mt-1">Insérez ou passez la carte bancaire sur le terminal.</p>
            </div>
          )}

          {method === 'credit' && (
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Mise sur l'ardoise (Crédit Client)</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Nom du Client :</label>
                <input
                  type="text"
                  value={clientTabName}
                  onChange={(e) => setClientTabName(e.target.value)}
                  placeholder="Nom de la personne de confiance..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Bouton de Validation */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition active:scale-95"
          >
            Annuler
          </button>

          <button
            onClick={handleValidate}
            disabled={isCashInsufficient}
            className={`flex-1 py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-98 shadow-xl ${
              isCashInsufficient
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 shadow-emerald-500/25 ring-1 ring-emerald-400/30 cursor-pointer'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>VALIDER & IMPRIMER TICKET</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
