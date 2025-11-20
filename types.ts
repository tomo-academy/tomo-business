
export interface SocialLink {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'github' | 'youtube' | 'whatsapp' | 'email' | 'website';
  url: string;
  label?: string;
}

export interface CardTheme {
  primaryColor: string; // e.g., Hex code
  backgroundColor: string;
  fontFamily: string;
  layout: 'classic' | 'modern' | 'minimal';
}

export interface CardData {
  id: string;
  displayName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  links: SocialLink[];
  theme: CardTheme;
  customDomain?: string;
  customDomainStatus?: 'pending' | 'active' | 'error' | 'none';
  nfcActive?: boolean;
}

export interface YouTubeCardSettings {
  showSubscribers: boolean;
  showVideos: boolean;
  theme: 'red' | 'dark';
}

export interface YouTubeCardData {
  channelName: string;
  handle: string;
  subscribers: string;
  logoUrl: string;
  bannerUrl?: string;
  channelUrl: string;
  videosCount: string;
  description?: string;
  totalViews?: string;
  location?: string;
  nfcActive: boolean;
  settings: YouTubeCardSettings;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
}

export interface AnalyticsStat {
  label: string;
  value: number;
  change: number; // percentage
}