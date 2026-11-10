import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  HelpCircle,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client';

export default function AnomaliesView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAnomalies();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to run anomaly detection engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-paytm-cyan animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Running Multi-Dimensional Isolation & Z-Score Analysis...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Anomaly Detection Error</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={fetchAnomalies} className="px-4 py-2 rounded-xl bg-paytm-blue text-navy-950 font-bold text-xs">
          Retry
        </button>
      </div>
    );
  }

  const { total_anomalies_detected, critical_count, warning_count, detection_method, anomalies } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-paytm-blue/15 border border-paytm-cyan/30 text-paytm-cyan text-[11px] font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Operational Outlier & Spike Diagnostic</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Financial & Operational Anomaly Detection
        </h1>
        <p className="text-xs text-slate-400">
          Powered by {detection_method} • Audits daily revenue drops, payment failure surges, and volume shocks.
        </p>
      </div>

      {/* Governance & Anti-Fraud Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-navy-900 border border-slate-700/80 text-xs text-slate-300 flex items-start space-x-2.5">
        <HelpCircle className="w-4 h-4 text-paytm-cyan shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Fintech Governance Note:</strong> Statistical anomalies indicate operational variations (e.g. gateway downtime, seasonal drops, inventory stockouts) and are not evidence of fraud or chargeback fault without independent KYC verification.
        </p>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Flagged Anomalies</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{total_anomalies_detected}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Evaluated across trailing 30 days</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border-rose-500/30">
          <p className="text-xs text-rose-400 font-semibold uppercase">Critical Severity</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{critical_count}</h3>
          <p className="text-[11px] text-rose-300 mt-1">Payment gateway or steep revenue shock</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border-amber-500/30">
          <p className="text-xs text-amber-400 font-semibold uppercase">Warnings & Notices</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{warning_count}</h3>
          <p className="text-[11px] text-amber-300 mt-1">Moderate variance from rolling baseline</p>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Detected Anomaly Timeline</h3>

        {anomalies.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">All Operations Nominal</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No statistically anomalous transaction drops, volume spikes, or gateway failures detected.
            </p>
          </div>
        ) : (
          anomalies.map((anom) => {
            const isCrit = anom.severity === 'CRITICAL';
            const isWarn = anom.severity === 'WARNING';

            return (
              <div 
                key={anom.id}
                className={`glass-card p-5 rounded-2xl space-y-3 border ${
                  isCrit ? 'border-rose-500/40 bg-rose-950/10' :
                  (isWarn ? 'border-amber-500/30 bg-amber-950/10' : 'border-cyan-500/20')
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      isCrit ? 'bg-rose-500 text-white' :
                      (isWarn ? 'bg-amber-500 text-navy-950 font-bold' : 'bg-cyan-500 text-navy-950 font-bold')
                    }`}>
                      {anom.severity}
                    </span>
                    <span className="text-sm font-bold text-white">{anom.metric_name}</span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    Date: <strong className="text-slate-200">{anom.date_or_time}</strong>
                  </span>
                </div>

                {/* Values & Deviation */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-navy-900/90 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Observed Value</span>
                    <p className="font-extrabold text-white font-mono mt-0.5 text-sm">{anom.observed_value}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Expected Benchmark</span>
                    <p className="font-semibold text-slate-300 font-mono mt-0.5 text-sm">{anom.expected_value}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Statistical Deviation</span>
                    <p className={`font-extrabold font-mono mt-0.5 text-sm ${
                      anom.deviation_pct < 0 ? 'text-rose-400' : 'text-paytm-cyan'
                    }`}>
                      {anom.deviation_pct > 0 ? `+${anom.deviation_pct}%` : `${anom.deviation_pct}%`}
                    </p>
                  </div>
                </div>

                {/* Plain-Language Explanation */}
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {anom.explanation}
                </p>

                {/* Recommended Mitigation */}
                <div className="p-3 rounded-xl bg-navy-950 border border-slate-800/80 flex items-start space-x-2 text-xs">
                  <Wrench className="w-3.5 h-3.5 text-paytm-cyan shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-paytm-cyan">Recommended Action: </span>
                    <span className="text-slate-300">{anom.recommended_action}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
