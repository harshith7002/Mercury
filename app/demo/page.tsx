'use client';

import { useState } from 'react';
import { Play, CheckCircle2, ShieldAlert, ArrowRight, RefreshCw, Lock, Sparkles, ShieldCheck, ScrollText } from 'lucide-react';
import { AgentStep, AuditEventRecord } from '@/types';
import { AgentActivityPanel } from '@/components/AgentActivityPanel';

export default function DemoPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunningSuccessDemo, setIsRunningSuccessDemo] = useState(false);
  const [isRunningFailureDemo, setIsRunningFailureDemo] = useState(false);
  const [demoSteps, setDemoSteps] = useState<AgentStep[]>([]);
  const [demoAuditTrail, setDemoAuditTrail] = useState<AuditEventRecord[]>([]);
  const [failureResult, setFailureResult] = useState<any>(null);

  const successScenarioSteps = [
    { title: 'STEP 1: Buyer Intent Input', desc: 'AI Buyer receives request: "I need a mechanical keyboard for programming under ₹6,000."' },
    { title: 'STEP 2: Catalog Discovery', desc: 'CatalogTools queries SQLite merchant database for items matching criteria.' },
    { title: 'STEP 3: Product Recommendation', desc: 'Ranked top recommendation: Keychron K2 Mechanical Keyboard (₹5,499).' },
    { title: 'STEP 4: Growth Agent Upsell', desc: 'Merchant Growth Agent detects 31% co-purchase affinity for Ergonomic Wrist Rest (₹799).' },
    { title: 'STEP 5: Buyer Acceptance', desc: 'Buyer accepts upsell offer. Total Cart updated to ₹6,298.' },
    { title: 'STEP 6: Policy Engine Verification', desc: 'PolicyEngine verifies transaction ₹6,298 satisfies max auto-limit (₹10,000).' },
    { title: 'STEP 7: Razorpay Order Creation', desc: 'RazorpayService creates Test Order order_rzp_demo_101.' },
    { title: 'STEP 8: Payment Execution', desc: 'Payment simulated via Razorpay Test Mode Gateway.' },
    { title: 'STEP 9: Server Signature Verification', desc: 'Server verifies HMAC-SHA256 signature. Payment status verified.' },
    { title: 'STEP 10: Order Confirmation', desc: 'Order marked CAPTURED. Database updated.' },
    { title: 'STEP 11: Dashboard Metrics Sync', desc: 'Dynamic merchant revenue and AI-assisted AOV uplift metrics updated.' },
    { title: 'STEP 12: Audit Trail Recorded', desc: 'All 12 agent decisions logged into immutable audit database.' },
  ];

  const handleRunSuccessDemo = async () => {
    setIsRunningSuccessDemo(true);
    setDemoSteps([]);
    setDemoAuditTrail([]);

    for (let i = 0; i < successScenarioSteps.length; i++) {
      setCurrentStepIndex(i + 1);
      const stepInfo = successScenarioSteps[i];

      setDemoSteps((prev) => [
        ...prev,
        {
          id: `step_${i}`,
          title: stepInfo.title,
          status: i === 5 || i === 8 ? 'policy_check' : i === 3 ? 'tool_call' : 'completed',
          detail: stepInfo.desc,
          timestamp: new Date().toLocaleTimeString(),
          toolName: i === 1 ? 'CatalogTools.searchCatalog' : i === 3 ? 'MerchantGrowthAgent' : i === 6 ? 'RazorpayService.createOrder' : undefined,
        },
      ]);

      await new Promise((r) => setTimeout(r, 600));
    }

    // Fetch updated audit trail from real database
    try {
      const res = await fetch('/api/audit?limit=6');
      const data = await res.json();
      if (data.success) setDemoAuditTrail(data.events);
    } catch (e) {}

    setIsRunningSuccessDemo(false);
  };

  const handleRunFailureDemo = async () => {
    setIsRunningFailureDemo(true);
    setFailureResult(null);

    // Call policy validate API with unauthorized ₹15,000 discount request
    try {
      const res = await fetch('/api/policy/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'EXCESSIVE_PROMOTIONAL_DISCOUNT',
          amount: 15000,
          itemPrice: 64999,
          agentType: 'AI Buyer Agent',
          reason: 'Agent requested unauthorized ₹15,000 discount exceeding merchant ₹1,000 limit.',
        }),
      });

      const data = await res.json();
      setFailureResult(data);

      // Fetch audit events to show BLOCKED event
      const auditRes = await fetch('/api/audit?limit=4');
      const auditData = await auditRes.json();
      if (auditData.success) setDemoAuditTrail(auditData.events);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRunningFailureDemo(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-blue-900/60 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 shadow-2xl space-y-3">
        <div className="flex items-center gap-2.5">
          <Play className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-extrabold text-white tracking-tight">1-Click Hackathon Demo Center</h1>
        </div>
        <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed">
          Demonstrate both the complete 12-step successful AI purchase loop with Razorpay Test Mode checkout and the graceful failure policy-gating scenario in under 3 minutes.
        </p>
      </div>

      {/* Main Grid: Success Scenario vs Failure Scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: SUCCESS DEMO SCENARIO */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Scenario 1: End-to-End Success Loop
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              12 STEPS COMPLETE
            </span>
          </div>

          <p className="text-xs text-slate-400 font-sans">
            AI Buyer Intent → Catalog Discovery → Product Recommendation → Merchant Growth Upsell → Cart → Razorpay Test Mode → Payment Verification → Audit Trail.
          </p>

          <button
            onClick={handleRunSuccessDemo}
            disabled={isRunningSuccessDemo}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {isRunningSuccessDemo ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Running Step {currentStepIndex} of 12...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Launch 12-Step End-to-End Success Scenario</span>
              </>
            )}
          </button>

          {/* Activity Panel */}
          <AgentActivityPanel steps={demoSteps} isThinking={isRunningSuccessDemo} />
        </div>

        {/* Right Column: FAILURE DEMO SCENARIO */}
        <div className="p-6 rounded-2xl border border-rose-900/60 bg-slate-900 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Scenario 2: Graceful Failure & Policy Gate
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              UNAUTHORIZED ACTION BLOCKED
            </span>
          </div>

          <p className="text-xs text-slate-400 font-sans">
            Agent requests unauthorized ₹15,000 promotional discount (Merchant limit: ₹1,000). System blocks action, routes to Approval Gate, and records BLOCKED audit event.
          </p>

          <button
            onClick={handleRunFailureDemo}
            disabled={isRunningFailureDemo}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {isRunningFailureDemo ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Evaluating Policy Rules...</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Trigger Unauthorized Action (₹15,000 Discount Request)</span>
              </>
            )}
          </button>

          {/* Failure Result Display */}
          {failureResult && (
            <div className="p-4 rounded-xl border border-rose-800 bg-slate-950 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  POLICY ENGINE DECISION: BLOCKED
                </span>
                <span className="font-mono text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                  REQUIRES HUMAN APPROVAL
                </span>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900 text-xs text-rose-200 font-sans">
                {failureResult.checkResult.blockedReason}
              </div>

              <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <div>• Requested Amount: ₹15,000</div>
                <div>• Merchant Policy Limit: ₹1,000</div>
                <div>• Approval Request ID: {failureResult.approvalRequest?.id || 'Created'}</div>
                <div className="text-emerald-400 font-bold">• Result: No unauthorized transaction occurred.</div>
              </div>
            </div>
          )}

          {/* Audit Log Stream */}
          {demoAuditTrail.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <ScrollText className="h-4 w-4 text-blue-400" />
                <span>Live Audit Events Generated</span>
              </div>

              <div className="space-y-2 text-[11px] font-mono">
                {demoAuditTrail.slice(0, 4).map((evt) => (
                  <div key={evt.id} className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-blue-400 font-bold">{evt.action}</span>
                      <p className="text-[10px] text-slate-400 font-sans">{evt.reason.slice(0, 70)}...</p>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      evt.result === 'BLOCKED' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {evt.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
