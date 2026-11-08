import React, { useState, useEffect } from 'react';
import { Wine, Clock, DollarSign, Package, History, Settings, Sparkles } from 'lucide-react';
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
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;

  return (
    <header className="relative z-30 px-4 py-2.5 backdrop-blur-xl bg-slate-950/85 border-b border-white/10 shadow-2xl flex items-center justify-between">
      {/* Brand & Établissement Info */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300" />
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg text-white">
            <Wine className="w-5 h-5 drop-shadow-md" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-base text-white tracking-tight drop-shadow-sm">
              {settings.barName || 'SoloBar'}
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-300">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              Pro
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80"></span>
            Poste Unique • Barman & Caisse
          </p>
        </div>
      </div>

      {/* Centre : Live Session & Horloge */}
      <div className="hidden md:flex items-center gap-3">
        {/* Horloge Digitale */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/5 text-slate-300 text-xs font-mono shadow-inner">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-semibold tracking-wider">{time}</span>
        </div>

        {/* Session Caisse avec Indicateur Live */}
        {currentSession ? (
          <button
            onClick={onOpenSession}
            className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition shadow-sm hover:shadow-emerald-500/10 active:scale-98"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Session Ouverte:</span>
            <span className="font-extrabold text-white font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {formatMoney(currentSession.totalSales, settings.currency)}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenSession}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition shadow-sm active:scale-98"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Caisse Fermée</span>
            <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300">Ouvrir</span>
          </button>
        )}
      </div>

      {/* Actions Rapides / Navigation */}
      <div className="flex items-center gap-2">
        {/* Caisse Z */}
        <button
          onClick={onOpenSession}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 text-slate-200 text-xs font-bold transition shadow-sm active:scale-95 group"
          title="Rapport Z & Bilan Caisse"
        >
          <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Caisse Z</span>
        </button>

        {/* Stocks */}
        <button
          onClick={onOpenStock}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 text-slate-200 text-xs font-bold transition shadow-sm active:scale-95 group"
          title="Gestion des Stocks"
        >
          <Package className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Stocks</span>
          {lowStockCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-pulse">
              {lowStockCount}
            </span>
          )}
        </button>

        {/* Historique */}
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-sky-500/40 text-slate-200 text-xs font-bold transition shadow-sm active:scale-95 group"
          title="Historique des Ventes"
        >
          <History className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Ventes</span>
        </button>

        {/* Réglages */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition shadow-sm active:scale-95"
          title="Paramètres de l'établissement"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
