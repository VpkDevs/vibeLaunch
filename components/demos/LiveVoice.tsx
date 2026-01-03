import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, MicOff, Volume2, Activity } from 'lucide-react';

export const LiveVoice: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const [error, setError] = useState<string | null>(null);
  
  // Refs to hold state without triggering re-renders in callbacks
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const disconnect = () => {
    if (sessionRef.current) {
        try { sessionRef.current.close(); } catch (e) {}
        sessionRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    setConnected(false);
    setStatus('Disconnected');
  };

  const connect = async () => {
    setError(null);
    setStatus('Initializing Audio...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setStatus('Connecting to Gemini...');

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a helpful and quick-witted AI assistant.',
        },
        callbacks: {
          onopen: () => {
            setStatus('Connected! Speak now.');
            setConnected(true);
            
            // Audio Input Processing
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio) {
               try {
                   const audioCtx = outputAudioContext;
                   nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                   
                   const audioBuffer = await decodeAudioData(
                     decode(base64Audio),
                     audioCtx,
                     24000,
                     1
                   );
                   
                   const source = audioCtx.createBufferSource();
                   source.buffer = audioBuffer;
                   source.connect(audioCtx.destination);
                   
                   source.addEventListener('ended', () => {
                       sourcesRef.current.delete(source);
                   });
                   
                   source.start(nextStartTimeRef.current);
                   nextStartTimeRef.current += audioBuffer.duration;
                   sourcesRef.current.add(source);
               } catch (e) {
                   console.error("Audio decode error", e);
               }
            }
            
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(source => source.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setStatus('Disconnected');
            setConnected(false);
          },
          onerror: (e) => {
            console.error(e);
            setError('Connection error occurred.');
            disconnect();
          }
        }
      });
      
      // Keep session reference to close later if needed
      sessionPromise.then(sess => {
          sessionRef.current = sess;
      });

    } catch (e) {
      console.error(e);
      setError('Failed to access microphone or connect.');
      disconnect();
    }
  };

  // Helper functions
  function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className={`p-8 rounded-full transition-all duration-500 ${connected ? 'bg-green-100 shadow-[0_0_40px_rgba(74,222,128,0.4)] animate-pulse' : 'bg-slate-100'}`}>
        {connected ? <Activity className="w-16 h-16 text-green-600" /> : <MicOff className="w-16 h-16 text-slate-400" />}
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-slate-900">{connected ? 'Listening...' : 'Start Conversation'}</h3>
        <p className={`text-sm font-mono ${connected ? 'text-green-600' : 'text-slate-500'}`}>
          Status: {status}
        </p>
        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-1 rounded">{error}</p>}
      </div>

      <button
        onClick={connected ? disconnect : connect}
        className={`px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 ${
          connected 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
        } shadow-lg`}
      >
        {connected ? (
          <>Stop Conversation</>
        ) : (
          <>
            <Mic className="w-5 h-5" /> Connect Live API
          </>
        )}
      </button>

      <div className="max-w-md text-center text-sm text-slate-500">
        <p>Uses <strong>gemini-2.5-flash-native-audio-preview-09-2025</strong> for low-latency, real-time voice interaction.</p>
      </div>
    </div>
  );
};