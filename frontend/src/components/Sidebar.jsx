import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Package, 
  Megaphone, 
  Bot, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  UploadCloud, 
  FileText,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, anomalyCount = 2, recCount = 4 }) {
  const navItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'forecasting', label: 'AI Growth Predictor', icon: TrendingUp, tag: '7D/30D' },
    { id: 'customers', label: 'Customer Intelligence', icon: Users, tag: 'RFM' },
    { id: 'inventory', label: 'Smart Inventory', icon: Package, tag: 'Live' },
    { id: 'campaigns', label: 'AI Campaign Studio', icon: Megaphone, tag: 'ROI' },
    { id: 'copilot', label: 'Vyapar Copilot', icon: Bot, highlight: true },
    { id: 'health', label: 'Merchant Health Score', icon: ShieldCheck, tag: '0-100' },
    { id: 'anomalies', label: 'Anomaly Detection', icon: AlertTriangle, count: anomalyCount, alert: true },
    { id: 'recommendations', label: 'Next Best Actions', icon: Zap, count: recCount },
    { id: 'datastudio', label: 'Data & Import Studio', icon: UploadCloud },
    { id: 'reports', label: 'Executive Report', icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-cyan-500/15 bg-navy-950/70 backdrop-blur-xl flex flex-col justify-between p-3 shrink-0 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      {/* Navigation Links */}
      <div className="space-y-1 overflow-y-auto pr-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Growth Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-paytm-dark/90 to-blue-900/60 text-white border border-paytm-cyan/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-paytm-cyan' : (item.highlight ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200')
                }`} />
                <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
              </div>

              <div className="flex items-center space-x-1">
                {item.tag && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-cyan-400/20 text-cyan-200' : 'bg-navy-800 text-slate-400'
                  }`}>
                    {item.tag}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    item.alert ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {item.count}
                  </span>
                )}
                <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isActive ? 'opacity-100 text-paytm-cyan' : 'text-slate-500'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-navy-900/90 border border-slate-800/80 text-[11px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400">ML Forecast Engine</span>
            <span className="text-emerald-400 font-mono font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              ACTIVE
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Grounded on 180-day Paytm transactions</p>
        </div>
      </div>
    </aside>
  );
}
