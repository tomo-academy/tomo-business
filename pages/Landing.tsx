import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Button } from '../components/ui/Button';
import { ArrowRight, Zap, Globe, ShieldCheck, Smartphone, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui/Logo';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'user@example.com');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans">
      {/* Navbar */}
      <nav className="w-full py-5 px-6 md:px-12 flex justify-between items-center border-b border-zinc-100 bg-white/80 backdrop-blur-md fixed top-0 z-50">
        <Logo />
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-500">
          <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
        </div>
        <div className="flex gap-3">
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => document.getElementById('login-section')?.scrollIntoView({behavior: 'smooth'})}
             >
               Log in
             </Button>
             <Button 
                variant="primary" 
                size="sm"
                onClick={() => document.getElementById('login-section')?.scrollIntoView({behavior: 'smooth'})}
             >
               Get Started
             </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50 via-white to-white -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium tracking-wide uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse"></span>
            The Future of Networking
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-sans text-zinc-900 leading-[1.1]">
            The last business card <br/>
            <span className="text-zinc-500">you will ever need.</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Create a premium digital profile, share instantly via NFC, and track your connections with real-time analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Button size="lg" className="h-14 px-8 text-base rounded-full" onClick={() => document.getElementById('login-section')?.scrollIntoView({behavior: 'smooth'})}>
               Create Your Card <ArrowRight className="ml-2 w-4 h-4" />
             </Button>
             <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full bg-white">
                View Example
             </Button>
          </div>
        </motion.div>
        
        {/* Mockup Area */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20"
        >
             <div className="relative mx-auto w-full max-w-4xl aspect-[16/9] bg-zinc-50 rounded-2xl border border-zinc-200 shadow-2xl flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
                 
                 <div className="flex gap-8 items-center z-10 transform translate-y-8">
                    {/* Card 1 */}
                    <div className="w-64 h-96 bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-zinc-100 p-6 flex flex-col items-center -rotate-6 transform transition-transform hover:rotate-0 duration-500">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full mb-4"></div>
                        <div className="w-32 h-4 bg-zinc-100 rounded mb-2"></div>
                        <div className="w-24 h-3 bg-zinc-50 rounded mb-8"></div>
                        <div className="w-full h-12 bg-zinc-900 rounded-xl mb-3"></div>
                        <div className="w-full h-12 bg-zinc-100 rounded-xl"></div>
                    </div>
                    
                    {/* Card 2 - Phone */}
                    <div className="w-72 h-[500px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl p-2 relative rotate-3">
                         <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                             <div className="w-full h-32 bg-zinc-100"></div>
                             <div className="w-24 h-24 rounded-2xl bg-white absolute top-20 left-1/2 -translate-x-1/2 shadow-lg border-4 border-white">
                                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover rounded-lg" />
                             </div>
                         </div>
                    </div>
                 </div>
             </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">From NFC technology to advanced analytics, we provide the toolkit for modern networking.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-zinc-900" />}
              title="NFC Instant Share"
              desc="Tap your card on any smartphone to instantly share your profile. No app required for the receiver."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-zinc-900" />}
              title="Custom Domain"
              desc="Personalize your link (tomo.business/yourname). It's professional, memorable, and SEO friendly."
            />
            <FeatureCard 
              icon={<Smartphone className="w-6 h-6 text-zinc-900" />}
              title="Mobile Optimized"
              desc="Your digital card looks perfect on every device, loading instantly with a premium feel."
            />
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login-section" className="py-24 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
             <p className="text-zinc-500 mt-2">Enter your email to access your dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all"
                  placeholder="you@company.com"
                />
              </div>
              <Button className="w-full justify-center h-11 text-sm" variant="primary">Continue with Email</Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-400 font-medium">Or</span></div>
              </div>
              
              <Button type="button" variant="secondary" className="w-full justify-center h-11" onClick={(e) => handleLogin(e)}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                Continue with Google
              </Button>
            </div>
          </form>
        </div>
      </section>
      
      <footer className="border-t border-zinc-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo />
            <div className="text-sm text-zinc-500">
                © 2024 TOMO BUSINESS. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-3 text-zinc-900">{title}</h3>
    <p className="text-zinc-500 leading-relaxed text-sm">{desc}</p>
  </div>
);