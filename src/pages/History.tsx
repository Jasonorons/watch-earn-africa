import React, { useEffect, useState } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { storage, Transaction } from '../lib/storage';
import { useAuth } from '../hooks/use-auth';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = () => {
    if (!user) return;
    const data = storage.getTransactions(user.email);
    setTransactions([...data].reverse());
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Activity History</h1>
        <p className="text-slate-400">Track your ad earnings and withdrawal requests.</p>
      </div>

      <Card className="bg-[#1E293B] border-slate-700 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Date</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Amount</TableHead>
                <TableHead className="text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                    {loading ? 'Loading transactions...' : 'No transactions found. Start watching ads to earn!'}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="font-medium text-slate-300">
                      {new Date(tx.created_at).toLocaleDateString()}
                      <div className="text-[10px] text-slate-500">{new Date(tx.created_at).toLocaleTimeString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.type === 'reward' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="capitalize text-slate-200">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className={tx.type === 'reward' ? 'text-green-400' : 'text-slate-200'}>
                      {tx.type === 'reward' ? '+' : '-'}${tx.amount.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${tx.status === 'completed' ? 'border-green-500/30 text-green-500 bg-green-500/10' : ''}
                          ${tx.status === 'pending' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : ''}
                          ${tx.status === 'failed' ? 'border-red-500/30 text-red-500 bg-red-500/10' : ''}
                        `}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};