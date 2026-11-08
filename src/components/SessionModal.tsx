import React, { useState } from 'react';
import { X, DollarSign, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { formatMoney } from '../utils/security';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({ isOpen, onClose }) => {
  const { currentSession, openSession, closeSession, settings } = useSoloBarStore();

  const [initialCashInput, setInitialCashInput] = useState<number>(10000);
  const [operatorName, setOperatorName] = useState<string>('Barman / Caissière');
  const [countedCash, setCountedCash] = useState<number>(currentSession?.expectedCash || 0);
  const [closingNote, setClosingNote] = useState<string>('');
  const [isClosingStep, setIsClosingStep] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleOpen = () => {
    openSession(initialCashInput, operatorName);
    onClose();
  };

  const handleClose = () => {
    closeSession(countedCash, closingNote);
    setIsClosingStep(false);
    onClose();
  };

  const discrepancy = currentSession ? countedCash - currentSession.expectedCash : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Gestion Caisse & Rapport Z</h3>
              <p className="text-[11px] text-slate-400">Contrôle des flux d'espèces et du service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu : Si Caisse Ouverte */}
        {currentSession ? (
          <div className="p-5 space-y-4">
            {/* Statut session active */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Ouverte par :</span>
                <span className="text-xs font-bold text-white">{currentSession.openedBy}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Heure d'ouverture :</span>
                <span className="text-xs font-mono text-slate-300">
                  {new Date(currentSession.openedAt).toLocaleTimeString('fr-FR')}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Fond de caisse initial :</span>
                <span className="text-xs font-bold text-slate-200">
                  {formatMoney(currentSession.initialCash, settings.currency)}
                </span>
              </div>

              {/* Détail des ventes */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Ventes Espèces :</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {formatMoney(currentSession.cashSales, settings.currency)}
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Ventes Mobile Money :</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {formatMoney(currentSession.momoSales, settings.currency)}
                  </span>
                </div>
              </div>

              {/* Total Espèces théoriques dans le tiroir */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Espèces attendues dans le tiroir :</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {formatMoney(currentSession.expectedCash, settings.currency)}
                </span>
              </div>
            </div>

            {/* Étape de clôture Z */}
            {isClosingStep ? (
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Comptage Physique des Billets (Clôture Z)</span>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Montant réellement compté dans le tiroir :
                  </label>
                  <input
                    type="number"
                    value={countedCash}
                    onChange={(e) => setCountedCash(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xl font-black font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Écart de caisse */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <span>Écart de caisse :</span>
                  <span
                    className={`font-black font-mono text-sm ${
                      discrepancy === 0
                        ? 'text-emerald-400'
                        : discrepancy > 0
                        ? 'text-sky-400'
                        : 'text-rose-500'
                    }`}
                  >
                    {discrepancy > 0 ? `+${formatMoney(discrepancy, settings.currency)}` : formatMoney(discrepancy, settings.currency)}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Note de clôture (optionnel) :</label>
                  <input
                    type="text"
                    value={closingNote}
                    onChange={(e) => setClosingNote(e.target.value)}
                    placeholder="Ex: Fin de service sans incident, pourboires retirés..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsClosingStep(false)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>CONFIRMER LA FERMETURE Z</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCountedCash(currentSession.expectedCash);
                  setIsClosingStep(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>CLÔTURER LA SESSION (RAPPORT Z)</span>
              </button>
            )}
          </div>
        ) : (
          /* Si Caisse Fermée -> Ouvrir */
          <div className="p-5 space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 flex items-center gap-3">
              <Unlock className="w-5 h-5 flex-shrink-0 text-amber-400" />
              <span>La caisse est actuellement fermée. Indiquez le fond de caisse initial pour commencer les ventes.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fond de Caisse Initial :
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={initialCashInput}
                  onChange={(e) => setInitialCashInput(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-black font-mono text-white focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  {settings.currency}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nom du Barman / Opérateur :
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleOpen}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-emerald-500/20"
            >
              <Unlock className="w-4 h-4" />
              <span>OUVRIR LA CAISSE ET COMMENCER</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
