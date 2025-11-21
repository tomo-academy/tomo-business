import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';
import { db } from '../lib/database';
import { Shield, CreditCard, Bell, Globe, CheckCircle2, AlertCircle, RefreshCw, Server, Copy } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user: storeUser, card, updateCard } = useAppStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [domainInput, setDomainInput] = useState(card.customDomain || '');
  const [verifying, setVerifying] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnectDomain = async () => {
    if (!domainInput) return;
    
    setConnecting(true);
    try {
      await db.connectCustomDomain(card.id, domainInput);
      await updateCard({ customDomain: domainInput, customDomainStatus: 'pending' });
      showToast('Domain connected! Verification in progress...', 'success');
      
      // Auto-verify after a short delay
      setTimeout(() => handleVerifyDomain(), 2000);
    } catch (error: any) {
      showToast(error.message || 'Failed to connect domain', 'error');
    } finally {
      setConnecting(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!card.id) return;
    
    setVerifying(true);
    try {
      const result = await db.verifyCustomDomain(card.id);
      if (result.verified) {
        await updateCard({ customDomainStatus: 'active' });
        showToast('Domain verified successfully!', 'success');
      } else {
        await updateCard({ customDomainStatus: 'error' });
        showToast('Domain verification failed. Check DNS settings.', 'error');
      }
    } catch (error) {
      showToast('Verification error', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleRemoveDomain = async () => {
    try {
      await db.removeCustomDomain(card.id);
      setDomainInput('');
      await updateCard({ customDomain: undefined, customDomainStatus: 'none' });
      showToast('Custom domain removed', 'success');
    } catch (error) {
      showToast('Failed to remove domain', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Settings</h1>
            <p className="text-zinc-500 mt-2">Manage your account preferences and subscription.</p>
        </div>

        <div className="space-y-6">
            {/* Custom Domain Section - Premium Feature */}
            <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2 pb-4 border-b border-zinc-100">
                    <Globe size={20} className="text-zinc-500" /> Custom Domain
                </h3>
                
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Your Domain</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={domainInput}
                                    onChange={(e) => setDomainInput(e.target.value.toLowerCase())}
                                    placeholder="e.g., profile.mybrand.com"
                                    className={`flex-1 bg-zinc-50 border rounded-lg px-4 py-2.5 text-zinc-900 outline-none transition-all ${
                                        card.customDomainStatus === 'error' ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' :
                                        card.customDomainStatus === 'active' ? 'border-green-300 focus:border-green-500' :
                                        'border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100'
                                    }`}
                                    disabled={card.customDomainStatus === 'active'}
                                />
                                {card.customDomainStatus === 'active' ? (
                                    <Button variant="outline" onClick={handleRemoveDomain} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">Remove</Button>
                                ) : card.customDomainStatus === 'pending' ? (
                                    <Button 
                                        onClick={handleVerifyDomain} 
                                        disabled={verifying}
                                        className="min-w-[120px]"
                                    >
                                        {verifying ? <RefreshCw size={16} className="animate-spin mr-1" /> : <RefreshCw size={16} className="mr-1" />}
                                        {verifying ? 'Verifying...' : 'Verify Now'}
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleConnectDomain} 
                                        disabled={connecting || !domainInput}
                                        className="min-w-[100px]"
                                    >
                                        {connecting ? <RefreshCw size={16} className="animate-spin" /> : 'Connect'}
                                    </Button>
                                )}
                            </div>
                            
                            {/* Status Messages */}
                            <div className="mt-3">
                                {card.customDomainStatus === 'active' && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                        <CheckCircle2 size={16} />
                                        <span>Domain successfully connected and SSL active.</span>
                                    </div>
                                )}
                                {card.customDomainStatus === 'error' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                                            <AlertCircle size={16} />
                                            <span>DNS verification failed. Please check your configuration.</span>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={handleVerifyDomain}
                                            disabled={verifying}
                                            className="self-start"
                                        >
                                            <RefreshCw size={14} className={`mr-1 ${verifying ? 'animate-spin' : ''}`} />
                                            Retry Verification
                                        </Button>
                                    </div>
                                )}
                                {card.customDomainStatus === 'pending' && (
                                    <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                                        <RefreshCw size={16} className="animate-spin" />
                                        <span>Verifying DNS records...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DNS Configuration Instructions */}
                    {(!card.customDomainStatus || card.customDomainStatus === 'none' || card.customDomainStatus === 'error') && (
                        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5">
                            <div className="flex items-center gap-2 text-zinc-900 font-medium mb-3">
                                <Server size={16} />
                                <span>DNS Configuration</span>
                            </div>
                            <p className="text-sm text-zinc-500 mb-4">
                                To connect your domain, add the following CNAME record to your DNS provider (GoDaddy, Namecheap, Cloudflare, etc.).
                            </p>
                            
                            <div className="overflow-hidden border border-zinc-200 rounded-lg bg-white">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                                        <tr>
                                            <th className="px-4 py-2 font-medium">Type</th>
                                            <th className="px-4 py-2 font-medium">Name</th>
                                            <th className="px-4 py-2 font-medium">Value</th>
                                            <th className="px-4 py-2 font-medium">TTL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-zinc-900">CNAME</td>
                                            <td className="px-4 py-3 font-mono text-zinc-600">@ <span className="text-zinc-400 text-xs">(or subdomain)</span></td>
                                            <td className="px-4 py-3 font-mono text-zinc-900 flex items-center gap-2 group cursor-pointer" onClick={() => navigator.clipboard.writeText('cname.tomo.business')}>
                                                cname.tomo.business
                                                <Copy size={12} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </td>
                                            <td className="px-4 py-3 text-zinc-500">Auto</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Account Section */}
            <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2 pb-4 border-b border-zinc-100">
                    <Shield size={20} className="text-zinc-500" /> Account Security
                </h3>
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email Address</label>
                            <div className="px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-600 text-sm">
                                {user?.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Current Plan</label>
                             <div className="px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 text-sm font-bold uppercase tracking-wide">
                                {user?.plan} Tier
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline" size="sm">Reset Password</Button>
                    </div>
                </div>
            </section>

            {/* Subscription */}
            <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2 pb-4 border-b border-zinc-100">
                    <CreditCard size={20} className="text-zinc-500" /> Billing & Plans
                </h3>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-900 p-5 rounded-lg shadow-md">
                    <div>
                        <p className="text-white font-semibold">Pro Plan</p>
                        <p className="text-xs text-zinc-400 mt-1">Next billing date: Oct 24, 2024</p>
                    </div>
                    <div className="flex gap-3">
                         <Button variant="secondary" size="sm" className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:text-white">View History</Button>
                         <Button variant="secondary" size="sm">Manage Subscription</Button>
                    </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2 pb-4 border-b border-zinc-100">
                    <Bell size={20} className="text-zinc-500" /> Notifications
                </h3>
                <div className="space-y-4">
                    {['Email me when someone views my card', 'Weekly analytics report', 'Product updates and news'].map((item, i) => (
                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500" />
                            <span className="text-zinc-600 text-sm group-hover:text-zinc-900 transition-colors">{item}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Danger Zone */}
            <section className="border border-red-200 bg-red-50/50 rounded-xl p-6">
                 <div className="flex justify-between items-center">
                     <div>
                         <h3 className="text-base font-bold text-red-600">Logout</h3>
                         <p className="text-sm text-red-400/80 mt-1">Sign out of your account.</p>
                     </div>
                     <Button 
                       variant="danger" 
                       size="sm" 
                       onClick={async () => {
                         try {
                           await signOut();
                           navigate('/');
                         } catch (error) {
                           showToast('Failed to logout', 'error');
                         }
                       }}
                     >
                       Logout
                     </Button>
                 </div>
            </section>
        </div>
      </div>
    </Layout>
  );
};