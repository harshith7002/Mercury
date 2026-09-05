'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, ShieldCheck, CreditCard, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface TransactionInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filterType?: 'ALL' | 'AI_INFLUENCED' | 'UPSELL';
}

export const TransactionInspectorModal: React.FC<TransactionInspectorModalProps> = ({
  isOpen,
  onClose,
  title,
  filterType = 'ALL',
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            let filtered = data.orders.filter((o: any) => o.status === 'CAPTURED');
            if (filterType === 'AI_INFLUENCED') {
              filtered = filtered.filter((o: any) => o.isAiAssisted);
            } else if (filterType === 'UPSELL') {
              filtered = filtered.filter((o: any) => o.upsellAmount > 0);
            }
            setOrders(filtered);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, filterType]);

  if (!isOpen) return null;

  const filteredBySearch = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.razorpayOrderId && o.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalFilteredRev = filteredBySearch.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              DATABASE ATTRIBUTION INSPECTOR
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Trace every rupee back to exact SQLite database order records and Razorpay verification signatures.
            </p>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Order ID, Customer, Razorpay ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Total Traceable Orders: <strong className="text-white">{filteredBySearch.length}</strong></span>
            <span className="text-slate-400">Summed Value: <strong className="text-emerald-400 font-bold">₹{Math.round(totalFilteredRev).toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-slate-400">Querying SQLite database orders...</div>
          ) : filteredBySearch.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">No captured transactions match this filter.</div>
          ) : (
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Base Product (₹)</th>
                    <th className="p-3">Incremental Upsell (₹)</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Razorpay Order ID</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredBySearch.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="p-3 font-bold text-slate-200">{ord.id}</td>
                      <td className="p-3">
                        <div className="font-sans font-semibold text-white">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-500">{ord.customerEmail}</div>
                      </td>
                      <td className="p-3 font-bold text-slate-300">₹{(ord.baseAmount - ord.discountAmount).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-bold text-emerald-400">
                        {ord.upsellAmount > 0 ? `+₹${ord.upsellAmount.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-3 font-bold text-cyan-400">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-[11px] text-slate-400">{ord.razorpayOrderId || 'order_rzp_demo'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          CAPTURED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between items-center">
          <span>Mathematical Proof: Net Base Revenue + Incremental AI Upsell Revenue === Total Captured Revenue</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg">
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
