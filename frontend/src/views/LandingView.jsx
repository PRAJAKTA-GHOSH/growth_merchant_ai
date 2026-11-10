import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  ChevronRight,
  Store,
  Layers
} from 'lucide-react';
import AIOrb from '../components/AIOrb';

export default function LandingView({ onGetStarted, onDemoLogin }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Vision Statement */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-paytm-cyan/30 text-paytm-cyan text-xs font-semibold shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5 text-paytm-cyan" />
            <span>Paytm Merchant Growth Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Don't just track your business. <br />
            <span className="gradient-text-cyan">Understand it, predict it and grow it.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
            GrowZen AI is the intelligent fintech partner for Paytm merchants. Go beyond standard dashboards with real-time ML sales forecasting, RFM customer churn prevention, stockout alerts, and an autonomous Next-Best-Action engine.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => onDemoLogin('retail')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-paytm-blue to-paytm-cyan text-navy-950 font-bold text-sm hover:opacity-95 hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Explore Live Retail Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white font-semibold text-sm hover:border-paytm-cyan/50 hover:bg-navy-850 transition-all flex items-center justify-center space-x-2"
            >
              <Store className="w-4 h-4 text-paytm-cyan" />
              <span>Register Merchant Account</span>
            </button>
          </div>

          {/* Quick Demo Scenarios Bar */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">1-Click Demos:</span>
            <button 
              onClick={() => onDemoLogin('retail')}
              className="px-3 py-1.5 rounded-lg bg-navy-900 border border-cyan-500/30 text-cyan-300 hover:border-paytm-cyan transition-all"
            >
              🛍️ Zenith Lifestyle (Retail)
            </button>
            <button 
              onClick={() => onDemoLogin('grocery')}
              className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:border-paytm-cyan hover:text-cyan-300 transition-all"
            >
              🥦 GreenLeaf Kirana (Grocery)
            </button>
            <button 
              onClick={() => onDemoLogin('restaurant')}
              className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:border-paytm-cyan hover:text-cyan-300 transition-all"
            >
              ☕ Chai & Byte (Bistro)
            </button>
          </div>
        </div>

        {/* Right Column: 3D AI Intelligence Orb & Live Feature Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative">
            <AIOrb size={320} interactive={true} />
            
            {/* Floating metric badges */}
            <div className="absolute -top-4 -left-6 glass-card p-3 rounded-2xl flex items-center space-x-3 shadow-glow-cyan animate-float">
              <div className="w-8 h-8 rounded-xl bg-paytm-blue/20 border border-paytm-cyan/30 flex items-center justify-center text-paytm-cyan">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">30D Forecast</p>
                <p className="text-xs font-bold text-white">+14.2% Projected Lift</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 glass-card p-3 rounded-2xl flex items-center space-x-3 shadow-glow-blue animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">RFM Segmentation</p>
                <p className="text-xs font-bold text-white">25 At-Risk Win-back</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pillar Highlights */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-paytm-cyan mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Time-Series AI Forecasting</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            7-day and 30-day sales projections with 95% confidence intervals, peak business hours, and weekday footfall patterns to align staffing and stock.
          </p>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">RFM & Churn Intelligence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatic segmentation into High-Value, Loyal, New, and At-Risk cohorts. Generates WhatsApp-ready promotional copy with explicit ROI projections.
          </p>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Next Best Action Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Continuous cross-domain diagnosis identifying revenue leaks, imminent stockout dates, and Soundbox gateway glitches with quantified financial impact.
          </p>
        </div>
      </div>
    </div>
  );
}
