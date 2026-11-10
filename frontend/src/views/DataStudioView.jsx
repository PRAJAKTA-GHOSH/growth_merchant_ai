import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  RefreshCw, 
  Database,
  Sparkles,
  Layers
} from 'lucide-react';
import api from '../api/client';

export default function DataStudioView({ onDataRefreshed, onSwitchCategory, currentCategory }) {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [regenMsg, setRegenMsg] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const res = await api.uploadTransactionsCsv(file);
      setUploadResult(res.data);
      if (res.data.success && onDataRefreshed) {
        onDataRefreshed();
      }
    } catch (err) {
      console.error(err);
      setUploadResult({
        success: false,
        inserted_count: 0,
        errors: [err.response?.data?.detail || 'Failed to process transaction file.']
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRegenerate = async (categoryKey) => {
    setRegenerating(true);
    setRegenMsg(null);
    try {
      await api.regenerateDemo(categoryKey);
      setRegenMsg(`Generated 180-day deterministic dataset for ${categoryKey}!`);
      if (onDataRefreshed) onDataRefreshed();
      if (onSwitchCategory) onSwitchCategory(categoryKey);
      setTimeout(() => setRegenMsg(null), 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to regenerate demo dataset.');
    } finally {
      setRegenerating(false);
    }
  };

  const downloadSampleCsv = () => {
    const sampleHeaders = "amount,payment_method,status,transaction_time,product_name,quantity\n";
    const sampleRows = [
      "1499.00,Paytm Soundbox QR,SUCCESS,2026-11-08 14:22:10,Premium Cotton Shirt,1",
      "2199.00,Paytm UPI,SUCCESS,2026-11-08 18:45:00,Slim Fit Denim Jeans,1",
      "899.00,Paytm Soundbox QR,FAILED,2026-11-08 19:10:15,Leather Bifold Wallet,1",
      "2499.00,Paytm Card Machine,SUCCESS,2026-11-08 20:05:40,Wireless Noise-Canceling Earbuds,1",
      "1099.00,Paytm Soundbox QR,SUCCESS,2026-11-09 11:30:20,Stainless Steel Smart Thermos,1"
    ].join("\n");

    const blob = new Blob([sampleHeaders + sampleRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "GrowZen_Transactions_Template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-paytm-blue/15 border border-paytm-cyan/30 text-paytm-cyan text-[11px] font-semibold mb-2">
          <Database className="w-3.5 h-3.5" />
          <span>Paytm Data Pipeline & Sandbox Engine</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Data & Import Studio
        </h1>
        <p className="text-xs text-slate-400">
          Upload custom merchant transaction CSV files or switch between pre-calibrated 180-day deterministic demo businesses.
        </p>
      </div>

      {regenMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{regenMsg}</span>
        </div>
      )}

      {/* 1-Click Pre-Calibrated Demo Switcher Grid */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-paytm-cyan" />
          <span>Deterministic Demo Scenarios (6-Month Full Historical Depth)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Retail Store */}
          <div className={`p-4 rounded-xl bg-navy-900 border transition-all ${
            currentCategory === 'retail' ? 'border-paytm-cyan bg-navy-850 shadow-glow-cyan' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">🛍️ Zenith Lifestyle</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-paytm-cyan/20 text-paytm-cyan font-mono font-bold">
                Retail Store
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Apparel and lifestyle electronics with high average ticket size (₹1,750), soundbox payment glitch scenario, and fast-moving denim stockout alert.
            </p>
            <button
              onClick={() => handleRegenerate('retail')}
              disabled={regenerating}
              className="w-full py-2 rounded-lg bg-navy-800 hover:bg-paytm-blue hover:text-navy-950 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Load Retail Scenario (Seed 42)
            </button>
          </div>

          {/* Grocery Store */}
          <div className={`p-4 rounded-xl bg-navy-900 border transition-all ${
            currentCategory === 'grocery' ? 'border-paytm-cyan bg-navy-850 shadow-glow-cyan' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">🥦 GreenLeaf Kirana</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                Grocery Store
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Daily staples & grocery with high transaction frequency (65 txs/day), lower tickets (₹620), and imminent stockout on Basmati Rice.
            </p>
            <button
              onClick={() => handleRegenerate('grocery')}
              disabled={regenerating}
              className="w-full py-2 rounded-lg bg-navy-800 hover:bg-paytm-blue hover:text-navy-950 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Load Kirana Scenario (Seed 101)
            </button>
          </div>

          {/* Cafe Bistro */}
          <div className={`p-4 rounded-xl bg-navy-900 border transition-all ${
            currentCategory === 'restaurant' ? 'border-paytm-cyan bg-navy-850 shadow-glow-cyan' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">☕ Chai & Byte Bistro</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                Restaurant
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Quick service cafe bistro with high peak dinner and late afternoon rushes, beverage margins, and weekend footfall surges.
            </p>
            <button
              onClick={() => handleRegenerate('restaurant')}
              disabled={regenerating}
              className="w-full py-2 rounded-lg bg-navy-800 hover:bg-paytm-blue hover:text-navy-950 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Load Bistro Scenario (Seed 202)
            </button>
          </div>
        </div>
      </div>

      {/* CSV File Upload Section */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-paytm-cyan" />
              <span>Import Custom Merchant Transactions</span>
            </h3>
            <p className="text-xs text-slate-400">
              Upload a .csv file containing real or exported Paytm POS/Soundbox transactions
            </p>
          </div>

          <button
            onClick={downloadSampleCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-700 hover:border-paytm-cyan text-xs text-slate-300 hover:text-white transition-all w-fit"
          >
            <Download className="w-3.5 h-3.5 text-paytm-cyan" />
            <span>Download CSV Template</span>
          </button>
        </div>

        {/* Dropzone */}
        <label className="border-2 border-dashed border-cyan-500/30 hover:border-paytm-cyan bg-navy-950/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group">
          <UploadCloud className="w-10 h-10 text-paytm-cyan mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-bold text-white">Click or drag & drop CSV file to upload</p>
          <p className="text-xs text-slate-400 mt-1">Required columns: amount, payment_method, status</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {uploading && (
          <div className="flex items-center justify-center space-x-2 text-xs text-paytm-cyan">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Parsing records, validating schemas, and updating AI models...</span>
          </div>
        )}

        {/* Upload Result / Error Feedback */}
        {uploadResult && (
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            uploadResult.success 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-center space-x-2">
              {uploadResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span className="font-bold">
                {uploadResult.success 
                  ? `Successfully ingested ${uploadResult.inserted_count} transactions into isolated merchant database!` 
                  : 'File validation issues encountered.'}
              </span>
            </div>

            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] space-y-1">
                <p className="font-semibold text-white">Validation Notes:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  {uploadResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
