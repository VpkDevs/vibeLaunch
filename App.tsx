import React, { useState, useEffect } from 'react';
import { guideData, deploymentOptions } from './data';
import { PromptCopy } from './components/PromptCopy';
import { GeminiHelper } from './components/GeminiHelper';
import { Playground } from './components/Playground';
import { 
  Menu, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Rocket,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  FlaskConical
} from 'lucide-react';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState(guideData[0].id);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'guide' | 'playground'>('guide');

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionId, viewMode]);

  const activeSection = guideData.find(s => s.id === activeSectionId) || guideData[0];
  const activeIndex = guideData.findIndex(s => s.id === activeSectionId);
  const nextSection = guideData[activeIndex + 1];

  const handleComplete = (id: string) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(id);
    setCompletedSections(newCompleted);
    if (nextSection) {
      setActiveSectionId(nextSection.id);
    }
  };

  const progressPercentage = Math.round((completedSections.size / guideData.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Rocket className="text-indigo-600 w-5 h-5" /> VibeLaunch
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:block flex flex-col
      `}>
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900">
             <Rocket className="text-indigo-600 w-6 h-6" /> VibeLaunch
          </h1>
          <p className="text-xs text-slate-500 mt-2">Deployment for Humans</p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <button 
              onClick={() => { setViewMode('guide'); setSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold mb-2 flex items-center gap-2 ${viewMode === 'guide' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <CheckCircle2 className="w-4 h-4" /> Guide
            </button>
            
            {viewMode === 'guide' && (
              <>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 mt-4">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <nav className="space-y-1">
                  {guideData.map((section, idx) => {
                    const isActive = section.id === activeSectionId;
                    const isCompleted = completedSections.has(section.id);

                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSectionId(section.id);
                          setSidebarOpen(false);
                        }}
                        className={`
                          w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 text-sm transition-colors
                          ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}
                        `}
                      >
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs border shrink-0
                          ${isCompleted 
                            ? 'bg-green-100 border-green-200 text-green-700' 
                            : isActive 
                              ? 'bg-indigo-100 border-indigo-200 text-indigo-700' 
                              : 'bg-white border-slate-200 text-slate-400'}
                        `}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className="truncate">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
             <button 
              onClick={() => { setViewMode('playground'); setSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${viewMode === 'playground' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FlaskConical className="w-4 h-4" /> AI Playground
            </button>
            {viewMode === 'playground' && (
              <p className="text-xs text-slate-500 px-3 mt-2">
                Test the Gemini features you can build into your apps.
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
        
        {viewMode === 'playground' ? (
          <Playground />
        ) : (
          <>
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Clock className="w-4 h-4" /> 
                <span>Est. time: {activeSection.estimatedTime}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 font-display">
                {activeSection.title}
              </h2>
              {activeSection.subtitle && (
                 <p className="text-lg text-slate-600">{activeSection.subtitle}</p>
              )}
            </div>

            {/* Dynamic Content */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Custom Logic for Options Selection */}
              {activeSection.id === 'intro' && (
                <div className="mb-8 grid md:grid-cols-3 gap-4">
                  {deploymentOptions.map(opt => (
                    <div key={opt.name} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900">{opt.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${opt.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {opt.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{opt.description}</p>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Best For</div>
                      <div className="text-xs text-slate-700">{opt.bestFor}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Core Content */}
              <div className="prose prose-slate prose-lg max-w-none">
                {activeSection.content}
              </div>

              {/* Warning Box */}
              {activeSection.warning && (
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                  <div className="bg-amber-100 p-2 rounded-full h-fit shrink-0">
                    <AlertOctagon className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-lg mb-1">{activeSection.warning.title}</h4>
                    <p className="text-amber-800 text-sm leading-relaxed">{activeSection.warning.text}</p>
                  </div>
                </div>
              )}

              {/* Prompts Section */}
              {activeSection.prompts && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    Stuck? Copy-Paste These Prompts
                  </h3>
                  <div className="space-y-4">
                    {activeSection.prompts.map((prompt, idx) => (
                      <PromptCopy key={idx} prompt={prompt} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 flex justify-between items-center">
               <button 
                 onClick={() => {
                   const prevIdx = activeIndex - 1;
                   if (prevIdx >= 0) setActiveSectionId(guideData[prevIdx].id);
                 }}
                 disabled={activeIndex === 0}
                 className="px-6 py-3 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 font-medium transition-colors"
               >
                 &larr; Previous
               </button>

               <button
                 onClick={() => handleComplete(activeSection.id)}
                 className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
               >
                 {nextSection ? (
                   <>
                     Mark Complete & Next <ChevronRight className="w-4 h-4" />
                   </>
                 ) : (
                   <>
                     Finish Guide <Rocket className="w-4 h-4" />
                   </>
                 )}
               </button>
            </div>
          </>
        )}

      </main>

      {/* AI Chat Helper */}
      <GeminiHelper />
    </div>
  );
};

export default App;