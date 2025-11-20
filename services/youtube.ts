const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export interface YouTubeChannelData {
  channelName: string;
  handle: string;
  channelUrl: string;
  subscribers: string;
  videosCount: string;
  totalViews: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  location?: string;
}

export async function getYouTubeChannelData(channelInput: string): Promise<YouTubeChannelData> {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured. Please add VITE_YOUTUBE_API_KEY to your environment variables.');
    }

    // Extract channel ID or handle
    let channelId = '';
    let handle = '';
    
    if (channelInput.includes('@')) {
      // Handle format: @username or youtube.com/@username
      handle = channelInput.includes('@') 
        ? channelInput.split('@')[1].split(/[?/]/)[0]
        : '';
      
      // Get channel ID from handle
      const handleResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=@${handle}&key=${YOUTUBE_API_KEY}`
      );
      const handleData = await handleResponse.json();
      
      if (handleData.error) {
        throw new Error(handleData.error.message || 'Failed to fetch channel data');
      }
      
      if (handleData.items && handleData.items.length > 0) {
        channelId = handleData.items[0].snippet.channelId;
      }
    } else if (channelInput.includes('/channel/')) {
      // Channel ID format: youtube.com/channel/UCxxxxx
      channelId = channelInput.split('/channel/')[1].split(/[?/]/)[0];
    } else if (channelInput.match(/^UC[\w-]{22}$/)) {
      // Direct channel ID
      channelId = channelInput;
    } else if (channelInput.includes('/c/') || channelInput.includes('/user/')) {
      // Legacy format - try search
      const username = channelInput.split('/c/')[1]?.split(/[?/]/)[0] || 
                       channelInput.split('/user/')[1]?.split(/[?/]/)[0];
      if (username) {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(username)}&key=${YOUTUBE_API_KEY}`
        );
        const searchData = await searchResponse.json();
        
        if (searchData.items && searchData.items.length > 0) {
          channelId = searchData.items[0].snippet.channelId;
        }
      }
    }

    if (!channelId) {
      throw new Error('Could not extract channel ID from URL. Please use a valid YouTube channel URL or @handle.');
    }

    // Fetch channel details
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    
    const channelData = await channelResponse.json();
    
    if (channelData.error) {
      throw new Error(channelData.error.message || 'Failed to fetch channel details');
    }
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found. Please check the URL and try again.');
    }

    const channel = channelData.items[0];
    const snippet = channel.snippet;
    const statistics = channel.statistics;
    const branding = channel.brandingSettings;

    // Format subscriber count
    const formatCount = (count: string | number) => {
      const num = typeof count === 'string' ? parseInt(count) : count;
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    // Get best handle
    const channelHandle = handle 
      ? `@${handle}` 
      : snippet.customUrl 
        ? (snippet.customUrl.startsWith('@') ? snippet.customUrl : `@${snippet.customUrl}`)
        : `@${snippet.title.replace(/\s/g, '')}`;

    return {
      channelName: snippet.title,
      handle: channelHandle,
      channelUrl: `https://youtube.com/channel/${channelId}`,
      subscribers: formatCount(statistics.subscriberCount || 0),
      videosCount: statistics.videoCount || '0',
      totalViews: formatCount(statistics.viewCount || 0),
      description: snippet.description || branding?.channel?.description || '',
      logoUrl: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url || '',
      bannerUrl: branding?.image?.bannerExternalUrl || '',
      location: snippet.country || undefined
    };

  } catch (error) {
    console.error('YouTube API Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch YouTube channel data. Please check the URL and try again.');
  }
}
