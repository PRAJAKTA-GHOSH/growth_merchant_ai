import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw,
  Check,
  X,
  Target
} from 'lucide-react';
import api from '../api/client';

export default function RecommendationsView({ onExecuteAction }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRecommendations();
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Next Best Actions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateRecommendation(id, newStatus);
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update action status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-paytm-cyan animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Evaluating cross-domain business metrics for high-impact actions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Recommendations Error</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={fetchRecommendations} className="px-4 py-2 rounded-xl bg-paytm-blue text-navy-950 font-bold text-xs">
          Retry
        </button>
      </div>
    );
  }

  const activeRecs = recommendations.filter((r) => r.status !== 'DISMISSED');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-paytm-blue/15 border border-paytm-cyan/30 text-paytm-cyan text-[11px] font-semibold mb-2">
          <Zap className="w-3.5 h-3.5 text-paytm-cyan" />
          <span>Autonomous Strategic Decision Engine</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Next Best Actions
        </h1>
        <p className="text-xs text-slate-400">
          Ranked recommendations linking live business problems to quantitative revenue impact and verified metrics.
        </p>
      </div>

      {/* Action Cards List */}
      <div className="space-y-4">
        {activeRecs.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400 space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="font-bold text-white">All Strategic Recommendations Applied!</p>
            <p className="text-xs">Your operations are fully optimized against current benchmarks.</p>
          </div>
        ) : (
          activeRecs.map((rec) => {
            const isHigh = rec.priority === 'HIGH';
            const isApplied = rec.status === 'APPLIED';

            return (
              <div 
                key={rec.id}
                className={`glass-card p-5 sm:p-6 rounded-2xl space-y-4 border transition-all ${
                  isApplied ? 'opacity-60 border-emerald-500/30' : 
                  (isHigh ? 'border-paytm-cyan/40 shadow-glow-cyan' : 'border-slate-800')
                }`}
              >
                {/* Header row: Category, Priority, Problem */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      isHigh ? 'bg-paytm-cyan text-navy-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                    <span className="text-xs text-slate-400 font-mono">[{rec.category}]</span>
                    <h3 className="text-base font-bold text-white">{rec.problem}</h3>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {rec.impact_estimate}
                  </span>
                </div>

                {/* Evidence & Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Evidence Box */}
                  <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                      <span>Supporting Evidence</span>
                    </span>
                    <p className="text-slate-300 leading-relaxed font-normal">{rec.evidence}</p>
                  </div>

                  {/* Suggested Action Box */}
                  <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-paytm-cyan flex items-center space-x-1">
                      <Target className="w-3 h-3 text-paytm-cyan" />
                      <span>Suggested Strategic Action</span>
                    </span>
                    <p className="text-white leading-relaxed font-semibold">{rec.suggested_action}</p>
                  </div>
                </div>

                {/* Assumptions & Target Metric */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                  <span>Assumptions: <em className="text-slate-300 not-italic">{rec.assumptions}</em></span>
                  <span className="shrink-0 font-mono">Measurement Metric: <strong className="text-paytm-cyan">{rec.metric}</strong></span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    {isApplied ? (
                      <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-semibold">
                        <Check className="w-4 h-4" />
                        <span>Action Executed & Tracking Metric</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(rec.id, 'APPLIED')}
                        className="px-4 py-2 rounded-xl bg-paytm-blue hover:bg-paytm-cyan text-navy-950 font-bold text-xs shadow transition-all flex items-center space-x-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Action Executed</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(rec.id, 'DISMISSED')}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Dismiss Recommendation
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
