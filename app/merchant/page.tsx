'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  CreditCard,
  Sliders,
  ShieldAlert,
  ScrollText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Lock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ApprovalGateModal } from '@/components/ApprovalGateModal';
import { PolicyRules, AuditEventRecord, ApprovalRequestRecord } from '@/types';

export default function MerchantConsole() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'growth' | 'catalog' | 'orders' | 'policies' | 'approvals' | 'audit'>('dashboard');

  // State Data
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [policy, setPolicy] = useState<PolicyRules | null>(null);
  const [approvals, setApprovals] = useState<ApprovalRequestRecord[]>([]);
  const [auditEvents, setAuditEventRecords] = useState<AuditEventRecord[]>([]);
  const [growthInsights, setGrowthInsights] = useState<any>(null);

  // Filters & Modal
  const [auditSearch, setAuditSearch] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequestRecord | null>(null);
  const [isPolicySaving, setIsPolicySaving] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, productsRes, ordersRes, policyRes, approvalsRes, auditRes, growthRes] = await Promise.all([
        fetch('/api/analytics').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/policy').then((r) => r.json()),
        fetch('/api/approvals').then((r) => r.json()),
        fetch('/api/audit').then((r) => r.json()),
        fetch('/api/growth/insights').then((r) => r.json()),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (productsRes.success) setProducts(productsRes.products);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (policyRes.success) setPolicy(policyRes.policy);
      if (approvalsRes.success) setApprovals(approvalsRes.requests);
      if (auditRes.success) setAuditEventRecords(auditRes.events);
      if (growthRes.success) setGrowthInsights(growthRes);
    } catch (e) {
      console.error('Failed to load merchant console data:', e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;
    setIsPolicySaving(true);
    try {
      const res = await fetch('/api/policy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });
      const data = await res.json();
      if (data.success) {
        setPolicy(data.policy);
        alert('✅ Merchant Policy updated successfully.');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to update policy');
    } finally {
      setIsPolicySaving(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'growth', label: 'Growth Agent', icon: TrendingUp, badge: 'AI Engine' },
    { id: 'catalog', label: 'Catalog & AI Metadata', icon: Package },
    { id: 'orders', label: 'Orders & Payments', icon: CreditCard },
    { id: 'policies', label: 'Agent Policies', icon: Sliders },
    { id: 'approvals', label: 'Approval Requests Gate', icon: ShieldAlert, count: approvals.length },
    { id: 'audit', label: 'Audit Trail', icon: ScrollText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Console Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="h-5 w-5 text-blue-400" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">Merchant Control Console</h1>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Manage merchant policy limits, inspect AI Growth Agent campaigns, process gated approval requests, and view real-time audit logs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
                {t.count !== undefined && t.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && analytics && (
        <div className="space-y-8">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
              <span className="text-xs text-slate-400 font-mono">Total Store Revenue</span>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                ₹{analytics.totalRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 font-sans mt-2 block">Across {analytics.totalOrders} Captured Orders</span>
            </div>

            <div className="p-5 rounded-2xl border border-blue-900/80 bg-blue-950/30 shadow-lg">
              <span className="text-xs text-blue-300 font-mono flex items-center justify-between">
                <span>AI-Assisted Revenue</span>
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              </span>
              <div className="text-2xl font-extrabold text-blue-400 font-mono mt-1">
                ₹{analytics.aiAssistedRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-blue-300/80 font-sans mt-2 block">
                ₹{analytics.incrementalRevenue.toLocaleString('en-IN')} Incremental Upsell Revenue
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-900/80 bg-emerald-950/30 shadow-lg">
              <span className="text-xs text-emerald-300 font-mono">Average Order Value (AOV)</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                ₹{analytics.aiAov.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-300/80 font-sans mt-2 block flex items-center gap-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +{analytics.aovUpliftPercent}% AOV Uplift vs Non-AI
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-900/80 bg-indigo-950/30 shadow-lg">
              <span className="text-xs text-indigo-300 font-mono">Growth Agent Upsell Conv.</span>
              <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">
                {analytics.upsellConversionRate}%
              </div>
              <span className="text-[11px] text-indigo-300/80 font-sans mt-2 block">High-Affinity Co-Purchase Rate</span>
            </div>
          </div>

          {/* Revenue Chart Section */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue & AI Uplift Performance</h3>
                <p className="text-xs text-slate-400">Comparing total captured sales vs AI Agent influenced order volume.</p>
              </div>
              <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800">
                Last 10 Time Periods
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.revenueTrend}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" name="Total Revenue" />
                  <Area type="monotone" dataKey="AIAssisted" stroke="#10b981" fillOpacity={1} fill="url(#colorAI)" name="AI-Assisted Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Revenue Generating Products</h3>
            <div className="space-y-3">
              {analytics.topProducts.map((tp: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
                  <span className="text-xs font-semibold text-slate-200">{tp.name}</span>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">{tp.count} units sold</span>
                    <span className="font-bold text-blue-400">₹{tp.revenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MERCHANT GROWTH AGENT */}
      {activeTab === 'growth' && growthInsights && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-indigo-900/60 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Autonomous Merchant Growth Agent</h2>
            </div>
            <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed">
              The Growth Agent continuously monitors customer purchase affinity, segment behaviors, and product relationships across {growthInsights.metrics.totalOrders} historical orders to discover high-margin upsell opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {growthInsights.opportunities.map((opp: any) => (
              <div key={opp.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-lg space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                    {opp.objective}
                  </span>
                  <h3 className="text-sm font-bold text-white">{opp.title}</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{opp.analysis}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Segment</span>
                    <span className="text-slate-300">{opp.targetSegment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Suggested Upsell</span>
                    <span className="text-blue-400 font-bold">{opp.suggestedProduct}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expected AOV Impact</span>
                    <span className="text-emerald-400 font-bold">+₹{opp.expectedAovImpact}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Policy Status</span>
                    {opp.requiresApproval ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                        REQUIRES APPROVAL
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        WITHIN LIMITS
                      </span>
                    )}
                  </div>
                </div>

                {opp.requiresApproval && (
                  <button
                    onClick={() => {
                      fetch('/api/policy/validate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          actionType: 'PROMOTIONAL_CAMPAIGN_DISCOUNT',
                          amount: 15000,
                          itemPrice: 124999,
                          agentType: 'GROWTH_AGENT',
                          reason: opp.policyStatus,
                        }),
                      }).then(() => {
                        fetchDashboardData();
                        setActiveTab('approvals');
                      });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md"
                  >
                    Trigger Policy Gate Evaluation
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATALOG & AI METADATA */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Agent-Readable Merchant Catalog ({products.length} Items)
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Inventory</th>
                    <th className="p-4">AI Co-Purchase Affinities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="p-4 font-semibold text-white">
                        {p.name}
                        <div className="text-[11px] text-slate-500 font-mono font-normal">ID: {p.id}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-blue-400">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="p-4 font-mono">{p.inventory} units</td>
                      <td className="p-4 font-mono text-[11px]">
                        {p.frequentlyBoughtTogether?.length > 0 ? (
                          <div className="space-y-1">
                            {p.frequentlyBoughtTogether.map((f: any, idx: number) => (
                              <div key={idx} className="text-emerald-400 flex items-center gap-1">
                                <span>• {f.productId}</span>
                                <span className="text-slate-500">({Math.round(f.score * 100)}% rate)</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500">General Catalog Item</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS & PAYMENTS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Transactions & Razorpay Test Mode Payments ({orders.length} Records)
          </h3>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">AI Assisted</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Razorpay Order ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
                  {orders.slice(0, 30).map((o) => (
                    <tr key={o.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-200">{o.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{o.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{o.customerEmail}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        {o.isAiAssisted ? (
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                            YES (Agent)
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">Direct</span>
                        )}
                      </td>
                      <td className="p-4 font-mono">{o.paymentMethod || 'RAZORPAY_TEST_MODE'}</td>
                      <td className="p-4">
                        {o.status === 'CAPTURED' ? (
                          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                            CAPTURED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono font-bold">
                            {o.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">{o.razorpayOrderId || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AGENT POLICIES */}
      {activeTab === 'policies' && policy && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Sliders className="h-5 w-5 text-blue-400" />
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">Merchant Agent Policy Configuration</h2>
                <p className="text-xs text-slate-400">
                  Explicit boundaries controlling AI buyer discounts, max automatic transaction thresholds, and campaign caps.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePolicy} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Max Automatic Discount (₹)</label>
                  <input
                    type="number"
                    value={policy.maxAutoDiscountAmount}
                    onChange={(e) => setPolicy({ ...policy, maxAutoDiscountAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono text-white"
                  />
                  <p className="text-[10px] text-slate-500">Discounts above this amount require merchant approval.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Max Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={policy.maxAutoDiscountPercent}
                    onChange={(e) => setPolicy({ ...policy, maxAutoDiscountPercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono text-white"
                  />
                  <p className="text-[10px] text-slate-500">Maximum percentage reduction allowed automatically.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Max Auto Transaction Limit (₹)</label>
                  <input
                    type="number"
                    value={policy.maxAutoTransactionAmount}
                    onChange={(e) => setPolicy({ ...policy, maxAutoTransactionAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500">Transactions exceeding this limit trigger Approval Gate.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Max Campaign Budget (₹)</label>
                  <input
                    type="number"
                    value={policy.maxCampaignBudget}
                    onChange={(e) => setPolicy({ ...policy, maxCampaignBudget: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono text-white"
                  />
                  <p className="text-[10px] text-slate-500">Total budget cap for automated Growth campaigns.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPolicySaving}
                className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
              >
                {isPolicySaving ? 'Saving Policies...' : 'Save Merchant Policy Rules'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: APPROVAL REQUESTS GATE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pending Financial Approval Requests ({approvals.length})
            </h3>
          </div>

          {approvals.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500 font-mono text-xs">
              No pending out-of-bounds agent approval requests. All agent financial actions are within policy limits.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvals.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl border border-rose-900/60 bg-slate-900 shadow-xl space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                        REQUIRES APPROVAL
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">{req.actionType}</h4>
                    </div>
                    <span className="text-base font-extrabold text-rose-400 font-mono">
                      ₹{req.requestedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans">{req.reason}</p>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Policy Limit: ₹{req.policyLimit.toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => setSelectedApproval(req)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all"
                    >
                      Review & Decide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Immutable Agent Audit Log Stream ({auditEvents.length} Events)
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => {
                  setAuditSearch(e.target.value);
                  fetch(`/api/audit?search=${e.target.value}`)
                    .then((r) => r.json())
                    .then((d) => d.success && setAuditEventRecords(d.events));
                }}
                placeholder="Search audit trail..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor / Agent</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Reason & Policy Rationale</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {auditEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="p-4 text-slate-500 text-[11px]">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-4 font-bold text-blue-400">{evt.actor}</td>
                      <td className="p-4 font-bold text-slate-200">{evt.action}</td>
                      <td className="p-4 font-sans text-xs text-slate-300 max-w-md">
                        {evt.reason}
                        {evt.policy && (
                          <div className="text-[10px] text-amber-400 font-mono mt-0.5">Policy: {evt.policy}</div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        {evt.amount ? `₹${evt.amount.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-4">
                        {evt.result === 'SUCCESS' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                            SUCCESS
                          </span>
                        ) : evt.result === 'BLOCKED' ? (
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold">
                            BLOCKED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            {evt.result}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Approval Gate Review Modal */}
      <ApprovalGateModal
        isOpen={Boolean(selectedApproval)}
        request={selectedApproval}
        onClose={() => setSelectedApproval(null)}
        onDecided={fetchDashboardData}
      />

    </div>
  );
}
