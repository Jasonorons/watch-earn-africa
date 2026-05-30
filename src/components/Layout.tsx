import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, History, LogOut, PlayCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Watch Ads', href: '/dashboard', icon: PlayCircle },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'History', href: '/history', icon: History },
  ];

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#1E293B] border-r border-slate-700">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-amber-500">
            <PlayCircle className="w-8 h-8" />
            <span>WatchEarn</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'bg-amber-500/10 text-amber-500 border-r-4 border-amber-500'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#1E293B] border-b border-slate-700">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-amber-500">
          <PlayCircle className="w-6 h-6" />
          <span>WatchEarn</span>
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-slate-300" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#1E293B] border-slate-700 p-0 text-slate-100">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <span className="font-bold text-xl text-amber-500">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-lg font-medium">{item.name}</span>
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 py-6 mt-4"
                onClick={signOut}
              >
                <LogOut className="w-6 h-6" />
                <span className="text-lg">Sign Out</span>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};