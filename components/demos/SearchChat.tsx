import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Loader2, Link as LinkIcon } from 'lucide-react';

export const SearchChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    setLinks([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use gemini-3-flash-preview with googleSearch tool
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setResponse(result.text || "No text response generated.");
      
      // Extract grounding chunks
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const extractedLinks = chunks
          .filter((c: any) => c.web?.uri)
          .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
        setLinks(extractedLinks);
      }

    } catch (error) {
      console.error(error);
      setResponse("Error generating response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-2">Google Search Grounding</h3>
        <p className="text-sm text-slate-600 mb-4">
          Ask questions about recent events or facts. The model will use Google Search to find the answer.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="E.g., Who won the Super Bowl this year?"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {(response || loading) && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
           <div className="prose prose-slate max-w-none bg-white p-4 rounded-xl border border-slate-200">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                </div>
              ) : (
                <p>{response}</p>
              )}
           </div>
           
           {links.length > 0 && (
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
               <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                 <LinkIcon className="w-3 h-3" /> Sources
               </h4>
               <ul className="space-y-2">
                 {links.map((link, idx) => (
                   <li key={idx}>
                     <a 
                       href={link.uri} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-sm text-blue-600 hover:underline flex items-center gap-2 truncate"
                     >
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                       {link.title || link.uri}
                     </a>
                   </li>
                 ))}
               </ul>
             </div>
           )}
        </div>
      )}
    </div>
  );
};