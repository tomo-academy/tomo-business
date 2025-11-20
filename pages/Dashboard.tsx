import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, Users, Eye, MousePointer, Smartphone, Calendar, Share2, Edit, ExternalLink, QrCode, Youtube, Wand2, Play, Trash2, Settings, Wifi, CheckCircle2, X, Globe, Mail, Phone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Mock Data for Analytics
const viewData = [
  { name: 'Mon', views: 40, clicks: 24 },
  { name: 'Tue', views: 30, clicks: 13 },
  { name: 'Wed', views: 20, clicks: 98 },
  { name: 'Thu', views: 27, clicks: 39 },
  { name: 'Fri', views: 18, clicks: 48 },
  { name: 'Sat', views: 23, clicks: 38 },
  { name: 'Sun', views: 34, clicks: 43 },
];

export const Dashboard: React.FC = () => {
  const { user, card, youtubeCard, generateYouTubeCard, removeYouTubeCard, updateYouTubeCard } = useAppStore();
  const [ytInput, setYtInput] = useState('');
  const [isGeneratingYt, setIsGeneratingYt] = useState(false);
  const [showYtSettings, setShowYtSettings] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleYtGenerate = async () => {
    if(!ytInput) return;
    setIsGeneratingYt(true);
    try {
        await generateYouTubeCard(ytInput);
        setYtInput(''); // Clear input after generation
    } catch (error) {
        console.error("Failed to generate card", error);
    } finally {
        setIsGeneratingYt(false);
    }
  };

  const handleEditYt = () => {
      if (youtubeCard) {
          setYtInput(youtubeCard.channelUrl);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
      }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
        
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

            {/* Right: QR & Quick Stats */}
            <div className="w-full md:w-72 bg-zinc-50/50 p-6 md:p-8 flex flex-col items-center justify-center gap-4">
                <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                     <QRCodeSVG value={`${window.location.origin}/#/preview`} size={100} />
                </div>
                <div className="text-center">
                    <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold mb-1">Your Digital ID</p>
                    <p className="text-xs text-zinc-400 truncate max-w-[180px] select-all">tomo.business/u/{card.id}</p>
                </div>
            </div>
        </div>

        {/* Creator Tools - YouTube Card Section */}
        <div>
             <div className="flex items-center gap-2 mb-4">
                 <Youtube className="text-red-600" size={20} />
                 <h3 className="text-lg font-bold text-zinc-900">Creator Studio</h3>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Generator Form */}
                 <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-soft flex flex-col justify-center h-full">
                     <h4 className="text-sm font-semibold text-zinc-900 mb-1">YouTube Business Card</h4>
                     <p className="text-sm text-zinc-500 mb-4">Generate a compact ID card for your channel instantly.</p>
                     
                     <div className="space-y-3">
                         <div className="relative">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                 <Youtube size={18} />
                             </div>
                             <input 
                                ref={inputRef}
                                type="text"
                                placeholder="Paste your channel link (e.g. youtube.com/@tomobusiness)"
                                value={ytInput}
                                onChange={(e) => setYtInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                             />
                         </div>
                         <Button 
                            className="w-full bg-red-600 hover:bg-red-700 text-white border-transparent shadow-md shadow-red-200" 
                            onClick={handleYtGenerate}
                            disabled={isGeneratingYt || !ytInput}
                         >
                             {isGeneratingYt ? (
                                 <div className="flex items-center gap-2">
                                     <LoadingSpinner className="w-4 h-4" />
                                     <span>Fetching Data...</span>
                                 </div>
                             ) : (
                                 <><Wand2 size={16} className="mr-2" /> Generate Card</>
                             )}
                         </Button>
                     </div>
                 </div>

                 {/* Card Preview */}
                 <div className="flex flex-col items-center justify-center min-h-[240px]">
                     {youtubeCard ? (
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
                                                  <QRCodeSVG value={youtubeCard.channelUrl} size={40} />
                                                  <span className="text-[6px] font-bold uppercase tracking-widest text-zinc-900">Channel</span>
                                              </div>
                                              {/* Internal Profile QR */}
                                              <div className="bg-white p-1.5 rounded-lg shadow-lg shrink-0 flex flex-col items-center gap-1 border-2 border-red-100">
                                                  <QRCodeSVG value={`${window.location.origin}/#/youtube-profile`} size={40} />
                                                  <span className="text-[6px] font-bold uppercase tracking-widest text-red-600">Profile</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                             </div>

                             {/* Actions Below Preview */}
                             <div className="flex flex-wrap justify-center gap-3 w-full">
                                 <button onClick={() => window.open(youtubeCard.channelUrl, '_blank')} className="action-btn">
                                     <Eye size={14} /> View
                                 </button>
                                 <button onClick={handleEditYt} className="action-btn">
                                     <Edit size={14} /> Edit
                                 </button>
                                 <button onClick={() => setShowYtSettings(true)} className="action-btn">
                                     <Settings size={14} /> Customize
                                 </button>
                                 <button onClick={() => navigate('/nfc?type=youtube')} className={`action-btn ${youtubeCard.nfcActive ? 'text-green-600 border-green-200 bg-green-50' : ''}`}>
                                     <Wifi size={14} /> {youtubeCard.nfcActive ? 'Active' : 'Link NFC'}
                                 </button>
                                 <button onClick={removeYouTubeCard} className="action-btn text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                                     <Trash2 size={14} /> Delete
                                 </button>
                             </div>
                         </div>
                     ) : (
                         <div className="w-full max-w-md aspect-[1.58/1] bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-zinc-400 gap-2">
                             <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-1">
                                 <Youtube size={20} className="opacity-50" />
                             </div>
                             <p className="text-sm font-medium">No Creator Card Generated</p>
                         </div>
                     )}
                 </div>
             </div>
        </div>

        {/* YouTube Card Settings Modal */}
        <AnimatePresence>
            {showYtSettings && youtubeCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowYtSettings(false)}
                    />
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-zinc-900">Card Configuration</h3>
                            <button onClick={() => setShowYtSettings(false)} className="text-zinc-400 hover:text-zinc-900"><X size={20}/></button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block">Card Theme</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => updateYouTubeCard({ settings: { ...youtubeCard.settings, theme: 'dark' } })}
                                        className={`h-16 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-medium ring-offset-2 transition-all ${youtubeCard.settings.theme === 'dark' ? 'ring-2 ring-zinc-900' : ''}`}
                                    >
                                        Midnight Black
                                    </button>
                                    <button 
                                        onClick={() => updateYouTubeCard({ settings: { ...youtubeCard.settings, theme: 'red' } })}
                                        className={`h-16 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-medium ring-offset-2 transition-all ${youtubeCard.settings.theme === 'red' ? 'ring-2 ring-red-600' : ''}`}
                                    >
                                        YouTube Red
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block">Display Options</label>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors">
                                        <span className="text-sm font-medium text-zinc-700">Show Subscriber Count</span>
                                        <input 
                                            type="checkbox" 
                                            checked={youtubeCard.settings.showSubscribers}
                                            onChange={(e) => updateYouTubeCard({ settings: { ...youtubeCard.settings, showSubscribers: e.target.checked } })}
                                            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors">
                                        <span className="text-sm font-medium text-zinc-700">Show Video Count</span>
                                        <input 
                                            type="checkbox" 
                                            checked={youtubeCard.settings.showVideos}
                                            onChange={(e) => updateYouTubeCard({ settings: { ...youtubeCard.settings, showVideos: e.target.checked } })}
                                            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                        />
                                    </label>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-zinc-100">
                                <Button className="w-full" onClick={() => setShowYtSettings(false)}>Done</Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

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
          <StatCard label="Total Views" value="1,234" change="+12.5%" icon={Eye} />
          <StatCard label="Link Clicks" value="856" change="+5.2%" icon={MousePointer} />
          <StatCard label="New Contacts" value="48" change="+18%" icon={Users} />
          <StatCard label="NFC Taps" value="156" change="+2.4%" icon={Smartphone} />
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