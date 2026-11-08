import React, { useState } from 'react';
import {
  ShieldCheck, Users, TrendingUp, Package, AlertTriangle,
  LogOut, Edit3, Trash2, Plus, CheckCircle2, XCircle,
  Eye, EyeOff, Lock, BarChart3, Crown, Zap
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import type { Etablissement, Plan } from '../store/appStore';

/* ════════════ LOGIN SUPER ADMIN ════════════ */
const SuperAdminLogin: React.FC = () => {
  const { authentifierSuperAdmin } = useAppStore();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await authentifierSuperAdmin(pin);
    setLoading(false);
    if (!ok) { setError('Code PIN Super Admin incorrect.'); setPin(''); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-purple-500/20">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-black text-white">Super Administrateur</h1>
          <p className="text-xs text-slate-400 mt-1 text-center">Accès réservé à l'équipe SoloBar POS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              <Lock className="w-3.5 h-3.5 inline mr-1" />Code PIN Super Admin
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(''); }}
                placeholder="Code PIN confidentiel..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-lg tracking-widest focus:outline-none focus:border-purple-500 pr-12"
              />
              <button type="button" onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

          <button type="submit" disabled={!pin.trim() || loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-sm transition">
            {loading ? 'Vérification...' : 'Accéder au Super Admin'}
          </button>
        </form>

        <p className="text-[11px] text-slate-600 text-center mt-4">
          PIN par défaut : <span className="font-mono text-slate-500">solobar2026</span>
        </p>
      </div>
    </div>
  );
};

/* ════════════ DASHBOARD SUPER ADMIN ════════════ */
const PLAN_BADGE: Record<Plan, { label: string; color: string }> = {
  gratuit: { label: 'Essai', color: 'bg-slate-700 text-slate-300' },
  solo:    { label: 'Solo', color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  pro:     { label: 'Pro', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  business:{ label: 'Business', color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' }
};

const STATUT_BADGE: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  actif:    { label: 'Actif', icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-emerald-400' },
  suspendu: { label: 'Suspendu', icon: <AlertTriangle className="w-3 h-3" />, color: 'text-amber-400' },
  expire:   { label: 'Expiré', icon: <XCircle className="w-3 h-3" />, color: 'text-rose-400' },
  essai:    { label: 'Essai', icon: <Zap className="w-3 h-3" />, color: 'text-sky-400' }
};

const SuperAdminDashboard: React.FC = () => {
  const { clients, deconnecterSuperAdmin, modifierClient, supprimerClient, ajouterClient } = useAppStore();
  const [activeTab, setActiveTab] = useState<'clients' | 'stats'>('clients');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  /* Stats globales */
  const stats = {
    total: clients.length,
    actifs: clients.filter(c => c.statut === 'actif').length,
    essai: clients.filter(c => c.statut === 'essai').length,
    revenus: clients.filter(c => c.plan === 'solo').length * 5000
      + clients.filter(c => c.plan === 'pro').length * 12000
      + clients.filter(c => c.plan === 'business').length * 25000
  };

  const handleStatutToggle = (c: Etablissement) => {
    modifierClient(c.id, { statut: c.statut === 'actif' ? 'suspendu' : 'actif' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white">SoloBar POS — Super Admin</h1>
            <p className="text-[10px] text-slate-400">Gestion des abonnements & établissements</p>
          </div>
        </div>
        <button onClick={deconnecterSuperAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
          <LogOut className="w-3.5 h-3.5" /> Déconnexion
        </button>
      </header>

      {/* KPI Cards */}
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Établissements', value: stats.total, icon: <Package className="w-5 h-5 text-amber-400" />, color: 'amber' },
          { label: 'Clients Actifs', value: stats.actifs, icon: <Users className="w-5 h-5 text-emerald-400" />, color: 'emerald' },
          { label: 'En Essai Gratuit', value: stats.essai, icon: <Zap className="w-5 h-5 text-sky-400" />, color: 'sky' },
          { label: 'Revenus Estimés / mois', value: `${stats.revenus.toLocaleString('fr-FR')} F`, icon: <TrendingUp className="w-5 h-5 text-purple-400" />, color: 'purple' }
        ].map((kpi) => (
          <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">{kpi.label}</span>
              {kpi.icon}
            </div>
            <span className="text-2xl font-black text-white">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-5 pb-2 flex gap-2">
        {[
          { id: 'clients', label: 'Liste des Clients', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'stats', label: 'Statistiques', icon: <BarChart3 className="w-3.5 h-3.5" /> }
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === t.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}

        <button onClick={() => setShowAddForm(true)}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition">
          <Plus className="w-3.5 h-3.5" /> Ajouter un client
        </button>
      </div>

      {/* Tableau des clients */}
      {activeTab === 'clients' && (
        <div className="px-5 pb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {clients.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">
                Aucun établissement inscrit pour l'instant.
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60">
                    {['Établissement', 'Propriétaire', 'Plan', 'Statut', 'Expiration', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {clients.map((c) => {
                    const planB = PLAN_BADGE[c.plan];
                    const statutB = STATUT_BADGE[c.statut] || STATUT_BADGE.actif;
                    const expirationDate = new Date(c.dateExpiration);
                    const isExpiringSoon = (expirationDate.getTime() - Date.now()) < 7 * 24 * 3600 * 1000;

                    return (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3">
                          <div className="font-bold text-white">{c.nomBar}</div>
                          <div className="text-slate-500 text-[10px]">{c.typeEtablissement} • {c.pays}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200">{c.proprietaireNom}</div>
                          <div className="text-slate-500 text-[10px]">{c.proprietaireEmail || '—'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${planB.color}`}>
                            {planB.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center gap-1 font-semibold ${statutB.color}`}>
                            {statutB.icon}
                            <span>{statutB.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-mono text-[11px] ${isExpiringSoon ? 'text-rose-400' : 'text-slate-400'}`}>
                            {expirationDate.toLocaleDateString('fr-FR')}
                            {isExpiringSoon && ' ⚠'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStatutToggle(c)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                                c.statut === 'actif'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              }`}>
                              {c.statut === 'actif' ? 'Suspendre' : 'Activer'}
                            </button>
                            <button
                              onClick={() => { if (window.confirm(`Supprimer ${c.nomBar} ?`)) supprimerClient(c.id); }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div className="px-5 pb-10 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-black text-sm text-white mb-3">Répartition par Plan</h3>
            {(['gratuit', 'solo', 'pro', 'business'] as Plan[]).map((p) => {
              const count = clients.filter(c => c.plan === p).length;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const badge = PLAN_BADGE[p];
              return (
                <div key={p} className="flex items-center gap-3 mb-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full w-20 text-center ${badge.color}`}>{badge.label}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-300 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════ EXPORT PRINCIPAL ════════════ */
export const SuperAdminPage: React.FC = () => {
  const { superAdminAuthenticated } = useAppStore();
  return superAdminAuthenticated ? <SuperAdminDashboard /> : <SuperAdminLogin />;
};
