import React from 'react';
import { AppState, RelationshipType } from '../types';
import { UserMinus, UserPlus, Users, ArrowRight } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onSelectCategory: (type: RelationshipType) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onSelectCategory, onReset }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
            <button onClick={onReset} className="text-sm text-slate-500 hover:text-slate-800 underline">Start Over</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Not Following Back (Urgent Action) */}
            <div 
                onClick={() => onSelectCategory('dont_follow_back')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-pink-200 cursor-pointer transition-all group"
            >
                <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UserMinus size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Not Following Back</h3>
                <div className="text-3xl font-bold text-pink-600 mb-2">{state.stats.dontFollowBack}</div>
                <p className="text-sm text-slate-500 mb-4">People you follow who don't follow you back.</p>
                <div className="flex items-center text-pink-600 text-sm font-medium">
                    Unfollow Tool <ArrowRight size={16} className="ml-1" />
                </div>
            </div>

            {/* Card 2: Fans (Opportunity) */}
            <div 
                onClick={() => onSelectCategory('fan')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-200 cursor-pointer transition-all group"
            >
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UserPlus size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Fans</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">{state.stats.fans}</div>
                <p className="text-sm text-slate-500 mb-4">People who follow you that you don't follow back.</p>
                <div className="flex items-center text-purple-600 text-sm font-medium">
                    Follow Tool <ArrowRight size={16} className="ml-1" />
                </div>
            </div>

            {/* Card 3: Mutuals (Safe) */}
            <div 
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 opacity-80"
            >
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mb-4">
                    <Users size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Mutuals</h3>
                <div className="text-3xl font-bold text-slate-800 mb-2">{state.stats.mutuals}</div>
                <p className="text-sm text-slate-500">You follow each other. No action needed.</p>
            </div>
        </div>
    </div>
  );
};
