
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Helper functions for base64 encoding/decoding as required by SDK
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

const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcription, setTranscription] = useState('');
  const [selectedDialect, setSelectedDialect] = useState('English');

  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const dialects = [
    { name: 'Swahili', dialect: 'Coastal' },
    { name: 'Hindi', dialect: 'Bhojpuri' },
    { name: 'English', dialect: 'Regional' },
    { name: 'Spanish', dialect: 'Latin' }
  ];

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextInRef.current) audioContextInRef.current.close();
    if (audioContextOutRef.current) audioContextOutRef.current.close();
    
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    
    setIsActive(false);
    setStatus('Standby');
    setTranscription('');
  };

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      setIsActive(true);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Listening...');
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmData = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmData });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }

            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setStatus('Speaking...');
              const outCtx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(audioData), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('Listening...');
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
            
            if (message.serverContent?.turnComplete) {
              // Reset local transcription buffer for new turn if needed
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setStatus('Connection Error');
            stopSession();
          },
          onclose: () => {
            setStatus('Session Closed');
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          outputAudioTranscription: {},
          systemInstruction: `You are a world-class senior agronomist. 
          Respond concisely to the farmer. You can communicate in ${selectedDialect}. 
          Provide expert diagnosis of plant pests, fungi, and nutrient issues.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session:', err);
      setStatus('Access Denied');
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-between py-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 italic tracking-tight">AI Voice Agronomist</h2>
        <div className="flex items-center justify-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{status}</p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="relative group">
          <div className={`absolute inset-0 bg-emerald-500 rounded-full blur-[80px] transition-all duration-1000 ${isActive ? 'opacity-40 scale-150' : 'opacity-0 scale-50'}`}></div>
          
          <button 
            onClick={isActive ? stopSession : startSession}
            className={`relative w-44 h-44 rounded-full flex items-center justify-center text-white transition-all duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-90 ${
              isActive ? 'bg-rose-500 shadow-rose-200' : 'bg-slate-900 shadow-slate-200'
            }`}
          >
            {status === 'Connecting...' ? (
              <i className="fas fa-circle-notch animate-spin text-5xl"></i>
            ) : isActive ? (
              <div className="flex space-x-2 items-center">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-2 bg-white rounded-full ${status === 'Speaking...' ? 'animate-pulse' : 'animate-bounce'}`} 
                    style={{ 
                      height: status === 'Speaking...' ? '24px' : '40px',
                      animationDelay: `${i*0.1}s` 
                    }}></div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <i className="fas fa-microphone text-5xl mb-2"></i>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Tap to Start</span>
              </div>
            )}
          </button>
        </div>

        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center transform transition-all">
          <p className={`text-xl font-black leading-tight transition-all duration-300 ${isActive ? 'text-slate-900' : 'text-slate-300 italic'}`}>
            {transcription || (isActive ? "Listening for your questions..." : "Say 'Hey AgroScan' to begin diagnostics...")}
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg space-y-6">
        <h4 className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Regional Dialect</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dialects.map(d => (
            <button
              key={d.name}
              disabled={isActive}
              onClick={() => setSelectedDialect(d.name)}
              className={`p-4 rounded-[1.5rem] border text-center transition-all ${
                selectedDialect === d.name 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-50'
              }`}
            >
              <p className="text-xs font-black">{d.name}</p>
              <p className="text-[9px] opacity-60 font-bold uppercase">{d.dialect}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
