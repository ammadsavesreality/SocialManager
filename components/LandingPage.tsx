import React, { useState } from 'react';
import { Upload, Instagram, HelpCircle, ChevronDown, ChevronUp, ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';
import { BaseProfile } from '../types';
import { parseData } from '../utils/csvParser';

interface LandingPageProps {
  onDataReady: (followers: BaseProfile[], following: BaseProfile[]) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onDataReady }) => {
  const [followersFile, setFollowersFile] = useState<File | null>(null);
  const [followingFile, setFollowingFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(true); // Default to true now to guide them

  const handleProcess = async () => {
    if (!followersFile || !followingFile) {
        setError("Please select both files.");
        return;
    }

    setIsProcessing(true);
    setError(null);

    try {
        const [followers, following] = await Promise.all([
            parseData(followersFile),
            parseData(followingFile)
        ]);

        if (followers.length === 0) throw new Error("Followers file appears empty or invalid.");
        if (following.length === 0) throw new Error("Following file appears empty or invalid.");

        onDataReady(followers, following);
    } catch (e: any) {
        setError(e.message || "Error processing files. Please check the format.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto min-h-[60vh]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white mb-6 shadow-lg">
          <Instagram size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Social Manager</h1>
        <p className="text-slate-500 text-lg">Upload your data to analyze relationships.</p>
      </div>

      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        
        {/* Help / Guide Section */}
        <div className="mb-6 border-b border-slate-100 pb-4">
             <button 
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-full justify-between focus:outline-none"
             >
                <span className="flex items-center"><HelpCircle size={16} className="mr-2 text-pink-500"/> How to get your data</span>
                {showHelp ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
             </button>
             
             {showHelp && (
                 <div className="mt-4 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl space-y-4 animate-fadeIn border border-slate-100">
                    
                    {/* The Explanation */}
                    <div className="flex items-start bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <AlertCircle size={16} className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-xs text-amber-800 leading-relaxed">
                            <strong>Why can't I just enter my username?</strong><br/>
                            Instagram security prevents tools from scanning your profile automatically. Using the official Data Export is the only safe way to get accurate results without risking an account ban.
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Step 1</span>
                            <a 
                                href="https://www.instagram.com/download/request/" 
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 px-3 py-1.5 rounded-full transition-colors"
                            >
                                Open Instagram Export Tool <ExternalLink size={12} className="ml-1"/>
                            </a>
                        </div>
                        <p className="text-xs">
                            Request a download in <strong>JSON</strong> format. It usually arrives via email within a few minutes.
                        </p>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-3">
                         <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider block mb-2">Step 2</span>
                        <p className="text-xs">
                            Unzip the file you receive. Look inside the <code>followers_and_following</code> folder for:
                        </p>
                        <div className="flex space-x-2 mt-2">
                            <code className="bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-600 font-mono">followers_1.json</code>
                            <code className="bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-600 font-mono">following.json</code>
                        </div>
                    </div>
                 </div>
             )}
        </div>

        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {/* Followers Upload */}
                <div className="relative group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>
                        Followers File
                    </label>
                    <div className={`
                        border-2 border-dashed rounded-xl p-4 transition-all text-center cursor-pointer relative overflow-hidden
                        ${followersFile ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-100 ring-offset-2' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                    `}>
                        <input 
                            type="file" 
                            accept=".json,.csv"
                            onChange={(e) => setFollowersFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="pointer-events-none">
                            {followersFile ? (
                                <div className="flex items-center justify-center text-pink-700 font-medium">
                                    <FileCheckIcon />
                                    <span className="ml-2 truncate text-sm max-w-[180px]">{followersFile.name}</span>
                                </div>
                            ) : (
                                <div className="text-slate-400 text-sm py-1">
                                    Drop <code className="text-slate-500 font-mono text-xs">followers_1.json</code> here
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Following Upload */}
                <div className="relative group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        Following File
                    </label>
                    <div className={`
                        border-2 border-dashed rounded-xl p-4 transition-all text-center cursor-pointer relative overflow-hidden
                        ${followingFile ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-100 ring-offset-2' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                    `}>
                        <input 
                            type="file" 
                            accept=".json,.csv"
                            onChange={(e) => setFollowingFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="pointer-events-none">
                            {followingFile ? (
                                <div className="flex items-center justify-center text-purple-700 font-medium">
                                    <FileCheckIcon />
                                    <span className="ml-2 truncate text-sm max-w-[180px]">{followingFile.name}</span>
                                </div>
                            ) : (
                                <div className="text-slate-400 text-sm py-1">
                                    Drop <code className="text-slate-500 font-mono text-xs">following.json</code> here
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start animate-fadeIn">
                    <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5"/>
                    <span>{error}</span>
                </div>
            )}

            <button 
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-slate-200 active:scale-[0.99]"
            >
                {isProcessing ? 'Analyzing Data...' : 'Start Analysis'}
                {!isProcessing && <ArrowRight size={18} className="ml-2" />}
            </button>
        </div>
      </div>
      <p className="mt-6 text-xs text-slate-400 max-w-sm text-center">
          Privacy Note: All processing happens directly in your browser. Your data is never uploaded to any server.
      </p>
    </div>
  );
};

// Small helper components for icons
const FileCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
