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
import { useSoloBarStore } from './store/posStore';
import { ShoppingCart } from 'lucide-react';
import { formatMoney } from './utils/security';

export function App() {
  const { selectedCategory, setSelectedCategory, cart, cartDiscount, settings } = useSoloBarStore();

  // Modales
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const finalTotal = Math.max(0, subtotal - cartDiscount);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Barre Supérieure */}
      <Header
        onOpenSession={() => setIsSessionOpen(true)}
        onOpenStock={() => setIsStockOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Corps Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Colonne de Gauche : Catalogue Produits & Catégories */}
        <main className="flex-1 flex flex-col p-3 md:p-4 min-w-0 overflow-hidden">
          {/* Sélecteur de Catégories */}
          <div className="mb-3">
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

      {/* Barre Flottante Mobile pour le Panier (Sur écran smartphone ou petit écran) */}
      <div className="lg:hidden p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between shadow-2xl">
        <button
          onClick={() => setMobileCartOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
        >
          <ShoppingCart className="w-4 h-4 text-amber-400" />
          <span>Voir Panier ({totalItemsCount})</span>
        </button>

        <button
          onClick={() => setIsPaymentOpen(true)}
          disabled={cart.length === 0}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition active:scale-95 ${
            cart.length > 0
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {cart.length > 0 ? `Encaisser • ${formatMoney(finalTotal, settings.currency)}` : 'Panier vide'}
        </button>
      </div>

      {/* Drawer Mobile pour le panier */}
      {mobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm h-full bg-slate-900 shadow-2xl flex flex-col">
            <div className="p-3 border-b border-slate-800 flex justify-between items-center">
              <span className="font-bold text-sm text-white">Panier Mobile</span>
              <button
                onClick={() => setMobileCartOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
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

      {/* Modales */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => {}}
      />

      <SessionModal
        isOpen={isSessionOpen}
        onClose={() => setIsSessionOpen(false)}
      />

      <StockModal
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
