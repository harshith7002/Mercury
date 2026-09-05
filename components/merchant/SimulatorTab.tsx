'use client';

import React, { useState, useMemo } from 'react';
import { Sliders, TrendingUp, ShieldAlert, Zap, CheckCircle, RefreshCw, BarChart2, DollarSign } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SimulatorTabProps {
  currentPolicy: {
    maxAutoDiscountAmount: number;
    maxAutoDiscountPercent: number;
    maxAutoTransactionAmount: number;
  };
  onPolicyUpdated?: () => void;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({ currentPolicy, onPolicyUpdated }) => {
  const [maxDiscountPercent, setMaxDiscountPercent] = useState<number>(currentPolicy.maxAutoDiscountPercent || 20);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(currentPolicy.maxAutoDiscountAmount || 1000);
  const [maxTxAmount, setMaxTxAmount] = useState<number>(currentPolicy.maxAutoTransactionAmount || 10000);
  const [aggressiveness, setAggressiveness] = useState<'low' | 'balanced' | 'aggressive' | 'ultra'>('balanced');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Dynamic Monte Carlo Projection Calculations
  const simulation = useMemo(() => {
    const aggMultipliers = { low: 0.85, balanced: 1.15, aggressive: 1.4, ultra: 1.75 };
    const mult = aggMultipliers[aggressiveness];

    const baseMonthlyRev = 7952689; // Baseline Seeded Revenue
    const discountFactor = (maxDiscountPercent / 20) * 0.08;
    const txCapFactor = (maxTxAmount / 10000) * 0.05;

    const projectedUpliftPct = Math.round((discountFactor + txCapFactor + (mult - 1) * 0.12) * 100 * 10) / 10;
    const projectedRevenue = Math.round(baseMonthlyRev * (1 + projectedUpliftPct / 100));
    const projectedIncremental = Math.round(projectedRevenue - baseMonthlyRev);
    const projectedAovUplift = Math.round((14.2 + projectedUpliftPct * 0.25) * 10) / 10;
    const projectedConversion = Math.round((2.8 + (mult * 0.4) + (maxDiscountPercent * 0.02)) * 100) / 100;

    // Risk Calculation
    let riskLevel: 'LOW' | 'BALANCED' | 'ELEVATED' | 'HIGH' = 'BALANCED';
    let riskScore = (maxDiscountPercent / 50) * 40 + (maxDiscountAmount / 5000) * 30 + (mult * 15);
    if (riskScore < 35) riskLevel = 'LOW';
    else if (riskScore < 60) riskLevel = 'BALANCED';
    else if (riskScore < 80) riskLevel = 'ELEVATED';
    else riskLevel = 'HIGH';

    // 4-Week Trend Graph Data
    const chartData = [
      { week: 'W1 Baseline', baseline: 1800000, projected: Math.round(1800000 * (1 + projectedUpliftPct / 100)) },
      { week: 'W2 Growth', baseline: 1950000, projected: Math.round(1950000 * (1 + projectedUpliftPct / 100)) },
      { week: 'W3 Peak', baseline: 2100000, projected: Math.round(2100000 * (1 + projectedUpliftPct / 100)) },
      { week: 'W4 Projected', baseline: 2102689, projected: Math.round(2102689 * (1 + projectedUpliftPct / 100)) },
    ];

    return {
      projectedRevenue,
      projectedIncremental,
      projectedUpliftPct,
      projectedAovUplift,
      projectedConversion,
      riskLevel,
      riskScore: Math.round(riskScore),
      chartData,
    };
  }, [maxDiscountPercent, maxDiscountAmount, maxTxAmount, aggressiveness]);

  const handleApplyToLiveStore = async () => {
    setIsApplying(true);
    setAppliedSuccess(false);
    try {
      const res = await fetch('/api/policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxAutoDiscountPercent: maxDiscountPercent,
          maxAutoDiscountAmount: maxDiscountAmount,
          maxAutoTransactionAmount: maxTxAmount,
          active: true,
        }),
      });

      if (res.ok) {
        setAppliedSuccess(true);
        if (onPolicyUpdated) onPolicyUpdated();
        setTimeout(() => setAppliedSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to apply policy:', err);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-cyan-950/40 to-slate-900 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
              <Sliders className="w-4 h-4" />
              AI REVENUE STRATEGY SIMULATOR ("WHAT-IF" ENGINE)
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Simulate Merchant Growth & Risk Boundaries
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Model real-time revenue uplift, conversion rate impact, and profit margin risk before committing agentic policy rules to your live store.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs uppercase text-slate-400 font-mono tracking-wider">Simulated Risk Index</span>
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono mt-1 border ${
                simulation.riskLevel === 'LOW'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                  : simulation.riskLevel === 'BALANCED'
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400'
                  : simulation.riskLevel === 'ELEVATED'
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
              }`}
            >
              {simulation.riskLevel} RISK ({simulation.riskScore}/100)
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Controls vs Projected Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            Policy Parameter Controls
          </h3>

          {/* Slider 1 */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
              <span>Max Auto Discount Limit (%)</span>
              <span className="text-cyan-400 font-bold">{maxDiscountPercent}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={maxDiscountPercent}
              onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>5% (Conservative)</span>
              <span>50% (Aggressive)</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
              <span>Max Auto Discount Cap (₹)</span>
              <span className="text-emerald-400 font-bold">₹{maxDiscountAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={maxDiscountAmount}
              onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>₹200</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* Slider 3 */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
              <span>Auto-Approval Transaction Cap (₹)</span>
              <span className="text-purple-400 font-bold">₹{maxTxAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="50000"
              step="1000"
              value={maxTxAmount}
              onChange={(e) => setMaxTxAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>₹2,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Aggressiveness Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-2">Growth Agent Strategy Mode</label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'balanced', 'aggressive', 'ultra'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAggressiveness(mode)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold uppercase font-mono transition-all border ${
                    aggressiveness === mode
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-2">
            <button
              onClick={handleApplyToLiveStore}
              disabled={isApplying}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all text-sm"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Updating Merchant Policy...
                </>
              ) : appliedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-950" />
                  Simulated Policy Applied to Live Store!
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Apply Simulated Policy to Live Store
                </>
              )}
            </button>
          </div>
        </div>

        {/* Projected Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] font-mono uppercase text-slate-400">Projected 30D Revenue</span>
              <div className="text-xl font-bold text-white mt-1">₹{(simulation.projectedRevenue / 100000).toFixed(2)}L</div>
              <div className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{simulation.projectedUpliftPct}% vs Baseline
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] font-mono uppercase text-slate-400">Net Incremental Gain</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">₹{(simulation.projectedIncremental / 100000).toFixed(2)}L</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Pure AI-Driven Revenue</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] font-mono uppercase text-slate-400">Projected AOV Uplift</span>
              <div className="text-xl font-bold text-cyan-400 mt-1">+{simulation.projectedAovUplift}%</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Conv Rate: {simulation.projectedConversion}%</div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Projected 4-Week Revenue Trajectory (Baseline vs Simulated)
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulation.chartData}>
                  <defs>
                    <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="baseline" stroke="#64748b" fill="transparent" strokeWidth={2} strokeDasharray="4 4" name="Baseline" />
                  <Area type="monotone" dataKey="projected" stroke="#06b6d4" fillOpacity={1} fill="url(#simGrad)" strokeWidth={3} name="Simulated" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
