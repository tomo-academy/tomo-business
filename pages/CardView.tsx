import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/database';
import { downloadVCard, shareCard, copyToClipboard, hashIP, getClientIP, generateMetaTags } from '../lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, Share2, Mail, Phone, MapPin, Building2, 
  ExternalLink, Copy, Check, Instagram, Twitter, Facebook, 
  Linkedin, Github, Youtube, MessageCircle, Globe 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const CardView: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCard();
    trackView();
  }, [cardId]);

  const loadCard = async () => {
    if (!cardId) {
      setError('Invalid card ID');
      setLoading(false);
      return;
    }

    try {
      const cardData = await db.getCardById(cardId);
      if (!cardData || !cardData.is_public) {
        setError('Card not found or is private');
        setLoading(false);
        return;
      }

      // Convert database format to app format
      const formattedCard = {
        id: cardData.id,
        displayName: cardData.display_name,
        title: cardData.title,
        bio: cardData.bio,
        company: cardData.company,
        location: cardData.location,
        email: cardData.email,
        phone: cardData.phone,
        avatarUrl: cardData.avatar_url,
        coverUrl: cardData.cover_url,
        theme: {
          primaryColor: cardData.theme_primary_color,
          backgroundColor: cardData.theme_background_color,
          fontFamily: cardData.theme_font_family,
          layout: cardData.theme_layout
        }
      };

      setCard(formattedCard);

      // Load links
      const cardLinks = await db.getCardLinks(cardId);
      setLinks(cardLinks.map((l: any) => ({
        id: l.id,
        platform: l.platform,
        url: l.url,
        label: l.label
      })));

      // Update SEO
      const meta = generateMetaTags(formattedCard);
      document.title = meta.title;
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading card:', err);
      setError('Failed to load card');
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (!cardId) return;
    try {
      const ip = await getClientIP();
      const ipHash = hashIP(ip);
      await db.trackView(cardId, ipHash, {
        userAgent: navigator.userAgent,
        referer: document.referrer
      });
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const handleLinkClick = async (link: any) => {
    if (!cardId) return;
    try {
      const ip = await getClientIP();
      const ipHash = hashIP(ip);
      await db.trackClick(cardId, link.id, link.platform, ipHash);
    } catch (err) {
      console.error('Error tracking click:', err);
    }
    window.open(link.url, '_blank');
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardId) return;
    
    setSubmitting(true);
    try {
      await db.createContactSubmission(cardId, contactForm);
      alert('Message sent successfully!');
      setShowContactForm(false);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: any } = {
      instagram: Instagram,
      twitter: Twitter,
      facebook: Facebook,
      linkedin: Linkedin,
      github: Github,
      youtube: Youtube,
      whatsapp: MessageCircle,
      website: Globe,
      email: Mail
    };
    return icons[platform] || ExternalLink;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Card Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: card.theme.backgroundColor, fontFamily: card.theme.fontFamily }}>
      {/* Cover Image */}
      {card.coverUrl && (
        <div className="w-full h-48 md:h-64 overflow-hidden">
          <img src={card.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <img
              src={card.avatarUrl || 'https://via.placeholder.com/150'}
              alt={card.displayName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              style={{ borderColor: card.theme.primaryColor }}
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: card.theme.primaryColor }}>
            {card.displayName}
          </h1>
          
          {card.title && (
            <p className="text-xl text-gray-600 mb-2">{card.title}</p>
          )}
          
          {card.company && (
            <p className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Building2 size={18} />
              {card.company}
            </p>
          )}
          
          {card.location && (
            <p className="flex items-center justify-center gap-2 text-gray-500">
              <MapPin size={16} />
              {card.location}
            </p>
          )}
          
          {card.bio && (
            <p className="mt-4 text-gray-700 max-w-xl mx-auto">{card.bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Button
            onClick={() => downloadVCard(card)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Save Contact
          </Button>
          
          <Button
            onClick={() => shareCard(card)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 size={18} />
            Share
          </Button>
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="flex items-center gap-2"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: card.theme.primaryColor }}>
            Contact Information
          </h2>
          
          <div className="space-y-3">
            {card.email && (
              <a
                href={`mailto:${card.email}`}
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition"
              >
                <Mail size={20} style={{ color: card.theme.primaryColor }} />
                {card.email}
              </a>
            )}
            
            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition"
              >
                <Phone size={20} style={{ color: card.theme.primaryColor }} />
                {card.phone}
              </a>
            )}
          </div>
        </div>

        {/* Social Links */}
        {links.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: card.theme.primaryColor }}>
              Connect With Me
            </h2>
            
            <div className="space-y-3">
              {links.map((link) => {
                const Icon = getPlatformIcon(link.platform);
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left"
                    style={{ borderLeft: `4px solid ${card.theme.primaryColor}` }}
                  >
                    <Icon size={24} style={{ color: card.theme.primaryColor }} />
                    <span className="flex-1 font-medium capitalize">{link.label || link.platform}</span>
                    <ExternalLink size={16} className="text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: card.theme.primaryColor }}>
            Send Me a Message
          </h2>
          
          {!showContactForm ? (
            <Button
              onClick={() => setShowContactForm(true)}
              className="w-full"
              style={{ backgroundColor: card.theme.primaryColor }}
            >
              Contact Me
            </Button>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
              />
              
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
              />
              
              <input
                type="tel"
                placeholder="Your Phone (optional)"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
              />
              
              <textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
              />
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                  style={{ backgroundColor: card.theme.primaryColor }}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: card.theme.primaryColor }}>
            Scan to Connect
          </h2>
          
          <div className="inline-block p-4 bg-white rounded-lg">
            <QRCodeSVG
              value={`${window.location.origin}/#/c/${card.id}`}
              size={200}
              level="H"
              fgColor={card.theme.primaryColor}
              imageSettings={{
                src: "/logo.png",
                height: 50,
                width: 50,
                excavate: true,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-500 text-sm">Powered by <a href="/" className="font-semibold hover:underline">TOMO BUSINESS</a></p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>Designed by ❤️ AJ STUDIOZ</span>
            <img src="/AJ.svg" alt="AJ STUDIOZ" className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
