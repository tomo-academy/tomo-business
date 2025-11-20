import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Phone, Mail, MapPin, Globe, Github, Linkedin, Instagram, Twitter, Download, Share2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const PublicProfile: React.FC = () => {
  const { card } = useAppStore();
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // vCard Generation
  const generateVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${card.displayName}
TITLE:${card.title}
ORG:${card.company}
EMAIL:${card.email}
TEL:${card.phone}
URL:${window.location.href}
NOTE:${card.bio}
END:VCARD`;
    
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${card.displayName.replace(' ', '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Icon mapping
  const getIcon = (platform: string) => {
      switch(platform.toLowerCase()) {
          case 'github': return <Github size={20} />;
          case 'linkedin': return <Linkedin size={20} />;
          case 'instagram': return <Instagram size={20} />;
          case 'twitter': return <Twitter size={20} />;
          default: return <Globe size={20} />;
      }
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
              <LoadingSpinner />
          </div>
      )
  }

  // STANDARD BUSINESS CARD MODE
  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center relative overflow-hidden font-sans">
       {/* Desktop Background elements */}
       <div className="hidden md:block absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
       
       <div className="w-full max-w-md bg-white min-h-screen md:min-h-[90vh] md:my-auto md:rounded-[2.5rem] md:border-[1px] md:border-zinc-200 shadow-2xl overflow-hidden relative flex flex-col">
          
          {/* Header / Cover - Prominent Size */}
          <div className="h-64 w-full relative bg-cover bg-center" style={{ backgroundImage: `url(${card.coverUrl})` }}>
              <div className="absolute inset-0 bg-black/10"></div>
              <button 
                onClick={() => setShowQR(true)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-20 shadow-lg"
              >
                 <Share2 size={18} />
              </button>
          </div>

          <div className="flex-1 px-8 pb-12 -mt-20 relative z-10 overflow-y-auto scrollbar-hide bg-white rounded-t-[2rem]">
              {/* Avatar */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-36 h-36 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg mx-auto mb-4 relative z-20"
              >
                  <img src={card.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
              </motion.div>

              {/* Identity */}
              <div className="text-center mt-2 space-y-1">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-zinc-900 tracking-tight"
                  >
                    {card.displayName}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-medium tracking-wide text-sm"
                    style={{ color: card.theme.primaryColor }}
                  >
                    {card.title}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-zinc-500 uppercase tracking-wider"
                  >
                    {card.company}
                  </motion.p>
              </div>

              {/* Main CTA: Add Contact */}
              <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.35 }}
                 className="mt-6 flex justify-center"
              >
                  <button 
                    onClick={generateVCard}
                    className="flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform active:scale-95"
                    style={{ backgroundColor: card.theme.primaryColor === '#000000' ? '#111827' : card.theme.primaryColor }}
                  >
                     <UserPlus size={18} />
                     <span>Save Contact</span>
                  </button>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.4 }}
                 className="flex justify-center gap-8 my-8 border-b border-zinc-100 pb-8"
              >
                  <ActionButton icon={<Phone size={20} />} label="Call" href={`tel:${card.phone}`} />
                  <ActionButton icon={<Mail size={20} />} label="Email" href={`mailto:${card.email}`} />
                  <ActionButton icon={<MapPin size={20} />} label="Map" href="#" />
              </motion.div>

              {/* Bio */}
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="mb-8 text-center"
              >
                 <p className="text-zinc-500 text-sm leading-relaxed italic">
                    "{card.bio}"
                 </p>
              </motion.div>

              {/* Links */}
              <div className="space-y-3">
                 {card.links.map((link, index) => (
                     <motion.a
                        key={link.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 rounded-xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 hover:translate-x-1 transition-all group"
                     >
                        <div className="text-zinc-400 group-hover:text-zinc-900 transition-colors mr-4">
                            {getIcon(link.platform)}
                        </div>
                        <span className="flex-1 font-semibold text-sm text-zinc-700 capitalize">
                            {link.platform}
                        </span>
                        <div className="text-zinc-300 group-hover:text-zinc-500">
                            <Download size={16} className="-rotate-90" />
                        </div>
                     </motion.a>
                 ))}
              </div>

              <div className="mt-12 text-center pb-8">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Made with TOMO BUSINESS</p>
              </div>
          </div>

          {/* QR Modal */}
          {showQR && (
            <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-200">
               <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
                  <QRCodeSVG value={`${window.location.origin}/#/c/${card.id}`} size={200} />
                  <p className="mt-6 text-zinc-900 font-bold text-lg">Scan to Connect</p>
                  <p className="text-zinc-500 text-sm">Share this QR code with others</p>
               </div>
               <button onClick={() => setShowQR(false)} className="mt-8 bg-white/10 text-white px-6 py-2 rounded-full font-medium hover:bg-white/20 transition-colors">
                  Close
               </button>
            </div>
          )}
       </div>
    </div>
  );
};

const ActionButton = ({ icon, label, href }: any) => (
  <a 
    href={href}
    className="flex flex-col items-center gap-2 group"
  >
    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-600 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm">
        {icon}
    </div>
    <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">{label}</span>
  </a>
);