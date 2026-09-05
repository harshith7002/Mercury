'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, ShoppingBag, LayoutDashboard, Lock, Play, TrendingUp, CheckCircle, Cpu, Zap, Eye } from 'lucide-react';
import { Mercury3DCanvas } from '@/components/3d/Mercury3DCanvas';
import { TiltCard } from '@/components/3d/TiltCard';
import { Workflow3DGraph } from '@/components/3d/Workflow3DGraph';

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      
      {/* Ambient Lighting Layers */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[250px] bg-emerald-600/15 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[200px] bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-16 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/90 border border-blue-700/80 text-blue-300 text-xs font-mono mb-8 shadow-xl backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
          <span>Razorpay Buildathon 2026 — Track 01: AI Growth & Agentic Commerce</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Left Column: Hero Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              From AI intent to <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                trusted 3D financial transaction.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans">
              Mercury connects AI buyers with merchants while empowering a Merchant Growth Agent to optimize every transaction — under strict, merchant-configured financial policies and complete auditability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
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
          </div>

          {/* Right Column: Interactive 3D Canvas Scene */}
          <div className="lg:col-span-5 relative">
            <TiltCard className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2 px-2">
                <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <Zap className="h-3.5 w-3.5" />
                  MERCURY 3D WEBGL CORE
                </span>
                <span>Drag to Rotate 3D Core</span>
              </div>
              <Mercury3DCanvas />
            </TiltCard>
          </div>

        </div>

        {/* 3D Architectural Principles Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <TiltCard className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800 mb-4 shadow-lg">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Policy-Engine Governed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The LLM never directly executes financial actions. Every discount and high-value checkout passes through strict merchant boundaries.
            </p>
          </TiltCard>

          <TiltCard className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 mb-4 shadow-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Merchant Growth Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes product affinity & purchase patterns to deliver targeted upsell opportunities, raising AOV by over +15.8%.
            </p>
          </TiltCard>

          <TiltCard className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 mb-4 shadow-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Server Verified Razorpay</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              End-to-end Razorpay Test Mode checkout with server-side HMAC-SHA256 signature verification and complete audit logging.
            </p>
          </TiltCard>
        </div>

        {/* Interactive 3D Workflow Graph */}
        <div className="mt-20 text-left border-t border-slate-800/80 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Truthful Agent Execution Trace
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Click any node to inspect server telemetry</span>
          </div>

          <Workflow3DGraph />
        </div>

      </div>

    </div>
  );
}
