import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Wand2, ImagePlus, Key } from 'lucide-react';

export const ImageStudio: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState('1K');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [keySelected, setKeySelected] = useState(false);

  // Check key selection only when switching to generate mode which requires the Pro model
  const checkKey = async () => {
    if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
      setKeySelected(true);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      await checkKey();
    }
  };

  const handleGenerate = async () => {
    if (!keySelected) {
        await handleSelectKey();
        if(!keySelected && window.aistudio && !(await window.aistudio.hasSelectedApiKey())) return;
        setKeySelected(true);
    }

    setLoading(true);
    setResultImage(null);

    try {
      // Must recreate instance to ensure new key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            imageSize: imageSize as "1K" | "2K" | "4K",
            aspectRatio: "1:1"
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('Generation failed. Ensure you have selected a valid paid API key project.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!uploadImage) {
        alert("Please upload an image first.");
        return;
    }
    setLoading(true);
    setResultImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Remove header from base64 string for API
      const base64Data = uploadImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
                inlineData: {
                    mimeType: 'image/png',
                    data: base64Data
                }
            },
            { text: prompt || "Enhance this image" },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('Editing failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-100 pb-4">
        <button 
          onClick={() => { setMode('generate'); checkKey(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'generate' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          Generate (Pro)
        </button>
        <button 
          onClick={() => setMode('edit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'edit' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          Edit (Flash)
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
        
        {mode === 'generate' && !keySelected && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                <div className="text-sm text-yellow-800">
                    High-quality generation requires a paid API key selection.
                </div>
                <button 
                    onClick={handleSelectKey}
                    className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                >
                    <Key className="w-4 h-4" /> Select Key
                </button>
            </div>
        )}

        {mode === 'edit' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Source Image</label>
            <div className="flex items-center gap-4">
               <label className="cursor-pointer bg-white border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2">
                 <ImagePlus className="w-4 h-4 text-slate-500" />
                 <span className="text-sm text-slate-600">Choose File</span>
                 <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
               </label>
               {uploadImage && (
                 <div className="h-12 w-12 rounded overflow-hidden border border-slate-200">
                   <img src={uploadImage} alt="Preview" className="w-full h-full object-cover" />
                 </div>
               )}
            </div>
          </div>
        )}

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={mode === 'generate' ? "A futuristic city on Mars..." : "Add a retro filter..."}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none h-24"
                />
            </div>

            {mode === 'generate' && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
                    <select 
                        value={imageSize}
                        onChange={(e) => setImageSize(e.target.value)}
                        className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                        <option value="1K">1K (1024x1024)</option>
                        <option value="2K">2K (2048x2048)</option>
                        <option value="4K">4K (4096x4096)</option>
                    </select>
                </div>
            )}

            <button
                onClick={mode === 'generate' ? handleGenerate : handleEdit}
                disabled={loading || (mode === 'edit' && !uploadImage)}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {mode === 'generate' ? 'Generate Image' : 'Edit Image'}
            </button>
        </div>
      </div>

      {resultImage && (
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-center animate-in fade-in zoom-in-95">
          <img src={resultImage} alt="Result" className="max-w-full rounded-lg max-h-[500px]" />
        </div>
      )}
    </div>
  );
};