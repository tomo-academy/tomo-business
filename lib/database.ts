import { createClient } from '@supabase/supabase-js';

// vite.config.ts handles T_ prefix mapping from Vercel
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Some features may not work.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database helper functions using Supabase
export const db = {
  // User operations
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createUser(userData: { id: string; email: string; name?: string; avatar_url?: string }) {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Business card operations
  async getUserCards(userId: string) {
    const { data, error } = await supabase
      .from('business_cards')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getCardById(cardId: string) {
    const { data, error } = await supabase
      .from('business_cards')
      .select('*')
      .eq('id', cardId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createCard(userId: string, cardData: any) {
    const { data, error} = await supabase
      .from('business_cards')
      .insert({
        user_id: userId,
        display_name: cardData.displayName,
        title: cardData.title,
        bio: cardData.bio,
        company: cardData.company,
        location: cardData.location,
        email: cardData.email,
        phone: cardData.phone,
        avatar_url: cardData.avatarUrl,
        cover_url: cardData.coverUrl,
        theme_primary_color: cardData.theme?.primaryColor || '#000000',
        theme_background_color: cardData.theme?.backgroundColor || '#FFFFFF',
        theme_font_family: cardData.theme?.fontFamily || 'Inter',
        theme_layout: cardData.theme?.layout || 'modern'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCard(cardId: string, updates: any) {
    const updateData: any = {};
    
    if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.company !== undefined) updateData.company = updates.company;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
    if (updates.coverUrl !== undefined) updateData.cover_url = updates.coverUrl;
    if (updates.theme?.primaryColor !== undefined) updateData.theme_primary_color = updates.theme.primaryColor;
    if (updates.theme?.backgroundColor !== undefined) updateData.theme_background_color = updates.theme.backgroundColor;
    if (updates.theme?.fontFamily !== undefined) updateData.theme_font_family = updates.theme.fontFamily;
    if (updates.theme?.layout !== undefined) updateData.theme_layout = updates.theme.layout;

    if (Object.keys(updateData).length === 0) return null;

    const { data, error } = await supabase
      .from('business_cards')
      .update(updateData)
      .eq('id', cardId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCard(cardId: string) {
    const { error } = await supabase
      .from('business_cards')
      .update({ is_active: false })
      .eq('id', cardId);
    
    if (error) throw error;
  },

  async duplicateCard(cardId: string, userId: string) {
    // Get the original card
    const original = await this.getCardById(cardId);
    if (!original) throw new Error('Card not found');

    // Create new card with same data
    const newCard = await this.createCard(userId, {
      displayName: `${original.display_name} (Copy)`,
      title: original.title,
      bio: original.bio,
      company: original.company,
      location: original.location,
      email: original.email,
      phone: original.phone,
      avatarUrl: original.avatar_url,
      coverUrl: original.cover_url,
      theme: {
        primaryColor: original.theme_primary_color,
        backgroundColor: original.theme_background_color,
        fontFamily: original.theme_font_family,
        layout: original.theme_layout
      }
    });

    // Copy all links
    const links = await this.getCardLinks(cardId);
    for (const link of links) {
      await this.addCardLink(newCard.id, {
        platform: link.platform,
        url: link.url,
        label: link.label,
        position: link.position
      });
    }

    return newCard;
  },

  // Card links operations
  async getCardLinks(cardId: string) {
    const { data, error } = await supabase
      .from('card_links')
      .select('*')
      .eq('card_id', cardId)
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async addCardLink(cardId: string, linkData: { platform: string; url: string; label?: string; position?: number }) {
    const { data, error } = await supabase
      .from('card_links')
      .insert({
        card_id: cardId,
        platform: linkData.platform,
        url: linkData.url,
        label: linkData.label,
        position: linkData.position || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCardLink(linkId: string) {
    const { error } = await supabase
      .from('card_links')
      .delete()
      .eq('id', linkId);
    
    if (error) throw error;
  },

  // Analytics operations
  async trackView(cardId: string, ipHash: string, metadata: any = {}) {
    const { error } = await supabase
      .from('card_views')
      .insert({
        card_id: cardId,
        ip_hash: ipHash,
        user_agent: metadata.userAgent,
        referer: metadata.referer,
        country: metadata.country,
        city: metadata.city,
        viewed_at: new Date().toISOString()
      });
    
    if (error) console.error('Error tracking view:', error);
  },

  async trackClick(cardId: string, linkId: string | null, platform: string, ipHash: string, linkUrl?: string) {
    const { error } = await supabase
      .from('card_clicks')
      .insert({
        card_id: cardId,
        link_id: linkId,
        platform,
        ip_hash: ipHash,
        link_url: linkUrl,
        clicked_at: new Date().toISOString()
      });
    
    if (error) console.error('Error tracking click:', error);
  },

  async getCardAnalytics(cardId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: views } = await supabase
      .from('card_views')
      .select('viewed_at')
      .eq('card_id', cardId)
      .gte('viewed_at', startDate.toISOString());

    const { data: clicks } = await supabase
      .from('card_clicks')
      .select('clicked_at, platform')
      .eq('card_id', cardId)
      .gte('clicked_at', startDate.toISOString());

    const { count: totalViews } = await supabase
      .from('card_views')
      .select('*', { count: 'exact', head: true })
      .eq('card_id', cardId);

    const { count: totalClicks } = await supabase
      .from('card_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('card_id', cardId);

    return {
      views: views || [],
      clicks: clicks || [],
      totalViews: totalViews || 0,
      totalClicks: totalClicks || 0,
      topLinks: []
    };
  },

  // YouTube cards operations
  async getUserYouTubeCards(userId: string) {
    const { data, error } = await supabase
      .from('youtube_cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createYouTubeCard(userId: string, cardData: any) {
    const { data, error } = await supabase
      .from('youtube_cards')
      .insert({
        user_id: userId,
        channel_name: cardData.channelName,
        handle: cardData.handle,
        channel_url: cardData.channelUrl,
        subscribers: cardData.subscribers,
        videos_count: cardData.videosCount,
        total_views: cardData.totalViews,
        description: cardData.description,
        location: cardData.location,
        logo_url: cardData.logoUrl,
        banner_url: cardData.bannerUrl,
        theme: cardData.settings?.theme || 'dark',
        show_subscribers: cardData.settings?.showSubscribers !== false,
        show_videos: cardData.settings?.showVideos !== false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateYouTubeCard(cardId: string, updates: any) {
    const updateData: any = {};
    
    if (updates.theme !== undefined) updateData.theme = updates.theme;
    if (updates.settings?.showSubscribers !== undefined) updateData.show_subscribers = updates.settings.showSubscribers;
    if (updates.settings?.showVideos !== undefined) updateData.show_videos = updates.settings.showVideos;
    if (updates.nfcActive !== undefined) updateData.nfc_active = updates.nfcActive;

    if (Object.keys(updateData).length === 0) return null;

    const { data, error } = await supabase
      .from('youtube_cards')
      .update(updateData)
      .eq('id', cardId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteYouTubeCard(cardId: string) {
    const { error } = await supabase
      .from('youtube_cards')
      .delete()
      .eq('id', cardId);
    
    if (error) throw error;
  },

  // Templates
  async getTemplates() {
    const { data, error } = await supabase
      .from('card_templates')
      .select('*')
      .eq('is_active', true)
      .order('usage_count', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Contact submissions
  async createContactSubmission(cardId: string, contactData: { name: string; email: string; phone?: string; message: string }) {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        card_id: cardId,
        sender_name: contactData.name,
        sender_email: contactData.email,
        sender_phone: contactData.phone,
        message: contactData.message
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCardContacts(cardId: string) {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('card_id', cardId)
      .order('created_at', { ascending: false});
    
    if (error) throw error;
    return data || [];
  },

  // Image upload to Supabase Storage
  async uploadImage(file: File, bucket: string = 'avatars'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  }
};
