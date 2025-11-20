import React from 'react';
import { CardData } from '../types';
import { Phone, Mail, Globe, Instagram, Twitter, Linkedin, Github, Youtube, MessageCircle, Facebook } from 'lucide-react';

export const CardPreview: React.FC<{ card: CardData }> = ({ card }) => {
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

    return (
        <div className="w-[300px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-zinc-900 relative mx-auto select-none">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-zinc-900 z-20 flex justify-between px-6 items-center rounded-t-[1.8rem]">
                <div className="text-[10px] text-white font-medium">9:41</div>
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                    <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                    <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                </div>
            </div>
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30"></div>

            {/* Content Container */}
            <div className="w-full h-full overflow-y-auto scrollbar-hide bg-white pt-8">
                <div className="relative">
                    {/* Cover Image */}
                    <div className="h-32 bg-zinc-100 bg-cover bg-center relative" style={{ backgroundImage: `url(${card.coverUrl})` }}>
                        <div className="absolute inset-0 bg-black/5"></div>
                    </div>
                    
                    {/* Avatar */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                            <img src={card.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 text-center px-5 pb-8">
                    {/* Name & Title */}
                    <h3 className="font-bold text-zinc-900 text-lg leading-tight">{card.displayName || "Your Name"}</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1">{card.title || "Job Title"}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1 font-semibold">{card.company || "Company Name"}</p>
                    
                    {/* Primary Action */}
                    <button className="mt-5 bg-zinc-900 text-white text-xs py-2.5 px-6 rounded-full font-semibold w-full shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-colors">
                        Save Contact
                    </button>
                    
                    {/* Quick Actions */}
                    <div className="flex justify-center gap-6 my-6 border-b border-zinc-100 pb-6">
                        <div className="flex flex-col items-center gap-1 group cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                <Phone size={14}/>
                            </div>
                            <span className="text-[9px] text-zinc-400 font-medium">Call</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 group cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                <Mail size={14}/>
                            </div>
                            <span className="text-[9px] text-zinc-400 font-medium">Email</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 group cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                <Globe size={14}/>
                            </div>
                            <span className="text-[9px] text-zinc-400 font-medium">Website</span>
                        </div>
                    </div>
                    
                    {/* Bio */}
                    {card.bio && (
                        <div className="mb-6">
                            <p className="text-xs text-zinc-500 leading-relaxed italic px-1">"{card.bio}"</p>
                        </div>
                    )}
                    
                    {/* Links List */}
                    <div className="space-y-2.5">
                        {card.links.map(link => (
                            <div key={link.id} className="flex items-center p-2.5 rounded-xl border border-zinc-100 bg-white shadow-sm gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                                <div className="text-zinc-400 group-hover:text-zinc-900 transition-colors">{getLinkIcon(link.platform)}</div>
                                <span className="text-xs font-medium capitalize flex-1 text-left text-zinc-600 group-hover:text-zinc-900">{link.platform}</span>
                            </div>
                        ))}
                        {card.links.length === 0 && (
                            <p className="text-[10px] text-zinc-300 text-center py-4">Add links to see them here</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};