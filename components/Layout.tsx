import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Edit3, User as UserIcon, LogOut, Settings, CreditCard, ExternalLink, Menu, X } from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './ui/Logo';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Edit3, label: 'Card Editor', path: '/editor' },
    { icon: CreditCard, label: 'NFC Activation', path: '/nfc' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F6] font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 border-r border-zinc-200 bg-white hidden md:flex flex-col sticky top-0 h-screen shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-zinc-100">
          <Logo className="w-full" />
          <p className="text-[10px] text-zinc-400 mt-2 ml-1 uppercase tracking-[0.2em] font-medium">Digital Identity</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-zinc-100 text-zinc-900" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <Icon size={18} className={cn(isActive ? "text-zinc-900" : "text-zinc-400")} />
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-zinc-100">
             <Link
                to="/preview"
                target="_blank"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium"
              >
                <ExternalLink size={18} className="text-zinc-400" />
                View Public Card
              </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-zinc-400 hover:text-red-600 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-4 z-40">
         <Logo iconOnly />
         <span className="text-zinc-900 font-serif font-bold text-lg ml-2">TOMO BUSINESS</span>
         <div className="flex-1"></div>
         <button 
            className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-md active:bg-zinc-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
         >
            <Menu size={24} />
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/20 z-50 md:hidden backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden flex flex-col shadow-2xl border-r border-zinc-200"
            >
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                    <div>
                        <Logo className="w-32" />
                        <p className="text-[10px] text-zinc-400 mt-2 uppercase tracking-[0.2em] font-medium">Digital Identity</p>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-md"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 font-medium",
                            isActive 
                                ? "bg-zinc-100 text-zinc-900" 
                                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                            )}
                        >
                            <Icon size={18} className={cn(isActive ? "text-zinc-900" : "text-zinc-400")} />
                            {item.label}
                        </Link>
                        );
                    })}
                    
                    <div className="pt-4 mt-4 border-t border-zinc-100">
                        <Link
                            to="/preview"
                            target="_blank"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium"
                        >
                            <ExternalLink size={18} className="text-zinc-400" />
                            View Public Card
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {user?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{user?.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="text-zinc-400 hover:text-red-600 transition-colors p-2">
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:p-8 p-4 pt-20 md:pt-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};