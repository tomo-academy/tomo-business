import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { Button } from '../components/ui/Button';
import { generateBio } from '../services/gemini';
import { 
  Plus, Trash2, Sparkles, Phone, Mail, MapPin, Link as LinkIcon, GripVertical, 
  Camera, Image as ImageIcon, UploadCloud, Globe, Settings,
  Instagram, Twitter, Linkedin, Github, Youtube, MessageCircle, Facebook, AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CardPreview } from '../components/CardPreview';

// Simple Input Component helper
const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div>
    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">{label}</label>
    <input 
      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 outline-none transition-all"
      {...props}
    />
  </div>
);

export const Editor: React.FC = () => {
  const { card, updateCard, addLink, removeLink } = useAppStore();
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'links'>('content');
  const [generating, setGenerating] = useState(false);
  const [showAiOptions, setShowAiOptions] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  
  // Refs for file inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateBio = async () => {
    setGenerating(true);
    const bio = await generateBio(card.displayName, card.title, aiKeywords, aiTone);
    updateCard({ bio });
    setGenerating(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'coverUrl') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCard({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getLinkIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram size={16} />;
      case 'twitter': return <Twitter size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'github': return <Github size={16} />;
      case 'youtube': return <Youtube size={16} />;
      case 'facebook': return <Facebook size={16} />;
      case 'whatsapp': return <MessageCircle size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <Globe size={16} />;
    }
  };

  const isValidUrl = (url: string) => {
    if (!url) return true; // Allow empty while typing
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
        
        {/* Editor Panel */}
        <div className="flex-1 bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col shadow-soft">
          {/* Tabs */}
          <div className="flex border-b border-zinc-200 bg-zinc-50/50">
             {['content', 'design', 'links'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`flex-1 py-3 text-sm font-medium capitalize tracking-wide transition-colors ${
                   activeTab === tab 
                    ? 'text-zinc-900 border-b-2 border-zinc-900 bg-white' 
                    : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
                 }`}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {activeTab === 'content' && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                
                {/* Image Upload Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase text-zinc-400 tracking-wider">Visual Identity</h3>
                    </div>
                    
                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <div className="relative group cursor-pointer rounded-xl overflow-hidden h-36 bg-zinc-100 border border-zinc-200 transition-all hover:border-zinc-400" onClick={() => coverInputRef.current?.click()}>
                            {card.coverUrl ? (
                                <img src={card.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-zinc-400 flex-col gap-2">
                                    <ImageIcon size={24} />
                                    <span className="text-xs font-medium">Upload Cover Image</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    <Camera size={14} /> Change Cover
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={coverInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'coverUrl')}
                            />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] text-zinc-400">Recommended: 1200x400px</p>
                            </div>
                            <div className="flex gap-2">
                                {card.coverUrl && (
                                    <button 
                                        onClick={() => updateCard({ coverUrl: '' })}
                                        className="text-[10px] text-red-500 hover:text-red-600 font-medium px-2 py-1"
                                    >
                                        Remove
                                    </button>
                                )}
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => coverInputRef.current?.click()}>
                                    <UploadCloud size={12} className="mr-1.5" /> 
                                    {card.coverUrl ? 'Change Cover' : 'Upload Cover'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex items-center gap-4 pt-2">
                         <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-100 group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                            <img src={card.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                <Camera size={16} className="text-white opacity-0 group-hover:opacity-100" />
                            </div>
                             <input 
                                type="file" 
                                ref={avatarInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'avatarUrl')}
                            />
                         </div>
                         <div className="flex-1">
                             <p className="text-sm font-medium text-zinc-900">Profile Photo</p>
                             <p className="text-xs text-zinc-500">Recommended 400x400px</p>
                             <Button variant="outline" size="sm" className="mt-2 h-8 text-xs" onClick={() => avatarInputRef.current?.click()}>
                                <UploadCloud size={12} className="mr-2" /> Upload New
                             </Button>
                         </div>
                    </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase text-zinc-400 tracking-wider">Profile Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Input label="Display Name" value={card.displayName} onChange={e => updateCard({ displayName: e.target.value })} />
                    <Input label="Job Title" value={card.title} onChange={e => updateCard({ title: e.target.value })} />
                    <Input label="Company" value={card.company} onChange={e => updateCard({ company: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                       <Input label="Email" value={card.email} onChange={e => updateCard({ email: e.target.value })} />
                       <Input label="Location" value={card.location} onChange={e => updateCard({ location: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <h3 className="text-sm font-bold uppercase text-zinc-400 tracking-wider">Bio</h3>
                    <div className="flex gap-2">
                         <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setShowAiOptions(!showAiOptions)}
                            className="h-8 text-xs"
                         >
                           <Settings size={12} className="mr-1" />
                           {showAiOptions ? 'Hide Options' : 'AI Settings'}
                         </Button>
                         <Button 
                            size="sm" 
                            variant="primary" 
                            onClick={handleGenerateBio} 
                            disabled={generating}
                            className="h-8 text-xs bg-zinc-900 text-white"
                         >
                            <Sparkles size={12} className="mr-1" />
                            {generating ? 'Writing...' : 'Generate'}
                         </Button>
                    </div>
                  </div>

                  {showAiOptions && (
                      <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 space-y-3 animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                  <label className="text-[10px] uppercase font-bold text-zinc-500">Tone</label>
                                  <select 
                                      className="w-full text-xs p-2.5 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                                      value={aiTone}
                                      onChange={(e) => setAiTone(e.target.value)}
                                  >
                                      <option value="professional">Professional</option>
                                      <option value="witty">Witty & Fun</option>
                                      <option value="enthusiastic">Enthusiastic</option>
                                      <option value="minimalist">Minimalist</option>
                                      <option value="persuasive">Persuasive</option>
                                  </select>
                              </div>
                              <div className="space-y-1.5">
                                  <label className="text-[10px] uppercase font-bold text-zinc-500">Keywords</label>
                                  <input 
                                      type="text"
                                      className="w-full text-xs p-2.5 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                                      placeholder="e.g. design, coffee, tech"
                                      value={aiKeywords}
                                      onChange={(e) => setAiKeywords(e.target.value)}
                                  />
                              </div>
                          </div>
                      </div>
                  )}

                  <textarea 
                    className="w-full h-28 bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-zinc-900 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 outline-none resize-none text-sm leading-relaxed"
                    value={card.bio}
                    onChange={e => updateCard({ bio: e.target.value })}
                    placeholder="Tell your story..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'links' && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                
                {/* Custom Domain / URL Section */}
                <div className="space-y-3">
                     <h3 className="text-sm font-bold uppercase text-zinc-400 tracking-wider">Public Profile URL</h3>
                     <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                         <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.customDomainStatus === 'active' ? 'bg-green-100 text-green-600' : 'bg-zinc-200 text-zinc-500'}`}>
                                 <Globe size={20} />
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-zinc-900">
                                     {card.customDomainStatus === 'active' && card.customDomain ? card.customDomain : `tomo.business/u/${card.id}`}
                                 </p>
                                 <p className="text-xs text-zinc-500">
                                     {card.customDomainStatus === 'active' ? 'Custom domain active' : 'Default URL'}
                                 </p>
                             </div>
                         </div>
                         <Link to="/settings">
                             <Button variant="outline" size="sm" className="text-xs h-8">
                                 <Settings size={12} className="mr-2" />
                                 {card.customDomainStatus === 'active' ? 'Manage' : 'Connect Domain'}
                             </Button>
                         </Link>
                     </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-bold uppercase text-zinc-400 tracking-wider">Social & Web</h3>
                      <Button size="sm" variant="outline" onClick={() => addLink({ id: Date.now().toString(), platform: 'website', url: '' })}>
                        <Plus size={14} className="mr-2" /> Add New
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {card.links.map((link) => {
                        const isUrlValid = isValidUrl(link.url);
                        return (
                          <div key={link.id} className="flex flex-col gap-1">
                            <div className={`flex gap-3 items-center bg-zinc-50 p-2 rounded-lg border transition-all ${
                              !isUrlValid && link.url 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-zinc-200 hover:border-zinc-300 bg-white'
                            }`}>
                              <GripVertical size={16} className="text-zinc-300 cursor-move" />
                              
                              <div className="text-zinc-500 flex-shrink-0 min-w-[20px] flex justify-center">
                                {getLinkIcon(link.platform)}
                              </div>

                              <select 
                                className="bg-transparent border-r border-zinc-200 text-xs font-medium text-zinc-700 py-1.5 px-2 focus:outline-none cursor-pointer w-24"
                                value={link.platform}
                                onChange={(e) => {
                                  const newLinks = card.links.map(l => l.id === link.id ? { ...l, platform: e.target.value as any } : l);
                                  updateCard({ links: newLinks });
                                }}
                              >
                                <option value="website">Website</option>
                                <option value="instagram">Instagram</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="facebook">Facebook</option>
                                <option value="github">Github</option>
                                <option value="youtube">YouTube</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="email">Email</option>
                              </select>
                              
                              <input 
                                type="text"
                                className={`flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 ${!isUrlValid && link.url ? 'text-red-600' : ''}`}
                                placeholder="https://..."
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = card.links.map(l => l.id === link.id ? { ...l, url: e.target.value } : l);
                                  updateCard({ links: newLinks });
                                }}
                              />
                              
                              <button 
                                onClick={() => removeLink(link.id)}
                                className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            {/* Validation Error Message */}
                            {!isUrlValid && link.url && (
                                <div className="flex items-center gap-1.5 px-2 text-[10px] text-red-500 font-medium animate-in slide-in-from-top-1 duration-200">
                                    <AlertCircle size={10} />
                                    <span>Please enter a valid URL (start with http:// or https://)</span>
                                </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {card.links.length === 0 && (
                        <div className="text-center py-8 bg-zinc-50 border border-dashed border-zinc-200 rounded-lg text-zinc-400">
                            <p className="text-sm">No links added yet.</p>
                        </div>
                      )}
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
                <div className="flex items-center justify-center h-64 text-zinc-400 flex-col">
                    <Settings size={32} className="mb-2 opacity-50" />
                    <p className="text-sm">Design settings Coming Soon</p>
                </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="w-full lg:w-[400px] hidden md:flex flex-col items-center justify-center bg-zinc-50 rounded-xl border border-zinc-200 shadow-inner p-8">
           <div className="mb-6 text-center">
               <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Live Preview</p>
           </div>
           
           <CardPreview card={card} />
        </div>
      </div>
    </Layout>
  );
};