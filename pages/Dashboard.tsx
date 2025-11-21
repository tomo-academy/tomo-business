import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { db } from '../lib/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, Users, Eye, MousePointer, Smartphone, Calendar, Share2, Edit, ExternalLink, QrCode, Youtube, Wand2, Play, Trash2, Settings, Wifi, CheckCircle2, X, Globe, Mail, Phone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { user, card, cards, youtubeCard, switchCard, createNewCard, deleteCard } = useAppStore();
  const [viewData, setViewData] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({ totalViews: 0, totalClicks: 0, uniqueVisitors: 0 });
  const [loading, setLoading] = useState(true);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, [card.id]);

  const loadAnalytics = async () => {
    if (!card.id) {
      setLoading(false);
      return;
    }

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const data = await db.getAnalytics(card.id, 'view', startDate.toISOString(), new Date().toISOString());
      
      // Process data for chart
      const viewsByDate: { [key: string]: { views: number; clicks: number } } = {};
      
      data.views.forEach((view: any) => {
        const date = new Date(view.viewed_at || view.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (!viewsByDate[date]) viewsByDate[date] = { views: 0, clicks: 0 };
        viewsByDate[date].views++;
      });
      
      data.clicks.forEach((click: any) => {
        const date = new Date(click.clicked_at || click.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (!viewsByDate[date]) viewsByDate[date] = { views: 0, clicks: 0 };
        viewsByDate[date].clicks++;
      });
      
      const chartData = Object.entries(viewsByDate).map(([name, stats]) => ({
        name,
        ...stats
      }));
      
      setViewData(chartData.length > 0 ? chartData : [{ name: 'No data', views: 0, clicks: 0 }]);
      
      // Calculate unique visitors from IP hashes
      const uniqueIPs = new Set(data.views.map((v: any) => v.ip_hash).filter(Boolean));
      
      setAnalytics({
        totalViews: data.totalViews,
        totalClicks: data.totalClicks,
        uniqueVisitors: uniqueIPs.size
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      setViewData([{ name: 'Error', views: 0, clicks: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async () => {
    if (!newCardName.trim()) return;
    
    setIsCreating(true);
    try {
      await createNewCard(newCardName);
      setNewCardName('');
      setShowNewCardModal(false);
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
        
        {/* Card Selector */}
        {cards.length > 1 && (
          <div className="bg-gradient-to-r from-zinc-50 to-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {cards.slice(0, 3).map((c) => (
                    <div key={c.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <img src={c.avatarUrl} alt={c.displayName} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {cards.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-zinc-600">+{cards.length - 3}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Your Cards</p>
                  <p className="text-sm font-semibold text-zinc-900">{cards.length} Active Cards</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowCardSelector(true)}>
                  <Eye size={14} className="mr-1" /> Switch Card
                </Button>
                <Button size="sm" onClick={() => setShowNewCardModal(true)}>
                  <QrCode size={14} className="mr-1" /> New Card
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Identity Card (Persona Card) */}
        <div className="w-full bg-white border border-zinc-200 rounded-2xl p-0 shadow-soft overflow-hidden flex flex-col md:flex-row">
            {/* Left: Profile Info */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-100">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full border-[3px] border-zinc-100 shadow-sm overflow-hidden flex-shrink-0">
                        <img src={card.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{card.displayName}</h2>
                        <p className="text-zinc-500 font-medium">{card.title}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                             <span>{card.company}</span>
                             <span>•</span>
                             <span>Pro Member</span>
                        </div>
                        <div className="flex gap-3 mt-3 text-zinc-400">
                             {card.location && <div className="flex items-center gap-1 text-xs"><Globe size={12} /> {card.location}</div>}
                             {card.email && <div className="flex items-center gap-1 text-xs"><Mail size={12} /> Contact</div>}
                             {card.phone && <div className="flex items-center gap-1 text-xs"><Phone size={12} /> Call</div>}
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/editor">
                        <Button variant="secondary" size="sm" className="h-9">
                            <Edit size={14} className="mr-2" /> Edit Profile
                        </Button>
                    </Link>
                    <a href="#/preview" target="_blank">
                        <Button variant="outline" size="sm" className="h-9">
                            <ExternalLink size={14} className="mr-2" /> View Live
                        </Button>
                    </a>
                </div>
            </div>

            {/* Right: NFC Card Style with QR */}
            <div className="w-full md:w-80 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 md:p-8 flex flex-col items-center justify-between relative overflow-hidden">
                {/* NFC Pattern Background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 border-2 border-white rounded-full"></div>
                </div>

                {/* NFC Icon */}
                <div className="absolute top-4 left-4 flex items-center gap-2 text-white/60">
                  <Wifi size={16} className="rotate-90" />
                  <span className="text-[10px] font-bold tracking-wider">NFC ENABLED</span>
                </div>

                {/* QR Code - Larger and centered */}
                <div className="flex-1 flex items-center justify-center z-10 py-4">
                  <div className="bg-white p-4 rounded-2xl shadow-2xl">
                    <QRCodeSVG 
                      value={`${window.location.origin}/#/c/${card.id}`} 
                      size={140}
                      level="H"
                      imageSettings={{
                        src: "/logo.png",
                        height: 35,
                        width: 35,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>

                {/* Card Info */}
                <div className="text-center text-white z-10 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                      <img src={card.avatarUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold leading-tight">{card.displayName}</p>
                      <p className="text-[10px] text-white/60">{card.title}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">Scan to Connect</p>
                    <p className="text-[11px] text-white/70 font-mono">ID: {card.id.slice(0, 8)}</p>
                  </div>
                </div>
            </div>
        </div>

        {/* Creator Tools - YouTube Card Quick Link */}
        {!youtubeCard && (
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Youtube className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">YouTube Creator Card</h3>
                  <p className="text-sm text-zinc-500">Generate a professional card for your YouTube channel</p>
                </div>
              </div>
              <Link to="/youtube-editor">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Wand2 size={16} className="mr-2" /> Create Card
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* YouTube Card Preview if exists */}
        {youtubeCard && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Youtube className="text-red-600" size={20} />
              <h3 className="text-lg font-bold text-zinc-900">Your YouTube Card</h3>
            </div>
             
             <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-soft">
                 <div className="flex flex-col items-center justify-center">
                     {youtubeCard && (
                         <div className="w-full max-w-md flex flex-col items-center gap-6">
                             {/* The Card */}
                             <div className={`w-full aspect-[1.58/1] rounded-xl relative overflow-hidden shadow-2xl border border-zinc-800 transition-transform duration-300 hover:scale-[1.02] ${youtubeCard.settings.theme === 'dark' ? 'bg-zinc-900' : 'bg-red-700'}`}>
                                  
                                  {/* Background Banner Image if available */}
                                  {youtubeCard.bannerUrl ? (
                                    <div className="absolute inset-0 z-0">
                                        <img src={youtubeCard.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
                                        <div className={`absolute inset-0 ${youtubeCard.settings.theme === 'dark' ? 'bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-zinc-900/50' : 'bg-gradient-to-t from-red-900 via-red-800/80 to-red-800/50'}`}></div>
                                    </div>
                                  ) : (
                                    <>
                                        {/* Default Abstract Background */}
                                        <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${youtubeCard.settings.theme === 'dark' ? 'bg-red-600/20' : 'bg-black/30'}`}></div>
                                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/20 blur-[50px] rounded-full pointer-events-none"></div>
                                    </>
                                  )}
                                  
                                  {/* Content */}
                                  <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                      <div className="flex justify-between items-start">
                                          <div className="flex items-center gap-3 min-w-0">
                                              <div className="w-12 h-12 rounded-full bg-white p-0.5 overflow-hidden border-2 border-zinc-800 shadow-lg shrink-0">
                                                  <img src={youtubeCard.logoUrl} className="w-full h-full object-cover rounded-full" alt="Logo" />
                                              </div>
                                              <div className="min-w-0">
                                                  <h5 className="text-white font-bold text-lg leading-tight drop-shadow-sm truncate">{youtubeCard.channelName}</h5>
                                                  <p className="text-white/60 text-xs font-medium truncate">{youtubeCard.handle}</p>
                                              </div>
                                          </div>
                                          <div className="text-white/20 shrink-0">
                                              {youtubeCard.nfcActive ? <Wifi size={24} className="text-green-400" /> : <Youtube size={24} />}
                                          </div>
                                      </div>

                                      <div className="flex justify-between items-end">
                                          <div className="space-y-2">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                  {youtubeCard.settings.showSubscribers && (
                                                    <div className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 backdrop-blur-sm shadow-sm">
                                                        <Users size={10} /> {youtubeCard.subscribers} Subs
                                                    </div>
                                                  )}
                                                  {youtubeCard.settings.showVideos && (
                                                    <div className="px-2.5 py-1 rounded-md bg-black/40 border border-white/5 text-zinc-300 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 backdrop-blur-sm shadow-sm">
                                                        <Play size={10} /> {youtubeCard.videosCount} Vids
                                                    </div>
                                                  )}
                                                   <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 backdrop-blur-sm shadow-sm">
                                                        <Eye size={10} /> {youtubeCard.totalViews || '0'} Views
                                                    </div>
                                              </div>
                                              <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Official Creator ID</p>
                                          </div>
                                          
                                          <div className="flex gap-2">
                                              {/* External YouTube QR */}
                                              <div className="bg-white p-1.5 rounded-lg shadow-lg shrink-0 flex flex-col items-center gap-1">
                                                  <QRCodeSVG 
                                                    value={youtubeCard.channelUrl} 
                                                    size={40}
                                                    level="H"
                                                    imageSettings={{
                                                      src: "/logo.png",
                                                      height: 10,
                                                      width: 10,
                                                      excavate: true,
                                                    }}
                                                  />
                                                  <span className="text-[6px] font-bold uppercase tracking-widest text-zinc-900">Channel</span>
                                              </div>
                                              {/* Internal Profile QR */}
                                              <div className="bg-white p-1.5 rounded-lg shadow-lg shrink-0 flex flex-col items-center gap-1 border-2 border-red-100">
                                                  <QRCodeSVG 
                                                    value={`${window.location.origin}/#/youtube-profile`} 
                                                    size={40}
                                                    level="H"
                                                    imageSettings={{
                                                      src: "/logo.png",
                                                      height: 10,
                                                      width: 10,
                                                      excavate: true,
                                                    }}
                                                  />
                                                  <span className="text-[6px] font-bold uppercase tracking-widest text-red-600">Profile</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                             </div>

                             {/* Actions Below Preview */}
                             <div className="flex flex-wrap justify-center gap-3 w-full">
                                 <Link to="/youtube-editor">
                                   <button className="action-btn">
                                       <Edit size={14} /> Manage Card
                                   </button>
                                 </Link>
                                 <button onClick={() => window.open(youtubeCard.channelUrl, '_blank')} className="action-btn">
                                     <Eye size={14} /> View Channel
                                 </button>
                                 <button onClick={() => window.open('/#/youtube-profile', '_blank')} className="action-btn">
                                     <Youtube size={14} /> View Profile
                                 </button>
                                 <button onClick={() => navigate('/nfc?type=youtube')} className={`action-btn ${youtubeCard.nfcActive ? 'text-green-600 border-green-200 bg-green-50' : ''}`}>
                                     <Wifi size={14} /> {youtubeCard.nfcActive ? 'Active' : 'Link NFC'}
                                 </button>
                             </div>
                         </div>
                     )}
                 </div>
             </div>
          </div>
        )}

        {/* Stats Header */}
        <div className="flex justify-between items-end pt-4">
            <div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Analytics Overview</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500 bg-white px-3 py-1.5 rounded-md border border-zinc-200 shadow-sm">
                <Calendar size={14} />
                <span>Last 7 Days</span>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Views" value={analytics.totalViews.toLocaleString()} change="+12.5%" icon={Eye} />
          <StatCard label="Link Clicks" value={analytics.totalClicks.toLocaleString()} change="+5.2%" icon={MousePointer} />
          <StatCard label="Unique Visitors" value={analytics.uniqueVisitors.toLocaleString()} change="+18%" icon={Users} />
          <StatCard label="Engagement" value={`${analytics.totalViews > 0 ? ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1) : 0}%`} change="+2.4%" icon={Smartphone} />
        </div>

        {/* Main Chart */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-zinc-900">Engagement</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#111827' }}
                />
                <Area type="monotone" dataKey="views" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="clicks" stroke="#9CA3AF" strokeWidth={2} fillOpacity={0} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Card Selector Modal */}
        <AnimatePresence>
          {showCardSelector && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowCardSelector(false)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden z-10"
              >
                <div className="p-6 border-b border-zinc-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-zinc-900">Your Cards</h3>
                    <button onClick={() => setShowCardSelector(false)} className="text-zinc-400 hover:text-zinc-900">
                      <X size={20}/>
                    </button>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">Select a card to view or manage</p>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          switchCard(c.id);
                          setShowCardSelector(false);
                        }}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                          c.id === card.id 
                            ? 'border-zinc-900 bg-zinc-50' 
                            : 'border-zinc-200 hover:border-zinc-400 bg-white'
                        }`}
                      >
                        {/* NFC Card Style Preview */}
                        <div className="aspect-[1.6/1] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 relative">
                          {/* NFC Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 right-0 w-20 h-20 border border-white rounded-full"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 border border-white rounded-full"></div>
                          </div>
                          
                          {/* Active Badge */}
                          {c.id === card.id && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                              Active
                            </div>
                          )}
                          
                          {/* NFC Icon */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 text-white/40">
                            <Wifi size={10} className="rotate-90" />
                            <span className="text-[7px] font-bold tracking-wider">NFC</span>
                          </div>
                          
                          {/* QR Code */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white p-2 rounded-lg shadow-lg">
                              <QRCodeSVG 
                                value={`${window.location.origin}/#/c/${c.id}`} 
                                size={60}
                                level="H"
                                imageSettings={{
                                  src: "/logo.png",
                                  height: 15,
                                  width: 15,
                                  excavate: true,
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Card Info */}
                          <div className="absolute bottom-2 left-2 right-2 text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                <img src={c.avatarUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-[10px] font-bold leading-tight truncate">{c.displayName}</p>
                                <p className="text-[8px] text-white/60 truncate">{c.title}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card Details */}
                        <div className="p-3 bg-white">
                          <p className="font-semibold text-sm text-zinc-900 truncate">{c.displayName}</p>
                          <p className="text-xs text-zinc-500 truncate">{c.company || 'No company'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        {/* New Card Modal */}
        <AnimatePresence>
          {showNewCardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowNewCardModal(false)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-zinc-900">Create New Card</h3>
                  <button onClick={() => setShowNewCardModal(false)} className="text-zinc-400 hover:text-zinc-900">
                    <X size={20}/>
                  </button>
                </div>
                
                <p className="text-sm text-zinc-500 mb-4">
                  Create additional business cards for friends, family members, or different personas.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Card Name</label>
                    <input 
                      type="text"
                      placeholder="e.g., John's Card, Family Card"
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateCard()}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowNewCardModal(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-zinc-900" 
                      onClick={handleCreateCard}
                      disabled={!newCardName.trim() || isCreating}
                    >
                      {isCreating ? (
                        <><LoadingSpinner className="w-4 h-4 mr-2" /> Creating...</>
                      ) : (
                        <><QrCode size={16} className="mr-2" /> Create Card</>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <style>{`
        .action-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: white;
            border: 1px solid #e4e4e7;
            color: #3f3f46;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-radius: 9999px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition-property: background-color, color;
            transition-duration: 200ms;
            white-space: nowrap;
        }
        .action-btn:hover {
            background-color: #f4f4f5;
            color: #18181b;
        }
      `}</style>
    </Layout>
  );
};

const StatCard = ({ label, value, change, icon: Icon }: any) => (
  <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-soft hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-zinc-500 text-sm font-medium">{label}</p>
        <h4 className="text-2xl font-bold text-zinc-900 mt-2 tracking-tight">{value}</h4>
      </div>
      <div className="p-2 bg-zinc-50 rounded-lg text-zinc-500 group-hover:text-zinc-900 transition-colors border border-zinc-100">
        <Icon size={18} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span className="text-green-600 flex items-center gap-1 font-medium bg-green-50 px-1.5 py-0.5 rounded">
        <ArrowUpRight size={12} /> {change}
      </span>
      <span className="text-zinc-400 ml-2">vs last month</span>
    </div>
  </div>
);