import React, { useState, useEffect } from 'react';
import { AnalyzedProfile, RelationshipType } from '../types';
import { CheckCircle2, ExternalLink, ArrowLeft, Layers, CheckCheck } from 'lucide-react';

interface ActionListProps {
  data: AnalyzedProfile[];
  mode: RelationshipType; // 'dont_follow_back' -> Unfollow mode, 'fan' -> Follow mode
  onBack: () => void;
  onUpdate: (updatedData: AnalyzedProfile[]) => void;
}

const BATCH_SIZE = 25;

export const ActionList: React.FC<ActionListProps> = ({ data, mode, onBack, onUpdate }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('pending');

  // Filter data to only show relevant items for this mode
  // Note: Parent component passes the full dataset or filtered dataset. 
  // We assume `data` passed here is ALREADY filtered to the specific type we are working on.

  const handleOpenProfile = (id: string, url: string) => {
    window.open(url, '_blank');
    const newData = data.map(acc => 
      acc.id === id && acc.status === 'pending' ? { ...acc, status: 'visited' as const } : acc
    );
    onUpdate(newData);
  };

  const handleMarkDone = (id: string) => {
    const newData = data.map(acc => 
      acc.id === id ? { ...acc, status: 'done' as const } : acc
    );
    onUpdate(newData);
  };
  
  const handleUndo = (id: string) => {
    const newData = data.map(acc => 
        acc.id === id ? { ...acc, status: 'pending' as const } : acc
    );
    onUpdate(newData);
  };

  const handleBatchOpen = () => {
    const pendingAccounts = data.filter(acc => acc.status === 'pending');
    const batch = pendingAccounts.slice(0, BATCH_SIZE);

    if (batch.length === 0) return;

    batch.forEach(acc => {
        window.open(acc.profileUrl, '_blank');
    });

    const batchIds = new Set(batch.map(b => b.id));
    const newData = data.map(acc => 
        batchIds.has(acc.id) ? { ...acc, status: 'visited' as const } : acc
    );
    onUpdate(newData);
  };

  const handleBatchMarkDone = () => {
    const newData = data.map(acc => 
        acc.status === 'visited' ? { ...acc, status: 'done' as const } : acc
    );
    onUpdate(newData);
  };

  const filteredAccounts = data.filter(acc => {
    if (filter === 'all') return true;
    if (filter === 'done') return acc.status === 'done';
    return acc.status === 'pending' || acc.status === 'visited';
  });

  const pendingCount = data.filter(a => a.status !== 'done').length;
  const visitedCount = data.filter(a => a.status === 'visited').length;
  const doneCount = data.filter(a => a.status === 'done').length;
  const progress = Math.round((doneCount / data.length) * 100) || 0;
  const purelyPendingCount = data.filter(a => a.status === 'pending').length;

  const actionVerb = mode === 'dont_follow_back' ? 'Unfollow' : 'Follow';
  const themeColor = mode === 'dont_follow_back' ? 'pink' : 'purple';
  const ThemeIcon = mode === 'dont_follow_back' ? ExternalLink : ExternalLink;

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-slate-50 relative h-screen md:h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 p-1 -ml-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-base font-bold text-slate-800">{actionVerb} Queue</h1>
            <p className="text-xs text-slate-500">{pendingCount} remaining</p>
          </div>
          <div className="w-8"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ease-out bg-${themeColor}-500`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Batch Action */}
        <div className="mb-4 space-y-2">
            <button 
                onClick={handleBatchOpen}
                disabled={purelyPendingCount === 0}
                className={`
                    w-full flex items-center justify-center py-3 rounded-lg text-sm font-semibold transition-all
                    ${purelyPendingCount > 0 
                        ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800 active:scale-[0.98]' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
            >
                <Layers size={16} className="mr-2" />
                Open Next {Math.min(BATCH_SIZE, purelyPendingCount)} Pending
            </button>

            {visitedCount > 0 && (
                 <button 
                 onClick={handleBatchMarkDone}
                 className={`w-full flex items-center justify-center py-3 rounded-lg text-sm font-semibold transition-all text-white shadow-md active:scale-[0.98] bg-green-600 hover:bg-green-700`}
             >
                 <CheckCheck size={16} className="mr-2" />
                 Mark {visitedCount} Visited as Done
             </button>
            )}

            <p className="text-[10px] text-center text-slate-400">
                Note: Allow popups to open multiple tabs.
            </p>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {(['pending', 'done', 'all'] as const).map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 text-xs font-medium py-1.5 rounded-md capitalize transition-all ${
                        filter === f 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filteredAccounts.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-slate-400">
             <CheckCircle2 size={48} className="mb-4 opacity-20" />
             <p>No accounts found in this filter.</p>
           </div>
        ) : (
          filteredAccounts.map((acc) => (
            <div 
                key={acc.id} 
                className={`
                    flex flex-col bg-white border rounded-xl p-4 transition-all duration-200 shadow-sm
                    ${acc.status === 'done' ? 'opacity-60 border-slate-100 bg-slate-50' : 'border-slate-200'}
                    ${acc.status === 'visited' ? `border-${themeColor}-200 ring-1 ring-${themeColor}-50` : ''}
                `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${acc.status === 'done' ? 'bg-green-400' : acc.status === 'visited' ? 'bg-orange-400' : 'bg-slate-300'}`}></div>
                    <span className="font-semibold text-slate-800 text-lg">@{acc.username}</span>
                </div>
                {acc.status === 'done' && (
                    <button onClick={() => handleUndo(acc.id)} className="text-xs text-slate-400 hover:text-slate-600 underline">Undo</button>
                )}
              </div>

              {acc.status !== 'done' && (
                  <div className="flex space-x-3">
                    <button
                        onClick={() => handleOpenProfile(acc.id, acc.profileUrl)}
                        className={`
                            flex-1 flex items-center justify-center py-3 rounded-lg font-medium transition-colors
                            ${acc.status === 'visited' 
                                ? 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50' 
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200'}
                        `}
                    >
                        <ThemeIcon size={18} className="mr-2" />
                        {acc.status === 'visited' ? 'Open Again' : 'Open Profile'}
                    </button>
                    
                    <button
                        onClick={() => handleMarkDone(acc.id)}
                        className={`
                            flex-1 flex items-center justify-center py-3 rounded-lg font-medium transition-colors
                            ${acc.status === 'visited' 
                                ? 'bg-green-600 text-white shadow-md shadow-green-100 hover:bg-green-700' 
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}
                        `}
                    >
                        <CheckCircle2 size={18} className="mr-2" />
                        Done
                    </button>
                  </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
