import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Save, 
  AlertCircle,
  Tag,
  Clock
} from 'lucide-react';
import api from '../api/client';

export default function CampaignsView({ defaultSegment = 'At-Risk' }) {
  const [targetSegment, setTargetSegment] = useState(defaultSegment);
  const [objective, setObjective] = useState('Win-back Inactive');
  const [discountPct, setDiscountPct] = useState(15);
  const [budget, setBudget] = useState(1500);
  
  const [generating, setGenerating] = useState(false);
  const [campaignResult, setCampaignResult] = useState(null);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSaved = async () => {
    try {
      const res = await api.listCampaigns();
      setSavedCampaigns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSaved();
    handleGenerate();
  }, [defaultSegment]);

  const handleGenerate = async () => {
    setGenerating(true);
    setSaveSuccess(false);
    try {
      const res = await api.generateCampaign({
        target_segment: targetSegment,
        objective: objective,
        discount_pct: discountPct,
        budget: budget
      });
      setCampaignResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate campaign copy.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (campaignResult?.whatsapp_message) {
      navigator.clipboard.writeText(campaignResult.whatsapp_message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveCampaign = async () => {
    if (!campaignResult) return;
    try {
      await api.saveCampaign({
        name: campaignResult.campaign_name,
        target_segment: targetSegment,
        objective: objective,
        discount_pct: discountPct,
        budget: budget,
        message_template: campaignResult.whatsapp_message,
        audience_size: campaignResult.target_audience_count,
        projected_roi_low: 2.2,
        projected_roi_high: 4.1,
        status: 'ACTIVE'
      });
      setSaveSuccess(true);
      fetchSaved();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save campaign.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-paytm-blue/15 border border-paytm-cyan/30 text-paytm-cyan text-[11px] font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Paytm WhatsApp & SMS Growth Engine</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          AI Campaign Studio
        </h1>
        <p className="text-xs text-slate-400">
          Target specific customer cohorts with tailored promotional incentives, projected ROI ranges, and instant copy generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameter Configuration (5 cols) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Megaphone className="w-4 h-4 text-paytm-cyan" />
            <span>Campaign Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Customer Cohort</label>
            <select
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value)}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-paytm-cyan"
            >
              <option value="At-Risk">⚠️ At-Risk Patrons (Win-back)</option>
              <option value="High-Value">⭐ High-Value VIP Patrons</option>
              <option value="Loyal">❤️ Loyal Regulars</option>
              <option value="New">🌱 New First-Time Buyers</option>
              <option value="Inactive">💤 Inactive (Reactivation)</option>
              <option value="All">🌐 All Registered Customers</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Marketing Objective</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-paytm-cyan"
            >
              <option value="Win-back Inactive">Win-back Lapsed Patrons</option>
              <option value="Upsell High-Value">Upsell Premium Baskets</option>
              <option value="Festival Flash Sale">Weekend Festival Special</option>
              <option value="Clearance">Inventory Clearance Special</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Discount Percentage</span>
              <span className="font-mono text-paytm-cyan font-bold">{discountPct}% OFF</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={discountPct}
              onChange={(e) => setDiscountPct(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5%</span>
              <span>20%</span>
              <span>40%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Budget (INR)</label>
            <input
              type="number"
              step="500"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value) || 500)}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-paytm-cyan font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">Covers WhatsApp API delivery and local promotional handouts</p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-paytm-blue to-paytm-cyan text-navy-950 font-bold text-xs hover:opacity-95 shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{generating ? 'Regenerating Copy...' : 'Generate AI Campaign Copy'}</span>
          </button>
        </div>

        {/* Right Preview: WhatsApp Phone Mockup & Economics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {campaignResult ? (
            <>
              {/* WhatsApp Phone Mockup Card */}
              <div className="glass-card-glow p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      WhatsApp Verified Preview
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-navy-900 border border-slate-700 hover:border-paytm-cyan text-xs text-slate-300 hover:text-white transition-all"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-paytm-cyan" />}
                    <span>{copied ? 'Copied Message!' : 'Copy Template'}</span>
                  </button>
                </div>

                {/* Message Bubble Mockup */}
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed font-normal whitespace-pre-line shadow-inner">
                  {campaignResult.whatsapp_message}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target Audience: <strong className="text-white font-mono">{campaignResult.target_audience_count} customers</strong></span>
                  <span>Estimated Reach: <strong className="text-paytm-cyan font-mono">100% Soundbox Payers</strong></span>
                </div>
              </div>

              {/* Campaign Economic Projections & Disclaimers */}
              <div className="glass-card p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Projected Financial Return & Explicit Assumptions
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase">Projected ROI</p>
                    <p className="text-lg font-extrabold text-paytm-cyan font-mono mt-0.5">
                      {campaignResult.projected_roi_range}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase">Revenue Potential</p>
                    <p className="text-lg font-extrabold text-white font-mono mt-0.5">
                      {campaignResult.projected_revenue_range}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase">Budget Allocation</p>
                    <p className="text-lg font-extrabold text-white font-mono mt-0.5">
                      ₹{campaignResult.estimated_budget.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Explicit Assumptions Disclaimer */}
                <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Model Assumptions & Governance:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                    {campaignResult.assumptions.map((asm, i) => (
                      <li key={i}>{asm}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleSaveCampaign}
                    className="px-5 py-2.5 rounded-xl bg-navy-850 border border-paytm-cyan/40 hover:border-paytm-cyan text-paytm-cyan font-semibold text-xs hover:shadow-glow-cyan transition-all flex items-center space-x-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saveSuccess ? 'Campaign Saved!' : 'Save & Stage Campaign'}</span>
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Success Metric: {campaignResult.success_metrics[0]}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card p-12 text-center text-slate-400">
              Generating copy...
            </div>
          )}
        </div>
      </div>

      {/* Saved Campaigns List */}
      {savedCampaigns.length > 0 && (
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-3">Saved & Active Merchant Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedCampaigns.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{c.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    {c.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">{c.message_template}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800">
                  <span>Audience: {c.audience_size} • Budget: ₹{c.budget}</span>
                  <span>Proj ROI: {c.projected_roi_low}x - {c.projected_roi_high}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
