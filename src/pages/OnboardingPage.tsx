import React, { useState } from 'react';
import {
  Wine, ArrowRight, Building2, Phone, MapPin,
  Lock, Eye, EyeOff, CheckCircle2, Sparkles, Globe, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import type { Plan } from '../store/appStore';

const PLANS: { id: Plan; label: string; prix: string; desc: string; badge?: string }[] = [
  {
    id: 'gratuit',
    label: 'Essai Gratuit 30 Jours',
    prix: '0 F / 30 jours',
    desc: 'Testez sans engagement. 1 poste caisse barman, stockage local complet.'
  },
  {
    id: 'solo',
    label: 'Pack Solo Barman',
    prix: '5 000 F / mois',
    desc: 'Pour un bar ou buvette autonome. Ventes illimitées, rapports Z & gestion stocks.',
    badge: 'Plus Populaire'
  },
  {
    id: 'pro',
    label: 'Pack Pro Multi-Postes',
    prix: '12 000 F / mois',
    desc: 'Multi-appareils, synchronisation cloud, sauvegarde automatique & historique illimité.'
  },
  {
    id: 'business',
    label: 'Pack Entreprise / Chaîne',
    prix: '25 000 F / mois',
    desc: 'Multi-établissements, tableau de bord propriétaire centralisé & support VIP direct.'
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
  const [plan, setPlan] = useState<Plan>('solo');
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
    if (pin.length < 4) { setPinError('Le code PIN doit faire au moins 4 chiffres.'); return; }
    if (pin !== pinConfirm) { setPinError('Les deux codes PIN ne correspondent pas.'); return; }
    setPinError('');
    setLoading(true);
    await configurer(
      { nomBar, sousTitle, adresse, telephone, devise, pays, typeEtablissement, plan, proprietaireNom, proprietaireEmail },
      pin
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-ambient-mesh relative overflow-hidden">
      {/* Halo lumineux d'ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="flex flex-col items-center mb-8 relative z-10 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 mb-3 ring-4 ring-white/10">
          <Wine className="w-8 h-8 text-white drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">SoloBar POS</h1>
        <p className="text-xs text-amber-400 font-bold tracking-wide uppercase mt-0.5">
          Système de caisse moderne pour bars & buvettes
        </p>
      </div>

      {/* Étapes Wizard */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        {[
          { stepNum: 1, label: 'Établissement' },
          { stepNum: 2, label: 'Formule' },
          { stepNum: 3, label: 'Sécurité PIN' }
        ].map((item, idx) => (
          <React.Fragment key={item.stepNum}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  step === item.stepNum
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 scale-105 shadow-md shadow-amber-500/20'
                    : step > item.stepNum
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-white/10 text-slate-500'
                }`}
              >
                {step > item.stepNum ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : item.stepNum}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${step === item.stepNum ? 'text-white' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </div>
            {idx < 2 && (
              <div className={`w-8 h-0.5 rounded-full ${step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card Principale Formulaire */}
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden backdrop-blur-xl relative z-10">
        {/* Étape 1 : Infos de base */}
        {step === 1 && (
          <div className="p-6 sm:p-7 space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Étape 1 sur 3</span>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">Configuration de votre bar</h2>
              <p className="text-xs text-slate-400 mt-1">Personnalisez votre caisse et vos tickets clients.</p>
            </div>

            <div className="space-y-3.5">
              {/* Nom du bar */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  Nom de l'établissement *
                </label>
                <input
                  type="text"
                  value={nomBar}
                  onChange={(e) => setNomBar(e.target.value)}
                  placeholder="Ex: BAR LE REPAIRE, LA CAVE CENTRALE..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-3 text-white font-bold text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Slogan / Sous-titre</label>
                <input
                  type="text"
                  value={sousTitle}
                  onChange={(e) => setSousTitle(e.target.value)}
                  placeholder="Bar • Cave • Lounge..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Type d'établissement */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Type de commerce</label>
                <div className="flex flex-wrap gap-1.5">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTypeEtablissement(t.id as typeof typeEtablissement)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        typeEtablissement === t.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/20'
                          : 'bg-slate-950/60 text-slate-400 border-white/5 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Téléphone & Devise */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    <Phone className="w-3 h-3 inline mr-1 text-slate-400" />Téléphone
                  </label>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+242 06 000 00 00"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    <Globe className="w-3 h-3 inline mr-1 text-slate-400" />Devise
                  </label>
                  <input
                    type="text"
                    value={devise}
                    onChange={(e) => setDevise(e.target.value)}
                    placeholder="FCFA, EUR, USD..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />Adresse ou Ville
                </label>
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="Quartier, Avenue, Ville..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Propriétaire */}
              <div className="border-t border-white/10 pt-3.5">
                <p className="text-[11px] text-amber-400 font-black uppercase tracking-wider mb-2.5">
                  Propriétaire / Responsable
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      value={proprietaireNom}
                      onChange={(e) => setProprietaireNom(e.target.value)}
                      placeholder="Votre nom..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email (optionnel)</label>
                    <input
                      type="email"
                      value={proprietaireEmail}
                      onChange={(e) => setProprietaireEmail(e.target.value)}
                      placeholder="contact@email.com"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={validerStep1}
              disabled={!nomBar.trim() || !proprietaireNom.trim()}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Continuer vers le plan</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Étape 2 : Choix du Plan */}
        {step === 2 && (
          <div className="p-6 sm:p-7 space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Étape 2 sur 3</span>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">Formule d'abonnement</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choisissez votre offre. Vous pourrez changer à tout moment.
              </p>
            </div>

            <div className="space-y-2.5">
              {PLANS.map((p) => {
                const isSelected = plan === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 border-amber-400/80 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/60 border-white/5 hover:border-white/20 hover:bg-slate-950/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-600'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="font-black text-sm text-white">{p.label}</span>
                          {p.badge && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 pl-6 leading-relaxed">{p.desc}</p>
                      </div>
                      <span className="text-xs font-black text-amber-400 font-mono whitespace-nowrap bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/5">
                        {p.prix}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Retour
              </button>
              <button
                onClick={validerStep2}
                className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-amber-500/20"
              >
                <span>Continuer vers le code PIN</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 : Code PIN de sécurité */}
        {step === 3 && (
          <div className="p-6 sm:p-7 space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Étape 3 sur 3</span>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">Code PIN Propriétaire</h2>
              <p className="text-xs text-slate-400 mt-1">
                Protégez vos bilans Z, les stocks et les modifications de prix.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-black text-white">{nomBar}</span>
                <span className="text-slate-400"> • Formule </span>
                <strong className="text-amber-400 font-bold">{PLANS.find(p => p.id === plan)?.label}</strong>
                <br />
                <span className="text-slate-400">Gérant : {proprietaireNom}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  <Lock className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  Code PIN de caisse (4 à 8 chiffres)
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={8}
                    placeholder="••••"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono tracking-[0.4em] text-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Confirmez le code PIN</label>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinConfirm}
                  onChange={(e) => { setPinConfirm(e.target.value); setPinError(''); }}
                  maxLength={8}
                  placeholder="••••"
                  className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white font-mono tracking-[0.4em] text-xl focus:outline-none ${
                    pinError ? 'border-rose-500' : pinConfirm && pin === pinConfirm ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 font-bold">{pinError}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Retour
              </button>
              <button
                onClick={validerStep3}
                disabled={loading || pin.length < 4 || pin !== pinConfirm}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-xl shadow-emerald-500/20 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>DÉMARRER SOLOBAR POS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-6 text-center max-w-xs relative z-10 font-medium">
        🔒 Stockage local sécurisé sur cet appareil. Fonctionne à 100% sans connexion internet.
      </p>
    </div>
  );
};
