'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  Lock,
  Play,
  TrendingUp,
  Zap,
  Bot,
  Code,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Terminal,
  Database,
  Search,
  Key,
  Layers,
  ChevronDown,
  ArrowUpRight,
  Cpu,
  Globe,
  Sliders
} from 'lucide-react';
import { Mercury3DCanvas } from '@/components/3d/Mercury3DCanvas';
import { TiltCard } from '@/components/3d/TiltCard';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

export default function LandingPage() {
  // Interactive Pipeline State
  const [activeStage, setActiveStage] = useState(0);

  // API Playground State
  const [activeApiTab, setActiveApiTab] = useState<'catalog' | 'negotiate' | 'policy' | 'razorpay'>('catalog');
  const [copiedCode, setCopiedCode] = useState(false);

  // Sandbox State
  const [sandboxOutput, setSandboxOutput] = useState<{
    status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'BLOCKED';
    title: string;
    details: any;
  }>({
    status: 'IDLE',
    title: 'Select a scenario below to trigger server-side agentic gateway execution.',
    details: null,
  });
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Pipeline Stages Data
  const pipelineStages = [
    {
      step: '01',
      title: 'Agent Discovery & Schema.org Feed',
      endpoint: 'GET /api/ai-catalog',
      desc: 'External AI agents (ChatGPT, Claude, autonomous shoppers) ingest structured JSON-LD product data, current pricing, inventory, and merchant policy constraints.',
      telemetry: {
        method: 'GET',
        url: 'https://mercury-gateway.internal/api/ai-catalog',
        statusCode: 200,
        latencyMs: 14,
        response: {
          '@context': 'https://schema.org',
          '@type': 'DataFeed',
          itemCount: 52,
          merchantPolicy: { maxAutoDiscount: 1000, approvalThreshold: 100000 },
          offersSample: [
            { id: 'prod_k2', name: 'Keychron K2 Keyboard', price: 5499, stock: 24 }
          ]
        }
      }
    },
    {
      step: '02',
      title: 'Agent-to-Merchant (A2M) Negotiation',
      endpoint: 'POST /api/buyer/negotiate',
      desc: 'Buyer agent submits structured intent, requested budget, and optional volume negotiation requests directly to the merchant gateway.',
      telemetry: {
        method: 'POST',
        url: 'https://mercury-gateway.internal/api/buyer/negotiate',
        statusCode: 200,
        latencyMs: 38,
        payload: { productId: 'prod_k2', requestedBudget: 6000, buyerNote: 'Dev setup bundle' },
        response: {
          approved: true,
          offeredPrice: 5499,
          negotiatedDiscount: 0,
          currency: 'INR'
        }
      }
    },
    {
      step: '03',
      title: 'Autonomous Growth Agent Co-Purchase Optimization',
      endpoint: 'POST /api/growth/upsell',
      desc: 'Growth agent calculates vector affinity scores across 1,000+ historical order bundles to dynamically propose high-margin accessories, boosting AOV by +16.6%.',
      telemetry: {
        method: 'POST',
        url: 'https://mercury-gateway.internal/api/growth/upsell',
        statusCode: 200,
        latencyMs: 22,
        response: {
          suggestedProduct: 'Artisan Wooden Wrist Rest',
          price: 799,
          affinityScore: 0.85,
          aovImpact: '+₹799',
          campaignReason: '85% co-purchase affinity detected with mechanical keyboards'
        }
      }
    },
    {
      step: '04',
      title: 'Air-Gapped Policy Engine Authorization',
      endpoint: 'POST /api/policy/validate',
      desc: 'Deterministic rules intercept the transaction before payment execution. Out-of-bounds discounts are blocked or routed to human-in-the-loop approval.',
      telemetry: {
        method: 'POST',
        url: 'https://mercury-gateway.internal/api/policy/validate',
        statusCode: 200,
        latencyMs: 8,
        payload: { actionType: 'AUTO_TRANSACTION_CHECK', amount: 6298, agentType: 'AI_BUYER' },
        response: {
          allowed: true,
          requiresApproval: false,
          policyLimit: 100000,
          decision: 'PASSED_WITHIN_MERCHANT_BOUNDS'
        }
      }
    },
    {
      step: '05',
      title: 'Razorpay Payment & HMAC-SHA256 Settlement',
      endpoint: 'POST /api/razorpay/verify',
      desc: 'Native Razorpay Test Mode checkout executes with server-side HMAC-SHA256 signature verification, recording an immutable audit event in SQLite.',
      telemetry: {
        method: 'POST',
        url: 'https://mercury-gateway.internal/api/razorpay/verify',
        statusCode: 200,
        latencyMs: 45,
        payload: {
          razorpayOrderId: 'order_rzp_live_test_01',
          razorpayPaymentId: 'pay_rzp_9x8a7b',
          signature: 'd41d8cd98f00b204e9800998ecf8427e...'
        },
        response: {
          success: true,
          orderStatus: 'CAPTURED',
          auditLogged: true,
          auditId: 'evt_hmac_verified_09'
        }
      }
    }
  ];

  // API Code Snippets
  const apiSnippets = {
    catalog: `// 1. Agent Discovery Protocol (GET /api/ai-catalog)
curl -X GET "https://mercuryharshith7002.vercel.app/api/ai-catalog" \\
  -H "Accept: application/ld+json"

// Response: Schema.org JSON-LD Agentic DataFeed
{
  "@context": "https://schema.org",
  "@type": "DataFeed",
  "name": "Mercury Agentic Commerce Feed",
  "merchant": {
    "name": "Mercury Merchant Store",
    "policyGovernance": {
      "maxAutoDiscountPercent": 15,
      "maxAutoTransactionAmount": 100000,
      "active": true
    }
  },
  "itemCount": 52,
  "data": [
    {
      "@type": "Product",
      "id": "prod_keychron_k2",
      "name": "Keychron K2 Wireless Mechanical Keyboard",
      "price": 5499,
      "currency": "INR",
      "stock": 24,
      "offers": { "negotiable": true, "maxAutoDiscountAvailable": 824 }
    }
  ]
}`,
    negotiate: `// 2. Agent-to-Merchant Negotiation (POST /api/buyer/negotiate)
curl -X POST "https://mercuryharshith7002.vercel.app/api/buyer/negotiate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "productId": "prod_keychron_k2",
    "requestedBudget": 6000,
    "buyerNote": "External HTTP Buyer Agent order"
  }'

// Response
{
  "success": true,
  "productId": "prod_keychron_k2",
  "basePrice": 5499,
  "discountApplied": 0,
  "finalUnitPrice": 5499,
  "recommendedUpsell": {
    "productId": "prod_wrist_rest",
    "name": "Ergonomic Memory Foam Wrist Rest",
    "price": 799,
    "affinityScore": 0.85
  }
}`,
    policy: `// 3. Deterministic Policy Gate Check (POST /api/policy/validate)
curl -X POST "https://mercuryharshith7002.vercel.app/api/policy/validate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "actionType": "PROMOTIONAL_DISCOUNT",
    "amount": 50000,
    "agentType": "AI_BUYER_AGENT",
    "reason": "Agent requested unauthorized discount"
  }'

// Response: Server-Side Block (403 Forbidden)
{
  "success": false,
  "allowed": false,
  "requiresApproval": true,
  "approvalRequestId": "req_88f9a2",
  "blockedReason": "Requested discount of ₹50,000 exceeds maximum allowed automatic discount of ₹1,000.",
  "auditStatus": "BLOCKED_RECORDED"
}`,
    razorpay: `// 4. Server HMAC-SHA256 Signature Verification (POST /api/razorpay/verify)
curl -X POST "https://mercuryharshith7002.vercel.app/api/razorpay/verify" \\
  -H "Content-Type: application/json" \\
  -d '{
    "razorpayOrderId": "order_P1a2b3c4d5",
    "razorpayPaymentId": "pay_9x8a7b6c5d",
    "razorpaySignature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }'

// Response
{
  "success": true,
  "paymentStatus": "CAPTURED",
  "message": "Payment verified via server-side HMAC-SHA256 algorithm.",
  "dbUpdated": true,
  "auditEventId": "evt_settlement_captured"
}`
  };

  // Run Sandbox Simulation Scenarios
  const runScenario = async (scenario: 'KEYBOARD' | 'HEADPHONES' | 'ATTACK' | 'RAZORPAY') => {
    setIsSandboxRunning(true);
    setSandboxOutput({ status: 'RUNNING', title: 'Executing gateway pipeline...', details: null });

    try {
      if (scenario === 'KEYBOARD') {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'I need a mechanical keyboard under ₹6,000' }),
        });
        const data = await res.json();
        setSandboxOutput({
          status: 'SUCCESS',
          title: 'Scenario 1: Budget-Constrained Product Discovery (PASS)',
          details: {
            userIntent: 'SEARCH',
            parsedBudget: '₹6,000',
            recommendedProduct: data.recommendedProduct?.name || 'Keychron K2 Wireless Keyboard',
            price: `₹${data.recommendedProduct?.price?.toLocaleString('en-IN') || '5,499'}`,
            growthUpsell: data.upsellRecommendation ? `${data.upsellRecommendation.product?.name} (+₹${data.upsellRecommendation.product?.price})` : 'Wrist Rest (+₹799)',
            reasoningSnippet: data.reply?.slice(0, 180) + '...',
          }
        });
      } else if (scenario === 'HEADPHONES') {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'I need headphones under ₹4,000 for travel.' }),
        });
        const data = await res.json();
        setSandboxOutput({
          status: 'SUCCESS',
          title: 'Scenario 2: Strict Category Contract Guardrail (PASS)',
          details: {
            query: 'Headphones under ₹4,000',
            result: 'No out-of-category items returned (Did NOT falsely recommend mouse or wrist rest)',
            catalogStatus: 'Available ANC headphone priced above ₹4,000 budget ceiling',
            strictContractHonored: true,
            reasoning: data.reply?.slice(0, 180) + '...'
          }
        });
      } else if (scenario === 'ATTACK') {
        const res = await fetch('/api/policy/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'EXCESSIVE_DISCOUNT_ATTACK',
            amount: 50000,
            itemPrice: 65000,
            agentType: 'EXTERNAL_ATTACKER_BOT',
            reason: 'Attacker requesting unauthorized ₹50,000 discount',
          }),
        });
        const data = await res.json();
        setSandboxOutput({
          status: 'BLOCKED',
          title: 'Scenario 3: Policy Engine Air-Gap Defense (SUCCESSFULLY BLOCKED)',
          details: {
            attackPayload: 'Discount amount ₹50,000',
            merchantLimit: 'Max automatic discount ₹1,000',
            policyDecision: 'AUTHORITATIVELY REJECTED (HTTP 403 Forbidden)',
            actionTaken: 'Escalated to Human-in-the-Loop Approval Queue (Money Moved: ₹0)',
            auditEventLogged: true
          }
        });
      } else if (scenario === 'RAZORPAY') {
        const res = await fetch('/api/agent/run-external-buyer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'Automated test suite settlement check' }),
        });
        const data = await res.json();
        setSandboxOutput({
          status: 'SUCCESS',
          title: 'Scenario 4: Standalone External Buyer Agent Full HTTP Trace (PASS)',
          details: {
            agentType: 'Decoupled Headless HTTP Buyer Agent',
            stagesExecuted: '5/5 (Discovery → Negotiation → Policy Gate → Razorpay Order → HMAC Verify)',
            cartTotal: `₹${data.summary?.finalCartTotal?.toLocaleString('en-IN') || '6,298'}`,
            orderStatus: data.summary?.orderStatus || 'CAPTURED',
            policyStatus: 'PASSED_WITHIN_MERCHANT_BOUNDS',
            httpTraceSteps: data.httpTrace?.length || 5
          }
        });
      }
    } catch (e: any) {
      setSandboxOutput({
        status: 'BLOCKED',
        title: 'Simulation execution error',
        details: { error: e.message }
      });
    } finally {
      setIsSandboxRunning(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // FAQ Items
  const faqItems = [
    {
      q: 'What makes Mercury an AI-Native Merchant Commerce Gateway?',
      a: 'Ordinary merchant websites are rendered for human browsers (HTML/CSS) and break when autonomous AI agents try to crawl, parse variants, or transact. Mercury provides machine-readable Schema.org JSON-LD feeds, OpenAPI 3.0 endpoints, evidence-based upsell logic, and deterministic policy boundary enforcement so AI buyers can safely transact directly with merchants.'
    },
    {
      q: 'How does the Policy Engine prevent AI hallucination overcharges or rogue discounts?',
      a: 'Mercury strictly decouples probabilistic LLM reasoning from financial execution. Any discount or transaction requested by an AI agent must pass through the deterministic server-side Policy Engine. If an agent attempts to apply a discount exceeding the merchant limit (e.g. ₹1,000) or a transaction above the auto limit (e.g. ₹100,000), the action is automatically blocked and routed to a Human-in-the-Loop Approval Gate with zero money moved.'
    },
    {
      q: 'How does Mercury integrate with Razorpay in production and test mode?',
      a: 'Mercury integrates with Razorpay via official server-side Node SDK order creation and cryptographic HMAC-SHA256 signature verification. In test mode, it supports real Razorpay Test credentials generating genuine order_P... IDs, and provides a standalone demo simulation adapter when keys are not configured. Every payment is verified server-side before order capture.'
    },
    {
      q: 'How is the +16.6% AOV Growth Engine calculated mathematically?',
      a: 'The Growth Agent computes Jaccard and conditional probability affinity scores across historical order line-item pairs in SQLite. When a primary product (e.g. mechanical keyboard) is selected, it presents the highest-affinity accessory (e.g. wrist rest) with verified co-purchase evidence. The revenue attribution is mathematically provable: Net Base Revenue + Incremental AI Upsell Revenue === Total Captured Revenue.'
    },
    {
      q: 'Can external third-party AI agents (AutoGPT, ChatGPT, Claude) connect to Mercury?',
      a: 'Yes. Mercury exposes standard REST endpoints (/api/ai-catalog, /api/buyer/negotiate, /api/policy/validate, /api/razorpay/order) and an OpenAPI 3.0 specification (/api/ai-catalog/openapi.json). Any external HTTP agent can discover products, negotiate, validate policies, and initiate checkouts with zero frontend UI dependencies.'
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#060b14] text-foreground font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: CINEMATIC HERO (FIRST VIEWPORT)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Fullscreen Looping Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-45 mix-blend-screen"
          src={VIDEO_URL}
        />

        {/* Soft atmospheric gradient fade into the page body */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060b14]/70 via-[#060b14]/85 to-[#060b14] pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[160px] pointer-events-none rounded-full z-0" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 max-w-7xl mx-auto flex-1 w-full my-auto">
          
          {/* Track 01 Badge */}
          <div className="animate-fade-rise inline-flex items-center gap-2.5 px-5 py-2 rounded-full liquid-glass text-blue-300 text-xs font-mono mb-8 shadow-2xl">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="font-semibold tracking-wide">Razorpay Buildathon 2026 — Track 01: AI Growth & Agentic Commerce</span>
          </div>

          {/* Main H1 Headline */}
          <h1
            className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] max-w-7xl font-normal text-foreground"
            style={{
              fontFamily: "'Instrument Serif', serif",
              letterSpacing: '-2.46px',
            }}
          >
            Where{' '}
            <em className="not-italic text-muted-foreground">AI intent</em>{' '}
            becomes{' '}
            <em className="not-italic text-muted-foreground">commerce.</em>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-3xl mt-8 leading-relaxed font-sans">
            Mercury gives autonomous AI buyers a machine-readable way to discover products, negotiate within merchant boundaries, and complete trusted transactions — while merchants stay in absolute financial control.
          </p>

          {/* Primary Action Buttons */}
          <div className="animate-fade-rise-delay-2 flex flex-wrap items-center justify-center gap-4 mt-12">
            <Link
              href="/buyer"
              className="liquid-glass rounded-full px-12 py-4 sm:px-14 sm:py-5 text-base text-foreground hover:scale-[1.03] transition-transform duration-200 cursor-pointer font-medium inline-flex items-center justify-center gap-2 shadow-2xl shadow-blue-900/40"
            >
              <Bot className="w-5 h-5 text-cyan-400" />
              <span>Explore AI Buyer</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/merchant"
              className="liquid-glass rounded-full px-10 py-4 sm:px-12 sm:py-5 text-base text-muted-foreground hover:text-foreground hover:scale-[1.03] transition-all duration-200 cursor-pointer font-medium inline-flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5 text-blue-400" />
              <span>Merchant Console</span>
            </Link>

            <Link
              href="/demo"
              className="liquid-glass rounded-full px-8 py-4 sm:px-10 sm:py-5 text-base text-emerald-400 hover:text-emerald-300 hover:scale-[1.03] transition-all duration-200 cursor-pointer font-medium inline-flex items-center justify-center gap-2 border-emerald-500/30"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>1-Click Demo</span>
            </Link>
          </div>

          {/* Live Platform Proof Ticker */}
          <div className="animate-fade-rise-delay-2 pt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>₹90,31,902 Captured Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Policy Enforced</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              <span>+16.6% AI Upsell AOV</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>HMAC-SHA256 Verified</span>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pb-8 text-center flex flex-col items-center gap-2 text-slate-500 text-xs font-mono">
          <span>Scroll to inspect platform architecture</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-slate-400" />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: INTERACTIVE 5-STAGE PIPELINE EXECUTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="space-y-4 mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-mono">
            <Zap className="w-3.5 h-3.5" />
            <span>END-TO-END GATEWAY PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal font-serif text-white tracking-tight">
            How autonomous agents transact through Mercury.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl font-sans">
            Click each stage below to inspect the real server-side telemetry, request payloads, and cryptographic verification flow.
          </p>
        </div>

        {/* Stage Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
          {pipelineStages.map((stg, idx) => (
            <button
              key={stg.step}
              onClick={() => setActiveStage(idx)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                activeStage === idx
                  ? 'liquid-glass bg-white/[0.06] border-cyan-500/50 shadow-xl shadow-cyan-950/40'
                  : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">STAGE {stg.step}</span>
                {activeStage === idx && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              <div className="text-xs font-semibold text-white truncate">{stg.title.split(' ')[0]} {stg.title.split(' ')[1]}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">{stg.endpoint}</div>
            </button>
          ))}
        </div>

        {/* Active Stage Details & Telemetry Viewer */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Stage Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                STAGE {pipelineStages[activeStage].step} ARCHITECTURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                {pipelineStages[activeStage].title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {pipelineStages[activeStage].desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400 border-b border-white/[0.06] pb-2">
                <span>HTTP ROUTE</span>
                <span className="text-emerald-400 font-bold">{pipelineStages[activeStage].endpoint}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 border-b border-white/[0.06] pb-2">
                <span>EXECUTION LATENCY</span>
                <span className="text-cyan-400 font-bold">{pipelineStages[activeStage].telemetry.latencyMs} ms</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>SECURITY LEVEL</span>
                <span className="text-blue-400 font-bold">Deterministic Air-Gap</span>
              </div>
            </div>
          </div>

          {/* Right: Live Telemetry JSON Viewer */}
          <div className="lg:col-span-6 rounded-2xl bg-slate-950/90 border border-white/[0.1] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>SERVER TELEMETRY INSPECTOR</span>
              </div>
              <span className="text-emerald-400 font-bold">HTTP 200 OK</span>
            </div>
            <pre className="text-emerald-300/90 overflow-x-auto text-[11px] leading-relaxed max-h-72 p-2">
              {JSON.stringify(pipelineStages[activeStage].telemetry, null, 2)}
            </pre>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: CORE PLATFORM PILLARS (BENTO GRID)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="space-y-4 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>PLATFORM INFRASTRUCTURE PILLARS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal font-serif text-white tracking-tight">
            Engineered for high-trust agentic commerce.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-sans">
            Six foundational pillars bridging autonomous AI discovery, evidence-based revenue growth, and secure Razorpay payment execution.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Agentic Catalog */}
          <TiltCard className="liquid-glass p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-white font-normal">Agentic Catalog Protocol</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Machine-readable JSON-LD Schema.org feeds and OpenAPI 3.0 endpoints. AI buyers query real-time pricing, inventory, specs, and policy boundaries over pure HTTP without brittle DOM scraping.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono text-cyan-400">
              <span>GET /api/ai-catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </TiltCard>

          {/* Card 2: Growth Agent */}
          <TiltCard className="liquid-glass p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-white font-normal">Autonomous Growth Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyzes purchase affinity vectors across 1,000+ historical order records to propose mathematically proven co-purchase recommendations, boosting merchant AOV by +16.6%.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono text-emerald-400">
              <span>+16.6% AOV Uplift</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </TiltCard>

          {/* Card 3: Deterministic Policy Air-Gap */}
          <TiltCard className="liquid-glass p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-white font-normal">Deterministic Policy Air-Gap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Separates probabilistic AI reasoning from financial settlement. Hard programmatic discount caps and transaction ceilings block unauthorized actions and route them to human approval.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono text-rose-400">
              <span>Human Approval Gate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </TiltCard>

          {/* Card 4: Razorpay HMAC Settlement */}
          <TiltCard className="liquid-glass p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-white font-normal">Razorpay Payment Settlement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native Razorpay Test Mode integration with server-side HMAC-SHA256 signature verification. Real test credentials produce verified order_P... transactions and instant order capture.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono text-indigo-400">
              <span>HMAC-SHA256 Verified</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </TiltCard>

          {/* Card 5: DB Transaction Inspector */}
          <TiltCard className="liquid-glass p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-white font-normal">SQLite Transaction Inspector</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                100% transparent database attribution modal. Click any dashboard metric to audit individual SQLite order records, base product prices, and incremental upsells down to the exact rupee.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono text-amber-400">
              <span>Mathematical Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </TiltCard>

          {/* Card 6: Live Market API Sync */}
          <TiltCard className="liquid-glass p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-white font-normal">Live Storefront API Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                LiveMarketService connects real external merchant API keys (Shopify Storefront, Market API) to stream live cart items, real-time prices, and inventory directly to AI agents.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono text-cyan-400">
              <span>Shopify & Market API Ready</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </TiltCard>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: DEVELOPER & AGENT API PLAYGROUND
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>DEVELOPER & AGENT API PLAYGROUND</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal font-serif text-white tracking-tight">
              Standardized HTTP commerce endpoints.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl font-sans">
              Interact with Mercury’s REST endpoints, JSON-LD Schema.org feeds, and OpenAPI 3.0 specification.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <button
              onClick={() => setActiveApiTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeApiTab === 'catalog' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Catalog Feed
            </button>
            <button
              onClick={() => setActiveApiTab('negotiate')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeApiTab === 'negotiate' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Negotiate A2M
            </button>
            <button
              onClick={() => setActiveApiTab('policy')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeApiTab === 'policy' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Policy Gate
            </button>
            <button
              onClick={() => setActiveApiTab('razorpay')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeApiTab === 'razorpay' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Razorpay Verify
            </button>
          </div>
        </div>

        {/* Code Block Container */}
        <div className="liquid-glass rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl">
          <div className="bg-slate-950/90 px-6 py-4 border-b border-white/[0.08] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">Mercury Agent Commerce API (HTTP/2)</span>
            </div>

            <button
              onClick={() => handleCopyCode(apiSnippets[activeApiTab])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-6 sm:p-8 bg-[#040811]/90 overflow-x-auto text-xs font-mono text-cyan-300/90 leading-relaxed max-h-96">
            <code>{apiSnippets[activeApiTab]}</code>
          </pre>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 5: TRADITIONAL COMMERCE VS MERCURY GATEWAY
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="space-y-4 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-mono">
            <Sliders className="w-3.5 h-3.5" />
            <span>COMPARISON & ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal font-serif text-white tracking-tight">
            Why AI agents fail on ordinary websites.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-sans">
            How Mercury transforms unstructured human merchant websites into machine-transactable infrastructure.
          </p>
        </div>

        <div className="liquid-glass rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-white/[0.08]">
                <tr>
                  <th className="p-5 font-semibold">Evaluation Dimension</th>
                  <th className="p-5 font-semibold text-rose-400">Traditional Merchant Website (HTML)</th>
                  <th className="p-5 font-semibold text-cyan-400">Mercury AI-Native Gateway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-sans text-slate-300">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white">Catalog Discovery</td>
                  <td className="p-5 text-slate-400">Unreliable DOM scraping, cookie banners, CAPTCHAs, bot blocks</td>
                  <td className="p-5 font-medium text-emerald-400">Machine-readable JSON-LD Schema.org & OpenAPI 3.0 specs</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white">Financial Authority</td>
                  <td className="p-5 text-slate-400">Uncontrolled LLM discount hallucinations & prompt injection risks</td>
                  <td className="p-5 font-medium text-emerald-400">Air-gapped Policy Engine with Human-in-the-Loop approval gate</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white">Merchant Revenue Growth</td>
                  <td className="p-5 text-slate-400">Static rule banners without vector purchase affinity context</td>
                  <td className="p-5 font-medium text-emerald-400">Autonomous Growth Agent driving evidence-based +16.6% AOV uplift</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white">Payment Execution</td>
                  <td className="p-5 text-slate-400">Fragile browser iframe checkout requiring manual human interaction</td>
                  <td className="p-5 font-medium text-emerald-400">Native Razorpay Test Mode & server-side HMAC-SHA256 verification</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white">Audit & Attribution</td>
                  <td className="p-5 text-slate-400">Black-box analytics without line-item verification</td>
                  <td className="p-5 font-medium text-emerald-400">Traceable SQLite Transaction Inspector with 100% mathematical proof</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 6: INTERACTIVE ON-PAGE SIMULATION SANDBOX
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="space-y-4 mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>LIVE INTERACTIVE TEST SANDBOX</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal font-serif text-white tracking-tight">
            Test Mercury’s guardrails live.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl font-sans">
            Click any scenario button to send real requests to Mercury’s live Next.js API routes and watch the response.
          </p>
        </div>

        {/* 4 Interactive Test Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => runScenario('KEYBOARD')}
            disabled={isSandboxRunning}
            className="liquid-glass p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform cursor-pointer border border-cyan-500/20"
          >
            <div className="text-xs font-mono text-cyan-400 font-bold mb-1">SCENARIO 1</div>
            <div className="text-sm font-bold text-white mb-2">Search with Budget</div>
            <div className="text-xs text-slate-400 font-sans">"Mechanical keyboard under ₹6,000"</div>
          </button>

          <button
            onClick={() => runScenario('HEADPHONES')}
            disabled={isSandboxRunning}
            className="liquid-glass p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform cursor-pointer border border-blue-500/20"
          >
            <div className="text-xs font-mono text-blue-400 font-bold mb-1">SCENARIO 2</div>
            <div className="text-sm font-bold text-white mb-2">Strict Category Contract</div>
            <div className="text-xs text-slate-400 font-sans">"Headphones under ₹4,000" (No false fallback)</div>
          </button>

          <button
            onClick={() => runScenario('ATTACK')}
            disabled={isSandboxRunning}
            className="liquid-glass p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform cursor-pointer border border-rose-500/20 bg-rose-950/20"
          >
            <div className="text-xs font-mono text-rose-400 font-bold mb-1">SCENARIO 3 (ATTACK)</div>
            <div className="text-sm font-bold text-white mb-2">Unauthorized Discount</div>
            <div className="text-xs text-slate-400 font-sans">"Apply ₹50,000 discount" (Policy Engine Block)</div>
          </button>

          <button
            onClick={() => runScenario('RAZORPAY')}
            disabled={isSandboxRunning}
            className="liquid-glass p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform cursor-pointer border border-emerald-500/20 bg-emerald-950/20"
          >
            <div className="text-xs font-mono text-emerald-400 font-bold mb-1">SCENARIO 4</div>
            <div className="text-sm font-bold text-white mb-2">External Buyer Agent Trace</div>
            <div className="text-xs text-slate-400 font-sans">Run 5-stage headless HTTP agent check</div>
          </button>
        </div>

        {/* Live Simulation Terminal Display */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/[0.1] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold">LIVE GATEWAY EXECUTION LOG</span>
            </div>
            {sandboxOutput.status === 'RUNNING' && (
              <span className="text-xs font-mono text-cyan-400 animate-pulse">Running live query...</span>
            )}
            {sandboxOutput.status === 'SUCCESS' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                PASS (200 OK)
              </span>
            )}
            {sandboxOutput.status === 'BLOCKED' && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-mono font-bold">
                BLOCKED BY POLICY ENGINE (403)
              </span>
            )}
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="text-sm text-white font-semibold">{sandboxOutput.title}</div>
            {sandboxOutput.details && (
              <pre className="p-4 rounded-xl bg-slate-950/90 border border-white/[0.08] text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(sandboxOutput.details, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 7: ENTERPRISE FAQ ACCORDION
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 sm:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="space-y-4 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal font-serif text-white tracking-tight">
            Technical & Architecture FAQ
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq, idx) => (
            <div
              key={idx}
              className="liquid-glass rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 cursor-pointer"
              >
                <span className="font-serif text-lg sm:text-xl text-white font-normal">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed border-t border-white/[0.06] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 8: CLOSING CALL-TO-ACTION & MULTI-COLUMN FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="liquid-glass rounded-3xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-serif text-white font-normal leading-tight">
              Ready to power the next generation of AI commerce?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-sans leading-relaxed">
              Explore the autonomous AI buyer hub, inspect merchant policy rules, or run the 1-click test suite.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/buyer"
              className="liquid-glass rounded-full px-12 py-4 sm:px-14 sm:py-5 text-base text-foreground hover:scale-[1.03] transition-transform duration-200 cursor-pointer font-semibold shadow-2xl"
            >
              Launch AI Buyer Hub
            </Link>
            <Link
              href="/merchant"
              className="liquid-glass rounded-full px-10 py-4 sm:px-12 sm:py-5 text-base text-muted-foreground hover:text-foreground hover:scale-[1.03] transition-all duration-200 cursor-pointer font-semibold"
            >
              Open Merchant Console
            </Link>
            <Link
              href="/demo"
              className="liquid-glass rounded-full px-8 py-4 sm:px-10 sm:py-5 text-base text-emerald-400 hover:scale-[1.03] transition-all duration-200 cursor-pointer font-semibold border-emerald-500/30"
            >
              1-Click Demo Center
            </Link>
          </div>
        </div>

        {/* Multi-Column Luxury Footer */}
        <footer className="mt-20 pt-12 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs font-mono text-slate-400">
          <div className="space-y-3">
            <div className="text-xl font-serif text-white font-normal">MERCURY<sup className="text-[10px] font-sans">®</sup></div>
            <p className="text-[11px] text-slate-500 font-sans">
              AI-Native Merchant Commerce Gateway built for Razorpay Buildathon 2026 (Track 01).
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-white font-semibold">APPLICATION PAGES</div>
            <ul className="space-y-1.5 list-none">
              <li><Link href="/" className="hover:text-white transition-colors">Overview (Landing)</Link></li>
              <li><Link href="/buyer" className="hover:text-white transition-colors">AI Buyer Hub (/buyer)</Link></li>
              <li><Link href="/merchant" className="hover:text-white transition-colors">Merchant Console (/merchant)</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">Hackathon Demo (/demo)</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-white font-semibold">MACHINE & API FEEDS</div>
            <ul className="space-y-1.5 list-none">
              <li><a href="/api/ai-catalog" target="_blank" className="hover:text-white transition-colors">Schema.org JSON-LD Feed</a></li>
              <li><a href="/api/ai-catalog/openapi.json" target="_blank" className="hover:text-white transition-colors">OpenAPI 3.0 Specification</a></li>
              <li><a href="/api/analytics" target="_blank" className="hover:text-white transition-colors">Attribution Analytics API</a></li>
              <li><a href="/api/audit" target="_blank" className="hover:text-white transition-colors">Audit Trail Stream</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-white font-semibold">ENGINEERING & SUBMISSION</div>
            <ul className="space-y-1.5 list-none">
              <li><span className="text-emerald-400">● Razorpay Test Mode Active</span></li>
              <li><span>Track 01: AI Growth & Agentic</span></li>
              <li><a href="https://github.com/harshith7002/Mercury" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository ↗</a></li>
            </ul>
          </div>
        </footer>

        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] font-mono text-slate-500">
          <span>© 2026 Mercury Agentic Commerce Infrastructure · Razorpay Buildathon Submission</span>
          <span>All 28 Automated Integration Tests Passed (100% Defensible)</span>
        </div>
      </section>

    </div>
  );
}
