import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  Mail, Copy, Check, Download, Eye, EyeOff,
  Sparkles, Phone, MapPin, Globe, Linkedin, Twitter
} from 'lucide-react';
import { motion } from 'framer-motion';

export const EmailSignature: React.FC = () => {
  const { card } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [includeSocial, setIncludeSocial] = useState(true);
  const [style, setStyle] = useState<'modern' | 'classic' | 'minimal'>('modern');

  const generateSignatureHTML = () => {
    const baseStyles = `
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1f2937;
      line-height: 1.6;
    `;

    const modernTemplate = `
      <table cellpadding="0" cellspacing="0" border="0" style="${baseStyles} max-width: 600px;">
        <tr>
          ${includePhoto ? `
            <td style="padding-right: 20px; vertical-align: top;">
              <img src="${card.avatarUrl}" alt="${card.displayName}" 
                   style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid ${card.theme.primaryColor};" />
            </td>
          ` : ''}
          <td style="vertical-align: top;">
            <div style="margin-bottom: 8px;">
              <div style="font-size: 18px; font-weight: bold; color: #111827;">${card.displayName}</div>
              <div style="font-size: 14px; color: ${card.theme.primaryColor}; font-weight: 600;">${card.title}</div>
              ${card.company ? `<div style="font-size: 13px; color: #6b7280;">${card.company}</div>` : ''}
            </div>
            
            <div style="margin-bottom: 12px; padding: 12px 0; border-top: 2px solid ${card.theme.primaryColor}; border-bottom: 2px solid ${card.theme.primaryColor};">
              ${card.email ? `
                <div style="margin-bottom: 6px;">
                  <a href="mailto:${card.email}" style="color: #374151; text-decoration: none; font-size: 13px;">
                    📧 ${card.email}
                  </a>
                </div>
              ` : ''}
              ${card.phone ? `
                <div style="margin-bottom: 6px;">
                  <a href="tel:${card.phone}" style="color: #374151; text-decoration: none; font-size: 13px;">
                    📱 ${card.phone}
                  </a>
                </div>
              ` : ''}
              ${card.location ? `
                <div style="font-size: 13px; color: #6b7280;">
                  📍 ${card.location}
                </div>
              ` : ''}
            </div>

            ${includeSocial && card.links?.length > 0 ? `
              <div style="margin-top: 12px;">
                ${card.links.slice(0, 4).map((link: any) => `
                  <a href="${link.url}" style="display: inline-block; margin-right: 12px; text-decoration: none;">
                    <img src="https://img.icons8.com/color/24/${link.platform}.png" alt="${link.platform}" style="width: 20px; height: 20px;" />
                  </a>
                `).join('')}
              </div>
            ` : ''}

            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
              <a href="${window.location.origin}/c/${card.id}" 
                 style="display: inline-block; padding: 8px 16px; background-color: ${card.theme.primaryColor}; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 600;">
                View My Card
              </a>
            </div>
          </td>
        </tr>
      </table>
    `;

    const classicTemplate = `
      <table cellpadding="0" cellspacing="0" border="0" style="${baseStyles} max-width: 600px; border-left: 4px solid ${card.theme.primaryColor}; padding-left: 15px;">
        <tr>
          <td>
            <div style="font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 4px;">${card.displayName}</div>
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 2px;">${card.title}</div>
            ${card.company ? `<div style="font-size: 13px; color: #9ca3af; margin-bottom: 12px;">${card.company}</div>` : ''}
            
            <div style="margin-top: 12px; font-size: 13px;">
              ${card.email ? `<div style="margin-bottom: 4px;">✉️ <a href="mailto:${card.email}" style="color: #374151; text-decoration: none;">${card.email}</a></div>` : ''}
              ${card.phone ? `<div style="margin-bottom: 4px;">☎️ <a href="tel:${card.phone}" style="color: #374151; text-decoration: none;">${card.phone}</a></div>` : ''}
              ${card.location ? `<div style="margin-bottom: 4px;">📍 ${card.location}</div>` : ''}
            </div>

            <div style="margin-top: 12px;">
              <a href="${window.location.origin}/c/${card.id}" style="color: ${card.theme.primaryColor}; text-decoration: none; font-size: 12px; font-weight: 600;">
                🔗 View Digital Card →
              </a>
            </div>
          </td>
        </tr>
      </table>
    `;

    const minimalTemplate = `
      <div style="${baseStyles} max-width: 500px;">
        <div style="font-size: 16px; font-weight: 600; color: #111827;">${card.displayName}</div>
        <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">${card.title}${card.company ? ` at ${card.company}` : ''}</div>
        
        <div style="font-size: 12px; color: #9ca3af;">
          ${card.email ? `${card.email}` : ''}${card.phone ? ` • ${card.phone}` : ''}
        </div>

        <div style="margin-top: 10px;">
          <a href="${window.location.origin}/c/${card.id}" 
             style="color: ${card.theme.primaryColor}; text-decoration: none; font-size: 11px; font-weight: 600;">
            My Digital Card →
          </a>
        </div>
      </div>
    `;

    const templates = {
      modern: modernTemplate,
      classic: classicTemplate,
      minimal: minimalTemplate
    };

    return templates[style];
  };

  const copySignature = () => {
    const html = generateSignatureHTML();
    
    // Copy HTML to clipboard
    const blob = new Blob([html], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });
    
    navigator.clipboard.write([clipboardItem]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback: copy as plain text
      navigator.clipboard.writeText(html).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    });
  };

  const downloadSignature = () => {
    const html = generateSignatureHTML();
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Signature - ${card.displayName}</title>
</head>
<body style="margin: 20px; font-family: Arial, sans-serif;">
  <h2>Your Email Signature</h2>
  <p>Copy the signature below and paste it into your email client's signature settings:</p>
  <hr style="margin: 20px 0;">
  ${html}
  <hr style="margin: 20px 0;">
  <h3>Instructions:</h3>
  <ul>
    <li><strong>Gmail:</strong> Settings → See all settings → General → Signature</li>
    <li><strong>Outlook:</strong> File → Options → Mail → Signatures</li>
    <li><strong>Apple Mail:</strong> Preferences → Signatures</li>
  </ul>
</body>
</html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-signature-${card.displayName.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            Email Signature Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900">
            Professional Email Signature
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Create a stunning email signature with your card information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-zinc-900">Customize Your Signature</h3>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-3">Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {['modern', 'classic', 'minimal'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s as any)}
                      className={`px-4 py-3 rounded-lg font-medium text-sm capitalize transition-all ${
                        style === s
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-zinc-700">Options</label>
                
                <label className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg cursor-pointer hover:bg-zinc-100 transition">
                  <input
                    type="checkbox"
                    checked={includePhoto}
                    onChange={(e) => setIncludePhoto(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-700">Include Profile Photo</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg cursor-pointer hover:bg-zinc-100 transition">
                  <input
                    type="checkbox"
                    checked={includeSocial}
                    onChange={(e) => setIncludeSocial(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-700">Include Social Links</span>
                </label>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <Button
                  onClick={copySignature}
                  className="w-full"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check size={16} className="mr-2" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-2" />
                      Copy Signature
                    </>
                  )}
                </Button>

                <Button
                  onClick={downloadSignature}
                  variant="outline"
                  className="w-full"
                >
                  <Download size={16} className="mr-2" />
                  Download HTML File
                </Button>

                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition"
                >
                  {showPreview ? (
                    <>
                      <EyeOff size={16} className="inline mr-2" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye size={16} className="inline mr-2" />
                      Show Preview
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-3">📧 How to Use</h4>
              <ol className="space-y-2 text-sm text-blue-800">
                <li><strong>1.</strong> Customize your signature above</li>
                <li><strong>2.</strong> Click "Copy Signature"</li>
                <li><strong>3.</strong> Open your email client settings</li>
                <li><strong>4.</strong> Paste into signature field</li>
                <li><strong>5.</strong> Save and start using!</li>
              </ol>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-zinc-200 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-zinc-900">Preview</h3>
                <span className="text-xs text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                  {style.charAt(0).toUpperCase() + style.slice(1)} Style
                </span>
              </div>

              <div className="bg-zinc-50 rounded-xl p-6 min-h-[400px]">
                <div
                  dangerouslySetInnerHTML={{ __html: generateSignatureHTML() }}
                />
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Tip:</strong> The signature will render with proper formatting when pasted into your email client.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};
