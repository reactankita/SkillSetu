'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  User,
  Settings,
  ShieldCheck,
  CreditCard,
  Repeat,
  LogOut,
  PlusCircle,
  Sparkles,
  Shield,
} from 'lucide-react';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { NotificationBellMenu } from './NotificationBellMenu';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSkillSetuStore } from '@/lib/data/store';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const store = useSkillSetuStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = mounted ? store.getUserRole() : 'student';
  const currentStudent = mounted ? store.getCurrentStudent() : null;
  const currentClient = mounted ? store.getCurrentClient() : null;

  const currentUser = role === 'student' ? currentStudent : currentClient;

  // Student Navigation
  const studentNavItems = [
    { label: 'Browse', href: '/browse' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Community', href: '/community' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Create', href: '/create' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Profile', href: '/profile' },
  ];

  // Client Navigation
  const clientNavItems = [
    { label: 'Browse', href: '/browse' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Community', href: '/community' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Profile', href: '/profile' },
  ];

  const navItems = role === 'student' ? studentNavItems : clientNavItems;

  const handleRoleSwitch = () => {
    const nextRole = role === 'student' ? 'client' : 'student';
    store.setUserRole(nextRole);
    // Smooth transition
    router.refresh();
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <SkillSetuLogo href="/browse" size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/browse' && pathname.startsWith(item.href));
              const isCreate = item.href === '/create';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 shadow-2xs'
                      : isCreate
                      ? 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isCreate && <PlusCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Notification Bell */}
          <NotificationBellMenu />

          {/* Active Role Indicator Badge */}
          <div className="hidden sm:block">
            <Badge
              variant={role === 'student' ? 'orange' : 'teal'}
              className="capitalize text-xs font-semibold px-2.5 py-0.5"
            >
              {role === 'student' ? '🎓 Student' : '💼 Client'}
            </Badge>
          </div>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                  {currentUser?.full_name?.split(' ')[0] || 'User'}
                </span>
                <Avatar
                  src={currentUser?.avatar_url}
                  alt={currentUser?.full_name}
                  fallback={currentUser?.full_name}
                  size="sm"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.full_name}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{currentUser?.skillsetu_id}</p>
              </div>

              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="w-4 h-4 text-slate-500" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push('/verification')}>
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>Verification</span>
              </DropdownMenuItem>

              {role === 'student' && (
                <>
                  <DropdownMenuItem onClick={() => router.push('/portfolio/builder')} className="font-semibold text-slate-800">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span>Portfolio Builder</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/subscription')}>
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span>Subscription</span>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem onClick={() => router.push('/admin')}>
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Admin Console</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Role Switcher Action */}
              <DropdownMenuItem onClick={handleRoleSwitch} className="font-semibold text-orange-600 hover:bg-orange-50">
                <Repeat className="w-4 h-4 text-orange-600" />
                <span>Switch to {role === 'student' ? 'Client' : 'Student'}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} destructive>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Navigation Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation ({role})</span>
            <Badge variant={role === 'student' ? 'orange' : 'teal'} className="text-xs">
              {role === 'student' ? 'Student Mode' : 'Client Mode'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold text-center transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                handleRoleSwitch();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-bold text-sm"
            >
              <Repeat className="w-4 h-4" />
              <span>Switch to {role === 'student' ? 'Client' : 'Student'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
