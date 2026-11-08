import { useState } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { ProductGrid } from './components/ProductGrid';
import { CartPanel } from './components/CartPanel';
import { PaymentModal } from './components/PaymentModal';
import { SessionModal } from './components/SessionModal';
import { StockModal } from './components/StockModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingPage } from './pages/OnboardingPage';
import { SuperAdminPage } from './pages/SuperAdminPage';
import { useSoloBarStore } from './store/posStore';
import { useAppStore } from './store/appStore';
import { ShoppingCart, Crown, ArrowRight } from 'lucide-react';
import { formatMoney } from './utils/security';

export function App() {
  const { selectedCategory, setSelectedCategory, cart, cartDiscount, settings } = useSoloBarStore();
  const { isConfigured } = useAppStore();

  // Modales
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const finalTotal = Math.max(0, subtotal - cartDiscount);

  // Page Super Admin (accessible via ?superadmin dans l'URL ou bouton)
  const isSuperAdminRoute = typeof window !== 'undefined' && window.location.search.includes('superadmin');
  if (isSuperAdminRoute || showSuperAdmin) {
    return <SuperAdminPage />;
  }

  // Onboarding : premier lancement
  if (!isConfigured) {
    return <OnboardingPage />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans bg-ambient-mesh">
      {/* Barre Supérieure Glassmorphic */}
      <Header
        onOpenSession={() => setIsSessionOpen(true)}
        onOpenStock={() => setIsStockOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Corps Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Colonne de Gauche : Catalogue Produits & Catégories */}
        <main className="flex-1 flex flex-col p-3 md:p-5 min-w-0 overflow-hidden">
          {/* Sélecteur de Catégories */}
          <div className="mb-3.5">
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Grille de Produits */}
          <ProductGrid />
        </main>

        {/* Colonne de Droite : Panier Permanent (Desktop / Tablette paysage) */}
        <div className="hidden lg:flex">
          <CartPanel onOpenPayment={() => setIsPaymentOpen(true)} />
        </div>
      </div>

      {/* Barre Flottante Mobile pour le Panier */}
      <div className="lg:hidden p-3.5 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-3 shadow-2xl">
        <button
          onClick={() => setMobileCartOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-slate-200 text-xs font-bold active:scale-95 transition"
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span>Voir Panier</span>
        </button>

        <button
          onClick={() => setIsPaymentOpen(true)}
          disabled={cart.length === 0}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition active:scale-98 flex items-center justify-center gap-2 ${
            cart.length > 0
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>{cart.length > 0 ? `Payer • ${formatMoney(finalTotal, settings.currency)}` : 'Panier vide'}</span>
          {cart.length > 0 && <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />}
        </button>
      </div>

      {/* Drawer Mobile pour le panier */}
      {mobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-sm h-full bg-slate-950 shadow-2xl flex flex-col border-l border-white/10">
            <div className="p-3.5 border-b border-white/10 flex justify-between items-center bg-slate-900/60">
              <span className="font-extrabold text-sm text-white">Commande Mobile</span>
              <button
                onClick={() => setMobileCartOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 bg-slate-800 rounded-xl"
              >
                Fermer
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <CartPanel
                onOpenPayment={() => {
                  setMobileCartOpen(false);
                  setIsPaymentOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bouton Super Admin discret (coin bas-gauche) */}
      <button
        onClick={() => setShowSuperAdmin(true)}
        title="Accès Super Administrateur"
        className="fixed bottom-3 left-3 p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-600 hover:text-purple-400 transition shadow-lg z-40 group"
      >
        <Crown className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modales */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => {}}
      />
      <SessionModal isOpen={isSessionOpen} onClose={() => setIsSessionOpen(false)} />
      <StockModal isOpen={isStockOpen} onClose={() => setIsStockOpen(false)} />
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
