import React, { useMemo } from 'react';
import { Search, Plus, Wine, Beer, GlassWater, Coffee, Pizza, Sparkles, X } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { formatMoney } from '../utils/security';
import type { ProductCategory } from '../types';

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

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'bieres':
        return <Beer className="w-4 h-4 text-amber-400" />;
      case 'vins':
        return <Wine className="w-4 h-4 text-rose-400" />;
      case 'spiritueux':
        return <GlassWater className="w-4 h-4 text-purple-400" />;
      case 'cocktails':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'softs':
        return <Coffee className="w-4 h-4 text-emerald-400" />;
      case 'snacks':
        return <Pizza className="w-4 h-4 text-orange-400" />;
      default:
        return <Wine className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryGlow = (category: ProductCategory) => {
    switch (category) {
      case 'bieres':
        return 'group-hover:border-amber-500/40 group-hover:shadow-amber-500/10';
      case 'vins':
        return 'group-hover:border-rose-500/40 group-hover:shadow-rose-500/10';
      case 'spiritueux':
        return 'group-hover:border-purple-500/40 group-hover:shadow-purple-500/10';
      case 'cocktails':
        return 'group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10';
      case 'softs':
        return 'group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/10';
      case 'snacks':
        return 'group-hover:border-orange-500/40 group-hover:shadow-orange-500/10';
      default:
        return 'group-hover:border-amber-500/40';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Barre de Recherche Moderne */}
      <div className="relative mb-3">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une boisson, un verre, un cocktail, un snack..."
          className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-10 pr-20 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 backdrop-blur-md transition shadow-inner"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Effacer</span>
          </button>
        ) : (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-500">
            {filteredProducts.length} articles
          </span>
        )}
      </div>

      {/* Grille de Produits Tactile & Visuelle */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center glass-panel rounded-3xl p-8 border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-3 text-slate-600">
              <Wine className="w-8 h-8 stroke-[1.5]" />
            </div>
            <p className="text-base font-bold text-slate-300">Aucun article trouvé</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Essayez un autre mot-clé ou sélectionnez une autre catégorie ci-dessus.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;
              const glowClass = getCategoryGlow(product.category);

              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product, 1)}
                  disabled={isOutOfStock}
                  className={`group relative flex flex-col justify-between p-3.5 rounded-2xl text-left select-none transition-all duration-200 active:scale-[0.97] border ${
                    isOutOfStock
                      ? 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                      : `bg-slate-900/80 hover:bg-slate-850 border-white/10 hover:shadow-xl ${glowClass} backdrop-blur-md`
                  }`}
                >
                  {/* Badge Volume & Badge Populaire */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-950/60 border border-white/5 flex items-center justify-center shadow-inner">
                        {getCategoryIcon(product.category)}
                      </div>
                      {product.volume && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/60 border border-white/5 text-slate-400 font-mono">
                          {product.volume}
                        </span>
                      )}
                    </div>

                    {product.isPopular && (
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Top
                      </span>
                    )}
                  </div>

                  {/* Nom du Produit */}
                  <div className="my-1.5 min-h-[38px] flex items-center">
                    <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  {/* Bas de Carte : Prix & Statut Stock */}
                  <div className="pt-2.5 mt-1 border-t border-white/5 flex items-end justify-between w-full">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block leading-none mb-0.5">
                        Prix
                      </span>
                      <span className="text-base font-black text-amber-400 font-mono tracking-tight group-hover:text-amber-300 drop-shadow-sm">
                        {formatMoney(product.price, settings.currency)}
                      </span>
                    </div>

                    {/* Stock status */}
                    <div className="text-right">
                      {isOutOfStock ? (
                        <span className="text-[10px] font-black text-rose-400 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                          Épuisé
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg font-mono ${
                            isLowStock
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                              : 'bg-slate-950/70 border border-white/5 text-slate-400'
                          }`}
                        >
                          {product.stock} dispo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bouton Tactile d'Ajout Flottant sur Hover */}
                  <div className="absolute right-2.5 top-2.5 w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg shadow-amber-500/30 scale-90 group-hover:scale-100">
                    <Plus className="w-4 h-4 stroke-[3]" />
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
