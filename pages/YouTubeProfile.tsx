import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { useSearchParams } from 'react-router-dom';
import { Share2, Users, Play, Eye, Youtube, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { cn } from '../lib/utils';
import { db } from '../lib/database';

export const YouTubeProfile: React.FC = () => {
  const { youtubeCard: storeYoutubeCard } = useAppStore();
  const [searchParams] = useSearchParams();
  const [youtubeCard, setYoutubeCard] = useState(storeYoutubeCard);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCard = async () => {
      const cardId = searchParams.get('id');
      
      if (cardId) {
        // Load from database using URL parameter
        try {
          const card = await db.getYouTubeCardById(cardId);
          
          if (card) {
            setYoutubeCard({
              channelName: card.channel_name,
              handle: card.handle,
              subscribers: card.subscribers,
              videosCount: card.videos_count,
              logoUrl: card.logo_url,
              bannerUrl: card.banner_url,
              description: card.description,
              totalViews: card.total_views,
              location: card.location,
              channelUrl: card.channel_url,
              nfcActive: card.nfc_active || false,
              settings: {
                showSubscribers: card.show_subscribers !== false,
                showVideos: card.show_videos !== false,
                theme: card.theme || 'dark'
              }
            });
          }
        } catch (error) {
          console.error('Error loading YouTube card:', error);
        }
      } else if (storeYoutubeCard) {
        setYoutubeCard(storeYoutubeCard);
      }
      
      setTimeout(() => setLoading(false), 800);
    };
    
    loadCard();
  }, [searchParams, storeYoutubeCard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner className="w-16 h-16 brightness-150" text="Loading Creator Profile..." />
      </div>
    );
  }

  if (!youtubeCard) {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
            <Youtube size={48} className="text-zinc-700 mb-4" />
            <h2 className="text-xl font-bold mb-2">Card Not Found</h2>
            <p className="text-zinc-500 max-w-md">
                It looks like this YouTube Creator Card hasn't been generated yet. 
                Please create one in your TOMO BUSINESS Dashboard.
            </p>
            <a href="/" className="mt-6 px-6 py-2 bg-zinc-800 rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors">Return Home</a>
        </div>
    )
  }

  const theme = youtubeCard.settings.theme || 'dark';
  const isRedTheme = theme === 'red';

  // Dynamic Styles based on Theme
  const bgClass = isRedTheme ? 'bg-[#1a0505]' : 'bg-zinc-950';
  const selectionClass = isRedTheme ? 'selection:bg-white selection:text-red-900' : 'selection:bg-red-600 selection:text-white';
  const accentColor = isRedTheme ? 'text-red-400' : 'text-red-500';
  const statBgClass = isRedTheme ? 'bg-red-900/20 border-red-500/20' : 'bg-zinc-900/60 border-white/5';
  const buttonClass = isRedTheme 
    ? 'bg-white text-red-900 hover:bg-red-50 shadow-white/10' 
    : 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20';

  return (
    <div className={cn("min-h-screen text-white font-sans overflow-x-hidden transition-colors duration-500", bgClass, selectionClass)}>
        {/* Ambient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className={cn("absolute top-[-20%] right-[-10%] w-[600px] h-[600px] blur-[120px] rounded-full opacity-50", isRedTheme ? "bg-red-600/30" : "bg-red-600/20")}></div>
            <div className={cn("absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] blur-[100px] rounded-full opacity-50", isRedTheme ? "bg-red-900/20" : "bg-zinc-800/30")}></div>
        </div>

        <div className={cn("relative z-10 max-w-md mx-auto min-h-screen backdrop-blur-sm shadow-2xl border-x flex flex-col", isRedTheme ? "bg-red-950/30 border-red-900/20" : "bg-black/40 border-white/5")}>
            {/* Banner */}
            <div className="h-60 w-full relative group">
                <div className={cn("absolute inset-0 overflow-hidden", isRedTheme ? "bg-red-950" : "bg-zinc-900")}>
                    {youtubeCard.bannerUrl ? (
                        <motion.img 
                            initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
                            src={youtubeCard.bannerUrl} 
                            className="w-full h-full object-cover opacity-80" 
                            alt="Banner" 
                        />
                    ) : (
                        <div className={cn("w-full h-full bg-gradient-to-br", isRedTheme ? "from-red-800 to-black" : "from-zinc-800 to-black")}></div>
                    )}
                    <div className={cn("absolute inset-0 bg-gradient-to-b", isRedTheme ? "from-black/20 via-transparent to-[#1a0505]" : "from-black/20 via-transparent to-zinc-950")}></div>
                </div>
                
                <div className="absolute top-6 right-6 z-20">
                    <button 
                        onClick={() => setShowQR(true)} 
                        className="w-10 h-10 bg-black/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all shadow-lg"
                    >
                        <Share2 size={18} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Profile Header */}
            <div className="px-6 -mt-20 relative flex-1">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="relative"
                >
                    <div className={cn("w-36 h-36 rounded-full border-4 shadow-2xl overflow-hidden relative z-10", isRedTheme ? "border-[#1a0505] bg-red-950" : "border-zinc-950 bg-zinc-900")}>
                        <img src={youtubeCard.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                    </div>
                    {/* Online/Live Indicator (Mock) */}
                    <div className="absolute bottom-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center bg-black border border-white/10">
                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    </div>
                </motion.div>
                
                <div className="mt-5">
                    <motion.h1 
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} 
                        className="text-3xl font-bold tracking-tight text-white"
                    >
                        {youtubeCard.channelName}
                    </motion.h1>
                    <motion.div 
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} 
                        className="flex flex-wrap items-center gap-3 mt-2 font-medium"
                    >
                        <span className={accentColor}>{youtubeCard.handle}</span>
                        {youtubeCard.location && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-white/5 rounded-full border border-white/5 text-zinc-400">
                                <MapPin size={10} /> {youtubeCard.location}
                            </span>
                        )}
                    </motion.div>
                </div>

                {/* Creator Stats */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                    className="grid grid-cols-3 gap-3 mt-8"
                >
                    {youtubeCard.settings.showSubscribers && (
                        <div className={cn("rounded-2xl p-4 text-center backdrop-blur-md shadow-lg", statBgClass)}>
                            <div className={cn("mb-2 flex justify-center opacity-80", accentColor)}><Users size={20} /></div>
                            <div className="text-lg font-bold tracking-tight">{youtubeCard.subscribers}</div>
                            <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Subs</div>
                        </div>
                    )}
                    {youtubeCard.settings.showVideos && (
                        <div className={cn("rounded-2xl p-4 text-center backdrop-blur-md shadow-lg", statBgClass)}>
                            <div className={cn("mb-2 flex justify-center opacity-80", accentColor)}><Play size={20} /></div>
                            <div className="text-lg font-bold tracking-tight">{youtubeCard.videosCount}</div>
                            <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Videos</div>
                        </div>
                    )}
                    <div className={cn("rounded-2xl p-4 text-center backdrop-blur-md shadow-lg", statBgClass)}>
                        <div className={cn("mb-2 flex justify-center opacity-80", accentColor)}><Eye size={20} /></div>
                        <div className="text-lg font-bold tracking-tight">{youtubeCard.totalViews || 'N/A'}</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Views</div>
                    </div>
                </motion.div>

                {/* Description */}
                {youtubeCard.description && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                        className="mt-8"
                    >
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Channel Bio</h3>
                        <div className={cn("p-5 rounded-2xl backdrop-blur-sm", isRedTheme ? "bg-red-900/10 border border-red-500/10" : "bg-white/5 border border-white/5")}>
                            <p className={cn("leading-relaxed text-sm font-light", isRedTheme ? "text-red-100/80" : "text-zinc-300")}>
                                {youtubeCard.description}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Action Button */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}
                    className="mt-8 pb-12"
                >
                    <a 
                        href={youtubeCard.channelUrl} 
                        target="_blank" rel="noreferrer"
                        className={cn("group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all overflow-hidden", buttonClass)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <Youtube size={24} fill="currentColor" />
                        <span>Subscribe Now</span>
                    </a>
                    <p className="text-center text-white/40 text-xs mt-4">
                        Join the community on YouTube
                    </p>
                </motion.div>
            </div>

            {/* Footer branding */}
            <div className="text-center py-6 border-t border-white/5 mt-auto">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Powered by TOMO BUSINESS</p>
            </div>
        </div>

        {/* QR Modal for YouTube */}
        {showQR && (
            <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-200 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className={cn("p-8 rounded-[2rem] shadow-2xl border border-white/10 flex flex-col items-center max-w-sm w-full", isRedTheme ? "bg-[#1a0505]" : "bg-zinc-900")}
                >
                    <div className="flex items-center gap-2 mb-6 text-white/80">
                         <Share2 size={16} />
                         <span className="text-xs font-bold uppercase tracking-widest">Share Profile</span>
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl shadow-inner">
                         <QRCodeSVG value={window.location.href} size={220} />
                    </div>
                    
                    <h3 className="mt-8 text-white font-bold text-xl text-center">{youtubeCard.channelName}</h3>
                    <p className="text-zinc-500 text-sm text-center mt-1">Scan to visit Creator Profile</p>
                    
                    <button 
                        onClick={() => setShowQR(false)} 
                        className="mt-8 w-full bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/5"
                    >
                        Close
                    </button>
                </motion.div>
            </div>
        )}
    </div>
  );
};
