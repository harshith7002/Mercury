'use client';

import { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { ApprovalRequestRecord } from '@/types';

interface ApprovalGateModalProps {
  request: ApprovalRequestRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onDecided?: () => void;
}

export function ApprovalGateModal({ request, isOpen, onClose, onDecided }: ApprovalGateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    setIsSubmitting(true);
    try {
      await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          decision,
          decidedBy: 'Merchant Admin (Human Approval Gate)',
        }),
      });

      if (onDecided) onDecided();
      onClose();
    } catch (err) {
      console.error('Failed to submit approval decision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-rose-900/60 bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-rose-950/80 border-b border-rose-900 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-900/80 text-rose-300">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Financial Approval Required</h3>
              <p className="text-xs text-rose-300 font-mono">Agent Action Exceeds Merchant Authority</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-rose-900 text-rose-200 border border-rose-700">
            REQUIRES APPROVAL
          </span>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Agent Type</span>
              <span className="font-mono font-semibold text-blue-400">{request.agentType}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Requested Action</span>
              <span className="font-mono font-semibold text-slate-200">{request.actionType}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Requested Amount</span>
              <span className="font-mono font-extrabold text-rose-400 text-base">
                ₹{request.requestedAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-400">Merchant Policy Auto Limit</span>
              <span className="font-mono font-semibold text-amber-400">
                ₹{request.policyLimit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-3.5 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Policy Breach Rationale: </span>
              {request.reason}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleDecision('REJECTED')}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-200 hover:text-rose-300 font-semibold text-xs border border-slate-700 hover:border-rose-800 transition-all disabled:opacity-50"
            >
              <XCircle className="h-4 w-4 text-rose-400" />
              <span>Reject Action</span>
            </button>
            <button
              onClick={() => handleDecision('APPROVED')}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>Approve Action</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
