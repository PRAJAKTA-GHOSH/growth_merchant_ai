import React, { useState } from 'react';
import { Store, Lock, Mail, MapPin, Users, Clock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import api from '../api/client';

export default function AuthView({ onAuthSuccess, onDemoSelect }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Registration Form State
  const [regData, setRegData] = useState({
    business_name: '',
    category: 'Retail store',
    location: 'Bengaluru, Karnataka',
    size: 'Small',
    monthly_revenue_range: '₹1L - ₹5L',
    employee_count: 4,
    operating_hours: '09:00 - 21:00',
    email: '',
    password: '',
    generate_demo_data: true,
    demo_category_type: 'retail'
  });

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const categories = [
    'Retail store',
    'Grocery store',
    'Restaurant',
    'Pharmacy',
    'Clothing store',
    'Electronics store',
    'Salon',
    'Other'
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(regData);
      localStorage.setItem('growzen_token', res.data.access_token);
      onAuthSuccess(res.data.merchant);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(loginData);
      localStorage.setItem('growzen_token', res.data.access_token);
      onAuthSuccess(res.data.merchant);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        {/* Quick Demo Login Cards for Hackathon Evaluators */}
        <div className="mb-6 glass-card p-4 rounded-2xl border-cyan-500/30">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-paytm-cyan" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Instant Hackathon Demo Logins (Preloaded 6-Month Data)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onDemoSelect('retail')}
              className="p-3 rounded-xl bg-navy-900 border border-slate-700/80 hover:border-paytm-cyan hover:bg-navy-850 text-left transition-all group"
            >
              <p className="text-xs font-bold text-white flex items-center justify-between">
                <span>🛍️ Retail Store</span>
                <ArrowRight className="w-3.5 h-3.5 text-paytm-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Zenith Lifestyle</p>
              <span className="text-[9px] text-paytm-cyan font-mono">180d • Apparel & Gear</span>
            </button>

            <button
              onClick={() => onDemoSelect('grocery')}
              className="p-3 rounded-xl bg-navy-900 border border-slate-700/80 hover:border-paytm-cyan hover:bg-navy-850 text-left transition-all group"
            >
              <p className="text-xs font-bold text-white flex items-center justify-between">
                <span>🥦 Kirana & Super</span>
                <ArrowRight className="w-3.5 h-3.5 text-paytm-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
              <p className="text-[11px] text-slate-400 mt-1">GreenLeaf Superstore</p>
              <span className="text-[9px] text-paytm-cyan font-mono">180d • Daily Staples</span>
            </button>

            <button
              onClick={() => onDemoSelect('restaurant')}
              className="p-3 rounded-xl bg-navy-900 border border-slate-700/80 hover:border-paytm-cyan hover:bg-navy-850 text-left transition-all group"
            >
              <p className="text-xs font-bold text-white flex items-center justify-between">
                <span>☕ Cafe Bistro</span>
                <ArrowRight className="w-3.5 h-3.5 text-paytm-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Chai & Byte Bistro</p>
              <span className="text-[9px] text-paytm-cyan font-mono">180d • Food & Coffee</span>
            </button>
          </div>
        </div>

        {/* Auth Box */}
        <div className="glass-card-glow p-6 sm:p-8 rounded-3xl">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              onClick={() => { setIsRegister(false); setError(null); }}
              className={`pb-3 px-4 text-sm font-semibold transition-all relative ${
                !isRegister ? 'text-paytm-cyan border-b-2 border-paytm-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              Merchant Login
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(null); }}
              className={`pb-3 px-4 text-sm font-semibold transition-all relative ${
                isRegister ? 'text-paytm-cyan border-b-2 border-paytm-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              New Merchant Onboarding
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          {!isRegister ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="merchant@growzen.ai"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-paytm-blue to-paytm-cyan text-navy-950 font-bold text-sm hover:opacity-95 shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register / Onboarding Wizard Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={regData.business_name}
                    onChange={(e) => setRegData({ ...regData, business_name: e.target.value })}
                    placeholder="e.g. Royal Sweets & Bakery"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Category</label>
                  <select
                    value={regData.category}
                    onChange={(e) => setRegData({ ...regData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City / Location</label>
                  <input
                    type="text"
                    value={regData.location}
                    onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                    placeholder="Bengaluru, Karnataka"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Revenue Range</label>
                  <select
                    value={regData.monthly_revenue_range}
                    onChange={(e) => setRegData({ ...regData, monthly_revenue_range: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  >
                    <option value="₹50k - ₹1L">₹50,000 - ₹1,00,000</option>
                    <option value="₹1L - ₹5L">₹1,00,000 - ₹5,00,000</option>
                    <option value="₹5L - ₹15L">₹5,00,000 - ₹15,00,000</option>
                    <option value="₹15L+">₹15,00,000+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={regData.operating_hours}
                    onChange={(e) => setRegData({ ...regData, operating_hours: e.target.value })}
                    placeholder="09:00 - 21:00"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Number of Staff</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={regData.employee_count}
                    onChange={(e) => setRegData({ ...regData, employee_count: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Merchant Email</label>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="owner@store.com"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Create Password</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-navy-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  />
                </div>
              </div>

              {/* Data Onboarding Mode Choice */}
              <div className="p-3 rounded-xl bg-navy-900/80 border border-slate-700/80 space-y-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-paytm-cyan cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regData.generate_demo_data}
                    onChange={(e) => setRegData({ ...regData, generate_demo_data: e.target.checked })}
                    className="rounded bg-navy-950 border-cyan-500 text-paytm-cyan focus:ring-0"
                  />
                  <span>Preload 180 Days of Realistic Historical Paytm Transactions</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  Allows instant testing of the ML Growth Predictor, RFM Churn alerts, and Health Score. You can also upload your own CSV data anytime.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-paytm-blue to-paytm-cyan text-navy-950 font-bold text-sm hover:opacity-95 shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Creating Merchant Workspace...' : 'Complete Registration & Open Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
