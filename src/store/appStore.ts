import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hashPin } from '../utils/security';

export type Plan = 'gratuit' | 'solo' | 'pro' | 'business';

export interface Etablissement {
  id: string;
  nomBar: string;
  sousTitle: string;
  adresse: string;
  telephone: string;
  devise: string;
  pays: string;
  typeEtablissement: 'bar' | 'cave' | 'buvette' | 'lounge' | 'restaurant';
  plan: Plan;
  dateInscription: string;
  dateExpiration: string;
  statut: 'actif' | 'suspendu' | 'expire' | 'essai';
  proprietaireNom: string;
  proprietaireEmail: string;
}

interface AppState {
  /* Onboarding */
  isConfigured: boolean;
  etablissement: Etablissement | null;
  adminPinHash: string | null;
  superAdminPinHash: string | null;

  /* Actions */
  configurer: (data: Omit<Etablissement, 'id' | 'dateInscription' | 'dateExpiration' | 'statut'>, pin: string) => Promise<void>;
  reinitialiser: () => void;

  /* Super Admin */
  superAdminAuthenticated: boolean;
  authentifierSuperAdmin: (pin: string) => Promise<boolean>;
  deconnecterSuperAdmin: () => void;
  clients: Etablissement[];
  ajouterClient: (client: Omit<Etablissement, 'id' | 'dateInscription'>) => void;
  modifierClient: (id: string, updates: Partial<Etablissement>) => void;
  supprimerClient: (id: string) => void;
}

const SUPER_ADMIN_DEFAULT_PIN = 'solobar2026'; // Sera haché au premier lancement

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isConfigured: false,
      etablissement: null,
      adminPinHash: null,
      superAdminPinHash: null,
      superAdminAuthenticated: false,
      clients: [],

      configurer: async (data, pin) => {
        const pinHash = await hashPin(pin);
        // Génération d'un superAdminPin par défaut si pas encore défini
        let superAdminPinHash = get().superAdminPinHash;
        if (!superAdminPinHash) {
          superAdminPinHash = await hashPin(SUPER_ADMIN_DEFAULT_PIN);
        }

        const now = new Date();
        const expiration = new Date();
        expiration.setDate(now.getDate() + (data.plan === 'gratuit' ? 30 : 365));

        const nouvelEtablissement: Etablissement = {
          ...data,
          id: 'etab-' + Date.now(),
          dateInscription: now.toISOString(),
          dateExpiration: expiration.toISOString(),
          statut: data.plan === 'gratuit' ? 'essai' : 'actif',
        };

        set({
          isConfigured: true,
          etablissement: nouvelEtablissement,
          adminPinHash: pinHash,
          superAdminPinHash,
          clients: [...get().clients, nouvelEtablissement],
        });
      },

      reinitialiser: () => {
        set({ isConfigured: false, etablissement: null, adminPinHash: null });
      },

      authentifierSuperAdmin: async (pin) => {
        let superAdminPinHash = get().superAdminPinHash;
        if (!superAdminPinHash) {
          superAdminPinHash = await hashPin(SUPER_ADMIN_DEFAULT_PIN);
          set({ superAdminPinHash });
        }
        const { hashPin: hp } = await import('../utils/security');
        const inputHash = await hp(pin);
        const ok = inputHash === superAdminPinHash;
        if (ok) set({ superAdminAuthenticated: true });
        return ok;
      },

      deconnecterSuperAdmin: () => set({ superAdminAuthenticated: false }),

      ajouterClient: (client) => {
        const newClient: Etablissement = { ...client, id: 'etab-' + Date.now(), dateInscription: new Date().toISOString() };
        set((s) => ({ clients: [...s.clients, newClient] }));
      },

      modifierClient: (id, updates) => {
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          etablissement: s.etablissement?.id === id ? { ...s.etablissement, ...updates } : s.etablissement,
        }));
      },

      supprimerClient: (id) => {
        set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
      },
    }),
    { name: 'solobar_app_config_v1' }
  )
);
