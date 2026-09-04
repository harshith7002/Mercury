'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, ShoppingBag, LayoutDashboard, Lock, Play, TrendingUp, CheckCircle, Cpu, Zap } from 'lucide-react';

export default function LandingPage() {
  const stepsFlow = [
    { title: 'Intent Parsing', desc: 'AI extracts budget, constraints & product parameters.', icon: Cpu },
    { title: 'Catalog Discovery', desc: 'Agent retrieves real-time merchant catalog options.', icon: ShoppingBag },
    { title: 'AI Recommendation', desc: 'Ranks products with technical justification.', icon: Sparkles },
    { title: 'Growth Agent Upsell', desc: 'Computes high-affinity co-purchase offers (AOV uplift).', icon: TrendingUp },
    { title: 'Policy Engine Check', desc: 'Verifies financial boundaries & discount limits.', icon: Lock },
    { title: 'Razorpay Test Mode', desc: 'Generates order & verifies HMAC-SHA256 signature.', icon: ShieldCheck },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[200px] bg-emerald-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-400 text-xs font-mono mb-8 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>Razorpay Buildathon 2026 — Track 01: AI Growth & Agentic Commerce</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          From AI intent to <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            trusted financial transaction.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
          Mercury connects AI buyers with merchants while empowering a Merchant Growth Agent to optimize every transaction — under strict, merchant-configured financial policies and complete auditability.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/buyer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all border border-blue-400/30"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Try AI Buyer Hub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/merchant"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
          >
            <LayoutDashboard className="h-4 w-4 text-blue-400" />
            <span>Open Merchant Console</span>
          </Link>

          <Link
            href="/demo"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 transition-all border border-emerald-400/30"
          >
            <Play className="h-4 w-4" />
            <span>1-Click Hackathon Demo</span>
          </Link>
        </div>

        {/* Key Architectural Principles */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800 mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Policy-Engine Governed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The LLM never directly executes financial actions. Every discount and high-value checkout passes through strict merchant boundaries.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Merchant Growth Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes product affinity & purchase patterns to deliver targeted upsell opportunities, raising AOV by over 16.6%.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Server Verified Razorpay</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              End-to-end Razorpay Test Mode checkout with server-side HMAC-SHA256 signature verification and complete audit logging.
            </p>
          </div>
        </div>

        {/* End-to-End Visual Workflow */}
        <div className="mt-16 text-left max-w-5xl mx-auto border-t border-slate-800/80 pt-12">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-4 w-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              End-to-End Agentic Commerce Loop
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stepsFlow.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-blue-400 border border-slate-700 font-mono text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                      <Icon className="h-3.5 w-3.5 text-blue-400" />
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
