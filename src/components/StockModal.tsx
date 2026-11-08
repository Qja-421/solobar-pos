import React, { useState } from 'react';
import { X, Package, Plus, AlertTriangle, Search, Trash2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Inventaire & Gestion des Stocks</h3>
              <p className="text-[11px] text-slate-400">Réapprovisionnement rapide des casiers et bouteilles</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{showAddForm ? 'Fermer formulaire' : 'Nouvel Article'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout rapide (repliable) */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Nom de l'article :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Skol 65cl, Vin Rouge, Whisky..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Catégorie :</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Stock initial :</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Volume / Format :</label>
                <input
                  type="text"
                  placeholder="33cl, 65cl, Dose..."
                  value={newVolume}
                  onChange={(e) => setNewVolume(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition"
                >
                  ENREGISTRER L'ARTICLE
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Barre de Filtre & Recherche */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/60">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filtrer un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              onlyLowStock
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Stock Faible</span>
          </button>
        </div>

        {/* Tableau des Stocks */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">Aucun produit ne correspond.</div>
          ) : (
            filtered.map((product) => {
              const isLow = product.stock <= product.minStockAlert;
              return (
                <div
                  key={product.id}
                  className="p-3 hover:bg-slate-850 flex items-center justify-between gap-3 transition"
                >
                  {/* Nom & Catégorie */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-200 truncate">{product.name}</h4>
                      {product.volume && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {product.volume}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Prix : <span className="text-amber-400 font-bold">{formatMoney(product.price, settings.currency)}</span>
                    </div>
                  </div>

                  {/* État du stock */}
                  <div className="text-center px-2">
                    <span
                      className={`text-sm font-black font-mono block ${
                        isLow ? 'text-rose-400' : 'text-slate-200'
                      }`}
                    >
                      {product.stock}
                    </span>
                    <span className="text-[9px] text-slate-500 block uppercase">unités</span>
                  </div>

                  {/* Boutons Restock Rapide (+12, +24 pour les casiers!) */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => adjustStock(product.id, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold"
                      title="-1 unité"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold"
                      title="+1 unité"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, 12)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold transition"
                      title="+12 (Demi-casier)"
                    >
                      +12
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, 24)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold transition"
                      title="+24 (Casier plein)"
                    >
                      +24
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition ml-2"
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
