'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Code, ExternalLink, Check, Copy, Play, Sparkles, Shield, ArrowRight } from 'lucide-react';

export const AgentMarketplaceTab: React.FC = () => {
  const [jsonLdData, setJsonLdData] = useState<any>(null);
  const [openApiData, setOpenApiData] = useState<any>(null);
  const [copiedLd, setCopiedLd] = useState(false);
  const [copiedApi, setCopiedApi] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'openapi' | 'tester'>('catalog');

  // Simulation Tester State
  const [testProductId, setTestProductId] = useState('cm45k001');
  const [testBudget, setTestBudget] = useState(7500);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    fetch('/api/ai-catalog')
      .then((res) => res.json())
      .then((data) => setJsonLdData(data))
      .catch((err) => console.error(err));

    fetch('/api/ai-catalog/openapi.json')
      .then((res) => res.json())
      .then((data) => setOpenApiData(data))
      .catch((err) => console.error(err));
  }, []);

  const handleCopyLd = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdData, null, 2));
    setCopiedLd(true);
    setTimeout(() => setCopiedLd(false), 2000);
  };

  const handleCopyApi = () => {
    navigator.clipboard.writeText(JSON.stringify(openApiData, null, 2));
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  const handleRunAgenticTest = async () => {
    setIsTesting(true);
    setTestResponse(null);
    try {
      const res = await fetch('/api/buyer/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId || 'cm45k001',
          requestedBudget: Number(testBudget),
          buyerNote: 'Simulated Autonomous Agentic Buyer Intent',
        }),
      });
      const data = await res.json();
      setTestResponse(data);
    } catch (err: any) {
      setTestResponse({ error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
              <Bot className="w-4 h-4" />
              TRACK 01 MANDATE: MAKE MERCHANTS SELLABLE TO AI BUYERS
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Machine-Readable AI Agent Catalog & Protocol Inspector
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Exposes standard schema.org JSON-LD feeds and OpenAPI specifications for third-party AI agents (ChatGPT, Claude, AutoGPT) to discover inventory, policy caps, and execute policy-governed purchases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/ai-catalog"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg flex items-center gap-1.5 border border-slate-700"
            >
              /api/ai-catalog <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/api/ai-catalog/openapi.json"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg flex items-center gap-1.5 border border-slate-700"
            >
              openapi.json <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex gap-4 mt-6 border-b border-slate-800">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`pb-3 text-xs font-mono font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'catalog'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            JSON-LD Agent Feed Schema
          </button>
          <button
            onClick={() => setActiveSubTab('openapi')}
            className={`pb-3 text-xs font-mono font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'openapi'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            OpenAPI 3.0 Specification
          </button>
          <button
            onClick={() => setActiveSubTab('tester')}
            className={`pb-3 text-xs font-mono font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'tester'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4" />
            A2A Autonomous Agentic Sandbox
          </button>
        </div>
      </div>

      {/* Sub-tab Content */}
      {activeSubTab === 'catalog' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live Payload: GET /api/ai-catalog</span>
            <button
              onClick={handleCopyLd}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 rounded flex items-center gap-1 border border-slate-700"
            >
              {copiedLd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLd ? 'Copied' : 'Copy JSON-LD'}
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800">
            {jsonLdData ? JSON.stringify(jsonLdData, null, 2) : 'Loading schema...'}
          </pre>
        </div>
      )}

      {activeSubTab === 'openapi' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live Payload: GET /api/ai-catalog/openapi.json</span>
            <button
              onClick={handleCopyApi}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 rounded flex items-center gap-1 border border-slate-700"
            >
              {copiedApi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedApi ? 'Copied' : 'Copy OpenAPI Spec'}
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-lg text-cyan-300 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800">
            {openApiData ? JSON.stringify(openApiData, null, 2) : 'Loading specification...'}
          </pre>
        </div>
      )}

      {activeSubTab === 'tester' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              Simulate External Agentic Buyer Request (A2A Protocol)
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Test how Mercury's Growth Agent and Policy Engine respond to dynamic pricing requests sent by third-party AI buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Product ID</label>
              <input
                type="text"
                value={testProductId}
                onChange={(e) => setTestProductId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                placeholder="Product ID (e.g., cm45k001)"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Budget Offer (₹)</label>
              <input
                type="number"
                value={testBudget}
                onChange={(e) => setTestBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                placeholder="Target Budget"
              />
            </div>
          </div>

          <button
            onClick={handleRunAgenticTest}
            disabled={isTesting}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs font-mono rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            {isTesting ? 'Evaluating Agentic Request...' : 'Send A2A Negotiation Request'}
            <ArrowRight className="w-4 h-4" />
          </button>

          {testResponse && (
            <div className="mt-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">A2A Negotiation Endpoint Response</span>
              <pre className="bg-slate-950 p-4 rounded-lg text-purple-300 font-mono text-xs overflow-x-auto max-h-80 border border-slate-800">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
