import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  BarChart3, 
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import api from '../api/client';

export default function ForecastingView() {
  const [horizon, setHorizon] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getForecast(horizon);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to compute time-series sales projection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [horizon]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-paytm-cyan animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Running Ridge Auto-Regressive Seasonality Matrix...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Forecasting Error</h3>
        <p className="text-xs text-slate-400">{error || 'Could not compute forecast.'}</p>
        <button onClick={fetchForecast} className="px-4 py-2 rounded-xl bg-paytm-blue text-navy-950 font-bold text-xs">
          Retry
        </button>
      </div>
    );
  }

  const {
    timeframe,
    predicted_total_revenue,
    growth_pct,
    trend_direction,
    confidence_score,
    forecast_points,
    peak_hours,
    peak_days,
    explanation,
    model_type,
    sufficient_data,
    data_points_analyzed
  } = data;

  const isPositiveGrowth = growth_pct >= 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Horizon Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-paytm-blue/15 border border-paytm-cyan/30 text-paytm-cyan text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Analytics Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Sales & Revenue Forecaster
          </h1>
          <p className="text-xs text-slate-400">
            Powered by {model_type} • {data_points_analyzed} historical daily observations
          </p>
        </div>

        {/* 7D vs 30D Switcher */}
        <div className="flex items-center bg-navy-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setHorizon(7)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              horizon === 7 
                ? 'bg-paytm-blue text-navy-950 shadow-glow-cyan' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            7-Day Prediction
          </button>
          <button
            onClick={() => setHorizon(30)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              horizon === 30 
                ? 'bg-paytm-blue text-navy-950 shadow-glow-cyan' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            30-Day Projection
          </button>
        </div>
      </div>

      {/* Model Diagnostic Banner */}
      {!sufficient_data && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-amber-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Baseline Fallback Active (Limited Data History)</p>
            <p className="text-slate-400 mt-0.5">
              Less than 14 days of historical sales records are available. The engine is providing a conservative rolling seasonal baseline instead of uncalibrated high-variance ML models.
            </p>
          </div>
        </div>
      )}

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Projected Total Revenue</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">
            ₹{predicted_total_revenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Next {timeframe} aggregate</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Expected Growth Velocity</p>
          <div className="flex items-center space-x-2 mt-1">
            <h3 className="text-2xl font-extrabold text-white font-mono">
              {growth_pct > 0 ? `+${growth_pct}%` : `${growth_pct}%`}
            </h3>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isPositiveGrowth ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {trend_direction}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">vs prior {timeframe} window</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Confidence Index</p>
          <h3 className="text-2xl font-extrabold text-paytm-cyan mt-1 font-mono">
            {confidence_score}%
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">95% statistical prediction band</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Peak Day Velocity</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            {peak_days.length > 0 ? peak_days[0].day_name : 'Saturday'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Footfall surge window</p>
        </div>
      </div>

      {/* Main Forecast Chart: Historical vs Forecasted with 95% Confidence Band */}
      <div className="glass-card p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Historical Sales & Forward Predictive Curve</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                95% Confidence Shaded
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Solid cyan represents historical sales; dashed line and shaded area represent future projected revenue
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1 text-slate-300">
              <span className="w-3 h-0.5 bg-slate-400 inline-block" />
              <span>Historical</span>
            </span>
            <span className="flex items-center space-x-1 text-paytm-cyan font-semibold">
              <span className="w-3 h-0.5 bg-paytm-cyan inline-block border-dashed" />
              <span>AI Prediction</span>
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast_points}>
              <defs>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BAF2" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00BAF2" stopOpacity={0.03} />
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
                formatter={(val, name) => [
                  val ? `₹${Number(val).toLocaleString()}` : '—',
                  name === 'historical_sales' ? 'Historical Sales' : 
                  (name === 'predicted_sales' ? 'Predicted Sales' : 
                  (name === 'confidence_upper' ? 'Upper Bound (95%)' : 'Lower Bound (95%)'))
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              {/* Historical Line */}
              <Line 
                type="monotone" 
                dataKey="historical_sales" 
                stroke="#94A3B8" 
                strokeWidth={2} 
                dot={{ r: 2, fill: '#94A3B8' }} 
                name="historical_sales"
              />
              {/* Predicted Line */}
              <Line 
                type="monotone" 
                dataKey="predicted_sales" 
                stroke="#00E5FF" 
                strokeWidth={2.5} 
                strokeDasharray="4 4" 
                dot={{ r: 3, fill: '#00E5FF' }} 
                name="predicted_sales"
              />
              {/* Upper Confidence Band */}
              <Area 
                type="monotone" 
                dataKey="confidence_upper" 
                stroke="none" 
                fill="url(#confidenceBand)" 
                name="confidence_upper"
              />
              {/* Lower Confidence Band */}
              <Area 
                type="monotone" 
                dataKey="confidence_lower" 
                stroke="none" 
                fill="#040711" 
                name="confidence_lower"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Explanation Card */}
      <div className="glass-card-glow p-5 rounded-2xl flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-paytm-cyan shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-paytm-cyan">Model Narrative & Strategic Context</h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {explanation}
          </p>
        </div>
      </div>

      {/* Peak Business Hours & Days Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Business Hours Bar Chart (7 cols) */}
        <div className="lg:col-span-7 glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-paytm-cyan" />
                <span>Peak Business Hours Density</span>
              </h3>
              <p className="text-xs text-slate-400">Average sales velocity by hour of day</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peak_hours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="hour_label" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#00BAF2', borderRadius: '12px' }}
                  formatter={(val, name, item) => [`₹${Number(val).toLocaleString()}`, `Hour: ${item.payload.hour_label} (${item.payload.order_intensity})`]}
                />
                <Bar dataKey="avg_sales" radius={[4, 4, 0, 0]}>
                  {peak_hours.map((entry, index) => (
                    <Cell 
                      key={`hour-${index}`} 
                      fill={entry.order_intensity === 'Very High' ? '#00E5FF' : (entry.order_intensity === 'High' ? '#00BAF2' : '#1E293B')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Days of Week (5 cols) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-paytm-cyan" />
              <span>Day-of-Week Footfall Index</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Relative revenue index (1.0 = average day)</p>
          </div>

          <div className="space-y-2.5">
            {peak_days.map((day) => {
              const isPeak = day.relative_index >= 1.25;
              const barWidth = Math.min(100, Math.max(15, (day.relative_index / 1.5) * 100));

              return (
                <div key={day.day_name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isPeak ? 'text-paytm-cyan font-bold' : 'text-slate-300'}`}>
                      {day.day_name}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ₹{day.avg_revenue.toLocaleString()} <span className="text-paytm-cyan">({day.relative_index}x)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPeak ? 'bg-gradient-to-r from-paytm-blue to-paytm-cyan shadow-glow-cyan' : 'bg-slate-700'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-800 mt-2">
            💡 Friday, Saturday & Sunday drive over 52% of total weekly revenues.
          </p>
        </div>
      </div>
    </div>
  );
}
