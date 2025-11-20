import { GoogleGenAI } from "@google/genai";

// Initialize with environment variable as per guidelines. 
// Assume process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBio = async (name: string, role: string, keywords: string, tone: string = 'professional'): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Write a short, ${tone} bio for a digital business card.
    Name: ${name}
    Role: ${role}
    Keywords/Topics/Skills: ${keywords || "general professional skills"}
    
    Keep it under 160 characters if possible. No hashtags. Write in first person.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    // The GenerateContentResponse object features a text property (not a method)
    return response.text?.trim() || "Creative professional passionate about building great experiences.";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Creative professional passionate about building great experiences.";
  }
};

export const getYouTubeChannelDetails = async (url: string) => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `You are a data extraction assistant. I will provide a YouTube channel URL.
    Your task is to find the following details for the channel:
    1. Channel Name
    2. Handle (e.g. @username)
    3. Subscriber Count (e.g. 1.2M, 500K)
    4. Video Count
    5. Profile Picture URL (Logo) - Find the actual image source URL if possible.
    6. Channel Banner Image URL (Cover) - Find the actual banner image source URL if possible.
    7. Channel Description (Short summary, max 150 chars)
    8. Total Views (approximate, e.g. 1.5B)
    9. Location/Country (if available)

    URL: ${url}

    Return the data strictly as a JSON object wrapped in a markdown code block. 
    Format:
    \`\`\`json
    {
      "channelName": "Name",
      "handle": "@handle",
      "subscribers": "1M",
      "videosCount": "500",
      "logoUrl": "url_string",
      "bannerUrl": "url_string",
      "description": "Channel summary...",
      "totalViews": "1.5B",
      "location": "United States"
    }
    \`\`\`
    If you cannot find the exact image URLs, use placeholder strings but prefer real ones.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract JSON from code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const data = JSON.parse(jsonMatch[1]);
      return data;
    }
    
    // Try parsing raw text if no code block
    if (text.trim().startsWith('{')) {
        return JSON.parse(text);
    }

    throw new Error("Failed to parse channel data");
  } catch (error) {
    console.error("Error fetching YouTube details:", error);
    return null;
  }
};