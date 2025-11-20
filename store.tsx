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
  const supabaseUser = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [card, setCard] = useState<CardData>(defaultCard);
  const [youtubeCard, setYoutubeCard] = useState<YouTubeCardData | null>(null);

  // Sync with Supabase user
  useEffect(() => {
    if (supabaseUser) {
      loadUserData();
    } else {
      setUser(null);
      setCard(defaultCard);
    }
  }, [supabaseUser]);

  const loadUserData = async () => {
    if (!supabaseUser) return;

    try {
      // Load or create user in database
      let userData = await db.getUser(supabaseUser.id);
      if (!userData) {
        userData = await db.createUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          avatar_url: supabaseUser.user_metadata?.avatar_url
        });
      }

      setUser({
        id: userData.id,
        name: userData.name || userData.email,
        email: userData.email,
        plan: 'pro'
      });

      // Load user's cards
      const cards = await db.getUserCards(supabaseUser.id);
      if (cards.length > 0) {
        const firstCard = cards[0];
        setCard({
          id: firstCard.id,
          displayName: firstCard.display_name,
          title: firstCard.title || '',
          bio: firstCard.bio || '',
          avatarUrl: firstCard.avatar_url || defaultCard.avatarUrl,
          coverUrl: firstCard.cover_url || defaultCard.coverUrl,
          company: firstCard.company || '',
          location: firstCard.location || '',
          email: firstCard.email || userData.email,
          phone: firstCard.phone || '',
          links: [],
          theme: {
            primaryColor: firstCard.theme_primary_color || '#000000',
            backgroundColor: firstCard.theme_background_color || '#FFFFFF',
            fontFamily: firstCard.theme_font_family || 'Inter',
            layout: firstCard.theme_layout || 'modern'
          },
          nfcActive: false
        });

        // Load card links
        const links = await db.getCardLinks(firstCard.id);
        setCard(prev => ({
          ...prev,
          links: links.map((l: any) => ({
            id: l.id,
            platform: l.platform,
            url: l.url,
            label: l.label
          }))
        }));
      } else {
        // Create default card for new user
        const newCard = await db.createCard(supabaseUser.id, {
          ...defaultCard,
          displayName: userData.name || 'Your Name',
          email: userData.email
        });
        
        setCard({
          ...defaultCard,
          id: newCard.id,
          displayName: userData.name || 'Your Name',
          email: userData.email
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const login = (email: string) => {
    // This is now handled by Supabase Auth
    console.log('Use Supabase auth instead');
  };

  const logout = async () => {
    // This is now handled by Supabase Auth
    console.log('Use Supabase signOut instead');
  };

  const updateCard = async (updates: Partial<CardData>) => {
    setCard(prev => ({ ...prev, ...updates }));
    
    // Update in database
    if (card.id && supabaseUser) {
      try {
        await db.updateCard(card.id, updates);
      } catch (error) {
        console.error('Error updating card:', error);
      }
    }
  };

  const addLink = async (link: SocialLink) => {
    setCard(prev => ({ ...prev, links: [...prev.links, link] }));
    
    // Add to database
    if (card.id && supabaseUser) {
      try {
        await db.addCardLink(card.id, {
          platform: link.platform,
          url: link.url,
          label: link.label,
          position: card.links.length
        });
      } catch (error) {
        console.error('Error adding link:', error);
      }
    }
  };

  const removeLink = async (id: string) => {
    setCard(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));
    
    // Remove from database
    if (supabaseUser) {
      try {
        await db.deleteCardLink(id);
      } catch (error) {
        console.error('Error removing link:', error);
      }
    }
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