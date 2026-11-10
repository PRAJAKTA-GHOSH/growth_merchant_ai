import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ParticlesBackground from './components/ParticlesBackground';

import LandingView from './views/LandingView';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import ForecastingView from './views/ForecastingView';
import CustomersView from './views/CustomersView';
import InventoryView from './views/InventoryView';
import CampaignsView from './views/CampaignsView';
import CopilotView from './views/CopilotView';
import HealthView from './views/HealthView';
import AnomaliesView from './views/AnomaliesView';
import RecommendationsView from './views/RecommendationsView';
import DataStudioView from './views/DataStudioView';
import ReportsView from './views/ReportsView';

import api from './api/client';

export default function App() {
  const [merchant, setMerchant] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [activeDays, setActiveDays] = useState(30);
  const [currentCategory, setCurrentCategory] = useState('retail');
  const [campaignCohort, setCampaignCohort] = useState('At-Risk');
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Check existing session
  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem('growzen_token');
      if (token) {
        try {
          const res = await api.getMe();
          setMerchant(res.data);
          // Map category to key
          if (res.data.category.toLowerCase().includes('grocery')) setCurrentCategory('grocery');
          else if (res.data.category.toLowerCase().includes('restaurant')) setCurrentCategory('restaurant');
          else setCurrentCategory('retail');
          setCurrentView('dashboard');
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          localStorage.removeItem('growzen_token');
        }
      }
      setLoadingInitial(false);
    };

    initSession();
  }, []);

  const handleDemoLogin = async (categoryKey = 'retail') => {
    try {
      const res = await api.demoLogin(categoryKey);
      localStorage.setItem('growzen_token', res.data.access_token);
      setMerchant(res.data.merchant);
      setCurrentCategory(categoryKey);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Demo login failed:', err);
      alert('Could not connect to GrowZen AI backend. Ensure FastAPI server is running on http://127.0.0.1:8000');
    }
  };

  const handleSwitchCategory = async (categoryKey) => {
    await handleDemoLogin(categoryKey);
  };

  const handleLogout = () => {
    localStorage.removeItem('growzen_token');
    setMerchant(null);
    setCurrentView('landing');
  };

  const handleLaunchCampaignFromSegment = (segment) => {
    setCampaignCohort(segment);
    setCurrentView('campaigns');
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingView 
            onGetStarted={() => setCurrentView('auth')} 
            onDemoLogin={handleDemoLogin} 
          />
        );
      case 'auth':
        return (
          <AuthView 
            onAuthSuccess={(m) => {
              setMerchant(m);
              setCurrentView('dashboard');
            }} 
            onDemoSelect={handleDemoLogin} 
          />
        );
      case 'dashboard':
        return (
          <DashboardView 
            activeDays={activeDays} 
            setActiveDays={setActiveDays} 
            onNavigate={(viewId) => setCurrentView(viewId)} 
          />
        );
      case 'forecasting':
        return <ForecastingView />;
      case 'customers':
        return <CustomersView onLaunchCampaign={handleLaunchCampaignFromSegment} />;
      case 'inventory':
        return <InventoryView />;
      case 'campaigns':
        return <CampaignsView defaultSegment={campaignCohort} />;
      case 'copilot':
        return <CopilotView />;
      case 'health':
        return <HealthView onTakeAction={() => setCurrentView('recommendations')} />;
      case 'anomalies':
        return <AnomaliesView />;
      case 'recommendations':
        return <RecommendationsView onExecuteAction={() => setCurrentView('dashboard')} />;
      case 'datastudio':
        return (
          <DataStudioView 
            onDataRefreshed={() => {}} 
            onSwitchCategory={handleSwitchCategory}
            currentCategory={currentCategory}
          />
        );
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView activeDays={activeDays} setActiveDays={setActiveDays} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans relative selection:bg-paytm-cyan selection:text-navy-950">
      <ParticlesBackground />

      {/* Top Navbar */}
      <Navbar 
        merchant={merchant}
        activeDays={activeDays}
        setActiveDays={setActiveDays}
        onOpenCopilot={() => setCurrentView('copilot')}
        onLogout={handleLogout}
        onSwitchCategory={handleSwitchCategory}
        currentCategory={currentCategory}
      />

      {/* Body with Sidebar & View Area */}
      <div className="flex-1 flex relative z-10">
        {currentView !== 'landing' && currentView !== 'auth' && (
          <Sidebar 
            currentView={currentView} 
            setCurrentView={setCurrentView}
            anomalyCount={2}
            recCount={4}
          />
        )}

        <main className={`flex-1 p-4 lg:p-8 overflow-y-auto ${
          currentView === 'landing' || currentView === 'auth' ? 'max-w-7xl mx-auto w-full' : ''
        }`}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
