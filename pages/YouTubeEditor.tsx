import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { motion } from 'framer-motion';
import { Youtube, Wand2, Play, Settings, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const YouTubeEditor: React.FC = () => {
  const { youtubeCard, generateYouTubeCard, removeYouTubeCard, updateYouTubeCard } = useAppStore();
  const { showToast } = useToast();
  const [ytInput, setYtInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileView, setMobileView] = useState<'preview' | 'settings'>('preview');
  const [showSettings, setShowSettings] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local state for unsaved changes
  const [localSettings, setLocalSettings] = useState(
    youtubeCard?.settings || { theme: 'dark', showSubscribers: true, showVideos: true }
  );

  useEffect(() => {
    if (youtubeCard) {
      setLocalSettings(youtubeCard.settings);
    }
  }, [youtubeCard]);

  useEffect(() => {
    if (youtubeCard) {
      const changed = JSON.stringify(localSettings) !== JSON.stringify(youtubeCard.settings);
      setHasChanges(changed);
    }
  }, [localSettings, youtubeCard]);

  const handleGenerate = async () => {
    if (!ytInput) return;
    setIsGenerating(true);
    try {
      await generateYouTubeCard(ytInput);
      setYtInput('');
      showToast('YouTube card generated successfully!', 'success');
    } catch (error) {
      console.error('Failed to generate card', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate YouTube card';
      showToast(errorMessage, 'error');
      
      // Show helpful message for API key issues
      if (errorMessage.includes('API key')) {
        showToast('Please configure YouTube API key in environment variables', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!youtubeCard) return;
    setSaving(true);
    try {
      updateYouTubeCard({ settings: localSettings });
      setHasChanges(false);
      showToast('YouTube card settings saved!', 'success');
    } catch (error) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (youtubeCard) {
      setYtInput(youtubeCard.channelUrl);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this YouTube card?')) {
      removeYouTubeCard();
      showToast('YouTube card deleted', 'success');
    }
  };

  const theme = localSettings.theme || 'dark';
  const isRedTheme = theme === 'red';

  return (
    <Layout>
      {/* Mobile Sticky Save Button */}
      {youtubeCard && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`w-full shadow-2xl ${hasChanges ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
          </Button>
        </div>
      )}

      <div className="space-y-8 animate-in fade-in duration-500 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">YouTube Creator Card</h1>
            <p className="text-zinc-500 mt-2 text-sm md:text-base">Generate and customize your YouTube business card</p>
          </div>
          {youtubeCard && (
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`hidden md:flex ${hasChanges ? 'bg-zinc-900' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
            </Button>
          )}
        </div>

        {/* Mobile View Switcher - Only show when card exists */}
        {youtubeCard && (
          <div className="lg:hidden flex gap-2 p-1 bg-zinc-100 rounded-lg">
            <button
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all ${
                mobileView === 'preview'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setMobileView('settings')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all ${
                mobileView === 'settings'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Settings
            </button>
          </div>
        )}

        {/* Generator Section */}
        {!youtubeCard ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-soft">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Youtube size={32} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-2">Generate YouTube Creator Card</h2>
                <p className="text-zinc-500 text-sm">
                  Enter your YouTube channel URL and we'll automatically fetch your channel details,
                  logo, banner, and create a professional creator card.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  ref={inputRef}
                  type="url"
                  value={ytInput}
                  onChange={(e) => setYtInput(e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-900 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 outline-none"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={!ytInput || isGenerating}
                  className="bg-red-600 hover:bg-red-700 text-white px-6"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} className="mr-2" />
                      Generate Card
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-zinc-400 mt-4">
                AI will fetch channel name, subscribers, videos, description, logo, and banner automatically
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Panel */}
            <div className={`space-y-4 ${mobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
              <h3 className="text-lg font-semibold text-zinc-900">Preview</h3>
              <div className={`rounded-2xl overflow-hidden shadow-2xl ${isRedTheme ? 'bg-red-950' : 'bg-zinc-950'}`}>
                {/* Banner */}
                <div className="h-32 relative">
                  {youtubeCard.bannerUrl ? (
                    <img src={youtubeCard.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className={`w-full h-full ${isRedTheme ? 'bg-gradient-to-br from-red-800 to-black' : 'bg-gradient-to-br from-zinc-800 to-black'}`} />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-b ${isRedTheme ? 'from-black/20 to-red-950' : 'from-black/20 to-zinc-950'}`} />
                </div>

                {/* Profile */}
                <div className="p-6 -mt-12 relative">
                  <div className={`w-24 h-24 rounded-full border-4 ${isRedTheme ? 'border-red-950' : 'border-zinc-950'} overflow-hidden mb-4`}>
                    <img src={youtubeCard.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2 text-white">
                    <h2 className="text-2xl font-bold">{youtubeCard.channelName}</h2>
                    <p className={`text-sm ${isRedTheme ? 'text-red-300' : 'text-zinc-400'}`}>{youtubeCard.handle}</p>
                    <p className="text-sm text-white/80 leading-relaxed">{youtubeCard.description}</p>

                    {/* Stats */}
                    <div className="flex gap-4 pt-4">
                      {localSettings.showSubscribers && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Subscribers</p>
                          <p className="text-lg font-bold">{youtubeCard.subscribers}</p>
                        </div>
                      )}
                      {localSettings.showVideos && (
                        <div>
                          <p className="text-xs text-white/40 uppercase">Videos</p>
                          <p className="text-lg font-bold">{youtubeCard.videosCount}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Codes */}
                <div className="px-6 pb-6 flex gap-3">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCodeSVG 
                      value={youtubeCard.channelUrl} 
                      size={60}
                      level="H"
                      imageSettings={{
                        src: "/logo.png",
                        height: 15,
                        width: 15,
                        excavate: true,
                      }}
                    />
                    <p className="text-[8px] text-zinc-900 font-bold text-center mt-1">CHANNEL</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg border-2 border-red-200">
                    <QRCodeSVG 
                      value={`${window.location.origin}/#/youtube-profile?id=${youtubeCardId}`} 
                      size={60}
                      level="H"
                      imageSettings={{
                        src: "/logo.png",
                        height: 15,
                        width: 15,
                        excavate: true,
                      }}
                    />
                    <p className="text-[8px] text-red-600 font-bold text-center mt-1">PROFILE</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleEdit}>
                  <Wand2 size={14} className="mr-2" /> Regenerate
                </Button>
                <Button variant="outline" onClick={() => window.open(youtubeCard.channelUrl, '_blank')}>
                  <Play size={14} className="mr-2" /> View Channel
                </Button>
                <Button variant="outline" onClick={() => window.open(`/#/youtube-profile?id=${youtubeCardId}`, '_blank')}>
                  <Youtube size={14} className="mr-2" /> View Profile
                </Button>
                <Button variant="outline" onClick={handleDelete} className="text-red-500 hover:bg-red-50 border-red-200">
                  <X size={14} className="mr-2" /> Delete
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            <div className={`space-y-4 ${mobileView === 'settings' ? 'block' : 'hidden lg:block'}`}>
              <h3 className="text-lg font-semibold text-zinc-900">Card Settings</h3>

              {/* Theme Selection */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-soft space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block">Card Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                      className={`h-20 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-medium ring-offset-2 transition-all ${
                        localSettings.theme === 'dark' ? 'ring-2 ring-zinc-900' : ''
                      }`}
                    >
                      Midnight Black
                    </button>
                    <button
                      onClick={() => setLocalSettings({ ...localSettings, theme: 'red' })}
                      className={`h-20 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-medium ring-offset-2 transition-all ${
                        localSettings.theme === 'red' ? 'ring-2 ring-red-600' : ''
                      }`}
                    >
                      YouTube Red
                    </button>
                  </div>
                </div>

                {/* Display Options */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block">Display Options</label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors">
                      <span className="text-sm font-medium text-zinc-700">Show Subscriber Count</span>
                      <input
                        type="checkbox"
                        checked={localSettings.showSubscribers}
                        onChange={(e) => setLocalSettings({ ...localSettings, showSubscribers: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors">
                      <span className="text-sm font-medium text-zinc-700">Show Video Count</span>
                      <input
                        type="checkbox"
                        checked={localSettings.showVideos}
                        onChange={(e) => setLocalSettings({ ...localSettings, showVideos: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                    </label>
                  </div>
                </div>

                {/* Channel Info */}
                <div className="pt-4 border-t border-zinc-100">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Channel Details</label>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Total Views:</span>
                      <span className="font-medium text-zinc-900">{youtubeCard.totalViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Location:</span>
                      <span className="font-medium text-zinc-900">{youtubeCard.location || 'Not set'}</span>
                    </div>
                  </div>
                </div>

                {/* Save Indicator */}
                {hasChanges && (
                  <div className="pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-2 text-amber-600 text-xs">
                      <AlertCircle size={14} />
                      <span>You have unsaved changes</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
