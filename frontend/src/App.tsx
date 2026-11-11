import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

export const AppContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col font-sans transition-colors duration-250">
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

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
