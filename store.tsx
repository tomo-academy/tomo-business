import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './lib/auth';
import { CardData, User, SocialLink, YouTubeCardData } from './types';
import { getYouTubeChannelData } from './services/youtube';
import { db } from './lib/database';

interface AppState {
  user: User | null;
  card: CardData;
  cards: CardData[];
  youtubeCard: YouTubeCardData | null;
  youtubeCardId: string | null;
  login: (email: string) => void;
  logout: () => void;
  updateCard: (updates: Partial<CardData>) => void;
  addLink: (link: SocialLink) => void;
  removeLink: (id: string) => void;
  generateYouTubeCard: (url: string) => Promise<void>;
  removeYouTubeCard: () => Promise<void>;
  updateYouTubeCard: (updates: Partial<YouTubeCardData>) => Promise<void>;
  switchCard: (cardId: string) => void;
  createNewCard: (name: string) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
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
  const [cards, setCards] = useState<CardData[]>([]);
  const [youtubeCard, setYoutubeCard] = useState<YouTubeCardData | null>(null);
  const [youtubeCardId, setYoutubeCardId] = useState<string | null>(null);

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
      const userCards = await db.getUserCards(supabaseUser.id);
      if (userCards.length > 0) {
        const firstCard = userCards[0];
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
          customDomain: firstCard.custom_domain || undefined,
          customDomainStatus: firstCard.custom_domain_status || 'none',
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
        
        // Load all cards for selection
        const allCardsData = await Promise.all(
          userCards.map(async (c: any) => {
            const cLinks = await db.getCardLinks(c.id);
            return {
              id: c.id,
              displayName: c.display_name,
              title: c.title || '',
              bio: c.bio || '',
              avatarUrl: c.avatar_url || defaultCard.avatarUrl,
              coverUrl: c.cover_url || defaultCard.coverUrl,
              company: c.company || '',
              location: c.location || '',
              email: c.email || userData.email,
              phone: c.phone || '',
              links: cLinks.map((l: any) => ({
                id: l.id,
                platform: l.platform,
                url: l.url,
                label: l.label
              })),
              theme: {
                primaryColor: c.theme_primary_color || '#000000',
                backgroundColor: c.theme_background_color || '#FFFFFF',
                fontFamily: c.theme_font_family || 'Inter',
                layout: c.theme_layout || 'modern'
              },
              customDomain: c.custom_domain || undefined,
              customDomainStatus: c.custom_domain_status || 'none',
              nfcActive: false
            };
          })
        );
        setCards(allCardsData);
        
        // Load YouTube cards
        const youtubeCards = await db.getUserYouTubeCards(supabaseUser.id);
        if (youtubeCards && youtubeCards.length > 0) {
          const ytCard = youtubeCards[0]; // For now, use the first one
          setYoutubeCardId(ytCard.id);
          setYoutubeCard({
            channelName: ytCard.channel_name,
            handle: ytCard.handle,
            subscribers: ytCard.subscribers,
            videosCount: ytCard.videos_count,
            logoUrl: ytCard.logo_url,
            bannerUrl: ytCard.banner_url,
            description: ytCard.description,
            totalViews: ytCard.total_views,
            location: ytCard.location,
            channelUrl: ytCard.channel_url,
            nfcActive: ytCard.nfc_active || false,
            settings: {
              showSubscribers: ytCard.show_subscribers !== false,
              showVideos: ytCard.show_videos !== false,
              theme: ytCard.theme || 'dark'
            }
          });
        }
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
    // Call YouTube Data API v3 to get accurate details
    const data = await getYouTubeChannelData(url);

    // All data is now accurate from YouTube API
    const channelName = data.channelName;
    const handle = data.handle;
    const subscribers = data.subscribers;
    const videosCount = data.videosCount;
    const totalViews = data.totalViews;
    const location = data.location || "Global";
    
    // Use high-quality images from YouTube API
    const logoUrl = data.logoUrl || card.avatarUrl; // Fallback to user avatar
    const bannerUrl = data.bannerUrl || undefined;
    
    // Use description from YouTube API (official channel description)
    const description = data.description || `Welcome to ${channelName}! Subscribe for amazing content.`;

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
    
    // Save to database
    if (supabaseUser) {
      try {
        const savedCard = await db.createYouTubeCard(supabaseUser.id, {
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
          settings: {
            theme: 'dark',
            showSubscribers: true,
            showVideos: true
          }
        });
        if (savedCard) {
          setYoutubeCardId(savedCard.id);
        }
      } catch (error) {
        console.error('Error saving YouTube card:', error);
      }
    }
  };

  const removeYouTubeCard = async () => {
    if (youtubeCardId && supabaseUser) {
      try {
        await db.deleteYouTubeCard(youtubeCardId);
      } catch (error) {
        console.error('Error deleting YouTube card:', error);
      }
    }
    setYoutubeCard(null);
    setYoutubeCardId(null);
  };

  const updateYouTubeCard = async (updates: Partial<YouTubeCardData>) => {
    if (!youtubeCard) return;
    
    setYoutubeCard(prev => prev ? { ...prev, ...updates } : null);
    
    // Persist to database
    if (youtubeCardId && supabaseUser) {
      try {
        await db.updateYouTubeCard(youtubeCardId, updates);
      } catch (error) {
        console.error('Error updating YouTube card:', error);
      }
    }
  };

  const switchCard = (cardId: string) => {
    const selectedCard = cards.find(c => c.id === cardId);
    if (selectedCard) {
      setCard(selectedCard);
    }
  };

  const createNewCard = async (name: string) => {
    if (!supabaseUser) return;
    
    try {
      const newCard = await db.createCard(supabaseUser.id, {
        ...defaultCard,
        displayName: name,
        email: user?.email || ''
      });
      
      const cardData: CardData = {
        ...defaultCard,
        id: newCard.id,
        displayName: name,
        email: user?.email || ''
      };
      
      setCards(prev => [...prev, cardData]);
      setCard(cardData);
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!supabaseUser || cards.length <= 1) return; // Keep at least one card
    
    try {
      await db.deleteCard(cardId);
      const updatedCards = cards.filter(c => c.id !== cardId);
      setCards(updatedCards);
      
      // Switch to first card if current card was deleted
      if (card.id === cardId && updatedCards.length > 0) {
        setCard(updatedCards[0]);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      card,
      cards, 
      youtubeCard,
      youtubeCardId, 
      login, 
      logout, 
      updateCard, 
      addLink, 
      removeLink, 
      generateYouTubeCard, 
      removeYouTubeCard,
      updateYouTubeCard,
      switchCard,
      createNewCard,
      deleteCard
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