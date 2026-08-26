'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  User,
  ShieldCheck,
  CreditCard,
  Repeat,
  LogOut,
  PlusCircle,
  Shield,
  Briefcase,
  Layers,
} from 'lucide-react';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { NotificationBellMenu } from './NotificationBellMenu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
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
import { supabase } from '@/lib/supabase/client';

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

  // Student Navigation (as specified in rule 6 & 8)
  const studentNavItems = [
    { label: 'Browse', href: '/browse' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Community', href: '/community' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Create', href: '/create' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Profile', href: '/profile' },
  ];

  // Client Navigation (as specified in rule 6 & 8)
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
    router.refresh();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    store.logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Desktop Nav */}
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
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                      : isCreate
                      ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-700'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Mode Switcher */}
          <ThemeToggle />

          {/* Notification Bell */}
          <NotificationBellMenu />

          {/* Role Indicator & Mode Switcher Button */}
          <button
            type="button"
            onClick={handleRoleSwitch}
            title={`Click to switch to ${role === 'student' ? 'Client' : 'Student'} Mode`}
            className="hidden sm:inline-flex items-center gap-1.5 cursor-pointer group"
          >
            <Badge
              variant={role === 'student' ? 'orange' : 'teal'}
              className="capitalize text-xs font-semibold px-2.5 py-1 border transition-transform group-hover:scale-105"
            >
              <span>{role === 'student' ? '🎓 Student Mode' : '💼 Client Mode'}</span>
              <Repeat className="w-3 h-3 ml-1 opacity-70 group-hover:opacity-100 group-hover:rotate-180 transition-all" />
            </Badge>
          </button>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
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
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser?.full_name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{currentUser?.skillsetu_id}</p>
                <span className="inline-block mt-1 text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">
                  {role === 'student' ? 'Student Account' : 'Client Account'}
                </span>
              </div>

              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="w-4 h-4 text-slate-500" />
                <span>My Profile</span>
              </DropdownMenuItem>

              {role === 'student' && (
                <>
                  <DropdownMenuItem onClick={() => router.push('/portfolio')}>
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <span>Portfolio Builder</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/my-services')}>
                    <Layers className="w-4 h-4 text-slate-500" />
                    <span>My Services</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/subscription')}>
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span>Subscription Plan</span>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem onClick={() => router.push('/verification')}>
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>Verification Center</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push('/admin')}>
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Admin Moderation</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Explicit Role Switcher Item */}
              <DropdownMenuItem
                onClick={handleRoleSwitch}
                className="font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 cursor-pointer"
              >
                <Repeat className="w-4 h-4" />
                <span>Switch to {role === 'student' ? 'Client' : 'Student'} Mode</span>
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
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {role === 'student' ? 'Student Experience' : 'Client Experience'}
            </span>
            <Badge variant={role === 'student' ? 'orange' : 'teal'} className="text-xs">
              {role === 'student' ? 'Student Mode' : 'Client Mode'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold text-center transition-colors ${
                    isActive
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {role === 'student' && (
            <Link
              href="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <Briefcase className="w-3.5 h-3.5 text-orange-600" />
              <span>Portfolio Builder</span>
            </Link>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                handleRoleSwitch();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-300 font-bold text-sm"
            >
              <Repeat className="w-4 h-4" />
              <span>Switch to {role === 'student' ? 'Client' : 'Student'} Mode</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
