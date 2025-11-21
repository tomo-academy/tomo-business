import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/ui/Button';
import { Plus, Wifi, Eye, Edit, Trash2, X, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export const MyCards: React.FC = () => {
  const { cards, card, switchCard, createNewCard, deleteCard } = useAppStore();
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newCardName, setNewCardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleCreateCard = async () => {
    if (!newCardName.trim()) return;
    
    setIsCreating(true);
    try {
      await createNewCard(newCardName);
      setNewCardName('');
      setShowNewCardModal(false);
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (cards.length <= 1) return; // Don't delete last card
    
    setIsDeleting(true);
    try {
      await deleteCard(cardId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting card:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">My Cards</h1>
            <p className="text-zinc-500 mt-1">Manage all your digital business cards</p>
          </div>
          <Button onClick={() => setShowNewCardModal(true)} className="bg-zinc-900 hover:bg-zinc-800">
            <Plus size={18} className="mr-2" /> Create New Card
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                <QrCode className="text-zinc-700" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">{cards.length}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Total Cards</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Wifi className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">{cards.filter(c => c.nfcActive).length}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">NFC Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">{cards.length > 0 ? '1' : '0'}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Active Card</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Stylish Debit Card Preview */}
              <div className="relative aspect-[1.6/1] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 overflow-hidden">
                {/* Glass morphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30"></div>
                
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                    <div className="absolute inset-0 border border-white/30 rounded-full"></div>
                    <div className="absolute inset-4 border border-white/20 rounded-full"></div>
                    <div className="absolute inset-8 border border-white/10 rounded-full"></div>
                  </div>
                </div>
                
                {/* Card Chip */}
                <div className="absolute top-6 left-6 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-lg z-10">
                  <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm"></div>
                  <div className="absolute inset-0 grid grid-cols-3 gap-0.5 p-1.5">
                    <div className="bg-yellow-600/30 rounded-sm"></div>
                    <div className="bg-yellow-600/30 rounded-sm"></div>
                    <div className="bg-yellow-600/30 rounded-sm"></div>
                    <div className="bg-yellow-600/30 rounded-sm"></div>
                    <div className="bg-yellow-600/30 rounded-sm"></div>
                    <div className="bg-yellow-600/30 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Active Badge */}
                {c.id === card.id && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg z-10">
                    Active
                  </div>
                )}
                
                {/* NFC Icon */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 text-white/50 z-10">
                  <Wifi size={12} className="rotate-90" />
                  <span className="text-[8px] font-bold tracking-wider">NFC ENABLED</span>
                </div>
                
                {/* QR Code Center */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="bg-white p-3 rounded-xl shadow-2xl">
                    <QRCodeSVG 
                      value={`${window.location.origin}/#/c/${c.id}`} 
                      size={80}
                      level="H"
                      imageSettings={{
                        src: "/logo.png",
                        height: 20,
                        width: 20,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>
                
                {/* Card Info Bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white z-10">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                    <img src={c.avatarUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-tight truncate">{c.displayName}</p>
                    <p className="text-[9px] text-white/60 truncate">{c.title || 'No title'}</p>
                  </div>
                </div>
                
                {/* ID Badge */}
                <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-[8px] text-white/70 font-mono border border-white/10">
                  ID: {c.id.slice(0, 6)}
                </div>
              </div>
              
              {/* Card Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg truncate">{c.displayName}</h3>
                  <p className="text-sm text-zinc-500 truncate">{c.company || 'No company'}</p>
                  <p className="text-xs text-zinc-400 mt-1 truncate">{c.email}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {c.id === card.id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => navigate('/editor')}
                    >
                      <Edit size={12} className="mr-1" /> Edit
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => switchCard(c.id)}
                    >
                      <Eye size={12} className="mr-1" /> Switch
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(`/#/c/${c.id}`, '_blank')}
                  >
                    <Eye size={12} className="mr-1" /> View
                  </Button>
                  
                  {cards.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                      onClick={() => setShowDeleteConfirm(c.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {cards.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-zinc-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No cards yet</h3>
            <p className="text-zinc-500 mb-6">Create your first digital business card to get started</p>
            <Button onClick={() => setShowNewCardModal(true)} className="bg-zinc-900 hover:bg-zinc-800">
              <Plus size={18} className="mr-2" /> Create Your First Card
            </Button>
          </div>
        )}

        {/* New Card Modal */}
        <AnimatePresence>
          {showNewCardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowNewCardModal(false)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-zinc-900">Create New Card</h3>
                  <button onClick={() => setShowNewCardModal(false)} className="text-zinc-400 hover:text-zinc-900">
                    <X size={20}/>
                  </button>
                </div>
                
                <p className="text-sm text-zinc-500 mb-4">
                  Create additional business cards for friends, family members, or different personas.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Card Name</label>
                    <input 
                      type="text"
                      placeholder="e.g., John's Card, Family Card, Work Profile"
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateCard()}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowNewCardModal(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-zinc-900" 
                      onClick={handleCreateCard}
                      disabled={!newCardName.trim() || isCreating}
                    >
                      {isCreating ? (
                        <><LoadingSpinner className="w-4 h-4 mr-2" /> Creating...</>
                      ) : (
                        <><QrCode size={16} className="mr-2" /> Create Card</>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowDeleteConfirm(null)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-zinc-900">Delete Card?</h3>
                  <button onClick={() => setShowDeleteConfirm(null)} className="text-zinc-400 hover:text-zinc-900">
                    <X size={20}/>
                  </button>
                </div>
                
                <p className="text-sm text-zinc-500 mb-6">
                  Are you sure you want to delete this card? This action cannot be undone. All associated data will be permanently removed.
                </p>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(null)}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
                    onClick={() => handleDeleteCard(showDeleteConfirm)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <><LoadingSpinner className="w-4 h-4 mr-2" /> Deleting...</>
                    ) : (
                      <><Trash2 size={16} className="mr-2" /> Delete Card</>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
};
