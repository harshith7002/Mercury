'use client';

import { X, Check, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { ProductItem } from '@/types';
import { Mercury3DCanvas } from '@/components/3d/Mercury3DCanvas';

interface Product3DModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
}

export function Product3DModal({ product, isOpen, onClose, onAddToCart }: Product3DModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-blue-900/60 bg-slate-900 shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: 3D Stage & Photo */}
          <div className="relative bg-slate-950 p-6 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-slate-800">
            <div className="absolute top-3 left-3 z-10">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                3D WebGL Stage
              </span>
            </div>

            <div className="w-full h-56 relative my-auto">
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'}
                alt={product.name}
                className="h-full w-full object-cover rounded-xl border border-slate-800 shadow-xl"
              />
            </div>
          </div>

          {/* Right Column: Specs & Checkout Trigger */}
          <div className="p-6 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{product.category}</span>
              <h3 className="text-lg font-bold text-white mt-1">{product.name}</h3>
              
              <div className="text-2xl font-extrabold text-blue-400 font-mono mt-2">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              <p className="text-xs text-slate-300 font-sans mt-3 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-4 space-y-1.5 border-t border-slate-800 pt-3">
                <span className="text-[10px] font-mono uppercase text-slate-400">Technical Features:</span>
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xl shadow-blue-600/30 transition-all mt-4"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Cart & Order</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
