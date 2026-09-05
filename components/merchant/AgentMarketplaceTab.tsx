'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Code, ExternalLink, Check, Copy, Play, Sparkles, Shield, ArrowRight, RefreshCw, Cpu } from 'lucide-react';

export const AgentMarketplaceTab: React.FC = () => {
  const [jsonLdData, setJsonLdData] = useState<any>(null);
  const [openApiData, setOpenApiData] = useState<any>(null);
  const [copiedLd, setCopiedLd] = useState(false);
  const [copiedApi, setCopiedApi] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'openapi' | 'runner'>('catalog');

  // External Agent Runner State
  const [externalPrompt, setExternalPrompt] = useState('I need a mechanical keyboard for programming under ₹6,000.');
  const [runnerResult, setRunnerResult] = useState<any>(null);
  const [isRunningAgent, setIsRunningAgent] = useState(false);

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

  const handleRunExternalAgent = async () => {
    setIsRunningAgent(true);
    setRunnerResult(null);
    try {
      const res = await fetch('/api/agent/run-external-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: externalPrompt }),
      });
      const data = await res.json();
      setRunnerResult(data);
    } catch (err: any) {
      setRunnerResult({ error: err.message });
    } finally {
      setIsRunningAgent(false);
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
              TRACK 01 INFRASTRUCTURE: AGENT-TO-MERCHANT (A2M) GATEWAY
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Machine-Readable AI Agent Catalog & Protocol Inspector
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Exposes standard schema.org JSON-LD feeds and OpenAPI specifications for third-party AI agents (ChatGPT, Claude, AutoGPT) to discover inventory, policy caps, and execute policy-governed purchases over pure HTTP APIs.
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
            onClick={() => setActiveSubTab('runner')}
            className={`pb-3 text-xs font-mono font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'runner'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4" />
            Run Independent External AI Buyer Agent
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

      {activeSubTab === 'runner' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Execute Headless HTTP AI Buyer Agent (A2M Protocol)
              </h3>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Spawns an independent external AI buyer that interacts strictly over HTTP APIs (`GET /api/ai-catalog`, `POST /api/buyer/negotiate`, `POST /api/razorpay/order`) without relying on the React UI.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">External Buyer Prompt</label>
            <input
              type="text"
              value={externalPrompt}
              onChange={(e) => setExternalPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleRunExternalAgent}
            disabled={isRunningAgent}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs font-mono rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            {isRunningAgent ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Executing HTTP API Requests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                ▶ Run Independent External AI Buyer Agent (HTTP Protocol)
              </>
            )}
          </button>

          {runnerResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400">Selected Product: </span>
                  <strong className="text-white">{runnerResult.summary?.selectedProduct}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Final Cart Total: </span>
                  <strong className="text-emerald-400 font-bold">₹{runnerResult.summary?.finalCartTotal?.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Payment Verified: </span>
                  <strong className="text-cyan-400 font-bold">{runnerResult.summary?.orderStatus}</strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">HTTP API Call Sequence ({runnerResult.httpTrace?.length} Endpoints Executed)</span>
                <div className="space-y-2 font-mono text-xs">
                  {runnerResult.httpTrace?.map((step: any) => (
                    <div key={step.step} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-400 font-bold">STEP {step.step}: {step.name}</span>
                        <span className="text-slate-400 text-[10px]">{step.latencyMs}ms</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 font-bold mr-2">{step.method}</span>
                        <span className="text-slate-400">{step.url}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
