import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Store, 
  Calendar, 
  Bell, 
  LogOut, 
  ChevronDown,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function Navbar({ 
  merchant, 
  activeDays, 
  setActiveDays, 
  onOpenCopilot, 
  onLogout,
  onSwitchCategory,
  currentCategory
}) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-cyan-500/15 bg-navy-950/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Branding & Tagline */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-paytm-dark via-paytm-blue to-paytm-cyan p-0.5 flex items-center justify-center shadow-glow-cyan">
          <div className="h-full w-full bg-navy-950 rounded-[10px] flex items-center justify-center">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-paytm-cyan to-white text-base">GZ</span>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight text-white flex items-center">
              GrowZen <span className="text-paytm-cyan ml-1">AI</span>
            </span>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-paytm-blue/20 text-paytm-cyan border border-paytm-cyan/30">
              Paytm Partner
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">Vyapar Merchant Intelligence Platform</p>
        </div>
      </div>

      {/* Center: Quick Demo Category Switcher & Days Filter */}
      <div className="hidden md:flex items-center space-x-3">
        {/* Category Switcher Pill */}
        <div className="flex items-center bg-navy-900/90 border border-slate-700/60 rounded-xl p-1 text-xs">
          <button
            onClick={() => onSwitchCategory('retail')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              currentCategory === 'retail' 
                ? 'bg-paytm-blue text-navy-950 shadow font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🛍️ Retail
          </button>
          <button
            onClick={() => onSwitchCategory('grocery')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              currentCategory === 'grocery' 
                ? 'bg-paytm-blue text-navy-950 shadow font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🥦 Kirana
          </button>
          <button
            onClick={() => onSwitchCategory('restaurant')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              currentCategory === 'restaurant' 
                ? 'bg-paytm-blue text-navy-950 shadow font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            ☕ Bistro
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex items-center bg-navy-900/80 border border-slate-800 rounded-xl p-1 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 ml-1.5 mr-1 text-slate-400" />
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setActiveDays(d)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeDays === d 
                  ? 'bg-navy-800 text-paytm-cyan font-bold border border-cyan-500/30' 
                  : 'hover:text-white'
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Right: Vyapar Copilot Button & Merchant Profile */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenCopilot}
          className="relative group flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-paytm-dark/90 to-blue-900/90 border border-cyan-500/40 text-paytm-cyan text-xs font-semibold hover:border-paytm-cyan hover:shadow-glow-cyan transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-paytm-cyan" />
          <span>Vyapar Copilot</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-paytm-cyan"></span>
          </span>
        </button>

        {merchant && (
          <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="text-right">
              <p className="text-xs font-semibold text-white leading-tight">{merchant.business_name}</p>
              <p className="text-[10px] text-paytm-cyan">{merchant.category}</p>
            </div>
            <button
              onClick={onLogout}
              title="Logout / Change Merchant"
              className="p-1.5 rounded-lg bg-navy-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
