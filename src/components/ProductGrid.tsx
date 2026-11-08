import React, { useMemo } from 'react';
import { Search, Plus, AlertTriangle, Wine, Sparkles } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { formatMoney } from '../utils/security';
import type { Product } from '../types';

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, searchQuery, setSearchQuery, addToCart, settings } = useSoloBarStore();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'tous' || p.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.volume && p.volume.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Barre de Recherche Rapide */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une boisson, un verre, un cocktail, un snack..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Grille de Produits Tactile */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center">
            <Wine className="w-10 h-10 mb-2 stroke-[1.5] text-slate-600" />
            <p className="text-sm font-semibold">Aucun article trouvé</p>
            <p className="text-xs text-slate-600 mt-1">Essayez un autre mot-clé ou changez de catégorie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;

              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product, 1)}
                  disabled={isOutOfStock}
                  className={`group relative flex flex-col justify-between p-3 rounded-2xl text-left transition-all select-none active:scale-[0.97] border ${
                    isOutOfStock
                      ? 'bg-slate-900/40 border-slate-800/50 opacity-60 cursor-not-allowed'
                      : 'bg-slate-900/90 hover:bg-slate-850 hover:border-amber-500/50 border-slate-800 shadow-md hover:shadow-amber-500/5'
                  }`}
                >
                  {/* Badge Volume ou Populaire */}
                  <div className="flex items-center justify-between w-full mb-1">
                    {product.volume ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {product.volume}
                      </span>
                    ) : (
                      <span />
                    )}

                    {product.isPopular && (
                      <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Sparkles className="w-2.5 h-2.5" /> Top
                      </span>
                    )}
                  </div>

                  {/* Nom du Produit */}
                  <div className="my-2">
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  {/* Bas de carte : Prix & Badge Stock */}
                  <div className="pt-2 border-t border-slate-800/70 flex items-end justify-between w-full">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block leading-none">Prix</span>
                      <span className="text-base font-black text-amber-400 tracking-tight">
                        {formatMoney(product.price, settings.currency)}
                      </span>
                    </div>

                    {/* Stock status */}
                    <div className="text-right">
                      {isOutOfStock ? (
                        <span className="text-[10px] font-bold text-rose-500 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                          Épuisé
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isLowStock
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {product.stock} dispo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bouton d'ajout rapide tactile */}
                  <div className="absolute right-2 top-2 w-7 h-7 rounded-xl bg-amber-500/0 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
