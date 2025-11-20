import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './lib/auth';
import { CardData, User, SocialLink, YouTubeCardData } from './types';
import { getYouTubeChannelDetails } from './services/gemini';
import { db } from './lib/database';

interface AppState {
  user: User | null;
  card: CardData;
  youtubeCard: YouTubeCardData | null;
  login: (email: string) => void;
  logout: () => void;
  updateCard: (updates: Partial<CardData>) => void;
  addLink: (link: SocialLink) => void;
  removeLink: (id: string) => void;
  generateYouTubeCard: (url: string) => Promise<void>;
  removeYouTubeCard: () => void;
  updateYouTubeCard: (updates: Partial<YouTubeCardData>) => void;
}

const defaultCard: CardData = {
  id: '1',
  displayName: 'Alex Johnson',
  title: 'Senior Product Designer',
  bio: 'Creating digital experiences that matter. Specializing in UI/UX and Brand Strategy.',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
  coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
  company: 'TOMO BUSINESS',
  location: 'New York, NY',
  email: 'alex@tomo.business',
  phone: '+1 (555) 012-3456',
  links: [
    { id: 'l1', platform: 'instagram', url: 'https://instagram.com' },
    { id: 'l2', platform: 'linkedin', url: 'https://linkedin.com' },
    { id: 'l3', platform: 'website', url: 'https://tomo.business' }
  ],
  theme: {
    primaryColor: '#000000', // Black
    backgroundColor: '#FFFFFF', // White
    fontFamily: 'Inter',
    layout: 'modern'
  },
  customDomain: undefined,
  customDomainStatus: 'none',
  nfcActive: false
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [card, setCard] = useState<CardData>(defaultCard);
  const [youtubeCard, setYoutubeCard] = useState<YouTubeCardData | null>(null);

  const login = (email: string) => {
    setUser({
      id: 'u1',
      name: 'Alex Johnson',
      email,
      plan: 'pro'
    });
  };

  const logout = () => setUser(null);

  const updateCard = (updates: Partial<CardData>) => {
    setCard(prev => ({ ...prev, ...updates }));
  };

  const addLink = (link: SocialLink) => {
    setCard(prev => ({ ...prev, links: [...prev.links, link] }));
  };

  const removeLink = (id: string) => {
    setCard(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));
  };

  const generateYouTubeCard = async (url: string) => {
    // Call Gemini API to get real details
    const data = await getYouTubeChannelDetails(url);

    // Fallbacks if API fails or returns partial data
    const channelName = data?.channelName || "New Channel";
    const handle = data?.handle || (url.includes("@") ? "@" + url.split("@")[1] : "@unknown");
    const subscribers = data?.subscribers || "0";
    const videosCount = data?.videosCount || "0";
    const description = data?.description || "Official YouTube Channel";
    const totalViews = data?.totalViews || "0";
    const location = data?.location || "Global";
    
    const logoUrl = data?.logoUrl && data.logoUrl.startsWith('http') 
        ? data.logoUrl 
        : card.avatarUrl; // Fallback to user avatar
        
    const bannerUrl = data?.bannerUrl && data.bannerUrl.startsWith('http')
        ? data.bannerUrl
        : undefined;

    const newCard: YouTubeCardData = {
        channelName,
        handle,
        subscribers,
        videosCount,
        logoUrl,
        bannerUrl,
        description,
        totalViews,
        location,
        channelUrl: url,
        nfcActive: false,
        settings: {
          showSubscribers: true,
          showVideos: true,
          theme: 'dark'
        }
    };

    setYoutubeCard(newCard);
  };

  const removeYouTubeCard = () => {
    setYoutubeCard(null);
  };

  const updateYouTubeCard = (updates: Partial<YouTubeCardData>) => {
    if (!youtubeCard) return;
    setYoutubeCard(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      card, 
      youtubeCard, 
      login, 
      logout, 
      updateCard, 
      addLink, 
      removeLink, 
      generateYouTubeCard, 
      removeYouTubeCard,
      updateYouTubeCard
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};