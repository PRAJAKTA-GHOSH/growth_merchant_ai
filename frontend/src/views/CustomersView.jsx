import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  HeartHandshake, 
  Sparkles, 
  RefreshCw, 
  Search, 
  Send, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import api from '../api/client';

export default function CustomersView({ onLaunchCampaign }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCustomers();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to compute RFM customer segmentation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-paytm-cyan animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Calculating RFM Recency-Frequency vectors & Churn scores...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Customer Analytics Error</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={fetchCustomerData} className="px-4 py-2 rounded-xl bg-paytm-blue text-navy-950 font-bold text-xs">
          Retry
        </button>
      </div>
    );
  }

  const { total_customers, repeat_purchase_rate, avg_customer_lifetime_value, at_risk_count, high_value_count, segments, customers, churn_model_type, insights } = data;

  // Filter customers by selected segment and search term
  const filteredCustomers = customers.filter((c) => {
    const matchesSeg = selectedSegment === 'All' || c.rfm_segment === selectedSegment;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    return matchesSeg && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-paytm-blue/15 border border-paytm-cyan/30 text-paytm-cyan text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RFM Segmentation & Churn Risk Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Customer Intelligence & Retention
          </h1>
          <p className="text-xs text-slate-400">
            Model: {churn_model_type} • {total_customers} tracked customer profiles
          </p>
        </div>

        {/* 1-Click Launch Campaign for At-Risk */}
        <button
          onClick={() => onLaunchCampaign && onLaunchCampaign('At-Risk')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-paytm-blue to-paytm-cyan text-navy-950 font-bold text-xs hover:shadow-glow-cyan transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Launch At-Risk Win-back Campaign</span>
        </button>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Tracked Customers</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{total_customers}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Grounded from database orders</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Repeat Purchase Rate</p>
          <div className="flex items-center space-x-2 mt-1">
            <h3 className="text-2xl font-extrabold text-white font-mono">{repeat_purchase_rate}%</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
              -6.2% vs target
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Industry benchmark: &gt; 35%</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Avg Customer Lifetime Value</p>
          <h3 className="text-2xl font-extrabold text-paytm-cyan mt-1 font-mono">
            ₹{avg_customer_lifetime_value.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Projected 12-month retention CLV</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border-rose-500/30">
          <p className="text-xs text-rose-400 font-semibold uppercase flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>At-Risk Churn Cohort</span>
          </p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{at_risk_count}</h3>
          <p className="text-[11px] text-rose-300 mt-1">Lapsed 35+ days without purchase</p>
        </div>
      </div>

      {/* RFM Segment Cards Grid */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3">RFM Behavioral Cohorts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {segments.map((seg) => {
            const isSelected = selectedSegment === seg.segment;
            return (
              <div
                key={seg.segment}
                onClick={() => setSelectedSegment(isSelected ? 'All' : seg.segment)}
                className={`glass-card p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected 
                    ? 'border-paytm-cyan bg-navy-850 shadow-glow-cyan' 
                    : 'border-cyan-500/15 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{seg.segment}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-navy-800 text-paytm-cyan">
                    {seg.percentage}%
                  </span>
                </div>
                <p className="text-xl font-extrabold text-white font-mono">{seg.count} buyers</p>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                  <p>Avg Spend: <span className="text-slate-200 font-mono font-semibold">₹{seg.avg_spend.toLocaleString()}</span></p>
                  <p>Cadence: <span className="text-slate-200 font-mono font-semibold">{seg.avg_orders} orders</span></p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800">
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    {seg.retention_strategy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Customer Insights */}
      <div className="glass-card-glow p-4 rounded-2xl space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-paytm-cyan flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Algorithmic Retention Diagnoses</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          {insights.map((ins, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-navy-900/80 border border-slate-800 leading-relaxed">
              {ins}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Registry & Churn Risk Table */}
      <div className="glass-card p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Merchant Customer Directory & Churn Risk Index</h3>
            <p className="text-xs text-slate-400">
              Showing {filteredCustomers.length} of {total_customers} profiles • Filtered by: {selectedSegment}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-navy-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-paytm-cyan w-48 sm:w-60"
              />
            </div>
            {selectedSegment !== 'All' && (
              <button
                onClick={() => setSelectedSegment('All')}
                className="px-2.5 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-[11px] text-slate-400 hover:text-white"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="pb-2 font-semibold">Customer</th>
                <th className="pb-2 font-semibold">Phone</th>
                <th className="pb-2 font-semibold">Segment</th>
                <th className="pb-2 font-semibold text-right">Orders</th>
                <th className="pb-2 font-semibold text-right">Total Spend</th>
                <th className="pb-2 font-semibold">Churn Risk Score</th>
                <th className="pb-2 font-semibold">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((cust) => {
                const isHighRisk = cust.churn_risk_level === 'High';
                const isMedRisk = cust.churn_risk_level === 'Medium';

                return (
                  <tr key={cust.id} className="hover:bg-navy-900/40 transition-colors">
                    <td className="py-2.5 font-medium text-white">{cust.name}</td>
                    <td className="py-2.5 font-mono text-slate-400">{cust.phone}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        cust.rfm_segment === 'High-Value' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        (cust.rfm_segment === 'Loyal' ? 'bg-paytm-blue/20 text-cyan-300' :
                        (cust.rfm_segment === 'At-Risk' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'))
                      }`}>
                        {cust.rfm_segment}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-300">{cust.total_orders}</td>
                    <td className="py-2.5 text-right font-mono text-white font-semibold">
                      ₹{cust.total_spend.toLocaleString()}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 bg-navy-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isHighRisk ? 'bg-rose-500' : (isMedRisk ? 'bg-amber-400' : 'bg-emerald-400')
                            }`}
                            style={{ width: `${Math.min(100, cust.churn_risk_score * 100)}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${
                          isHighRisk ? 'text-rose-400' : (isMedRisk ? 'text-amber-400' : 'text-emerald-400')
                        }`}>
                          {cust.churn_risk_score}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="text-[11px] text-slate-300 font-medium">
                        {cust.recommended_action}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
