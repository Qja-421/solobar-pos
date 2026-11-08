import React from 'react';
import { Wine, Beer, GlassWater, Coffee, Pizza, Sparkles, Layers } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import type { ProductCategory } from '../types';

interface CategoryBarProps {
  onSelectCategory: (category: ProductCategory | 'tous') => void;
  selectedCategory: ProductCategory | 'tous';
}

const CATEGORIES: { id: ProductCategory | 'tous'; label: string; icon: React.ReactNode; glowColor: string }[] = [
  { id: 'tous', label: 'Tous', icon: <Layers className="w-4 h-4" />, glowColor: 'from-amber-500 to-orange-500' },
  { id: 'bieres', label: 'Bières', icon: <Beer className="w-4 h-4" />, glowColor: 'from-amber-400 to-yellow-600' },
  { id: 'vins', label: 'Vins', icon: <Wine className="w-4 h-4" />, glowColor: 'from-rose-500 to-red-700' },
  { id: 'spiritueux', label: 'Spiritueux', icon: <GlassWater className="w-4 h-4" />, glowColor: 'from-purple-500 to-indigo-600' },
  { id: 'cocktails', label: 'Cocktails', icon: <Sparkles className="w-4 h-4" />, glowColor: 'from-cyan-400 to-teal-500' },
  { id: 'softs', label: 'Softs & Eau', icon: <Coffee className="w-4 h-4" />, glowColor: 'from-emerald-400 to-teal-600' },
  { id: 'snacks', label: 'Snacks / Grillades', icon: <Pizza className="w-4 h-4" />, glowColor: 'from-orange-400 to-amber-600' }
];

export const CategoryBar: React.FC<CategoryBarProps> = ({ onSelectCategory, selectedCategory }) => {
  const { products } = useSoloBarStore();

  const getCount = (catId: ProductCategory | 'tous') => {
    if (catId === 'tous') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = getCount(cat.id);

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 select-none active:scale-95 ${
              isSelected
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/40'
                : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border border-white/5 hover:border-white/15 hover:text-white backdrop-blur-md shadow-sm'
            }`}
          >
            <span className={`transition-transform duration-200 ${isSelected ? 'scale-110' : 'group-hover:scale-110 text-slate-400 group-hover:text-amber-400'}`}>
              {cat.icon}
            </span>
            <span>{cat.label}</span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors ${
                isSelected
                  ? 'bg-slate-950/25 text-slate-950 font-mono'
                  : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 font-mono'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
