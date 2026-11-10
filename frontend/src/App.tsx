import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
      <Navbar
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {viewMode === 'landing' ? (
        <LandingPage
          onLaunchDashboard={() => setViewMode('dashboard')}
        />
      ) : (
        <Dashboard
          onBackToLanding={() => setViewMode('landing')}
        />
      )}
    </div>
  );
};

export default App;
