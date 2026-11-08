import React, { useState } from 'react';
import { X, Package, Plus, AlertTriangle, Search, Trash2, Sparkles } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import { formatMoney } from '../utils/security';
import type { ProductCategory } from '../types';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StockModal: React.FC<StockModalProps> = ({ isOpen, onClose }) => {
  const { products, addProduct, deleteProduct, adjustStock, settings } = useSoloBarStore();

  const [search, setSearch] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Formulaire d'ajout
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('bieres');
  const [newPrice, setNewPrice] = useState<number>(1000);
  const [newStock, setNewStock] = useState<number>(24);
  const [newVolume, setNewVolume] = useState('65cl');

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchLow = onlyLowStock ? p.stock <= p.minStockAlert : true;
    return matchSearch && matchLow;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addProduct({
      name: newName.trim(),
      category: newCategory,
      price: Math.max(0, newPrice),
      stock: Math.max(0, newStock),
      minStockAlert: 10,
      volume: newVolume.trim() || undefined,
      isPopular: false
    });

    setNewName('');
    setNewPrice(1000);
    setNewStock(24);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/10 rounded-3xl max-w-3xl w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
        {/* En-tête */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">Inventaire & Stocks</h3>
              <p className="text-[11px] text-slate-400">Réapprovisionnement rapide des casiers et bouteilles</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{showAddForm ? 'Fermer' : 'Nouvel Article'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-white/5 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout rapide (repliable) */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="p-4 bg-slate-950/90 border-b border-white/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Nom de l'article :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Skol 65cl, Vin Rouge, Whisky..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Catégorie :</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="bieres">Bières</option>
                  <option value="vins">Vins</option>
                  <option value="spiritueux">Spiritueux</option>
                  <option value="cocktails">Cocktails</option>
                  <option value="softs">Softs / Eau</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Prix de vente :</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Stock initial :</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Volume / Format :</label>
                <input
                  type="text"
                  placeholder="33cl, 65cl, Dose..."
                  value={newVolume}
                  onChange={(e) => setNewVolume(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition active:scale-95 shadow-md shadow-emerald-500/20"
                >
                  ENREGISTRER L'ARTICLE
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Barre de Filtre & Recherche */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between gap-3 bg-slate-900/60">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filtrer un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              onlyLowStock
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Stock Faible</span>
          </button>
        </div>

        {/* Tableau des Stocks */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">Aucun produit ne correspond.</div>
          ) : (
            filtered.map((product) => {
              const isLow = product.stock <= product.minStockAlert;
              return (
                <div
                  key={product.id}
                  className="p-3 hover:bg-slate-800/50 flex items-center justify-between gap-3 transition"
                >
                  {/* Nom & Catégorie */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs text-slate-200 truncate">{product.name}</h4>
                      {product.volume && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 border border-white/5 text-slate-400 font-mono">
                          {product.volume}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Prix : <span className="text-amber-400 font-black">{formatMoney(product.price, settings.currency)}</span>
                    </div>
                  </div>

                  {/* État du stock */}
                  <div className="text-center px-2">
                    <span
                      className={`text-sm font-black font-mono block ${
                        isLow ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                      }`}
                    >
                      {product.stock}
                    </span>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">unités</span>
                  </div>

                  {/* Boutons Restock Rapide (+12, +24 pour les casiers!) */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => adjustStock(product.id, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold border border-white/5 active:scale-95"
                      title="-1 unité"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold border border-white/5 active:scale-95"
                      title="+1 unité"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, 12)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-black transition border border-white/5 active:scale-95"
                      title="+12 (Demi-casier)"
                    >
                      +12
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, 24)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-black transition border border-amber-500/20 active:scale-95"
                      title="+24 (Casier plein)"
                    >
                      +24
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1"
                      title="Supprimer l'article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
