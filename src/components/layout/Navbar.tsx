import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sun,
  UserCog,
} from 'lucide-react';
import { ROLE_NAV_ITEMS } from '../../config/navigation';
import { NavPageId, NotificationItem, RoleProfile, UserRole } from '../../types/school';
import { SafeImage } from '../ui/SafeImage';

interface NavbarProps {
  role: UserRole;
  profile: RoleProfile;
  onRoleChange: (role: UserRole) => void;
  activePage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileMenu: () => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onNotificationClick: (item: NotificationItem) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenGateway: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  profile,
  onRoleChange,
  activePage,
  onSelectPage,
  collapsed,
  onToggleCollapse,
  onOpenMobileMenu,
  notifications,
  onMarkAllNotificationsRead,
  onNotificationClick,
  darkMode,
  onToggleDarkMode,
  onOpenGateway,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = ROLE_NAV_ITEMS[role];
  const currentNav = navItems.find((item) => item.id === activePage) || navItems[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return navItems.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 6);
  }, [navItems, searchQuery]);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left: Toggle + Breadcrumb */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:inline-flex dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>

        <nav className="flex min-w-0 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          <button
            type="button"
            onClick={() => onSelectPage('dashboard')}
            className="hidden truncate font-medium text-slate-500 transition-colors hover:text-indigo-600 sm:inline dark:text-slate-400 dark:hover:text-indigo-400"
          >
            {profile.panelTitle}
          </button>
          <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-400 sm:inline" />
          <span className="truncate font-display font-semibold text-slate-900 dark:text-slate-100">
            {currentNav.label}
          </span>
        </nav>
      </div>

      {/* Center/Right: Search + Theme + Notifications + Profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Search Input */}
        <div ref={searchRef} className="relative hidden md:block">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Jump to module..."
              aria-label="Jump to module"
              className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none lg:w-64 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
            />
          </div>

          {searchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 mt-1.5 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {searchResults.length === 0 ? (
                <p className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                  No matching pages in {role} portal.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {searchResults.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectPage(item.id);
                            setSearchQuery('');
                            setSearchOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${item.iconColor}`} />
                          <span className="truncate font-medium">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Theme Switch */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((prev) => !prev)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded bg-indigo-600 px-1 font-mono text-[10px] font-bold text-white tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <span className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNotificationClick(item);
                      setNotifOpen(false);
                    }}
                    className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70 ${
                      !item.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-slate-400">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.detail}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white py-1 pr-2.5 pl-1.5 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <SafeImage
              src={profile.avatar}
              alt={profile.userName}
              className="h-7 w-7 rounded-md object-cover"
            />
            <div className="hidden text-left sm:block">
              <p className="max-w-[130px] truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {profile.userName}
              </p>
              <p className="max-w-[130px] truncate text-[11px] text-slate-500 dark:text-slate-400">
                {profile.userTitle}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {profile.userName}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {profile.email}
                </p>
              </div>

              {/* Quick Switch Active Profile */}
              <div className="border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
                <p className="mb-1.5 px-1 text-[11px] font-semibold text-slate-400">
                  Switch Profile
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {(['admin', 'teacher', 'student'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        onRoleChange(r);
                        setProfileOpen(false);
                      }}
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold capitalize transition-colors ${
                        role === r
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPage('profile');
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <UserCog className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Edit Profile & Photo</span>
                </button>
                {role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPage('settings');
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span>School & System Settings</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenGateway();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Open ERP Gateway</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
