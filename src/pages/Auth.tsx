import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { PlayCircle, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { getDeviceId } from '../lib/fingerprint';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get Device Fingerprint
      const deviceId = await getDeviceId();
      const users = storage.getUsers();
      
      if (isLogin) {
        // Find local user
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid email or password');
        
        signIn(email);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        // Check if user already exists
        const existing = users.find((u: any) => u.email === email);
        if (existing) throw new Error('User already exists');
        
        // Multi-account detection (Fraud Layer)
        const deviceUsed = users.find((u: any) => u.device_id === deviceId);
        if (deviceUsed) {
          toast.warning('Warning: Multiple accounts detected on this device.');
        }

        // Save local user data
        storage.saveUser({ email, password, device_id: deviceId });
        
        // Initialize user profile
        storage.saveProfile({
          email,
          balance: 0,
          total_views: 0,
          device_id: deviceId
        });

        signIn(email);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2 font-bold text-2xl text-amber-500 cursor-pointer" onClick={() => navigate('/')}>
        <PlayCircle className="w-8 h-8" />
        <span>WatchEarn</span>
      </div>

      <Card className="w-full max-w-md bg-[#1E293B] border-slate-700 text-slate-100 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">{isLogin ? 'Login' : 'Create Account'}</CardTitle>
          <CardDescription className="text-slate-400">
            {isLogin ? 'Enter your credentials to start earning' : 'Sign up today and get 50% ad revenue share'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="bg-slate-900 border-slate-700 pl-10 focus:ring-amber-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-900 border-slate-700 pl-10 focus:ring-amber-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-12" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-slate-800 pt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};