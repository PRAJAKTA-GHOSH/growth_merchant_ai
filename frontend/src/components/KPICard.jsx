import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function KPICard({ 
  title, 
  value, 
  changePct = 0, 
  isPositive = true, 
  previousValue,
  icon: Icon,
  accentColor = "cyan",
  subtitle
}) {
  const isUp = changePct >= 0;

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-4 lg:p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Top row: Label and Icon */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-navy-800/80 border border-cyan-500/20 flex items-center justify-center text-paytm-cyan shadow-glow-cyan">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="my-1">
        <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
      </div>

      {/* Bottom row: Delta & Comparison Context */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs">
        <div className={`flex items-center font-bold px-1.5 py-0.5 rounded-md ${
          isPositive 
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
            : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
        }`}>
          {isUp ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
          )}
          <span>{Math.abs(changePct)}%</span>
        </div>
        
        <span className="text-[11px] text-slate-500">
          {subtitle || (previousValue !== undefined ? `vs prior ${previousValue}` : 'vs prior period')}
        </span>
      </div>
    </div>
  );
}
