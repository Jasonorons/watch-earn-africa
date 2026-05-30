import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ShieldCheck, Zap, DollarSign, ArrowRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl text-amber-500">
          <PlayCircle className="w-8 h-8" />
          <span>WatchEarn</span>
        </div>
        <div className="hidden md:flex gap-8 text-slate-400 font-medium">
          <a href="#how-it-works" className="hover:text-amber-500 transition-colors">How it Works</a>
          <a href="#features" className="hover:text-amber-500 transition-colors">Features</a>
          <a href="#payouts" className="hover:text-amber-500 transition-colors">Payouts</a>
        </div>
        <Link to="/auth">
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8">
            Get Started
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-sm font-semibold mb-6 border border-amber-500/20">
            Trusted by 50,000+ Viewers Across Africa
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">
            Turn Your Screen Time Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-violet-500">
              Real Cash Rewards
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Watch high-quality rewarded video ads and get paid directly to your bank account. 
            No points, no gimmicks—just real money in your local currency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-14 px-10 text-lg group">
                Start Earning Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-slate-400 ml-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#0F172A] bg-slate-800 flex items-center justify-center text-xs font-bold`}>
                    U{i}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">Join 5k+ others today</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Image / Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
        >
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/d706fbcf-5258-4554-81f9-a76623b783d3/hero-image-0560563e-1780160593713.webp" 
            alt="Hero" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1E293B] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-500 mb-2">$0.01 - $0.05</div>
            <div className="text-slate-400 text-sm">Per Video View</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-500 mb-2">Instant</div>
            <div className="text-slate-400 text-sm">Payout Processing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-500 mb-2">10+</div>
            <div className="text-slate-400 text-sm">Supported Currencies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-500 mb-2">0%</div>
            <div className="text-slate-400 text-sm">Hidden Fees</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Why Users Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#1E293B] border border-slate-700 hover:border-amber-500/50 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Secure & Fair</h3>
            <p className="text-slate-400">Our S2S verification system ensures every view is recorded and paid fairly. 50% revenue share to you.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#1E293B] border border-slate-700 hover:border-amber-500/50 transition-colors">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Local Payouts</h3>
            <p className="text-slate-400">Withdraw directly to NGN, GHS, KES, and more via Flutterwave. No expensive wire transfers.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#1E293B] border border-slate-700 hover:border-amber-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Instant Access</h3>
            <p className="text-slate-400">Start watching and earning immediately after sign up. No minimum waiting periods to start.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-xl text-amber-500">
          <PlayCircle className="w-6 h-6" />
          <span>WatchEarn</span>
        </div>
        <div className="text-slate-500 text-sm">
          © 2025 WatchEarn Platform. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};