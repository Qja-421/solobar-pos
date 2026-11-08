import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, User, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { formatMoney } from '../utils/security';

interface CartPanelProps {
  onOpenPayment: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ onOpenPayment }) => {
  const {
    cart,
    cartDiscount,
    customerName,
    setCustomerInfo,
    customerPhone,
    setCartDiscount,
    updateQuantity,
    removeFromCart,
    clearCart,
    settings
  } = useSoloBarStore();

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const finalTotal = Math.max(0, subtotal - cartDiscount);

  return (
    <aside className="w-full lg:w-96 bg-slate-950/95 border-l border-white/10 flex flex-col h-full shadow-2xl backdrop-blur-xl z-20">
      {/* En-tête Panier */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
            </div>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-scale">
                {totalItemsCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-black text-white text-sm tracking-tight leading-none">Commande en cours</h2>
            <span className="text-[11px] text-slate-400 font-medium">Poste Caisse Barman</span>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition active:scale-95"
            title="Vider la commande"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Vider</span>
          </button>
        )}
      </div>

      {/* Identifiant Client ou Table */}
      <div className="px-4 py-2.5 bg-slate-900/40 border-b border-white/5 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400">
          <User className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerInfo(e.target.value, customerPhone)}
          placeholder="Client / Table / Repère (ex: Table 4, VIP, Bar...)"
          className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-medium"
        />
      </div>

      {/* Liste des Articles du Panier */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-6">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mb-3 shadow-inner">
              <ShoppingCart className="w-7 h-7 text-slate-600" />
            </div>
            <p className="font-extrabold text-sm text-slate-300">Panier vide</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Touchez une boisson ou un plat dans le catalogue pour l'ajouter.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.productId}
              className="bg-slate-900/90 border border-white/5 hover:border-white/10 rounded-2xl p-3 flex items-center justify-between gap-2.5 shadow-sm transition"
            >
              {/* Infos article */}
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-xs text-slate-200 truncate leading-snug">
                  {item.product.name}
                </h4>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {formatMoney(item.unitPrice, settings.currency)} × {item.quantity}
                </div>
              </div>

              {/* Contrôles Quantité Tactiles */}
              <div className="flex items-center gap-1 bg-slate-950/80 border border-white/10 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center active:scale-95 transition"
                  title="Diminuer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-black text-xs text-white font-mono">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center active:scale-95 transition shadow-sm"
                  title="Augmenter"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>

              {/* Total Ligne & Retrait */}
              <div className="text-right pl-1 min-w-[70px]">
                <div className="font-black text-xs text-amber-400 font-mono">
                  {formatMoney(item.total, settings.currency)}
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-slate-500 hover:text-rose-400 text-[10px] font-semibold mt-0.5 inline-block transition"
                >
                  Retirer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Résumé Financier & Encaissement */}
      <div className="p-4 bg-slate-950 border-t border-white/10 space-y-3.5 shadow-2xl">
        {/* Sous-total & Remises Rapides */}
        {cart.length > 0 && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 font-medium">
              <span>Sous-total</span>
              <span className="font-mono text-slate-200 font-bold">
                {formatMoney(subtotal, settings.currency)}
              </span>
            </div>

            {/* Remise Rapide */}
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>Remise</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 500, 1000].map((rem) => (
                  <button
                    key={rem}
                    onClick={() => setCartDiscount(rem)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                      cartDiscount === rem
                        ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {rem === 0 ? 'Aucune' : `-${rem}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Total à payer Grand Format */}
        <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <span className="font-black text-slate-400 text-[11px] uppercase tracking-wider block">
              Total à payer
            </span>
            {cartDiscount > 0 && (
              <span className="text-[10px] text-emerald-400 font-semibold">
                Remise: -{formatMoney(cartDiscount, settings.currency)}
              </span>
            )}
          </div>
          <span className="font-black text-2xl text-amber-400 font-mono tracking-tight drop-shadow-sm">
            {formatMoney(finalTotal, settings.currency)}
          </span>
        </div>

        {/* Bouton Géant d'Encaissement */}
        <button
          onClick={onOpenPayment}
          disabled={cart.length === 0}
          className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] ${
            cart.length > 0
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-xl shadow-emerald-500/25 ring-1 ring-emerald-400/40 cursor-pointer'
              : 'bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>ENCAISSER DIRECT</span>
          <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
        </button>
      </div>
    </aside>
  );
};
