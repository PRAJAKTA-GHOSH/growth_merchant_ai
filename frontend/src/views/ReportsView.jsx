import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  Building2, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import api from '../api/client';

export default function ReportsView() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getExecutiveReport();
      setReport(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate executive merchant report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-paytm-cyan animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Compiling Executive Merchant Growth Dossier...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Report Generation Error</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={fetchReport} className="px-4 py-2 rounded-xl bg-paytm-blue text-navy-950 font-bold text-xs">
          Retry
        </button>
      </div>
    );
  }

  const { merchant, health_score, kpis, top_products, customer_segments, inventory_critical_items, strategic_recommendations, generated_at } = report;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Business Dossier</h1>
          <p className="text-xs text-slate-400">Formal printable report prepared for Paytm merchant review and banking credit evaluation</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-900 border border-slate-700 hover:border-paytm-cyan text-xs text-white transition-all shadow"
          >
            <Printer className="w-4 h-4 text-paytm-cyan" />
            <span>Print / Save as PDF</span>
          </button>

          <a
            href={api.getCsvDownloadUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-paytm-blue hover:bg-paytm-cyan text-navy-950 font-bold text-xs transition-all shadow-glow-cyan"
          >
            <Download className="w-4 h-4" />
            <span>Export Raw CSV</span>
          </a>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl space-y-8 bg-navy-950/90 text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Header */}
        <div className="border-b border-slate-800 print:border-gray-300 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold text-white print:text-black">GrowZen AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-paytm-blue/20 text-paytm-cyan border border-paytm-cyan/30 print:border-blue-600 print:text-blue-800">
                Paytm Intelligence Partner
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white print:text-black mt-1">{merchant.name}</h2>
            <p className="text-xs text-slate-400 print:text-gray-600">
              {merchant.category} • {merchant.location} • Operating Hours: {merchant.operating_hours}
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 print:text-gray-500 font-mono">
            <p>Generated: {new Date(generated_at).toLocaleString('en-IN')}</p>
            <p className="text-paytm-cyan font-bold print:text-blue-700 mt-1">
              Health Index: {health_score.overall_score}/100 (Grade {health_score.grade})
            </p>
          </div>
        </div>

        {/* Financial KPI Summary Matrix */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-paytm-cyan print:text-blue-800 mb-3">
            1. Core Financial Performance (Trailing 30 Days)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 print:border-gray-200 print:bg-gray-50">
              <p className="text-[10px] text-slate-400 print:text-gray-500 uppercase">Gross Revenue</p>
              <p className="text-lg font-extrabold text-white print:text-black font-mono mt-0.5">{kpis.total_revenue.formatted_value}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">{kpis.total_revenue.change_pct}% growth</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 print:border-gray-200 print:bg-gray-50">
              <p className="text-[10px] text-slate-400 print:text-gray-500 uppercase">Estimated Net Profit</p>
              <p className="text-lg font-extrabold text-white print:text-black font-mono mt-0.5">{kpis.net_profit.formatted_value}</p>
              <p className="text-[10px] text-slate-400 print:text-gray-500 mt-0.5">After COGS & Overhead</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 print:border-gray-200 print:bg-gray-50">
              <p className="text-[10px] text-slate-400 print:text-gray-500 uppercase">Avg Order Value (AOV)</p>
              <p className="text-lg font-extrabold text-white print:text-black font-mono mt-0.5">{kpis.average_order_value.formatted_value}</p>
              <p className="text-[10px] text-slate-400 print:text-gray-500 mt-0.5">Per successful checkout</p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 print:border-gray-200 print:bg-gray-50">
              <p className="text-[10px] text-slate-400 print:text-gray-500 uppercase">Payment Success Rate</p>
              <p className="text-lg font-extrabold text-paytm-cyan print:text-blue-700 font-mono mt-0.5">{kpis.payment_success_rate.formatted_value}</p>
              <p className="text-[10px] text-slate-400 print:text-gray-500 mt-0.5">Paytm Soundbox & UPI</p>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-paytm-cyan print:text-blue-800 mb-3">
            2. Product Catalogue Performance
          </h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 print:border-gray-300 pb-2 text-slate-400 print:text-gray-600">
                <th className="pb-2">Product Name</th>
                <th className="pb-2">Category</th>
                <th className="pb-2 text-right">Units Sold</th>
                <th className="pb-2 text-right">Revenue</th>
                <th className="pb-2 text-right">Gross Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
              {top_products.map((p) => (
                <tr key={p.product_id} className="py-2">
                  <td className="py-2 font-medium text-white print:text-black">{p.name}</td>
                  <td className="py-2 text-slate-400 print:text-gray-600">{p.category}</td>
                  <td className="py-2 text-right font-mono text-slate-300 print:text-black">{p.units_sold}</td>
                  <td className="py-2 text-right font-mono text-white print:text-black font-semibold">₹{p.revenue.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono text-emerald-400 print:text-emerald-700">₹{p.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer Cohort Distribution */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-paytm-cyan print:text-blue-800 mb-3">
            3. Customer RFM Distribution & Churn Risk
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {customer_segments.map((s) => (
              <div key={s.segment} className="p-3 rounded-xl bg-navy-900 border border-slate-800 print:border-gray-200 print:bg-gray-50 text-xs">
                <p className="font-bold text-white print:text-black">{s.segment}</p>
                <p className="font-mono text-paytm-cyan print:text-blue-700 font-extrabold mt-1">{s.count} patrons ({s.percentage}%)</p>
                <p className="text-[10px] text-slate-400 print:text-gray-500 mt-0.5">Avg: ₹{s.avg_spend.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Next Best Actions */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-paytm-cyan print:text-blue-800 mb-3">
            4. Prioritized Strategic Next Best Actions
          </h3>
          <div className="space-y-3">
            {strategic_recommendations.map((rec, i) => (
              <div key={rec.id} className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 print:border-gray-200 print:bg-gray-50 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white print:text-black">
                    {i + 1}. {rec.problem}
                  </span>
                  <span className="font-mono text-emerald-400 print:text-emerald-700 font-bold">{rec.impact_estimate}</span>
                </div>
                <p className="text-slate-300 print:text-gray-700 leading-relaxed">{rec.suggested_action}</p>
                <p className="text-[11px] text-slate-500 print:text-gray-500 font-mono">Metric: {rec.metric}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Sign-off */}
        <div className="pt-6 border-t border-slate-800 print:border-gray-300 flex items-center justify-between text-xs text-slate-500 print:text-gray-500">
          <span>GrowZen AI • Automated Paytm Merchant Growth Platform</span>
          <span>Verified Merchant Copy</span>
        </div>
      </div>
    </div>
  );
}
