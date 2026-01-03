import React, { useState } from 'react';
import { SearchChat } from './demos/SearchChat';
import { ImageStudio } from './demos/ImageStudio';
import { LiveVoice } from './demos/LiveVoice';
import { Globe, Image as ImageIcon, Mic } from 'lucide-react';

export const Playground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'image' | 'voice'>('search');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">AI Playground</h2>
        <p className="text-lg text-slate-600">
          Experience the power of Gemini models before you build.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === 'search' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" /> Search Grounding
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === 'image' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Image Studio
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === 'voice' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Mic className="w-4 h-4" /> Live Voice
          </button>
        </div>

        <div className="p-6 min-h-[500px]">
          {activeTab === 'search' && <SearchChat />}
          {activeTab === 'image' && <ImageStudio />}
          {activeTab === 'voice' && <LiveVoice />}
        </div>
      </div>
    </div>
  );
};