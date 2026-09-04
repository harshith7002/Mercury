'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, AlertTriangle, Loader2, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  razorpayOrderId: string;
  totalAmount: number;
  isMock: boolean;
  onSuccess: (paymentDetails: { razorpayPaymentId: string; razorpaySignature: string }) => void;
}

export function RazorpayModal({
  isOpen,
  onClose,
  orderId,
  razorpayOrderId,
  totalAmount,
  isMock,
  onSuccess,
}: RazorpayModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('VERIFYING');
    setErrorMessage(null);

    try {
      // Simulate Razorpay Gateway response
      const razorpayPaymentId = `pay_rzp_test_${Math.random().toString(36).substring(2, 10)}`;
      const razorpaySignature = `sig_test_${Math.random().toString(36).substring(2, 16)}`;

      // Server-Side Signature Verification API Call
      const res = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          dbOrderId: orderId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPaymentStatus('SUCCESS');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // confetti fallback
        }
        setTimeout(() => {
          onSuccess({ razorpayPaymentId, razorpaySignature });
        }, 1500);
      } else {
        setPaymentStatus('FAILED');
        setErrorMessage(data.error || 'Server-side payment signature verification failed.');
      }
    } catch (err: any) {
      setPaymentStatus('FAILED');
      setErrorMessage(err.message || 'Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* Test Mode Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 flex items-center justify-between text-white font-mono text-xs">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <ShieldCheck className="h-4 w-4" />
            <span>RAZORPAY TEST MODE {isMock ? '(MOCK ADAPTER)' : ''}</span>
          </div>
          <button onClick={onClose} className="text-emerald-100 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Header Details */}
        <div className="p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-mono">Order ID: {razorpayOrderId}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              TEST GATEWAY
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-sm font-medium text-slate-300">Total Payable</span>
            <span className="text-2xl font-extrabold text-white font-mono">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="p-5 space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Test Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'UPI', label: 'UPI / QR', icon: Sparkles },
              { id: 'CARD', label: 'Test Card', icon: CreditCard },
              { id: 'NETBANKING', label: 'NetBanking', icon: Lock },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                    paymentMethod === m.id
                      ? 'border-blue-500 bg-blue-950/60 text-white shadow-md shadow-blue-500/20'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mb-1.5 text-blue-400" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Payment Status Message */}
          {paymentStatus === 'SUCCESS' && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center gap-2 text-xs font-mono">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Signature Verified! Order marked CAPTURED on server.</span>
            </div>
          )}

          {paymentStatus === 'FAILED' && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage || 'Payment signature verification failed.'}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing || paymentStatus === 'SUCCESS'}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Verifying HMAC-SHA256 Signature...</span>
              </>
            ) : paymentStatus === 'SUCCESS' ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Payment Confirmed!</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Complete Test Payment (₹{totalAmount.toLocaleString('en-IN')})</span>
              </>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span>Server Verification Active</span>
          <span>No real money is charged</span>
        </div>

      </div>
    </div>
  );
}
