import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, DollarSign, TrendingUp, ShieldCheck, Info, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';
import { storage } from '../lib/storage';
import { useAuth } from '../hooks/use-auth';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = () => {
    if (!user) return;
    const profile = storage.getProfile(user.email);
    if (profile) {
      setBalance(profile.balance);
      setTotalViews(profile.total_views);
    }
    setLoading(false);
  };

  const startAd = async () => {
    setIsWatching(true);
    setAdProgress(0);
    
    const duration = 15000;
    const interval = 100;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          completeAd();
          return 100;
        }
        return prev + step;
      });
    }, interval);
  };

  const completeAd = () => {
    if (!user) return;
    
    try {
      const reward = 0.02;
      const userShare = reward * 0.5;

      storage.incrementBalance(user.email, userShare);

      setBalance(prev => prev + userShare);
      setTotalViews(prev => prev + 1);
      toast.success(`You earned $${userShare.toFixed(2)}! Keep it up.`);
    } catch (error: any) {
      toast.error('Failed to credit rewards. Please try again.');
    } finally {
      setIsWatching(false);
      setAdProgress(0);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Welcome Back!</h1>
          <p className="text-slate-400">You've watched {totalViews} ads this month. Ready for more?</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-lg border border-amber-500/20">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-semibold">Verified Device Protection Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1E293B] border-slate-700 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-16 h-16 text-amber-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm font-medium">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-1">${balance.toFixed(2)}</div>
            <div className="text-amber-500 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>≈ { (balance * 1600).toLocaleString() } NGN</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm font-medium">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-1">${(totalViews * 0.01).toFixed(2)}</div>
            <div className="text-slate-500 text-sm flex items-center gap-1">
              <Info className="w-4 h-4" />
              <span>Target: $10.00</span>
            </div>
            <Progress value={(totalViews * 0.01 / 10) * 100} className="mt-4 h-2 bg-slate-900" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 border-none shadow-xl text-white">
          <CardHeader>
            <CardTitle className="text-white/80 text-sm font-medium">Referral Bonus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-1">$0.00</div>
            <p className="text-white/60 text-sm mb-4">Earn 5% from every ad your friends watch.</p>
            <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
              Copy Link
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isWatching ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-800/50 p-8 md:p-12 text-center group"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-violet-500/5 pointer-events-none" />
               <div className="mb-8 relative">
                 <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20 group-hover:scale-110 transition-transform">
                   <PlayCircle className="w-12 h-12 text-amber-500" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Rewarded Video Ready</h2>
                 <p className="text-slate-400 max-w-md mx-auto">
                   Watch a short 15-30 second video to earn instantly. 
                   High eCPM guaranteed from TopOn Mediation.
                 </p>
               </div>
               <Button 
                onClick={startAd} 
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-16 px-12 text-xl rounded-2xl shadow-lg shadow-amber-500/20"
               >
                 Watch & Earn $0.01
               </Button>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black aspect-video rounded-3xl overflow-hidden relative shadow-2xl border border-slate-800"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                <div className="text-amber-500 mb-4 animate-pulse">
                  <PlayCircle className="w-20 h-20" />
                </div>
                <div className="text-white font-medium text-lg mb-8">Loading Reward Video...</div>
                <div className="w-2/3 max-w-sm">
                  <Progress value={adProgress} className="h-3 bg-slate-800" indicatorClassName="bg-amber-500" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};