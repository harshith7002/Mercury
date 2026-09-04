'use client';

import { X, ShoppingBag, ArrowRight, Trash2, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { CartItem, CartState, UpsellRecommendation } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
  onRemoveItem: (productId: string) => void;
  onAddUpsell: (upsell: UpsellRecommendation) => void;
  upsellOffer: UpsellRecommendation | null;
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onAddUpsell,
  upsellOffer,
  onCheckout,
  isCheckingOut,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const isUpsellInCart = upsellOffer && cart.items.some((i) => i.product.id === upsellOffer.product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Shopping Cart</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {cart.items.length} items
              </span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Your cart is empty. Search for products in the AI Buyer Hub to begin.
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/80"
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-semibold text-slate-200">{item.product.name}</span>
                        {item.isUpsell && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                            GROWTH UPSELL
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Merchant Growth Agent Banner in Cart */}
            {upsellOffer && !isUpsellInCart && (
              <div className="rounded-xl border border-indigo-900/80 bg-gradient-to-br from-indigo-950/80 to-slate-950 p-4 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Merchant Growth Agent Recommendation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{upsellOffer.reason}</p>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-indigo-800">
                  <div>
                    <div className="text-xs font-semibold text-white">{upsellOffer.product.name}</div>
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      ₹{upsellOffer.discountedPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    onClick={() => onAddUpsell(upsellOffer)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Razorpay Checkout */}
          <div className="p-6 border-t border-slate-800 bg-slate-950 space-y-4">
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {cart.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Policy Discount</span>
                  <span>-₹{cart.discountTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span>₹{cart.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              disabled={cart.items.length === 0 || isCheckingOut}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Proceed to Razorpay Test Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
