import React, { useState, useEffect } from 'react';
import { Wine, Clock, DollarSign, Package, History, Settings } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { formatMoney } from '../utils/security';

interface HeaderProps {
  onOpenSession: () => void;
  onOpenStock: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSession,
  onOpenStock,
  onOpenHistory,
  onOpenSettings
}) => {
  const { currentSession, settings, products } = useSoloBarStore();
  const [time, setTime] = useState(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-lg sticky top-0 z-30">
      {/* Logo & Info Barman */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl">
          <Wine className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base tracking-tight text-white leading-none">
              {settings.barName}
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              SoloBar POS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Poste Unique • Barman & Caisse</p>
        </div>
      </div>

      {/* Centre : Statut Caisse & Horloge */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Horloge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{time}</span>
        </div>

        {/* Statut Session Caisse */}
        {currentSession ? (
          <button
            onClick={onOpenSession}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Caisse Ouverte :</span>
            <span className="font-bold text-white">{formatMoney(currentSession.totalSales, settings.currency)}</span>
          </button>
        ) : (
          <button
            onClick={onOpenSession}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Caisse Fermée (Cliquer pour ouvrir)</span>
          </button>
        )}
      </div>

      {/* Raccourcis Actions Rapides */}
      <div className="flex items-center space-x-2">
        {/* Clôture / Bilan Caisse */}
        <button
          onClick={onOpenSession}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          title="Gestion Caisse & Clôture Z"
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Caisse Z</span>
        </button>

        {/* Stock */}
        <button
          onClick={onOpenStock}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          title="Gestion des Stocks & Produits"
        >
          <Package className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Stocks</span>
          {lowStockCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {lowStockCount}
            </span>
          )}
        </button>

        {/* Historique des Ventes */}
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          title="Historique des Commandes"
        >
          <History className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">Ventes</span>
        </button>

        {/* Paramètres */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          title="Paramètres de l'établissement"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
