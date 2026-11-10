import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Award
} from 'lucide-react';
import api from '../api/client';

export default function HealthView({ onTakeAction }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealthScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getHealthScore();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to compute Merchant Health Score.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthScore();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-paytm-cyan animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Synthesizing 5-pillar fintech health index...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Health Score Error</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={fetchHealthScore} className="px-4 py-2 rounded-xl bg-paytm-blue text-navy-950 font-bold text-xs">
          Retry
        </button>
      </div>
    );
  }

  const {
    overall_score,
    grade,
    headline,
    pillars,
    positive_factors,
    negative_drags,
    top_actions_to_improve,
    benchmark_comparison
  } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-paytm-blue/15 border border-paytm-cyan/30 text-paytm-cyan text-[11px] font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fintech Merchant Credit & Operational Index</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Merchant Health Score
        </h1>
        <p className="text-xs text-slate-400">
          A weighted 100-point composite evaluating growth, liquidity, retention, and inventory risk.
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="glass-card-glow p-6 sm:p-8 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Radial Score Gauge (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer Circular SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#0B132B"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeDasharray={`${(overall_score / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00BAF2" />
                  <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Center Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
                {overall_score}
              </span>
              <span className="text-[11px] uppercase font-bold text-slate-400 mt-0.5">out of 100</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-paytm-cyan text-navy-950 mt-1 font-mono">
                Grade {grade}
              </span>
            </div>
          </div>

          <p className="text-xs text-paytm-cyan font-semibold mt-3">
            {benchmark_comparison}
          </p>
        </div>

        {/* Narrative & High Level Summary (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <Award className="w-4 h-4" />
            <span>Paytm Partner Verified Diagnostic</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {headline}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Your score is calculated dynamically across 5 weighted pillars. Higher scores unlock lower merchant settlement holdbacks, preferential soundbox hardware upgrades, and automated credit line recommendations.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase">Operational Status</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">High Stability</p>
            </div>
            <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase">Settlement Tier</p>
              <p className="text-sm font-bold text-white mt-0.5">Instant Soundbox T+0</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Weighted Pillars Breakdown */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white">5-Pillar Score Composition</h3>

        <div className="space-y-4">
          {pillars.map((pillar) => {
            const isExcellent = pillar.status === 'EXCELLENT';
            const isGood = pillar.status === 'GOOD';
            const isNeedsAttn = pillar.status === 'NEEDS_ATTENTION';

            return (
              <div key={pillar.name} className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{pillar.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({pillar.weight * 100}% weight)</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-slate-400">{pillar.key_metric}</span>
                    <span className="font-mono font-bold text-white text-sm">{pillar.score}/100</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isExcellent ? 'bg-emerald-500/20 text-emerald-400' :
                      (isGood ? 'bg-paytm-blue/20 text-cyan-300' :
                      (isNeedsAttn ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'))
                    }`}>
                      {pillar.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      pillar.score >= 80 ? 'bg-gradient-to-r from-paytm-blue to-paytm-cyan' :
                      (pillar.score >= 65 ? 'bg-amber-400' : 'bg-rose-500')
                    }`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drivers: Positive Factors vs Negative Drags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Factors */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Positive Score Contributors</span>
          </h4>

          <ul className="space-y-2 text-xs text-slate-300">
            {positive_factors.map((factor, i) => (
              <li key={i} className="flex items-start space-x-2 p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <span className="leading-relaxed">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Negative Drags */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Factors Reducing Your Score</span>
          </h4>

          <ul className="space-y-2 text-xs text-slate-300">
            {negative_drags.map((drag, i) => (
              <li key={i} className="flex items-start space-x-2 p-2.5 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-rose-400 mt-0.5 font-bold">⚠</span>
                <span className="leading-relaxed">{drag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top Actions to Improve */}
      <div className="glass-card-glow p-5 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-paytm-cyan flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>Recommended Actions to Reach Grade A+ (&gt; 90 Points)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {top_actions_to_improve.map((act, i) => (
            <div key={i} className="p-3 rounded-xl bg-navy-900 border border-slate-800 flex flex-col justify-between text-xs space-y-2">
              <span className="text-slate-200 leading-relaxed">{act}</span>
              <button
                onClick={() => onTakeAction && onTakeAction()}
                className="text-[11px] text-paytm-cyan hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Take Action</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
