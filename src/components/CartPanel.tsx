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
    <aside className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-20">
      {/* En-tête Panier */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <h2 className="font-extrabold text-slate-100 text-sm">Commande en cours</h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">
            {totalItemsCount}
          </span>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition"
          >
            <Trash2 className="w-3 h-3" />
            <span>Vider</span>
          </button>
        )}
      </div>

      {/* Identifiant Client ou Table (Optionnel) */}
      <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2">
        <User className="w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerInfo(e.target.value, customerPhone)}
          placeholder="Client / Table / Repère (ex: Table 3, Comptoir...)"
          className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Liste des Articles du Panier */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-3 text-slate-600">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <p className="font-bold text-sm text-slate-400">Panier vide</p>
            <p className="text-xs text-slate-500 mt-1">
              Touchez une boisson ou un snack pour ajouter à la commande.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.productId}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-sm"
            >
              {/* Infos article */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-200 truncate leading-snug">
                  {item.product.name}
                </h4>
                <div className="text-[11px] text-slate-400 font-mono">
                  {formatMoney(item.unitPrice, settings.currency)} × {item.quantity}
                </div>
              </div>

              {/* Contrôles Quantité Tactiles */}
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center active:scale-95 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-xs text-slate-100">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-7 h-7 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Total Ligne & Suppression */}
              <div className="text-right pl-2">
                <div className="font-extrabold text-xs text-amber-400">
                  {formatMoney(item.total, settings.currency)}
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-slate-600 hover:text-rose-400 text-[10px] mt-0.5 inline-block"
                >
                  Retirer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Résumé Financier & Bouton Encaissement */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
        {/* Sous-total & Remise rapide */}
        {cart.length > 0 && (
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-mono text-slate-200">{formatMoney(subtotal, settings.currency)}</span>
            </div>

            {/* Remise */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>Remise</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 500, 1000].map((rem) => (
                  <button
                    key={rem}
                    onClick={() => setCartDiscount(rem)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      cartDiscount === rem
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {rem === 0 ? '0' : `-${rem}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grand Total */}
        <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
          <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Total à payer</span>
          <span className="font-black text-2xl text-amber-400 tracking-tight">
            {formatMoney(finalTotal, settings.currency)}
          </span>
        </div>

        {/* Bouton Géant d'Encaissement */}
        <button
          onClick={onOpenPayment}
          disabled={cart.length === 0}
          className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg ${
            cart.length > 0
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          <span>ENCAISSER DIRECT</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
};
