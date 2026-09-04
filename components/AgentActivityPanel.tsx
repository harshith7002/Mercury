'use client';

import { AgentStep } from '@/types';
import { Activity, CheckCircle2, ShieldAlert, Cpu, Wrench, Lock, AlertCircle, Clock } from 'lucide-react';

interface AgentActivityPanelProps {
  steps: AgentStep[];
  isThinking?: boolean;
}

export function AgentActivityPanel({ steps, isThinking }: AgentActivityPanelProps) {
  const getStatusIcon = (status: AgentStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'tool_call':
        return <Wrench className="h-4 w-4 text-blue-400" />;
      case 'policy_check':
        return <Lock className="h-4 w-4 text-amber-400" />;
      case 'blocked':
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case 'thinking':
        return <Cpu className="h-4 w-4 text-indigo-400 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: AgentStep['status']) => {
    switch (status) {
      case 'completed':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">SUCCESS</span>;
      case 'tool_call':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">TOOL EXECUTION</span>;
      case 'policy_check':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">POLICY CHECK</span>;
      case 'blocked':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">BLOCKED BY POLICY</span>;
      case 'failed':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">FAILED</span>;
      case 'thinking':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">THINKING...</span>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Live Agent Decision Timeline</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">{steps.length} Steps</span>
      </div>

      {steps.length === 0 && !isThinking ? (
        <div className="py-6 text-center text-xs text-slate-500 font-mono">
          Agent timeline idle. Enter a prompt to watch tool execution and policy checks in real-time.
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {steps.map((step, idx) => (
            <div key={step.id || idx} className="relative flex items-start gap-3 pl-1 group">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950 shadow-sm z-10">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 transition-all group-hover:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{step.title}</span>
                    {step.toolName && (
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800">
                        {step.toolName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(step.status)}
                    <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="relative flex items-start gap-3 pl-1 animate-pulse">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-700 bg-indigo-950 z-10">
                <Cpu className="h-4 w-4 text-indigo-400 animate-spin" />
              </div>
              <div className="flex-1 rounded-lg border border-indigo-900/50 bg-indigo-950/30 p-2.5">
                <span className="text-xs font-semibold text-indigo-300 font-mono">Agent analyzing prompt & catalog tools...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
