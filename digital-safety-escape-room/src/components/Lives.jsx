import React from 'react';
import { Heart } from 'lucide-react';

export default function Lives({ count = 3, max = 3 }) {
  return (
    <div className="flex items-center gap-2 bg-rose-50/80 border border-rose-200 px-3.5 py-1.5 rounded-xl">
      <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">
        Lives:
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, index) => {
          const isAlive = index < count;
          return (
            <div
              key={index}
              className={`transition-all duration-300 ${
                isAlive ? 'scale-100 text-rose-500' : 'scale-90 opacity-30 text-slate-400'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isAlive ? 'fill-rose-500 stroke-rose-500 drop-shadow-sm' : 'fill-none stroke-current'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
