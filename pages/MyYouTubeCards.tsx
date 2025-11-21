import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { Button } from '../components/ui/Button';
import { Youtube, Plus, X, Play, Trash2, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

export const MyYouTubeCards: React.FC = () => {
  const { youtubeCards, youtubeCardId, switchYouTubeCard, deleteYouTubeCard } = useAppStore();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (cardId: string) => {
    try {
      await deleteYouTubeCard(cardId);
      showToast('YouTube card deleted successfully', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      showToast('Failed to delete card', 'error');
    }
  };

  const handleSwitch = (cardId: string) => {
    switchYouTubeCard(cardId);
    showToast('Switched to YouTube card', 'success');
    navigate('/youtube-editor');
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">My YouTube Cards</h1>
            <p className="text-zinc-500 mt-2">Manage all your YouTube creator cards</p>
          </div>
          <Button
            onClick={() => navigate('/youtube-editor')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            Create New
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <Youtube className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Cards</p>
                <p className="text-2xl font-bold text-zinc-900">{youtubeCards.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Check className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Active Card</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {youtubeCards.find(c => c.id === youtubeCardId)?.channelName || 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Play className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Subscribers</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {youtubeCards.reduce((acc, card) => {
                    const subs = card.subscribers.replace(/[^\d.]/g, '');
                    const multiplier = card.subscribers.includes('M') ? 1000000 : card.subscribers.includes('K') ? 1000 : 1;
                    return acc + (parseFloat(subs) * multiplier);
                  }, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {youtubeCards.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Youtube size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No YouTube Cards Yet</h3>
            <p className="text-zinc-500 mb-6">Create your first YouTube creator card to get started</p>
            <Button
              onClick={() => navigate('/youtube-editor')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              Create YouTube Card
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youtubeCards.map((card) => {
              const isActive = card.id === youtubeCardId;
              const isRedTheme = card.settings.theme === 'red';
              
              return (
                <div
                  key={card.id}
                  className={`relative group bg-white border-2 rounded-xl overflow-hidden shadow-soft transition-all hover:shadow-xl ${
                    isActive ? 'border-red-500 ring-2 ring-red-200' : 'border-zinc-200'
                  }`}
                >
                  {/* Active Badge */}
                  {isActive && (
                    <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Check size={12} />
                      Active
                    </div>
                  )}

                  {/* Card Preview */}
                  <div className={`${isRedTheme ? 'bg-red-950' : 'bg-zinc-950'}`}>
                    {/* Banner */}
                    <div className="h-24 relative">
                      {card.bannerUrl ? (
                        <img src={card.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className={`w-full h-full ${isRedTheme ? 'bg-gradient-to-br from-red-800 to-black' : 'bg-gradient-to-br from-zinc-800 to-black'}`} />
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-b ${isRedTheme ? 'from-black/20 to-red-950' : 'from-black/20 to-zinc-950'}`} />
                    </div>

                    {/* Profile */}
                    <div className="p-4 -mt-8 relative">
                      <div className={`w-16 h-16 rounded-full border-4 ${isRedTheme ? 'border-red-950' : 'border-zinc-950'} overflow-hidden mb-3`}>
                        <img src={card.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-1 text-white">
                        <h3 className="text-lg font-bold truncate">{card.channelName}</h3>
                        <p className={`text-xs ${isRedTheme ? 'text-red-300' : 'text-zinc-400'}`}>{card.handle}</p>
                        
                        {/* Stats */}
                        <div className="flex gap-3 pt-2 text-xs">
                          {card.settings.showSubscribers && (
                            <div>
                              <p className="text-white/40 uppercase">Subs</p>
                              <p className="font-bold">{card.subscribers}</p>
                            </div>
                          )}
                          {card.settings.showVideos && (
                            <div>
                              <p className="text-white/40 uppercase">Videos</p>
                              <p className="font-bold">{card.videosCount}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="px-4 pb-4">
                      <div className="bg-white p-2 rounded-lg inline-block">
                        <QRCodeSVG value={`${window.location.origin}/#/youtube-profile?id=${card.id}`} size={50} />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-zinc-50 border-t border-zinc-200">
                    <div className="flex gap-2">
                      {!isActive && (
                        <Button
                          onClick={() => handleSwitch(card.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          <Check size={12} className="mr-1" />
                          Set Active
                        </Button>
                      )}
                      <Button
                        onClick={() => navigate('/youtube-editor')}
                        variant="outline"
                        size="sm"
                        className={`${isActive ? 'flex-1' : ''} text-xs`}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => setDeleteConfirm(card.id)}
                        variant="outline"
                        size="sm"
                        className="text-xs text-red-500 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Delete YouTube Card?</h3>
              <p className="text-sm text-zinc-500 mb-6">
                This will permanently delete this YouTube card. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
