# YouTube Data Fetching Alternatives

## Current Issue
The current implementation uses Gemini AI with Google Search to fetch YouTube channel data, which can be inaccurate and unreliable.

## Best Alternatives (Ranked by Accuracy & Reliability)

---

## ⭐ **Option 1: YouTube Data API v3 (RECOMMENDED)**

### Why It's Best:
- **Official Google API** - Most accurate and reliable
- **Real-time data** - Always up-to-date
- **Comprehensive data** - Subscribers, videos, views, description, thumbnails, banners
- **Free tier** - 10,000 quota units/day (enough for ~100 channel lookups/day)

### Setup Steps:

1. **Get API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select project
   - Enable "YouTube Data API v3"
   - Create API Key in Credentials

2. **Add to Environment Variables:**
   ```env
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   # In Vercel: T_VITE_YOUTUBE_API_KEY
   ```

3. **Implementation Code:**

```typescript
// services/youtube.ts
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
      
      if (handleData.items && handleData.items.length > 0) {
        channelId = handleData.items[0].snippet.channelId;
      }
    } else if (channelInput.includes('/channel/')) {
      // Channel ID format: youtube.com/channel/UCxxxxx
      channelId = channelInput.split('/channel/')[1].split(/[?/]/)[0];
    } else if (channelInput.match(/^UC[\w-]{22}$/)) {
      // Direct channel ID
      channelId = channelInput;
    }

    if (!channelId) {
      throw new Error('Could not extract channel ID from URL');
    }

    // Fetch channel details
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found');
    }

    const channel = channelData.items[0];
    const snippet = channel.snippet;
    const statistics = channel.statistics;
    const branding = channel.brandingSettings;

    // Format subscriber count
    const formatCount = (count: string) => {
      const num = parseInt(count);
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return {
      channelName: snippet.title,
      handle: handle ? `@${handle}` : snippet.customUrl || `@${snippet.title.replace(/\s/g, '')}`,
      channelUrl: `https://youtube.com/channel/${channelId}`,
      subscribers: formatCount(statistics.subscriberCount),
      videosCount: statistics.videoCount,
      totalViews: formatCount(statistics.viewCount),
      description: snippet.description || branding?.channel?.description || '',
      logoUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default.url,
      bannerUrl: branding?.image?.bannerExternalUrl || '',
      location: snippet.country || undefined
    };

  } catch (error) {
    console.error('YouTube API Error:', error);
    throw new Error('Failed to fetch YouTube channel data. Please check the URL and try again.');
  }
}
```

### Quota Usage:
- 1 search query = 100 units
- 1 channel query = 1 unit
- Daily limit: 10,000 units = ~100 channel lookups

---

## ⭐ **Option 2: RapidAPI YouTube v3 (Easier Setup)**

### Why It's Good:
- No Google Cloud setup needed
- Same data as official API
- Generous free tier
- Better quota management

### Setup:

1. **Sign up:** [RapidAPI YouTube v3](https://rapidapi.com/ytdlfree/api/youtube-v31)
2. **Get API Key** from dashboard
3. **Add to environment:**
   ```env
   VITE_RAPIDAPI_KEY=your_rapidapi_key
   ```

### Implementation:

```typescript
// services/youtube-rapid.ts
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

export async function getYouTubeChannelData(channelUrl: string): Promise<YouTubeChannelData> {
  const channelId = extractChannelId(channelUrl);
  
  const response = await fetch(
    `https://youtube-v31.p.rapidapi.com/channels?part=snippet,statistics,brandingSettings&id=${channelId}`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
      }
    }
  );

  const data = await response.json();
  // Process similar to Option 1
  return processChannelData(data);
}
```

**Pricing:**
- Free: 500 requests/month
- Basic: $9.99/mo - 10,000 requests
- Pro: $49.99/mo - 100,000 requests

---

## ⭐ **Option 3: YouTube oEmbed API (Simple, No Auth)**

### Why It's Good:
- **No API key required**
- Free forever
- Simple to use
- Good for basic info

### Limitations:
- Only works with video URLs (not channels directly)
- Limited data (title, thumbnail, author)
- No subscriber count or statistics

### Implementation:

```typescript
// services/youtube-oembed.ts
export async function getYouTubeChannelBasicData(videoUrl: string) {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`
  );
  
  const data = await response.json();
  
  return {
    channelName: data.author_name,
    channelUrl: data.author_url,
    logoUrl: data.thumbnail_url,
    title: data.title
  };
}
```

**Good for:** Quick previews, basic channel info

---

## ⭐ **Option 4: Invidious API (Privacy-Focused)**

### Why It's Good:
- Open source
- No API key needed
- Good privacy alternative
- Free

### Implementation:

```typescript
// services/youtube-invidious.ts
const INVIDIOUS_INSTANCES = [
  'https://invidious.snopyta.org',
  'https://yewtu.be',
  'https://invidious.kavin.rocks'
];

export async function getYouTubeChannelData(channelId: string) {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const response = await fetch(`${instance}/api/v1/channels/${channelId}`);
      const data = await response.json();
      
      return {
        channelName: data.author,
        subscribers: formatCount(data.subCount),
        videosCount: data.videoCount.toString(),
        description: data.description,
        logoUrl: data.authorThumbnails.find(t => t.quality === 'high')?.url,
        bannerUrl: data.authorBanners?.[0]?.url
      };
    } catch (error) {
      continue; // Try next instance
    }
  }
  throw new Error('All Invidious instances failed');
}
```

---

## ⭐ **Option 5: Web Scraping (Last Resort)**

### Using Puppeteer/Playwright:

```typescript
// services/youtube-scraper.ts
import { chromium } from 'playwright';

export async function scrapeYouTubeChannel(channelUrl: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(channelUrl);
  await page.waitForSelector('#channel-header');
  
  const data = await page.evaluate(() => {
    return {
      channelName: document.querySelector('#channel-name')?.textContent,
      subscribers: document.querySelector('#subscriber-count')?.textContent,
      // ... extract other data
    };
  });
  
  await browser.close();
  return data;
}
```

**Issues:**
- Slow
- Unreliable (breaks when YouTube changes HTML)
- Resource-intensive
- May violate ToS

---

## 📊 Comparison Table

| Method | Accuracy | Reliability | Setup Difficulty | Cost | Rate Limit |
|--------|----------|-------------|-----------------|------|------------|
| **YouTube Data API v3** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Medium | Free (10K/day) | 10,000 units/day |
| **RapidAPI YouTube** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Easy | $0-50/mo | 500-100K/mo |
| **YouTube oEmbed** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Very Easy | Free | Unlimited |
| **Invidious API** | ⭐⭐⭐⭐ | ⭐⭐⭐ | Easy | Free | Varies |
| **Web Scraping** | ⭐⭐ | ⭐⭐ | Hard | Free | None |
| **Gemini AI (Current)** | ⭐⭐ | ⭐⭐ | Medium | Free | Limited |

---

## 🎯 Recommendation

**Use YouTube Data API v3 (Option 1)** because:

1. ✅ **Most Accurate** - Official Google API
2. ✅ **Reliable** - 99.9% uptime
3. ✅ **Free** - 10,000 quota units/day is plenty
4. ✅ **Complete Data** - All statistics, thumbnails, banners
5. ✅ **Future-Proof** - Won't break with YouTube changes

### Quick Start:

1. Get API key from Google Cloud Console
2. Add `VITE_YOUTUBE_API_KEY` to `.env`
3. Replace `getYouTubeChannelDetails` in `services/gemini.ts` with Option 1 code
4. Add `T_VITE_YOUTUBE_API_KEY` to Vercel environment variables

---

## 🚀 Implementation Priority

1. **Immediate:** Switch to YouTube Data API v3
2. **Fallback:** Add RapidAPI as backup if quota exceeded
3. **Future:** Consider Invidious for privacy-focused users

Would you like me to implement the YouTube Data API v3 integration now?
