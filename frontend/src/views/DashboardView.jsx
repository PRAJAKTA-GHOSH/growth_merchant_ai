import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ShoppingBag, 
  Users, 
  UserCheck, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  AlertTriangle,
  RefreshCw,
  PieChart as PieIcon,
  BarChart2,
  Calendar
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import KPICard from '../components/KPICard';
import api from '../api/client';

export default function DashboardView({ activeDays, setActiveDays, onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard({ days: activeDays });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeDays]);

  const COLORS = ['#00BAF2', '#00E5FF', '#38BDF8', '#818CF8', '#A78BFA', '#F472B6'];
  const STATUS_COLORS = {
    SUCCESS: '#10B981',
    FAILED: '#EF4444',
    REFUNDED: '#F59E0B'
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-paytm-cyan animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Aggregating live Paytm financial records...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Dashboard Load Error</h3>
        <p className="text-xs text-slate-400">{error || 'No data received.'}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl bg-paytm-blue text-navy-950 font-bold text-xs"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis, revenue_trend, daily_revenue, payment_status_breakdown, category_distribution, top_selling_products, expense_breakdown } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Financial & Operational Overview
          </h1>
          <p className="text-xs text-slate-400">
            Real-time analytics for the selected {data.date_range_label} window
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Date Range Buttons */}
          <div className="flex items-center bg-navy-900 border border-slate-800 rounded-xl p-1 text-xs">
            {[7, 30, 90, 180].map((d) => (
              <button
                key={d}
                onClick={() => setActiveDays(d)}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeDays === d
                    ? 'bg-paytm-blue text-navy-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <a
            href={api.getCsvDownloadUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-700 hover:border-paytm-cyan text-xs text-slate-300 hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5 text-paytm-cyan" />
            <span className="hidden sm:inline">Export CSV</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={kpis.total_revenue.label}
          value={kpis.total_revenue.formatted_value}
          changePct={kpis.total_revenue.change_pct}
          isPositive={kpis.total_revenue.is_positive}
          previousValue={`₹${kpis.total_revenue.previous_value.toLocaleString()}`}
          icon={DollarSign}
        />
        <KPICard
          title={kpis.net_profit.label}
          value={kpis.net_profit.formatted_value}
          changePct={kpis.net_profit.change_pct}
          isPositive={kpis.net_profit.is_positive}
          previousValue={`₹${kpis.net_profit.previous_value.toLocaleString()}`}
          icon={TrendingUp}
        />
        <KPICard
          title={kpis.total_transactions.label}
          value={kpis.total_transactions.formatted_value}
          changePct={kpis.total_transactions.change_pct}
          isPositive={kpis.total_transactions.is_positive}
          previousValue={`${kpis.total_transactions.previous_value.toLocaleString()} txs`}
          icon={CreditCard}
        />
        <KPICard
          title={kpis.average_order_value.label}
          value={kpis.average_order_value.formatted_value}
          changePct={kpis.average_order_value.change_pct}
          isPositive={kpis.average_order_value.is_positive}
          previousValue={`₹${kpis.average_order_value.previous_value.toLocaleString()}`}
          icon={ShoppingBag}
        />
      </div>

      {/* Secondary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="New vs Returning Patrons"
          value={`${kpis.new_customers.formatted_value} / ${kpis.returning_customers.formatted_value}`}
          changePct={kpis.returning_customers.change_pct}
          isPositive={kpis.returning_customers.is_positive}
          subtitle="New / Returning breakdown"
          icon={Users}
        />
        <KPICard
          title="Revenue Growth Rate"
          value={kpis.revenue_growth_rate.formatted_value}
          changePct={kpis.revenue_growth_rate.change_pct}
          isPositive={kpis.revenue_growth_rate.is_positive}
          subtitle="Period-over-period delta"
          icon={Percent}
        />
        <KPICard
          title="Paytm Payment Success"
          value={kpis.payment_success_rate.formatted_value}
          changePct={kpis.payment_success_rate.change_pct}
          isPositive={kpis.payment_success_rate.is_positive}
          subtitle="Soundbox & UPI Gateway"
          icon={UserCheck}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend vs Previous Period (8 cols) */}
        <div className="lg:col-span-8 glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Revenue Trajectory & Period Comparison</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-paytm-cyan/20 text-paytm-cyan font-mono">
                  Daily Actuals
                </span>
              </h3>
              <p className="text-xs text-slate-400">Comparing current {activeDays} days against prior matching window</p>
            </div>
            <button
              onClick={() => onNavigate('forecasting')}
              className="text-xs text-paytm-cyan hover:underline flex items-center font-medium"
            >
              <span>View AI Forecast</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue_trend}>
                <defs>
                  <linearGradient id="currentRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickFormatter={(val) => val.slice(5)} 
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#00BAF2', borderRadius: '12px' }}
                  formatter={(value, name) => [`₹${Number(value).toLocaleString()}`, name === 'current_period' ? 'Current Period' : 'Prior Period']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="current_period" 
                  stroke="#00E5FF" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#currentRevGrad)" 
                  name="current_period" 
                />
                <Line 
                  type="monotone" 
                  dataKey="previous_period" 
                  stroke="#64748B" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4" 
                  dot={false} 
                  name="previous_period" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Doughnut Chart (4 cols) */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Transaction Health</h3>
            <p className="text-xs text-slate-400 mb-4">Success vs Failed vs Refunded</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={payment_status_breakdown}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {payment_status_breakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#00BAF2', borderRadius: '12px' }}
                  formatter={(val, name, item) => [`${val} txs (${item.payload.percentage}%)`, item.payload.status]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Details */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {payment_status_breakdown.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: STATUS_COLORS[item.status] || '#94A3B8' }}
                  />
                  <span>{item.status}</span>
                </span>
                <span className="font-mono text-white font-semibold">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Top Products & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top-Selling Products Table (7 cols) */}
        <div className="lg:col-span-7 glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Top Revenue-Generating Products</h3>
              <p className="text-xs text-slate-400">Ranked by gross sales volume</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs text-paytm-cyan hover:underline font-medium"
            >
              Inventory Health →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 pb-2">
                  <th className="pb-2 font-semibold">Product</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold text-right">Units</th>
                  <th className="pb-2 font-semibold text-right">Revenue</th>
                  <th className="pb-2 font-semibold text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {top_selling_products.map((prod) => (
                  <tr key={prod.product_id} className="hover:bg-navy-900/40 transition-colors">
                    <td className="py-2.5 font-medium text-white max-w-[180px] truncate">{prod.name}</td>
                    <td className="py-2.5 text-slate-400">{prod.category}</td>
                    <td className="py-2.5 text-right font-mono text-slate-300">{prod.units_sold}</td>
                    <td className="py-2.5 text-right font-mono text-paytm-cyan font-semibold">
                      ₹{prod.revenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        prod.current_stock <= 10 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {prod.current_stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Category Distribution (5 cols) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Sales by Category</h3>
            <p className="text-xs text-slate-400 mb-2">Revenue contribution share</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={category_distribution}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  labelLine={false}
                >
                  {category_distribution.map((entry, index) => (
                    <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#00BAF2', borderRadius: '12px' }}
                  formatter={(val, name, item) => [`₹${Number(val).toLocaleString()} (${item.payload.percentage}%)`, item.payload.category]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            {category_distribution.map((cat, idx) => (
              <div key={cat.category} className="flex items-center space-x-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-300 truncate">{cat.category}:</span>
                <span className="font-mono text-white font-semibold">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Breakdown Section */}
      <div className="glass-card p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-white mb-1">Operational Cost Distribution</h3>
        <p className="text-xs text-slate-400 mb-4">Rent, salaries, inventory purchase, and marketing</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {expense_breakdown.map((exp) => (
            <div key={exp.category} className="p-3 rounded-xl bg-navy-900 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">{exp.category}</p>
              <p className="text-base font-bold text-white font-mono mt-1">₹{exp.amount.toLocaleString()}</p>
              <p className="text-[10px] text-paytm-cyan mt-0.5">{exp.percentage}% of overhead</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
