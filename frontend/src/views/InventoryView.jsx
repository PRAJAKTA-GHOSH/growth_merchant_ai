import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Edit3, 
  Check, 
  X,
  Truck
} from 'lucide-react';
import api from '../api/client';

export default function InventoryView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');
  const [updateMsg, setUpdateMsg] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getInventory();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch inventory analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSaveStock = async (productId) => {
    try {
      await api.updateStock(productId, parseInt(newStockVal));
      setEditingId(null);
      setUpdateMsg('Stock updated successfully!');
      setTimeout(() => setUpdateMsg(null), 3000);
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert('Failed to update stock.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-paytm-cyan animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Auditing SKU run-rates & lead times...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Inventory Error</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={fetchInventory} className="px-4 py-2 rounded-xl bg-paytm-blue text-navy-950 font-bold text-xs">
          Retry
        </button>
      </div>
    );
  }

  const {
    total_skus,
    total_inventory_value,
    low_stock_count,
    out_of_stock_count,
    overstock_count,
    fast_moving_products,
    slow_moving_products,
    reorder_recommendations,
    inventory_turnover_rate
  } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Smart Inventory & Reorder Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Real-time sales velocity monitoring, stockout predictions, and lead-time calculations
          </p>
        </div>

        {updateMsg && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{updateMsg}</span>
          </div>
        )}
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Tracked SKUs</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{total_skus}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Active merchant catalog</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">On-Hand Inventory Value</p>
          <h3 className="text-2xl font-extrabold text-paytm-cyan mt-1 font-mono">
            ₹{total_inventory_value.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Valued at wholesale cost price</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border-rose-500/30">
          <p className="text-xs text-rose-400 font-semibold uppercase flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Low Stock Warnings</span>
          </p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{low_stock_count}</h3>
          <p className="text-[11px] text-rose-300 mt-1">Lead time exceeds days on hand</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Annual Inventory Turnover</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{inventory_turnover_rate}x</h3>
          <p className="text-[11px] text-slate-500 mt-1">Velocity vs tied working capital</p>
        </div>
      </div>

      {/* Urgent Reorder Recommendations Section */}
      <div className="glass-card-glow p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-paytm-cyan" />
            <h3 className="text-sm font-bold text-white">Priority Restock & Purchase Order Recommendations</h3>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
            {reorder_recommendations.length} Actionable Items
          </span>
        </div>

        <div className="space-y-3">
          {reorder_recommendations.map((item) => (
            <div 
              key={item.id} 
              className="p-4 rounded-xl bg-navy-900 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{item.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-slate-400 font-mono">
                    {item.sku}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    item.status === 'OUT_OF_STOCK' ? 'bg-rose-600 text-white' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {item.reorder_reason}
                </p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                  <span>Velocity: <strong className="text-white font-mono">{item.daily_run_rate} {item.unit}/day</strong></span>
                  <span>Lead Time: <strong className="text-white font-mono">{item.lead_time_days} days</strong></span>
                  <span>Recommended Order: <strong className="text-paytm-cyan font-mono">{item.reorder_quantity} {item.unit}</strong></span>
                </div>
              </div>

              {/* Quick Stock Editor */}
              <div className="flex items-center space-x-3 shrink-0">
                {editingId === item.id ? (
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      value={newStockVal}
                      onChange={(e) => setNewStockVal(e.target.value)}
                      className="w-16 px-2 py-1 bg-navy-950 border border-cyan-500 rounded text-xs text-white"
                      placeholder="Qty"
                    />
                    <button
                      onClick={() => handleSaveStock(item.id)}
                      className="p-1 rounded bg-paytm-cyan text-navy-950 hover:opacity-90"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase">On-Hand</p>
                      <p className="text-base font-extrabold text-white font-mono">{item.current_stock} {item.unit}</p>
                    </div>
                    <button
                      onClick={() => { setEditingId(item.id); setNewStockVal(item.current_stock); }}
                      title="Quick Adjust Stock"
                      className="p-1.5 rounded-lg bg-navy-850 border border-slate-700 text-slate-400 hover:text-white hover:border-paytm-cyan transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fast Movers vs Slow Movers Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Moving SKUs */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>Fast-Moving Star Products (High Velocity)</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono font-semibold">Top Turnover</span>
          </div>

          <div className="space-y-2.5">
            {fast_moving_products.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-navy-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Selling Price: ₹{p.selling_price} • Cost: ₹{p.cost_price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-emerald-400 font-bold">{p.daily_run_rate} {p.unit}/day</p>
                  <p className="text-[10px] text-slate-400">Stock: {p.current_stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Moving / Overstock SKUs */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              <span>Slow-Moving & Tied Capital (Clearance Candidates)</span>
            </h3>
            <span className="text-[11px] text-amber-400 font-mono font-semibold">Tied Capital</span>
          </div>

          <div className="space-y-2.5">
            {slow_moving_products.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-navy-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Stock: {p.current_stock} {p.unit} • Days of Cover: {p.days_until_stockout || '120+'}d
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-amber-400 font-bold">{p.daily_run_rate} {p.unit}/day</p>
                  <p className="text-[10px] text-slate-400">Tied Capital: ₹{(p.current_stock * p.cost_price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
