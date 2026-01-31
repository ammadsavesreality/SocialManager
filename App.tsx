import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ActionList } from './components/ActionList';
import { AppState, AnalyzedProfile, BaseProfile, RelationshipType } from './types';
import { analyzeRelationships } from './utils/analyzer';
import { Users } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [activeMode, setActiveMode] = useState<RelationshipType | null>(null);

  // Restore state
  useEffect(() => {
    const saved = localStorage.getItem('social_mgr_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profiles && parsed.stats) {
          setAppState(parsed);
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  // Save state
  useEffect(() => {
    if (appState) {
        localStorage.setItem('social_mgr_state', JSON.stringify(appState));
    } else {
        localStorage.removeItem('social_mgr_state');
    }
  }, [appState]);

  const handleDataReady = (followers: BaseProfile[], following: BaseProfile[]) => {
    const analyzed = analyzeRelationships(followers, following);
    const stats = {
        mutuals: analyzed.filter(p => p.type === 'mutual').length,
        fans: analyzed.filter(p => p.type === 'fan').length,
        dontFollowBack: analyzed.filter(p => p.type === 'dont_follow_back').length,
    };
    setAppState({ profiles: analyzed, stats });
  };

  const handleUpdateProfiles = (updatedPartial: AnalyzedProfile[]) => {
    if (!appState) return;
    
    // Create a map of the updates for O(1) lookup
    const updateMap = new Map(updatedPartial.map(u => [u.id, u]));

    const newProfiles = appState.profiles.map(p => 
        updateMap.has(p.id) ? updateMap.get(p.id)! : p
    );

    setAppState({
        ...appState,
        profiles: newProfiles
    });
  };

  const handleReset = () => {
    setAppState(null);
    setActiveMode(null);
    localStorage.removeItem('social_mgr_state');
  };

  // Render Logic
  let content;

  if (!appState) {
    content = <LandingPage onDataReady={handleDataReady} />;
  } else if (activeMode) {
    // We are in a specific tool (Follow or Unfollow)
    const filteredData = appState.profiles.filter(p => p.type === activeMode);
    content = (
        <div className="h-full md:h-[80vh] bg-white md:rounded-2xl md:shadow-lg md:border border-slate-200 overflow-hidden">
            <ActionList 
                data={filteredData} 
                mode={activeMode}
                onBack={() => setActiveMode(null)}
                onUpdate={handleUpdateProfiles}
            />
        </div>
    );
  } else {
    // Dashboard View
    content = (
        <div className="h-full md:h-auto">
            <Dashboard 
                state={appState} 
                onSelectCategory={setActiveMode}
                onReset={handleReset}
            />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 hidden md:block">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveMode(null)}>
                <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                    <Users size={20} />
                </div>
                <span className="font-bold text-lg tracking-tight">SocialManager</span>
            </div>
         </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto md:p-6 p-0">
        {content}
      </main>
      
      {!appState && (
        <footer className="p-6 text-center text-xs text-slate-400">
            <p>Data is processed locally in your browser. No data is sent to any server.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
