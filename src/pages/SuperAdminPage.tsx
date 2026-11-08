import React, { useState } from 'react';
import {
  Users, TrendingUp, Package, AlertTriangle,
  LogOut, Trash2, Plus, CheckCircle2, XCircle,
  Eye, EyeOff, Lock, BarChart3, Crown, Zap, X, Building2
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-ambient-mesh">
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-purple-500/25 ring-4 ring-purple-500/20">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Super Administrateur</h1>
          <p className="text-xs text-slate-400 mt-1 text-center">Accès gestion centrale SoloBar POS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              <Lock className="w-3.5 h-3.5 inline mr-1 text-purple-400" />Code PIN Super Admin
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(''); }}
                placeholder="Code PIN confidentiel..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg tracking-widest focus:outline-none focus:border-purple-500 pr-12"
              />
              <button type="button" onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

          <button type="submit" disabled={!pin.trim() || loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-wider transition active:scale-98 shadow-lg shadow-purple-600/25 cursor-pointer">
            {loading ? 'Vérification...' : 'Accéder au Super Admin'}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center mt-4">
          PIN par défaut : <span className="font-mono text-purple-300 font-bold">solobar2026</span>
        </p>
      </div>
    </div>
  );
};

/* ════════════ DASHBOARD SUPER ADMIN ════════════ */
const PLAN_BADGE: Record<Plan, { label: string; color: string }> = {
  gratuit: { label: 'Essai', color: 'bg-slate-800 border border-white/10 text-slate-300' },
  solo:    { label: 'Solo', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  pro:     { label: 'Pro', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  business:{ label: 'Business', color: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' }
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
  const [showAddForm, setShowAddForm] = useState(false);

  // New Client Form
  const [newNomBar, setNewNomBar] = useState('');
  const [newType, setNewType] = useState<Etablissement['typeEtablissement']>('bar');
  const [newProprietaireNom, setNewProprietaireNom] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<Plan>('solo');
  const [newTelephone, setNewTelephone] = useState('');
  const [newPays, setNewPays] = useState('Congo (Brazzaville)');

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

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNomBar.trim() || !newProprietaireNom.trim()) return;

    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 365);

    ajouterClient({
      nomBar: newNomBar.trim(),
      sousTitle: 'Bar • Cave • Lounge',
      adresse: 'Brazzaville',
      telephone: newTelephone.trim() || '+242 06 000 00 00',
      devise: 'FCFA',
      pays: newPays,
      typeEtablissement: newType,
      plan: newPlan,
      dateExpiration: expiration.toISOString(),
      statut: 'actif',
      proprietaireNom: newProprietaireNom.trim(),
      proprietaireEmail: newEmail.trim()
    });

    setNewNomBar('');
    setNewProprietaireNom('');
    setNewEmail('');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-ambient-mesh">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white tracking-tight">SoloBar POS — Super Admin</h1>
            <p className="text-[11px] text-slate-400">Gestion centrale des abonnements & établissements</p>
          </div>
        </div>
        <button onClick={deconnecterSuperAdmin}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition active:scale-95 border border-white/5">
          <LogOut className="w-3.5 h-3.5" /> Déconnexion
        </button>
      </header>

      {/* KPI Cards */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Établissements', value: stats.total, icon: <Package className="w-5 h-5 text-amber-400" /> },
          { label: 'Clients Actifs', value: stats.actifs, icon: <Users className="w-5 h-5 text-emerald-400" /> },
          { label: 'En Essai Gratuit', value: stats.essai, icon: <Zap className="w-5 h-5 text-sky-400" /> },
          { label: 'Revenus Estimés / mois', value: `${stats.revenus.toLocaleString('fr-FR')} F`, icon: <TrendingUp className="w-5 h-5 text-purple-400" /> }
        ].map((kpi) => (
          <div key={kpi.label} className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 backdrop-blur-md shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{kpi.label}</span>
              {kpi.icon}
            </div>
            <span className="text-2xl font-black text-white font-mono tracking-tight">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 pb-3 flex items-center gap-2">
        {[
          { id: 'clients', label: 'Liste des Clients', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'stats', label: 'Statistiques', icon: <BarChart3 className="w-3.5 h-3.5" /> }
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black transition ${
              activeTab === t.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}

        <button onClick={() => setShowAddForm(true)}
          className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer">
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Ajouter un client
        </button>
      </div>

      {/* Modal Ajouter un Client */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-sm text-white">Ajouter un Client Manuel</h3>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClientSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Nom du Bar / Établissement *</label>
                <input required type="text" value={newNomBar} onChange={(e) => setNewNomBar(e.target.value)}
                  placeholder="Ex: Le Cercle Lounge"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500" />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Nom du Gérant / Propriétaire *</label>
                <input required type="text" value={newProprietaireNom} onChange={(e) => setNewProprietaireNom(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Plan</label>
                  <select value={newPlan} onChange={(e) => setNewPlan(e.target.value as Plan)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none">
                    <option value="gratuit">Gratuit</option>
                    <option value="solo">Solo (5k/m)</option>
                    <option value="pro">Pro (12k/m)</option>
                    <option value="business">Business (25k/m)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition">
                  Enregistrer Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau des clients */}
      {activeTab === 'clients' && (
        <div className="px-6 pb-10">
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
            {clients.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                Aucun établissement inscrit pour l'instant.
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-950/60">
                    {['Établissement', 'Propriétaire', 'Plan', 'Statut', 'Expiration', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clients.map((c) => {
                    const planB = PLAN_BADGE[c.plan];
                    const statutB = STATUT_BADGE[c.statut] || STATUT_BADGE.actif;
                    const expirationDate = new Date(c.dateExpiration);
                    const isExpiringSoon = (expirationDate.getTime() - Date.now()) < 7 * 24 * 3600 * 1000;

                    return (
                      <tr key={c.id} className="hover:bg-slate-850/60 transition">
                        <td className="px-5 py-3.5">
                          <div className="font-black text-white text-sm">{c.nomBar}</div>
                          <div className="text-slate-400 text-[11px]">{c.typeEtablissement} • {c.pays}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="text-slate-200 font-bold">{c.proprietaireNom}</div>
                          <div className="text-slate-500 text-[10px]">{c.proprietaireEmail || '—'}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${planB.color}`}>
                            {planB.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className={`flex items-center gap-1.5 font-bold ${statutB.color}`}>
                            {statutB.icon}
                            <span>{statutB.label}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`font-mono text-xs ${isExpiringSoon ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                            {expirationDate.toLocaleDateString('fr-FR')}
                            {isExpiringSoon && ' ⚠'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStatutToggle(c)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition active:scale-95 ${
                                c.statut === 'actif'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              }`}>
                              {c.statut === 'actif' ? 'Suspendre' : 'Activer'}
                            </button>
                            <button
                              onClick={() => { if (window.confirm(`Supprimer ${c.nomBar} ?`)) supprimerClient(c.id); }}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition active:scale-95">
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
        <div className="px-6 pb-10 space-y-4">
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="font-black text-sm text-white mb-4">Répartition par Plan</h3>
            {(['gratuit', 'solo', 'pro', 'business'] as Plan[]).map((p) => {
              const count = clients.filter(c => c.plan === p).length;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const badge = PLAN_BADGE[p];
              return (
                <div key={p} className="flex items-center gap-3 mb-3.5">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full w-24 text-center ${badge.color}`}>{badge.label}</span>
                  <div className="flex-1 bg-slate-950 rounded-full h-2.5 border border-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 w-10 text-right">{count}</span>
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
