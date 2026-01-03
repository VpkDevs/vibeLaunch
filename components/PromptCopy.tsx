import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { AIPrompt } from '../types';

interface PromptCopyProps {
  prompt: AIPrompt;
}

export const PromptCopy: React.FC<PromptCopyProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 border border-indigo-100 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-indigo-50 px-4 py-2 flex justify-between items-center border-b border-indigo-100">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Prompt Template: {prompt.label}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 bg-slate-50 font-mono text-sm text-slate-700 whitespace-pre-wrap">
        {prompt.text}
      </div>
    </div>
  );
};
