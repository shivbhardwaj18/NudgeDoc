'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Heart, 
  LayoutDashboard, 
  UploadCloud, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze Report', href: '/dashboard/upload', icon: UploadCloud },
    { name: 'Developer Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl text-white">
            <Heart className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">
            NudgeDoc
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-600 focus:outline-none hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen shrink-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Nudge<span className="text-primary">Doc</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                Patient Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group
                    ${isActive 
                      ? 'bg-blue-50 text-primary' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Sign Out */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-inner shadow-black/10">
              RS
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-800 truncate">Rohan Sharma</h4>
              <p className="text-[10px] text-slate-400 truncate">demo@nudgedoc.com</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile navigation menu */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen relative p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
