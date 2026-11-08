import React, { useState } from 'react';
import {
  Wine, ArrowRight, Building2, Phone, MapPin,
  Lock, Eye, EyeOff, CheckCircle2, Sparkles, Globe
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import type { Plan } from '../store/appStore';

const PLANS: { id: Plan; label: string; prix: string; desc: string; couleur: string }[] = [
  {
    id: 'gratuit',
    label: 'Essai Gratuit',
    prix: '0 F / 30 jours',
    desc: 'Testez sans engagement pendant 30 jours. 1 poste, stockage local.',
    couleur: 'slate'
  },
  {
    id: 'solo',
    label: 'Solo',
    prix: '5 000 F / mois',
    desc: 'Pour un seul bar. 1 poste de caisse, rapports Z, gestion stocks.',
    couleur: 'amber'
  },
  {
    id: 'pro',
    label: 'Pro',
    prix: '12 000 F / mois',
    desc: 'Multi-devices (jusqu\'à 3), synchronisation cloud, historique complet.',
    couleur: 'blue'
  },
  {
    id: 'business',
    label: 'Business',
    prix: '25 000 F / mois',
    desc: 'Multi-établissements, tableau de bord central, support prioritaire.',
    couleur: 'purple'
  }
];

const TYPES = [
  { id: 'bar', label: 'Bar / Bistrot' },
  { id: 'cave', label: 'Cave / Caviste' },
  { id: 'buvette', label: 'Buvette / Maquis' },
  { id: 'lounge', label: 'Lounge / Night' },
  { id: 'restaurant', label: 'Bar-Restaurant' }
];

export const OnboardingPage: React.FC = () => {
  const { configurer } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  /* Champs */
  const [nomBar, setNomBar] = useState('');
  const [sousTitle, setSousTitle] = useState('Bar • Cave • Lounge');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [devise, setDevise] = useState('FCFA');
  const [pays, setPays] = useState('Congo (Brazzaville)');
  const [typeEtablissement, setTypeEtablissement] = useState<'bar' | 'cave' | 'buvette' | 'lounge' | 'restaurant'>('bar');
  const [plan, setPlan] = useState<Plan>('gratuit');
  const [proprietaireNom, setProprietaireNom] = useState('');
  const [proprietaireEmail, setProprietaireEmail] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');

  const validerStep1 = () => {
    if (!nomBar.trim() || !proprietaireNom.trim()) return;
    setStep(2);
  };

  const validerStep2 = () => {
    setStep(3);
  };

  const validerStep3 = async () => {
    if (pin.length < 4) { setPinError('Le code PIN doit faire au moins 4 caractères.'); return; }
    if (pin !== pinConfirm) { setPinError('Les deux codes PIN ne correspondent pas.'); return; }
    setPinError('');
    setLoading(true);
    await configurer(
      { nomBar, sousTitle, adresse, telephone, devise, pays, typeEtablissement, plan, proprietaireNom, proprietaireEmail },
      pin
    );
    setLoading(false);
  };

  const planColor: Record<string, string> = {
    slate: 'border-slate-700 bg-slate-800/60 hover:border-slate-500',
    amber: 'border-amber-500/60 bg-amber-500/10 hover:border-amber-400',
    blue: 'border-blue-500/60 bg-blue-500/10 hover:border-blue-400',
    purple: 'border-purple-500/60 bg-purple-500/10 hover:border-purple-400'
  };

  const selectedPlanColor: Record<string, string> = {
    slate: 'border-slate-400 bg-slate-800 ring-2 ring-slate-400',
    amber: 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400',
    blue: 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-400',
    purple: 'border-purple-400 bg-purple-500/20 ring-2 ring-purple-400'
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Logo & Titre */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
          <Wine className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">SoloBar POS</h1>
          <p className="text-sm text-amber-400 font-semibold">Caisse tactile pour bars & buvettes</p>
        </div>
      </div>

      {/* Indicateur d'étapes */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
              step === s
                ? 'bg-amber-500 border-amber-400 text-slate-950 scale-110'
                : step > s
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`w-10 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Card Principale */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* ═══ ÉTAPE 1 : Infos du Bar & Propriétaire ═══ */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Étape 1 sur 3</span>
              <h2 className="text-xl font-black text-white mt-1">Présentez votre établissement</h2>
              <p className="text-xs text-slate-400 mt-1">Ces infos apparaîtront sur vos tickets de caisse.</p>
            </div>

            <div className="space-y-3">
              {/* Nom du bar */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  <Building2 className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  Nom de l'établissement *
                </label>
                <input type="text" value={nomBar} onChange={(e) => setNomBar(e.target.value)}
                  placeholder="Ex: BAR LE REPAIRE, LA CAVE DU FLEUVE..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500 text-sm" />
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Slogan / Sous-titre</label>
                <input type="text" value={sousTitle} onChange={(e) => setSousTitle(e.target.value)}
                  placeholder="Bar • Cave • Buvette..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-amber-500" />
              </div>

              {/* Type d'établissement */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Type d'établissement</label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button key={t.id} onClick={() => setTypeEtablissement(t.id as typeof typeEtablissement)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        typeEtablissement === t.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Téléphone & Adresse */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    <Phone className="w-3 h-3 inline mr-1 text-slate-400" />Téléphone
                  </label>
                  <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+242 06 000 00 00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    <Globe className="w-3 h-3 inline mr-1 text-slate-400" />Devise
                  </label>
                  <input type="text" value={devise} onChange={(e) => setDevise(e.target.value)}
                    placeholder="FCFA, EUR..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />Adresse physique
                </label>
                <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)}
                  placeholder="Quartier, Rue, Arrondissement..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500" />
              </div>

              {/* Séparateur propriétaire */}
              <div className="border-t border-slate-800 pt-3">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Propriétaire / Gérant</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nom complet *</label>
                    <input type="text" value={proprietaireNom} onChange={(e) => setProprietaireNom(e.target.value)}
                      placeholder="Votre nom..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email (optionnel)</label>
                    <input type="email" value={proprietaireEmail} onChange={(e) => setProprietaireEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={validerStep1} disabled={!nomBar.trim() || !proprietaireNom.trim()}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition active:scale-98">
              Continuer <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ═══ ÉTAPE 2 : Choix du Plan ═══ */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Étape 2 sur 3</span>
              <h2 className="text-xl font-black text-white mt-1">Choisissez votre abonnement</h2>
              <p className="text-xs text-slate-400 mt-1">Commencez gratuitement, upgradez quand vous voulez.</p>
            </div>

            <div className="space-y-3">
              {PLANS.map((p) => (
                <button key={p.id} onClick={() => setPlan(p.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    plan === p.id ? selectedPlanColor[p.couleur] : planColor[p.couleur]
                  }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {plan === p.id && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                        <span className="font-black text-sm text-white">{p.label}</span>
                        {p.id === 'solo' && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                            Recommandé
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{p.desc}</p>
                    </div>
                    <span className="text-xs font-black text-amber-400 whitespace-nowrap ml-3">{p.prix}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition">
                Retour
              </button>
              <button onClick={validerStep2}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition active:scale-98">
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══ ÉTAPE 3 : Code PIN de sécurité ═══ */}
        {step === 3 && (
          <div className="p-6 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Étape 3 sur 3</span>
              <h2 className="text-xl font-black text-white mt-1">Sécurisez votre caisse</h2>
              <p className="text-xs text-slate-400 mt-1">Ce code PIN protège les paramètres et la clôture de caisse.</p>
            </div>

            <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <strong className="text-white">{nomBar}</strong>
                <span className="text-slate-400"> — Plan </span>
                <strong className="text-amber-400">{PLANS.find(p => p.id === plan)?.label}</strong>
                <br />
                <span className="text-slate-400">Propriétaire : {proprietaireNom}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  <Lock className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  Code PIN (min. 4 chiffres ou caractères)
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={8}
                    placeholder="••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-white font-mono tracking-[0.4em] text-xl focus:outline-none focus:border-amber-500 pr-10"
                  />
                  <button onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confirmer le code PIN</label>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinConfirm}
                  onChange={(e) => { setPinConfirm(e.target.value); setPinError(''); }}
                  maxLength={8}
                  placeholder="••••"
                  className={`w-full bg-slate-950 border rounded-xl px-3 py-3 text-white font-mono tracking-[0.4em] text-xl focus:outline-none ${
                    pinError ? 'border-rose-500' : pinConfirm && pin === pinConfirm ? 'border-emerald-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 font-semibold">{pinError}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(2)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition">
                Retour
              </button>
              <button onClick={validerStep3} disabled={loading || pin.length < 4 || pin !== pinConfirm}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-emerald-500/20">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Lancer SoloBar POS
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 mt-6 text-center max-w-xs">
        Vos données sont stockées localement sur cet appareil. Aucune connexion internet requise pour fonctionner.
      </p>
    </div>
  );
};
