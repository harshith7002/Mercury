'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, LayoutDashboard, Lock, Play, TrendingUp, Zap, Bot, Code, CheckCircle2 } from 'lucide-react';
import { Mercury3DCanvas } from '@/components/3d/Mercury3DCanvas';
import { TiltCard } from '@/components/3d/TiltCard';
import { Workflow3DGraph } from '@/components/3d/Workflow3DGraph';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060b14]">
      {/* ── Fullscreen Cinematic Video Background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 mix-blend-screen"
        style={{ zIndex: 0 }}
        src={VIDEO_URL}
      />

      {/* ── Deep Atmospheric Ambient Gradients ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060b14]/80 via-[#060b14]/90 to-[#060b14] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[160px] pointer-events-none rounded-full z-0" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[300px] bg-emerald-600/10 blur-[150px] pointer-events-none rounded-full z-0" />

      {/* ── Hero Content Layer ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-24 text-center">
        
        {/* Track 01 Badge */}
        <div className="animate-fade-rise inline-flex items-center gap-2.5 px-5 py-2 rounded-full liquid-glass text-blue-300 text-xs font-mono mb-10 shadow-2xl">
          <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
          <span className="font-semibold tracking-wide">Razorpay Buildathon 2026 — Track 01: AI Growth & Agentic Commerce</span>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Left Column: Cinematic Typography & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <h1 className="animate-fade-rise font-serif text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.98] tracking-[-2px] text-white">
              Where AI intent <br />
              <em className="not-italic text-slate-400 font-serif">rises into trusted</em> <br />
              commerce transactions.
            </h1>

            <p className="animate-fade-rise-delay text-base sm:text-lg text-slate-300/90 max-w-2xl leading-relaxed font-sans font-normal">
              Ordinary websites are built for human eyes, not autonomous AI agents. <strong className="text-white font-medium">Mercury</strong> is the infrastructure layer that makes merchants machine-discoverable, transactable, and policy-governed under Razorpay payment authorization.
            </p>

            {/* CTAs */}
            <div className="animate-fade-rise-delay-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/buyer"
                className="liquid-glass flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-sm transition-transform duration-200 hover:scale-[1.03] cursor-pointer shadow-xl shadow-blue-600/20"
              >
                <Bot className="h-4 w-4 text-cyan-400" />
                <span>Launch AI Buyer Agent</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/merchant"
                className="liquid-glass flex items-center gap-3 px-8 py-4 rounded-full text-slate-200 font-semibold text-sm transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4 text-blue-400" />
                <span>Merchant Console</span>
              </Link>

              <Link
                href="/demo"
                className="liquid-glass flex items-center gap-3 px-8 py-4 rounded-full text-emerald-300 font-semibold text-sm transition-transform duration-200 hover:scale-[1.03] cursor-pointer border-emerald-500/30"
              >
                <Play className="h-4 w-4 text-emerald-400" />
                <span>1-Click Hackathon Demo</span>
              </Link>
            </div>

            {/* Micro Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>OpenAPI 3.0 & Schema.org Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Deterministic Policy Air-Gap</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Razorpay HMAC-SHA256</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Gateway Core */}
          <div className="lg:col-span-5 relative">
            <TiltCard className="liquid-glass rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/[0.08] pb-3 px-2">
                <span className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  MERCURY 3D GATEWAY CORE
                </span>
                <span className="text-[11px] text-slate-400">Drag to Rotate Core</span>
              </div>

              <div className="h-80 w-full relative mt-2">
                <Mercury3DCanvas />
              </div>
            </TiltCard>
          </div>
        </div>

        {/* ── 3 Architecture Pillar Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <TiltCard className="liquid-glass p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 shadow-inner">
              <Code className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-3 font-normal">Agentic Catalog Protocol</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Exposes machine-readable JSON-LD feeds and OpenAPI 3.0 endpoints enabling autonomous AI agents (ChatGPT, Claude, AutoGPT) to inspect live products, pricing, stock, and payment rules.
            </p>
          </TiltCard>

          <TiltCard className="liquid-glass p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6 shadow-inner">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-3 font-normal">Autonomous Growth Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Computes purchase affinity vectors across 1,000+ historical order items to deliver evidence-based dynamic co-purchase upsells, increasing merchant AOV by +16.6%.
            </p>
          </TiltCard>

          <TiltCard className="liquid-glass p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6 shadow-inner">
              <Lock className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-3 font-normal">Deterministic Policy Air-Gap</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Separates LLM reasoning from financial execution. Financial caps enforce automatic limits, route out-of-bounds agent requests to human approval, and execute verified Razorpay checkouts.
            </p>
          </TiltCard>
        </div>

        {/* ── Interactive Agent Execution Trace ── */}
        <div className="mt-28 text-left border-t border-white/[0.08] pt-14 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Truthful Agent Execution Trace
                </h2>
                <p className="text-xs text-slate-400">Step-by-step cryptographic and policy verification stream</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full liquid-glass">
              🔍 Click any node to inspect server telemetry
            </span>
          </div>

          <Workflow3DGraph />
        </div>

      </div>
    </div>
  );
}
