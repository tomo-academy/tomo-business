import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from 'crypto-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a slug-friendly URL from a name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Hash IP address for analytics (privacy-friendly)
export function hashIP(ip: string): string {
  return CryptoJS.SHA256(ip).toString();
}

// Format number with K, M, B suffixes
export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// Get client IP (works with Vercel)
export async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

// Generate vCard data
export function generateVCard(card: any): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.displayName || ''}`,
    `TITLE:${card.title || ''}`,
    `ORG:${card.company || ''}`,
    `TEL:${card.phone || ''}`,
    `EMAIL:${card.email || ''}`,
    `ADR:;;;;;;${card.location || ''}`,
    `URL:${window.location.origin}/c/${card.id}`,
    `NOTE:${card.bio || ''}`,
    'END:VCARD'
  ].join('\n');
  
  return vcard;
}

// Download vCard file
export function downloadVCard(card: any) {
  const vcard = generateVCard(card);
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${generateSlug(card.displayName || 'contact')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Share via Web Share API
export async function shareCard(card: any): Promise<boolean> {
  const url = `${window.location.origin}/c/${card.id}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: card.displayName,
        text: `Check out ${card.displayName}'s digital business card`,
        url: url
      });
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return false;
    }
  } else {
    return copyToClipboard(url);
  }
}

// Download QR code as image
export function downloadQRCode(cardId: string, displayName: string) {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = `${generateSlug(displayName)}-qr-code.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Format date relative to now
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate URL
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Get platform icon name
export function getPlatformIcon(platform: string): string {
  const icons: { [key: string]: string } = {
    instagram: 'instagram',
    twitter: 'twitter',
    facebook: 'facebook',
    linkedin: 'linkedin',
    github: 'github',
    youtube: 'youtube',
    whatsapp: 'message-circle',
    email: 'mail',
    website: 'globe',
    tiktok: 'music',
    discord: 'message-square',
    telegram: 'send'
  };
  return icons[platform.toLowerCase()] || 'link';
}

// SEO: Generate meta tags
export function generateMetaTags(card: any) {
  const title = `${card.displayName} | ${card.title || 'Digital Business Card'}`;
  const description = card.bio || `Connect with ${card.displayName} - View their digital business card`;
  const image = card.avatarUrl || '/default-og-image.png';
  const url = `${window.location.origin}/c/${card.id}`;
  
  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image
  };
}