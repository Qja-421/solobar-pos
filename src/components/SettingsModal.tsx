import React, { useState } from 'react';
import { X, Settings, ShieldCheck, Printer, Save, RefreshCw, Check } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { hashPin } from '../utils/security';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSoloBarStore();

  const [barName, setBarName] = useState(settings.barName);
  const [subTitle, setSubTitle] = useState(settings.subTitle);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [currency, setCurrency] = useState(settings.currency);
  const [receiptHeader, setReceiptHeader] = useState(settings.receiptHeader);
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(settings.autoPrintReceipt);
  const [newPin, setNewPin] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: any = {
      barName: barName.trim(),
      subTitle: subTitle.trim(),
      address: address.trim(),
      phone: phone.trim(),
      currency: currency.trim() || 'FCFA',
      receiptHeader: receiptHeader.trim(),
      receiptFooter: receiptFooter.trim(),
      autoPrintReceipt
    };

    if (newPin.trim()) {
      updates.pinHash = await hashPin(newPin.trim());
    }

    updateSettings(updates);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Paramètres Établissement</h3>
              <p className="text-[11px] text-slate-400">Configuration générale et impression</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Nom de l'établissement :</label>
            <input
              type="text"
              required
              value={barName}
              onChange={(e) => setBarName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Sous-titre / Slogan :</label>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Bar • Cave • Lounge"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Téléphone de contact :</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Devise :</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="FCFA, EUR, USD..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Adresse physique :</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Ticket de caisse */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h4 className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              <span>Personnalisation du Ticket Thermique</span>
            </h4>

            <div>
              <label className="block text-slate-400 mb-1">Message d'accueil (Haut de ticket) :</label>
              <input
                type="text"
                value={receiptHeader}
                onChange={(e) => setReceiptHeader(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Message de remerciement (Pied de ticket) :</label>
              <input
                type="text"
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={autoPrintReceipt}
                onChange={(e) => setAutoPrintReceipt(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-4 h-4"
              />
              <span className="text-slate-300 font-semibold">
                Impression automatique du ticket après chaque vente
              </span>
            </label>
          </div>

          {/* Sécurité PIN */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="font-extrabold text-slate-200 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Code PIN de Sécurité (Optionnel)</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Protégez l'accès aux paramètres et à la clôture de caisse avec un code à 4 chiffres.
            </p>
            <input
              type="password"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Nouveau code PIN à 4 chiffres..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white tracking-widest font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Bouton de sauvegarde */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>MODIFICATIONS ENREGISTRÉES !</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>ENREGISTRER LES PARAMÈTRES</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
