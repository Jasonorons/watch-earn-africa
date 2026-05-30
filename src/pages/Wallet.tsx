import React, { useState, useEffect } from 'react';
import { Wallet, Landmark, ArrowDownCircle, AlertCircle, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { storage } from '../lib/storage';
import { useAuth } from '../hooks/use-auth';

const CURRENCIES = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1600 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', rate: 15 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 130 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.5 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.78 },
];

export const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('NGN');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bank: '',
    account: '',
    name: ''
  });

  useEffect(() => {
    if (user) fetchBalance();
  }, [user]);

  const fetchBalance = () => {
    if (!user) return;
    const profile = storage.getProfile(user.email);
    if (profile) setBalance(profile.balance);
  };

  const activeCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const convertedAmount = parseFloat(amount || '0') / activeCurrency.rate;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (parseFloat(amount) <= 0) return toast.error('Invalid amount');
    if (convertedAmount > balance) return toast.error('Insufficient balance');
    if (balance < 5) return toast.error('Minimum withdrawal is $5.00');

    setLoading(true);
    try {
      const success = storage.deductBalance(user.email, convertedAmount, bankInfo, currency);
      if (!success) throw new Error('Transaction failed');

      setBalance(prev => prev - convertedAmount);
      setAmount('');
      toast.success('Withdrawal request submitted! Processing via Flutterwave.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">My Wallet</h1>
        <p className="text-slate-400">Withdraw your earnings directly to your bank account.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-[#1E293B] border-slate-700 shadow-xl col-span-1">
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-white">${balance.toFixed(2)}</div>
            
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Equivalent In</div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">NGN</span>
                <span className="text-white font-mono">₦{(balance * 1600).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">GHS</span>
                <span className="text-white font-mono">₵{(balance * 15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">ZAR</span>
                <span className="text-white font-mono">R{(balance * 18.5).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Withdrawals are processed within 24 hours. Minimum $5.00 required.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-700 shadow-xl md:col-span-2">
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription className="text-slate-400">Secure bank transfer via Flutterwave</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Withdrawal Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-slate-900 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                      {CURRENCIES.map(c => (
                        <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount ({activeCurrency.symbol})</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-slate-900 border-slate-700" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  {amount && (
                    <p className="text-xs text-slate-500 font-medium">
                      Debit from wallet: <span className="text-amber-500">${convertedAmount.toFixed(4)}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bank Account Number</Label>
                  <Input 
                    placeholder="0123456789" 
                    className="bg-slate-900 border-slate-700" 
                    value={bankInfo.account}
                    onChange={(e) => setBankInfo(prev => ({ ...prev, account: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select Bank</Label>
                  <Select onValueChange={(v) => setBankInfo(prev => ({ ...prev, bank: v }))}>
                    <SelectTrigger className="bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Choose bank..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                      <SelectItem value="044">Access Bank</SelectItem>
                      <SelectItem value="058">GTBank</SelectItem>
                      <SelectItem value="011">First Bank</SelectItem>
                      <SelectItem value="033">United Bank for Africa (UBA)</SelectItem>
                      <SelectItem value="057">Zenith Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-12" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowDownCircle className="w-5 h-5 mr-2" />}
                  Confirm Withdrawal Request
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Secured by Flutterwave Infrastructure
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};