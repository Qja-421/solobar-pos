import React from 'react';
import { Wine, Beer, GlassWater, Coffee, Pizza, Sparkles, Layers } from 'lucide-react';
import { useSoloBarStore } from '../store/posStore';
import type { ProductCategory } from '../types';

interface CategoryBarProps {
  onSelectCategory: (category: ProductCategory | 'tous') => void;
  selectedCategory: ProductCategory | 'tous';
}

const CATEGORIES: { id: ProductCategory | 'tous'; label: string; icon: React.ReactNode }[] = [
  { id: 'tous', label: 'Tous', icon: <Layers className="w-4 h-4" /> },
  { id: 'bieres', label: 'Bières', icon: <Beer className="w-4 h-4" /> },
  { id: 'vins', label: 'Vins', icon: <Wine className="w-4 h-4" /> },
  { id: 'spiritueux', label: 'Spiritueux', icon: <GlassWater className="w-4 h-4" /> },
  { id: 'cocktails', label: 'Cocktails', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'softs', label: 'Softs & Eau', icon: <Coffee className="w-4 h-4" /> },
  { id: 'snacks', label: 'Snacks / Brochettes', icon: <Pizza className="w-4 h-4" /> }
];

export const CategoryBar: React.FC<CategoryBarProps> = ({ onSelectCategory, selectedCategory }) => {
  const { products } = useSoloBarStore();

  const getCount = (catId: ProductCategory | 'tous') => {
    if (catId === 'tous') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = getCount(cat.id);

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
              isSelected
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
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
