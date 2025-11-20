import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { Wifi, CheckCircle2, AlertCircle, Lock, Zap, Youtube, CreditCard, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { useSearchParams } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export const NFC: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activationKey, setActivationKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const { card, youtubeCard, updateYouTubeCard, updateCard } = useAppStore();
  const [activeTab, setActiveTab] = useState<'standard' | 'youtube'>('standard');

  useEffect(() => {
    if (searchParams.get('type') === 'youtube') {
      setActiveTab('youtube');
    }
  }, [searchParams]);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    // Simulate API call for activation
    setTimeout(() => {
      if (activationKey.length > 5) {
        setStatus('success');
        if (activeTab === 'youtube' && youtubeCard) {
            updateYouTubeCard({ nfcActive: true });
        } else if (activeTab === 'standard') {
            updateCard({ nfcActive: true });
        }
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  const isAlreadyActive = activeTab === 'youtube' ? youtubeCard?.nfcActive : card.nfcActive;

  const getTargetUrl = () => {
      const origin = window.location.origin + window.location.pathname;
      // Remove trailing slash if present to avoid double slash issues with HashRouter
      const baseUrl = origin.endsWith('/') ? origin.slice(0, -1) : origin;
      
      if (activeTab === 'youtube') {
          return `${baseUrl}/#/youtube-profile`;
      }
      return `${baseUrl}/#/preview`; // Default Business Card
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900 font-serif tracking-tight">Activate NFC Card</h1>
          <p className="text-zinc-500">Link your physical TOMO BUSINESS card to your digital profile.</p>
        </div>
        
        {/* Type Selector */}
        <div className="flex justify-center mb-8">
             <div className="flex p-1 bg-zinc-100 rounded-xl">
                 <button 
                    onClick={() => { setActiveTab('standard'); setStatus('idle'); setActivationKey(''); }}
                    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'standard' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                 >
                    <CreditCard size={16} /> Business Card
                 </button>
                 <button 
                    onClick={() => { setActiveTab('youtube'); setStatus('idle'); setActivationKey(''); }}
                    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'youtube' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                 >
                    <Youtube size={16} /> Creator Card
                 </button>
             </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-soft relative overflow-hidden">
          {activeTab === 'youtube' && !youtubeCard ? (
              <div className="text-center py-12">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                      <Youtube size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">No Creator Card Found</h3>
                  <p className="text-zinc-500 text-sm mt-2 mb-6 max-w-xs mx-auto">You need to generate a YouTube Business Card in your Dashboard before you can activate its physical counterpart.</p>
                  <Button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
              </div>
          ) : (
          <>
            <div className="flex flex-col items-center mb-8">
                
                {/* Card Preview Container */}
                <div className="relative w-80 h-48 transition-all duration-500 transform hover:scale-105 cursor-default select-none perspective-1000">
                    
                    {/* Locked State Overlay */}
                    {status !== 'success' && !isAlreadyActive && (
                        <div className="absolute inset-0 z-30 bg-zinc-900/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-white border border-white/10 transition-all duration-500">
                            <div className="bg-black/40 p-4 rounded-full border border-white/10 shadow-2xl mb-3 backdrop-blur-md ring-1 ring-white/5">
                                <Lock size={24} className="text-white/90 drop-shadow-md" />
                            </div>
                            <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/90 drop-shadow-lg">Device Locked</p>
                            <p className="text-[10px] text-white/60 mt-1.5 font-medium tracking-wide">Activation Required</p>
                        </div>
                    )}

                    {activeTab === 'standard' ? (
                        /* Standard Card Visual */
                        <div className={`w-full h-full rounded-xl relative overflow-hidden shadow-2xl transition-all duration-700 border border-zinc-700/50 group ${status === 'success' || isAlreadyActive ? 'brightness-105 shadow-zinc-900/20' : 'grayscale-[0.3] brightness-90'}`}>
                            <div className="absolute inset-0 bg-[#0a0a0a]"></div>
                            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/60 pointer-events-none"></div>
                            
                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2.5">
                                        <Logo iconOnly className="w-7 h-7 text-white brightness-125" />
                                        <span className="text-white font-serif font-bold text-sm tracking-widest drop-shadow-md opacity-90">TOMO BUSINESS</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60 mix-blend-screen">
                                        {isAlreadyActive ? <Wifi size={22} className="text-green-400 rotate-90 drop-shadow-md" /> : <Wifi size={22} className="text-white rotate-90 drop-shadow-md" />}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-white/40 text-[8px] uppercase tracking-[0.25em] mb-2.5 font-medium">Cardholder</p>
                                            <p className="text-white/90 font-medium text-sm tracking-[0.15em] font-mono drop-shadow-md">{card.displayName.toUpperCase()}</p>
                                        </div>
                                        <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#c5a028] relative overflow-hidden shadow-inner border border-[#a08020] opacity-90">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30 mix-blend-multiply"></div>
                                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20"></div>
                                            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/20"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* YouTube Creator Card Visual */
                        <div className={`w-full h-full rounded-xl relative overflow-hidden shadow-2xl transition-all duration-700 border border-zinc-800 group ${status === 'success' || isAlreadyActive ? 'brightness-105 shadow-red-900/20' : 'grayscale-[0.5] brightness-90'} ${youtubeCard?.settings.theme === 'dark' ? 'bg-zinc-900' : 'bg-red-700'}`}>
                            <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${youtubeCard?.settings.theme === 'dark' ? 'bg-red-600/20' : 'bg-black/30'}`}></div>
                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white p-0.5 overflow-hidden border border-zinc-800 shadow-lg">
                                            <img src={youtubeCard?.logoUrl} className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold text-sm leading-tight">{youtubeCard?.channelName}</h5>
                                            <p className="text-white/60 text-[10px] font-medium">{youtubeCard?.handle}</p>
                                        </div>
                                    </div>
                                    {isAlreadyActive ? <Wifi size={20} className="text-green-400 rotate-90" /> : <Wifi size={20} className="text-white/50 rotate-90" />}
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="flex gap-2">
                                        <div className="px-2 py-0.5 bg-white/10 rounded text-white text-[8px] font-bold uppercase tracking-wider">{youtubeCard?.subscribers} Subs</div>
                                    </div>
                                    <p className="text-white/40 text-[8px] uppercase tracking-[0.2em]">Creator ID</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Success Shine Effect */}
                    {(status === 'success' || isAlreadyActive) && (
                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45 translate-x-[-100%] pointer-events-none" style={{ animation: 'shimmer 2s infinite' }}></div>
                    )}
                </div>

                <p className="text-sm text-zinc-500 text-center max-w-xs mt-8 leading-relaxed">
                {(status === 'success' || isAlreadyActive)
                    ? `Your ${activeTab === 'youtube' ? 'Creator' : 'Business'} card is active! You can now tap it on any compatible smartphone.` 
                    : "Enter the 12-digit activation code located on the back of your card packaging to unlock."}
                </p>
            </div>

            {(status === 'success' || isAlreadyActive) ? (
                <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-5 py-8 bg-zinc-50 rounded-xl border border-zinc-100"
                >
                    <div className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-zinc-200 ring-4 ring-white">
                    <CheckCircle2 size={32} />
                    </div>
                    <div className="max-w-sm mx-auto">
                        <h3 className="text-xl font-bold text-zinc-900">Activation Complete</h3>
                        <p className="text-zinc-500 text-sm mt-1">
                            {activeTab === 'youtube' 
                                ? `Linked to Creator Profile: ${youtubeCard?.handle}` 
                                : `Linked to Business Profile: ${card.displayName}`}
                        </p>
                        
                        {/* URL Display */}
                        <div className="mt-3 p-2 bg-zinc-100 rounded-lg text-xs text-zinc-500 font-mono truncate select-all cursor-text border border-zinc-200 flex justify-center">
                            {getTargetUrl()}
                        </div>
                    </div>
                    
                    <div className="flex justify-center gap-3 pt-2">
                        <Button variant="outline" onClick={() => setStatus('idle')}>Activate Another</Button>
                        <Button variant="primary" onClick={() => window.open(getTargetUrl(), '_blank')}>
                             <ExternalLink size={16} className="mr-2" /> Test Activation Link
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <form onSubmit={handleActivate} className="space-y-6 max-w-md mx-auto relative z-30">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Activation Key</label>
                    <div className="relative group">
                        <input 
                        type="text" 
                        value={activationKey}
                        onChange={(e) => setActivationKey(e.target.value.toUpperCase())}
                        placeholder="XXXX-XXXX-XXXX"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-12 pr-4 py-3 text-center text-lg tracking-[0.2em] text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all placeholder:tracking-normal placeholder:text-zinc-300 font-mono uppercase group-hover:bg-white"
                        disabled={status === 'processing'}
                        maxLength={14}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors">
                            <Zap size={18} />
                        </div>
                    </div>
                </div>

                {status === 'error' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 justify-center"
                    >
                    <AlertCircle size={16} />
                    <span>Invalid activation key. Please check and try again.</span>
                    </motion.div>
                )}

                <Button 
                    className="w-full h-12 shadow-lg shadow-zinc-200 text-base font-medium tracking-wide" 
                    disabled={status === 'processing' || !activationKey}
                >
                    {status === 'processing' ? 'Verifying Key...' : 'Unlock Card'}
                </Button>
                </form>
            )}
          </>
          )}
        </div>
        
        {/* Help Section */}
        <div className="text-center pt-4 border-t border-zinc-100 mt-8">
             <p className="text-xs text-zinc-400">
                 Need help finding your key? <a href="#" className="underline hover:text-zinc-600 transition-colors">View guide</a> or <a href="#" className="underline hover:text-zinc-600 transition-colors">Contact Support</a>.
             </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) rotate(45deg); }
          100% { transform: translateX(150%) rotate(45deg); }
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
    </Layout>
  );
};