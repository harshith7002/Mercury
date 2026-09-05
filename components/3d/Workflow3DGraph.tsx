'use client';

import { useState } from 'react';
import { Cpu, ShoppingBag, TrendingUp, Lock, ShieldCheck, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';
import { TiltCard } from '@/components/3d/TiltCard';

export function Workflow3DGraph() {
  const [activeNode, setActiveNode] = useState<number>(0);

  const nodes = [
    {
      id: 0,
      title: '01. AI Buyer Intent',
      subtitle: 'Natural Language Parsing',
      icon: Cpu,
      color: 'from-blue-600 to-cyan-500',
      borderColor: 'border-blue-500/50',
      badge: 'INTENT ENGINE',
      description: 'Parses buyer budget, specs & constraints (e.g. "Mechanical keyboard under ₹6,000").',
      codeSnippet: `{\n  "intent": "SEARCH",\n  "category": "Electronics",\n  "maxBudget": 6000\n}`,
    },
    {
      id: 1,
      title: '02. Catalog Discovery',
      subtitle: 'Tool-Based Ranking',
      icon: ShoppingBag,
      color: 'from-cyan-500 to-indigo-500',
      borderColor: 'border-cyan-500/50',
      badge: 'CATALOG TOOLS',
      description: 'Executes SQLite catalog query for Keychron K2 Keyboard (₹5,499) with technical specs.',
      codeSnippet: `CatalogTools.searchCatalog({\n  query: "keyboard",\n  maxPrice: 6000\n});`,
    },
    {
      id: 2,
      title: '03. Growth Agent Upsell',
      subtitle: 'AOV Affinity Optimization',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      borderColor: 'border-indigo-500/50',
      badge: '31% AFFINITY',
      description: 'Calculates real co-purchase affinity across 1,050 orders: Ergonomic Wrist Rest (₹799).',
      codeSnippet: `CatalogTools.getGrowthAgentUpsell(\n  "prod_kbd_k2"\n); // +₹799 AOV`,
    },
    {
      id: 3,
      title: '04. Policy Engine Air-Gap',
      subtitle: 'Financial Authority Boundaries',
      icon: Lock,
      color: 'from-amber-500 to-rose-500',
      borderColor: 'border-amber-500/50',
      badge: 'MERCHANT BOUNDARY',
      description: 'Validates discount & total ₹6,298 against merchant policy limits (Max Auto: ₹10,000).',
      codeSnippet: `PolicyEngine.validateTransaction(6298);\n// Status: PASSED`,
    },
    {
      id: 4,
      title: '05. Razorpay Test Checkout',
      subtitle: 'HMAC-SHA256 Verification',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
      borderColor: 'border-emerald-500/50',
      badge: 'SERVER VERIFIED',
      description: 'Creates Razorpay Test Order order_rzp_101 & verifies HMAC-SHA256 payment signature.',
      codeSnippet: `RazorpayService.verifyPayment({\n  razorpaySignature: "sig_hmac_256"\n});`,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Node Graph Buttons Header */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative group ${
                isActive
                  ? `bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/20`
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${node.color} text-white shadow-md`}>
                  <Icon className="h-4 w-4" />
                </div>
                {isActive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-white truncate">{node.title}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{node.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Active Node 3D Telemetry Inspection Card */}
      <TiltCard className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                {nodes[activeNode].badge}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                Execution Latency: 12ms
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{nodes[activeNode].title}</h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {nodes[activeNode].description}
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 shadow-inner">
            <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2 border-b border-slate-900 pb-1">
              <span>AGENT TELEMETRY CODE</span>
              <span>JSON / NODE</span>
            </div>
            <pre className="whitespace-pre-wrap">{nodes[activeNode].codeSnippet}</pre>
          </div>

        </div>
      </TiltCard>

    </div>
  );
}
